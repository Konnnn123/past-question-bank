#!/usr/bin/env python3
"""Create an image-first Anki deck from the existing construction package.

The source package is never modified.  Notes without an image are omitted: a
visual-recognition prompt without a visual would be misleading.
"""

from __future__ import annotations

import argparse
import hashlib
import copy
import html
import json
import re
import shutil
import sqlite3
import tempfile
import time
import zipfile
from pathlib import Path


SEP = "\x1f"
IMAGE = re.compile(r"<img\b[^>]*\bsrc=[\"'][^\"']+[\"']", re.I)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Existing 建築構法図鑑 .apkg")
    parser.add_argument("output", type=Path, help="New image-recognition .apkg")
    parser.add_argument("--extra-media", type=Path, help="Downloaded Notion images named notion_<page-id>_<n>.*")
    args = parser.parse_args()

    with tempfile.TemporaryDirectory() as temp_dir:
        temp = Path(temp_dir)
        with zipfile.ZipFile(args.source) as package:
            package.extractall(temp)

        media_file = temp / "media"
        media_map = json.loads(media_file.read_text(encoding="utf-8"))

        collection = temp / "collection.anki2"
        db = sqlite3.connect(collection)
        try:
            col = db.execute("select models, decks from col").fetchone()
            models, decks = json.loads(col[0]), json.loads(col[1])
            old_mid, old_model = next(iter(models.items()))
            old_mid_int = int(old_mid)

            source_rows = list(db.execute("select id, flds from notes"))
            extra_by_page: dict[str, list[Path]] = {}
            if args.extra_media and args.extra_media.exists():
                for image in args.extra_media.glob("notion_*_*"):
                    match = re.match(r"notion_([0-9a-f]{32})_", image.name, re.I)
                    if match:
                        extra_by_page.setdefault(match.group(1).lower(), []).append(image)

            for note_id, raw_fields in source_rows:
                fields = raw_fields.split(SEP)
                page_id = fields[6].rsplit("/", 1)[-1].replace("-", "").lower() if len(fields) > 6 else ""
                additions = sorted(extra_by_page.get(page_id, []))
                if additions and len(fields) > 2:
                    refs = "".join(f'\\n<img src="{html.escape(image.name)}" alt="Notion image">' for image in additions)
                    fields[2] += f'\\n<div class="card-images">{refs}\\n</div>'
                    db.execute("update notes set flds = ? where id = ?", (SEP.join(fields), note_id))
                    for image in additions:
                        shutil.copy2(image, temp / image.name)
                        if image.name not in media_map.values():
                            next_id = str(max((int(key) for key in media_map), default=-1) + 1)
                            media_map[next_id] = image.name

            image_note_ids = [
                note_id
                for note_id, fields in db.execute("select id, flds from notes")
                if len(fields.split(SEP)) > 2 and IMAGE.search(fields.split(SEP)[2])
            ]
            if not image_note_ids:
                raise RuntimeError("The source package contains no image notes.")

            now_ms = int(time.time() * 1000)
            now_secs = int(time.time())
            new_mid = now_ms + 101
            new_did = now_ms + 102
            model = copy.deepcopy(old_model)
            model["id"] = new_mid
            model["name"] = "建築構法｜識図記憶 (Notion→Anki)"
            model["mod"] = now_secs
            for template in model["tmpls"]:
                template["qfmt"] = (
                    '<div class="visual-prompt">{{Front}}</div>'
                    '<div class="visual-hint">画像を見て名称を答える</div>'
                )
                template["afmt"] = (
                    '{{FrontSide}}<hr id="answer">'
                    '<div class="visual-answer">{{Title}}</div>{{Back}}'
                )
            model["css"] += """
\n.visual-prompt .card-title, .visual-prompt .card-tags { display: none; }
\n.visual-prompt .card-images { margin: 8px 0; }
\n.visual-prompt .card-images img { max-width: 100%; max-height: 560px; object-fit: contain; }
\n.visual-hint { color: #64748b; font-size: 13px; margin-top: 12px; }
\n.visual-answer { font-size: 25px; font-weight: 700; margin: 12px 0; color: #1d4ed8; }
"""
            models = {str(new_mid): model}

            deck_name = "建築構法::識図記憶"
            decks = {
                str(new_did): {
                    "id": new_did,
                    "name": deck_name,
                    "mod": now_secs,
                    "usn": -1,
                    "desc": "Notion 卡片图片识别：正面只显示图片，背面显示名称与原始说明。",
                    "dyn": 0,
                    "collapsed": False,
                    "browserCollapsed": False,
                    "newToday": [0, 0],
                    "revToday": [0, 0],
                    "lrnToday": [0, 0],
                    "timeToday": [0, 0],
                    "conf": 1,
                    "extendNew": 0,
                    "extendRev": 0,
                }
            }

            placeholders = ",".join("?" for _ in image_note_ids)
            db.execute(f"delete from cards where nid not in ({placeholders})", image_note_ids)
            db.execute(f"delete from notes where id not in ({placeholders})", image_note_ids)
            db.execute("delete from revlog")
            db.execute("delete from graves")
            note_ids = [row[0] for row in db.execute("select id from notes order by id")]
            note_map = {old: now_ms + 10_000 + index for index, old in enumerate(note_ids)}
            for index, (old, new) in enumerate(note_map.items()):
                guid = hashlib.sha1(f"construction-visual:{old}:{index}".encode()).hexdigest()[:10]
                db.execute("update notes set id = ?, guid = ?, mid = ?, mod = ?, usn = -1 where id = ?", (new, guid, new_mid, now_ms, old))
            card_ids = [row[0] for row in db.execute("select id from cards order by id")]
            for index, old in enumerate(card_ids):
                nid = db.execute("select nid from cards where id = ?", (old,)).fetchone()[0]
                db.execute("update cards set id = ?, nid = ?, did = ?, mod = ?, usn = -1, queue = 0, type = 0, due = ? where id = ?", (now_ms + 1_000_000 + index, note_map.get(nid, nid), new_did, now_ms, index + 1, old))
            db.execute(
                "update col set mod = ?, scm = ?, models = ?, decks = ?",
                (now_ms, now_ms, json.dumps(models, ensure_ascii=False), json.dumps(decks, ensure_ascii=False)),
            )
            db.commit()
        finally:
            db.close()

        media_file.write_text(json.dumps(media_map, ensure_ascii=False), encoding="utf-8")

        args.output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(args.output, "w", zipfile.ZIP_DEFLATED) as package:
            for file in temp.iterdir():
                package.write(file, file.name)
    print(f"Created {args.output} with {len(image_note_ids)} image-recognition cards.")


if __name__ == "__main__":
    main()
