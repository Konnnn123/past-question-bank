# Construction Category Audit Report

## Summary

| Classification | Categories | Facts | % |
|---------------|-----------|-------|---|
| Knowledge (exam-relevant) | 2 | 77 | 42% |
| Internal (management tags) | 5 | 108 | 58% |
| Uncertain (needs review) | 0 | 0 | 0% |

## Knowledge Categories (use for term_to_category questions)

| Category | Facts |
|----------|-------|
| 部材 | 58 |
| 材料 | 19 |

## Internal/Management Tags (NOT for exam questions)

| Tag | Facts | Reason |
|-----|-------|--------|
| 工法 | 74 | too_short |
| 构法 | 17 | too_short |
| 组装 | 13 | too_short |
| 数值 | 3 | too_short |
| 工艺 | 1 | too_short |

## Uncertain Categories (need human review)

| Category | Facts | Reason |
|----------|-------|--------|

## Affected Questions (should be deprecated or re-blueprinted)

0 term_to_category questions use internal tags as correct answers.


## Recommended Actions

1. **Internal tags**: Exclude from `term_to_category` blueprint. These categories should not appear as correct answers in practice questions.
2. **Uncertain tags**: Review manually. Recategorize to knowledge or internal.
3. **Deprecated questions**: Questions using internal tags as answers should be:
   - Re-blueprinted to `term_to_definition` (if a definition exists)
   - Or marked as `low_value` and excluded from the pool
4. **New blueprints**: Consider adding:
   - `term_to_function` (用语→功能)
   - `component_to_location` (构件→使用位置)
   - `defect_to_cause` (缺陷→原因)
