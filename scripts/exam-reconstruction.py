#!/usr/bin/env python3
"""
Exam Reconstruction Engine
===========================
Blueprint → Check past exam style → Choose question type → Generate

Stops forcing MCQ on blueprints where the real exam uses:
  word_bank_matching / fill_blank / formula_recall / calculation / image_matching

Usage: python scripts/exam-reconstruction.py
"""

import json, re, sys, io, random
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)

BASE = Path(__file__).parent.parent
DATA = BASE / "data"
FACTS_PATH = DATA / "atomic-facts.json"
CANDIDATES_PATH = DATA / "candidate-facts.json"
BLUEPRINTS_PATH = DATA / "question-blueprints.json"

# ============================================================================
# EXAM STYLE — derived from 2022 + all other years
# ============================================================================

EXAM_STYLE = {
    # === HISTORY ===
    # 専門1: image_identification(7) + word_bank(7) + building_pairing(5)
    # 専門2-2: essay(21) + term_explanation(21) + diagram(9)
    "architect_to_work":     {"style": "word_bank_matching", "reason": "専門1 7/7年 語群マッチング"},
    "building_to_period":    {"style": "word_bank_matching", "reason": "専門1 語群→時代マッチ"},
    "building_style_pairing":{"style": "word_bank_matching", "reason": "専門1 語群→様式マッチ"},
    "image_to_building":     {"style": "image_identification","reason": "専門1 7/7年 写真→建築名"},
    "image_to_architect":    {"style": "image_identification","reason": "専門1 写真→建築家"},
    "image_to_style":        {"style": "image_identification","reason": "専門1 写真→様式"},

    # === CONSTRUCTION ===
    # 専門1: numerical_calculation(7) + essay(5) + fill_blank(3)
    # 専門2-2: essay(12) + diagram(5) + design_process(5)
    "definition_to_term":    {"style": "fill_blank_word_bank", "reason": "専門1 3/7年 語群填空"},
    "term_to_definition":    {"style": "fill_blank_word_bank", "reason": "専門1 語群填空"},
    "component_to_function": {"style": "fill_blank_word_bank", "reason": "部材→機能 語群填空"},
    "image_to_component":    {"style": "image_identification","reason": "専門1 2年 画像→部材"},
    "defect_to_cause":       {"style": "fill_blank_word_bank", "reason": "欠陥→原因 語群填空"},

    # === ENVIRONMENT ===
    # 専門1: numerical_calculation(13/13年!) + correct_statement(5) + formula_completion(3) + calculation_select(3)
    # NOTE: Environment NEVER uses word banks in the real exam!
    "quantity_to_calculation_formula": {"style": "formula_completion", "reason": "専門1 3/13年 公式補完"},
    "phenomenon_to_term":              {"style": "correct_statement_select", "reason": "専門1 5/13年 正しい記述を選べ"},
    "numeric_calculation":             {"style": "numerical_calculation", "reason": "専門1 13/13年 数値計算"},
    "formula_to_quantity":             {"style": "formula_completion", "reason": "専門1 公式→物理量名"},
    "phenomenon_to_criterion":         {"style": "correct_statement_select", "reason": "専門1 判定条件→正誤"},

    # === PLANNING ===
    # 専門1: inline_numeric(7) + numerical(6) + correct_statement(5)
    # 専門2-2: essay(19) + term_explanation(18) + design_process(14)
    "number_four_choice":    {"style": "inline_numeric_select", "reason": "専門1 7/7年 数値選択"},
    "number_fill_blank":     {"style": "fill_blank",            "reason": "専門1 数値填空"},
    "concept_four_choice":   {"style": "correct_statement_select","reason": "専門1 5/7年 正しい記述を選べ"},
    "description_to_pattern":{"style": "correct_statement_select","reason": "専門1 正誤選択"},
    "pattern_comparison":    {"style": "short_answer",          "reason": "専門1 簡答"},
}

# ============================================================================
# GENERATORS PER STYLE
# ============================================================================

def gen_word_bank_matching(blueprint_id, facts, n=3):
    """
    Word bank matching: N correct terms + M surplus distractor terms.
    Examinee matches each prompt to ONE term from the bank.
    2022 format: 語群A(36 terms) for 16 prompts. Surplus = 20.
    """
    # Eligible facts for this blueprint
    rels = {
        "architect_to_work": "designed_by_architect",
        "building_to_period": "built_in",
        "building_style_pairing": "has_architectural_style",
        "phenomenon_to_term": "defined_as",
    }
    rel = rels.get(blueprint_id, "defined_as")
    subj = "history" if blueprint_id.startswith(("architect", "building")) else "environment"

    eligible = [f for f in facts if f.get("subject") == subj and f.get("relation") == rel
                and f.get("value", "").strip() and f["value"] != "要確認"]
    random.shuffle(eligible)

    pool = eligible[:10]  # 10 terms in bank
    prompts = pool[:n]     # 3 prompts to match

    all_terms = list(set(f["value"] for f in pool))
    random.shuffle(all_terms)

    questions = []
    for pf in prompts:
        correct = pf["value"]
        questions.append({
            "id": f"wb-{blueprint_id}-{pf['entityName'][:20]}",
            "subject": subj,
            "style": "word_bank_matching",
            "blueprintId": blueprint_id,
            "prompt": f"「{pf['entityName']}」に対応する語を語群から選びなさい。",
            "correctAnswer": correct,
            "wordBank": all_terms,
            "explanation": f"{pf['entityName']} → {correct}",
        })
    return questions


def gen_fill_blank_word_bank(blueprint_id, facts, candidates, n=3):
    """
    Fill-blank with word bank: sentence with blank, select from word bank.
    2022 format: 20 blanks, 27-term word bank. 7 surplus.
    """
    subj = "construction"
    rels = {
        "definition_to_term": "defined_as",
        "term_to_definition": "defined_as",
        "component_to_function": "has_function",
        "term_to_category": "belongs_to",
    }
    rel = rels.get(blueprint_id, "defined_as")

    # Get eligible from confirmed + candidates
    eligible = [f for f in facts if f.get("subject") == subj and f.get("relation") == rel
                and f.get("value", "").strip() and len(f.get("value", "")) >= 8]
    if len(eligible) < 10:
        for c in candidates:
            if c.get("subject") == subj and c.get("relation") == rel and c.get("value", "").strip():
                eligible.append(c)
    random.shuffle(eligible)

    bank = eligible[:15]  # 15-term word bank
    items = bank[:n]       # 3 fill-blank items
    all_terms = list(set(f["entityName"] for f in bank))

    questions = []
    for item in items:
        term = item["entityName"]
        desc = item.get("value", "")[:150]
        if blueprint_id == "definition_to_term":
            prompt = f"次の説明文の空欄に入る最も適切な用語を語群から選びなさい。\n\n{desc}：（　　　）"
        elif blueprint_id == "component_to_function":
            prompt = f"次の部材の主な機能を語群から選びなさい。\n\n{term}"
            # Swap: prompt = component, answer = function. Bank = functions
            all_terms = list(set(f.get("value", "")[:80] for f in bank if f.get("value")))
        else:
            prompt = f"「{term}」の説明として最も適切なものを語群から選びなさい。"

        questions.append({
            "id": f"fb-{blueprint_id}-{term[:20]}",
            "subject": subj,
            "style": "fill_blank_word_bank",
            "blueprintId": blueprint_id,
            "prompt": prompt,
            "correctAnswer": term if blueprint_id != "component_to_function" else item.get("value", "")[:80],
            "wordBank": all_terms,
            "explanation": f"{term}: {desc[:100]}",
        })
    return questions


def gen_formula_recall(blueprint_id, facts, n=3):
    """Formula recall: name → write the formula. Or formula → name."""
    eligible = [f for f in facts if f.get("subject") == "environment"
                and f.get("relation") == "formula_text"
                and f.get("expressionType") == "calculation_formula"
                and f.get("value", "").strip()]
    random.shuffle(eligible)

    questions = []
    for f in eligible[:n]:
        questions.append({
            "id": f"fr-{blueprint_id}-{f['entityName'][:20]}",
            "subject": "environment",
            "style": "formula_recall",
            "blueprintId": blueprint_id,
            "prompt": f"「{f['entityName']}」の計算式を書きなさい。",
            "correctAnswer": f["value"],
            "explanation": f"公式: {f['value']}",
        })
    return questions


def gen_correct_statement_select(blueprint_id, facts, n=3):
    """Correct/incorrect statement selection. 2022 format: 正しい記述を選べ."""
    subj_map = {"phenomenon_to_term": "environment", "concept_four_choice": "planning",
                "description_to_pattern": "planning", "phenomenon_to_criterion": "environment"}
    subj = subj_map.get(blueprint_id, "environment")

    rels = {"phenomenon_to_term": "defined_as", "description_to_pattern": "has_feature",
            "concept_four_choice": "defined_as", "phenomenon_to_criterion": "defined_as"}
    rel = rels.get(blueprint_id, "defined_as")

    eligible = [f for f in facts if f.get("subject") == subj and f.get("relation") == rel
                and f.get("value", "").strip() and len(f.get("value", "")) >= 15]
    random.shuffle(eligible)

    questions = []
    for f in eligible[:n]:
        correct_stmt = f["value"][:150]
        # Build false statements by mutating the correct one
        false_stmts = [
            correct_stmt.replace("増加", "減少") if "増加" in correct_stmt else correct_stmt + "（誤：逆である）",
            correct_stmt.replace("以上", "以下") if "以上" in correct_stmt else "（誤った記述：" + correct_stmt[:80] + "の逆）",
            correct_stmt.replace("大きい", "小さい") if "大きい" in correct_stmt else "（誤：" + correct_stmt[:60] + "ではない）",
        ]
        stmts = [f"正：{correct_stmt}"] + [f"誤：{s}" for s in false_stmts]
        random.shuffle(stmts)
        correct_idx = next(i for i, s in enumerate(stmts) if s.startswith("正："))
        questions.append({
            "id": f"cs-{blueprint_id}-{f['entityName'][:20]}",
            "subject": subj, "style": "correct_statement_select", "blueprintId": blueprint_id,
            "prompt": f"次の記述のうち、正しいものを一つ選びなさい。",
            "options": stmts,
            "correctIndex": correct_idx,
            "correctAnswer": correct_stmt,
            "explanation": f"「{f['entityName']}」について正しい記述。",
        })
    return questions


def gen_numerical_calculation(blueprint_id, facts, n=3):
    """Numerical calculation with concrete values. 2022 format: 数値計算."""
    eligible = [f for f in facts if f.get("subject") == "environment"
                and f.get("relation") == "formula_text"
                and f.get("expressionType") == "calculation_formula"]
    random.shuffle(eligible)

    # Hardcoded numerical values for known formulas (from past exam patterns)
    calc_examples = {
        "CO2必要換気量": ("G=0.015 m³/h, Ci=1000 ppm, Co=500 ppm のとき、必要換気量 Q [m³/h] を求めなさい。", "Q = 0.015 / (0.001 - 0.0005) = 30 m³/h"),
        "点光源の照度": ("光度 500 cd の点光源が直下 2.0 m を照らすとき、水平面照度 [lx] を求めなさい。", "E = 500 / 2.0² = 125 lx"),
        "残響時間": ("室容積 300 m³、等価吸音面積 60 m² の室の残響時間 [s] を Sabine 式で求めなさい。", "T = 0.161 × 300 / 60 = 0.805 s"),
        "熱貫流率": ("熱伝達抵抗 外気側0.04、室内側0.11、断熱材 d=0.1m λ=0.04、コンクリート d=0.15m λ=1.6 のU値 [W/m²·K] を求めなさい。", "R = 0.04+2.5+0.094+0.11 = 2.744, U = 1/2.744 = 0.36"),
        "動圧": ("空気密度 1.2 kg/m³、風速 5.0 m/s の動圧 [Pa] を求めなさい。", "q = 1.2 × 5.0² / 2 = 15 Pa"),
    }

    questions = []
    for f in eligible[:n]:
        name = f["entityName"]
        if name in calc_examples:
            prompt, answer = calc_examples[name]
        else:
            prompt = f"「{name}」の公式を用いて、適切な数値例で計算しなさい。\n公式: {f['value']}"
            answer = f"（公式 {f['value']} に数値を代入して計算）"
        questions.append({
            "id": f"nc-{blueprint_id}-{name[:20]}",
            "subject": "environment", "style": "numerical_calculation", "blueprintId": blueprint_id,
            "prompt": prompt, "correctAnswer": answer,
            "explanation": f"公式: {f['value']}",
        })
    return questions


def gen_short_answer(blueprint_id, facts, n=3):
    """Short answer: 簡答. Name/term recall from description."""
    subj = "planning"
    eligible = [f for f in facts if f.get("subject") == subj
                and f.get("relation") in ("has_feature", "has_layout", "defined_as")
                and f.get("conceptLevel") == "spatial_pattern"]
    random.shuffle(eligible)
    questions = []
    for f in eligible[:n]:
        questions.append({
            "id": f"sa-{blueprint_id}-{f['entityName'][:20]}",
            "subject": subj, "style": "short_answer", "blueprintId": blueprint_id,
            "prompt": f"次の空間的特徴を持つパターン名を答えなさい。\n\n{f['value'][:200]}",
            "correctAnswer": f["entityName"],
            "explanation": f"「{f['entityName']}」の特徴。",
        })
    return questions


def gen_inline_numeric_select(blueprint_id, facts, n=3):
    """Inline numeric selection: sentence with (value1, value2, value3, value4)."""
    eligible = [f for f in facts if f.get("subject") == "planning"
                and f.get("relation") == "standard_value"
                and re.search(r'\d', f.get("value", ""))]
    random.shuffle(eligible)

    questions = []
    for f in eligible[:n]:
        name = f["entityName"]
        correct = f["value"]
        # Find 3 numeric distractors with same unit
        unit_match = re.search(r'(m²|㎡|m³|m\b|cm|mm|席|人|台|％|%|W/|kW|dB|lx|Pa|kg)', correct)
        unit = unit_match.group(1) if unit_match else ""
        peers = [p for p in eligible if p["entityName"] != name and unit in p.get("value", "")]
        if len(peers) < 3:
            peers = eligible[:10]  # fallback
        dist = random.sample(peers, min(3, len(peers)))
        options = [correct] + [d["value"] for d in dist]
        random.shuffle(options)
        prompt = f"「{name}」の基準値として最も適切なものを選びなさい。\n\n({' / '.join(options)})"
        questions.append({
            "id": f"ns-{blueprint_id}-{name[:20]}",
            "subject": "planning",
            "style": "inline_numeric_select",
            "blueprintId": blueprint_id,
            "prompt": prompt,
            "options": [f"{o}" for o in options],
            "correctIndex": options.index(correct),
            "correctAnswer": correct,
            "explanation": f"「{name}」: {correct}",
        })
    return questions


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 60)
    print("Exam Reconstruction Engine")
    print("=" * 60)

    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]
    candidates = []
    if CANDIDATES_PATH.exists():
        with open(CANDIDATES_PATH, "r", encoding="utf-8") as f:
            candidates = json.load(f).get("candidates", [])

    # Generate per exam style, not per blueprint
    all_questions = []
    styles_used = Counter()

    # History: word_bank_matching (7/7 years in 専門1)
    print("\n[History] word_bank_matching (専門1 7/7年)...")
    for bp in ["architect_to_work", "building_to_period", "building_style_pairing"]:
        qs = gen_word_bank_matching(bp, facts, n=2)
        all_questions.extend(qs)
        styles_used["word_bank_matching"] += len(qs)

    # Construction: fill_blank_word_bank (3/7 years in 専門1)
    print("[Construction] fill_blank_word_bank (専門1 3/7年)...")
    for bp in ["definition_to_term", "component_to_function"]:
        qs = gen_fill_blank_word_bank(bp, facts, candidates, n=3)
        all_questions.extend(qs)
        styles_used["fill_blank_word_bank"] += len(qs)

    # Environment: numerical_calculation (13/13 years!) + correct_statement (5/13) + formula_completion (3/13)
    print("[Environment] numerical_calculation (専門1 13/13年!) + correct_statement (5/13)...")
    qs = gen_numerical_calculation("numeric_calculation", facts, n=3)
    all_questions.extend(qs)
    styles_used["numerical_calculation"] += len(qs)
    qs = gen_correct_statement_select("phenomenon_to_term", facts, n=2)
    all_questions.extend(qs)
    styles_used["correct_statement_select"] += len(qs)
    qs = gen_formula_recall("quantity_to_calculation_formula", facts, n=2)
    all_questions.extend(qs)
    styles_used["formula_recall"] += len(qs)

    # Planning: inline_numeric (7/7年) + correct_statement (5/7年) + short_answer
    print("[Planning] inline_numeric_select (専門1 7/7年) + correct_statement (5/7) + short_answer...")
    qs = gen_inline_numeric_select("number_four_choice", facts, n=3)
    all_questions.extend(qs)
    styles_used["inline_numeric_select"] += len(qs)
    qs = gen_correct_statement_select("description_to_pattern", facts, n=2)
    all_questions.extend(qs)
    styles_used["correct_statement_select"] += len(qs)
    qs = gen_short_answer("pattern_comparison", facts, n=2)
    all_questions.extend(qs)
    styles_used["short_answer"] += len(qs)

    print(f"\n--- Summary ---")
    print(f"Total: {len(all_questions)} questions")
    for style, n in styles_used.most_common():
        print(f"  {style}: {n}")

    # Write
    output = {
        "version": 1, "engine": "exam_reconstruction",
        "totalQuestions": len(all_questions),
        "examStyles": dict(styles_used),
        "questions": all_questions,
    }
    with open(DATA / "exam-reconstruction-questions.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ {DATA / 'exam-reconstruction-questions.json'}")

    # Report
    report = f"""# Exam Reconstruction Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Exam Style Distribution

| Style | Count | 2022 Reference |
|-------|-------|---------------|
"""
    refs = {
        "word_bank_matching": "2022 Q5 語群A/Bマッチング, Q2 現象→用語",
        "fill_blank_word_bank": "2022 Q3 20空欄→27語群",
        "formula_recall": "2022 Q2 Part2 公式→物理量",
        "inline_numeric_select": "2022 Q4 ( )内数値選択",
        "mcq": "Planning概念四选一（考试中较少使用）",
    }
    for style, n in styles_used.most_common():
        report += f"| {style} | {n} | {refs.get(style, '')} |\n"

    report += f"""
## Per-Question Details

Total: {len(all_questions)} questions using exam-authentic formats.

"""
    for q in all_questions:
        report += f"""### {q['id']}

- **Style:** {q['style']} · **Blueprint:** {q.get('blueprintId', 'N/A')}
- **Subject:** {q['subject']}
- **Prompt:** {q['prompt'][:200]}
"""
        if q.get("wordBank"):
            report += f"- **Word Bank:** {', '.join(q['wordBank'][:8])}{'...' if len(q.get('wordBank',[]))>8 else ''}\n"
        if q.get("correctAnswer"):
            report += f"- **Answer:** {q['correctAnswer'][:100]}\n"
        if q.get("options"):
            report += f"- **Options:** {q['options']}\n"
        report += "\n---\n\n"

    with open(DATA / "exam-reconstruction-report.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ {DATA / 'exam-reconstruction-report.md'}")


if __name__ == "__main__":
    main()
