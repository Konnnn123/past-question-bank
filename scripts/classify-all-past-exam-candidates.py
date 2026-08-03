from __future__ import annotations

import json
from pathlib import Path


def classify(term: str) -> str:
    if term in {"アヤ・ソフィア", "サント＝ジュヌヴィエーヴ", "ローマン・コンクリート", "・デザイン"}:
        return "building" if term in {"アヤ・ソフィア", "サント＝ジュヌヴィエーヴ"} else "theory-or-institution"
    if any(x in term for x in ["建築", "大聖堂", "寺", "神社", "神宮", "堂", "殿", "邸", "住宅", "館", "塔", "門", "宮殿", "ワット", "ミラ"]):
        return "building"
    if any(x in term for x in ["様式", "主義", "運動", "モダニズム", "ゴシック", "バロック", "ルネサンス", "ロマネスク", "ビザンチン"]):
        return "style-or-movement"
    if any(x in term for x in ["憲章", "制度", "保存", "修復", "活用", "リユース", "オーセンティシティ", "原則", "理論", "コンセプト"]):
        return "theory-or-institution"
    if any(x in term for x in ["時代", "都市", "町", "イスタンブール", "エジプト", "ウィーン", "エルサレム", "ケルン"]):
        return "period-or-place"
    if re_person_like(term):
        return "person"
    return "other"


def re_person_like(term: str) -> bool:
    return any(x in term for x in ["・", "＝"]) and not any(x in term for x in ["建築", "様式", "大聖堂"])


def main() -> None:
    source = json.loads(Path("data/all-past-exam-term-candidates.json").read_text(encoding="utf-8"))
    rows = []
    for row in source["rows"]:
        if row["inAnkiExact"] or row["examCount"] < 2 or row["term"] == "・デザイン":
            continue
        kind = classify(row["term"])
        if kind == "other":
            continue
        rows.append({**row, "entityKind": kind, "priority": 3 if row["examCount"] >= 3 else 2})
    rows.sort(key=lambda row: (-row["priority"], -row["examCount"], row["term"]))
    result = {"source": "processed_questions", "rows": rows}
    Path("data/all-past-exam-gap-entities.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["# 全量过去问缺口实体（第二轮）", "", "已过滤低频普通词，并排除 Anki 中存在精确匹配的词。别名合并仍待审核。", "", "| 优先级 | 类型 | 候选 | 次数 | 题目数 |", "|---:|---|---|---:|---:|"]
    lines.extend(f"| {r['priority']} | {r['entityKind']} | {r['term']} | {r['examCount']} | {r['fileCount']} |" for r in rows)
    Path("data/all-past-exam-gap-entities.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
