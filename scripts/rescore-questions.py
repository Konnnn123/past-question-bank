#!/usr/bin/env python3
"""
Dual Quality Rescorer
=====================
Reads data/questions.json, computes technicalQuality + pedagogicalQuality
for each question, and writes back with both scores.

technicalQuality  (automated): source integrity, uniqueness, no leaks, format
pedagogicalQuality (heuristic): distractor plausibility, exam relevance, difficulty

Usage: python scripts/rescore-questions.py
"""

import json, re, sys, io
from pathlib import Path
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent
QUESTIONS_PATH = BASE / "data" / "questions.json"
BLUEPRINTS_PATH = BASE / "data" / "question-blueprints.json"
FACTS_PATH = BASE / "data" / "atomic-facts.json"

# ============================================================================
# technicalQuality (100 pts)
# ============================================================================

def score_technical(q):
    score = 100
    details = []

    trace = q.get("traceability", {})
    qdata = q.get("question", {})
    options = qdata.get("options", [])
    correct_idx = qdata.get("correctIndex", 0)
    issues = q.get("validation", {}).get("issues", [])

    # Source integrity (15)
    if not trace.get("originalSource") or not trace.get("originalField"):
        score -= 15
        details.append("MISSING_SOURCE")
    else:
        details.append("SOURCE_OK")

    # Unique answer (20)
    issue_str = " ".join(issues)
    if "DUPLICATE_ANSWER" in issue_str or "CORRECT_APPEARS_AS_DISTRACTOR" in issue_str:
        score -= 20
        details.append("ANSWER_NOT_UNIQUE")
    else:
        details.append("ANSWER_UNIQUE")

    # No duplicates (15)
    if "DUPLICATE_OPTIONS" in issue_str:
        score -= 15
        details.append("HAS_DUPLICATES")
    else:
        details.append("NO_DUPLICATES")

    # No leaks (15)
    if "LEAK_WORD" in issue_str or "ANSWER_LEAKED" in issue_str:
        score -= 15
        details.append("ANSWER_LEAKED")
    else:
        details.append("NO_LEAKS")

    # Option type consistency (15)
    if options and len(options) >= 4:
        # Check if all options share similar structure (all people, all styles, etc.)
        opt_texts = [o.split(". ", 1)[-1] if ". " in o else o for o in options]
        # Heuristic: all numeric or all text-based
        numeric_count = sum(1 for o in opt_texts if re.search(r'\d', o))
        if numeric_count in (0, len(opt_texts)):
            details.append("TYPE_CONSISTENT")
        else:
            score -= 10
            details.append("TYPE_MIXED")
    else:
        score -= 15
        details.append("INSUFFICIENT_OPTIONS")

    # Length balance (10)
    if options:
        opt_lens = [len(o) for o in options]
        if opt_lens and max(opt_lens) > 0:
            ratio = max(opt_lens) / max(1, min(opt_lens))
            if ratio > 2.5:
                score -= 10
                details.append(f"LENGTH_UNBALANCED_{ratio:.1f}x")
            else:
                details.append("LENGTH_BALANCED")

    # Format valid (10)
    if not options or len(options) < 4:
        score -= 10
        details.append("TOO_FEW_OPTIONS")
    if any(not o.strip() for o in options):
        score -= 10
        details.append("EMPTY_OPTION")
    if "EMPTY_OPTION" not in issue_str and "TOO_FEW_OPTIONS" not in details:
        details.append("FORMAT_OK")

    return max(0, score), details


# ============================================================================
# pedagogicalQuality (100 pts) — heuristic auto-scoring
# ============================================================================

def score_pedagogical(q, facts, blueprints):
    score = 100
    details = []

    qdata = q.get("question", {})
    options = qdata.get("options", [])
    correct_idx = qdata.get("correctIndex", 0)
    subject = q.get("subject", "")
    bp_id = q.get("blueprintId", "")
    prompt = qdata.get("prompt", "")

    # Find blueprint
    bp = next((b for b in blueprints if b["id"] == bp_id), None)

    # Distractor same type (20)
    if options and len(options) >= 4:
        opt_texts = [o.split(". ", 1)[-1] if ". " in o else o for o in options]
        # Check if distractors are same entity type as correct answer
        correct_text = opt_texts[correct_idx] if correct_idx < len(opt_texts) else ""

        # Type detection
        def detect_type(text):
            if re.search(r'\d{4}', text): return "year"
            if re.search(r'\d世紀', text): return "century"
            if re.search(r'[mM]\d|㎡|m²|m³|cm|mm|席|人|台|％|%|W/|kW|dB|lx|Pa|kg|N/', text): return "numeric"
            if re.search(r'[=＝]', text): return "formula"
            if len(text) > 60: return "description"
            if re.search(r'主義|様式|スタイル|建築|ゴシック|ルネサ|バロック|モダニ', text): return "style"
            return "name"

        types = [detect_type(t) for t in opt_texts]
        if len(set(types)) <= 2:
            score -= 0
            details.append("DISTRACTOR_TYPE_CONSISTENT")
        elif len(set(types)) <= 3:
            score -= 10
            details.append("DISTRACTOR_TYPE_SLIGHTLY_MIXED")
        else:
            score -= 20
            details.append("DISTRACTOR_TYPE_MIXED")

    # Era/category proximity (15)
    # Heuristic: if distractors share era keywords with correct answer
    if subject == "history" and options:
        correct_text = opt_texts[correct_idx] if correct_idx < len(opt_texts) else ""
        era_kw = set(re.findall(r'\d{1,2}世紀|古代|中世|近世|近代|現代|明治|大正|昭和|平成|令和|ゴシック|ルネサ|バロック|ロマネ|モダニ', correct_text))
        distractor_eras = []
        for i, o in enumerate(opt_texts):
            if i != correct_idx:
                d_era = set(re.findall(r'\d{1,2}世紀|古代|中世|近世|近代|現代|明治|大正|昭和|平成|令和|ゴシック|ルネサ|バロック|ロマネ|モダニ', o))
                distractor_eras.append(d_era)
        if era_kw and distractor_eras:
            overlap_count = sum(1 for d in distractor_eras if d & era_kw)
            if overlap_count >= 2:
                details.append("ERA_PROXIMITY_GOOD")
            elif overlap_count >= 1:
                score -= 5
                details.append("ERA_PROXIMITY_PARTIAL")
            else:
                score -= 10
                details.append("ERA_PROXIMITY_POOR")
    else:
        details.append("ERA_PROXIMITY_N/A")

    # Difficulty not trivial (15)
    if options:
        opt_lens = [len(o) for o in options]
        correct_len = opt_lens[correct_idx] if correct_idx < len(opt_lens) else 0
        avg_len = sum(opt_lens) / len(opt_lens) if opt_lens else 1
        # If correct is uniquely short or long, it's too easy
        if correct_len < avg_len * 0.3 and correct_len > 0:
            score -= 15
            details.append("CORRECT_OBVIOUSLY_SHORT")
        elif correct_len > avg_len * 2.5:
            score -= 10
            details.append("CORRECT_OBVIOUSLY_LONG")
        else:
            details.append("DIFFICULTY_OK")

    # Exam relevance (15)
    if bp and bp.get("occurrenceCount", 0) > 0:
        score -= 0
        details.append(f"EXAM_VERIFIED_{bp['occurrenceCount']}x")
    elif bp and bp.get("occurrenceCount", 0) == 0:
        score -= 10
        details.append("BLUEPRINT_NOT_EXAM_VERIFIED")
    else:
        score -= 15
        details.append("NO_BLUEPRINT")

    # Review value (15)
    trace = q.get("traceability", {})
    if trace.get("confidence") == "high":
        details.append("HIGH_CONFIDENCE_SOURCE")
    elif trace.get("confidence") == "medium":
        score -= 5
        details.append("MEDIUM_CONFIDENCE_SOURCE")
    else:
        score -= 10
        details.append("LOW_CONFIDENCE_SOURCE")

    # No unrelated long text (10)
    if options:
        max_len = max(len(o) for o in options)
        if max_len <= 120:
            details.append("OPTIONS_CONCISE")
        elif max_len <= 150:
            score -= 3
            details.append("OPTIONS_SLIGHTLY_LONG")
        else:
            score -= 10
            details.append("OPTIONS_TOO_LONG")

    # Option granularity (10)
    if options and len(options) >= 4:
        opt_texts = [o.split(". ", 1)[-1] if ". " in o else o for o in options]
        opt_lens = [len(o) for o in opt_texts]
        if opt_lens:
            cv = (max(opt_lens) - min(opt_lens)) / max(1, sum(opt_lens) / len(opt_lens))
            if cv < 0.8:
                details.append("GRANULARITY_GOOD")
            elif cv < 1.5:
                score -= 5
                details.append("GRANULARITY_FAIR")
            else:
                score -= 10
                details.append("GRANULARITY_POOR")

    return max(0, score), details


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 60)
    print("Dual Quality Rescorer")
    print("=" * 60)

    with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
        store = json.load(f)

    with open(BLUEPRINTS_PATH, "r", encoding="utf-8") as f:
        blueprints = json.load(f)["blueprints"]

    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]

    questions = store["questions"]
    print(f"\nLoaded {len(questions)} questions")

    # Score each question
    approved = 0
    flagged = 0
    t_scores = []
    p_scores = []

    for q in questions:
        t_score, t_details = score_technical(q)
        p_score, p_details = score_pedagogical(q, facts, blueprints)

        q["technicalQuality"] = t_score
        q["pedagogicalQuality"] = p_score
        q["technicalDetails"] = t_details
        q["pedagogicalDetails"] = p_details

        # New pass condition
        passed = t_score >= 90 and p_score >= 70
        q["qualityPassed"] = passed

        if passed:
            approved += 1
        else:
            flagged += 1

        t_scores.append(t_score)
        p_scores.append(p_score)

    # Update store
    store["averageTechnicalQuality"] = round(sum(t_scores) / len(t_scores), 1)
    store["averagePedagogicalQuality"] = round(sum(p_scores) / len(p_scores), 1)
    store["approvedCount"] = approved
    store["flaggedCount"] = flagged

    with open(QUESTIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)

    # Summary
    print(f"\n--- Results ---")
    print(f"  Approved (T≥90, P≥70): {approved}")
    print(f"  Flagged: {flagged}")
    print(f"  Avg technicalQuality: {store['averageTechnicalQuality']}")
    print(f"  Avg pedagogicalQuality: {store['averagePedagogicalQuality']}")

    # Distribution
    t_buckets = Counter()
    p_buckets = Counter()
    for t, p in zip(t_scores, p_scores):
        t_buckets[(t // 10) * 10] += 1
        p_buckets[(p // 10) * 10] += 1

    print(f"\n  technicalQuality distribution:")
    for b in sorted(t_buckets):
        print(f"    {b:3d}-{b+9:3d}: {t_buckets[b]}")

    print(f"\n  pedagogicalQuality distribution:")
    for b in sorted(p_buckets):
        print(f"    {b:3d}-{b+9:3d}: {p_buckets[b]}")

    # By subject
    subj_stats = {}
    for q in questions:
        s = q["subject"]
        if s not in subj_stats:
            subj_stats[s] = {"approved": 0, "flagged": 0, "t": [], "p": []}
        if q["qualityPassed"]:
            subj_stats[s]["approved"] += 1
        else:
            subj_stats[s]["flagged"] += 1
        subj_stats[s]["t"].append(q["technicalQuality"])
        subj_stats[s]["p"].append(q["pedagogicalQuality"])

    print(f"\n  By subject:")
    for s, st in sorted(subj_stats.items()):
        avg_t = sum(st["t"]) / len(st["t"]) if st["t"] else 0
        avg_p = sum(st["p"]) / len(st["p"]) if st["p"] else 0
        print(f"    [{s}]: {st['approved']} approved, {st['flagged']} flagged | T={avg_t:.0f} P={avg_p:.0f}")

    print(f"\n✓ {QUESTIONS_PATH}")


if __name__ == "__main__":
    main()
