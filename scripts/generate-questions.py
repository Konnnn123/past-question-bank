#!/usr/bin/env python3
"""
Phase 3 Question Generator
===========================
Atomic Facts → Blueprint → Draft → Optimizer → Final Question → Quality Score

Per-subject distractor strategies:
  History:    era proximity / style family / architect school
  Planning:   numeric clusters (same unit + same scale + same standard type)
  Construction: definition compression (≤120 chars) + same-category peers
  Environment: formula structural similarity

Rejects questions with Quality Score < 70.

Usage: python scripts/generate-questions.py
Output: data/questions.json, data/question-generation-report.md
"""

import json, re, sys, io, os, random, math
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent))
from question_optimizer import (
    optimize_question,
    compress_definition,
    build_numeric_clusters,
    select_history_distractors,
    select_planning_distractors,
    select_construction_distractors,
    select_environment_distractors,
    compute_quality_score,
)

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)

BASE = Path(__file__).parent.parent
DATA = BASE / "data"
FACTS_PATH = DATA / "atomic-facts.json"
CANDIDATES_PATH = DATA / "candidate-facts.json"
BLUEPRINTS_PATH = DATA / "question-blueprints.json"
OUTPUT_JSON = DATA / "questions.json"
OUTPUT_REPORT = DATA / "question-generation-report.md"

MAX_PER_BLUEPRINT = 50  # Cap questions per blueprint to avoid explosion

# ============================================================================
# History Generator
# ============================================================================

def generate_history(facts, blueprints, limit_per_bp=MAX_PER_BLUEPRINT):
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "history"}
    questions = []

    # Build entity maps
    buildings = defaultdict(dict)
    for f in facts:
        if f["subject"] != "history":
            continue
        name = f["entityName"]
        rel = f["relation"]
        val = f["value"]
        if rel == "built_in":
            buildings[name]["period"] = val
        elif rel == "has_style":
            buildings[name]["style"] = val
        elif rel == "designed_by":
            buildings[name]["people"] = val
        elif rel == "has_original_name":
            buildings[name]["original"] = val
        buildings[name]["_name"] = name

    # Filter complete
    complete = []
    for name, info in buildings.items():
        if info.get("people") and info.get("period"):
            complete.append((name, info))
    random.shuffle(complete)

    all_periods = list(set(b.get("period", "") for _, b in complete if b.get("period")))
    all_styles = list(set(b.get("style", "") for _, b in complete if b.get("style")))
    all_people = list(set(b.get("people", "") for _, b in complete if b.get("people")))
    all_names = list(set(name for name, _ in complete))

    # Building → Architect
    bp = bp_map.get("building_to_architect")
    if bp:
        count = 0
        for name, info in complete:
            if count >= limit_per_bp:
                break
            if not info.get("people"):
                continue
            distractors = select_history_distractors(info["people"], all_people, "designed_by", info)
            if len(distractors) < 3:
                continue
            options = [info["people"]] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(info["people"])
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("history", bp, name, opts, correct_idx,
                f"{name}の設計者は{info['people']}。",
                "people", f"(entity={name}, relation=designed_by, value={info['people']})")
            questions.append(q)
            count += 1

    # Building → Period
    bp = bp_map.get("building_to_period")
    if bp:
        count = 0
        for name, info in complete:
            if count >= limit_per_bp:
                break
            if not info.get("period"):
                continue
            distractors = select_history_distractors(info["period"], all_periods, "built_in", info)
            if len(distractors) < 3:
                continue
            options = [info["period"]] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(info["period"])
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("history", bp, name, opts, correct_idx,
                f"{name}は{info['period']}に建設。",
                "period", f"(entity={name}, relation=built_in, value={info['period']})")
            questions.append(q)
            count += 1

    # Building → Style
    bp = bp_map.get("building_style_pairing")
    if bp:
        count = 0
        for name, info in complete:
            if count >= limit_per_bp:
                break
            if not info.get("style"):
                continue
            distractors = select_history_distractors(info["style"], all_styles, "has_style", info)
            if len(distractors) < 3:
                continue
            options = [info["style"]] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(info["style"])
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("history", bp, name, opts, correct_idx,
                f"{name}の様式は{info['style']}。",
                "style", f"(entity={name}, relation=has_style, value={info['style']})")
            questions.append(q)
            count += 1

    # Architect → Building (reverse)
    bp = bp_map.get("architect_to_work")
    if bp:
        person_buildings = defaultdict(list)
        for name, info in complete:
            if info.get("people"):
                person_buildings[info["people"]].append(name)
        persons = [(p, bs) for p, bs in person_buildings.items() if len(bs) >= 1]
        random.shuffle(persons)

        count = 0
        for person, bldgs in persons:
            if count >= limit_per_bp:
                break
            correct = bldgs[0]
            distractors = select_history_distractors(correct, [n for n in all_names if n != correct], "designed", {})
            if len(distractors) < 3:
                continue
            options = [correct] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(correct)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("history", bp, person, opts, correct_idx,
                f"{person}の代表作は{correct}。",
                "people", f"(entity={person}, relation=designed, value={correct})")
            questions.append(q)
            count += 1

    return questions


# ============================================================================
# Construction Generator
# ============================================================================

def generate_construction(facts, blueprints, candidate_facts, limit_per_bp=MAX_PER_BLUEPRINT):
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "construction"}
    questions = []

    # Merge confirmed + candidate defined_as
    terms = defaultdict(lambda: {"category": "", "def": ""})
    for f in facts:
        if f["subject"] != "construction":
            continue
        name = f["entityName"]
        if f["relation"] == "belongs_to":
            terms[name]["category"] = f["value"]
    for c in candidate_facts:
        if c.get("subject") != "construction":
            continue
        if c.get("relation") == "defined_as":
            val = c.get("value", "")
            if val and len(val) >= 16:
                terms[c["entityName"]]["def"] = compress_definition(val, 120)

    complete = [(n, i) for n, i in terms.items() if i["category"] and i["def"]]
    random.shuffle(complete)
    all_defs = [compress_definition(i["def"], 120) for _, i in complete]
    all_cats = list(set(i["category"] for _, i in complete))

    # Term → Category
    bp = bp_map.get("term_to_category")
    if bp:
        count = 0
        for name, info in complete:
            if count >= limit_per_bp:
                break
            distractors = select_construction_distractors(info["category"], all_cats, info["category"])
            if len(distractors) < 3:
                continue
            options = [info["category"]] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(info["category"])
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("construction", bp, name, opts, correct_idx,
                f"「{name}」は「{info['category']}」に分類。",
                "category", f"(entity={name}, relation=belongs_to, value={info['category']})")
            questions.append(q)
            count += 1

    # Term → Definition (compressed)
    bp = bp_map.get("term_to_definition")
    if bp:
        count = 0
        for name, info in complete:
            if count >= limit_per_bp:
                break
            compressed = compress_definition(info["def"], 120)
            if len(compressed) < 16:
                continue
            distractors = select_construction_distractors(compressed, all_defs, info["category"])
            if len(distractors) < 3:
                continue
            options = [compressed] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(compressed)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("construction", bp, name, opts, correct_idx,
                f"「{name}」：{compressed}",
                "backHtml", f"(entity={name}, relation=defined_as, value={compressed[:80]}...)")
            questions.append(q)
            count += 1

    return questions


# ============================================================================
# Planning Generator (numeric clusters!)
# ============================================================================

def generate_planning(facts, blueprints, limit_per_bp=MAX_PER_BLUEPRINT):
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "planning"}
    questions = []

    # Build numeric clusters
    cluster_map = build_numeric_clusters(facts)

    # Collect all planning facts
    numeric = [(f["entityName"], f["value"]) for f in facts
               if f["subject"] == "planning" and f["relation"] == "standard_value"
               and re.search(r'\d', f["value"])]  # Must contain actual numbers
    conceptual = [(f["entityName"], f["value"]) for f in facts
                  if f["subject"] == "planning" and f["relation"] == "defined_as"
                  and len(f["value"]) >= 20]  # Must be substantive definitions
    all_num_values = [v for _, v in numeric]
    random.shuffle(numeric)
    random.shuffle(conceptual)

    # Numeric four-choice (cluster-based)
    bp = bp_map.get("number_four_choice")
    if bp:
        count = 0
        for name, value in numeric:
            if count >= limit_per_bp:
                break
            distractors = select_planning_distractors(value, all_num_values, cluster_map, name)
            if len(distractors) < 3:
                continue
            options = [value] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(value)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("planning", bp, name, opts, correct_idx,
                f"「{name}」の基準値は{value}。",
                "description", f"(entity={name}, relation=standard_value, value={value})")
            questions.append(q)
            count += 1

    # Concept four-choice
    bp = bp_map.get("concept_four_choice")
    if bp:
        count = 0
        for name, value in conceptual:
            if count >= limit_per_bp:
                break
            val = value[:120] if len(value) > 120 else value
            if len(val) < 20:
                continue
            all_vals = [v[:120] for _, v in conceptual if v[:120] != val and len(v) >= 20]
            random.shuffle(all_vals)
            distractors = all_vals[:3]
            if len(distractors) < 3:
                continue
            options = [val] + distractors
            random.shuffle(options)
            correct_idx = options.index(val)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("planning", bp, name, opts, correct_idx,
                f"「{name}」：{val}",
                "description", f"(entity={name}, relation=defined_as, value={val[:80]}...)")
            questions.append(q)
            count += 1

    return questions


# ============================================================================
# Environment Generator
# ============================================================================

def generate_environment(facts, blueprints, limit_per_bp=MAX_PER_BLUEPRINT):
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "environment"}
    questions = []

    formulas = [(f["entityName"], f["value"]) for f in facts
                if f["subject"] == "environment" and f["relation"] == "formula_text"]
    all_formulas = [fv for _, fv in formulas]
    random.shuffle(formulas)

    bp = bp_map.get("quantity_to_formula")
    if bp:
        count = 0
        for name, formula in formulas:
            if count >= limit_per_bp:
                break
            distractors = select_environment_distractors(formula, all_formulas)
            if len(distractors) < 3:
                continue
            options = [formula] + distractors[:3]
            random.shuffle(options)
            correct_idx = options.index(formula)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]
            q = _make_question("environment", bp, name, opts, correct_idx,
                f"「{name}」の公式：{formula}",
                "formula", f"(entity={name}, relation=formula_text, value={formula})")
            questions.append(q)
            count += 1

    return questions


# ============================================================================
# Helpers
# ============================================================================

def _make_question(subject, bp, entity_name, options, correct_idx, explanation, source_field, fact_str):
    """Build a draft question dict."""
    prompt_templates = {
        "building_to_architect": f"次の建築の設計者・関連人物として、最も適切なものを一つ選びなさい。\n\n{entity_name}",
        "building_to_period": f"次の建築の建設・成立年代として、最も適切なものを一つ選びなさい。\n\n{entity_name}",
        "building_style_pairing": f"次の建築の建築様式・類型として、最も適切なものを一つ選びなさい。\n\n{entity_name}",
        "architect_to_work": f"次の建築家・人物の代表作として、最も適切なものを一つ選びなさい。\n\n{entity_name}",
        "term_to_category": f"次の建築構法用語が属する分類として、最も適切なものを一つ選びなさい。\n\n「{entity_name}」",
        "term_to_definition": f"次の建築構法用語「{entity_name}」の説明として、最も適切なものを一つ選びなさい。",
        "number_four_choice": f"建築計画における「{entity_name}」について、最も適切なものを一つ選びなさい。",
        "concept_four_choice": f"次の建築計画用語・事例「{entity_name}」の説明として、最も適切なものを一つ選びなさい。",
        "quantity_to_formula": f"「{entity_name}」を表す式として、最も適切なものを一つ選びなさい。",
    }
    prompt = prompt_templates.get(bp["id"], f"次の問題に答えなさい。\n\n{entity_name}")

    return {
        "id": f"q-{subject}-{bp['id']}-{entity_name[:20]}",
        "subject": subject,
        "blueprintId": bp["id"],
        "question": {
            "prompt": prompt,
            "options": options,
            "correctIndex": correct_idx,
            "answerExplanation": explanation,
        },
        "distractorRationale": {},
        "validation": {"issues": [], "optLog": []},
        "qualityScore": 0,
        "qualityPassed": False,
        "traceability": {
            "originalSource": f"atomic-facts.json",
            "originalField": source_field,
            "extractedFacts": [fact_str],
            "blueprint": bp["id"],
            "blueprintOccurrences": bp.get("occurrences", [])[:3],
            "confidence": "high",
        },
    }


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 60)
    print("Phase 3: Full Question Generation + Optimizer")
    print("=" * 60)

    # Load data
    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]
    with open(BLUEPRINTS_PATH, "r", encoding="utf-8") as f:
        blueprints = json.load(f)["blueprints"]

    candidate_facts = []
    if CANDIDATES_PATH.exists():
        with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
            candidate_facts = json.load(f).get("candidates", [])

    print(f"\nFacts: {len(facts)}, Blueprints: {len(blueprints)}, Candidates: {len(candidate_facts)}")

    # Build numeric clusters for planning
    cluster_map = build_numeric_clusters(facts)
    print(f"Planning clusters: {len(cluster_map)}")

    # Generate
    all_drafts = []
    print("\n--- Generating ---")

    hq = generate_history(facts, blueprints)
    print(f"  History drafts: {len(hq)}")
    all_drafts.extend(hq)

    cq = generate_construction(facts, blueprints, candidate_facts)
    print(f"  Construction drafts: {len(cq)}")
    all_drafts.extend(cq)

    pq = generate_planning(facts, blueprints)
    print(f"  Planning drafts: {len(pq)}")
    all_drafts.extend(pq)

    eq = generate_environment(facts, blueprints)
    print(f"  Environment drafts: {len(eq)}")
    all_drafts.extend(eq)

    print(f"\nTotal drafts: {len(all_drafts)}")

    # --- Run Optimizer ---
    print("\n--- Optimizing ---")
    optimized = []
    rejected = []
    for i, draft in enumerate(all_drafts):
        opt_draft, score, log = optimize_question(draft, facts, cluster_map, candidate_facts)
        if score >= 70:
            optimized.append(opt_draft)
        else:
            rejected.append({"id": draft["id"], "score": score, "issues": draft["validation"]["issues"]})

        if (i + 1) % 100 == 0:
            print(f"  Processed {i+1}/{len(all_drafts)}...")

    print(f"  Passed (≥70): {len(optimized)}")
    print(f"  Rejected (<70): {len(rejected)}")

    # --- Stats ---
    by_subject = Counter(q["subject"] for q in optimized)
    by_blueprint = Counter(q["blueprintId"] for q in optimized)
    quality_scores = [q["qualityScore"] for q in optimized]
    avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0

    print(f"\n--- Final Pool ---")
    for subj in ["history", "construction", "planning", "environment"]:
        print(f"  [{subj}]: {by_subject.get(subj, 0)}")
    print(f"  Average Quality: {avg_quality:.0f}")
    if rejected:
        low_scores = Counter(r["score"] for r in rejected)
        print(f"  Rejected scores: {dict(sorted(low_scores.items()))}")

    # --- Write ---
    output = {
        "version": 2,
        "generatedAt": datetime.now().isoformat(),
        "totalQuestions": len(optimized),
        "averageQuality": round(avg_quality, 1),
        "rejectedCount": len(rejected),
        "questions": optimized,
    }
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ {OUTPUT_JSON}")

    # --- Report ---
    report = f"""# Question Generation Report (Phase 3)

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

| Metric | Count |
|--------|-------|
| Drafts generated | {len(all_drafts)} |
| Passed (Quality ≥ 70) | {len(optimized)} |
| Rejected | {len(rejected)} |
| Average Quality | {avg_quality:.0f} |

## By Subject

| Subject | Count |
|---------|-------|
"""
    for subj in ["history", "construction", "planning", "environment"]:
        report += f"| {subj} | {by_subject.get(subj, 0)} |\n"

    report += f"""
## By Blueprint

| Blueprint | Count |
|-----------|-------|
"""
    bp_names = {bp["id"]: bp["name"] for bp in blueprints}
    for bpid, cnt in sorted(by_blueprint.items(), key=lambda x: -x[1]):
        report += f"| {bp_names.get(bpid, bpid)} | {cnt} |\n"

    if rejected:
        report += f"""
## Rejected Questions (Quality < 70)

| ID | Score | Issues |
|----|-------|--------|
"""
        for r in rejected[:30]:
            issues = ", ".join(r["issues"][:3])
            report += f"| {r['id']} | {r['score']} | {issues} |\n"
        if len(rejected) > 30:
            report += f"| ... | | +{len(rejected)-30} more |\n"

    report += """
## Quality Score Distribution

"""
    score_buckets = Counter()
    for s in quality_scores:
        bucket = (s // 10) * 10
        score_buckets[bucket] += 1
    for bucket in sorted(score_buckets.keys()):
        bar = "█" * score_buckets[bucket]
        report += f"- {bucket:3d}-{bucket+9:3d}: {bar} ({score_buckets[bucket]})\n"

    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ {OUTPUT_REPORT}")


if __name__ == "__main__":
    main()
