# Generator Relation Specification v1.1

> v1: What relation does each generator test?
> v1.1: What sub-relations exist, and what is the Distractor Pool Rule for each?

---

## Rule Zero

```
Every generator must answer this before writing a single line of prompt code:

"我的干扰项到底允许从哪里来？"

This is the lifeblood of generator quality.
```

---

## 1. history_image_wordbank_matching

**V1 Relation:** Image→Building→(Architect, Style, Period)

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 1.1 | Image→Building Name | image → building_name | Bank A: all building names from confirmed images, 20-50% surplus from buildings NOT in the image set |
| 1.2 | Image→Architect | image → architect | Bank B: `designed_by_architect` + `designed_by_office` only. No patrons/rulers. Surplus from same period/same region architects. |
| 1.3 | Image→Style | image → architectural_style | Bank C: `has_architectural_style` + `has_regional_style` only. No building_type or classical_order mixed in. |
| 1.4 | Image→Period | image → period/era | Bank D (optional): `built_in` values. 同時代を近接に配置。 |
| 1.5 | Image→Detail/Component | image_detail → component_name | Bank E (optional): building components named in the image. |

**Each sub-relation generates a SEPARATE word bank. Never merge 1.2 and 1.3 into one bank.**

---

## 2. history_image_to_name

**V1 Relation:** Image→Building Name

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 2.1 | Exterior Photo→Name | exterior_image → building_name | None. Free recall. |
| 2.2 | Interior Photo→Name | interior_image → building_name | None. Free recall. |
| 2.3 | Detail Photo→Name | detail_image → building_name | None. Free recall. |

**Free recall has no distractor pool. The difficulty is the recall itself.**

---

## 3. history_image_to_architect

**V1 Relation:** Image→Building→Architect

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 3.1 | Building Photo→Architect | image → architect | None. Free recall. |
| 3.2 | Detail Photo→Structural Engineer | image → engineer | None. Free recall. Only `engineered_by` facts. |

---

## 4. history_wordbank_pairing_no_image

**V1 Relation:** Building Name→(Architect, Style, Period)

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 4.1 | Building Name→Architect | building_name → architect | Bank: `designed_by_architect` + `designed_by_office`. Surplus: same period architects. |
| 4.2 | Building Name→Style | building_name → architectural_style | Bank: `has_architectural_style`. Surplus: same style family. |
| 4.3 | Building Name→Period | building_name → period | Bank: `built_in`. Surplus: adjacent periods. |
| 4.4 | Style Name→Example Building | style → building_name | Bank: buildings with that style. Reverse of 4.2. |

---

## 5. history_description_to_name

**V1 Relation:** Description→Building/Concept Name

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 5.1 | Feature Description→Building Name | feature_text → building_name | Same period + same building_type. Never cross civilizations. |
| 5.2 | Historical Event→Related Building | event_description → building_name | Same period. |
| 5.3 | Style Description→Style Name | style_description → architectural_style | Same style family only. |

---

## 6. building_construction_shared_wordbank_fill

**V1 Relation:** Technical Sentence→Construction Term

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 6.1 | Material Context→Material Name | sentence_about_material → material_term | Bank: all material terms. Surplus: similar-abbreviation terms. |
| 6.2 | Structural Context→Structural Term | sentence_about_structure → structural_term | Bank: all structural terms. Surplus: same system family. |
| 6.3 | Process Context→Process Term | sentence_about_process → process_term | Bank: all process terms. Surplus: adjacent process steps. |
| 6.4 | Defect Context→Defect Name | sentence_about_defect → defect_term | Bank: all defect terms. Surplus: similar-appearance defects. |

**One question can mix sub-relations (2022 Q3 does). But each blank tests ONE sub-relation.**

---

## 7. building_construction_independent_fill

**V1 Relation:** Description→Term Name

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 7.1 | Definition→Term | definition_text → term_name | None. Free recall. |
| 7.2 | Function Description→Component | function_text → component_name | None. Free recall. |

---

## 8. building_construction_numerical

**V1 Relation:** Material→Numeric Property

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 8.1 | Material→Density | material_name → kg/m³_value | Same unit. Adjacent material densities. |
| 8.2 | Material→Strength | material_name → N/mm²_value | Same unit. Adjacent strengths. |
| 8.3 | Element→Dimension | element_name → mm/cm/m_value | Same unit. Adjacent standard dimensions. |

**Scope boundary:** Euler buckling, effective buckling length, second moment of area, support conditions, and compression-member buckling belong to `structural_mechanics`. That subject is out of the current scope and has no generator specification yet.

---

## 9. building_construction_image_to_component

**V1 Relation:** Image→Component Name

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 9.1 | Photo→Component | component_image → component_name | None. Free recall. |
| 9.2 | Detail Drawing→Component | detail_drawing → component_name | None. Free recall. |
| 9.3 | Construction Sequence→Step Name | sequence_diagram → step_name | None. Free recall. |

---

## 10. environment_numerical_calculation

**V1 Relation:** Formula+Parameters→Calculated Value

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 10.1 | Given Values→Ventilation Rate | G, Ci, Co → Q (m³/h) | None. Calculation. |
| 10.2 | Given Values→U-value | d, λ, h → U (W/m²·K) | None. Multi-step calculation. |
| 10.3 | Given Values→Reverberation Time | V, A → T₆₀ (s) | None. Calculation. |
| 10.4 | Given Values→Illuminance | I, r, θ → E (lx) | None. Calculation. |
| 10.5 | Given Values→Dynamic Pressure | ρ, v → q (Pa) | None. Calculation. |

**Each sub-relation = one calculation family. Already production-ready.**

---

## 11. environment_phenomenon_wordbank

**V1 Relation:** Phenomenon Description→Physical Term

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 11.1 | Everyday Observation→Physical Law/Term | "ストーブは近づくほど暖かい" → 放射伝熱 | Bank: ALL env domain terms mixed. 30-100% surplus. |
| 11.2 | Lab Condition→Measurement Method | "異種金属線の両接点に温度差" → 熱電対 | Same as above. |
| 11.3 | Design Choice→Ventilation Type | "台所にレンジフード" → 局所換気 | Same as above. |

**Key insight: distractors come from ALL environment domains. The difficulty is identifying the correct domain.**

---

## 12. environment_formula_completion

**V1 Relation:** Formula→(Quantity Name, Exponent)

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 12.1 | Formula→Quantity Name | "Q = G/(Ci-Co)" → "必要換気量" | Dimensionally plausible quantity names from all domains. |
| 12.2 | Formula→Missing Exponent | "E = I·cosθ/r^Y" → "2" | Adjacent integers. Common wrong exponents. |
| 12.3 | Formula→Missing Variable Symbol | "q = ρ·v^X/2" → "2" | Same. |

---

## 13. environment_fact_recall

**V1 Relation:** Concept→Definition/Principle/Value

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 13.1 | Term→Definition | environmental_term → definition_text | Same topic (thermal/acoustic/lighting). Same specificity. |
| 13.2 | Law/Principle→Description | law_name → principle_description | Same domain. |
| 13.3 | Quantity→Typical Value | quantity_name → typical_numeric_value | Same unit. Close magnitude. |

---

## 14. environment_correct_statement

**V1 Relation:** Statement→Truth Value

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 14.1 | Principle→Correct | correct_principle → true | 3 false statements from misconception library. Same topic only. |
| 14.2 | Misconception→Should Be Caught | false_belief → false | Embedded as a distractor in 14.1. |
| 14.3 | Conditional Judgment→Correct Under Condition | principle + boundary → true | False: same principle under WRONG boundary. |

**False options MUST come from the misconception library. Mechanical inversion prohibited.**

---

## 15. planning_inline_numeric_select

**V1 Relation:** Standard→Numeric Value

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 15.1 | Area Standard→m² Value | "病室面積" → "≥6.4 m²/床" | Same unit. Adjacent building-type standards. |
| 15.2 | Dimension Standard→cm/m Value | "手すり高さ" → "≥110 cm" | Same unit. Adjacent safety standards. |
| 15.3 | Capacity Standard→Person Count | "エレベーター利用者数" → "220人" | Same ordinal magnitude. Common miscalculation. |
| 15.4 | Distance Standard→m Value | "近隣住区の徒歩限界" → "800m" | Same unit. Adjacent planning distances. |

**Every option must be contextualized by building use. No bare numbers without context.**

---

## 16. planning_facility_fact_recall

**V1 Relation:** Concept→Description

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 16.1 | Concept→Definition | planning_concept → definition_text | Same `useType`. Never cross hospital↔school. |
| 16.2 | Case→Description | planning_case → case_description | Same `useType` + same `conceptLevel`. |
| 16.3 | Theory→Example | planning_theory → example_application | Same `useType`. |
| 16.4 | Facility→Spatial Feature | facility_type → spatial_pattern | Same `useType` + same `analysisAxis`. |
| 16.5 | Project→Planner/Architect | building_project → planner_name | Same period. Same building type. |
| 16.6 | Building→Spatial Pattern | building_case → pattern_name | Same `conceptLevel`. Never pattern↔case mixed. |

**This template is the most sub-relation-rich. Most of the 12 pilot failures came from confusing 16.2 with 16.4, or 16.1 with 16.6.**

---

## 17. planning_legal_standard_fill

**V1 Relation:** Legal Provision→Value

### Sub-relations

| # | Sub-relation | Source→Target | Distractor Pool Rule |
|---|-------------|---------------|---------------------|
| 17.1 | Building Code→Dimension | code_clause → required_dimension | Same regulatory domain. |
| 17.2 | Fire Safety→Distance/Width | fire_code → evacuation_width | Same safety domain. Adjacent values. |
| 17.3 | Accessibility→Dimension | accessibility_code → ramp_slope | Same domain. |
| 17.4 | Area Standard→Minimum Area | area_code → min_m² | Same building type. Adjacent area standards. |

**All values must be verified against current Japanese codes. Unverified values = blocked.**

---

## Summary Table (v1.1)

| # | Template | Sub-relations | Key Distractor Pool Rule |
|---|----------|--------------|--------------------------|
| 1 | history_image_wordbank_matching | 5 | Each sub-relation = separate homogeneous bank |
| 2 | history_image_to_name | 3 | None (free recall). Difficulty = recall itself. |
| 3 | history_image_to_architect | 2 | None (free recall). |
| 4 | history_wordbank_pairing_no_image | 4 | Same period for architects. Same style family. |
| 5 | history_description_to_name | 3 | Same period + same building type. Never cross civilizations. |
| 6 | building_construction_shared_wordbank_fill | 4 | One question can mix sub-relations. Each blank = one sub-relation. |
| 7 | building_construction_independent_fill | 2 | None (free recall). |
| 8 | building_construction_numerical | 3 | Same unit. Adjacent values. |
| 9 | building_construction_image_to_component | 3 | None (free recall). |
| 10 | environment_numerical_calculation | 5 | None (calculation). Each sub-relation = one family. |
| 11 | environment_phenomenon_wordbank | 3 | ALL env domains mixed. 30-100% surplus. |
| 12 | environment_formula_completion | 3 | Dimensionally plausible. Same domain. |
| 13 | environment_fact_recall | 3 | Same topic. Same specificity. |
| 14 | environment_correct_statement | 3 | Same topic. False from misconception library. No mechanical inversion. |
| 15 | planning_inline_numeric_select | 4 | Same unit. Same building type. Context required. |
| 16 | planning_facility_fact_recall | 6 | Same `useType`. Never cross hospital↔school. |
| 17 | planning_legal_standard_fill | 4 | Same regulatory domain. Must verify against codes. |

---

**STOP. Document complete.**
