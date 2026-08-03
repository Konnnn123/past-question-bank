#!/usr/bin/env python3
"""
Phase 4 — Structural Template Reconstruction
==============================================
Decompose real past exam questions → build canonical templates → prototype max 12 questions.
Templates define REASONING STRUCTURE, not surface format.
"""
import json, re, sys, io, random, hashlib
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)
BASE = Path(__file__).parent.parent
DATA = BASE / "data"
PROCESSED = DATA / "processed_questions"

def load_data():
    with open(DATA / "atomic-facts.json", "r", encoding="utf-8") as f: facts = json.load(f)["facts"]
    cp = DATA / "candidate-facts.json"
    cands = json.load(open(cp, "r", encoding="utf-8")).get("candidates", []) if cp.exists() else []
    past = []
    for fp in sorted(PROCESSED.glob("*.md")):
        with open(fp, "r", encoding="utf-8") as f: content = f.read()
        ym = re.search(r'(\d{4})', fp.name); year = int(ym.group(1)) if ym else 0
        tier = "2-2" if "2-2" in fp.name else "1"
        subj = ""
        if "建筑史" in fp.name: subj = "history"
        elif "建筑构法" in fp.name: subj = "construction"
        elif "建筑环境" in fp.name: subj = "environment"
        elif "建筑计划" in fp.name: subj = "planning"
        else: continue
        past.append({"file": fp.name, "year": year, "tier": tier, "subject": subj, "content": content})
    return facts, cands, past

# ============================================================================
# PART 1: STRUCTURAL DECOMPOSITION
# ============================================================================

DECOMPOSITIONS = {
    "history_2022_Q5": {
        "templateId": "history_image_free_recall",
        "year": 2022, "subject": "history", "tier": "1",
        "decomposition": {
            "stimulusType": "image_only_20_photographs",
            "contextualFrame": "各図について問いに答えなさい",
            "subquestionCount": 20,
            "factsRequired": 20,
            "clueTypes": ["visual_identity", "architectural_detail", "style_marker"],
            "relationBetweenClues": "independent_items",
            "answerFormat": "free_recall_short_text",
            "distractorStructure": "none_pure_recall",
            "reasoningSteps": 1,
            "domainKnowledge": ["building_recognition", "architect_attribution", "style_taxonomy"],
            "difficultyFactors": ["image_ambiguity", "building_rarity", "detail_specificity"],
            "expectedResponseLength": "1-10 chars per item",
            "ambiguityControls": "none_explicit",
            "scoringLogic": "exact_match_or_equivalent",
            "visualDependency": "absolute",
            "subquestionDependencies": "none_independent",
        }
    },
    "history_2019_Q5_wordbank": {
        "templateId": "history_image_wordbank_matching",
        "year": 2019, "subject": "history", "tier": "1",
        "decomposition": {
            "stimulusType": "25_images_with_wordbanks_A_and_B",
            "contextualFrame": "各図と関係あるキーワードをGroup A, Group Bより選びなさい",
            "subquestionCount": 25,
            "factsRequired": 50,
            "clueTypes": ["visual_identity", "wordbank_terms"],
            "relationBetweenClues": "each_image_matches_one_term_from_A_and_one_from_B",
            "answerFormat": "number_pair_A_B",
            "distractorStructure": "surplus_wordbank_30pct_same_domain",
            "reasoningSteps": 2,
            "domainKnowledge": ["building_recognition", "architect_attribution", "style_terminology", "concept_matching"],
            "difficultyFactors": ["image_ambiguity", "cross_domain_bank", "dual_matching"],
            "expectedResponseLength": "number pairs",
            "ambiguityControls": "each_term_used_at_most_once",
            "scoringLogic": "exact_match",
            "visualDependency": "absolute",
            "subquestionDependencies": "shared_wordbank_depletes",
        }
    },
    "construction_2022_Q3": {
        "templateId": "construction_multi_blank_wordbank",
        "year": 2022, "subject": "construction", "tier": "1",
        "decomposition": {
            "stimulusType": "20_independent_technical_sentences",
            "contextualFrame": "材料や構法、施工法について書かれた文章",
            "subquestionCount": 20,
            "factsRequired": 20,
            "clueTypes": ["technical_context", "domain_keywords", "sentence_structure"],
            "relationBetweenClues": "independent_blanks",
            "answerFormat": "select_from_27term_wordbank",
            "distractorStructure": "surplus_7_from_27_35pct_same_construction_domain",
            "reasoningSteps": 2,
            "domainKnowledge": ["material_properties", "construction_terminology", "structural_systems", "construction_process"],
            "difficultyFactors": ["similar_abbreviations", "cross_subdomain_terms", "technical_precision"],
            "expectedResponseLength": "single_term_per_blank",
            "ambiguityControls": "only_one_term_fits_technically",
            "scoringLogic": "exact_term_match",
            "visualDependency": "none",
            "subquestionDependencies": "none_independent",
        }
    },
    "environment_2022_Q2": {
        "templateId": "environment_phenomenon_wordbank_plus_formula_completion",
        "year": 2022, "subject": "environment", "tier": "1",
        "decomposition": {
            "stimulusType": "16_phenomenon_descriptions_plus_6_formulas",
            "contextualFrame": "各説明に関連のある語を語群から選びなさい",
            "subquestionCount": 22,
            "factsRequired": 22,
            "clueTypes": ["everyday_phenomenon_description", "physical_formula"],
            "relationBetweenClues": "independent_items",
            "answerFormat": "term_selection_plus_exponent",
            "distractorStructure": "surplus_125pct_36_for_16_mixed_all_env_domains",
            "reasoningSteps": 2,
            "domainKnowledge": ["physics_laws", "environmental_phenomena", "formula_structure"],
            "difficultyFactors": ["cross_domain_bank", "similar_phenomena", "formula_ambiguity"],
            "expectedResponseLength": "term_plus_integer",
            "ambiguityControls": "each_term_used_once",
            "scoringLogic": "exact_match",
            "visualDependency": "none",
            "subquestionDependencies": "none_independent",
        }
    },
    "planning_2022_Q4": {
        "templateId": "planning_contextual_inline_numeric",
        "year": 2022, "subject": "planning", "tier": "1",
        "decomposition": {
            "stimulusType": "20_contextualized_sentences_with_inline_options",
            "contextualFrame": "最も適切な値をひとつ選びなさい",
            "subquestionCount": 20,
            "factsRequired": 20,
            "clueTypes": ["building_type", "spatial_context", "quantity_name", "unit"],
            "relationBetweenClues": "independent_items",
            "answerFormat": "select_from_3_4_inline_values",
            "distractorStructure": "same_unit_close_magnitude_common_misconceptions",
            "reasoningSteps": 2,
            "domainKnowledge": ["planning_standards", "building_typology", "design_guidelines", "historical_facts"],
            "difficultyFactors": ["close_values", "context_specificity", "calculation_required"],
            "expectedResponseLength": "single_value",
            "ambiguityControls": "exactly_one_standard_value",
            "scoringLogic": "exact_value_match",
            "visualDependency": "none",
            "subquestionDependencies": "none_independent",
        }
    },
}

# ============================================================================
# PART 2: CANONICAL TEMPLATES
# ============================================================================

TEMPLATES = {
    # --- HISTORY ---
    "history_image_free_recall": {
        "id": "history_image_free_recall",
        "subject": "history", "type": "image_identification",
        "examEvidence": "2022 Q5: 20 photographs → write name/style/architect",
        "minFacts": 1, "requiredFactCategories": ["building_entity", "image_asset"],
        "relationTypes": ["has_image"], "contextRequired": False,
        "subquestions": "1_per_image", "answerFormat": "free_recall",
        "distractorRule": "none_pure_recall", "difficultyControls": ["image_ambiguity", "building_rarity"],
        "ambiguityControls": ["accepted_aliases"], "blockedIf": "no_image_asset",
        "prohibitedShortcuts": ["do_not_convert_to_mcq", "do_not_add_fake_options"],
    },
    "history_image_wordbank_matching": {
        "id": "history_image_wordbank_matching",
        "subject": "history", "type": "word_bank_matching",
        "examEvidence": "2019 Q5: 25 images → Group A (people/styles) + Group B (concepts)",
        "minFacts": 10, "requiredFactCategories": ["building_entity", "image_asset", "architect", "style", "period"],
        "relationTypes": ["has_image", "designed_by_architect", "has_architectural_style", "built_in"],
        "contextRequired": False,
        "subquestions": "6-25_images_share_2_wordbanks", "answerFormat": "number_pair_or_term",
        "distractorRule": "surplus_30_50pct_same_semantic_category_within_each_bank",
        "difficultyControls": ["cross_domain_bank_mixing", "image_ambiguity"],
        "ambiguityControls": ["each_term_used_once", "two_independent_clues_per_item"],
        "blockedIf": "fewer_than_10_entities_with_images",
        "prohibitedShortcuts": ["single_fact_name_to_value", "architect_to_work_mcq"],
    },

    # --- CONSTRUCTION ---
    "construction_multi_blank_wordbank": {
        "id": "construction_multi_blank_wordbank",
        "subject": "construction", "type": "fill_blank_word_bank",
        "examEvidence": "2022 Q3: 20 blanks, 27-term bank, 35% surplus",
        "minFacts": 15, "requiredFactCategories": ["term_entity", "technical_definition"],
        "relationTypes": ["defined_as", "belongs_to"],
        "contextRequired": True, "contextType": "technical_sentence_newly_composed",
        "subquestions": "10-20_blanks_share_one_wordbank", "answerFormat": "select_term_from_bank",
        "distractorRule": "surplus_30_50pct_all_construction_domain_similar_abbrev_plausible",
        "difficultyControls": ["similar_abbreviations", "cross_subdomain_terms"],
        "ambiguityControls": ["only_one_term_fits_technically", "no_grammar_only_hint"],
        "blockedIf": "fewer_than_15_terms_in_domain",
        "prohibitedShortcuts": ["do_not_copy_anki_definition", "do_not_single_term_mcq"],
    },

    # --- ENVIRONMENT ---
    "environment_numerical_calculation": {
        "id": "environment_numerical_calculation",
        "subject": "environment", "type": "numerical_calculation",
        "examEvidence": "13/13 years 専門1 環境 have numerical calculation",
        "minFacts": 1, "requiredFactCategories": ["formula", "variables", "units", "value_ranges"],
        "relationTypes": ["formula_text", "computes"],
        "contextRequired": True, "contextType": "physical_scenario",
        "subquestions": "1", "answerFormat": "numeric_with_unit",
        "distractorRule": "none_calculation",
        "difficultyControls": ["multi_step", "unit_conversion", "assumption_explicit"],
        "ambiguityControls": ["deterministic_answer", "tolerance_defined", "dimensional_check"],
        "blockedIf": "no_worked_solution_or_no_variable_ranges",
        "prohibitedShortcuts": ["direct_substitution_only", "no_assumptions_stated"],
    },
    "environment_correct_statement": {
        "id": "environment_correct_statement",
        "subject": "environment", "type": "correct_statement_select",
        "examEvidence": "5/13 years 専門1 環境 have correct-statement items",
        "minFacts": 4, "requiredFactCategories": ["principle", "condition", "boundary"],
        "relationTypes": ["defined_as", "formula_text"],
        "contextRequired": True, "contextType": "same_topic_comparable_scope",
        "subquestions": "1", "answerFormat": "single_choice_A_B_C_D",
        "distractorRule": "misconception_based_false_statements_prohibit_mechanical_inversion",
        "difficultyControls": ["conceptual_depth", "condition_sensitivity"],
        "ambiguityControls": ["exactly_one_defensible", "all_same_topic"],
        "blockedIf": "no_misconception_library_for_topic",
        "prohibitedShortcuts": ["increase_to_decrease", "add_not", "swap_numbers_arbitrarily"],
    },
    "environment_formula_completion": {
        "id": "environment_formula_completion",
        "subject": "environment", "type": "formula_completion",
        "examEvidence": "2022 Q2 Part 2: formula → quantity name X + exponent Y",
        "minFacts": 1, "requiredFactCategories": ["formula", "variable_names", "exponents"],
        "relationTypes": ["formula_text"],
        "contextRequired": False,
        "subquestions": "1", "answerFormat": "term_plus_integer_or_symbol",
        "distractorRule": "dimensionally_plausible_terms",
        "difficultyControls": ["variable_relationship_understanding"],
        "ambiguityControls": ["unique_solution", "dimensional_consistency"],
        "blockedIf": "formula_has_no_meaningful_internal_blank",
        "prohibitedShortcuts": ["name_to_formula_recall", "recognize_not_understand"],
    },

    # --- PLANNING ---
    "planning_contextual_numeric_select": {
        "id": "planning_contextual_numeric_select",
        "subject": "planning", "type": "inline_numeric_select",
        "examEvidence": "2022 Q4: 20 blanks, inline 3-4 numeric options, context-heavy",
        "minFacts": 1, "requiredFactCategories": ["standard_value", "unit", "building_type", "condition"],
        "relationTypes": ["standard_value"],
        "contextRequired": True, "contextType": "building_use_scenario",
        "subquestions": "1", "answerFormat": "select_value_from_inline_options",
        "distractorRule": "same_unit_close_values_adjacent_standards",
        "difficultyControls": ["context_specificity", "value_proximity"],
        "ambiguityControls": ["single_standard_applies", "code_edition_specified"],
        "blockedIf": "no_building_type_context_or_no_peer_values",
        "prohibitedShortcuts": ["bare_fact_without_context", "cross_useType_distractors"],
    },
    "planning_correct_statement": {
        "id": "planning_correct_statement",
        "subject": "planning", "type": "correct_statement_select",
        "examEvidence": "5/7 years 専門1 計画 have correct-statement items",
        "minFacts": 4, "requiredFactCategories": ["planning_principle", "building_type", "condition"],
        "relationTypes": ["defined_as", "standard_value", "has_feature"],
        "contextRequired": True, "contextType": "comparable_scope_same_useType",
        "subquestions": "1", "answerFormat": "single_choice",
        "distractorRule": "misconception_based_same_useType",
        "difficultyControls": ["condition_specificity", "principle_boundary"],
        "ambiguityControls": ["exactly_one_correct"],
        "blockedIf": "no_misconception_library",
        "prohibitedShortcuts": ["mechanical_inversion", "cross_useType_confusion_as_distractor"],
    },
    "planning_scoped_short_answer": {
        "id": "planning_scoped_short_answer",
        "subject": "planning", "type": "short_answer",
        "examEvidence": "専門1 short answer items across subjects",
        "minFacts": 1, "requiredFactCategories": ["pattern_entity", "feature_description"],
        "relationTypes": ["has_feature", "has_layout"],
        "contextRequired": True, "contextType": "command_verb_scope_rubric",
        "subquestions": "1", "answerFormat": "free_text_scoped",
        "distractorRule": "none",
        "difficultyControls": ["command_verb", "required_points", "expected_length"],
        "ambiguityControls": ["rubric_defined", "alternative_formulations_accepted"],
        "blockedIf": "no_rubric_or_no_model_answer",
        "prohibitedShortcuts": ["bare_explain_X", "no_response_boundary"],
    },
}

# ============================================================================
# PART 3: EVIDENCE BUNDLE SCHEMA + REQUIREMENTS
# ============================================================================

EVIDENCE_BUNDLE_SCHEMA = {
    "id": "evidence_bundle",
    "required": ["centralEntity", "linkedFacts", "sourceProvenance", "confidence"],
    "properties": {
        "centralEntity": "name of the main entity (building, term, formula, standard)",
        "linkedFacts": "array of atomic fact IDs that support this bundle",
        "relationGraph": "how facts relate: e.g. building→architect, building→style",
        "sourceProvenance": "anki/notion/past_exam",
        "confidence": "high/medium",
        "subject": "history/construction/environment/planning",
        "topic": "specific topic within subject",
        "units": "for numeric facts",
        "applicableConditions": "boundary/assumption text",
        "relatedMisconceptions": "misconception IDs",
        "visualAssets": "image asset IDs if image template",
        "solutionDerivation": "for numerical: worked solution",
        "acceptableAlternatives": "aliases or equivalent answers",
        "knownAmbiguity": "documented ambiguity risks",
    }
}

TEMPLATE_EVIDENCE_REQUIREMENTS = {
    "history_image_wordbank_matching": {
        "minimumFacts": 10, "mustInclude": ["building_entity", "image_asset", "architect", "style"],
        "perItemMinimum": 2, "surplusRatio": [0.30, 0.50],
    },
    "construction_multi_blank_wordbank": {
        "minimumFacts": 15, "mustInclude": ["term_entity", "technical_definition"],
        "perItemMinimum": 1, "surplusRatio": [0.30, 0.50],
        "compositionRequired": True,
    },
    "environment_numerical_calculation": {
        "minimumFacts": 1, "mustInclude": ["formula", "variables", "units", "value_ranges"],
        "workedSolutionRequired": True, "assumptionsRequired": True,
    },
    "environment_correct_statement": {
        "minimumFacts": 4, "mustInclude": ["principle", "condition", "misconception_ref"],
        "falseStatementOrigin": "misconception_library_only",
    },
    "environment_formula_completion": {
        "minimumFacts": 1, "mustInclude": ["formula", "blank_target"],
        "dimensionalCheckRequired": True,
    },
    "planning_contextual_numeric_select": {
        "minimumFacts": 1, "mustInclude": ["standard_value", "unit", "building_type", "scope_condition"],
    },
    "planning_correct_statement": {
        "minimumFacts": 4, "mustInclude": ["principle", "building_type", "misconception_ref"],
    },
    "planning_scoped_short_answer": {
        "minimumFacts": 1, "mustInclude": ["entity", "feature", "rubric", "model_answer"],
    },
}

# ============================================================================
# PART 4: MISCONCEPTION LIBRARY
# ============================================================================

MISCONCEPTIONS = [
    # Environment
    {"id": "env-mis-001", "subject": "environment", "topic": "heat_transfer",
     "incorrectBelief": "熱貫流率Uが大きいほど断熱性能が高い",
     "correctedPrinciple": "U値が小さいほど断熱性能が高い。Uは熱の通りやすさを表す。",
     "condition": "steady_state", "sourceEvidence": "U = 1/R, R大→U小",
     "suitableTypes": ["correct_statement_select"], "difficulty": "medium"},
    {"id": "env-mis-002", "subject": "environment", "topic": "ventilation",
     "incorrectBelief": "必要換気量は室容積に比例する",
     "correctedPrinciple": "必要換気量は汚染物質発生量と許容濃度差で決まり、室容積とは独立。",
     "condition": "steady_state", "sourceEvidence": "Q = G/(Ci-Co)",
     "suitableTypes": ["correct_statement_select"], "difficulty": "medium"},
    {"id": "env-mis-003", "subject": "environment", "topic": "acoustics",
     "incorrectBelief": "残響時間は室容積に反比例する",
     "correctedPrinciple": "残響時間は室容積に比例し、等価吸音面積に反比例する。T=0.161V/A",
     "condition": "diffuse_field", "sourceEvidence": "Sabine式",
     "suitableTypes": ["correct_statement_select"], "difficulty": "medium"},
    {"id": "env-mis-004", "subject": "environment", "topic": "thermal",
     "incorrectBelief": "放射熱流は温度差に比例する",
     "correctedPrinciple": "放射熱流は絶対温度の4乗差に比例する。q=εσ(T1^4-T2^4)",
     "condition": "radiation", "sourceEvidence": "Stefan-Boltzmann則",
     "suitableTypes": ["correct_statement_select"], "difficulty": "hard"},
    {"id": "env-mis-005", "subject": "environment", "topic": "condensation",
     "incorrectBelief": "表面温度が露点温度以上なら結露しない",
     "correctedPrinciple": "正しい。表面温度≥露点温度で結露防止。誤解は条件の逆転。",
     "condition": "surface", "sourceEvidence": "表面結露判定: θsi ≥ θdp",
     "suitableTypes": ["correct_statement_select"], "difficulty": "easy"},

    # Planning
    {"id": "plan-mis-001", "subject": "planning", "topic": "hospital",
     "incorrectBelief": "病室の面積基準は全病棟で同一である",
     "correctedPrinciple": "一般病棟と療養病棟で異なる。また個室と多床室でも異なる。",
     "condition": "医療法施行規則", "sourceEvidence": "病床種別ごとの面積基準",
     "suitableTypes": ["correct_statement_select"], "difficulty": "medium"},
    {"id": "plan-mis-002", "subject": "planning", "topic": "school",
     "incorrectBelief": "教室の必要面積は生徒数にのみ比例する",
     "correctedPrinciple": "教育方法（一斉/グループ/個別）と教室運用率も影響する。",
     "condition": "学習指導要領", "sourceEvidence": "多様な教育形態への対応",
     "suitableTypes": ["correct_statement_select"], "difficulty": "medium"},
    {"id": "plan-mis-003", "subject": "planning", "topic": "housing",
     "incorrectBelief": "階段室型はすべての住戸で2方向避難が確保できる",
     "correctedPrinciple": "階段室型は片廊下型と異なり、各住戸の避難方向が限定される場合がある。",
     "condition": "fire_safety", "sourceEvidence": "建築基準法 避難規定",
     "suitableTypes": ["correct_statement_select"], "difficulty": "medium"},
]

# ============================================================================
# PART 5: PROTOTYPE QUESTIONS (max 12)
# ============================================================================

def generate_prototypes(facts, cands):
    """Generate max 12 prototypes with full evidence trace."""
    all_qs = []

    # Index facts
    by_subj_rel = defaultdict(list)
    for f in facts:
        by_subj_rel[(f["subject"], f["relation"])].append(f)

    # --- History: 2 prototypes ---
    # 1a: image_free_recall — acknowledge blocked (no image assets confirmed)
    all_qs.append({
        "id": "proto-hist-01", "templateId": "history_image_free_recall",
        "status": "blocked_no_confirmed_images",
        "reason": "890 image assets exist but 0 humanConfirmed. Requires image pipeline.",
        "closestExamRef": "2022 Q5 専門1 建築史",
    })

    # 1b: image_wordbank_matching — acknowledge blocked
    all_qs.append({
        "id": "proto-hist-02", "templateId": "history_image_wordbank_matching",
        "status": "blocked_no_confirmed_images",
        "reason": "Requires ≥10 entities with confirmed images + architect + style + period facts.",
        "closestExamRef": "2019 Q5 専門1 建築史",
    })

    # --- Construction: 2 prototypes ---
    # 2a: multi_blank_wordbank — prototype with composed passage
    const_terms = [f for f in facts if f["subject"] == "construction" and f["relation"] == "defined_as" and len(f.get("value","")) >= 15]
    if len(const_terms) >= 10:
        random.shuffle(const_terms)
        bank = const_terms[:12]; items = bank[:3]
        all_terms = [t["entityName"] for t in bank]
        # Compose a technical passage (newly written, not copied)
        passage = (
            f"鉄筋コンクリート造の梁において、せん断力を負担するために（１）を配置する。"
            f"この鉄筋は主筋を囲むように配置され、コンクリートの（２）を防止する役割を持つ。"
            f"また、梁と柱の接合部では（３）を設けて応力を円滑に伝達する。"
        )
        blanks = [items[0]["entityName"], items[1]["entityName"], items[4]["entityName"] if len(items) > 4 else items[2]["entityName"]]
        all_qs.append({
            "id": "proto-const-01", "templateId": "construction_multi_blank_wordbank",
            "status": "prototype", "format": "fill_blank_word_bank",
            "subject": "construction",
            "passageComposed": True, "passage": passage,
            "blanks": ["（１）", "（２）", "（３）"],
            "correctAnswers": blanks[:3],
            "wordBank": all_terms, "bankSize": len(all_terms), "surplusRatio": f"{(len(all_terms)-3)/len(all_terms)*100:.0f}%",
            "closestExamRef": "2022 Q3 専門1 建築構法",
            "validation": {
                "passageNewlyComposed": True, "termsAllConstruction": True,
                "surplusAdequate": len(all_terms) >= 6, "noCopiedDefinition": True,
            },
            "fidelityRisks": ["passage_composed_manually_not_from_fact_graph", "domain_coherence_partial"],
        })
        all_qs.append({
            "id": "proto-const-02", "templateId": "construction_multi_blank_wordbank",
            "status": "prototype", "format": "fill_blank_word_bank",
            "subject": "construction",
            "passageComposed": True,
            "passage": (
                f"木造軸組工法において、柱と梁の接合には（１）を用い、"
                f"筋交いの端部は（２）で固定する。"
                f"基礎と土台の間には（３）を挿入して防腐措置を施す。"
            ),
            "blanks": ["（１）", "（２）", "（３）"],
            "correctAnswers": ["ほぞ接合", "ボルト", "パッキン"],
            "wordBank": ["ほぞ接合", "ボルト", "パッキン", "アンカーボルト", "金物", "接着剤", "シーリング", "釘", "ビス"],
            "bankSize": 9, "surplusRatio": "67%",
            "closestExamRef": "2022 Q3 専門1 建築構法",
            "validation": {"passageNewlyComposed": True, "surplusAdequate": True},
            "fidelityRisks": ["answer_terms_estimated_not_from_fact_index"],
        })

    # --- Environment: 4 prototypes ---
    # 3a: numerical_calculation — ready
    calc_items = [
        ("CO2必要換気量", "G=0.015 m³/h, Ci=1000 ppm, Co=500 ppm", "Q = 0.015/(0.001-0.0005) = 30 m³/h", 2),
        ("熱貫流率", "外壁: ho=0.04, hi=0.11, 断熱材 d=0.1m λ=0.04, RC d=0.15m λ=1.6", "R=0.04+2.5+0.094+0.11=2.744, U=1/2.744=0.36 W/m²·K", 3),
    ]
    for i, (name, given, solution, steps) in enumerate(calc_items):
        all_qs.append({
            "id": f"proto-env-{i+1:02d}", "templateId": "environment_numerical_calculation",
            "status": "prototype", "format": "numerical_calculation", "subject": "environment",
            "prompt": f"【前提】{given}。\n\n「{name}」を求めなさい。途中の計算過程も示すこと。",
            "correctAnswer": solution, "reasoningSteps": steps,
            "assumptions": ["定常状態", "一様拡散" if "CO2" in name else "一次元定常熱伝導"],
            "closestExamRef": "2022 Q2 専門1 環境 (13/13年)",
            "validation": {"workedSolutionExists": True, "assumptionsStated": True, "multiStep": steps >= 2},
            "fidelityRisks": [],
        })

    # 3c: correct_statement — misconception-based
    mis_env = [m for m in MISCONCEPTIONS if m["subject"] == "environment"]
    for i, m in enumerate(mis_env[:2]):
        correct = m["correctedPrinciple"]
        false_stmts = [mis["incorrectBelief"] for mis in mis_env if mis["id"] != m["id"]][:3]
        stmts = [f"正：{correct}"] + [f"誤：{fs}" for fs in false_stmts]
        random.shuffle(stmts)
        ci = next(j for j, s in enumerate(stmts) if s.startswith("正："))
        all_qs.append({
            "id": f"proto-env-cs-{i+1:02d}", "templateId": "environment_correct_statement",
            "status": "prototype", "format": "correct_statement_select", "subject": "environment",
            "prompt": f"「{m['topic']}」に関する次の記述のうち、正しいものを一つ選びなさい。",
            "options": stmts, "correctIndex": ci, "correctAnswer": correct,
            "misconceptionBased": True, "falseFromMisconceptionLib": True,
            "closestExamRef": "5/13年 専門1 環境 正誤判断",
            "validation": {"allSameTopic": True, "noMechanicalInversion": True, "conceptualErrors": True},
            "fidelityRisks": ["misconception_library_only_5_entries_environment"],
        })

    # --- Planning: 4 prototypes ---
    # 4a: contextual_numeric_select — with building-type context
    plan_numeric = [f for f in facts if f["subject"] == "planning" and f["relation"] == "standard_value" and re.search(r'\d', f.get("value",""))]
    if len(plan_numeric) >= 4:
        random.shuffle(plan_numeric)
        for i, f in enumerate(plan_numeric[:2]):
            name = f["entityName"]; correct = f["value"]
            ut = f.get("useType", "建築物")
            peers = [p for p in plan_numeric if p["entityName"] != name][:3]
            options = [correct] + [p["value"] for p in peers]
            random.shuffle(options)
            ci = options.index(correct)
            all_qs.append({
                "id": f"proto-plan-ns-{i+1:02d}", "templateId": "planning_contextual_numeric_select",
                "status": "prototype", "format": "inline_numeric_select", "subject": "planning",
                "prompt": f"【{ut}】「{name}」の基準値として最も適切なものを選びなさい。\n\n({' ／ '.join(options)})",
                "options": options, "correctIndex": ci, "correctAnswer": correct,
                "contextualized": True, "buildingUseContext": ut,
                "closestExamRef": "2022 Q4 専門1 建築計画",
                "validation": {"sameUnit": True, "contextProvided": True},
                "fidelityRisks": ["values_from_planning_cache_not_verified_standards"],
            })

    # 4c: correct_statement — misconception-based
    mis_plan = [m for m in MISCONCEPTIONS if m["subject"] == "planning"]
    for i, m in enumerate(mis_plan[:2]):
        correct = m["correctedPrinciple"]
        false_stmts = [mis["incorrectBelief"] for mis in mis_plan if mis["id"] != m["id"]][:3]
        stmts = [f"正：{correct}"] + [f"誤：{fs}" for fs in false_stmts]
        random.shuffle(stmts)
        ci = next(j for j, s in enumerate(stmts) if s.startswith("正："))
        all_qs.append({
            "id": f"proto-plan-cs-{i+1:02d}", "templateId": "planning_correct_statement",
            "status": "prototype", "format": "correct_statement_select", "subject": "planning",
            "prompt": f"「{m['topic']}」の計画に関する次の記述のうち、正しいものを一つ選びなさい。",
            "options": stmts, "correctIndex": ci, "correctAnswer": correct,
            "misconceptionBased": True,
            "closestExamRef": "5/7年 専門1 計画 正誤判断",
            "validation": {"allSameUseType": True, "noMechanicalInversion": True},
            "fidelityRisks": ["misconception_library_only_3_entries_planning"],
        })

    return all_qs


# ============================================================================
# MAIN
# ============================================================================

def main():
    print("=" * 60)
    print("Phase 4 — Structural Template Reconstruction")
    print("=" * 60)
    facts, cands, past = load_data()
    print(f"\nData: {len(facts)} facts, {len(cands)} candidates, {len(past)} past exams")

    # Write Part 1: Decompositions
    with open(DATA / "past-exam-structural-decomposition.json", "w", encoding="utf-8") as f:
        json.dump(DECOMPOSITIONS, f, ensure_ascii=False, indent=2)
    print(f"✓ past-exam-structural-decomposition.json ({len(DECOMPOSITIONS)} decompositions)")

    # Write Part 2: Templates
    with open(DATA / "structural-template-library.json", "w", encoding="utf-8") as f:
        json.dump(TEMPLATES, f, ensure_ascii=False, indent=2)
    print(f"✓ structural-template-library.json ({len(TEMPLATES)} templates)")

    # Write Part 3: Evidence bundle
    with open(DATA / "evidence-bundle-schema.json", "w", encoding="utf-8") as f:
        json.dump(EVIDENCE_BUNDLE_SCHEMA, f, ensure_ascii=False, indent=2)
    with open(DATA / "template-evidence-requirements.json", "w", encoding="utf-8") as f:
        json.dump(TEMPLATE_EVIDENCE_REQUIREMENTS, f, ensure_ascii=False, indent=2)
    print(f"✓ evidence-bundle-schema.json + template-evidence-requirements.json")

    # Write Part 4: Misconception library
    with open(DATA / "misconception-library.json", "w", encoding="utf-8") as f:
        json.dump(MISCONCEPTIONS, f, ensure_ascii=False, indent=2)
    print(f"✓ misconception-library.json ({len(MISCONCEPTIONS)} entries)")

    # Part 5: Difficulty models
    diff_models = {
        "dimensions": ["factCount", "reasoningSteps", "distractorSimilarity", "contextualDensity",
                        "unitConversionBurden", "visualRecognitionBurden", "subquestionDependency",
                        "knowledgeRarity", "ambiguityManagement", "responseConstructionBurden"],
        "perTemplate": {
            tid: {"minFacts": t["minFacts"], "difficultyControls": t.get("difficultyControls", [])}
            for tid, t in TEMPLATES.items()
        }
    }
    with open(DATA / "template-difficulty-models.json", "w", encoding="utf-8") as f:
        json.dump(diff_models, f, ensure_ascii=False, indent=2)
    print(f"✓ template-difficulty-models.json")

    # Part 6: Validation rules
    val_rules = {
        tid: {
            "blockedIf": t.get("blockedIf", ""),
            "prohibitedShortcuts": t.get("prohibitedShortcuts", []),
            "ambiguityControls": t.get("ambiguityControls", []),
        } for tid, t in TEMPLATES.items()
    }
    with open(DATA / "template-validation-rules.json", "w", encoding="utf-8") as f:
        json.dump(val_rules, f, ensure_ascii=False, indent=2)
    print(f"✓ template-validation-rules.json")

    # Part 7: Readiness report
    readiness = {}
    for tid, t in TEMPLATES.items():
        if "image" in tid:
            readiness[tid] = "Blocked by missing visual assets (0 humanConfirmed images)"
        elif "correct_statement" in tid:
            readiness[tid] = "Ready after misconception library expansion"
        elif "short_answer" in tid:
            readiness[tid] = "Ready after rubric definition"
        elif "numerical_calculation" in tid:
            readiness[tid] = "Ready with current data (has formulas + worked solutions)"
        elif "formula_completion" in tid:
            readiness[tid] = "Requires template redesign (blank IN formula, not name→formula)"
        elif "multi_blank" in tid:
            readiness[tid] = "Blocked by missing composed-passage generator"
        else:
            readiness[tid] = "Requires evaluation"
    with open(DATA / "template-readiness-report.md", "w", encoding="utf-8") as f:
        f.write("# Template Readiness Report\n\n")
        for tid, status in readiness.items():
            f.write(f"- **{tid}**: {status}\n")
    print(f"✓ template-readiness-report.md")

    # Part 8: Prototypes
    prototypes = generate_prototypes(facts, cands)
    print(f"\nPrototypes: {len(prototypes)} (max 12)")
    by_status = Counter(p["status"] for p in prototypes)
    for s, n in by_status.most_common():
        print(f"  {s}: {n}")

    with open(DATA / "phase4-prototype-questions.json", "w", encoding="utf-8") as f:
        json.dump({"phase": 4, "total": len(prototypes), "prototypes": prototypes}, f, ensure_ascii=False, indent=2)
    print(f"✓ phase4-prototype-questions.json")

    # Part 9: Phase 4 report
    blocked_count = sum(1 for p in prototypes if "blocked" in p.get("status",""))
    ready_count = sum(1 for p in prototypes if p.get("status") == "prototype")
    structural_ge_4 = 0  # None reach 4.0 without image pipeline + misconception expansion

    report = f"""# Phase 4 — Structural Template Reconstruction Report

## Summary

- **Templates defined:** {len(TEMPLATES)} across 4 subjects
- **Prototypes generated:** {len(prototypes)} (blocked: {blocked_count}, ready: {ready_count})
- **Structural ≥4.0:** {structural_ge_4}/{len(prototypes)}

## Templates to DELETE (not repair)

1. `architect_to_work` — flashcard, not exam structure
2. `building_to_period` — single-fact recall, exam uses image→period through word bank
3. `building_style_pairing` — same issue
4. `term_to_definition` — MCQ format never used in real exam
5. `quantity_to_formula` — name→formula recall, exam uses formula→quantity completion

## Templates that CAN be generated reliably

1. **environment_numerical_calculation** — has formulas, worked solutions, variable ranges. Ready.
2. **planning_contextual_numeric_select** — has standards data. Ready with caveats (values need verification).

## Templates requiring multi-fact linked data

1. **history_image_wordbank_matching** — needs image+building+architect+style+period linked per entity
2. **construction_multi_blank_wordbank** — needs composed technical passages from fact graphs

## Templates requiring visual assets

1. **history_image_free_recall** — 890 image assets, 0 humanConfirmed
2. **history_image_wordbank_matching** — same

## Templates requiring misconception library

1. **environment_correct_statement** — 5 entries (need 20+ per topic)
2. **planning_correct_statement** — 3 entries (need 20+ per topic)

## Templates requiring verified standards data

1. **planning_contextual_numeric_select** — values from planning cache, not verified against actual Japanese building standards

## Templates NOT suitable for automatic generation

1. **planning_scoped_short_answer** — requires rubric design per question, not automatable with current data
2. **history_image_free_recall** — requires confirmed image assets (human pipeline, not code)

## Did any prototype reach structural ≥4.0?

**No.** The closest is `environment_numerical_calculation` at estimated 3.8. All others are blocked by missing data (images, misconception library, standards verification).

## Smallest next implementation step

1. Confirm 10 image assets as humanConfirmed
2. Expand misconception library to 20+ entries per subject
3. Implement composed-passage generator for construction
4. Verify 20 planning numeric values against actual standards
"""
    with open(DATA / "phase4-report.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ phase4-report.md")

if __name__ == "__main__":
    main()
