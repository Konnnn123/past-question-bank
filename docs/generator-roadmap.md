# Generator Roadmap

> All future development must follow this table. No new architecture documents.
> Priority = exam frequency × data readiness.

## P0 — Implement Now

| Generator | Relations | Priority | Data | Status |
|-----------|-----------|----------|------|--------|
| environment_calculation | 10.1–10.5 | P0 | ready | ✅ Done |
| planning_numeric_standard | 15.1–15.4 | P0 | partial | ✅ Done |
| history_image_architect | 1.2 | P0 | blocked_images | 🚧 Confirm images first |
| history_image_to_name | 1.1 | P0 | blocked_images | 🚧 Confirm images first |

## P1 — Needs Tags or Small Data Fix

| Generator | Relations | Priority | Data | Status |
|-----------|-----------|----------|------|--------|
| planning_concept_definition | 16.1 | P1 | partial | Later |
| planning_case_description | 16.2 | P1 | partial | Later |
| planning_facility_spatial | 16.4 | P1 | partial | Later |
| building_construction_strength | 8.2 | P1 | partial | ✅ Done |
| building_construction_definition_term | 7.1 | P1 | partial | Later |
| history_wordbank_pairing | 4.1–4.3 | P1 | partial | Later |
| history_description_to_name | 5.1 | P1 | partial | Later |
| environment_fact_recall | 13.1–13.2 | P1 | partial | Later |
| environment_correct_statement | 14.1 | P1 | partial | Later |
| environment_phenomenon_wordbank | 11.1–11.2 | P1 | not_observed | Later |

## P2 — Low Frequency or Blocked

| Generator | Relations | Priority | Data | Status |
|-----------|-----------|----------|------|--------|
| building_construction_shared_wordbank | 6.1–6.3 | P2 | partial | Later |
| building_construction_numerical_density | 8.1 | P2 | not_observed | Later |
| history_image_detail | 1.5 | P2 | not_observed | Later |
| history_style_to_building | 4.4 | P2 | not_observed | Later |
| planning_legal_standard | 17.1–17.4 | P2 | blocked_legal | Later |
| planning_project_planner | 16.5 | P2 | not_observed | Later |
| planning_theory_example | 16.3 | P2 | not_observed | Later |
| environment_quantity_value | 13.3 | P2 | not_observed | Later |

## Rule

```
All development proceeds top-to-bottom through this table.
No new generators may be started unless they appear here.
Priority = exam frequency × data readiness.
Do not implement P2 before P0 is complete.
Do not add new architecture documents.
```

---

**Last updated:** 2026-07-18 | **Based on:** 134 past exams, 3397 atomic facts, 52 active sub-relations

## Out of Current Scope

| Subject | Status | Rule |
|---------|--------|------|
| structural_mechanics | `out_of_current_scope` | Separate analysis required before any relation or generator is created. |
