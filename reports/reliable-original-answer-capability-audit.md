# Reliable source-answer capability audit

## Frozen automatic-grading allowlist (2026-07-19)

The formal allowlist is `data/reliable-original-answer-allowlist.json`. It contains exactly **103** original-past-exam subquestions: **84** Environment true/false items and **19** Building Construction 2024 Q3 local-choice slots. Membership is an exact composite of `subject`, `sourceFile`, and `subquestionId`; no draft answer, learning metadata, or inferred answer can expand it.

Excluded from automatic grading: `2024_専門1_建筑构法_Q3.md:m`, which remains `unresolved_self_assessment` because its approved-index record conflicts with the original wording.

Audit date: 2026-07-19  
Rule applied: a source slot is auto-gradable only when the original question is present, the slot ID is stable, the answer is individually traceable, and the user's selected value can be compared to that answer without inference. `card-supported-draft`, `partial-image-draft`, `image-source-unresolved`, learning-card text, and metadata-only labels are not formal answer evidence.

## Results by subject and answer format

| Subject | Format | Source-answer evidence checked | Immediately auto-gradable | Missing mapping / not yet wired | Unreliable or self-evaluation only |
|---|---|---|---:|---|---|
| Environment | True/false | `src/lib/environment-review.ts` `subAnswers`; original segments in `data/processed_questions` | **84** | 0 for the 84 explicit-mark slots | Other environment segments whose answers are numeric, terms, formulae or grouped responses remain self-evaluation until their input and acceptance rules are independently mapped. |
| Environment | Local selection / word bank | Original option banks and review answers exist in several years. | 0 | 2015, 2022 and 2026 include answer values but do not yet have a reviewed source-slot option mapping/acceptance rule in the knowledge-map flow. | Do not infer an option number from a term/value string. |
| Environment | Numeric fill | Indexed results are present in review records. | 0 | Needs per-slot unit, precision and accepted-form rule. | Free text must not be treated as automatically equal merely by loose numeric parsing. |
| Building construction | Local four-choice | `data/construction-2024-q3-slot-review.json` (`BC-002`, approved slot index) and the original 2024 Q3 source text. | **19** | 0 for slots `a–t` except `m`. | The ordinary construction answer record has 94 `card-supported-draft`, 1 `partial-image-draft`, and 4 `image-source-unresolved` items: all remain self-evaluation. |
| Building construction | Word-bank / term fill | Construction answer records and RC materials exist. | 0 | The source-page reuse/word-bank mapping is not formalized for a general input control. | Draft records are not promoted merely because a term is plausible. |
| Building construction | Numeric fill | Some approved Q3 values occur within local four-choice slots. | Included only in the 19 local-choice slots above. | Standalone numeric inputs have no universal precision/acceptance rule. | All other numeric answer cards remain self-evaluation. |
| Planning | Four-choice / local selection | `data/planning-exam-answers.json` has 140 items: 120 `card-supported-draft`, 20 `historical-law-draft`. | **0** | None are eligible until a formal answer-index source is approved. | No planning draft is used for automatic grading. |
| Planning | Word-bank, matching, numeric fill | The same planning answer file includes values and pairings, but not approved source-level comparison contracts. | 0 | Requires explicit option/slot mapping or an accepted-answer rule. | Self-evaluation only. |
| History | Matching | The separate image matching exercise remains validated practice, but it is not a source-page slot index. | 0 on the knowledge-map source page | A source-page mapping must preserve the image, choice bank and original answer index together. | `HR-001` and `HR-002` remain `missing_source_material`; essays and drawings are self-evaluation/rubric only. |
| History | Short answer / drawing / essay | `data/history-short-answer-rubric.json` supplies an approved manual rubric for HR-003. | 0 | None: these are intentionally manual. | Automatic scoring would require fabricated semantic equivalence, so it is not attempted. |

## Environment true/false coverage now active

The existing source-bound true/false component accepts only a single review item whose indexed answer begins with `○` or `×`. It is therefore active for all **84** eligible source slots:

| Source record | Slots |
|---|---:|
| `2014_専門1_建筑环境工学_Q2.md` | 30 |
| `2016_専門1_建筑环境工学_Q3.md` | 10 |
| `2019_専門1_建筑环境工学_Q2.md` | 10 |
| `2020_専門1_建筑环境工学_Q2.md` | 20 |
| `2024_専門1_建筑环境工学_Q2.md` | 14 |

Distribution: 44 `○`, 40 `×`. Each uses the original segment, its linked answer record, an exact source anchor, real attempt history and review state.

## Second pilot: construction 2024 S1 Q3 local four-choice

`data/processed_questions/2024_専門1_建筑构法_Q3.md` supplies the full original prompt and four local options for each `a–t` slot. `data/construction-2024-q3-slot-review.json` is the separately approved `BC-002` slot index. The implementation compares the chosen local option to that index only after verifying that the approved answer maps to exactly one of the four original options.

- 19 slots (`a–l`, `n–t`) are auto-gradable.
- **Slot `m` is excluded.** Its approved value is `フランジ`, while the original wording describes the connecting portion of an H-section's two flanges; that wording identifies `ウェブ`. The repository has conflicting evidence, so it stays self-evaluation until a corrected primary answer index exists.
- The older `construction-exam-answers.json` draft is not used by the new controls.

## Verified closed-loop behavior

For both active formats, a submission records the original block ID, subquestion ID, user answer, correct answer, result, cognitive task, relation, topic tags, answer basis, timestamp and per-slot attempt count. A wrong answer also writes the review state and returns from `/review` to the source question's exact anchor. Same-type recommendations link only to other real source slots.

## Not eligible yet

The audit deliberately does **not** convert answer availability into automatic grading. The following remain self-evaluation:

- all planning answer records, because their statuses are draft rather than formal source indexes;
- construction draft and image-dependent records;
- all generic free-text numeric/term answers without a reviewed acceptance rule;
- history source-page matching, short answer, drawing and essay prompts;
- any word-bank item whose reuse, position or option-bank constraints have not been preserved.
