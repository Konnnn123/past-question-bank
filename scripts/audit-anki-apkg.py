"""Read-only audit/export for the architecture-history Anki package.

Usage:
  python scripts/audit-anki-apkg.py path/to/deck.apkg --out data/anki-import

The script does not modify the apkg. It exports note text and media references,
but never copies the large media payload. The exported JSON is an import staging
area, not the canonical architecture database.
"""

from __future__ import annotations

import argparse
import collections
import html
import json
import re
import sqlite3
import zipfile
from pathlib import Path


# Field name maps per Anki model (detected by field count + deck name pattern)
FIELD_NAME_MAPS = {
    # History model (old): 6 fields
    6: ["image", "buildingName", "period", "style", "people", "history"],
    # History model (enhanced): 8 fields — image, buildingName, originalName, period, style, people, history, pastExam
    "history-8": ["image", "buildingName", "originalName", "period", "style", "people", "history", "pastExam"],
    # Construction model: 8 fields
    "construction-8": ["knowledgePoint", "category", "frontHtml", "backHtml", "examForm", "pastQuestion", "sourceUrl", "originalTags"],
}
DEFAULT_FIELD_NAMES = ["image", "buildingName", "period", "style", "people", "history"]

def resolve_field_names(field_count: int, deck_name: str) -> list[str]:
    """Determine field name map from field count and deck name."""
    if field_count == 6:
        return FIELD_NAME_MAPS[6]
    if field_count == 8:
        if "東大建筑史" in deck_name or "建筑史" in deck_name:
            return FIELD_NAME_MAPS["history-8"]
        return FIELD_NAME_MAPS["construction-8"]
    # Fallback for unknown field counts
    return [f"field_{i}" for i in range(field_count)]
TAG_RE = re.compile(r"<[^>]*>")
IMG_RE = re.compile(r"(?:src|href)=[\"']([^\"']+)[\"']", re.I)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(TAG_RE.sub(" ", value))).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("apkg", type=Path)
    parser.add_argument("--out", type=Path, default=Path("data/anki-import"))
    args = parser.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.apkg) as package:
        collection = package.read("collection.anki2")
        media_map = json.loads(package.read("media").decode("utf-8"))

    db_path = args.out / ".collection.anki2.tmp"
    db_path.write_bytes(collection)
    try:
        db = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True)
        decks = json.loads(db.execute("SELECT decks FROM col").fetchone()[0])
        records = []
        deck_counts = collections.Counter()
        name_counts = collections.Counter()

        query = """
          SELECT n.id, n.tags, n.flds, c.did
          FROM notes n JOIN cards c ON c.nid = n.id
          ORDER BY n.id
        """
        for note_id, raw_tags, raw_fields, deck_id in db.execute(query):
            raw_field_list = raw_fields.split("\x1f")
            field_count = len(raw_field_list)
            # Get deck name early for field resolution
            deck_name_early = decks.get(str(deck_id), decks.get(deck_id, {})).get("name", "")
            field_names = resolve_field_names(field_count, deck_name_early)
            # Pad to match field name count
            raw_field_list += [""] * (len(field_names) - len(raw_field_list))

            # name: buildingName for history, knowledgePoint for construction
            if "buildingName" in field_names:
                bm_idx = field_names.index("buildingName")
                name = clean(raw_field_list[bm_idx])
            elif "knowledgePoint" in field_names:
                kp_idx = field_names.index("knowledgePoint")
                name = clean(raw_field_list[kp_idx])
            else:
                name = clean(raw_field_list[1]) if len(raw_field_list) > 1 else ""

            media_refs = IMG_RE.findall(raw_field_list[0])
            tags = raw_tags.strip().split()
            deck_name = decks.get(str(deck_id), decks.get(deck_id, {})).get("name", "")

            # Build fields dict: strip for "image" field, clean for others
            raw_fields_dict = {}
            for key, value in zip(field_names, raw_field_list):
                if key == "image":
                    raw_fields_dict[key] = value.strip()
                else:
                    raw_fields_dict[key] = clean(value)

            record = {
                "source": {"kind": "anki", "noteId": str(note_id), "deck": deck_name},
                "name": name,
                "fields": raw_fields_dict,
                "tags": tags,
                "mediaRefs": media_refs,
                "reviewStatus": "imported",
                "qualityFlags": [],
            }
            if not name:
                record["qualityFlags"].append("missing-name")
            if not media_refs:
                record["qualityFlags"].append("missing-image-reference")
            if "要確認" in " ".join(raw_field_list):
                record["qualityFlags"].append("source-needs-review")
            records.append(record)
            deck_counts[deck_name] += 1
            name_counts[name] += 1

        for record in records:
            if name_counts[record["name"]] > 1:
                record["qualityFlags"].append("duplicate-name")

        payload = {
            "sourceFile": str(args.apkg),
            "noteCount": len(records),
            "mediaCount": len(media_map),
            "deckCounts": dict(deck_counts),
            "duplicateNames": {
                name: count for name, count in name_counts.items() if name and count > 1
            },
            "records": records,
        }
        (args.out / "anki-notes.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        report = [
            "# Anki 建筑史导入审计",
            "",
            f"- 笔记：{len(records)}",
            f"- 媒体映射：{len(media_map)}（未复制媒体文件）",
            "",
            "## 牌组分布",
            "",
        ]
        report.extend(f"- {name}: {count}" for name, count in deck_counts.items())
        report += ["", "## 重复名称", ""]
        report.extend(f"- {name}: {count}" for name, count in payload["duplicateNames"].items())
        flagged = collections.Counter(
            flag for record in records for flag in record["qualityFlags"]
        )
        report += ["", "## 质量标记", ""]
        report.extend(f"- {flag}: {count}" for flag, count in flagged.items())
        (args.out / "audit-report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    finally:
        db.close()
        db_path.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
