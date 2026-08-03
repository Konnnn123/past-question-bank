from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    data = json.loads(Path("data/past-exam-gap-entities.json").read_text(encoding="utf-8"))
    cards = []
    for item in data["entities"]:
        if item["entityKind"] not in {"building", "person", "concept-or-type"}:
            continue
        cards.append({
            "id": f"gap-{item['entityKind']}-{item['term']}",
            "kind": item["entityKind"],
            "name": {"ja": item["term"], "zh": ""},
            "summary": {"ja": "", "zh": ""},
            "typeIds": [],
            "styleIds": [],
            "movementIds": [],
            "relatedPersonIds": [],
            "imageIds": [],
            "examEvidence": [{
                "year": None,
                "category": "processed_questions",
                "questionNumber": "",
                "fileName": file,
                "relation": "exact-text",
            } for file in item["examFiles"]],
            "examFrequencyLowerBound": item["examCount"],
            "priority": item["priority"],
            "reviewStatus": "needs-review",
            "qualityFlags": ["past-exam-gap", "stub-only-no-generated-facts"],
        })
    result = {"version": 1, "source": "processed_questions", "cards": cards}
    Path("data/past-exam-gap-card-stubs.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
