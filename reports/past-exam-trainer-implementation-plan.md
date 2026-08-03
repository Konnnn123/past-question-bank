# Past Exam Intelligent Trainer v1 — data usability and implementation plan

## Readable source inventory

The runtime reads 60 `専門1` original question blocks across the four in-scope subjects: History 16 blocks / 13 years, Planning 16 / 13, Building Construction 15 / 13, and Environment 13 / 13. All are retained as indivisible source blocks for reconstruction browsing.

Source-matched answer indexes make 489 small units trainable with automatic answer comparison: History 25, Planning 120, Building Construction 140, Environment 204. These are Level B: the repository can identify a correct indexed answer, but does not yet establish reliable negative evidence for every original option. The 60 complete blocks are Level C by default: browse and self-evaluate, never fabricated auto-grading. No Level A claim is made because complete per-option evidence is not present in the existing records.

## Usability audit

| Area | Existing evidence | Migration decision |
| --- | --- | --- |
| Formal answers | Planning, construction and environment source-matched answer records; selected history review records | Use as Level B only when file + slot are matched |
| Per-option explanations | No uniform, source-backed negative option analysis | Show the explicit unresolved message instead of inventing explanations |
| Topics/facilities | Existing source tags, review topics, filenames and question text | Derive declared subject-topic tags at runtime; mark unstructured relation detail incomplete |
| Cognitive task | Existing assessment form and source structure | Preserve specific source-task descriptions; confidence is draft where not manually audited |
| Common error tags | Existing answer/review mechanism has no source-backed taxonomy per option | Store minimal source-context / answer-index tags; do not claim distractor analysis |
| Local persistence | `attempt-records.ts`, review state and study records already use localStorage | Extend attempt records with optional trainer provenance; keep older records valid |

## Minimal implementation files

- `src/lib/past-exam-trainer.ts`: source block catalog, answer-index units, level and topic derivation.
- `src/app/trainer/page.tsx` and `TrainerClient.tsx`: unified reconstruction, sampling, explanation, wrong-answer and path modes.
- `src/lib/attempt-records.ts`: optional provenance fields needed for durable wrong-answer aggregation.
- `data/question-learning-metadata.json`: explicit Level/derivation policy and unresolved explanation rule.

No Generator, Atomic Fact, new question content, or new answer has been introduced.
