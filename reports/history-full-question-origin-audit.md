# History complete-mock runtime origin audit

Audit date: 2026-07-18  
Scope: read-only runtime audit. No History complete-mock route, complete-mock assembler, or complete-mock client exists in `src/app/exam/mock` or `src/lib`.

## Verdict

`history_full_mock` has **zero runtime items** because there is no History full-paper entry page. The only History assessment-like route is `/exam/mock/history-mwb`; it is a six-image static prototype and cannot be counted as a complete mock or a formal Generator.

The page never imports `src/lib/atomic-fact-store.ts`, does not read `data/atomic-facts.json`, and does not construct a relation or distractor at runtime. The 1,695 History facts (1,223 high/medium) therefore have no execution-path role here. In particular, `getFactsForBlueprint("history_image_multi_wordbank_matching", "history")` would have 0 eligible facts under the store API because no fact carries that blueprint; that query is not called by the route.

## Complete-mock entry audit

| Subject | item id | Current label | Entry page | Actual function / data flow | Classification |
|---|---|---|---|---|---|
| History | — | — | **No `/exam/mock/history-full` route** | No full-paper page or assembler found; no runtime items exist to audit | — |

## Closest runtime route: `/exam/mock/history-mwb`

Actual chain: `src/app/exam/mock/history-mwb/page.tsx` → `fs.readFileSync("data/history-mwb-prototype.json")` → `HistoryMWBClient` → direct `images`, `wordBanks`, and `correctMapping` rendering. There is no selection, shuffle, seed input, answer interaction, submit, result, or review writeback.

| Subject | item id | Current label | Entry page | Actual function / data read | Prompt source | Answer source | Options / distractors source | Atomic Facts / eligible filter | Runtime relation / seed / new combination | Past Exam Template | Actual classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| History | `img-0430` | `proto-hist-mwb-01`; UI: `2019 Q5 形式` | `/exam/mock/history-mwb` | `Page()` directly reads `data/history-mwb-prototype.json`; `HistoryMWBClient` maps arrays | Fixed `prompt` field in that JSON | Fixed `correctMapping[buildingName]` fields | Fixed 9-name, 9-architect, 9-style banks in same JSON; 3 surplus per bank | **None at runtime**. `atomic-facts.json` is not read. | Relations building→architect/style are prewritten mapping fields. No seed; no new combination. | `history_image_multi_wordbank_matching` / closest `2019 Q5 専門1 建築史` | `question_bank_sampler` (degenerate one-record static bank; not reconstruction because image set/mapping is a prewritten prototype) |
| History | `img-0100` | same | same | same | same | same | same | same | same | same | `question_bank_sampler` |
| History | `img-0354` | same | same | same | same | same | same | same | same | same | `question_bank_sampler` |
| History | `img-0423` | same | same | same | same | same | same | same | same | same | `question_bank_sampler` |
| History | `img-0372` | same | same | same | same | same | same | same | same | same | `question_bank_sampler` |
| History | `img-0137` | same | same | same | same | same | same | same | same | same | `question_bank_sampler` |

### History-specific evidence

- Image recognition is a fixed question object: every reload displays the same six `assetId`s and the same 27 word-bank terms.
- Building name, architect, period/style relations are not dynamically combined: they are explicit `correctMapping` records keyed by the image's prewritten `buildingName`.
- Distractors do not use same-region, same-period, same-type, or other runtime relation rules. They are fixed bank members; the JSON's `banksIndependentlyShuffled: true` validation claim is not executed by `HistoryMWBClient`.
- The only seed-bearing generic route, `/exam/mock`, is not a History full mock and uses `Math.random` to sample its mixed study pool. It cannot supply seeded History complete-mock evidence.

## Formal Generator count and release implication

| Classification | Complete-mock runtime count | Closest standalone prototype count |
|---|---:|---:|
| `past_exam_reconstruction` | 0 | 0 |
| `question_bank_sampler` | 0 | 6 image items |
| `parameterized_variant` | 0 | 0 |
| `atomic_fact_generator` | **0** | **0** |

`history_full_mock` remains `incomplete`. The former prototype's `templateId` and `closestExamRef` are structural references, not evidence of a runtime atomic-fact Generator or complete-paper delivery.
