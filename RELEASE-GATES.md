# Past-exam trainer release gates

The prior labels `FOUR_SECTION_RELEASE_PASS` and `FOUR_SECTION_GENERATIVE_MOCK_PASS` are retired. The release target is **`FOUR_SECTION_LEARNING_SYSTEM_PASS`**.

## Deprecated trainer status

`/trainer` is deprecated and is not a release target. The original-source pages, knowledge maps, and review page are the formal learning surface.

1. Each of the four subjects can browse real original blocks by year.
2. Sampling combines at least subject, year and topic/facility (and additionally supports surface format, cognitive task and confidence).
3. Every sampled item retains a real source path, year and source block identifier.
4. Submission exposes the answer basis, cognitive task, relation, confidence and topics.
5. Missing option evidence is shown as unresolved, never invented.
6. Attempts persist locally and aggregate by task, topic and error tags.
7. Wrong-answer retraining and a real-question-only learning path work.
8. HR-001 and HR-002 remain non-fabricated `missing_source_material` browse cases.
9. The three previously validated generators remain available and unchanged.
10. TypeScript, ESLint and production build pass.
11. Browser verification completes browse → sample → submit → explanation → wrong answer → retraining → learning path.

**Current status: retired.** It must not be used as evidence for source-answer automatic grading.

## RELIABLE_ORIGINAL_ANSWER_AUTOGRADING_FROZEN

**Current status: implementation verified; browser recheck pending.** `data/reliable-original-answer-allowlist.json` is the only automatic-grading authority for original past-exam items.

| Scope | Approved automatic subquestions | Answer authority |
| --- | ---: | --- |
| Environment true/false | 84 | `src/lib/environment-review.ts`, exact source-file and subquestion allowlist match |
| Building Construction 2024 Q3 local choice | 19 | `data/construction-2024-q3-slot-review.json` / `BC-002`, exact slot allowlist match |
| Total | 103 | `data/reliable-original-answer-allowlist.json` |

Release conditions:

1. A page must check the allowlist before rendering an automatic submission control.
2. Draft answers, learning metadata, card-supported notes, and inferred answers never authorize automatic grading.
3. Any item outside the allowlist is visibly marked **self-assessment**.
4. `2024_専門1_建筑构法_Q3.md:m` remains `unresolved_self_assessment` and must never receive an automatic control.
5. Future automatic scope requires an explicit reviewed index added to the same allowlist.

## Pass conditions

1. The four formal subject entries open, accept answers, submit, and show results.
2. Each visible item has an accurate mode: `past_exam_reconstruction`, `question_bank_sampler`, `rubric_guided_practice`, `validated_generator`, or `deprecated_prototype`.
3. Planning formal practice contains no generic atomic-fact numeric or facility quiz.
4. History image matching remains validated.
5. Only the RC shared word bank is labelled a validated Building Construction generator.
6. Only the CO₂ ventilation calculation is labelled a validated Environment generator.
7. Past-exam reconstruction is never presented as a new generated question.
8. HR-001 and HR-002 remain `missing_source_material` and are not fabricated.
9. TypeScript, ESLint, and production build pass.
10. Browser verification opens the four formal entries and completes answer → submit → result.

## Current formal entries

| Subject | Formal entry | Mode | Gate |
| --- | --- | --- | --- |
| History | `/exam/mock/history-mwb` | `validated_generator` — 2019 Q5 image → building / architect matching | pending browser verification after migration |
| Planning | `/exam/mock/planning-full` | `past_exam_reconstruction` — all 20 indexed 2023 Q4 units | pending browser verification after migration |
| Building Construction | `/exam/mock/building-construction-full` | `validated_generator` only for the bounded RC shared word bank; 2024 Q3 is explicit fallback reconstruction | pending browser verification after migration |
| Environment | `/exam/mock/env-calc` | `validated_generator` — CO₂ ventilation formula calculation | pending browser verification after migration |

## Explicit exclusions

- Planning numeric-neighbour and facility-mixing pages are `deprecated_prototype`.
- Environment formula-name, phenomenon-term, and correct-statement packs are not Generator coverage; fixed packs are `question_bank_sampler` or `rubric_guided_practice`.
- Static/pre-generated construction JSON is reconstruction, sampler, or deprecated prototype according to source provenance.
- Pool diversity remains a known limitation; it is not resolved by inventing facts or distractors.
