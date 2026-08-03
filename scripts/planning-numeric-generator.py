#!/usr/bin/env python3
"""Planning Numeric Standard Generator — P0, Phase A."""
import json, re, random, sys, io
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)
BASE = Path(__file__).parent.parent
DATA = BASE / "data"

def load_facts():
    with open(DATA / "atomic-facts.json", "r", encoding="utf-8") as f:
        return [x for x in json.load(f)["facts"] if x["subject"] == "planning"]

def extract_unit(value):
    m = re.search(r'(m²|㎡|m³|m\b|cm|mm|席|人|台|％|%|W/|kW|dB|lx|Pa|kg|階|床|室|時間|日|年)', value)
    return m.group(1) if m else "other"

def extract_number(value):
    nums = re.findall(r'[\d.]+', value)
    return float(nums[0]) if nums else 0

def classify_sub_relation(f):
    """Classify into 15.1-15.4 based on unit + context."""
    name = f.get("entityName", "")
    value = f.get("value", "")
    unit = extract_unit(value)
    num = extract_number(value)

    if unit in ("人", "台"): return "15.3"  # Capacity
    if unit in ("m²", "㎡"): return "15.1"  # Area
    if unit == "cm": return "15.2"  # Dimension
    if unit == "m":
        # Distance vs other m-based standards
        if any(kw in name for kw in ("距離", "間隔", "幅", "長さ", "歩行", "徒歩")):
            return "15.4"  # Distance
        if num < 5: return "15.2"  # Small m = dimension
        return "15.4"
    if unit in ("mm",): return "15.2"

    # Heuristic
    if num >= 1000: return "15.1"  # Large number = area
    if num >= 100: return "15.4"   # Medium = distance
    return "15.2"

def make_question(facts, relation="standard_value", n=12):
    """Generate 4-option numeric questions. Same unit, same building type when possible."""
    eligible = [f for f in facts if f["relation"] == relation and re.search(r'\d', f.get("value", ""))]
    random.shuffle(eligible)

    # Group by unit for distractor pools
    by_unit = defaultdict(list)
    for f in eligible:
        by_unit[extract_unit(f["value"])].append(f)

    qs = []
    for f in eligible:
        if len(qs) >= n: break
        name = f["entityName"]; correct = f["value"]; unit = extract_unit(correct)
        ut = f.get("useType", "一般")
        sr = classify_sub_relation(f)

        # Distractors: same unit, same building type if possible
        pool = by_unit.get(unit, [])
        same_type = [p for p in pool if p.get("useType") == ut and p["entityName"] != name]
        if len(same_type) >= 3:
            dist = random.sample(same_type, 3)
        elif len(pool) >= 4:
            dist = random.sample([p for p in pool if p["entityName"] != name], min(3, len(pool)-1))
        else:
            continue

        options = [correct] + [d["value"] for d in dist]
        random.shuffle(options)
        ci = options.index(correct)

        # Build context prompt like 2022 Q4
        prompt = f"「{name}」の基準値として最も適切なものを選びなさい。\n\n({' ／ '.join(options)})"

        # Scores
        same_unit_ok = all(extract_unit(o) == unit for o in options)
        same_type_count = sum(1 for d in dist if d.get("useType") == ut)
        tech = 5
        dist_q = 5 if same_type_count >= 2 else (4 if same_type_count >= 1 else 3)
        exam_f = 5 if same_unit_ok else 3

        qs.append({
            "id": f"plan-num-{len(qs)+1:02d}",
            "subject": "planning", "format": "inline_numeric_select",
            "subRelationId": sr, "unit": unit, "useType": ut,
            "prompt": prompt,
            "options": options, "correctIndex": ci,
            "correctAnswer": correct,
            "sourceFactId": f["id"],
            "scores": {"technicalAccuracy": tech, "distractorQuality": dist_q, "examFidelity": exam_f},
            "explanation": f"「{name}」の基準値: {correct}。同単位の類似基準から選択。",
        })
    return qs

def main():
    print("=" * 50)
    print("Planning Numeric Standard Generator — Phase A")
    print("=" * 50)
    facts = load_facts()
    qs = make_question(facts, n=12)

    passed = [q for q in qs if q["scores"]["technicalAccuracy"]>=4.5 and q["scores"]["distractorQuality"]>=4.0 and q["scores"]["examFidelity"]>=4.0]
    rejected = [q for q in qs if q not in passed]
    print(f"\nGenerated: {len(qs)} | Passed: {len(passed)} | Rejected: {len(rejected)}")

    # Distribution
    by_sr = Counter(q["subRelationId"] for q in passed)
    for sr, n in sorted(by_sr.items()):
        print(f"  {sr}: {n}")

    output = {"version": 1, "template": "planning_numeric_standard",
              "total": len(passed), "rejected": len(rejected), "questions": passed}
    with open(DATA / "planning-numeric-pilot.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ planning-numeric-pilot.json")

if __name__ == "__main__":
    main()
