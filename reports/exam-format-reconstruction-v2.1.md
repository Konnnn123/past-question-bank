# Exam Format Reconstruction v2.1

**Scanned:** 134 files
**Date:** 2026-07-18 09:51

## Summary

| Metric | Count |
|--------|-------|
| S1 subquestions | 215 |
| S2 subquestions | 138 |
| S1 templates | 17 |
| Manual review (S1) | 16 (7.4%) |
| Ready | 1 |
| Partial | 11 |
| Blocked | 5 |
| Manual only (S2) | 0 |

## S1 Templates (ranked by priority)

| Template | Subject | Years | Blocks | Items | Readiness | Priority |
|----------|---------|-------|--------|-------|-----------|----------|
| planning_facility_fact_recall | planning | 8 | 9 | 98 | partial | critical |
| environment_fact_recall | environment | 7 | 7 | 45 | partial | high |
| construction_numerical | construction | 6 | 6 | 7 | partial | high |
| environment_numerical_calculation | environment | 4 | 4 | 5 | ready | high |
| planning_legal_standard_fill | planning | 5 | 5 | 8 | partial | high |
| history_image_wordbank_matching | history | 3 | 3 | 4 | blocked_images | medium |
| planning_numerical_calculation | planning | 3 | 3 | 3 | partial | medium |
| history_wordbank_pairing_no_image | history | 2 | 2 | 2 | blocked_images | medium |
| construction_independent_fill | construction | 2 | 2 | 4 | partial | medium |
| history_image_to_name | history | 2 | 2 | 12 | blocked_images | medium |
| history_image_to_architect | history | 2 | 2 | 3 | blocked_images | medium |
| planning_definition_to_term | planning | 1 | 1 | 1 | partial | low |
| history_description_to_name | history | 1 | 1 | 1 | partial | low |
| planning_inline_numeric_select | planning | 1 | 1 | 1 | partial | low |
| environment_phenomenon_wordbank | environment | 1 | 1 | 1 | partial | low |
| environment_formula_completion | environment | 1 | 1 | 2 | partial | low |
| construction_image_to_component | construction | 1 | 1 | 2 | blocked_images | low |

## Per-Subject Top 3 (by year frequency)

**history:**
- history_image_wordbank_matching (3 years)
- history_wordbank_pairing_no_image (2 years)
- history_image_to_name (2 years)

**construction:**
- construction_numerical (6 years)
- construction_independent_fill (2 years)
- construction_image_to_component (1 years)

**environment:**
- environment_fact_recall (7 years)
- environment_numerical_calculation (4 years)
- environment_phenomenon_wordbank (1 years)

**planning:**
- planning_facility_fact_recall (8 years)
- planning_legal_standard_fill (5 years)
- planning_numerical_calculation (3 years)


## Required Format Check

✅ = observed in past exams, ❌ = not observed

### planning
- ✅ definition_to_term_mcq
- ❌ project_to_planner_mcq
- ❌ image_name_matching
- ❌ facility_fact_mcq
- ✅ inline_numeric_select
- ✅ numerical_calculation
- ✅ legal_standard_select

### construction
- ❌ shared_wordbank_fill
- ✅ independent_fill
- ✅ diagram_component_identification
- ✅ material_joint_relation
- ❌ construction_sequence
- ❌ numerical
- ❌ true_false_or_statement_select

### environment
- ✅ fact_value_select
- ❌ numeric_candidate_fill
- ✅ true_false_batch
- ❌ correct_statement_select
- ✅ numerical_calculation
- ❌ calculation_select
- ✅ phenomenon_wordbank

### history
- ✅ image_multi_wordbank_matching
- ✅ image_to_name
- ✅ image_to_architect
- ✅ non_image_wordbank_pairing
- ✅ definition_or_description_to_name


## Generator Coverage

- Ready generators: 1 (environment numerical, environment calculation_select)
- Generators that need data: 11
- Blocked by images/legal: 5

## S2 Appendix

S2 (専門2-2) has 138 subquestions across 4 essay templates.
All are manual-only (essay/diagram/design).
Not included in generator priority.

## Next 3 Generators to Implement

1. **planning_facility_fact_recall** — 8 years, 9 blocks — partial
2. **environment_fact_recall** — 7 years, 7 blocks — partial
3. **construction_numerical** — 6 years, 6 blocks — partial
