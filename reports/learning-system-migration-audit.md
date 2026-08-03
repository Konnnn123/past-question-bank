# Architecture Past Exam Learning System — migration audit

**Scope.** This is a read-only audit of the current runtime paths, source data, and validators. It does not alter code, pages, data, release gates, or reviewed facts. The purpose is to replace the misleading goal of a four-subject “fully generative mock” with an evidence-led past-exam learning system.

## Decision rule used in this audit

`validated_generator` is reserved for a runtime mechanism that preserves a real past-exam cognitive operation and has a constrained, independently checkable answer/distractor relation. A shuffled bank remains `question_bank_sampler`; a past-paper prompt and answers reproduced from the source remain `past_exam_reconstruction`.

The audit uses one additional migration-only label:

- `generic_atomic_fact_quiz`: a runtime item assembled from facts, but without a demonstrated past-exam cognitive task and/or with distractors that are merely numeric neighbours, unrelated facts, or unproven negatives. It must not be presented as a formal generator.

## A. Current question routes and entry points

| Subject | Runtime entry | Current source chain | Current role after migration |
|---|---|---|---|
| History | `/exam/mock/history-mwb` | `HistoryMWBClient` → `generateHistoryImageWordBank` → approved image assets + building/architect facts | Retain as validated image matching practice. |
| History | `/history`, `/history/western-core`, `/history/network`, `/history/buildings/[id]` | history learning cards, review registry, image assets | Retain as learning/reference surfaces; not mock generators. |
| Planning | `/exam/mock/planning-full` | `PlanningFullMockClient` → 2023 Q4 reconstructed units + `generatePlanningNumericChoice` | Reposition as past-exam reconstruction/mixed practice; remove the numeric component from “formal generator” positioning. |
| Planning | `/exam/mock/planning-numeric` | `PlanningNumericClient` → numeric pilot + `generatePlanningNumericChoice` | Hide/relabel as a draft fact drill, not a formal mock or generator. |
| Planning | `/exam/mock/planning-facility` | `generatePlanningFacilityChoice` → confirmed facts | Keep only as internal/draft practice until a positive, source-backed distractor whitelist exists; do not use as formal practice. |
| Planning | `/planning-typology`, `/planning-knowledge-map` | planning cards/maps | Reuse as topic navigation and future error aggregation. |
| Building construction | `/exam/mock/building-construction-full` | `buildBuildingConstructionMock` → RC word-bank facts, with indexed 2024 Q3 fallback | Retain RC shared-word-bank only as constrained generated practice; label fallback as reconstruction. |
| Building construction | `/exam/mock/building-construction/[format]` | shared-word-bank generator or static production-format JSON | Split labels: RC word bank is validated practice; JSON format families are reconstruction/samplers. |
| Building construction | `/exam/mock/construction`, `/exam/mock/building-construction-numerical`, `/exam/mock/building-construction-rc-association`, `/exam/reconstruction/building-construction-association` | static prototype/pilot/generated JSON | Reposition as past-exam reconstruction, fixed prototype, or internal draft according to the table below. |
| Building construction | `/construction-distinctions`, `/construction-methods-knowledge-map` | construction review/cards | Retain as learning/reference surfaces. |
| Environment | `/exam/mock/env-calc` | `buildEnvironmentRuntimeMock` (currently configured to show only ventilation runtime numerical) plus static calculation reference | Retain the ventilation formula generator; show other material as past-exam reference/reconstruction. |
| Environment | `/exam/mock/correct-statement` | `correct-statement-prototypes.json` | Reposition as a fixed prototype/question-bank sampler unless each proposition is tied to a past-exam blueprint. |
| Environment | `/environment-knowledge`, `/environment-knowledge-map` | environment learning cards/maps | Reuse as topic navigation and future explanation surfaces. |
| Cross-subject | `/exam/mock` | `MockExamClient` → light-practice reconstruction units + environment calculation pilot | Reposition as a mixed past-exam practice launcher; it must not imply a full generated mock. |
| Cross-subject | `/exam/past`, `/practice/light`, `/review`, `/simulation` | original questions, light-practice builder, attempt/review state | Reuse as the shared past-exam, answer-record, error-review, and launch infrastructure. |

## B. Actual runtime composition by entry

Percentages are item-level only where the route has a fixed scorable composition. “Unknown” is used where the visible page loads a JSON artifact whose provenance is not fully established by its runtime code.

| Route | Reconstruction | Question-bank sampler | Validated generator | Generic atomic-fact quiz | Unknown | Evidence |
|---|---:|---:|---:|---:|---:|---|
| `/exam/mock/history-mwb` | 0% | 0% | 100% (25 images × building/architect matching) | 0% | 0% | `src/lib/history-image-wordbank-generator.ts`; 2019 Q5 template; image review registry. |
| `/exam/mock/planning-full` | 60% (12/20) | 0% | 0% | 40% (8/20 numeric-neighbour items) | 0% | `src/lib/planning-full-mock.ts`, `src/lib/planning-numeric-choice-generator.ts`. |
| `/exam/mock/planning-numeric` | static pilot reference only | 12 pilot items | 0% | 1 runtime numeric-neighbour item | 0% | `PlanningNumericClient.tsx`, `planning-numeric-pilot.json`. |
| `/exam/mock/planning-facility` | 0% | 0% | 0% | 100% (12 facts paired with other-facility descriptions) | 0% | `planning-facility-choice-generator.ts`; whitelist is known empty. |
| `/exam/mock/building-construction-full` | 0% primary; 100% only when fallback runs | 0% | 100% primary RC common word-bank (20 slots) | 0% | 0% | `building-construction-mock.ts`; 2022 Q3 word-bank structure; 2024 Q3 slot fallback. |
| `/exam/mock/building-construction/[format]` shared-word-bank route | 0% | 0% | 100% RC word-bank route | 0% | 0% | `SharedWordBankGeneratorClient.tsx`, `building-construction-shared-wordbank-generator.ts`. |
| `/exam/mock/building-construction/[format]` other formats | 0–100% depending on artifact | 0–100% depending on artifact | 0% | 0% | 0–100% | static `building-construction-production-formats-v1.json`; route must expose source mode per family. |
| `/exam/mock/construction` | 0% | 0% | 0% | 0% | 100% | `construction-fb-prototype.json` is loaded as a prototype artifact. |
| `/exam/mock/building-construction-numerical` | 0% | 12 pilot items | 0% | 0% | 0% | `building-construction-numerical-pilot.json`. |
| `/exam/mock/building-construction-rc-association` | 0% | 0% | 0% | 0% | 100% | pre-generated association JSON is rendered; it is not runtime generation. |
| `/exam/mock/env-calc` current runtime configuration | 0% | static reference panel only | 100% (one CO₂ ventilation calculation) | 0% visible in current configuration | 0% | `environment-runtime-mock.ts`, `environment-ventilation-generator.ts`, page passes zero formula choices and disables phenomenon/correct-statement blocks. |
| `/exam/mock/correct-statement` | 0% | 100% fixed prototype items | 0% | 0% | 0% | `correct-statement-prototypes.json`. |
| `/exam/mock` “past” mode | 100% | 0% | 0% | 0% | 0% | `buildLightPracticeQuestions`. |
| `/exam/mock` “simulation” mode | 0% | 100% static environment calculation pilot items | 0% | 0% | 0% | `environment-calculation-pilot.json`. |

### Positioning errors found

1. **Planning full mock is not a generative full mock.** Its 8 runtime items ask for a stored standard value and manufacture three numeric neighbours. The wording does not preserve a source case, spatial relation, or other demonstrated planning cognitive task.
2. **Planning numeric route is the same generic fact-to-number drill.** A seeded cycle changes the selected fact and option order; it does not create new valid planning questions.
3. **Planning facility route has no safe negative-evidence pool.** `planning-facility-safe-distractor-whitelist.json` is empty, and selecting a description from another facility does not prove that the description is false for the target facility.
4. **Environment formula-choice, phenomenon-to-term, and correct-statement code are not visible in the current environment runtime configuration.** Even where the code has reviewed facts, these should not be promoted as the main mock body without an explicit past-exam cognitive-task/blueprint check per template.
5. **Several construction routes render pre-generated JSON.** Seeded display or a file named “generated” is not runtime generation.
6. **Construction RC word-bank must be described narrowly.** It is a validated, relation-bounded RC word-bank practice mechanism, not evidence that all construction formats are generative. Its fact pool is limited; pool diversity is a known limitation, not a reason to fabricate more facts.
7. **Current full-exam blueprint metadata encodes generator quotas for Planning and Construction.** Those quotas are implementation targets rather than evidence that the resulting new semantic items preserve the past-exam task. They require revision in the later metadata/release stage, not in this audit.

## C. Modules that must not remain formal Generators

| Module | Why it fails the formal-generator rule | Migration disposition |
|---|---|---|
| `src/lib/planning-numeric-choice-generator.ts` | Prompt is a direct entity → numeric-standard recall; three alternatives are numeric neighbours calculated from the answer, not source-backed false relations. No preserved planning case/cognitive task. | Reclassify to `generic_atomic_fact_quiz`; hide from formal mock entry or retain internally as draft drill. |
| `src/lib/planning-facility-choice-generator.ts` | It treats a feature documented for another facility as false for the target facility. The acknowledged safe whitelist is empty, so uniqueness is not established. | Do not expose as dynamic facility practice; retain source facts for reconstruction analysis. |
| Planning 8-slot runtime component in `planning-full-mock.ts` | Delegates to the numeric-neighbour module above and displaces 2023 reconstructed slots. | Restore the slot role to reconstruction/sampler in the later migration stage. |
| `src/lib/environment-formula-choice-generator.ts` | It is a direct formula-text → named-quantity matching drill. It may be useful learning practice, but current code does not establish that its four-option operation is a full past-exam blueprint nor that all cross-formula terms are the intended distractor relation. | Reclassify as `rubric_guided_practice`/formula relation exercise until template evidence is attached. |
| `src/lib/environment-phenomenon-wordbank-generator.ts` | It selects 7 answer facts and calls the other 9 selected facts surplus. The code verifies non-overlap, not that each surplus is demonstrably false for every description. | Keep approved facts; move exercise to draft/rubric-guided practice pending a term-level confusion matrix. |
| `src/lib/environment-correct-statement-generator.ts` | It shuffles five prewritten proposition packs. It is a sampler over approved propositions, not a new proposition generator. | Reclassify as `question_bank_sampler`; retain approved true/false evidence and explanations. |
| `src/lib/building-construction-material-{density,elasticity,strength}-generator.ts` and numerical pilot routes | These are material value/parameter exercises. Only a formula or material-performance mechanism with an explicit past-paper cognitive operation may remain generative; otherwise they are parameterized drills or samplers. | Do not call them formal generators without per-template evidence. |
| `data/building-construction-rc-association-generated-v1.json` route | JSON is pre-generated before page render; no runtime answer/relation/distractor selection occurs. | Label as fixed prototype or sampler. |

## D. Reusable assets

| Subject | Original questions & answers | Blueprint / indexed answer assets | Facts, tags, rubrics | Runtime components & validation | Browser / learning surfaces |
|---|---|---|---|---|---|
| History | `data/processed_questions/*建築史*`; history review TSV files | `history-full-exam-blueprint.json`; 2019 Q5 template in generator | `atomic-facts.json`; `image-assets.json`; `history-text-review-status.json`; `history-short-answer-rubric.json`; history learning/style/architect cards | `history-image-wordbank-generator.ts`; eligibility loader; `validate-history-image-wordbank-generator.ts` | `/exam/mock/history-mwb`, `/history/*`, `/assessment/images`, review system |
| Planning | `data/processed_questions/*建築計画*`; `planning-exam-answers.json` | `planning-exam-card-index.json`; `planning-full-exam-blueprint.json`; format catalog | `atomic-facts.json`; planning cards, typologies, case-gap reports; empty safe-distractor whitelist documents the limit | `planning-review.ts`; `planning-full-mock.ts`; numeric/facility validators (useful as diagnostics, not certification of semantic generation) | `/exam/mock/planning-full`, `/planning-typology`, `/planning-knowledge-map`, `/practice/light`, `/review` |
| Building construction | `data/processed_questions/*建築構法*`; `construction-exam-answers.json` | `construction-2014-q3-approved-slots.json`; `construction-2024-q3-slot-review.json`; construction format audits | `building-construction-rc-shared-wordbank-facts.json` (33 reviewed terms); reviewed-fact and semantic-association reports; construction cards | RC word-bank generator + validator; slot validators; material generators; Structural Mechanics exclusion audits | `/exam/mock/building-construction-full`, `/exam/mock/building-construction/[format]`, construction knowledge maps/review |
| Environment | `data/processed_questions/*建築環境工学*`; static calculation and correct-statement prototypes | `environment-full-exam-blueprint.json`; `environment-runtime-template-table.md`; relation/frequency reports | `atomic-facts.json`; `environment-parameter-ranges.json`; unit rules; approved phenomenon facts (16); approved correct-statement propositions (5); candidate/unresolved queues | ventilation generator + validator; formula, phenomenon, and proposition validators; runtime mock composer | `/exam/mock/env-calc`, `/exam/mock/correct-statement`, `/environment-knowledge*`, `/review` |

## E. Minimum migration proposal, one per subject

### History — preserve the valid matching mechanism

Keep `/exam/mock/history-mwb` as **validated image matching practice**. Show its mode separately from reconstructed history items. Reuse the existing image review registry, approved relation facts, seed behavior, and validator. No new history fact generation is required.

### Planning — convert the primary experience to source-led practice

Make `/exam/mock/planning-full` a **past-exam reconstruction / sampler** based on indexed past-paper units. Attach the later metadata fields `cognitive_task`, answer basis, and distractor analysis to each real unit. Use `/planning-typology` and `/review` to group attempts by facility/topic and cognitive task. Remove the numeric-neighbour exercise from formal mock positioning; do not manufacture a substitute dynamic generator.

### Building construction — retain only relation-bounded RC practice

Keep the RC shared-word-bank path when its fact pool and relation constraints are available, clearly labelled **validated_generator · RC construction only**. Put all other formats behind explicit **past-exam reconstruction**, **sampler**, or **fixed prototype** labels. Reuse 2014/2024 slot indexes for answer explanations and preserve the Structural Mechanics boundary.

### Environment — retain formula calculation; make the rest evidence-led practice

Keep the CO₂ ventilation calculation as **validated parameterized formula practice**: its formula, parameter domains, units, constraints, and answer validation are explicit. Treat formula naming, phenomenon terms, and correct-statement packs as **past-exam/rubric-guided practice** until each has template-level cognitive-task evidence and a per-option false-relation explanation. Present explanations as formula, conditions, direction of change, and common misconception rather than as a synthetic full mock.

## Minimum later file changes (not made in this audit)

1. `data/question-learning-metadata.json` — new data artifact or extension of the current question schema with the approved migration fields: subject/year/question/subquestion IDs, mode, surface format, cognitive task, knowledge relation, topic, evidence, answer basis, distractor analysis, error tags, related questions, and confidence.
2. `src/app/exam/mock/planning-full/page.tsx` and `src/lib/planning-full-mock.ts` — stop presenting/replacing source slots with the numeric-neighbour exercise; use source units as reconstruction/sampling data.
3. `src/app/exam/mock/MockExamClient.tsx` and relevant subject clients — use the four allowed display modes only: `past_exam_reconstruction`, `past_exam_sampler`, `rubric_guided_practice`, `validated_generator`.
4. `src/app/exam/mock/env-calc/*`, `src/app/exam/mock/correct-statement/*` — preserve the ventilation calculation label; re-label/route non-formula material as source-led practice with explanation provenance.
5. `src/app/exam/mock/building-construction-full/*` and `[format]/*` — surface accurate per-section mode and restrict generator wording to RC word-bank practice.
6. `RELEASE-GATES.md` and `SYSTEM-STATUS.json` — replace “generator ratio” release logic with `FOUR_SECTION_LEARNING_SYSTEM_PASS`; do this only after data metadata and labels are implemented.
7. `reports/learning-system-final-audit.md` — final verification after the staged changes, not now.

## Migration risks and real blockers

| Item | Risk / blocker status | Safe handling |
|---|---|---|
| Planning answer/distractor explanations | **Real content limitation, not a technical blocker.** Some answer indexes are draft and the safe negative-evidence whitelist is zero. | Mark metadata `draft`/`incomplete`; retain real-question reconstruction without inventing distractors. |
| HR-001 / HR-002 | **Missing source material.** Their prior status is `missing_source_material`. | Preserve as reconstruction only; do not search or fabricate a generator relation. |
| RC shared-word-bank diversity | **Known limitation.** The reviewed pool is small; current selection is bounded to RC construction. | Retain only with clear scope/mode; do not claim broad construction generation or expand facts in this migration. |
| Environment phenomenon surplus | **Semantic evidence gap.** Non-overlap is not proof that a term is false for a description. | Keep approved definitions; defer formal word-bank generation until a relation/confusion matrix is reviewed. |
| Metadata coverage | **Implementation work, not a blocker.** Existing source/index assets cover many units but not all cognitive-task and distractor explanations. | Add metadata progressively with `verified`, `draft`, and `incomplete` confidence; never infer missing evidence. |

## Audit conclusion

The project has strong past-exam data, answer indexes, reviewed facts, validators, and practice surfaces. Its main issue is **positioning**, not the absence of material: several fact drills and pre-generated JSON artifacts are described too broadly as generators or complete mocks. The safe migration is to retain the narrow, validated history image matching and formula-based environment calculation (and the bounded RC word bank), while using the existing source corpus as the primary learning product: reconstruction, source-only sampling, cognitive-task explanation, and error-pattern review.
