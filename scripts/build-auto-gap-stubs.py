from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    source = json.loads(Path("data/all-past-exam-gap-entities.json").read_text(encoding="utf-8"))
    cards = []
    for row in source["rows"]:
        if row["term"] in {"寺内町", "イスタンブール", "フランツ・ヨーゼフ", "今井町", "文化財制度", "奈良六大寺", "宿場町", "密教本堂"}:
            continue
        cards.append({
            "id": f"past-exam-gap-{row['term']}",
            "entityKind": row["entityKind"],
            "name": {"ja": row["term"], "zh": ""},
            "examFrequencyLowerBound": row["examCount"],
            "examFileCount": row["fileCount"],
            "examFiles": row["examFiles"],
            "typeIds": [],
            "styleIds": [],
            "movementIds": [],
            "relatedPersonIds": [],
            "imageIds": [],
            "summary": {"ja": "", "zh": ""},
            "reviewStatus": "needs-review",
            "qualityFlags": ["past-exam-gap", "stub-only-no-generated-facts"],
        })
    Path("data/past-exam-auto-stubs.json").write_text(json.dumps({"version": 1, "cards": cards}, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
