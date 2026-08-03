# Specialist 1 four-section coverage matrix — frozen 2026-07-18

This matrix is derived from `data/template-coverage-matrix-v2.1.json`, `data/question-blueprints.json`,
and the current runtime implementations. It is a delivery baseline, not a claim that an item is generated.

## History

| Template | Past-exam frequency | Core | Full-paper target | Current mechanism | Eligible pool | Gap |
| --- | ---: | --- | ---: | --- | ---: | --- |
| image word-bank matching | 3 years / 4 subitems | yes | 6 images × 3 banks | `atomic_fact_generator`, live | 235 image facts | full-paper assembler and other core formats |
| image → name | 2 / 12 | yes | evidence-driven | covered as one axis of image word bank | 235 image facts | independent structural allocation |
| image → architect | 2 / 3 | yes | evidence-driven | covered as one axis of image word bank | 235 image facts | independent structural allocation |
| no-image word-bank pairing | 2 / 2 | yes | evidence-driven | not implemented | history atomic facts | relation-specific distractors and assembler |
| description → name | 1 / 1 | supporting | evidence-driven | not implemented | history atomic facts | unique description and distractor validation |

## Planning

| Template | Past-exam frequency | Core | Full-paper target | Current mechanism | Eligible pool | Gap |
| --- | ---: | --- | ---: | --- | ---: | --- |
| facility fact recall | 8 / 98 | yes | dominant block | reconstruction / static sampler | 31 numeric facts; facility facts available | dynamic facility relation generator |
| legal / numeric standard | 5 / 8 | yes | numeric allocation | `atomic_fact_generator`, live | 31 approved eligible facts | proportion evidence and complementary core blocks |
| numerical calculation | 3 / 3 | supporting | as observed | reconstruction / sampler | pilot data | formula-specific runtime logic if retained |
| definition → term | 1 / 1 | supporting | as observed | not implemented | `defined_as` facts | constrained distractors |

## Building construction

| Template | Past-exam frequency | Core | Full-paper target | Current mechanism | Eligible pool | Gap |
| --- | ---: | --- | ---: | --- | ---: | --- |
| RC shared word bank | observed 2015/2017/2022 forms | yes | 20 answers + 7 surplus | `atomic_fact_generator`, live | 33 approved RC facts | expand to 45–50; independent surplus constraints |
| numerical material / allowable-strength | 6 / 7 | yes | as observed | parameterized/reconstruction blocks | audited material data | current runtime proof for a formal dynamic block |
| independent construction fill | 2 / 4 | supporting | as observed | sampler | reviewed construction data | relation-specific generator |
| image → component | 1 / 2 | non-core | only if assets exist | blocked | none | confirmed assets; do not fabricate |

## Environment

| Template | Past-exam frequency | Core | Full-paper target | Current mechanism | Eligible pool | Gap |
| --- | ---: | --- | ---: | --- | ---: | --- |
| numerical calculation | 4 / 5 | yes | multiple formula blocks | `verified_parameterized_generator`, live | parameter rules | formula-family coverage in assembler |
| formula → physical quantity | observed | yes | as observed | `atomic_fact_generator`, live | approved formula facts | full-paper allocation |
| phenomenon / fact → term | 9 observed years | yes | 2022 form: 7 answers + 9 surplus | preparation only | 44 candidates, 0 approved | human approval; minimum 16 approved and compatible facts |
| correct / false concept | observed | yes | evidence-driven | static prototype | existing learning-card facts need truth/distractor modelling | dynamic proposition generator |

## Frozen scope rules

- Included: `history`, `planning`, `building_construction`, `environment` in Specialist 1.
- Excluded: `structural_mechanics`, Specialist 2-2. Euler/Pcr/EI/second moment/buckling must never enter the Building Construction pool.
- A reconstruction or static sampler is never counted as Generator coverage.

## Frozen executable full-paper blueprints (2026-07-18)

| Subject | Blueprint | Evidence-backed scoring structure | Current implementation |
| --- | --- | --- | --- |
| History | `history-2019-q5-full-paper` | 2019 Q5: 25 figures × 2 scored word-bank axes = 50 units | Existing image multi-word-bank Generator, 50 objective units |
| Planning | `planning-2023-q4-full-paper` | 2023 Q4: subquestions (1)–(20) = 20 units | 12 traced `past_exam_reconstruction` units + 8 verified `atomic_fact_generator` units |
| Building Construction | `building-construction-2024-q3-full-paper` | 20 scored RC shared-word-bank slots (2022 prototype); 2024 Q3 retained as fallback | 20 verified `atomic_fact_generator` units; Structural Mechanics excluded |
| Environment | `environment-2017-q4-full-paper` | 2017 Q4: one numerical calculation = 1 unit | One verified CO₂ ventilation parameterized item |

The four JSON blueprints in `data/*-full-exam-blueprint.json` are the release-paper source of truth. They replace the earlier code-derived `20 + 4`, `4 + 20 + 6 + 6 + 7 + 5 + 3`, and `1 + 3 + 7 + 1` compositions.
