# Root Cause Fix Report

**Generated:** 2026-07-17 22:28:48

## Summary

| Subject | Facts Updated | Key Changes |
|---------|--------------|-------------|
| History | 0 | Split people roles (8 types) + style axes (5 types) |
| Construction | 4 | entityGranularity (7 types) + definition cleaning + knowledge families |
| Planning | 793 | useType × analysisAxis × conceptLevel × patternFamily |
| Environment | 381 | domain (7) × expressionType (5) |

## Round 2 Sample

| Subject | Questions | Blueprints |
|---------|-----------|-----------|
| history | 15 | architect_to_work(5), building_to_period(5), building_style_pairing(5) |
| construction | 10 | component_to_function(5), defect_to_cause(5) |
| planning | 15 | description_to_pattern(5), pattern_comparison(5), number_standard(5) |
| environment | 12 | quantity_to_calculation_formula(5), phenomenon_to_criterion(2), phenomenon_to_term(5) |

## Fix Log

- [history] Roles reclassified: 0 types, 0 facts
- [history] Styles reclassified: 0 types
- [construction] Granularity: {'term': 414, 'method': 69, 'defect': 8, 'chapter_heading': 4, 'component': 30, 'process': 3}
- [construction] Chapter headings demoted: 5
- [planning] Concept levels: {'numeric_standard': 247, 'person_view': 5, 'building_case': 56, 'concept': 287, 'spatial_pattern': 194, 'institution': 4}
