# Four-section full-mock audit — 2026-07-18

## Decision

The former `MVP_RELEASE_PASS` is invalid and revoked. The repository contains one construction full-mock route, but no verified full mock for history, planning, or environment. Overall status is `INCOMPLETE`.

This audit reads current routes, clients, assemblers, validators, datasets, Specialist 1 processed-question files, answer/index data, attempt/review code, and current generator commands. It does **not** treat old reports or a route name as proof of completion.

## Specialist 1 past-question coverage scanned

`data/processed_questions` has 16 history, 16 planning, 13 environment, and 15 building-construction Specialist 1 files. `data/exam-format-catalog-v2.1.json` contains the following classified Specialist 1 subquestion counts:

| Section | Observed template counts |
| --- | --- |
| History | image-to-name 12; image-wordbank 4; image-to-architect 3; no-image wordbank 2; description-to-name 1; manual review 15 |
| Planning | facility fact recall 98; legal standard fill 8; numerical calculation 3; inline numeric select 1; definition-to-term 1 |
| Environment | fact recall 45; numerical calculation 5; phenomenon wordbank 1; formula completion 2 |
| Building construction | numerical 7; independent fill 4; image-to-component 2; manual review 1 |

## Current implementation audit

| Section | Existing formats and classification | Complete assembler / route | Answer, submit, result, attempts, review | Current 100-seed test / browser E2E | Gate |
| --- | --- | --- | --- | --- | --- |
| History | `history-mwb-prototype.json`: 6-image, 3-bank `past_exam_reconstruction`; `HistoryMWBClient`: static answer reveal | No | No: revealed mapping only | No / no | incomplete |
| Planning | 20-item `past_exam_reconstruction` group plus 4 numeric `parameterized_variant`; facility remains a separate sampler | `/exam/mock/planning-full` / `assemblePlanningFullMock` | Submit and result work; review-writeback browser recheck remains | 100-seed assembly passed; browser render and submit passed | implemented_unverified |
| Environment | 12 calculation `parameterized_variant`; 10 correct-statement `question_bank_sampler` / prototype | No | Both clients are answer reveal only | No / no | incomplete |
| Building construction | numerical `parameterized_variant`; shared-word-bank `question_bank_sampler` in full mock (the live RC route is a separate limited atomic-fact generator); other pre-generated families; 3 manual drafts | `assembleBuildingConstructionMock` and `/exam/mock/building-construction-full` | Yes for 48 objective items; attempts and `ReviewState` writeback; three written rubrics | Current 100-seed command passed; current browser submit/result/review check passed | implemented_unverified |

## Building-construction strict-gate recheck

Commands now run:

```text
npx --yes tsx scripts/validate-mvp-core.ts
node scripts/validate-building-construction-full-mock.js
node scripts/validate-building-construction-production-formats.js
npx --yes tsx scripts/validate-rc-shared-wordbank-generator.ts
node scripts/validate-rc-association-generator.js
```

All passed. The browser flow on `/exam/mock/building-construction-full` rendered 48 auto-graded items plus three rubric-backed written items; submitting rendered a result and `/review` showed the `building-construction-full:` review entries.

It remains `implemented_unverified`, not `verified`, because the strict gate additionally requires a documented Specialist 1 block-count/proportion basis for the assembled 48+3 paper. The current assembler chooses capacities (4/20/6/6/7/5/3) but does not encode or cite that composition basis. The full mock's shared bank is also pre-generated static data, not the live 33-fact RC generator.

## Concrete missing work by section

### History

- Add a complete assembler with image/name/architect/style/period plus a sourced short-answer or rubric-backed written block from Specialist 1 evidence.
- Make matching answerable, auto-gradable, submit-capable, and review-writing; use confirmed image assets only.
- Add composition evidence, 100-seed validation, and browser E2E.

### Planning

- A complete reconstruction route now exists: it deterministically selects one non-duplicated 20-subquestion Specialist 1 planning group from `data/planning-exam-answers.json` and four non-overlapping numeric variants. `scripts/validate-planning-full-mock.ts` passed 100 seeds across four eligible reconstruction groups.
- It is not yet verified: the source index contains draft answer records, the 20+4 composition needs an explicit historical proportion decision, and browser review-writeback must be rechecked after the browser timeout.
- The existing facility page remains one submodule, not the basis for a complete planning claim.

### Environment

- Audit the 10 correct-statement prototypes against their internal learning-card evidence and source association; external URLs are not required.
- Assemble numerical, correct-statement, fact-recall, formula/phenomenon components only when an item has a unique answer and repository trace.
- Add full submission/review flow, 100-seed validation, and browser E2E.

## Cross-section implementation facts

- `src/lib/attempt-records.ts` and `src/lib/review-states.ts` provide the reusable local persistence APIs.
- Existing standalone `EnvCalcClient`, `CorrectStatementClient`, `PlanningNumericClient`, and `HistoryMWBClient` are solution-reveal/static viewing clients, not completed assessed flows.
- `scripts/validate-mvp-core.ts` validates data shapes and building-construction assembly but is not a four-section release validator.
- No current history, planning, or environment full-mock assembler exists in `src/lib`.
