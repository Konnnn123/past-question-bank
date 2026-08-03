#!/usr/bin/env python3
"""Create an independent all-content Anki package from the Notion export deck."""
from __future__ import annotations

import argparse, copy, hashlib, json, sqlite3, tempfile, time, zipfile
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        with zipfile.ZipFile(args.source) as package:
            package.extractall(root)
        db = sqlite3.connect(root / "collection.anki2")
        try:
            models_json, decks_json = db.execute("select models, decks from col").fetchone()
            models, decks = json.loads(models_json), json.loads(decks_json)
            old_id, model = next(iter(models.items()))
            now_ms, now_secs = int(time.time() * 1000), int(time.time())
            new_mid, new_did = now_ms + 301, now_ms + 302
            cloned = copy.deepcopy(model)
            cloned["id"], cloned["name"], cloned["mod"] = new_mid, "建築構法｜Notion全量 (Notion→Anki)", now_secs
            models = {str(new_mid): cloned}
            decks = {str(new_did): {"id": new_did, "name": "建築構法::Notion全量", "mod": now_secs, "usn": -1,
                "desc": "Notion 建築構法页面全量转换：图片、简介、标签、考试形式与过去问关联。", "dyn": 0,
                "collapsed": False, "browserCollapsed": False, "newToday": [0,0], "revToday": [0,0], "lrnToday": [0,0], "timeToday": [0,0], "conf": 1, "extendNew": 0, "extendRev": 0}}
            # Anki identifies imported notes/cards by their numeric IDs.  Give
            # this independent package fresh IDs so it can coexist with the
            # source deck instead of being treated as a conflicting update.
            note_ids = [row[0] for row in db.execute("select id from notes order by id")]
            note_map = {old: now_ms + 10_000 + index for index, old in enumerate(note_ids)}
            for index, (old, new) in enumerate(note_map.items()):
                guid = hashlib.sha1(f"construction-notion-full:{old}:{index}".encode()).hexdigest()[:10]
                db.execute("update notes set id = ?, guid = ?, mid = ?, mod = ?, usn = -1 where id = ?", (new, guid, new_mid, now_ms, old))
            card_ids = [row[0] for row in db.execute("select id from cards order by id")]
            for index, old in enumerate(card_ids):
                new = now_ms + 1_000_000 + index
                # Note IDs were already rewritten, so recover the original
                # note key from the deterministic mapping.
                current_nid = db.execute("select nid from cards where id = ?", (old,)).fetchone()[0]
                db.execute("update cards set id = ?, nid = ?, did = ?, mod = ?, usn = -1, queue = 0, type = 0, due = ? where id = ?", (new, note_map.get(current_nid, current_nid), new_did, now_ms, index + 1, old))
            db.execute("delete from revlog")
            db.execute("delete from graves")
            db.execute("update col set mod = ?, scm = ?, models = ?, decks = ?", (now_ms, now_ms, json.dumps(models, ensure_ascii=False), json.dumps(decks, ensure_ascii=False)))
            db.commit()
            count = db.execute("select count(*) from notes").fetchone()[0]
        finally:
            db.close()
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(args.output, "w", zipfile.ZIP_DEFLATED) as package:
            for file in root.iterdir(): package.write(file, file.name)
    print(f"Created {args.output} with {count} Notion content cards.")

if __name__ == "__main__": main()
