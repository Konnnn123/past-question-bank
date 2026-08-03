# Environment runtime template table

| Template | Past-exam frequency | Runtime status | Required mechanism | Complete-mock core |
| --- | ---: | --- | --- | --- |
| `numeric_calculation` | 11 | integrated: CO₂ ventilation | bounded formula parameters, unit/range checks, recomputation | yes |
| `formula_to_quantity` | 11 | integrated: 58 eligible formula facts | fact eligibility, `formula_text` relation, four distinct formula-backed options | yes |
| `phenomenon_to_term` | 9 | blocked | reviewed `defined_as` phenomenon facts plus same-domain surplus terms | yes |
| `quantity_to_formula` | 0 | deferred | inverse formula-choice relation | no |
| `condition_change_judge` | 0 | deferred | condition-change propositions | no |

The runtime route is `/exam/mock/env-calc`. Its active assessment bundle is one seeded numerical question and three distinct seeded formula-choice questions. Static pilot calculations remain available only as explicitly labelled `question_bank_sampler` reference material.

The 2026-07-18 facts inspection found 381 Environment facts: 58 `formula_text`, 58 `computes`, and 265 `appears_in_exam`; it found zero `defined_as` facts. Therefore the observed `phenomenon_to_term` core template cannot be implemented without inventing definitions or distractor truth conditions.
