"""Apply reviewed style/type classifications to previously unclassified buildings."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "data/architecture-normalized-candidates.json"

CLASSIFICATIONS = {
    "building-5dfd907b5101": {"styleIds": ["style-mesopotamian"]},
    "building-d511f92a9b59": {"typeIds": ["type-moated-settlement", "type-hottate-bashira"]},
    "building-614c59064a55": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-modernism"]},
    "building-e5f6e16d3076": {"typeIds": ["type-office"], "movementIds": ["movement-modernism"]},
    "building-fcadd9d8aed8": {"typeIds": ["type-theater"], "movementIds": ["movement-modernism"]},
    "building-d5155f2d13f8": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-modernism"]},
    "building-b20352982a51": {"typeIds": ["type-civic-cultural"], "styleIds": ["style-international"], "movementIds": ["movement-modernism"]},
    "building-33ee6654afec": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-modernism", "movement-critical-regionalism"]},
    "building-d1fbe34c55dd": {"typeIds": ["type-office"], "movementIds": ["movement-modernism"]},
    "building-463dd52fce90": {"typeIds": ["type-office"], "movementIds": ["movement-modernism"]},
    "building-a6f56a900576": {"typeIds": ["type-office"], "styleIds": ["style-international"], "movementIds": ["movement-modernism"]},
    "building-de2dcb207777": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-modernism"]},
    "building-d418d1c8540b": {"typeIds": ["type-office"], "styleIds": ["style-historicism"]},
    "building-59cdcfa88bbc": {"typeIds": ["type-office"], "styleIds": ["style-renaissance", "style-historicism"]},
    "building-cdd8ab01e640": {"typeIds": ["type-station"], "styleIds": ["style-historicism"]},
    "building-ff0355f2b000": {"typeIds": ["type-exhibition"], "styleIds": ["style-international"], "movementIds": ["movement-modernism"]},
    "building-6ab4d772c730": {"typeIds": ["type-urban-space"], "movementIds": ["movement-modernism"]},
    "building-e77b587cf8db": {"typeIds": ["type-school"], "movementIds": ["movement-modernism"]},
    "building-56d521bb3c75": {"styleIds": ["style-industrial-iron-glass"], "movementIds": ["movement-modernism"]},
    "building-5b915c32875a": {"typeIds": ["type-exhibition"], "movementIds": ["movement-modernism"]},
    "building-e005da0846ca": {"styleIds": ["style-industrial-iron-glass"], "movementIds": ["movement-modernism"]},
    "building-047bc7812a81": {"typeIds": ["type-office"], "movementIds": ["movement-modernism"]},
    "building-ab51368ef548": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-constructivism"]},
    "building-1258b29b9ae4": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-constructivism"]},
    "building-50be283146d2": {"typeIds": ["type-urban-space"], "movementIds": ["movement-constructivism"]},
    "building-d2b6fd972d66": {"typeIds": ["type-station"], "movementIds": ["movement-vienna-secession"]},
    "building-e5451e641b70": {"typeIds": ["type-theater"], "movementIds": ["movement-art-nouveau"]},
    "building-64593260cffe": {"typeIds": ["type-civic-cultural"], "movementIds": ["movement-art-nouveau"]},
}

def main() -> None:
    data = json.loads(PATH.read_text(encoding="utf-8"))
    updated = []
    for building in data["buildings"]:
        classification = CLASSIFICATIONS.get(building["id"])
        if not classification:
            continue
        if building.get("styleIds") or building.get("typeIds"):
            # Previous reviewed runs are intentionally preserved; this makes the
            # classification script safe to re-run when only remaining gaps are
            # being completed.
            continue
        for field, values in classification.items():
            building[field] = values
        updated.append({"id": building["id"], "nameJa": building["name"]["ja"], **classification})
    PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = {"version": 1, "updated": updated}
    (ROOT / "data/unregistered-style-type-classification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print({"updated": len(updated)})

if __name__ == "__main__":
    main()
