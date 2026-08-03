"""Extract the actual Japanese names of all learning cards from source modules."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "lib"
OUT = ROOT / "data" / "learning-card-name-index.json"
ACTIVE_FILES = {
    "history-learning-card-examples.ts", "history-style-cards.ts", "western-style-cards.ts",
    "shrine-style-cards.ts", "supplementary-style-cards.ts", "history-movement-cards.ts",
    "history-architect-cards.ts", "history-architect-cards-western.ts", "history-architect-cards-japan.ts",
    "history-architect-cards-core.ts",
    "history-architect-cards-batch-two.ts",
    "history-architect-cards-batch-three.ts",
    "history-architect-cards-batch-four.ts",
    "additional-history-style-cards.ts", "building-type-learning-cards.ts",
    "japanese-special-style-cards.ts", "history-gap-cards.ts",
}


def main() -> None:
    cards: dict[str, dict] = {}
    patterns = [
        # Factory calls: base/card/architect/movement/make/c("card-id", "Japanese name", ...)
        re.compile(r'\b(?:base|card|architect|movement|make|c)\(\s*"([^"]+)"\s*,\s*"([^"]+)"'),
        # Literal objects: do not cross into the next object while seeking name.
        re.compile(r'id\s*:\s*"([^"]+)"(?:(?!\bid\s*:)[\s\S]){0,500}?name\s*:\s*l\(\s*"([^"]+)"'),
        # Compact data seeds used by the core architect-card module.
        re.compile(r'id:\s*"(architect-[^"]+)",\s*ja:\s*"([^"]+)"'),
        # Tuple data seeds used by the second architect-card batch.
        re.compile(r'\[\s*"(architect-[^"]+)"\s*,\s*"([^"]+)"'),
    ]
    for path in SRC.glob("*.ts"):
        if path.name not in ACTIVE_FILES:
            continue
        text = path.read_text(encoding="utf-8")
        for pattern in patterns:
            for card_id, name in pattern.findall(text):
                if not re.match(r"^(?:style|movement|architect|type|theory|institution|concept)-", card_id):
                    continue
                cards.setdefault(card_id, {"cardId": card_id, "nameJa": name, "sourceFile": path.name})
    result = {"version": 1, "cards": sorted(cards.values(), key=lambda c: c["cardId"])}
    audit_path = ROOT / "data" / "architect-person-audit-final.json"
    if audit_path.exists():
        audit = json.loads(audit_path.read_text(encoding="utf-8"))
        for index, row in enumerate((item for item in audit.get("rows", []) if item.get("status") == "architect-card-candidate"), 1):
            card_id = f"architect-audit-{index}"
            cards.setdefault(card_id, {"cardId": card_id, "nameJa": row["nameJa"], "sourceFile": "history-architect-cards-final-audit.ts"})
        result = {"version": 1, "cards": sorted(cards.values(), key=lambda c: c["cardId"])}
    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print({"cards": len(result["cards"])})


if __name__ == "__main__":
    main()
