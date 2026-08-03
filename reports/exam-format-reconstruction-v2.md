# Exam Format Reconstruction v2

**Scanned:** 134 files, 793 subquestions
**Date:** 2026-07-18 09:30

## Summary

| Metric | Count |
|--------|-------|
| Distinct templates | 19 |
| Data ready | 2 |
| Data partial | 8 |
| Blocked (images) | 4 |
| Not automatable (essay) | 4 |

## Template Frequency

| Template | Freq | Years | Data | Priority |
|----------|------|-------|------|----------|
| generic_short_answer | 487 | 2013,2014,2015,2016,2017 +8 | partial | critical |
| unknown | 79 | 2013,2014,2015,2016,2017 +8 | needs_review | critical |
| planning_inline_numeric_select | 62 | 2017,2019,2020,2022,2023 +2 | partial | critical |
| planning_essay | 37 | 2014,2016,2017,2018,2019 +6 | not_automatable | critical |
| history_essay | 25 | 2014,2016,2017,2018,2020 +4 | not_automatable | critical |
| construction_essay_design | 21 | 2016,2017,2018,2019,2020 +5 | not_automatable | critical |
| construction_numerical | 17 | 2015,2017,2018,2020,2025 +1 | partial | critical |
| history_essay_with_diagram | 12 | 2016,2018,2022,2023,2024 +2 | not_automatable | critical |
| history_image_to_name | 12 | 2022,2025 | blocked_images | critical |
| history_image_wordbank_matching | 9 | 2015,2019,2020,2024,2025 +1 | blocked_images | high |
| environment_numerical_calculation | 7 | 2017,2018,2023,2024,2025 | ready | high |
| construction_independent_fill | 6 | 2016,2019,2020,2024 | partial | high |
| history_image_to_architect | 6 | 2022,2025,2026 | blocked_images | high |
| planning_numerical_calculation | 4 | 2013,2015,2019,2023 | partial | medium |
| history_wordbank_pairing_no_image | 3 | 2013,2018 | blocked_images | medium |
| environment_phenomenon_wordbank | 3 | 2022 | partial | medium |
| environment_correct_statement | 1 | 2019 | partial | low |
| construction_shared_wordbank_fill | 1 | 2022 | partial | low |
| environment_calculation_select | 1 | 2025 | ready | low |

## Current Generator Coverage

Of 19 real exam templates:

- **Ready:** 2 templates can be generated now
- **Partial:** 8 need data fixes (standards verification, more facts)
- **Blocked:** 4 need image confirmation pipeline
- **Not automatable:** 4 are essay/diagram (専門2-2)

## Top 3 Next Implementation Targets

1. **generic_short_answer** — 487 occurrences (2013-2026) — data: partial — difficulty: medium
2. **unknown** — 79 occurrences (2013-2026) — data: needs_review — difficulty: medium
3. **planning_inline_numeric_select** — 62 occurrences (2017-2026) — data: partial — difficulty: low

## Key Finding

The real exam uses **far fewer MCQ formats** than previously assumed.
The dominant formats are:

1. **Word bank matching** (history, construction, environment) — shared bank, surplus terms
2. **Numerical calculation** (environment 13/13, construction 7/15) — formula application
3. **Inline numeric select** (planning 7/7) — values embedded in contextual sentences
4. **Essay/diagram** (専門2-2, all subjects) — not automatable with current approach

Standalone 4-option MCQ is rare. When selection is used, it's embedded in word bank or inline frameworks.
