#!/usr/bin/env python3
"""Add verified original-language aids to the existing Anki collection.

For Anki 25's normalized collection schema.  This targets the live image
matching note type, keeps all note/card IDs and scheduling fields unchanged,
and makes a timestamped database backup before changing anything.
"""

from __future__ import annotations

import argparse
import html
import re
import shutil
import sqlite3
import time
from pathlib import Path


SEP = "\x1f"
TERM_LINE = re.compile(r'ja:\s*"(?P<ja>[^"]+)",\s*original:\s*"(?P<original>[^"]+)"')
ALIASES = re.compile(r'aliases:\s*\[(?P<aliases>[^\]]*)\]')
QUOTED = re.compile(r'"([^"]+)"')
TAG = re.compile(r"<[^>]+>")


def terms_from(path: Path) -> list[tuple[str, str, list[str]]]:
    terms = []
    for line in path.read_text(encoding="utf-8").splitlines():
        match = TERM_LINE.search(line)
        if match:
            aliases = ALIASES.search(line)
            terms.append((match.group("ja"), match.group("original"), QUOTED.findall(aliases.group("aliases")) if aliases else []))
    if not terms:
        raise RuntimeError("No verified terms found.")
    return terms


def plain(value: str) -> str:
    return html.unescape(TAG.sub(" ", value)).replace("&nbsp;", " ")


def originals(fields: list[str], terms: list[tuple[str, str, list[str]]]) -> str:
    candidates = []
    for ja, original, aliases in terms:
        for spelling in [ja, *aliases]:
            if spelling:
                candidates.append((spelling, ja, original))
    candidates.sort(key=lambda item: len(item[0]), reverse=True)
    result, seen = [], set()
    # Only these compact fields are used: prose in 簡史 would turn the card
    # into a glossary and make image recall harder.
    for label, value in [("建築", plain(fields[1])), ("様式", plain(fields[3])), ("人物", plain(fields[4]))]:
        occupied: list[tuple[int, int]] = []
        for spelling, canonical, original in candidates:
            start = value.find(spelling)
            end = start + len(spelling)
            overlaps = any(start < used_end and end > used_start for used_start, used_end in occupied)
            if canonical not in seen and start >= 0 and not overlaps:
                seen.add(canonical)
                occupied.append((start, end))
                result.append(f'<div><span style="display:inline-block;margin-right:6px;padding:1px 6px;border-radius:999px;background:#eef2ff;color:#4f46e5;font-family:sans-serif;font-size:11px;font-weight:700;">{label}</span>{html.escape(original)}</div>')
    return "".join(result)


def read_varint(data: bytes, position: int) -> tuple[int, int]:
    value, shift = 0, 0
    while True:
        byte = data[position]
        position += 1
        value |= (byte & 0x7F) << shift
        if not byte & 0x80:
            return value, position
        shift += 7


def write_varint(value: int) -> bytes:
    output = bytearray()
    while value > 0x7F:
        output.append((value & 0x7F) | 0x80)
        value >>= 7
    output.append(value)
    return bytes(output)


def template_parts(config: bytes) -> tuple[str, str]:
    position, values = 0, {}
    while position < len(config):
        key, position = read_varint(config, position)
        if key & 7 != 2:
            raise RuntimeError("Unexpected template config wire type.")
        size, position = read_varint(config, position)
        values[key >> 3] = config[position:position + size]
        position += size
    return values[1].decode("utf-8"), values[2].decode("utf-8")


def make_template_config(question: str, answer: str) -> bytes:
    q = question.encode("utf-8")
    a = answer.encode("utf-8")
    return b"\x0a" + write_varint(len(q)) + q + b"\x12" + write_varint(len(a)) + a


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("collection", type=Path)
    parser.add_argument("--terms", type=Path, default=Path("src/lib/original-language-terms.ts"))
    parser.add_argument("--note-type", default="建筑史图片配对 (Notion→Anki)")
    args = parser.parse_args()
    terms = terms_from(args.terms)

    conn = sqlite3.connect(args.collection)
    # Anki's collection schema uses this collation on note-type and field
    # names.  Register the compatible behavior before inserts hit uniqueness
    # constraints backed by those columns.
    conn.create_collation("unicase", lambda left, right: (left.casefold() > right.casefold()) - (left.casefold() < right.casefold()))
    cur = conn.cursor()
    # Desktop Anki registers its own "unicase" SQLite collation.  A standalone
    # maintenance script does not have that registration, so force SQLite's
    # built-in binary collation for this exact, known note-type name.
    row = cur.execute("select id from notetypes where name collate binary = ?", (args.note_type,)).fetchone()
    if not row:
        raise RuntimeError(f"Note type not found: {args.note_type}")
    ntid = row[0]
    fields = cur.execute("select ord, name, config from fields where ntid = ? order by ord", (ntid,)).fetchall()
    original_field = next(((ord_, config) for ord_, name, config in fields if name == "原語"), None)
    if [name for _, name, _ in fields[:6]] != ["图片", "建筑名称", "朝代", "风格", "相关人物", "简史"]:
        raise RuntimeError("Unexpected field layout; no changes made.")

    notes = cur.execute("select id, flds from notes where mid = ?", (ntid,)).fetchall()
    if not notes:
        raise RuntimeError("No notes found for the selected note type.")
    updates = []
    matched = 0
    for note_id, raw in notes:
        note_fields = raw.split(SEP)
        value = originals(note_fields, terms)
        matched += bool(value)
        if original_field:
            original_ord = original_field[0]
            note_fields[original_ord] = value
            updates.append((SEP.join(note_fields), note_id))
        else:
            updates.append((SEP.join([*note_fields, value]), note_id))

    print(f"Target notes: {len(notes)}; verified original-language aids: {matched}")
    backup = args.collection.with_name(f"{args.collection.name}.before-original-language-{time.strftime('%Y%m%d-%H%M%S')}.bak")
    shutil.copy2(args.collection, backup)
    print(f"Backup: {backup}")

    now_ms = int(time.time() * 1000)
    now_secs = int(time.time())
    # Clone a normal text field config, so Anki retains its own font/media
    # defaults without depending on a hard-coded protobuf format.
    if not original_field:
        cur.execute("insert into fields (ntid, ord, name, config) values (?, ?, ?, ?)", (ntid, len(fields), "原語", fields[1][2]))
        for ord_, name, config in cur.execute("select ord, name, config from templates where ntid = ?", (ntid,)).fetchall():
            qfmt, afmt = template_parts(config)
            aid = '{{#原語}}<div style="margin:-12px 0 16px;color:#64748b;font-family:Georgia,serif;font-size:16px;">{{原語}}</div>{{/原語}}'
            marker = '<div class="title">{{建筑名称}}</div>'
            if aid not in afmt:
                if marker not in afmt:
                    raise RuntimeError(f"Expected title marker missing in template {name}; no changes committed.")
                afmt = afmt.replace(marker, marker + aid)
            cur.execute("update templates set mtime_secs = ?, usn = -1, config = ? where ntid = ? and ord = ?", (now_secs, make_template_config(qfmt, afmt), ntid, ord_))
    cur.executemany("update notes set flds = ?, mod = ?, usn = -1 where id = ?", [(value, now_ms, note_id) for value, note_id in updates])
    cur.execute("update notetypes set mtime_secs = ?, usn = -1 where id = ?", (now_secs, ntid))
    cur.execute("update col set mod = ?, scm = ?", (now_ms, now_ms))
    conn.commit()
    conn.close()
    print("Live collection updated successfully.")


if __name__ == "__main__":
    main()
