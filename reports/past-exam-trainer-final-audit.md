# Past Exam Intelligent Trainer v1 — final audit

## Runtime coverage

| Subject | Readable years | Original blocks | Auto-scored source-matched small units |
| --- | ---: | ---: | ---: |
| History | 13 | 16 | 25 |
| Planning | 13 | 16 | 120 |
| Building Construction | 13 | 15 | 140 |
| Environment | 13 | 13 | 204 |

Level totals: **A 0**, **B 489**, **C 60**. Level B answer comparisons use existing answer indexes only. Level C opens the original block, preserves question order and images through Markdown rendering, and is never auto-scored. HR-001 and HR-002 remain `missing_source_material` where applicable.

## Implemented functions

- Reconstruction browsing filters real `専門1` blocks by subject and year and exposes their original source path, year, question number, mode and confidence.
- Sampling combines subject, year, surface format, cognitive task, topic/facility tag and confidence filters. It only selects existing source-matched small questions.
- Submission displays user answer, correct answer, cognitive task, knowledge relation, answer basis, confidence, topics, source and related real questions.
- The absence of reliable option-level evidence always displays: `现有资料仅能确认正确答案，尚无足够证据逐项解释其他选项。`
- Wrong answers persist in the existing `past-question-attempts-v2` localStorage store with subject, year, task, relation, tags and error tags. History is retained after a successful retry; the UI supports retraining and a mastered marker.
- The daily path selects only actual indexed questions, prioritising the same wrong question, related task/topic, then unseen items. Empty coverage uses: `当前题库中没有更多同类过去问。`

## Honest limitations

- No source-backed universal per-option distractor explanation is available, so no such explanation is generated.
- Original blocks without a matched answer record are browse/self-evaluation only.
- Topic derivation is a filter aid, not a claim that every block has manually audited semantic metadata.

## Verification

- TypeScript: pass (`npx tsc --noEmit`)
- ESLint: pass (`npm run lint`)
- Production build: pass (`npm run build`)
- JSON integrity: pass (`question-learning-metadata.json`, `SYSTEM-STATUS.json`)
- Browser: pass at `/trainer` — original block catalog, combined sampling filters, wrong submission → answer/explanation panel, local wrong-answer aggregation, retraining controls and five-item learning path were observed.

`PAST_EXAM_TRAINER_V1_PASS`: **pass**.
