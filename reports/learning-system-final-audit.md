# Learning-system final audit

## Implemented migration

- Planning full practice now renders all 20 indexed 2023 Q4 past-exam reconstruction units. The numeric-neighbour generator no longer replaces any formal slot.
- Planning numeric and facility pages are explicitly marked `deprecated_prototype` and are absent from the learning-system entry page.
- The cross-subject `/exam/mock` entry now performs only past-exam sampling; it no longer offers static “simulation” pilot content.
- Building Construction entry preserves only the RC shared-word-bank mechanism as `validated_generator`; a missing RC pool gives an explicit 2024 Q3 reconstruction fallback.
- Environment formal runtime practice preserves only the CO₂ ventilation formula calculation as `validated_generator`; the formula-name, phenomenon-term, and true/false packs are not enabled in that formal runtime blueprint.
- History image matching remains unchanged in its reviewed, seeded, validated runtime chain.

## Metadata coverage

`data/question-learning-metadata.json` covers the formal runtime units used in this release:

| Subject | Coverage | Mode | Confidence |
| --- | ---: | --- | --- |
| Planning | 20 indexed 2023 Q4 units | `past_exam_reconstruction` | draft answer index |
| Building Construction | 20 RC shared-word-bank slots | `validated_generator` | verified |
| Environment | 1 CO₂ ventilation calculation | `validated_generator` | verified |
| History | 50 scored image-matching axes | `validated_generator` | verified |

Each formal client renders answer, cognitive task, answer basis, confidence, and topic tags after submission.

## Automated verification

- `npx tsc --noEmit`: pass
- `npx tsx scripts/validate-planning-full-mock.ts`: pass, 100 seeds, 20 reconstruction units
- `npx tsx scripts/validate-history-image-wordbank-generator.ts`: pass, 100 seeds
- `npx tsx scripts/validate-building-construction-runtime-integration.ts`: pass, 100 seeds, no Structural Mechanics leakage
- `npx tsx scripts/validate-environment-runtime-integration.ts`: pass, 100 seeds

## Browser verification

The local browser completed render → answer state → submit → result/learning metadata for all four migrated formal entries:

- `/exam/mock/history-mwb`
- `/exam/mock/planning-full`
- `/exam/mock/building-construction-full`
- `/exam/mock/env-calc`

`FOUR_SECTION_LEARNING_SYSTEM_PASS` is therefore satisfied.

## Real limitations

- HR-001 and HR-002 remain `missing_source_material` and stay reconstruction-only.
- Planning facility negative-evidence whitelist remains empty, so that dynamic facility page remains deprecated.
- The RC word-bank has limited pool diversity.
- Environment phenomenon surplus terms lack a reviewed per-description confusion matrix and are not promoted to validated generation.
