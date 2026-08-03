# Question Blueprint Coverage Matrix

## Implemented Blueprints

| Blueprint | Subject | Exam Years | Exam Count | Implemented | Facts | Questions | Approved | TQ Avg | PQ Avg | Missing Reason |
|-----------|---------|-----------|------------|-------------|-------|-----------|----------|--------|--------|----------------|
| 概念四選一 (concept_four_choice) | planning | 2014,2016,2017,2018,2019 | 23 | ✅ | 623 | 50 | 47 | 93.7 | 95.5 | — |
| 圖片→建築名稱 (image_to_building) | history | 2014,2015,2016,2018,2019 | 17 | ❌ | 0 | 0 | 0 | 0 | 0 | 缺图片绑定（需图片→Anki media 映射） |
| 數值填空 (number_fill_blank) | planning | 2016,2017,2018,2019,2020 | 13 | ❌ | 170 | 0 | 0 | 0 | 0 | 生成条件未满足（干扰项不足或字段缺失） |
| 公式→物理量 (formula_to_quantity) | environment | 2013,2014,2015,2016,2017 | 11 | ❌ | 116 | 0 | 0 | 0 | 0 | 生成条件未满足（干扰项不足或字段缺失） |
| 小型數值計算 (numeric_calculation) | environment | 2013,2014,2015,2016,2017 | 11 | ❌ | 58 | 0 | 0 | 0 | 0 | 生成条件未满足（干扰项不足或字段缺失） |
| 現象→術語 (phenomenon_to_term) | environment | 2014,2015,2016,2017,2019 | 9 | ❌ | 0 | 0 | 0 | 0 | 0 | 缺原子事实（需补充数据源） |
| 數值四選一 (number_four_choice) | planning | 2017,2019,2020,2022,2023 | 7 | ✅ | 170 | 45 | 12 | 81.4 | 92.9 | — |
| 圖片→建築師 (image_to_architect) | history | 2015,2019,2020,2024,2025 | 6 | ❌ | 272 | 0 | 0 | 0 | 0 | 缺图片绑定（需图片→Anki media 映射） |
| 圖片→樣式／時代 (image_to_style) | history | 2015,2019,2020,2024,2025 | 6 | ❌ | 382 | 0 | 0 | 0 | 0 | 缺图片绑定（需图片→Anki media 映射） |
| 圖片→構件名稱 (image_to_component) | construction | 2016,2018,2020,2022,2023 | 6 | ❌ | 0 | 0 | 0 | 0 | 0 | 缺图片绑定（需图片→Anki media 映射） |
| 定義→用語 (definition_to_term) | construction | 2022 | 1 | ❌ | 0 | 0 | 0 | 0 | 0 | 缺原子事实（需补充数据源） |
| 建築→建築師（配對） (building_to_architect) | history |  | 0 | ✅ | 272 | 50 | 47 | 95.5 | 85.4 | — |
| 建築→成立年代（配對） (building_to_period) | history |  | 0 | ✅ | 385 | 50 | 38 | 93.8 | 78.2 | — |
| 建築→代表特徵（配對） (building_to_feature) | history |  | 0 | ❌ | 0 | 0 | 0 | 0 | 0 | 缺原子事实（需补充数据源） |
| 建築師→作品（配對） (architect_to_work) | history |  | 0 | ✅ | 272 | 50 | 50 | 90.0 | 80.6 | — |
| 建築→様式（語群配對） (building_style_pairing) | history |  | 0 | ✅ | 382 | 50 | 49 | 93.0 | 82.8 | — |
| 異類辨識 (odd_one_out) | history |  | 0 | ❌ | 767 | 0 | 0 | 0 | 0 | 未在真题中观察到（需人工设计题型模板） |
| 用語→分類 (term_to_category) | construction |  | 0 | ❌ | 185 | 0 | 0 | 0 | 0 | 未在真题中观察到（需人工设计题型模板） |
| 用語→説明（四選一） (term_to_definition) | construction |  | 0 | ✅ | 0 | 50 | 41 | 88.1 | 83.2 | — |
| 用語關聯配對 (term_association) | construction |  | 0 | ❌ | 185 | 0 | 0 | 0 | 0 | 未在真题中观察到（需人工设计题型模板） |
| 案例→計劃特徵 (case_to_feature) | planning |  | 0 | ❌ | 623 | 0 | 0 | 0 | 0 | 未在真题中观察到（需人工设计题型模板） |
| 錯誤陳述辨識 (false_statement_identify) | planning |  | 0 | ❌ | 623 | 0 | 0 | 0 | 0 | 未在真题中观察到（需人工设计题型模板） |
| 物理量→公式 (quantity_to_formula) | environment |  | 0 | ✅ | 58 | 50 | 40 | 90.1 | 86.9 | — |
| 條件變化→增減判斷 (condition_change_judge) | environment |  | 0 | ❌ | 0 | 0 | 0 | 0 | 0 | 缺原子事实（需补充数据源） |

## Unimplemented Blueprints (Gap Analysis)

### 圖片→建築名稱 (`image_to_building`)
- **Subject:** history
- **Exam occurrences:** 17 (2014, 2015, 2016, 2018, 2019, 2020, 2022, 2023, 2024, 2025, 2026)
- **Required facts:** has_image, entityName → available: 0
- **Needs image:** True
- **Blocked by:** 缺少图片→实体映射。需要从 Anki media 文件或 Notion 图片建立 image_ref 索引。

### 圖片→建築師 (`image_to_architect`)
- **Subject:** history
- **Exam occurrences:** 6 (2015, 2019, 2020, 2024, 2025, 2026)
- **Required facts:** has_image, designed_by → available: 272
- **Needs image:** True
- **Blocked by:** 缺少图片→实体映射。需要从 Anki media 文件或 Notion 图片建立 image_ref 索引。

### 圖片→樣式／時代 (`image_to_style`)
- **Subject:** history
- **Exam occurrences:** 6 (2015, 2019, 2020, 2024, 2025, 2026)
- **Required facts:** has_image, has_style → available: 382
- **Needs image:** True
- **Blocked by:** 缺少图片→实体映射。需要从 Anki media 文件或 Notion 图片建立 image_ref 索引。

### 建築→代表特徵（配對） (`building_to_feature`)
- **Subject:** history
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, has_feature → available: 0
- **Needs image:** False
- **Blocked by:** 无可用原子事实。需要补充数据源或人工标注。

### 異類辨識 (`odd_one_out`)
- **Subject:** history
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, has_style, built_in → available: 767
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 定義→用語 (`definition_to_term`)
- **Subject:** construction
- **Exam occurrences:** 1 (2022)
- **Required facts:** entityName, defined_as → available: 0
- **Needs image:** False
- **Blocked by:** 无可用原子事实。需要补充数据源或人工标注。

### 用語→分類 (`term_to_category`)
- **Subject:** construction
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, belongs_to → available: 185
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 用語關聯配對 (`term_association`)
- **Subject:** construction
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, belongs_to → available: 185
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 圖片→構件名稱 (`image_to_component`)
- **Subject:** construction
- **Exam occurrences:** 6 (2016, 2018, 2020, 2022, 2023)
- **Required facts:** has_image, entityName → available: 0
- **Needs image:** True
- **Blocked by:** 缺少图片→实体映射。需要从 Anki media 文件或 Notion 图片建立 image_ref 索引。

### 數值填空 (`number_fill_blank`)
- **Subject:** planning
- **Exam occurrences:** 13 (2016, 2017, 2018, 2019, 2020, 2022, 2023, 2024, 2025, 2026)
- **Required facts:** entityName, standard_value → available: 170
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 案例→計劃特徵 (`case_to_feature`)
- **Subject:** planning
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, defined_as → available: 623
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 錯誤陳述辨識 (`false_statement_identify`)
- **Subject:** planning
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, defined_as → available: 623
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 現象→術語 (`phenomenon_to_term`)
- **Subject:** environment
- **Exam occurrences:** 9 (2014, 2015, 2016, 2017, 2019, 2022, 2024, 2025, 2026)
- **Required facts:** entityName, defined_as → available: 0
- **Needs image:** False
- **Blocked by:** 无可用原子事实。需要补充数据源或人工标注。

### 公式→物理量 (`formula_to_quantity`)
- **Subject:** environment
- **Exam occurrences:** 11 (2013, 2014, 2015, 2016, 2017, 2018, 2020, 2022, 2023, 2024, 2025)
- **Required facts:** formula_text, computes → available: 116
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 小型數值計算 (`numeric_calculation`)
- **Subject:** environment
- **Exam occurrences:** 11 (2013, 2014, 2015, 2016, 2017, 2018, 2020, 2022, 2023, 2024, 2025)
- **Required facts:** entityName, formula_text → available: 58
- **Needs image:** False
- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。

### 條件變化→增減判斷 (`condition_change_judge`)
- **Subject:** environment
- **Exam occurrences:** 0 ()
- **Required facts:** entityName, defined_as → available: 0
- **Needs image:** False
- **Blocked by:** 无可用原子事实。需要补充数据源或人工标注。

## Summary

- Total blueprints: 24
- Implemented: 8
- Not yet implemented: 16
- Total questions in pool: 395