from __future__ import annotations

import collections
import json
import re
from pathlib import Path


PATTERNS = [
    r"[一-龯々ァ-ヶ・＝ー]{2,}(?:建築|建物|様式|造|堂|寺|寺院|神社|神宮|殿|邸|住宅|町|都市|宮殿|大聖堂|教会|図書館|博物館|美術館|劇場|塔|門|廟|墓)",
    r"[ァ-ヶー・＝]{3,}(?:建築|様式|運動|主義|方式|計画|憲章|制度)?",
    r"[一-龯々]{2,}(?:時代|時期|文化|革命|制度|保存|修復|活用|構法|構造|空間|都市改造)",
]
STOP = {"以下の建築", "次の建築", "建築史", "建築物", "建築作品", "歴史的建造物", "関連する建築", "建築専門", "キーワード", "コンセプト", "パース", "デザイン", "文化財", "建築文化", "現代都市"}


def main() -> None:
    staging = json.loads(Path("data/anki-import/anki-notes.json").read_text(encoding="utf-8"))
    known = "\n".join(
        " ".join([record.get("name", ""), *record["fields"].values(), *record.get("tags", [])])
        for record in staging["records"]
    )
    counts: collections.Counter[str] = collections.Counter()
    files_by_term: dict[str, set[str]] = collections.defaultdict(set)
    question_files = []
    for file in Path("data/processed_questions").glob("*.md"):
        if "建筑史" not in file.name and "建築史" not in file.name:
            continue
        text = file.read_text(encoding="utf-8")
        question_files.append(file.name)
        terms = set()
        for pattern in PATTERNS:
            terms.update(re.findall(pattern, text))
        for term in terms:
            term = term.strip(" 、。；：()（）[]【】")
            if len(term) < 3 or term in STOP:
                continue
            counts[term] += text.count(term)
            files_by_term[term].add(file.name)

    rows = []
    for term, count in counts.items():
        if count < 1:
            continue
        rows.append({
            "term": term,
            "examCount": count,
            "fileCount": len(files_by_term[term]),
            "examFiles": sorted(files_by_term[term]),
            "inAnkiExact": term in known,
            "reviewStatus": "needs-review",
        })
    rows.sort(key=lambda row: (-row["examCount"], -row["fileCount"], row["term"]))
    result = {"source": "processed_questions", "questionFileCount": len(question_files), "rows": rows}
    Path("data/all-past-exam-term-candidates.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    gaps = [row for row in rows if not row["inAnkiExact"]]
    report = [
        "# 全部建筑史过去问术语候选与资料库缺口",
        "",
        f"- 扫描题目：{len(question_files)} 份",
        f"- 抽取候选术语：{len(rows)}",
        f"- Anki 未精确覆盖：{len(gaps)}",
        "",
        "注意：这是正则抽取候选，不等于最终实体。需要人工合并别名、删除普通词，并补充图片题中的隐含建筑。",
        "",
        "## 未被 Anki 精确覆盖的高频候选",
        "",
        "| 术语候选 | 出现次数 | 题目数 |",
        "|---|---:|---:|",
    ]
    report.extend(f"| {row['term']} | {row['examCount']} | {row['fileCount']} |" for row in gaps if row["examCount"] >= 2)
    report += ["", "## 全部候选（含低频）", "", "详见 `all-past-exam-term-candidates.json`。", ""]
    Path("data/all-past-exam-term-gaps.md").write_text("\n".join(report), encoding="utf-8")


if __name__ == "__main__":
    main()
