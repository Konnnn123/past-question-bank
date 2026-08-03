"""Patch construction apkg: update CardType field from category mapping.

Usage: python patch-apkg.py
Input:  ../structure card/建築構法図鑑.apkg
Output: ../structure card/建築構法図鑑_修正版.apkg
Mapping: .codex-tmp/category-patch.json
"""

import json
import os
import shutil
import sqlite3
import tempfile
import zipfile
from pathlib import Path

APKG_IN = Path("../structure card/建築構法図鑑.apkg")
APKG_OUT = Path("../structure card/建築構法図鑑_修正版.apkg")
MAPPING_FILE = Path(".codex-tmp/category-patch.json")

FIELD_SEP = "\x1f"


def main():
    with open(MAPPING_FILE, "r", encoding="utf-8") as f:
        category_map = json.load(f)

    print(f"加载分类映射: {len(category_map)} 条")

    # Extract apkg to temp dir
    tmpdir = tempfile.mkdtemp(prefix="anki_patch_")
    try:
        with zipfile.ZipFile(APKG_IN, "r") as zf:
            zf.extractall(tmpdir)

        db_path = os.path.join(tmpdir, "collection.anki2")
        if not os.path.exists(db_path):
            # Some apkg have differently named db
            for fname in os.listdir(tmpdir):
                if fname.endswith(".anki2"):
                    db_path = os.path.join(tmpdir, fname)
                    break

        # Patch sqlite
        db = sqlite3.connect(db_path)
        db.row_factory = sqlite3.Row

        notes = db.execute(
            "SELECT id, flds FROM notes"
        ).fetchall()

        updated = 0
        skipped = 0

        for row in notes:
            note_id = str(row["id"])
            if note_id not in category_map:
                skipped += 1
                continue

            fields = row["flds"].split(FIELD_SEP)
            if len(fields) < 2:
                skipped += 1
                continue

            old_card_type = fields[1]
            new_card_type = category_map[note_id]

            if old_card_type == new_card_type:
                skipped += 1
                continue

            fields[1] = new_card_type
            new_flds = FIELD_SEP.join(fields)

            db.execute("UPDATE notes SET flds = ? WHERE id = ?", (new_flds, row["id"]))
            updated += 1

        db.commit()
        db.close()

        print(f"更新: {updated} 条, 跳过(未变更/未匹配): {skipped} 条")

        # Validate
        db2 = sqlite3.connect(db_path)
        db2.row_factory = sqlite3.Row
        check = db2.execute("SELECT id, flds FROM notes").fetchall()
        categories = {}
        for row in check:
            fields = row["flds"].split(FIELD_SEP)
            cat = fields[1] if len(fields) > 1 else "空"
            categories[cat] = categories.get(cat, 0) + 1
        db2.close()

        print(f"\n最终分类分布:")
        for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
            print(f"  {cat}: {count}")

        # Repack
        with zipfile.ZipFile(APKG_OUT, "w", zipfile.ZIP_DEFLATED) as zf_out:
            for root, dirs, files in os.walk(tmpdir):
                for fname in files:
                    full = os.path.join(root, fname)
                    arcname = os.path.relpath(full, tmpdir)
                    zf_out.write(full, arcname)

        print(f"\n✅ 输出: {APKG_OUT}")
        print("可直接导入 Anki。原文件未修改。")

    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


if __name__ == "__main__":
    main()
