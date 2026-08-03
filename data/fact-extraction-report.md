# Atomic Fact Extraction Report

**Generated:** 2026-07-17 21:25:31

## Summary

| Metric | Count |
|--------|-------|
| Total confirmed facts | 3397 |
| Total candidates (needs review) | 1447 |
| Skipped (uncertain value) | 116 |
| Duplicates removed | 77 |

## Confidence Distribution

| Confidence | Count |
|-----------|-------|
| High | 2203 |
| Medium | 1194 |
| Low | 0 |

## By Subject

| Subject | Confirmed Facts | Candidates |
|---------|----------------|------------|
| history | 1695 | 1298 |
| construction | 528 | 149 |
| planning | 793 | 0 |
| environment | 381 | 0 |

## By Entity Type

| Type | Count |
|------|-------|
| building | 1423 |
| term | 1321 |
| formula | 381 |
| person | 272 |

## Top Relations

| Relation | Count |
|----------|-------|
| defined_as | 623 |
| appears_in_exam | 608 |
| built_in | 385 |
| has_original_name | 384 |
| has_style | 382 |
| designed_by | 272 |
| designed | 272 |
| belongs_to | 185 |
| standard_value | 170 |
| formula_text | 58 |
| computes | 58 |

## Next Steps

1. Review `candidate-facts.json` — confirm, edit, or reject each candidate
2. Run `build-question-blueprints.py` to scan all past exam question patterns
3. Run `generate-preview.py` to produce 20 preview questions per subject
