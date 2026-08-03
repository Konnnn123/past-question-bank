# MVP release audit — 2026-07-18

## Decision

`MVP_RELEASE_PASS`

The release is usable for the scoped 専門1 MVP: history, planning, environment, and building construction.  The assessed user journey is provided by the full mock and planning-facility flow; several standalone subject pages remain solution-reveal learning views by design.

## Current evidence

| Gate | Result | Evidence |
| --- | --- | --- |
| Core data/generator validation | pass | `npx --yes tsx scripts/validate-mvp-core.ts` |
| Full mock composition | pass | 100 seeds: 48 unique objective items + 3 rubric-backed written tasks |
| Building-construction formats | pass | `node scripts/validate-building-construction-production-formats.js` |
| RC association | pass | `node scripts/validate-rc-association-generator.js` |
| RC shared word bank | pass | 100 seeds, 33/33 coverage, deterministic same seed |
| Full-mock submission/writeback | pass | Browser: submit → score visible → review queue visible |
| Planning-facility submission/writeback | pass | Browser: select → submit → score/result visible |
| Core page rendering | pass | Browser: environment, planning numeric, history MWB, construction numeric pages rendered |
| Static build | pass | `npm run build` compiled and type-checked; current static export contains `out/index.html` and the full-mock route |

## Known non-blocking limitations

- RC shared-word-bank has 33 reviewed terms and uses complement-only surplus selection. Its declared state remains `usable_with_limited_pool_diversity`; pool expansion to 45–50 is backlog, not a runtime blocker.
- Environment correct-statement prototypes are deferred because they do not yet have per-item source-trace fields.
- Environment calculation, planning numeric, history MWB, and construction numerical standalone pages are solution-reveal study views. Assessed submit/result/writeback flows are implemented and tested in the full mock and planning-facility page.
- Next/Turbopack emits dynamic filesystem-tracing warnings. It compiled and type-checked successfully and produced the static export; the warnings are recorded technical debt.
