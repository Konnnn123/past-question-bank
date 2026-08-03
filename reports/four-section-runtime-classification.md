# Four-section full-mock runtime classification

Audit date: 2026-07-18. Counts below use only items loaded by an actual section-level complete-mock route. Standalone prototypes are listed separately and do not satisfy a full-mock or Generator release gate.

| Section | Full-mock route / assembler | `past_exam_reconstruction` | `question_bank_sampler` | `parameterized_variant` | `atomic_fact_generator` | Gate |
|---|---|---:|---:|---:|---:|---|
| History | none | 0 | 0 | 0 | **0** | `incomplete` |
| Planning | `/exam/mock/planning-full` / `assemblePlanningFullMock` | 20 | 4 | 0 | **0** | `incomplete` |
| Building Construction | `/exam/mock/building-construction-full` / `assembleBuildingConstructionMock` | 7 | 44 | 0 | **0** | `incomplete` |
| Environment | none | 0 | 0 | 0 | **0** | `incomplete` |
| **Total full-mock runtime items** | — | **27** | **48** | **0** | **0** | `INCOMPLETE` |

## Standalone items excluded from the table

| Section | Route | Runtime behaviour | Items | Classification | Why excluded |
|---|---|---|---:|---|---|
| History | `/exam/mock/history-mwb` | Direct fixed JSON rendering of six images, three fixed 9-term banks, and fixed mappings | 6 image items | static `question_bank_sampler` | no complete-paper route, seed, answer input, submit, result, or review flow |
| Environment | `/exam/mock/env-calc` | Direct fixed JSON rendering | 12 numerical items | static `question_bank_sampler` | no full-paper assembler, runtime parameterization, or assessment flow |
| Environment | `/exam/mock/correct-statement` | Direct fixed JSON rendering; route also includes five Planning items | 5 Environment items | static `question_bank_sampler` | no section filter, seed, full-paper assembly, or runtime distractor construction |

## Release-gate correction

No current section has a formal runtime `atomic_fact_generator` item within its full mock. The following must not be treated as Generator evidence: direct original-question reconstruction, shuffled static records, precomputed parameterized outputs, a `production_ready`/`parameterized` label, or a standalone prototype that never enters a section full-paper route.

Evidence: `reports/history-full-question-origin-audit.md`, `reports/planning-full-question-origin-audit.md`, `reports/building-construction-full-question-origin-audit.md`, and `reports/environment-full-question-origin-audit.md`.
