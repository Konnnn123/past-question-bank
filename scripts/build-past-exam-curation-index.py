from __future__ import annotations

import json
import re
from pathlib import Path


def frontmatter(text: str, key: str) -> str:
    match = re.search(rf"^{re.escape(key)}:\s*[\"']?([^\"'\n]+)", text, re.M)
    return match.group(1).strip() if match else ""


def tags(text: str) -> list[str]:
    head = text.split("---", 2)
    if len(head) < 3:
        return []
    return re.findall(r'^\s+-\s+["\']([^"\']+)["\']', head[1], re.M)


def candidate_lines(text: str) -> list[str]:
    body = text.split("---", 2)[-1]
    selected = []
    for raw in body.splitlines():
        line = raw.strip()
        if not line or line.startswith("![") or line.startswith("出典"):
            continue
        if (
            re.match(r"^(?:[（(]?[0-9一二三四五六七八九十]+[）).．、]|[A-Za-z][.．、]|[①-㉚])", line)
            or "語群" in line
            or len(re.findall(r"[ァ-ヶ一-龯々]{2,}", line)) >= 3
        ):
            selected.append(line)
    return selected


def main() -> None:
    rows = []
    for file in Path("data/processed_questions").glob("*.md"):
        if "建筑史" not in file.name and "建築史" not in file.name:
            continue
        text = file.read_text(encoding="utf-8")
        rows.append({
            "fileName": file.name,
            "year": int(frontmatter(text, "year") or 0),
            "category": frontmatter(text, "category"),
            "questionNumber": frontmatter(text, "question_number"),
            "tags": tags(text),
            "candidateLines": candidate_lines(text),
            "curationStatus": "unreviewed",
        })
    rows.sort(key=lambda row: (row["year"], row["category"], row["questionNumber"]))
    Path("data/past-exam-curation-index.json").write_text(json.dumps({"version": 1, "questions": rows}, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["# 建筑史过去问人工整理索引", "", "本文件是逐题语义整理的来源索引，不是缺口清单。", ""]
    for row in rows:
        lines += [f"## {row['year']} {row['category']} Q{row['questionNumber']}", "", f"来源：`{row['fileName']}`", "", f"标签：{'、'.join(row['tags']) or '—'}", ""]
        lines.extend(f"- {line}" for line in row["candidateLines"])
        lines.append("")
    Path("data/past-exam-curation-index.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
