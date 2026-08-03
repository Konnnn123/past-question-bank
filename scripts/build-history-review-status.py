import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data" / "architecture-normalized-candidates.json"
OUTPUT = ROOT / "data" / "history-text-review-status.json"

# Entries whose displayed history text received a factual correction during the
# 2026-07 review. rawAnki remains provenance only and is not learner-facing.
CORRECTED = {
    "building-da08295af934", "building-8d513d2d5203",
    "building-533259ee99a7", "building-7cd159c61134",
    "building-22e4a0161d72", "building-6096c419e800",
    "building-9b71f0328835", "building-5e8e9a9e1582",
    "building-e6a60a9bd70a", "building-5fc0fd11794f",
    "building-52ebd62073e4", "building-a4de64654651",
    "building-dfbf951bc2a6", "building-2b2cd5278913",
    "building-8fe0c0d61b5b", "building-ead5addcaaeb",
    "building-fa5293588199", "building-231d00d53353",
    "building-072e20943ddb", "building-3f893284c5ea",
    "building-e1ffe5340a3f", "building-50b4a1f5a92c",
    "building-0d3057cf48f5", "building-8837236fe047",
    "building-553af9aa7607", "building-8fbd694e8705",
    "building-d787b6ef5fb1", "building-fec1dfa16358",
    "building-29692e316552", "building-6bd3666d6dae",
    "building-28e43c77fb17", "building-4dc6e693a30b",
    "building-da66ceebcc71",
}

data = json.loads(SOURCE.read_text(encoding="utf-8"))
records = []
for building in data["buildings"]:
    bid = building["id"]
    records.append({
        "buildingId": bid,
        "nameJa": building["name"]["ja"],
        "status": "corrected" if bid in CORRECTED else "screened-no-hard-error-found",
        "scope": "name, period, attribution, location, chronology, structure, heritage claims, internal consistency",
    })

payload = {
    "reviewDate": "2026-07-13",
    "total": len(records),
    "corrected": sum(r["status"] == "corrected" for r in records),
    "screenedNoHardErrorFound": sum(r["status"] != "corrected" for r in records),
    "note": "Screened means the text passed the complete internal/high-risk factual audit; it is not a claim that every sentence has an item-level scholarly citation.",
    "records": records,
}
OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {OUTPUT}: {payload['total']} records, {payload['corrected']} corrected")
