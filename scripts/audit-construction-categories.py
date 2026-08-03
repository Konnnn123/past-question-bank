#!/usr/bin/env python3
"""
Construction Category Auditor
==============================
Audits construction 'belongs_to' categories:
  A) Knowledge categories (exam-relevant) → keep for term_to_category
  B) Internal tags (Anki/Notion management) → mark as not for exam use

Usage: python scripts/audit-construction-categories.py
Output: data/category-audit-report.md
"""

import json, re, sys, io
from pathlib import Path
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent
DATA = BASE / "data"
FACTS_PATH = DATA / "atomic-facts.json"
QUESTIONS_PATH = DATA / "questions.json"

# Known exam-relevant categories (from 2022 専門1 Q3 architecture)
KNOWLEDGE_CATEGORIES = {
    "材料", "構造", "施工", "基礎", "地盤", "躯体", "屋根", "壁", "床",
    "鉄筋コンクリート", "鉄骨", "木造", "組積", "コンクリート",
    "接合", "防水", "耐火", "断熱", "遮音", "耐震", "免震", "制震",
    "部材", "開口部", "仕上", "設備", "仮設",
}

# Known internal/organizational tags (not exam knowledge categories)
INTERNAL_PATTERNS = [
    r'^CFT', r'^図', r'^写真', r'^未分類', r'^概念', r'^その他',
    r'^Anki', r'^Notion', r'^カード', r'^タグ', r'^deck',
    r'^\d',  # Numeric-only tags
]


def classify_category(cat_name):
    """Classify a category as knowledge or internal."""
    name = cat_name.strip()

    # Direct match with known categories
    if name in KNOWLEDGE_CATEGORIES:
        return "knowledge", "exact_match"

    # Partial match
    for kc in KNOWLEDGE_CATEGORIES:
        if kc in name:
            return "knowledge", f"contains_{kc}"

    # Internal patterns
    for pat in INTERNAL_PATTERNS:
        if re.search(pat, name):
            return "internal", f"matches_{pat}"

    # Heuristic: very short (1-2 chars) → likely tag
    if len(name) <= 2:
        return "internal", "too_short"

    # Heuristic: contains organization markers
    if re.search(r'[（(].*[）)]|[\d]{3,}', name):
        return "internal", "contains_markers"

    # Default: uncertain, needs review
    return "uncertain", "needs_review"


def main():
    print("=" * 50)
    print("Construction Category Auditor")
    print("=" * 50)

    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]

    # Get all unique construction categories
    cat_facts = [f for f in facts if f["subject"] == "construction" and f["relation"] == "belongs_to"]
    categories = Counter(f["value"] for f in cat_facts)
    print(f"\nUnique categories: {len(categories)}")
    print(f"Total facts with category: {len(cat_facts)}")

    # Classify
    results = {}
    for cat_name in sorted(categories.keys(), key=lambda c: -categories[c]):
        cls, reason = classify_category(cat_name)
        results[cat_name] = {
            "count": categories[cat_name],
            "classification": cls,
            "reason": reason,
        }

    knowledge = {k: v for k, v in results.items() if v["classification"] == "knowledge"}
    internal = {k: v for k, v in results.items() if v["classification"] == "internal"}
    uncertain = {k: v for k, v in results.items() if v["classification"] == "uncertain"}

    print(f"\n  Knowledge: {len(knowledge)} ({sum(v['count'] for v in knowledge.values())} facts)")
    print(f"  Internal:  {len(internal)} ({sum(v['count'] for v in internal.values())} facts)")
    print(f"  Uncertain: {len(uncertain)} ({sum(v['count'] for v in uncertain.values())} facts)")

    # Check affected questions
    with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)["questions"]

    affected_qs = []
    for q in questions:
        if q["subject"] != "construction" or q["blueprintId"] != "term_to_category":
            continue
        # Extract category from options
        options = q["question"].get("options", [])
        correct_idx = q["question"].get("correctIndex", 0)
        if correct_idx < len(options):
            correct_opt = options[correct_idx]
            cat_val = correct_opt.split(". ", 1)[-1] if ". " in correct_opt else correct_opt
            if cat_val in internal:
                affected_qs.append({
                    "id": q["id"],
                    "category": cat_val,
                    "classification": "internal",
                    "suggestedBlueprint": "term_to_definition",
                })

    print(f"\n  Affected questions (internal categories used as answers): {len(affected_qs)}")

    # Generate report
    report = f"""# Construction Category Audit Report

## Summary

| Classification | Categories | Facts | % |
|---------------|-----------|-------|---|
| Knowledge (exam-relevant) | {len(knowledge)} | {sum(v['count'] for v in knowledge.values())} | {sum(v['count'] for v in knowledge.values()) / max(1, len(cat_facts)) * 100:.0f}% |
| Internal (management tags) | {len(internal)} | {sum(v['count'] for v in internal.values())} | {sum(v['count'] for v in internal.values()) / max(1, len(cat_facts)) * 100:.0f}% |
| Uncertain (needs review) | {len(uncertain)} | {sum(v['count'] for v in uncertain.values())} | {sum(v['count'] for v in uncertain.values()) / max(1, len(cat_facts)) * 100:.0f}% |

## Knowledge Categories (use for term_to_category questions)

| Category | Facts |
|----------|-------|
"""
    for cat_name, info in sorted(knowledge.items(), key=lambda x: -x[1]["count"]):
        report += f"| {cat_name} | {info['count']} |\n"

    report += """
## Internal/Management Tags (NOT for exam questions)

| Tag | Facts | Reason |
|-----|-------|--------|
"""
    for cat_name, info in sorted(internal.items(), key=lambda x: -x[1]["count"]):
        report += f"| {cat_name} | {info['count']} | {info['reason']} |\n"

    report += """
## Uncertain Categories (need human review)

| Category | Facts | Reason |
|----------|-------|--------|
"""
    for cat_name, info in sorted(uncertain.items(), key=lambda x: -x[1]["count"]):
        report += f"| {cat_name} | {info['count']} | {info['reason']} |\n"

    report += f"""
## Affected Questions (should be deprecated or re-blueprinted)

{len(affected_qs)} term_to_category questions use internal tags as correct answers.

"""
    for aq in affected_qs[:20]:
        report += f"- `{aq['id']}`: category=`{aq['category']}` → suggest `{aq['suggestedBlueprint']}`\n"
    if len(affected_qs) > 20:
        report += f"- ... and {len(affected_qs) - 20} more\n"

    report += """
## Recommended Actions

1. **Internal tags**: Exclude from `term_to_category` blueprint. These categories should not appear as correct answers in practice questions.
2. **Uncertain tags**: Review manually. Recategorize to knowledge or internal.
3. **Deprecated questions**: Questions using internal tags as answers should be:
   - Re-blueprinted to `term_to_definition` (if a definition exists)
   - Or marked as `low_value` and excluded from the pool
4. **New blueprints**: Consider adding:
   - `term_to_function` (用语→功能)
   - `component_to_location` (构件→使用位置)
   - `defect_to_cause` (缺陷→原因)
"""

    out = DATA / "category-audit-report.md"
    with open(out, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"\n✓ {out}")


if __name__ == "__main__":
    main()
