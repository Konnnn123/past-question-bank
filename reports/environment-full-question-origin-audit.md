# Environment complete-mock runtime origin audit

Audit date: 2026-07-18  
Scope: read-only runtime audit. No Environment complete-mock route or full-paper assembler exists in `src/app/exam/mock` or `src/lib`.

## Verdict

`environment_full_mock` has **zero runtime items**: there is no `/exam/mock/environment-full` page, no Environment assembly function, and no full-paper submission/result/review path. The two closest routes are static prototype/study views:

- `/exam/mock/env-calc`: directly renders all 12 precomputed numerical records from `data/environment-calculation-pilot.json`.
- `/exam/mock/correct-statement`: directly renders all ten prototype records from `data/correct-statement-prototypes.json`, five of which are Environment records; it also mixes five Planning records.

Neither route imports `atomic-fact-store`, queries `atomic-facts.json`, executes an eligible-fact filter, selects an item by seed, establishes a relation at runtime, or computes a distractor at runtime. The 381 Environment facts (all high/medium) therefore have no runtime role in either route; `getFactsForBlueprint("environment_numerical_calculation", "environment")` would return 0 and is not called.

## Complete-mock entry audit

| Subject | item id | Current label | Entry page | Actual function / data flow | Classification |
|---|---|---|---|---|---|
| Environment | — | — | **No `/exam/mock/environment-full` route** | No full-paper page or assembler found; no runtime items exist to audit | — |

## Closest route A: `/exam/mock/env-calc` — numerical prototype

Actual chain: `EnvCalcPage()` → `fs.readFileSync("data/environment-calculation-pilot.json")` → `EnvCalcClient` → `questions.map`. The production-template, unit-rule, parameter-range, validation, and Atomic Fact files are **not loaded by this route**. The prompt, variables, answer, and worked solution are already materialized JSON strings. There are no options/distractors, no seed, and no numerical recomputation in the client.

| Subject | item id | Current label | Entry page | Actual function / data read | Prompt / answer / distractor source | Atomic Facts / eligible filter | Runtime relation / seed / new combination | Past Exam Template | Actual classification |
|---|---|---|---|---|---|---|---|---|---|
| Environment | `env-calc-ventilation_co2-01` | JSON `fidelityAudit.details: parameterized`; UI `Production Ready` | `/exam/mock/env-calc` | `EnvCalcPage`; `EnvCalcClient` direct map | Static pilot JSON prompt, variables, `correctAnswer`, solution; no distractor | none / none | no / no seed / no | `environment_numerical_calculation` | `question_bank_sampler` |
| Environment | `env-calc-ventilation_co2-02` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-ventilation_co2-03` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-thermal_transmission-01` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-thermal_transmission-02` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-thermal_transmission-03` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-reverberation-01` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-reverberation-02` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-illuminance_point-01` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-illuminance_point-02` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-dynamic_pressure-01` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `env-calc-dynamic_pressure-02` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |

The 12 pilots are precomputed parameterized *outputs*, but are **not** runtime `parameterized_variant`s: the route does not vary a parameter, run a formula, or create a question. If routed through the unrelated generic `/exam/mock`, that page samples the same fixed records using `Math.random`; it remains static-bank sampling and is not reproducible.

### Numerical validity check

Independently recomputed each record from its materialized `variables` using its stated family formula: CO2 `Q=G/(Ci-Co)`, thermal `U=1/(ho+d1/λ1+d2/λ2+hi)`, Sabine `T60=.161V/A`, point illuminance `E=I cosθ/r²`, and dynamic pressure `q=ρv²/2`. All 12 numerical results match their displayed answer at its recorded rounding precision. `data/environment-calculation-validation.json` also records all 12 as `passed`.

This confirms the static records are internally plausible; it does **not** establish a runtime Generator. Unit and range files exist (`data/environment-unit-rules.json`, `data/environment-parameter-ranges.json`), but the page does not load or enforce them. Consequently, there is no runtime proof that new parameter combinations would remain physically valid or unit-safe.

## Closest route B: `/exam/mock/correct-statement` — fixed statement bank

Actual chain: `Page()` → `fs.readFileSync("data/correct-statement-prototypes.json")` → `CorrectStatementClient` → direct `questions.map`. It does not filter `subject === "environment"`; five Planning records are rendered beside the five Environment records. Each statement, `correctIndex`, explanation, and false-misconception reference is prewritten in JSON. Options are fixed strings, not dynamically selected distractors.

| Subject | item id | Current label | Entry page | Actual function / data read | Prompt / answer / distractor source | Atomic Facts / eligible filter | Runtime relation / seed / new combination | Past Exam Template | Actual classification |
|---|---|---|---|---|---|---|---|---|---|
| Environment | `cs-environment-01` | UI `V2 revision` | `/exam/mock/correct-statement` | `Page`; `CorrectStatementClient` direct map | Static JSON `prompt`, `options`, `correctIndex`, explanation; fixed four options | none / none | no / no / no | no `templateId` or concrete past-exam reference stored | `question_bank_sampler` |
| Environment | `cs-environment-02` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `cs-environment-03` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `cs-environment-04` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |
| Environment | `cs-environment-05` | same | same | same | same | none / none | no / no / no | same | `question_bank_sampler` |

## Formal Generator count and release implication

| Classification | Complete-mock runtime count | Standalone Environment prototype count |
|---|---:|---:|
| `past_exam_reconstruction` | 0 | 0 |
| `question_bank_sampler` | 0 | 17 |
| `parameterized_variant` | 0 | 0 |
| `atomic_fact_generator` | **0** | **0** |

`environment_full_mock` remains `incomplete`. The labels `Production Ready`, `parameterized`, and `V2 revision` are not runtime Generator evidence and must not count toward a Generator release gate.
