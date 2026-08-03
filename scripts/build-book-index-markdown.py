from __future__ import annotations

import json
import re
from pathlib import Path


SOURCE = Path("data/book-index-windows-ocr.json")
OUT = Path("data/book-index.md")


def compact(text: str) -> str:
    text = text.replace("一", "ー")
    return re.sub(r"\s+", "", text).strip("_—―- ")


def bbox(line: dict) -> tuple[float, float, float, float]:
    words = line.get("words", [])
    return (
        min(w["x"] for w in words),
        min(w["y"] for w in words),
        max(w["x"] + w["width"] for w in words),
        max(w["y"] + w["height"] for w in words),
    )


def main() -> None:
    pages = json.loads(SOURCE.read_text(encoding="utf-8"))
    out = [
        "# 书本索引 OCR 转录",
        "",
        "> 来源：用户提供的索引照片（书页 394–412）。使用 Windows 日语 OCR 自动转录；已去除字符间空格，并按同一基线匹配词条与正文页码。低置信或跨行词条仍应回看原图。",
        "",
    ]
    total = 0
    for photo_no, page in enumerate(pages, start=394):
        parsed = []
        for line in page["lines"]:
            if not line.get("words"):
                continue
            x1, y1, x2, y2 = bbox(line)
            parsed.append({"text": compact(line["text"]), "x1": x1, "y": (y1 + y2) / 2, "x2": x2})
        nums = [p for p in parsed if re.fullmatch(r"\d{1,3}(?:[,.]\d{1,3})*", p["text"])]
        names = [p for p in parsed if p not in nums and p["text"] not in {"[索引]", "索引"} and not re.fullmatch(r"\[.*\]", p["text"])]
        rows = []
        used = set()
        for name in names:
            candidates = []
            for idx, num in enumerate(nums):
                if idx in used or num["x1"] <= name["x1"]:
                    continue
                # Keep pairing within the same printed column.
                if name["x1"] < 540 <= num["x1"]:
                    continue
                candidates.append((abs(num["y"] - name["y"]), idx, num))
            if not candidates:
                continue
            delta, idx, num = min(candidates)
            if delta > 13:
                continue
            used.add(idx)
            rows.append((name["y"], name["x1"], name["text"], num["text"].replace(".", ",")))
        rows.sort(key=lambda r: (0 if r[1] < 540 else 1, r[0]))
        total += len(rows)
        out += [f"## 索引页 {photo_no}", "", "| 词条（日文） | 正文页 |", "|---|---:|"]
        out += [f"| {name.replace('|', '\\|')} | {pagestr} |" for _, _, name, pagestr in rows]
        out.append("")
    out.insert(4, f"> 自动配对词条总数：{total}。\n")
    OUT.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {OUT} with {total} rows")


if __name__ == "__main__":
    main()
