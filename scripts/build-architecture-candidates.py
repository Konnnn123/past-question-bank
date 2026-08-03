"""Build a reviewable architecture candidate dataset from Anki staging JSON."""
from __future__ import annotations

import argparse
import json
from pathlib import Path


def importance(tags: list[str]) -> int | None:
    value = next((tag for tag in tags if tag.startswith("重要度:")), "")
    if "⭐⭐⭐" in value:
        return 3
    if "⭐⭐" in value:
        return 2
    if "⭐" in value:
        return 1
    return None


def region(deck: str) -> str:
    if "日本" in deck:
        return "japan"
    if "西洋" in deck:
        return "western"
    return "global"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    source = json.loads(args.input.read_text(encoding="utf-8"))
    buildings = []
    for index, record in enumerate(source["records"]):
        fields = record["fields"]
        building_id = f"building-anki-{record['source']['noteId']}"
        flags = list(record.get("qualityFlags", []))
        if not fields.get("style"):
            flags.append("missing-style-normalization")
        if not fields.get("people"):
            flags.append("missing-person-normalization")
        buildings.append({
            "id": building_id,
            "name": {"ja": fields.get("buildingName") or record.get("name", ""), "zh": ""},
            "aliases": [],
            "period": {"ja": fields.get("period", ""), "zh": ""},
            "location": {"ja": "", "zh": ""},
            "regions": [region(record["source"].get("deck", ""))],
            "typeIds": [],
            "styleIds": [],
            "movementIds": [],
            "theoryIds": [],
            "architectIds": [],
            "relatedPersonIds": [],
            "structure": {"ja": "", "zh": ""},
            "space": {"ja": "", "zh": ""},
            "history": {"ja": fields.get("history", ""), "zh": ""},
            "imageIds": [f"{building_id}-image-{n}" for n, _ in enumerate(record.get("mediaRefs", []))],
            "importance": {
                "academicImportance": 2,
                "sourceImportance": importance(record.get("tags", [])),
                "examFrequency": 0,
                "examImportance": 1,
            },
            "examEvidence": [],
            "sources": [{"kind": "anki", "locator": record["source"]["noteId"], "note": record["source"].get("deck", "")}],
            "reviewStatus": "needs-review" if flags else "imported",
            "qualityFlags": flags,
            "rawAnki": {
                "style": fields.get("style", ""),
                "people": fields.get("people", ""),
                "image": fields.get("image", ""),
            },
        })
    result = {"version": 1, "source": "anki-staging", "buildings": buildings}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
