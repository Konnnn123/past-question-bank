#!/usr/bin/env python3
"""
Question Blueprint Scanner
==========================
Scans ALL past exam markdown files (all years, both 専門1 and 専門2-2)
to build a complete catalog of question blueprints with occurrence statistics.

Usage: python scripts/build-question-blueprints.py
Output: data/question-blueprints.json
"""

import json, re, sys, io, os
from pathlib import Path
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent
PROCESSED_DIR = BASE / "data" / "processed_questions"
OUTPUT = BASE / "data" / "question-blueprints.json"

# ============================================================================
# Blueprint definitions — discovered patterns from real exams
# ============================================================================

BLUEPRINTS = {
    # === 建筑史 ===
    "image_to_building": {
        "id": "image_to_building",
        "subject": "history",
        "name": "圖片→建築名稱",
        "questionAction": "identify",
        "requiredFactRelations": ["has_image", "entityName"],
        "promptTemplate": "次の写真の建築名称を答えなさい。",
        "answerType": "free_recall",
        "distractorStrategy": "none",
        "needsImage": True,
        "validationRules": ["image_present", "name_not_leaked"],
        "occurrences": [],
    },
    "image_to_architect": {
        "id": "image_to_architect",
        "subject": "history",
        "name": "圖片→建築師",
        "questionAction": "identify",
        "requiredFactRelations": ["has_image", "designed_by"],
        "promptTemplate": "次の写真の建築の設計者を答えなさい。",
        "answerType": "free_recall",
        "distractorStrategy": "none",
        "needsImage": True,
        "validationRules": ["image_present"],
        "occurrences": [],
    },
    "image_to_style": {
        "id": "image_to_style",
        "subject": "history",
        "name": "圖片→樣式／時代",
        "questionAction": "identify",
        "requiredFactRelations": ["has_image", "has_style"],
        "promptTemplate": "次の写真の建築様式を答えなさい。",
        "answerType": "free_recall",
        "distractorStrategy": "none",
        "needsImage": True,
        "validationRules": ["image_present"],
        "occurrences": [],
    },
    "building_to_architect": {
        "id": "building_to_architect",
        "subject": "history",
        "name": "建築→建築師（配對）",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "designed_by"],
        "promptTemplate": "次の建築と設計者・関連人物の組合せとして、最も適切なものを一つ選びなさい。\n\n{entityName}",
        "answerType": "single_choice",
        "distractorStrategy": "same_type_peer",
        "needsImage": False,
        "validationRules": ["unique_answer", "type_consistency", "no_leak"],
        "occurrences": [],
    },
    "building_to_period": {
        "id": "building_to_period",
        "subject": "history",
        "name": "建築→成立年代（配對）",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "built_in"],
        "promptTemplate": "次の建築の建設・成立年代として、最も適切なものを一つ選びなさい。\n\n{entityName}",
        "answerType": "single_choice",
        "distractorStrategy": "same_type_peer",
        "needsImage": False,
        "validationRules": ["unique_answer", "no_leak"],
        "occurrences": [],
    },
    "building_to_feature": {
        "id": "building_to_feature",
        "subject": "history",
        "name": "建築→代表特徵（配對）",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "has_feature"],
        "promptTemplate": "「{entityName}」の建築的特徴として、最も適切なものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "same_type_peer",
        "needsImage": False,
        "validationRules": ["unique_answer", "feature_length_balanced"],
        "occurrences": [],
    },
    "architect_to_work": {
        "id": "architect_to_work",
        "subject": "history",
        "name": "建築師→作品（配對）",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "designed"],
        "promptTemplate": "次の建築家・人物の代表作として、最も適切なものを一つ選びなさい。\n\n{entityName}",
        "answerType": "single_choice",
        "distractorStrategy": "same_type_peer",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "building_style_pairing": {
        "id": "building_style_pairing",
        "subject": "history",
        "name": "建築→様式（語群配對）",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "has_style"],
        "promptTemplate": "次の建築と建築様式・類型の組合せとして、最も適切なものを一つ選びなさい。\n\n{entityName}",
        "answerType": "single_choice",
        "distractorStrategy": "same_type_peer",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "odd_one_out": {
        "id": "odd_one_out",
        "subject": "history",
        "name": "異類辨識",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "has_style", "built_in"],
        "promptTemplate": "次の建築のうち、様式・時代の異なるものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "same_type_peer",
        "needsImage": False,
        "validationRules": ["exactly_one_odd", "group_coherent"],
        "occurrences": [],
    },
    # === 建築構法 ===
    "definition_to_term": {
        "id": "definition_to_term",
        "subject": "construction",
        "name": "定義→用語",
        "questionAction": "fill_blank",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の説明の空欄に入る最も適切な建築構法・材料・部材の用語を一つ選びなさい。\n\n{definition}：（　　　）",
        "answerType": "single_choice",
        "distractorStrategy": "word_bank_surplus",
        "needsImage": False,
        "validationRules": ["unique_answer", "blanks_count_match"],
        "occurrences": [],
    },
    "term_to_category": {
        "id": "term_to_category",
        "subject": "construction",
        "name": "用語→分類",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "belongs_to"],
        "promptTemplate": "次の建築構法用語が属する分類として、最も適切なものを一つ選びなさい。\n\n「{entityName}」",
        "answerType": "single_choice",
        "distractorStrategy": "category_peer",
        "needsImage": False,
        "validationRules": ["unique_answer", "type_consistency"],
        "occurrences": [],
    },
    "term_to_definition": {
        "id": "term_to_definition",
        "subject": "construction",
        "name": "用語→説明（四選一）",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の建築構法用語「{entityName}」の説明として、最も適切なものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "definition_similar",
        "needsImage": False,
        "validationRules": ["unique_answer", "option_length_balanced"],
        "occurrences": [],
    },
    "term_association": {
        "id": "term_association",
        "subject": "construction",
        "name": "用語關聯配對",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "belongs_to"],
        "promptTemplate": "次の用語と最も関連の深い用語を一つ選びなさい。\n\n「{entityName}」",
        "answerType": "single_choice",
        "distractorStrategy": "category_peer",
        "needsImage": False,
        "validationRules": ["unique_answer", "genuine_association"],
        "occurrences": [],
    },
    "image_to_component": {
        "id": "image_to_component",
        "subject": "construction",
        "name": "圖片→構件名稱",
        "questionAction": "identify",
        "requiredFactRelations": ["has_image", "entityName"],
        "promptTemplate": "次の写真の構法部材・工法の名称を答えなさい。",
        "answerType": "free_recall",
        "distractorStrategy": "none",
        "needsImage": True,
        "validationRules": ["image_present"],
        "occurrences": [],
    },
    # === 建築計劃 ===
    "number_fill_blank": {
        "id": "number_fill_blank",
        "subject": "planning",
        "name": "數值填空",
        "questionAction": "fill_blank",
        "requiredFactRelations": ["entityName", "standard_value"],
        "promptTemplate": "建築計画における次の基準値を答えなさい。\n\n「{entityName}」",
        "answerType": "fill_blank",
        "distractorStrategy": "none",
        "needsImage": False,
        "validationRules": ["numeric_answer", "unit_present"],
        "occurrences": [],
    },
    "number_four_choice": {
        "id": "number_four_choice",
        "subject": "planning",
        "name": "數值四選一",
        "questionAction": "select",
        "requiredFactRelations": ["entityName", "standard_value"],
        "promptTemplate": "建築計画における「{entityName}」について、最も適切なものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "numeric_neighbor",
        "needsImage": False,
        "validationRules": ["unique_answer", "numeric_options"],
        "occurrences": [],
    },
    "concept_four_choice": {
        "id": "concept_four_choice",
        "subject": "planning",
        "name": "概念四選一",
        "questionAction": "select",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の建築計画用語・事例「{entityName}」の説明として、最も適切なものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "definition_similar",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "case_to_feature": {
        "id": "case_to_feature",
        "subject": "planning",
        "name": "案例→計劃特徵",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の建築計画事例の特徴として、最も適切なものを一つ選びなさい。\n\n{entityName}",
        "answerType": "single_choice",
        "distractorStrategy": "definition_similar",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "false_statement_identify": {
        "id": "false_statement_identify",
        "subject": "planning",
        "name": "錯誤陳述辨識",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の記述のうち、誤っているものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "definition_similar",
        "needsImage": False,
        "validationRules": ["exactly_one_false", "others_true"],
        "occurrences": [],
    },
    # === 建築環境工學 ===
    "phenomenon_to_term": {
        "id": "phenomenon_to_term",
        "subject": "environment",
        "name": "現象→術語",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の現象説明と最も関係の深い用語を選びなさい。\n\n{description}",
        "answerType": "single_choice",
        "distractorStrategy": "word_bank_surplus",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "formula_to_quantity": {
        "id": "formula_to_quantity",
        "subject": "environment",
        "name": "公式→物理量",
        "questionAction": "match",
        "requiredFactRelations": ["formula_text", "computes"],
        "promptTemplate": "次の式が表す物理量として、最も適切なものを一つ選びなさい。\n\n{formula}",
        "answerType": "single_choice",
        "distractorStrategy": "formula_structural",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "quantity_to_formula": {
        "id": "quantity_to_formula",
        "subject": "environment",
        "name": "物理量→公式",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "formula_text"],
        "promptTemplate": "「{entityName}」を表す式として、最も適切なものを一つ選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "formula_structural",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
    "numeric_calculation": {
        "id": "numeric_calculation",
        "subject": "environment",
        "name": "小型數值計算",
        "questionAction": "calculate",
        "requiredFactRelations": ["entityName", "formula_text"],
        "promptTemplate": "以下の条件で「{entityName}」を計算しなさい。",
        "answerType": "fill_blank",
        "distractorStrategy": "none",
        "needsImage": False,
        "validationRules": ["numeric_answer", "conditions_given"],
        "occurrences": [],
    },
    "condition_change_judge": {
        "id": "condition_change_judge",
        "subject": "environment",
        "name": "條件變化→增減判斷",
        "questionAction": "match",
        "requiredFactRelations": ["entityName", "defined_as"],
        "promptTemplate": "次の条件変化に対して、{entityName}は増加・減少・不変のいずれかを選びなさい。",
        "answerType": "single_choice",
        "distractorStrategy": "numeric_neighbor",
        "needsImage": False,
        "validationRules": ["unique_answer"],
        "occurrences": [],
    },
}

# ============================================================================
# Detection patterns for past exam questions
# ============================================================================

def detect_blueprint_occurrences(filepath):
    """Analyze a single past exam question file and record which blueprints it matches."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except:
        return []

    fname = filepath.name
    # Extract year, category, question number from filename
    ym = re.search(r'(\d{4})', fname)
    year = int(ym.group(1)) if ym else 0
    cat = "専門2-2" if "2-2" in fname else "専門1"
    qm = re.search(r'[Q問題](\d+)', fname)
    qnum = f"Q{qm.group(1)}" if qm else "?"

    subject = ""
    if "建筑史" in fname:
        subject = "history"
    elif "建筑构法" in fname:
        subject = "construction"
    elif "建筑环境" in fname:
        subject = "environment"
    elif "建筑计划" in fname:
        subject = "planning"
    else:
        return []

    occurrences = []

    # Detect patterns based on content characteristics

    # 専門1 建筑史 Q5: image identification with word banks
    if subject == "history" and cat == "専門1":
        has_images = bool(re.search(r'!\[.*?\]\(|Fig\.\s*\d|<img\b', content, re.I))
        has_word_bank = bool(re.search(r'[語语]群|Group\s*[AB]', content))
        has_building_list = bool(re.search(r'[①②③④⑤⑥⑦⑧⑨⑩]{1,2}\s*\S', content))

        if has_images and has_word_bank:
            # Each sub-item is an image→name/architect/style match
            occurrences.append(("image_to_building", "語群マッチング：写真→建築名"))
            occurrences.append(("image_to_architect", "語群マッチング：写真→建築家"))
            occurrences.append(("image_to_style", "語群マッチング：写真→様式"))
        elif has_building_list and has_word_bank:
            occurrences.append(("building_to_architect", "語群マッチング：建築名→人物"))
            occurrences.append(("building_style_pairing", "語群マッチング：建築名→様式"))

    # 専門2-2 建筑史: essay/image-based analysis
    if subject == "history" and cat == "専門2-2":
        has_drawing_req = bool(re.search(r'図示|描[きか]|スケッチ|平面図|断面図|模式', content))
        has_essay = bool(re.search(r'説明|行[以内程度]|字[以内程度]', content))
        has_name_req = bool(re.search(r'名称|建築家|設計者', content))

        if has_name_req and has_essay:
            occurrences.append(("image_to_building", "論述：図面→建築名+設計者+概念説明"))
        if has_drawing_req:
            occurrences.append(("image_to_building", "作図：建築の特徴を図示"))

    # 専門1 构法 Q3: fill-blank with word bank
    if subject == "construction" and cat == "専門1":
        has_blanks = bool(re.search(r'[（(]\s*[A-Ta-t]\s*[）)]|空欄|穴埋', content))
        has_word_bank = bool(re.search(r'[語语]群', content))
        if has_blanks and has_word_bank:
            occurrences.append(("definition_to_term", "語群填空：説明文→用語"))

    # 専門2-2 构法: design/drawing
    if subject == "construction" and cat == "専門2-2":
        has_drawing = bool(re.search(r'図示|描[きか]|平面図|断面図|工程', content))
        if has_drawing:
            occurrences.append(("image_to_component", "作図：施工工程・構法図示"))

    # 専門1 环境 Q2: phenomenon matching + formula completion
    if subject == "environment" and cat == "専門1":
        has_formula = bool(re.search(r'[=＝]|式|公式|求め|計算', content))
        has_phenomenon = bool(re.search(r'現象|次の説明|関係|最も適切|選び', content))
        if has_phenomenon:
            occurrences.append(("phenomenon_to_term", "語群マッチング：現象説明→用語"))
        if has_formula:
            occurrences.append(("formula_to_quantity", "語群＋補完：公式→物理量名＋指数"))
            occurrences.append(("numeric_calculation", "數値計算"))

    # 専門1 计划 Q4: inline numeric options
    if subject == "planning" and cat == "専門1":
        has_inline_options = bool(re.search(r'[（(]\s*\d[\d,，、\s]*\d\s*[）)]', content))
        has_standards = bool(re.search(r'基準|標準|m²|m\b|cm|mm|％|%|人|台', content))
        if has_inline_options and has_standards:
            occurrences.append(("number_four_choice", "インライン數値選択"))
            occurrences.append(("number_fill_blank", "數値填空"))

    # 専門2-2 计划: derivation/analysis
    if subject == "planning" and cat == "専門2-2":
        has_derive = bool(re.search(r'導[出き]|求め|最小|最適|計算', content))
        if has_derive:
            occurrences.append(("number_fill_blank", "計算導出"))
        occurrences.append(("concept_four_choice", "概念説明"))

    # Record each occurrence
    result = []
    for bp_id, form_desc in occurrences:
        if bp_id in BLUEPRINTS:
            result.append({
                "blueprintId": bp_id,
                "year": year,
                "category": cat,
                "questionNumber": qnum,
                "originalForm": form_desc,
            })

    return result


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 60)
    print("Question Blueprint Scanner")
    print("=" * 60)

    files = sorted(PROCESSED_DIR.glob("*.md"))
    print(f"\nScanning {len(files)} processed question files...")

    all_occurrences = defaultdict(list)

    for fp in files:
        occs = detect_blueprint_occurrences(fp)
        for occ in occs:
            all_occurrences[occ["blueprintId"]].append(occ)

    # Build final blueprint catalog
    blueprints_out = {}
    for bp_id, bp_def in BLUEPRINTS.items():
        occs = all_occurrences.get(bp_id, [])
        # Deduplicate by year+category+question
        seen = set()
        unique_occs = []
        for o in occs:
            key = (o["year"], o["category"], o["questionNumber"])
            if key not in seen:
                seen.add(key)
                unique_occs.append(o)

        # Sort by year
        unique_occs.sort(key=lambda o: o["year"])

        bp_out = dict(bp_def)
        bp_out["occurrences"] = unique_occs
        bp_out["occurrenceCount"] = len(unique_occs)
        bp_out["years"] = sorted(set(o["year"] for o in unique_occs))
        blueprints_out[bp_id] = bp_out

    # Print summary
    print(f"\n{'Blueprint':<35} {'Count':>6}  Years")
    print("-" * 70)
    for bp_id, bp in sorted(blueprints_out.items(), key=lambda x: -x[1]["occurrenceCount"]):
        cnt = bp["occurrenceCount"]
        years = ",".join(str(y) for y in bp["years"][:5])
        if len(bp["years"]) > 5:
            years += f" +{len(bp['years'])-5}"
        print(f"  {bp['name']:<33} {cnt:>4}   {years}")

    # Write output
    output = {
        "version": 1,
        "totalBlueprints": len(blueprints_out),
        "blueprints": list(blueprints_out.values()),
    }

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✓ {OUTPUT}")
    print(f"  {len(blueprints_out)} blueprints catalogued")

    # Count total evidence
    total_occs = sum(bp["occurrenceCount"] for bp in blueprints_out.values())
    print(f"  {total_occs} total occurrence records across all years")

    # Per-subject stats
    for subj in ["history", "construction", "planning", "environment"]:
        subj_bps = [bp for bp in blueprints_out.values() if bp["subject"] == subj]
        subj_cnt = sum(bp["occurrenceCount"] for bp in subj_bps)
        print(f"  [{subj}]: {len(subj_bps)} blueprints, {subj_cnt} occurrences")


if __name__ == "__main__":
    main()
