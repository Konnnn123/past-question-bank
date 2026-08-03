from __future__ import annotations

import json
from pathlib import Path


BUILDINGS = {"寺内町", "東三条殿", "吉島家住宅", "宿場町", "根来寺", "當麻寺曼荼羅堂", "今井町", "奈良井", "飛騨高山"}
PEOPLE = {"アドルフ・ロース", "アントニオ・サンテリア", "ドメニコ・フォンターナ", "ジャコモ・バロッツィ・ダ・ヴィニョーラ", "マルク・アントワーヌ・ロージエ", "後藤慶二"}
PLACES = {"イスタンブール", "啓蒙時代", "万博"}
CONCEPTS = {"スポリア", "ペンデンティブ", "聖墳墓", "監獄", "密教本堂"}


def main() -> None:
    source = json.loads(Path("data/past-exam-knowledge-gaps.json").read_text(encoding="utf-8"))
    entities = []
    for row in source["rows"]:
        if not row["gap"] or not row["examCount"]:
            continue
        term = row["term"]
        if term in BUILDINGS:
            kind = "building"
        elif term in PEOPLE:
            kind = "person"
        elif term in PLACES:
            kind = "period-or-place"
        elif term in CONCEPTS:
            kind = "concept-or-type"
        else:
            kind = "unclassified"
        priority = 3 if row["examCount"] >= 3 else 2 if row["examCount"] == 2 else 1
        entities.append({**row, "entityKind": kind, "priority": priority, "reviewStatus": "needs-review"})
    result = {"version": 1, "source": "processed_questions", "entities": sorted(entities, key=lambda x: (-x["priority"], -x["examCount"], x["term"]))}
    Path("data/past-exam-gap-entities.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = ["# 过去问缺口实体清单", "", "只基于 processed_questions 的逐字匹配结果。", "", "| 优先级 | 类型 | 实体 | 出现次数 |", "|---:|---|---|---:|"]
    lines.extend(f"| {x['priority']} | {x['entityKind']} | {x['term']} | {x['examCount']} |" for x in result["entities"])
    Path("data/past-exam-gap-entities.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
