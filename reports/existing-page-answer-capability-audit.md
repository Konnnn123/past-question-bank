# Existing-page answer capability audit

Audit date: 2026-07-19  
Scope: the formal knowledge-map pages and source-question views. `/trainer` is excluded: it is deprecated and redirects to `/practice`.

## Evidence inspected

- `src/app/environment-knowledge-map/EnvironmentKnowledgeMapClient.tsx`
- `src/lib/environment-review.ts`
- `src/app/planning-knowledge-map/PlanningKnowledgeMapClient.tsx`
- `src/app/construction-methods-knowledge-map/ConstructionMethodsKnowledgeMapClient.tsx`
- `src/app/architecture-history-knowledge-map/ArchitectureHistoryKnowledgeMapClient.tsx`
- `src/app/question/[id]/page.tsx`
- `src/lib/study-records.ts`, `src/lib/attempt-records.ts`, and `src/app/review/ReviewClient.tsx`

## Capability by source-question format

| Source-question format | Complete original structure visible | Formal answer index available | Current answering capability | Automatic grading | Answer/explanation path | Navigation and learning state | Status |
|---|---|---|---|---|---|---|---|
| Four-choice (planning source slots) | Yes. The planning map preserves the original stem and listed choices. | Yes for the indexed past-paper slots shown by the map. | No source-bound choice submission yet. | No. | Expand the indexed answer, then self-evaluate. | Per-slot manual state and exact map anchor are available. | Self-evaluation only. |
| True/false (environment source slots with one `○` / `×` answer index) | Yes. Topic mode shows the unmodified source segment before controls. | Yes for the eligible slots in `ENVIRONMENT_REVIEW_RECORDS`; 2014 S1 Q2 is the first verified block. | `○` / `×` buttons and submit are available only where the answer index begins with exactly one mark. | Yes. The submitted mark is compared to the indexed `○` / `×`. | After submission, show user answer, indexed answer, answer basis, task and relation. No unsupported option analysis is invented. | Attempt, study status, review state, exact source anchor and same-type real-question links are recorded. | **Automatic-grading pilot.** |
| Word-bank / fill-in-the-blank | The original question and its word-bank/blank layout are displayed where present. | Some answer keys exist, but the current map does not have a reliable source-slot-to-control mapping for every blank/reuse rule. | No automatic slot input. | No. | Reveal answer and self-evaluate. | Manual per-slot state where a segment is identifiable. | Self-evaluation only. |
| Matching (history) | Yes in the history source material and image/matching pages. | Matching pairs exist for the separately validated matching exercise. | The knowledge-map source view is answer/review oriented; it is not a generalized source-page matcher. | Only the existing verified matching exercise; not asserted for all historical source pages. | Pairing answer or rubric is visible when supplied. | Manual status is available; source-map return remains the formal route. | Mixed; source page remains self-evaluation unless that exact matching UI is used. |
| Numeric fill-in | Source stems and formula/numeric answers are visible when indexed. | Often yes, but accepted precision, units and intermediate forms are not normalized for every source slot. | No universal source-bound numeric input. | No universal automatic grading. | Reveal indexed result and self-evaluate. | Manual status when a source slot is identified. | Self-evaluation only. |
| Short answer / essay | Yes, including original context and supplied answer samples. | Rubric or answer sample is partial and varies by source. | No claim of automatic scoring. | No. | Reveal sample/rubric, then self-evaluate. | Manual status only; history HR-001 and HR-002 remain `missing_source_material`. | Self-evaluation only. |
| Drawing / image / plan question | Image and original prompt remain attached to their source page where assets exist. | Some have answer examples, not machine-checkable answer keys. | No drawing canvas or automated grading is claimed. | No. | Answer example/rubric then self-evaluate. | Manual status only. | Self-evaluation only. |
| No formal answer / incomplete answer index | Original material can still be browsed. | No reliable formal key. | No answer control. | No. | Explicitly use self-evaluation only if a source explanation/rubric exists; otherwise no correctness claim. | May be marked uncertain/later manually. | Not auto-gradable. |

## Pilot selection

**Environment engineering — 2014 Specialist 1 Q2 true/false source slots.**

Why this is the smallest honest closed loop:

1. The page keeps the exact original segment visible (`question.content` split only at source subquestion boundaries).
2. `src/lib/environment-review.ts` contains a separate, source-linked answer item for each 2014 Q2 segment, each beginning with exactly `○` or `×`.
3. The user action is observable and has a single indexed answer, so automatic grading does not infer a free-text answer or fabricate distractor reasoning.
4. The same metadata used by the retired trainer is now attached to the real source slot: block/subquestion ID, cognitive task, knowledge relation, topic tags, answer basis, attempts and review state.

## Explicit limits

- Revealing an existing answer remains allowed for self-evaluation; it is never recorded as an automatically correct attempt.
- “Only needs practice” in environment topic mode excludes unanswered slots and includes only wrong, uncertain or later source slots. The full-year mode retains its older question-level filter until each source format is migrated.
- A same-type recommendation is a link to another real source slot. It never synthesizes a new question.
