#!/usr/bin/env python3
"""Stratified audit sample: 100 questions across all subjects and blueprints."""
import json, sys, io, random
from pathlib import Path
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(2025)

BASE = Path(__file__).parent.parent
DATA = BASE / "data"

def main():
    with open(DATA / "questions.json", "r", encoding="utf-8") as f:
        store = json.load(f)
    questions = store["questions"]

    # Group by (subject, blueprintId)
    groups = defaultdict(list)
    for q in questions:
        groups[(q["subject"], q["blueprintId"])].append(q)

    # Target: 25 per subject, evenly per blueprint
    targets = {
        "history": 25,
        "construction": 25,
        "planning": 25,
        "environment": 25,
    }

    sample = []
    for subject, target_n in targets.items():
        subj_groups = {k: v for k, v in groups.items() if k[0] == subject}
        bps = sorted(subj_groups.keys())
        per_bp = max(1, target_n // len(bps)) if bps else target_n

        for bp_key in bps:
            pool = subj_groups[bp_key]
            n = min(per_bp, len(pool))
            picked = random.sample(pool, n) if n <= len(pool) else pool
            for q in picked:
                q["_audit"] = {
                    "factCorrect": None,
                    "wordingNatural": None,
                    "answerUnique": None,
                    "distractorsPlausible": None,
                    "difficultyAppropriate": None,
                    "examRelevant": None,
                    "usefulForReview": None,
                    "reviewDecision": None,
                    "reviewerNote": "",
                }
                sample.append(q)

    # Trim to exactly 100
    if len(sample) > 100:
        sample = random.sample(sample, 100)

    # Stats
    by_subj = defaultdict(int)
    for q in sample:
        by_subj[q["subject"]] += 1

    print(f"Audit sample: {len(sample)} questions")
    for s, n in sorted(by_subj.items()):
        print(f"  [{s}]: {n}")

    with open(DATA / "question-audit-sample.json", "w", encoding="utf-8") as f:
        json.dump({
            "version": 1,
            "totalSampled": len(sample),
            "questions": sample,
        }, f, ensure_ascii=False, indent=2)

    print(f"✓ {DATA / 'question-audit-sample.json'}")

if __name__ == "__main__":
    main()
