from __future__ import annotations

import json
from pathlib import Path


AMBIGUOUS = {"フランツ・ヨーゼフ", "文化財制度", "奈良六大寺", "密教本堂", "寺内町", "今井町", "宿場町", "イスタンブール"}


def main() -> None:
    source = json.loads(Path("data/all-past-exam-gap-entities.json").read_text(encoding="utf-8"))
    automatic = []
    review = []
    for row in source["rows"]:
        target = review if row["term"] in AMBIGUOUS else automatic
        target.append(row)
    lines = [
        "# 全量过去问缺口审核队列",
        "",
        "自动处理区可以直接建立候选卡；审核区需要确认实体边界或分类。无需逐条确认，后续可按批次处理。",
        "",
        "## 可自动建立候选卡",
        "",
        "| 候选 | 分类 | 次数 |",
        "|---|---|---:|",
    ]
    lines.extend(f"| {r['term']} | {r['entityKind']} | {r['examCount']} |" for r in automatic)
    lines += ["", "## 需要批量审核", "", "| 候选 | 当前分类 | 次数 | 审核原因 |", "|---|---|---:|---|"]
    lines.extend(f"| {r['term']} | {r['entityKind']} | {r['examCount']} | 可能是建筑群、制度、地点或人物，需确认实体边界 |" for r in review)
    Path("data/all-past-exam-review-queue.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
