"""Extract construction-card media and build a note-to-image map.

The source APKG remains untouched. Images referenced by any Anki field are
copied into the public directory and associated with their original note IDs.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sqlite3
import tempfile
import urllib.parse
import zipfile
from pathlib import Path


MEDIA_RE = re.compile(r"(?:src|href)=[\"']([^\"']+)[\"']", re.I)


def normalized_reference(value: str) -> str:
    decoded = urllib.parse.unquote(html.unescape(value)).replace("\\", "/")
    return decoded.rsplit("/", 1)[-1].strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("apkg", type=Path)
    parser.add_argument("--media-out", type=Path, default=Path("public/construction-images"))
    parser.add_argument("--map-out", type=Path, default=Path("data/construction-card-image-map.json"))
    args = parser.parse_args()

    args.media_out.mkdir(parents=True, exist_ok=True)
    args.map_out.parent.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(args.apkg) as package:
        media_map = json.loads(package.read("media").decode("utf-8"))
        archive_member_by_name = {name: member for member, name in media_map.items()}
        collection = package.read("collection.anki2")

        descriptor, database_name = tempfile.mkstemp(suffix=".anki2")
        try:
            with os.fdopen(descriptor, "wb") as database_file:
                database_file.write(collection)
            database = sqlite3.connect(f"file:{database_name}?mode=ro", uri=True)
            try:
                models = json.loads(database.execute("SELECT models FROM col").fetchone()[0])
                rows = database.execute("SELECT id, mid, flds FROM notes ORDER BY id").fetchall()
            finally:
                database.close()
        finally:
            Path(database_name).unlink(missing_ok=True)

        notes: dict[str, list[str]] = {}
        notes_by_source_url: dict[str, list[str]] = {}
        notes_by_title: dict[str, list[str]] = {}
        missing: list[dict[str, str]] = []
        extracted: set[str] = set()

        for note_id, model_id, raw_fields in rows:
            field_names = [field.get("name", "") for field in models.get(str(model_id), {}).get("flds", [])]
            fields = raw_fields.split("\x1f")
            values = {name: fields[index] for index, name in enumerate(field_names) if index < len(fields)}
            output_files: list[str] = []
            for reference in MEDIA_RE.findall(raw_fields):
                original_name = normalized_reference(reference)
                archive_member = archive_member_by_name.get(original_name)
                if archive_member is None:
                    missing.append({"noteId": str(note_id), "reference": original_name})
                    continue
                target = args.media_out / original_name
                if original_name not in extracted:
                    target.write_bytes(package.read(archive_member))
                    extracted.add(original_name)
                if original_name not in output_files:
                    output_files.append(original_name)
            if output_files:
                notes[str(note_id)] = output_files
                source_url = values.get("SourceURL", "").strip()
                title = re.sub(r"<[^>]+>", " ", values.get("Title", ""))
                title = re.sub(r"\s+", " ", html.unescape(title)).strip()
                if source_url:
                    notes_by_source_url[source_url] = output_files
                if title:
                    notes_by_title[title] = output_files

    payload = {
        "sourceFile": str(args.apkg),
        "noteCount": len(rows),
        "notesWithImages": len(notes),
        "imageCount": len(extracted),
        "notes": notes,
        "notesBySourceUrl": notes_by_source_url,
        "notesByTitle": notes_by_title,
        "missingReferences": missing,
    }
    args.map_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: payload[key] for key in ("noteCount", "notesWithImages", "imageCount")}, ensure_ascii=False))
    if missing:
        raise SystemExit(f"Missing {len(missing)} media references; see {args.map_out}")


if __name__ == "__main__":
    main()
