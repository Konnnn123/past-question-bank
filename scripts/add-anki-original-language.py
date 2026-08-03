#!/usr/bin/env python3
"""Create a non-destructive Anki package with verified original-language aids.

The source package is never overwritten.  The generated package adds one
"原語" field to the image-matching note type and renders it below the answer
title.  Values are populated only from src/lib/original-language-terms.ts.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sqlite3
import time
import zipfile
from pathlib import Path


FIELD_SEPARATOR = "\x1f"
TERM_LINE = re.compile(r'ja:\s*"(?P<ja>[^"]+)",\s*original:\s*"(?P<original>[^"]+)"')
ALIASES = re.compile(r'aliases:\s*\[(?P<aliases>[^\]]*)\]')
QUOTED = re.compile(r'"([^"]+)"')
TAG = re.compile(r"<[^>]+>")


def normalize(value: str) -> str:
    return re.sub(r"[\s・·.]", "", value).replace("＝", "=").strip()


def load_terms(source: Path) -> list[tuple[str, str, list[str]]]:
    terms: list[tuple[str, str, list[str]]] = []
    for line in source.read_text(encoding="utf-8").splitlines():
        match = TERM_LINE.search(line)
        if not match:
            continue
        aliases_match = ALIASES.search(line)
        aliases = QUOTED.findall(aliases_match.group("aliases")) if aliases_match else []
        terms.append((match.group("ja"), match.group("original"), aliases))
    if not terms:
        raise RuntimeError("No original-language terms found.")
    return terms


def field_text(value: str) -> str:
    return html.unescape(TAG.sub(" ", value)).replace("&nbsp;", " ").strip()


def note_originals(fields: list[str], terms: list[tuple[str, str, list[str]]]) -> str:
    # Restrict extraction to the name/style/person fields.  The long history
    # prose may contain incidental terms and would make the answer too dense.
    source_fields = [("建築", field_text(fields[1])), ("様式", field_text(fields[3])), ("人物", field_text(fields[4]))]
    candidates: list[tuple[str, str, str]] = []
    for ja, original, aliases in terms:
        for candidate in (ja, *aliases):
            if candidate:
                candidates.append((candidate, ja, original))
    candidates.sort(key=lambda item: len(item[0]), reverse=True)

    entries: list[str] = []
    seen: set[str] = set()
    for label, text in source_fields:
        for candidate, canonical, original in candidates:
            if canonical not in seen and candidate in text:
                seen.add(canonical)
                entries.append(
                    f'<div class="original-entry"><span>{label}</span>{html.escape(original)}</div>'
                )
    return "".join(entries)


def add_field(model: dict) -> None:
    fields = model["flds"]
    if any(field["name"] == "原語" for field in fields):
        return
    fields.append({
        "name": "原語", "ord": len(fields), "font": "Liberation Sans", "media": [],
        "rtl": False, "size": 20, "sticky": False,
    })
    for template in model["tmpls"]:
        marker = '<div class="title">{{建筑名称}}</div>'
        aid = '{{#原語}}<div class="original-language">{{原語}}</div>{{/原語}}'
        if aid not in template["afmt"]:
            template["afmt"] = template["afmt"].replace(marker, marker + aid)
    if ".original-language" not in model["css"]:
        model["css"] += """
\n.original-language {
    margin: -12px 0 16px;
    color: #64748b;
    font-family: Georgia, \"Times New Roman\", serif;
    font-size: 16px;
}
.original-entry { margin: 3px 0; }
.original-entry span {
    display: inline-block;
    margin-right: 7px;
    padding: 1px 6px;
    border-radius: 999px;
    background: #eef2ff;
    color: #4f46e5;
    font-family: \"Noto Sans SC\", \"Hiragino Sans\", sans-serif;
    font-size: 11px;
    font-weight: 700;
}
"""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--terms", type=Path, default=Path("src/lib/original-language-terms.ts"))
    args = parser.parse_args()
    terms = load_terms(args.terms)

    with zipfile.ZipFile(args.input) as package:
        collection = package.read("collection.anki2")
    conn = sqlite3.connect(":memory:")
    conn.deserialize(collection)
    cursor = conn.cursor()
    models = json.loads(cursor.execute("select models from col").fetchone()[0])
    target_models = {int(model_id) for model_id, model in models.items() if "建筑名称" in [field["name"] for field in model["flds"]]}

    changed = 0
    matched = 0
    note_updates: list[tuple[str, int]] = []
    for note_id, model_id, raw_fields in cursor.execute("select id, mid, flds from notes"):
        if model_id not in target_models:
            continue
        fields = raw_fields.split(FIELD_SEPARATOR)
        original = note_originals(fields, terms)
        if original:
            matched += 1
        fields.append(original)
        note_updates.append((FIELD_SEPARATOR.join(fields), note_id))
        changed += 1

    print(f"Terms loaded: {len(terms)}")
    print(f"Notes updated: {changed}; notes with verified original-language aids: {matched}")
    if args.dry_run:
        return

    now = int(time.time())
    for model in models.values():
        if int(model["id"]) in target_models:
            add_field(model)
            model["mod"] = now
            model["usn"] = -1
    cursor.executemany("update notes set flds = ?, mod = ?, usn = -1 where id = ?", [(fields, now, note_id) for fields, note_id in note_updates])
    cursor.execute("update col set models = ?, mod = ?", (json.dumps(models, ensure_ascii=False, separators=(",", ":")), now))
    conn.commit()
    updated_collection = conn.serialize()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(args.input) as source, zipfile.ZipFile(args.output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as output:
        for item in source.infolist():
            if item.filename == "collection.anki2":
                output.writestr(item, updated_collection)
            else:
                output.writestr(item, source.read(item.filename))
    print(f"Created: {args.output}")


if __name__ == "__main__":
    main()
