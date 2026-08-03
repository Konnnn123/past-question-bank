from __future__ import annotations

import json
import re
from pathlib import Path


QUESTION_DIR = Path("data/processed_questions")


def frontmatter(text: str, key: str) -> str:
    match = re.search(rf"^{re.escape(key)}:\s*[\"']?([^\"'\n]+)", text, re.M)
    return match.group(1).strip() if match else ""


def main() -> None:
    path = Path("data/architecture-normalized-candidates.json")
    data = json.loads(path.read_text(encoding="utf-8"))
    questions = []
    for file in QUESTION_DIR.glob("*.md"):
        if "建筑史" not in file.name and "建築史" not in file.name:
            continue
        text = file.read_text(encoding="utf-8")
        year = frontmatter(text, "year")
        category = frontmatter(text, "category")
        number = frontmatter(text, "question_number")
        if not year:
            continue
        questions.append({"year": int(year), "category": category, "questionNumber": number, "fileName": file.name, "text": text})

    links = 0
    for building in data["buildings"]:
        name = building["name"]["ja"].strip()
        building["examEvidence"] = []
        if len(name) < 4 or name in {"要確認", "建築家不明"}:
            continue
        for question in questions:
            if name not in question["text"]:
                continue
            building["examEvidence"].append({
                "year": question["year"],
                "category": "専門1" if "専門1" in question["category"] else "専門2-2",
                "questionNumber": question["questionNumber"],
                "fileName": question["fileName"],
                "relation": "direct",
            })
            links += 1
        building["importance"]["examFrequency"] = len(building["examEvidence"])
        building["importance"]["examImportance"] = 3 if len(building["examEvidence"]) >= 3 else 2 if building["examEvidence"] else 1
        if building["examEvidence"]:
            building["reviewStatus"] = "exam-confirmed"

    data["examEvidenceStats"] = {
        "questionFilesScanned": len(questions),
        "buildingQuestionLinks": links,
        "buildingsWithEvidence": sum(bool(b["examEvidence"]) for b in data["buildings"]),
    }
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    report = [
        "# 建筑过去问证据连接结果",
        "",
        f"- 扫描建筑史题目：{len(questions)}",
        f"- 建筑—题目连接：{links}",
        f"- 有直接证据的建筑：{data['examEvidenceStats']['buildingsWithEvidence']}",
        "",
        "## 高频建筑",
        "",
    ]
    ranked = sorted(data["buildings"], key=lambda b: b["importance"]["examFrequency"], reverse=True)
    report.extend(f"- {b['name']['ja']}: {b['importance']['examFrequency']}" for b in ranked[:40] if b["importance"]["examFrequency"])
    Path("data/architecture-exam-evidence-report.md").write_text("\n".join(report) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
