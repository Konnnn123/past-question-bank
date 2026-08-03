# Blockers

## Active task blocker: Planning image multi-wordbank Generator

The requested Planning image multi-wordbank vertical slice cannot be implemented from the
current repository without inventing a template, image facts, or answer relations.

Evidence checked on 2026-07-18:

- `data/processed_questions/*_専門1_建筑计划_*.md` contains the Specialist 1 Planning
  question corpus, but no Planning image-question source was found. The only image/photo
  Planning source located is `data/processed_questions/2018_専門2-2_建筑计划_Q1.md`, which is
  outside the Specialist 1 scope and is a photo-description task rather than a shared-wordbank
  template.
- `data/image-assets.json` has no Planning subject linkage or Planning Atomic Fact references.
- Planning Atomic Facts have `0` `image_ref` values, and `data/question-blueprints.json` has no
  active Planning image/shared-wordbank blueprint. Its image matching blueprints are History-only.
- `src/lib/planning-essay-answers.ts` explicitly records missing/placeholder Planning diagrams
  and says the relevant answers remain pending source-image collation.

Minimum unblock: add one Specialist 1 Planning image past-exam source/template plus linked,
reviewed image assets and one-to-one image-answer facts. No code-only repair can create those
evidence inputs honestly.

## Non-blocking known gaps

- Three of four required sections have no complete mock assembler yet.
- Existing correct-statement data must be evaluated against internal learning-card evidence rather than deferred solely for lack of external URLs.
- Content diversity may remain a limitation after a complete runnable flow; it does not remove the requirement for a complete paper.

## Construction independent-fill evidence gap

The next observed construction core format cannot be promoted from the current static format data without overstating its evidence:

- `data/building-construction-production-formats-v1.json` has no per-item `factId`, source link, relation field, or false-distractor provenance for `scoped_term_short_answer` and `inline_four_choice_fill`.
- `data/construction-exam-answers.json` provides useful past-exam answers but the relevant records are `card-supported-draft`, not reviewed Atomic Facts.
- The static inline options establish a past item, but cannot prove same-domain distractors false for a new entity/relation combination.

Minimum unblock: review answer-index records into relation-specific, source-linked facts and establish a distractor compatibility rule per domain. No existing construction candidate is promoted by this finding.

## Resolved checkpoint: Environment `phenomenon_to_term` core template

`data/question-blueprints.json` records `phenomenon_to_term` as an observed Specialist 1
Environment template in 9 years (2014, 2015, 2016, 2017, 2019, 2022, 2024, 2025, 2026).
Its required relations are `entityName` and `defined_as`, with word-bank surplus terms.

The reviewed pool is now represented in `data/environment-phenomenon-approved-facts.json` with
**16 approved** `defined_as` facts. The existing runtime route calls the seeded generator and the
1,000-seed validator passes. This resolves the technical-minimum blocker, not the production
diversity recommendation: a 16-term pool is the exact word-bank size and therefore does not
provide healthy cross-paper term rotation.

Remaining non-blocking work: expand the approved pool with independently sourced facts before a
full-release diversity claim.

## Resolved checkpoint: Environment correct-statement evidence gap

`environment_correct_statement` is an observed core template. Its five reviewed proposition
packs are now in `data/environment-correct-statement-approved-propositions.json`, each with a
source pointer, a true proposition, and three explicitly documented false propositions. The
runtime generator is live and its 1,000-seed validator passes.

Remaining non-blocking work: enlarge the five-pack pool before claiming robust production
variety. The static prototype is still not used as a generator source.

## Active phase blocker: History non-image core blocks

The live History image word-bank is now calibrated to the actual `2019_専門1_建筑史_Q5.md`
structure (25 figures; Group A/B each with 30 terms). The remaining observed Specialist 1
History blocks cannot yet be promoted into a release paper without inventing a safe answer pool:

- `2015_専門1_建筑史_Q3.md` contains a multi-part description/fill block, but the related
  history text records are `imported` / `needs-review` and include demonstrably conflicting
  architect/year fields in `data/history-review-index.tsv`.
- `2015_専門1_建筑史_Q7.md` is explanatory writing. No reviewed, source-linked rubric exists
  for its three required explanatory dimensions.
- `2014_専門1_建筑史_Q5.md` and `2018_専門1_建筑史_Q5.md` are further word-bank forms, but
  there is no audited answer mapping that can establish a new relation-specific eligible pool
  and false distractors independently of the existing image generator.

Minimum unblock: review and correct the specific History text records / answer mappings, then
create relation-specific eligibility data and a minimal human rubric for Q7. Do not derive new
facts merely by rewriting the question stems. The image Q5 generator remains usable; this
blocker affects only the unimplemented History core blocks.

## Verification constraint: production build while local dev server is running

The focused validators, ESLint, and `npx tsc --noEmit` passed after this milestone. A final
`npm run build` cannot be run concurrently with the existing user-owned server at port 3210:

```text
⨯ Another next build process is already running.
Suggestion: Wait for the build to complete.
```

The running processes are `next dev -p 3210` and its worker, both started before this task.
They were left untouched to avoid interrupting the active local site. Stop that dev server (or
run the production build in a separate worktree) to perform the final build-only verification.
