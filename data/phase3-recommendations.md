# Phase 3 Recommendations

## Readiness Summary

- **Construction**: Requires template redesign
  - Top failures: {'copied_anki_definition': 3}
- **Environment**: Requires template redesign
  - Top failures: {'surface_level_not_conceptual': 10, 'missing_context_or_scope': 3, 'symbol_recall_not_relationship': 2}
- **History**: Requires template redesign
  - Top failures: {'single_fact_recall_not_exam_like': 17}
- **Planning**: Blocked by missing data
  - Top failures: {'surface_level_not_conceptual': 6, 'missing_context_or_scope': 5}

## Key Finding

**Generated questions use the correct FORMAT labels but do not yet reproduce the STRUCTURAL DEPTH of real past exams.**

Root causes across all generators:

1. **Single-fact recall**: Generated questions test one fact per prompt. Real exam questions require combining multiple clues (image + context + word bank).

2. **Missing surplus**: Real word banks have 30-50% more terms than needed. Generated banks are minimally surplus.

3. **Copied definitions**: Fill-blank and short-answer items directly reproduce Anki definition text rather than constructing exam-style contextual descriptions.

4. **Surface-level false statements**: Correct-statement-select generates false options by mechanical inversion (increase→decrease), not conceptual misunderstanding.

5. **Decontextualized**: Questions present bare facts without the building-type, era, or use-context that real exams embed.

## Recommended Actions

1. **History word_bank**: Restructure as unified 語群A+語群B matching question with 6-10 image prompts sharing 15-20 term banks, not individual items.

2. **Construction fill_blank**: Build exam-style contextual sentences (not copied definitions). Ensure 30% surplus terms from adjacent domains.

3. **Environment calculation**: Keep. Add explicit assumptions and multi-step structure. Current items are closest to exam fidelity.

4. **Environment correct_statement**: Replace mechanical inversion with genuine plausible false statements.

5. **Planning**: Add building-type/use context to inline numeric prompts. Verify values against actual Japanese building standards.

6. **Formula completion**: Restructure as true formula completion (blank IN the formula) rather than formula→name recall.
