#!/usr/bin/env python3
"""
Preview Question Generator
==========================
Generates 20 preview questions per subject from atomic facts + blueprints.
Each question includes full traceability: source → facts → blueprint → question → validation.

Usage: python scripts/generate-preview.py
Output: data/preview-questions.json, data/preview-report.md
"""

import json, re, sys, io, os, random
from pathlib import Path
from collections import defaultdict
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

random.seed(42)  # Reproducible

BASE = Path(__file__).parent.parent
DATA = BASE / "data"

FACTS_PATH = DATA / "atomic-facts.json"
BLUEPRINTS_PATH = DATA / "question-blueprints.json"
OUTPUT_JSON = DATA / "preview-questions.json"
OUTPUT_REPORT = DATA / "preview-report.md"

# ============================================================================
# Distractor strategies (per blueprint)
# ============================================================================

def pick_distractors(correct_value, candidates, strategy, count=3):
    """
    Pick count distractors from candidates that are:
    - Not equal to correct_value
    - Not empty
    - Compatible with the strategy
    """
    candidates = [c for c in candidates if c and c != correct_value]
    if len(candidates) < count:
        return []

    if strategy == "same_type_peer":
        # For person/style/period: prefer same-era, same-type
        # In preview: just pick diverse candidates
        result = []
        for c in candidates:
            if len(result) >= count:
                break
            if c not in result:
                result.append(c)
        # If not enough, pad from remaining
        remaining = [c for c in candidates if c not in result]
        result.extend(remaining[:count - len(result)])
        return result[:count]

    elif strategy == "numeric_neighbor":
        try:
            correct_num = float(re.sub(r'[^\d.]', '', str(correct_value)))
        except:
            return candidates[:count]
        # Find close and far values
        nums = []
        for c in candidates:
            try:
                n = float(re.sub(r'[^\d.]', '', str(c)))
                nums.append((abs(n - correct_num), c))
            except:
                nums.append((99999, c))
        nums.sort()
        return [c for _, c in nums[:count]]

    elif strategy == "definition_similar":
        # Prefer candidates of similar length
        c_len = len(correct_value)
        scored = [(abs(len(c) - c_len), c) for c in candidates]
        scored.sort()
        return [c for _, c in scored[:count]]

    elif strategy == "category_peer":
        return candidates[:count]

    elif strategy == "word_bank_surplus":
        return candidates[:max(count, 5)]  # word banks need surplus

    elif strategy == "formula_structural":
        # Prefer formulas with similar variable structure
        return candidates[:count]

    else:
        return candidates[:count]


def make_options(correct, distractors):
    """Make A/B/C/D options, correct randomly placed"""
    options = [correct] + distractors
    random.shuffle(options)
    correct_idx = options.index(correct)
    labels = []
    for i, opt in enumerate(options):
        labels.append(f"{chr(65+i)}. {opt}")
    return labels, correct_idx


def validate_question(question, options, correct_idx, facts):
    """Run validation rules. Returns list of issues."""
    issues = []
    # Unique answer
    if options.count(options[correct_idx]) > 1:
        issues.append("DUPLICATE_ANSWER")
    # No empty options
    if any(not o.strip() for o in options):
        issues.append("EMPTY_OPTION")
    # No leak in prompt (correct answer text shouldn't appear in prompt)
    correct_text = options[correct_idx].split(". ", 1)[-1] if ". " in options[correct_idx] else options[correct_idx]
    if len(correct_text) >= 4 and correct_text in question.get("prompt", ""):
        issues.append("ANSWER_LEAKED_IN_PROMPT")
    # Option length balance (warn if any option is >2x the shortest)
    opt_lens = [len(o) for o in options]
    if opt_lens and max(opt_lens) > min(opt_lens) * 2.5:
        issues.append("OPTION_LENGTH_UNBALANCED")
    # Source evidence exists
    if not facts:
        issues.append("NO_SOURCE_EVIDENCE")
    return issues


# ============================================================================
# Question templates per blueprint
# ============================================================================

def generate_history_questions(facts_by_entity, blueprints):
    """Generate history preview questions using building/person/style facts."""
    questions = []
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "history"}

    # Group facts by relation
    buildings = defaultdict(lambda: {"name": "", "period": "", "style": "", "people": "", "original": ""})
    for f in facts_by_entity:
        name = f["entityName"]
        rel = f["relation"]
        val = f["value"]
        if rel == "built_in":
            buildings[name]["name"] = name
            buildings[name]["period"] = val
        elif rel == "has_style":
            buildings[name]["name"] = name
            buildings[name]["style"] = val
        elif rel == "designed_by":
            buildings[name]["name"] = name
            buildings[name]["people"] = val
        elif rel == "has_original_name":
            buildings[name]["original"] = val

    # Filter to buildings with complete data
    complete = []
    for name, info in buildings.items():
        if info["people"] and info["style"]:
            complete.append((name, info))
    random.shuffle(complete)

    # Generate building→architect questions
    count = 0
    for name, info in complete:
        if count >= 6:
            break
        bp = bp_map.get("building_to_architect")
        if not bp or not info["people"]:
            continue
        # Find distractors (other architects)
        all_people = list(set(b["people"] for _, b in complete if b["people"] and b["people"] != info["people"]))
        distractors = pick_distractors(info["people"], all_people, "same_type_peer", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(info["people"], distractors)
        q = {
            "id": f"preview-history-{count+1:02d}",
            "subject": "history",
            "blueprintId": bp["id"],
            "sourceFacts": [f["id"] for f in facts_by_entity if f["entityName"] == name and f["relation"] == "designed_by"],
            "question": {
                "prompt": f"次の建築の設計者・関連人物として、最も適切なものを一つ選びなさい。\n\n{name}",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"{name}の設計者は{info['people']}。",
            },
            "distractorRationale": {opt.split(". ")[0]: "同時代・異なる建築家" for opt in options if opt != options[correct_idx]},
            "validation": {},
            "traceability": {
                "originalSource": f"anki-notes.json → history deck",
                "originalField": "people",
                "extractedFacts": [f"(entity={name}, relation=designed_by, value={info['people']})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "high",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    # Generate building→period questions
    count = 0
    for name, info in complete:
        if count >= 5:
            break
        bp = bp_map.get("building_to_period")
        if not bp or not info["period"]:
            continue
        all_periods = list(set(b["period"] for _, b in complete if b["period"] and b["period"] != info["period"]))
        distractors = pick_distractors(info["period"], all_periods, "same_type_peer", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(info["period"], distractors)
        q = {
            "id": f"preview-history-{count+7:02d}",
            "subject": "history",
            "blueprintId": bp["id"],
            "sourceFacts": [f["id"] for f in facts_by_entity if f["entityName"] == name and f["relation"] == "built_in"],
            "question": {
                "prompt": f"次の建築の建設・成立年代として、最も適切なものを一つ選びなさい。\n\n{name}",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"{name}は{info['period']}に建設された。",
            },
            "distractorRationale": {opt.split(". ")[0]: "同時代・異なる建築の時代" for opt in options if opt != options[correct_idx]},
            "validation": {},
            "traceability": {
                "originalSource": "anki-notes.json",
                "originalField": "period",
                "extractedFacts": [f"(entity={name}, relation=built_in, value={info['period']})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "high",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    # Generate architect→building questions
    count = 0
    person_buildings = defaultdict(list)
    for name, info in complete:
        if info["people"]:
            person_buildings[info["people"]].append(name)
    persons = [(p, bs) for p, bs in person_buildings.items() if len(bs) >= 1]
    random.shuffle(persons)
    for person, bldgs in persons:
        if count >= 5:
            break
        bp = bp_map.get("architect_to_work")
        if not bp:
            continue
        correct_building = bldgs[0]
        all_buildings = [name for name, _ in complete if name != correct_building]
        distractors = pick_distractors(correct_building, all_buildings, "same_type_peer", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(correct_building, distractors)
        q = {
            "id": f"preview-history-{count+12:02d}",
            "subject": "history",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"次の建築家・人物の代表作として、最も適切なものを一つ選びなさい。\n\n{person}",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"{person}の代表作は{correct_building}。",
            },
            "distractorRationale": {opt.split(". ")[0]: "異なる建築家の作品" for opt in options if opt != options[correct_idx]},
            "validation": {},
            "traceability": {
                "originalSource": "anki-notes.json",
                "originalField": "people",
                "extractedFacts": [f"(entity={person}, relation=designed, value={correct_building})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "high",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    # Generate building→style questions
    count = 0
    for name, info in complete:
        if count >= 4:
            break
        bp = bp_map.get("building_style_pairing")
        if not bp or not info["style"]:
            continue
        all_styles = list(set(b["style"] for _, b in complete if b["style"] and b["style"] != info["style"]))
        distractors = pick_distractors(info["style"], all_styles, "same_type_peer", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(info["style"], distractors)
        q = {
            "id": f"preview-history-{count+17:02d}",
            "subject": "history",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"次の建築の建築様式・類型として、最も適切なものを一つ選びなさい。\n\n{name}",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"{name}の様式は{info['style']}。",
            },
            "distractorRationale": {},
            "validation": {},
            "traceability": {
                "originalSource": "anki-notes.json",
                "originalField": "style",
                "extractedFacts": [f"(entity={name}, relation=has_style, value={info['style']})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "high",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    return questions


def generate_construction_questions(facts, blueprints):
    questions = []
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "construction"}

    # Group by term
    terms = defaultdict(lambda: {"category": "", "def": ""})
    for f in facts:
        if f["subject"] != "construction":
            continue
        name = f["entityName"]
        if f["relation"] == "belongs_to":
            terms[name]["category"] = f["value"]
        elif f["relation"] == "defined_as":
            terms[name]["def"] = f["value"]  # Allow candidates for preview

    complete = [(name, info) for name, info in terms.items() if info["category"] and info["def"]]
    random.shuffle(complete)

    # Term→category questions
    count = 0
    for name, info in complete:
        if count >= 10:
            break
        bp = bp_map.get("term_to_category")
        if not bp:
            continue
        all_cats = list(set(t["category"] for _, t in complete if t["category"] != info["category"]))
        distractors = pick_distractors(info["category"], all_cats, "category_peer", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(info["category"], distractors)
        q = {
            "id": f"preview-construction-{count+1:02d}",
            "subject": "construction",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"次の建築構法用語が属する分類として、最も適切なものを一つ選びなさい。\n\n「{name}」",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"「{name}」は「{info['category']}」に分類される。",
            },
            "distractorRationale": {},
            "validation": {},
            "traceability": {
                "originalSource": "construction-anki-notes.json",
                "originalField": "category",
                "extractedFacts": [f"(entity={name}, relation=belongs_to, value={info['category']})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "high",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    # Term→definition questions
    count = 0
    for name, info in complete:
        if count >= 10:
            break
        bp = bp_map.get("term_to_definition")
        if not bp or not info["def"] or len(info["def"]) < 16:
            continue
        all_defs = [t["def"] for _, t in complete if t["def"] != info["def"] and len(t["def"]) >= 10]
        distractors = pick_distractors(info["def"], all_defs, "definition_similar", 3)
        if len(distractors) < 3:
            continue
        # Truncate to 150 chars for readability
        options, correct_idx = make_options(info["def"][:150], [d[:150] for d in distractors])
        q = {
            "id": f"preview-construction-{count+11:02d}",
            "subject": "construction",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"次の建築構法用語「{name}」の説明として、最も適切なものを一つ選びなさい。",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"「{name}」：{info['def'][:200]}",
            },
            "distractorRationale": {},
            "validation": {},
            "traceability": {
                "originalSource": "construction-anki-notes.json",
                "originalField": "backHtml",
                "extractedFacts": [f"(entity={name}, relation=defined_as, value={info['def'][:100]}...)"] if info["def"] else [],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "medium",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    return questions


def generate_planning_questions(facts, blueprints):
    questions = []
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "planning"}

    numeric = [(f["entityName"], f["value"]) for f in facts
               if f["subject"] == "planning" and f["relation"] == "standard_value"]
    conceptual = [(f["entityName"], f["value"]) for f in facts
                  if f["subject"] == "planning" and f["relation"] == "defined_as"]

    random.shuffle(numeric)
    random.shuffle(conceptual)

    # Numeric four-choice
    count = 0
    for name, value in numeric:
        if count >= 10:
            break
        bp = bp_map.get("number_four_choice")
        if not bp:
            continue
        all_vals = [v for _, v in numeric if v != value]
        distractors = pick_distractors(value, all_vals, "numeric_neighbor", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(value, distractors)
        q = {
            "id": f"preview-planning-{count+1:02d}",
            "subject": "planning",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"建築計画における「{name}」について、最も適切なものを一つ選びなさい。",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"「{name}」の基準値は{value}。",
            },
            "distractorRationale": {},
            "validation": {},
            "traceability": {
                "originalSource": "planning card → building_cache.json or anki-notes.json",
                "originalField": "style / description",
                "extractedFacts": [f"(entity={name}, relation=standard_value, value={value})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "medium",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    # Concept four-choice
    count = 0
    for name, value in conceptual:
        if count >= 10:
            break
        bp = bp_map.get("concept_four_choice")
        if not bp or len(value) < 20:
            continue
        all_vals = [v for _, v in conceptual if v != value and len(v) >= 10]
        distractors = pick_distractors(value, all_vals, "definition_similar", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(value[:150], [d[:150] for d in distractors])
        q = {
            "id": f"preview-planning-{count+11:02d}",
            "subject": "planning",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"次の建築計画用語・事例「{name}」の説明として、最も適切なものを一つ選びなさい。",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"「{name}」：{value[:200]}",
            },
            "distractorRationale": {},
            "validation": {},
            "traceability": {
                "originalSource": "planning card → building_cache.json or anki-notes.json",
                "originalField": "description / style",
                "extractedFacts": [f"(entity={name}, relation=defined_as, value={value[:100]}...)"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "medium",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    return questions


def generate_environment_questions(facts, blueprints):
    questions = []
    bp_map = {bp["id"]: bp for bp in blueprints if bp["subject"] == "environment"}

    formulas = [(f["entityName"], f["value"]) for f in facts
                if f["subject"] == "environment" and f["relation"] == "formula_text"]
    random.shuffle(formulas)

    # Formula → quantity selection
    count = 0
    for name, formula in formulas:
        if count >= 20:
            break
        bp = bp_map.get("formula_to_quantity") or bp_map.get("quantity_to_formula")
        if not bp:
            continue

        # Use quantity_to_formula: "what formula computes X?"
        bp = bp_map.get("quantity_to_formula")
        if not bp:
            continue
        all_formulas = [f for _, f in formulas if f != formula]
        distractors = pick_distractors(formula, all_formulas, "formula_structural", 3)
        if len(distractors) < 3:
            continue
        options, correct_idx = make_options(formula, distractors)
        q = {
            "id": f"preview-environment-{count+1:02d}",
            "subject": "environment",
            "blueprintId": bp["id"],
            "sourceFacts": [],
            "question": {
                "prompt": f"「{name}」を表す式として、最も適切なものを一つ選びなさい。",
                "options": options,
                "correctIndex": correct_idx,
                "answerExplanation": f"「{name}」の公式：{formula}",
            },
            "distractorRationale": {},
            "validation": {},
            "traceability": {
                "originalSource": "environment-knowledge.ts → FORMULA_CARDS",
                "originalField": "formula",
                "extractedFacts": [f"(entity={name}, relation=formula_text, value={formula})"],
                "blueprint": bp["id"],
                "blueprintOccurrences": bp.get("occurrences", [])[:3],
                "confidence": "high",
            },
        }
        q["validation"] = {"issues": validate_question(q["question"], options, correct_idx, q["sourceFacts"])}
        questions.append(q)
        count += 1

    return questions


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 60)
    print("Preview Question Generator")
    print("=" * 60)

    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        fact_store = json.load(f)
    facts = fact_store["facts"]
    print(f"\nLoaded {len(facts)} confirmed facts")

    # Also load candidates for construction term definitions
    cands_path = DATA / "candidate-facts.json"
    candidate_facts = []
    if cands_path.exists():
        with open(cands_path, "r", encoding="utf-8") as f:
            candidate_facts = json.load(f).get("candidates", [])
    # Filter to only construction defined_as candidates (medium confidence for preview)
    construction_defs = [c for c in candidate_facts
                        if c["subject"] == "construction"
                        and c["relation"] == "defined_as"
                        and len(c.get("value", "")) >= 16]
    facts = facts + construction_defs
    print(f"Loaded {len(construction_defs)} construction definition candidates")

    with open(BLUEPRINTS_PATH, "r", encoding="utf-8") as f:
        bp_store = json.load(f)
    blueprints = bp_store["blueprints"]
    print(f"Loaded {len(blueprints)} blueprints")

    # Generate per subject
    all_questions = []

    print("\nGenerating history...")
    hq = generate_history_questions(facts, blueprints)
    all_questions.extend(hq)
    print(f"  {len(hq)} questions")

    print("Generating construction...")
    cq = generate_construction_questions(facts, blueprints)
    all_questions.extend(cq)
    print(f"  {len(cq)} questions")

    print("Generating planning...")
    pq = generate_planning_questions(facts, blueprints)
    all_questions.extend(pq)
    print(f"  {len(pq)} questions")

    print("Generating environment...")
    eq = generate_environment_questions(facts, blueprints)
    all_questions.extend(eq)
    print(f"  {len(eq)} questions")

    # Stats
    by_subject = defaultdict(int)
    by_blueprint = defaultdict(int)
    validation_issues = defaultdict(int)
    for q in all_questions:
        by_subject[q["subject"]] += 1
        by_blueprint[q["blueprintId"]] += 1
        for issue in q.get("validation", {}).get("issues", []):
            validation_issues[issue] += 1

    print(f"\n{'='*60}")
    print(f"Total preview questions: {len(all_questions)}")
    for subj in ["history", "construction", "planning", "environment"]:
        print(f"  [{subj}]: {by_subject.get(subj, 0)}")
    print(f"\nBy blueprint:")
    for bpid, cnt in sorted(by_blueprint.items()):
        bp_name = next((bp["name"] for bp in blueprints if bp["id"] == bpid), bpid)
        print(f"  {bp_name}: {cnt}")
    if validation_issues:
        print(f"\nValidation issues:")
        for issue, cnt in validation_issues.items():
            print(f"  {issue}: {cnt}")

    # Write JSON
    output = {
        "version": 1,
        "generatedAt": datetime.now().isoformat(),
        "totalQuestions": len(all_questions),
        "questions": all_questions,
    }
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ {OUTPUT_JSON}")

    # Write Markdown report
    report = f"""# Preview Question Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

| Metric | Count |
|--------|-------|
| Total preview questions | {len(all_questions)} |
| History | {by_subject.get('history', 0)} |
| Construction | {by_subject.get('construction', 0)} |
| Planning | {by_subject.get('planning', 0)} |
| Environment | {by_subject.get('environment', 0)} |

## By Blueprint

| Blueprint | Count |
|-----------|-------|
"""
    for bpid, cnt in sorted(by_blueprint.items(), key=lambda x: -x[1]):
        bp_name = next((bp["name"] for bp in blueprints if bp["id"] == bpid), bpid)
        report += f"| {bp_name} ({bpid}) | {cnt} |\n"

    if validation_issues:
        report += f"""
## Validation Issues

| Issue | Count |
|-------|-------|
"""
        for issue, cnt in validation_issues.items():
            report += f"| {issue} | {cnt} |\n"

    report += f"""
## Per-Question Details

"""
    for q in all_questions:
        qdata = q["question"]
        trace = q["traceability"]
        report += f"""### {q['id']} — {q['subject']} / {q['blueprintId']}

**Prompt:** {qdata['prompt'][:200]}

**Options:**
"""
        for opt in qdata["options"]:
            marker = " ← 正解" if qdata["options"].index(opt) == qdata["correctIndex"] else ""
            report += f"- {opt}{marker}\n"

        issues = q.get("validation", {}).get("issues", [])
        report += f"""
**Answer Explanation:** {qdata.get('answerExplanation', 'N/A')}

**Traceability:**
- Source: {trace.get('originalSource', 'N/A')}
- Field: {trace.get('originalField', 'N/A')}
- Facts: {', '.join(trace.get('extractedFacts', []))}
- Confidence: {trace.get('confidence', 'N/A')}
- Validation Issues: {', '.join(issues) if issues else 'None'}

---
"""

    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ {OUTPUT_REPORT}")


if __name__ == "__main__":
    main()
