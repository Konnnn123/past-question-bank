#!/usr/bin/env python3
"""
Planning Relation Fixer
=======================
Splits planning facts that were incorrectly labeled as 'standard_value'
into proper relations: standard_value, defined_as, has_feature, etc.

Also normalizes numeric values: full-width→half-width, unit standardization.

Usage: python scripts/fix-planning-relations.py
Output: overwrites data/atomic-facts.json with corrected planning relations
"""

import json, re, sys, io
from pathlib import Path
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent
DATA = BASE / "data"
FACTS_PATH = DATA / "atomic-facts.json"

# ============================================================================
# Classification rules
# ============================================================================

def classify_planning_fact(entity_name, value):
    """
    Determine the correct relation for a planning fact.
    Returns: (relation, valueType, confidence_adjustment)
    """
    name = entity_name
    v = value

    # 1. Contains explicit numeric value with unit → standard_value
    numeric_with_unit = re.search(r'[\d.]+[～~\-\s]*[\d.]*\s*(m²|㎡|m³|m\b|cm|mm|km|席|人|台|％|%|W/|kW|dB|lx|Pa|kg|N/|階|床|室|時間|日|年)', v)
    if numeric_with_unit:
        return "standard_value", "number", "high"

    # 2. Pure numeric range with unit-like context
    if re.search(r'^\s*[\d.]+[～~\-\s]+[\d.]+\s*(m²|㎡|m\b|cm|mm|席|人|台|％|%|W|kW|lx|\d)', v):
        return "standard_value", "number", "high"

    # 3. Starts with year or historical period → established_in or has_feature
    if re.search(r'^\d{4}年|紀元前|世紀|時代|明治|大正|昭和|平成|令和', v):
        if len(v) < 40:
            return "established_in", "text", "medium"
        return "has_feature", "text", "medium"

    # 4. Definition-like: "Xとは", "Xである", "Xという" → defined_as
    if re.search(r'とは|である|という|するもの|する方式|する方法', v):
        return "defined_as", "text", "medium"

    # 5. Case study / example description → exemplifies or has_feature
    case_keywords = ["代表", "例", "事例", "建築", "設計", "配置", "平面", "断面"]
    if any(kw in v for kw in case_keywords) and len(v) > 40:
        if any(kw in name for kw in ["ホール", "図書館", "美術館", "住宅", "病院", "学校", "集合", "施設", "建築"]):
            return "exemplifies", "text", "medium"
        return "has_feature", "text", "medium"

    # 6. Layout / spatial type description → has_layout
    layout_keywords = ["配置", "平面", "動線", "ゾーン", "コア", "廊下", "階段", "入口", "アプローチ"]
    if any(kw in v for kw in layout_keywords):
        return "has_layout", "text", "medium"

    # 7. Advantage / limitation → has_advantage or has_limitation
    if re.search(r'長所|利点|メリット|優れ|有効|適し', v):
        return "has_advantage", "text", "medium"
    if re.search(r'短所|欠点|デメリット|課題|問題|難しい|難しい|不向き', v):
        return "has_limitation", "text", "medium"

    # 8. Fallback
    return "defined_as", "text", "low"


def normalize_numeric(value):
    """Normalize numeric values to consistent format."""
    # Full-width → half-width
    v = value
    for fw, hw in [("０", "0"), ("１", "1"), ("２", "2"), ("３", "3"), ("４", "4"),
                    ("５", "5"), ("６", "6"), ("７", "7"), ("８", "8"), ("９", "9"),
                    ("％", "%"), ("㎡", "m²"), ("～", "~"), ("　", " ")]:
        v = v.replace(fw, hw)
    # Normalize tilde/ranges
    v = re.sub(r'[～~]\s*', '~', v)
    # Remove extra spaces
    v = re.sub(r'\s{2,}', ' ', v).strip()
    return v


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 50)
    print("Planning Relation Fixer")
    print("=" * 50)

    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        store = json.load(f)

    facts = store["facts"]
    planning_facts = [f for f in facts if f["subject"] == "planning"]
    print(f"\nPlanning facts before: {len(planning_facts)}")

    rel_before = Counter(f["relation"] for f in planning_facts)
    print(f"  Relations before: {dict(rel_before)}")

    changes = Counter()
    updated = 0

    for f in facts:
        if f["subject"] != "planning":
            continue

        old_rel = f["relation"]
        name = f["entityName"]
        value = f["value"]

        new_rel, new_vtype, new_conf = classify_planning_fact(name, value)

        if new_rel != old_rel:
            f["relation"] = new_rel
            f["valueType"] = new_vtype
            if new_conf != "high":
                f["confidence"] = new_conf
            changes[f"{old_rel}→{new_rel}"] += 1
            updated += 1

        # Normalize numeric values
        if new_rel == "standard_value":
            old_val = f["value"]
            f["value"] = normalize_numeric(old_val)

    rel_after = Counter(f["relation"] for f in facts if f["subject"] == "planning")
    print(f"\n  Relations after: {dict(rel_after)}")
    print(f"  Changed: {updated} facts")
    print(f"  Changes: {dict(changes)}")

    # Update store
    store["facts"] = facts
    store["planningRelationsFixed"] = True

    with open(FACTS_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)

    print(f"\n✓ {FACTS_PATH}")

    # Print samples of each new relation
    print("\n--- Samples per relation ---")
    for rel in sorted(set(f["relation"] for f in facts if f["subject"] == "planning")):
        samples = [f for f in facts if f["subject"] == "planning" and f["relation"] == rel]
        print(f"\n  [{rel}] ({len(samples)} facts)")
        for s in samples[:2]:
            print(f"    {s['entityName'][:50]}: {s['value'][:100]}")


if __name__ == "__main__":
    main()
