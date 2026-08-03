# Four-section final release audit

Audit date: 2026-07-18. This applies the approved downgrade policy: a preserved reconstruction or sampler does not need to be a Generator if it has traceable source/answer evidence and the section's complete-paper gate is otherwise met. Pool-diversity targets are known limitations unless a gate explicitly makes them mandatory.

| Gate | Required condition | Actual evidence | Pass / fail | Only hard blocker if failed |
| --- | --- | --- | --- | --- |
| `history_full_release` | A complete History paper assembler, past-exam-supported paper structure, scoring, 100 seeds, and browser flow. | `history-2019-q5-full-paper` freezes the actual 25-image, two-word-bank Q5 structure: 50 scored axes, 100/100 seeds, and browser submission. | **pass** | — |
| `planning_full_release` | A complete paper whose retained reconstruction/sampler ratio is supported by past-exam structure, plus grading, 100 seeds, and browser flow. | The route assembles 20 units: 12 traceable 2023 Q4 reconstructions plus 8 runtime Atomic Fact numeric-generator units. 100/100 seeds produce 31 distinct semantic generated sets. | **pass** | — |
| `building_construction_full_release` | A complete paper with past-exam-supported block counts/proportions, no duplicate conflict, grading, 100 seeds, and browser flow. | The route uses 20 runtime RC shared-word-bank Atomic Fact generator units. 100/100 seeds produce 100 distinct semantic generated sets; the indexed 2024 Q3 reconstruction is fallback-only, and Structural Mechanics exclusion passes. | **pass** | — |
| `environment_full_release` | A complete Environment paper with past-exam-supported type allocation, scoring, 100 seeds, and browser flow. | `environment-2017-q4-full-paper` freezes the observed one-unit numerical form. The route produces exactly one verified parameterized calculation; 100/100 seeds and browser submission pass. | **pass** | — |

## Retained reconstruction / sampler accounting

| Section | Runtime scored items | Reconstruction | Sampler | Generator / parameterized | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| History | 50 | 0 (0%) | 0 (0%) | 50 (100%) | 2019 Q5 image word-bank blueprint. |
| Planning | 20 | 12 (60%) | 0 (0%) | 8 (40%) | 2023 Q4 reconstruction plus verified numeric Atomic Fact Generator. |
| Building Construction | 20 | 0 (0%; fallback only) | 0 (0%) | 20 (100%) | Verified RC shared-word-bank Atomic Fact Generator; 2024 Q3 reconstruction remains operational fallback. |
| Environment | 1 | 0 (0%) | 0 (0%) | 1 (100%) | 2017 Q4 numerical blueprint. |

## Known limitations that are not release blockers

- `HR-001` and `HR-002`: `missing_source_material`; retain reconstruction only and do not count them as Generator coverage.
- `PL-001`: safe distractor whitelist remains zero; retain reconstruction/sampler and do not enable a Facility Generator.
- Environment `phenomenon_to_term`: approved pool is 16, meeting the stated technical minimum. It is `usable_with_limited_pool_diversity`, not a failure condition.
- Building Construction RC pool has 33 terms, below the preferred expansion target but not a release failure on its own.

## Aggregate decision

`FOUR_SECTION_RELEASE_PASS`: **pass**. Each section now has a frozen, directly evidenced Specialist 1 paper blueprint, exact runtime allocation, objective scoring, 100-seed validation, and browser submission evidence.
