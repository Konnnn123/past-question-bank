# Generator Relation Specification v1

> What each generator should test, and where distractors come from.
> Design document only. No implementation.

---

## 1. history_image_wordbank_matching

**Purpose:** Match building images to architects, styles, and periods through independently shuffled word banks.

**Relation:**
```
Image → Building → Architect
Image → Building → Style
Image → Building → Period
```

**Source Entity Type:** `building` (identified via confirmed image asset)

**Target Entity Types:** `architect`, `style`, `period`

**Distractor Pool Rule:**
- Each word bank contains ONE semantic field only
- Architect bank: all entries from `designed_by_architect` / `designed_by_office` relations, excluding patrons/rulers
- Style bank: all entries from `has_architectural_style` / `has_regional_style` relations
- Period bank: all entries from `built_in` relation
- 20-50% surplus terms per bank
- Images may be heterogeneous (cross-period, cross-region) — no theme requirement
- Banks shuffled independently of images

**Required Fields:** `image_asset` (humanConfirmed), `building_name`, `architect`, `style`, `period`

**Optional Fields:** `original_name`, `country`, `building_type`

**Generator Constraints:** Banks must not mix semantic fields. No emperor/patron in architect bank. No style variants that create ambiguity per image.

**Current Data Ready?** Blocked — images need human confirmation.

---

## 2. history_image_to_name

**Purpose:** Identify a building from its photograph. Pure free recall.

**Relation:** `Image → Building Name`

**Source Entity Type:** `building` (image)

**Target Entity Type:** `building_name`

**Distractor Pool Rule:** None. Free recall format.

**Required Fields:** `image_asset`, `building_name`

**Current Data Ready?** Blocked — images need human confirmation.

---

## 3. history_image_to_architect

**Purpose:** Identify the architect from a building photograph.

**Relation:** `Image → Building → Architect`

**Source Entity Type:** `building` (image)

**Target Entity Type:** `architect`

**Distractor Pool Rule:** None. Free recall format.

**Required Fields:** `image_asset`, `architect` (from `designed_by_architect` / `designed_by_office` only)

**Current Data Ready?** Blocked — images need human confirmation.

---

## 4. history_wordbank_pairing_no_image

**Purpose:** Match building names to architects, styles, or periods without images.

**Relation:** `Building Name → Architect | Style | Period`

**Source Entity Type:** `building`

**Target Entity Types:** `architect`, `style`, `period`

**Distractor Pool Rule:** Same as `history_image_wordbank_matching` — homogeneous semantic fields per bank.

**Required Fields:** `building_name`, `architect`, `style`, `period`

**Current Data Ready?** Partial — facts exist. Needs authoring of word bank questions (text-only format).

---

## 5. history_description_to_name

**Purpose:** Identify a building or concept from a textual description.

**Relation:** `Description → Building Name | Concept Name`

**Source Entity Type:** `description` (from `has_feature` or `history` text)

**Target Entity Type:** `building_name` / `concept_name`

**Distractor Pool Rule:** Same building type, same period where possible. Never cross civilizations without shared context.

**Required Fields:** `description_text` (candidate), `entity_name`

**Optional Fields:** `period`, `style`

**Current Data Ready?** Partial — has feature descriptions (candidates) but needs distractor pools.

---

## 6. construction_shared_wordbank_fill

**Purpose:** Fill technical blanks in construction passages from a shared surplus word bank. 2022 Q3 format.

**Relation:** `Technical Context Sentence → Construction Term`

**Source Entity Type:** `technical_sentence` (composed)

**Target Entity Type:** `construction_term`

**Distractor Pool Rule:**
- Single shared bank of 12-27 terms, 25-50% surplus
- All terms from construction domain
- Surplus terms must be plausible in the same technical context
- Similar abbreviations preferred (CFT/CLT, SSG/MPG)

**Required Fields:** `term_name`, `technical_definition` (from `defined_as` or `has_function`)

**Optional Fields:** `category`, `knowledge_family`

**Generator Constraints:** Do NOT copy Anki definitions. Compose original technical sentences. Each blank only has one technically correct answer.

**Current Data Ready?** Partial — has terms and definitions. Needs composed passage generator.

---

## 7. construction_independent_fill

**Purpose:** Fill a single blank in a construction sentence without a shared bank.

**Relation:** `Construction Description → Term Name`

**Source Entity Type:** `description`

**Target Entity Type:** `construction_term`

**Distractor Pool Rule:** None. Free recall or standalone fill.

**Required Fields:** `description_text`, `term_name`

**Current Data Ready?** Partial.

---

## 8. construction_numerical

**Purpose:** Calculate or recall numerical values for construction materials and structures.

**Relation:** `Material | Structure → Numeric Property`

**Source Entity Type:** `material` / `structural_element`

**Target Entity Type:** `numeric_value` (density, strength, dimension)

**Distractor Pool Rule:**
- Same unit
- Close magnitude
- Adjacent material properties
- Common miscalculation values

**Required Fields:** `material_name`, `property_value`, `unit`

**Current Data Ready?** Partial — limited to Anki-sourced values. Needs verified material property data.

---

## 9. construction_image_to_component

**Purpose:** Identify a construction component from a diagram or photograph.

**Relation:** `Image → Component Name`

**Source Entity Type:** `component` (image)

**Target Entity Type:** `component_name`

**Distractor Pool Rule:** None. Free recall.

**Required Fields:** `image_asset`, `component_name`

**Current Data Ready?** Blocked — needs confirmed construction images.

---

## 10. environment_numerical_calculation

**Purpose:** Apply an environmental physics formula to compute a value.

**Relation:** `Formula + Given Parameters → Calculated Value`

**Source Entity Type:** `formula` + `variables`

**Target Entity Type:** `numeric_value` (with unit)

**Distractor Pool Rule:** None. Calculation format.

**Required Fields:** `formula`, `variables` (name, value_range, unit), `worked_solution`, `assumptions`

**Generator Constraints:** Multi-step where exam pattern requires. Explicit assumptions. Unit consistency check.

**Current Data Ready?** Ready — 5 calculation families, 12 production questions.

---

## 11. environment_phenomenon_wordbank

**Purpose:** Match everyday physical phenomenon descriptions to correct terminology from a large surplus word bank.

**Relation:** `Phenomenon Description → Physical Term`

**Source Entity Type:** `phenomenon_description`

**Target Entity Type:** `physical_term`

**Distractor Pool Rule:**
- 30-100% surplus (e.g., 36 terms for 16 items)
- Terms from ALL environment sub-domains mixed (acoustics, thermal, lighting, ventilation)
- Surplus terms appear plausible in adjacent domains

**Required Fields:** `phenomenon_description`, `term_name`

**Current Data Ready?** Partial — has formula names and descriptions. Needs authored phenomenon→term pairs.

---

## 12. environment_formula_completion

**Purpose:** Complete missing elements in a physical formula: quantity name, exponent, or symbol.

**Relation:** `Formula → Quantity Name + Exponent`

**Source Entity Type:** `formula`

**Target Entity Types:** `quantity_name`, `integer_exponent`

**Distractor Pool Rule:**
- Dimensionally plausible terms
- Same domain terms preferred

**Required Fields:** `formula`, `quantity_name`, `exponent`, `variable_symbols`

**Current Data Ready?** Partial — has formulas but needs internal blank templates.

---

## 13. environment_fact_recall

**Purpose:** Recall a specific environmental fact, term, or concept from a prompt.

**Relation:** `Concept Name → Definition | Principle | Value`

**Source Entity Type:** `environmental_concept`

**Target Entity Type:** `definition` / `principle` / `numeric_value`

**Distractor Pool Rule:**
- Same topic (thermal, acoustic, lighting, etc.)
- Same semantic level
- Comparable specificity

**Required Fields:** `entity_name`, `definition` / `value`

**Current Data Ready?** Partial — has facts. Needs topic tagging for distractor pools.

---

## 14. environment_correct_statement

**Purpose:** Select the correct statement from four options within the same topic.

**Relation:** `Statement → Truth Value`

**Source Entity Type:** `principle_statement`

**Target Entity Type:** `truth_value`

**Distractor Pool Rule:**
- All 4 statements from the SAME topic only
- False statements from documented misconceptions (not mechanical inversion)
- Comparable sentence length and specificity
- Each false statement has exactly one clear error point

**Required Fields:** `correct_statement`, `false_statement` (misconception-based), `topic`

**Current Data Ready?** Partial — misconception library has 20 entries. Needs expansion to 40+.

---

## 15. planning_inline_numeric_select

**Purpose:** Select the correct numeric standard value embedded in a contextual building scenario.

**Relation:** `Standard Name → Numeric Value (with unit, building type context)`

**Source Entity Type:** `planning_standard`

**Target Entity Type:** `numeric_value`

**Distractor Pool Rule:**
- Same unit
- Close magnitude
- Same building type context
- Adjacent standards or common confusion values

**Required Fields:** `standard_name`, `numeric_value`, `unit`, `building_type`, `scope_condition`

**Generator Constraints:** All options in the same unit. Contextualize by building use.

**Current Data Ready?** Partial — has values. Needs building type tagging and standards verification.

---

## 16. planning_facility_fact_recall

**Purpose:** Recall a planning fact about a facility type, concept, or case study.

**Relation:** `Facility | Concept | Case → Description | Feature | Definition`

**Source Entity Type:** `facility_type` / `planning_concept` / `planning_case`

**Target Entity Type:** `description` / `feature` / `definition`

**Distractor Pool Rule:**
- Same `useType` (hospital, school, housing, etc.)
- Same `analysisAxis` (ward_plan, classroom_layout, etc.)
- Same `conceptLevel` (spatial_pattern, building_case, etc.)
- Never mix: a hospital question cannot have a school concept as a distractor

**Required Fields:** `entity_name`, `value` (definition/description), `useType`, `conceptLevel`

**Optional Fields:** `analysisAxis`, `patternFamily`

**Generator Constraints:** At least 2 of 3 distractors share the same useType as the correct answer. Never use cross-topic distractors.

**Current Data Ready?** Partial — 8/12 pilot passed. Needs better useType tagging to reduce cross-topic distractors.

---

## 17. planning_legal_standard_fill

**Purpose:** Recall or select a legal/regulatory standard value.

**Relation:** `Legal Provision → Required Value | Dimension | Condition`

**Source Entity Type:** `legal_standard`

**Target Entity Type:** `numeric_value` / `condition_text`

**Distractor Pool Rule:**
- Same regulatory domain (fire safety, accessibility, area standards)
- Close values
- Same unit

**Required Fields:** `standard_name`, `legal_value`, `legal_reference`, `unit`

**Current Data Ready?** Blocked — legal values need verification against actual Japanese building codes.

---

## Summary Table

| # | Template | Relation | Source Type | Target Type | Distractor Pool | Data Ready? |
|---|----------|----------|-------------|-------------|-----------------|-------------|
| 1 | history_image_wordbank_matching | Image→Building→(Architect,Style,Period) | building (image) | architect, style, period | Homogeneous per bank, 20-50% surplus | Blocked (images) |
| 2 | history_image_to_name | Image→Name | building (image) | building_name | None (free recall) | Blocked (images) |
| 3 | history_image_to_architect | Image→Building→Architect | building (image) | architect | None (free recall) | Blocked (images) |
| 4 | history_wordbank_pairing_no_image | Name→(Architect,Style,Period) | building | architect, style, period | Homogeneous per bank | Partial |
| 5 | history_description_to_name | Description→Name | description | building/concept name | Same type+period | Partial |
| 6 | construction_shared_wordbank_fill | Sentence→Term | technical_sentence | construction_term | Same domain, 25-50% surplus | Partial |
| 7 | construction_independent_fill | Description→Term | description | construction_term | None | Partial |
| 8 | construction_numerical | Material→Property | material | numeric_value | Same unit, close magnitude | Partial |
| 9 | construction_image_to_component | Image→Component | component (image) | component_name | None | Blocked (images) |
| 10 | environment_numerical_calculation | Formula→Value | formula+vars | numeric_value | None (calculation) | **Ready** |
| 11 | environment_phenomenon_wordbank | Phenomenon→Term | phenomenon_description | physical_term | All env domains, 30-100% surplus | Partial |
| 12 | environment_formula_completion | Formula→(Name,Exponent) | formula | quantity_name, integer | Dimensionally plausible | Partial |
| 13 | environment_fact_recall | Concept→Definition | environmental_concept | definition/value | Same topic, same level | Partial |
| 14 | environment_correct_statement | Statement→Truth | principle_statement | truth_value | Same topic, misconception-based | Partial |
| 15 | planning_inline_numeric_select | Standard→Value | planning_standard | numeric_value | Same unit, same building type | Partial |
| 16 | planning_facility_fact_recall | Concept→Description | planning_concept | description | Same useType+conceptLevel | Partial |
| 17 | planning_legal_standard_fill | Law→Value | legal_standard | numeric_value | Same regulatory domain | Blocked (legal) |

---

## Unimplementable Templates (with current Atomic Facts)

### Template 11: environment_phenomenon_wordbank

**Missing:** Phenomenon descriptions. Current facts have formula names and physical quantities, but NOT everyday-language phenomenon descriptions like "台所には一般的にレンジフードが備え付けられる → 局所換気".

**Requires:** Manual authoring of phenomenon→term pairs, or extraction from past exam markdown.

### Template 17: planning_legal_standard_fill

**Missing:** Verified legal values with references. Current standard_value facts come from Anki/Notion planning data and have NOT been verified against the actual Japanese Building Standards Law.

**Requires:** Manual verification of each value against current building codes.

---

**STOP. Document complete.**
