# Phase 4 — Structural Template Reconstruction Report

## Summary

- **Templates defined:** 9 across 4 subjects
- **Prototypes generated:** 10 (blocked: 2, ready: 8)
- **Structural ≥4.0:** 0/10

## Templates to DELETE (not repair)

1. `architect_to_work` — flashcard, not exam structure
2. `building_to_period` — single-fact recall, exam uses image→period through word bank
3. `building_style_pairing` — same issue
4. `term_to_definition` — MCQ format never used in real exam
5. `quantity_to_formula` — name→formula recall, exam uses formula→quantity completion

## Templates that CAN be generated reliably

1. **environment_numerical_calculation** — has formulas, worked solutions, variable ranges. Ready.
2. **planning_contextual_numeric_select** — has standards data. Ready with caveats (values need verification).

## Templates requiring multi-fact linked data

1. **history_image_wordbank_matching** — needs image+building+architect+style+period linked per entity
2. **construction_multi_blank_wordbank** — needs composed technical passages from fact graphs

## Templates requiring visual assets

1. **history_image_free_recall** — 890 image assets, 0 humanConfirmed
2. **history_image_wordbank_matching** — same

## Templates requiring misconception library

1. **environment_correct_statement** — 5 entries (need 20+ per topic)
2. **planning_correct_statement** — 3 entries (need 20+ per topic)

## Templates requiring verified standards data

1. **planning_contextual_numeric_select** — values from planning cache, not verified against actual Japanese building standards

## Templates NOT suitable for automatic generation

1. **planning_scoped_short_answer** — requires rubric design per question, not automatable with current data
2. **history_image_free_recall** — requires confirmed image assets (human pipeline, not code)

## Did any prototype reach structural ≥4.0?

**No.** The closest is `environment_numerical_calculation` at estimated 3.8. All others are blocked by missing data (images, misconception library, standards verification).

## Smallest next implementation step

1. Confirm 10 image assets as humanConfirmed
2. Expand misconception library to 20+ entries per subject
3. Implement composed-passage generator for construction
4. Verify 20 planning numeric values against actual standards
