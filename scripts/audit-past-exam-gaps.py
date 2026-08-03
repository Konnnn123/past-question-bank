from __future__ import annotations

import collections
import json
import re
from pathlib import Path


TERM_GROUPS = {
    "語群I": [
        "アンリ・ラブルースト", "フランチェスコ・ボッロミーニ", "ドメニコ・フォンターナ",
        "ブルーノ・タウト", "ジョセフ・パクストン", "アドルフ・ロース", "アントニオ・サンテリア",
        "ジャコモ・バロッツィ・ダ・ヴィニョーラ", "マルク・アントワーヌ・ロージエ", "後藤慶二", "山田守",
        "宿場町", "寺内町", "城下町", "円覚寺仏殿", "根来寺", "延暦寺", "當麻寺曼荼羅堂", "東大寺",
        "東三条殿", "吉島家住宅", "スポリア", "デール・エル・メディナ", "シェナージュ", "ペンデンティブ", "聖墳墓",
    ],
    "語群II": [
        "監獄", "市場", "図書館", "万博", "神明造", "多宝塔", "密教本堂", "禅宗様", "春日造", "大仏様",
        "寝殿造", "今井町", "飛騨高山", "奈良井", "啓蒙時代", "エルサレム", "エジプト", "ウィーン",
        "イスタンブール", "ケルン", "マニエリスム", "バロック", "ゴシック",
    ],
}


def main() -> None:
    staging = json.loads(Path("data/anki-import/anki-notes.json").read_text(encoding="utf-8"))
    searchable = []
    for record in staging["records"]:
        fields = record["fields"]
        searchable.append(" ".join([record.get("name", ""), *fields.values(), *record.get("tags", [])]))
    covered_text = "\n".join(searchable)

    files = []
    for file in Path("data/processed_questions").glob("*.md"):
        if "建筑史" in file.name or "建築史" in file.name:
            files.append((file.name, file.read_text(encoding="utf-8")))

    rows = []
    for group, terms in TERM_GROUPS.items():
        for term in terms:
            evidence = [(name, text.count(term)) for name, text in files if term in text]
            count = sum(n for _, n in evidence)
            rows.append({
                "group": group,
                "term": term,
                "examCount": count,
                "examFiles": [name for name, _ in evidence],
                "inAnki": term in covered_text,
                "gap": term not in covered_text,
            })

    output = [
        "# 过去问—资料库缺口清单（第一批语群）",
        "",
        "判断规则：`examCount` 来自过去问原文逐字匹配；`inAnki` 表示该词出现在 Anki 名称、字段或标签中。别名尚未展开，因此这是保守下限。",
        "",
        "## 未覆盖且出现在过去问",
        "",
        "| 分类 | 术语 | 出现次数 | 题目文件数 |",
        "|---|---|---:|---:|",
    ]
    for row in sorted((r for r in rows if r["gap"] and r["examCount"]), key=lambda r: (-r["examCount"], r["term"])):
        output.append(f"| {row['group']} | {row['term']} | {row['examCount']} | {len(row['examFiles'])} |")
    output += ["", "## 已覆盖且出现在过去问", "", "| 分类 | 术语 | 出现次数 |", "|---|---|---:|"]
    for row in sorted((r for r in rows if not r["gap"] and r["examCount"]), key=lambda r: (-r["examCount"], r["term"])):
        output.append(f"| {row['group']} | {row['term']} | {row['examCount']} |")
    output += ["", "## 语群词未在题目原文逐字出现", "", "| 分类 | 术语 | Anki 是否已有 |", "|---|---|---|"]
    for row in sorted((r for r in rows if not r["examCount"]), key=lambda r: (r["group"], r["term"])):
        output.append(f"| {row['group']} | {row['term']} | {'是' if row['inAnki'] else '否'} |")

    Path("data/past-exam-knowledge-gaps.md").write_text("\n".join(output) + "\n", encoding="utf-8")
    Path("data/past-exam-knowledge-gaps.json").write_text(json.dumps({"files": len(files), "rows": rows}, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
