from __future__ import annotations

import json
from pathlib import Path


ENTITY_KINDS = {"building", "person", "style-or-movement", "theory-or-institution", "period-or-place"}


def main() -> None:
    candidates = json.loads(Path("data/all-past-exam-term-candidates.json").read_text(encoding="utf-8"))
    aliases = json.loads(Path("data/past-exam-coverage-aliases.json").read_text(encoding="utf-8"))
    classified_path = Path("data/all-past-exam-gap-entities.json")
    classified = json.loads(classified_path.read_text(encoding="utf-8")) if classified_path.exists() else {"rows": []}
    kind_by_term = {row["term"]: row["entityKind"] for row in classified["rows"]}

    rows = []
    for row in candidates["rows"]:
        term = row["term"]
        if row["inAnkiExact"]:
            coverage = "exact"
            matched = term
        elif term in aliases:
            coverage = "alias"
            matched = aliases[term]
        else:
            coverage = "missing"
            matched = ""
        kind = kind_by_term.get(term, "unclassified")
        if coverage == "missing" and kind == "unclassified" and row["examCount"] < 2:
            continue
        rows.append({
            "termJa": term,
            "entityKind": kind,
            "coverage": coverage,
            "matchedDatabaseName": matched,
            "examCountLowerBound": row["examCount"],
            "examFileCount": row["fileCount"],
            "examFiles": row["examFiles"],
            "status": "confirmed" if coverage in {"exact", "alias"} else "unreviewed",
            "suggestedAction": "none" if coverage == "exact" else "add-alias" if coverage == "alias" else "review-and-add",
        })
    rows.sort(key=lambda item: ({"missing": 0, "alias": 1, "exact": 2}[item["coverage"]], -item["examCountLowerBound"], item["termJa"]))
    result = {"version": 1, "scope": "data/processed_questions/*建筑史*.md", "rows": rows}
    Path("data/past-exam-coverage-checklist.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    missing = [row for row in rows if row["coverage"] == "missing"]
    aliases_found = [row for row in rows if row["coverage"] == "alias"]
    lines = [
        "# 过去问—现有资料库覆盖检查清单",
        "",
        "范围仅限 `data/processed_questions` 中的建筑史题目。频率是题目原文逐字匹配下限。",
        "",
        f"- 清单项目：{len(rows)}",
        f"- 待核对／缺失：{len(missing)}",
        f"- 别名已覆盖：{len(aliases_found)}",
        "",
        "## 别名已覆盖",
        "",
        "| 过去问写法 | 资料库名称 | 次数 | 动作 |",
        "|---|---|---:|---|",
    ]
    lines.extend(f"| {r['termJa']} | {r['matchedDatabaseName']} | {r['examCountLowerBound']} | 添加别名 |" for r in aliases_found)
    lines += ["", "## 待核对／缺失（优先显示出现两次以上）", "", "| 术语 | 当前分类 | 次数 | 题目数 |", "|---|---|---:|---:|"]
    lines.extend(f"| {r['termJa']} | {r['entityKind']} | {r['examCountLowerBound']} | {r['examFileCount']} |" for r in missing if r["examCountLowerBound"] >= 2)
    lines += ["", "完整逐项记录及题目文件出处见 JSON。", ""]
    Path("data/past-exam-coverage-checklist.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
