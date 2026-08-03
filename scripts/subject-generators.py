#!/usr/bin/env python3
"""
Subject Generators — Phase 2 of Exam Specification v1
======================================================
Four independent generators, one per subject.
Each generator ONLY uses formats observed in the real exam.

History:    image_identification + word_bank_matching
Construction: fill_blank_word_bank + short_answer
Environment:  numerical_calculation + formula_completion + correct_statement_select
Planning:    inline_numeric_select + correct_statement_select + short_answer

Also deprecates Group D blueprints.

Usage: python scripts/subject-generators.py
"""

import json, re, sys, io, random, hashlib
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)
BASE = Path(__file__).parent.parent
DATA = BASE / "data"
FACTS = None; CANDIDATES = None

def load():
    global FACTS, CANDIDATES
    with open(DATA / "atomic-facts.json", "r", encoding="utf-8") as f: FACTS = json.load(f)["facts"]
    cp = DATA / "candidate-facts.json"
    CANDIDATES = json.load(open(cp, "r", encoding="utf-8")).get("candidates", []) if cp.exists() else []

# ============================================================================
# GROUP D DEPRECATION
# ============================================================================
GROUP_D = [
    "odd_one_out", "false_statement_identify", "case_to_feature",
    "term_association", "condition_change_judge", "quantity_to_definition_equation",
    "unit_conversion", "conservation_relation",
]

def deprecate_group_d():
    bp_path = DATA / "question-blueprints.json"
    with open(bp_path, "r", encoding="utf-8") as f: bps = json.load(f)
    for bp in bps["blueprints"]:
        if bp["id"] in GROUP_D:
            bp["status"] = "deprecated"
            bp["deprecatedReason"] = "Group D: never observed in real exam or redundant"
    with open(bp_path, "w", encoding="utf-8") as f: json.dump(bps, f, ensure_ascii=False, indent=2)
    return len(GROUP_D)

# ============================================================================
# HISTORY GENERATOR
# ============================================================================
class HistoryGenerator:
    """Image identification + word bank matching. 専門1 format."""

    @staticmethod
    def word_bank_matching(relation, subject_label, n_prompts=4, bank_size=12):
        """N prompts matched to M-term bank (M > N). Surplus = confusion."""
        eligible = [f for f in FACTS if f.get("subject") == "history"
                    and f.get("relation") == relation and f.get("value", "").strip()
                    and f["value"] != "要確認"]
        random.shuffle(eligible)
        bank = eligible[:bank_size]
        prompts = bank[:n_prompts]
        all_terms = list(set(f["value"] for f in bank))
        if len(all_terms) < n_prompts + 3: return []

        questions = []
        for pf in prompts:
            questions.append({
                "id": f"hist-wb-{pf['entityName'][:20]}",
                "subject": "history", "format": "word_bank_matching",
                "prompt": f"「{pf['entityName']}」に対応する{subject_label}を語群から選びなさい。",
                "correctAnswer": pf["value"],
                "wordBank": all_terms,
                "bankSize": len(all_terms), "promptCount": n_prompts,
                "explanation": f"{pf['entityName']} → {pf['value']}",
            })
        return questions

    @staticmethod
    def generate():
        qs = []
        qs.extend(HistoryGenerator.word_bank_matching("designed_by_architect", "建築家", 3, 10))
        qs.extend(HistoryGenerator.word_bank_matching("built_in", "時代", 3, 10))
        qs.extend(HistoryGenerator.word_bank_matching("has_architectural_style", "建築様式", 3, 10))
        return qs

# ============================================================================
# CONSTRUCTION GENERATOR
# ============================================================================
class ConstructionGenerator:
    """Fill-blank with word bank + short answer. 専門1 format."""

    @staticmethod
    def fill_blank_word_bank(relation, n_items=4, bank_size=12):
        """2022 Q3 format: N blanks, M-term bank, M > N."""
        pool = [f for f in FACTS if f.get("subject") == "construction"
                and f.get("relation") == relation and f.get("value", "").strip()
                and len(f.get("value", "")) >= 8]
        # Supplement with candidates
        for c in CANDIDATES:
            if c.get("subject") == "construction" and c.get("relation") == relation:
                pool.append(c)
        random.shuffle(pool)
        bank = pool[:bank_size]
        items = bank[:n_items]
        all_terms = list(set(f["entityName"] for f in bank))
        if len(all_terms) < n_items + 3: return []

        questions = []
        for item in items:
            desc = item.get("value", "")[:180]
            questions.append({
                "id": f"const-fb-{item['entityName'][:20]}",
                "subject": "construction", "format": "fill_blank_word_bank",
                "prompt": f"次の説明文の空欄に入る最も適切な用語を語群から選びなさい。\n\n{desc}：（　　　）",
                "correctAnswer": item["entityName"],
                "wordBank": all_terms,
                "bankSize": len(all_terms), "itemCount": n_items,
                "explanation": f"「{item['entityName']}」：{desc[:100]}",
            })
        return questions

    @staticmethod
    def short_answer(relation, n=3):
        """Name the component/method from a brief description."""
        eligible = [f for f in FACTS if f.get("subject") == "construction"
                    and f.get("relation") == relation and f.get("value", "").strip()
                    and len(f.get("value", "")) >= 12]
        random.shuffle(eligible)
        questions = []
        for f in eligible[:n]:
            questions.append({
                "id": f"const-sa-{f['entityName'][:20]}",
                "subject": "construction", "format": "short_answer",
                "prompt": f"次の説明に該当する建築構法の用語を答えなさい。\n\n{f['value'][:200]}",
                "correctAnswer": f["entityName"],
                "explanation": f"「{f['entityName']}」",
            })
        return questions

    @staticmethod
    def generate():
        qs = []
        qs.extend(ConstructionGenerator.fill_blank_word_bank("defined_as", 3, 10))
        qs.extend(ConstructionGenerator.short_answer("defined_as", 2))
        return qs

# ============================================================================
# ENVIRONMENT GENERATOR
# ============================================================================
class EnvironmentGenerator:
    """Numerical calculation + formula completion + correct statement. NO MCQ."""

    CALC_EXAMPLES = {
        "CO2必要換気量": ("G=0.015 m³/h, Ci=1000 ppm, Co=500 ppm のとき、必要換気量 Q [m³/h] を求めなさい。",
                          "Q = G/(Ci−Co) = 0.015/(0.001−0.0005) = 0.015/0.0005 = 30 m³/h"),
        "点光源の照度": ("光度 500 cd の点光源が直下 2.0 m の水平面を照らすとき、水平面照度 [lx] を求めなさい。",
                        "E = I·cosθ/r² = 500×1/2.0² = 125 lx"),
        "残響時間": ("室容積 300 m³、等価吸音面積 60 m² の室の残響時間 [s] を Sabine 式で求めなさい。",
                     "T₆₀ = 0.161V/A = 0.161×300/60 = 0.805 s"),
        "動圧": ("空気密度 1.2 kg/m³、風速 5.0 m/s のときの動圧 [Pa] を求めなさい。",
                 "q = ρv²/2 = 1.2×5.0²/2 = 15 Pa"),
        "熱貫流率": ("外壁: 外気側熱伝達抵抗0.04, 室内側0.11, 断熱材d=0.1m λ=0.04, コンクリートd=0.15m λ=1.6 [m²·K/W]。U値 [W/m²·K] を求めなさい。",
                     "R = 0.04+0.1/0.04+0.15/1.6+0.11 = 2.744, U = 1/2.744 = 0.36 W/m²·K"),
    }

    @staticmethod
    def numerical_calculation(n=3):
        questions = []
        for name, (prompt, answer) in list(EnvironmentGenerator.CALC_EXAMPLES.items())[:n]:
            questions.append({
                "id": f"env-calc-{name[:20]}",
                "subject": "environment", "format": "numerical_calculation",
                "prompt": prompt, "correctAnswer": answer,
                "explanation": f"公式適用。",
            })
        return questions

    @staticmethod
    def correct_statement_select(n=3):
        """正しい記述を選べ. Generate false statements by inverting conditions."""
        eligible = [f for f in FACTS if f.get("subject") == "environment"
                    and f.get("relation") in ("defined_as", "formula_text")
                    and f.get("value", "").strip() and len(f.get("value", "")) >= 20]
        random.shuffle(eligible)
        questions = []
        for f in eligible[:n]:
            correct = f["value"][:150]
            # Generate false by condition inversion
            false_stmts = []
            for pat, repl in [("増加", "減少"), ("以上", "以下"), ("大きい", "小さい"),
                              ("高い", "低い"), ("比例", "反比例"), ("上昇", "下降")]:
                if pat in correct:
                    false_stmts.append(correct.replace(pat, repl))
                    break
            if not false_stmts:
                false_stmts = [f"（誤：{correct[:60]}の逆が成り立つ）",
                               f"（誤：{correct[:50]}ではない）"]
            while len(false_stmts) < 3:
                false_stmts.append(f"（誤った記述：{f['entityName']}についての逆）")
            stmts = [f"正：{correct}"] + [f"誤：{s}" for s in false_stmts[:3]]
            random.shuffle(stmts)
            ci = next(i for i, s in enumerate(stmts) if s.startswith("正："))
            questions.append({
                "id": f"env-cs-{f['entityName'][:20]}",
                "subject": "environment", "format": "correct_statement_select",
                "prompt": "次の記述のうち、正しいものを一つ選びなさい。",
                "options": stmts, "correctIndex": ci,
                "correctAnswer": correct,
                "explanation": f"「{f['entityName']}」の正しい記述。",
            })
        return questions

    @staticmethod
    def formula_completion(n=3):
        """Formula → quantity name. Not MCQ selection."""
        eligible = [f for f in FACTS if f.get("subject") == "environment"
                    and f.get("relation") == "formula_text"
                    and f.get("expressionType") == "calculation_formula"]
        random.shuffle(eligible)
        questions = []
        for f in eligible[:n]:
            questions.append({
                "id": f"env-fc-{f['entityName'][:20]}",
                "subject": "environment", "format": "formula_completion",
                "prompt": f"次の式が表す物理量を答えなさい。\n\n{f['value']}",
                "correctAnswer": f["entityName"],
                "explanation": f"この式は「{f['entityName']}」を表す。",
            })
        return questions

    @staticmethod
    def generate():
        qs = []
        qs.extend(EnvironmentGenerator.numerical_calculation(3))
        qs.extend(EnvironmentGenerator.correct_statement_select(2))
        qs.extend(EnvironmentGenerator.formula_completion(2))
        return qs

# ============================================================================
# PLANNING GENERATOR
# ============================================================================
class PlanningGenerator:
    """Inline numeric select + correct statement + short answer."""

    @staticmethod
    def inline_numeric_select(n=3):
        """2022 Q4 format: sentence with (value1, value2, value3, value4)."""
        eligible = [f for f in FACTS if f.get("subject") == "planning"
                    and f.get("relation") == "standard_value"
                    and re.search(r'\d', f.get("value", ""))]
        random.shuffle(eligible)
        # Build unit-based clusters for peer distractors
        by_unit = defaultdict(list)
        for f in eligible:
            u = re.search(r'(m²|㎡|m³|m\b|cm|mm|席|人|台|％|%|W/|kW|dB|lx|Pa|kg)', f.get("value", ""))
            by_unit[u.group(1) if u else "other"].append(f)

        questions = []
        for f in eligible[:n]:
            name = f["entityName"]; correct = f["value"]
            u = re.search(r'(m²|㎡|m³|m\b|cm|mm|席|人|台|％|%|W/|kW|dB|lx|Pa|kg)', correct)
            unit = u.group(1) if u else "other"
            peers = [p for p in by_unit.get(unit, []) if p["entityName"] != name]
            if len(peers) < 3: peers = eligible[:8]
            dist = random.sample(peers, min(3, len(peers)))
            options = [correct] + [d["value"] for d in dist]
            random.shuffle(options)
            questions.append({
                "id": f"plan-ns-{name[:20]}",
                "subject": "planning", "format": "inline_numeric_select",
                "prompt": f"「{name}」の基準値として最も適切なものを選びなさい。\n\n({' ／ '.join(options)})",
                "options": options, "correctIndex": options.index(correct),
                "correctAnswer": correct,
                "explanation": f"「{name}」の基準値：{correct}。",
            })
        return questions

    @staticmethod
    def correct_statement_select(n=3):
        """正しい記述を選べ."""
        eligible = [f for f in FACTS if f.get("subject") == "planning"
                    and f.get("relation") in ("defined_as", "has_feature", "has_layout")
                    and f.get("value", "").strip() and len(f.get("value", "")) >= 20]
        random.shuffle(eligible)
        questions = []
        for f in eligible[:n]:
            correct = f["value"][:150]
            # Generate simple false statements
            false_stmts = [
                f"（誤：「{f['entityName']}」についての基準値は異なる）",
                f"（誤：{correct[:60]}の逆）",
                f"（誤：別の計画基準が適用される）",
            ]
            stmts = [f"正：{correct}"] + false_stmts
            random.shuffle(stmts)
            ci = next(i for i, s in enumerate(stmts) if s.startswith("正："))
            questions.append({
                "id": f"plan-cs-{f['entityName'][:20]}",
                "subject": "planning", "format": "correct_statement_select",
                "prompt": "次の建築計画に関する記述のうち、正しいものを一つ選びなさい。",
                "options": stmts, "correctIndex": ci,
                "correctAnswer": correct,
                "explanation": f"「{f['entityName']}」についての正しい記述。",
            })
        return questions

    @staticmethod
    def short_answer(n=2):
        """Name the pattern/concept from description."""
        eligible = [f for f in FACTS if f.get("subject") == "planning"
                    and f.get("relation") in ("has_feature", "has_layout")
                    and f.get("conceptLevel") == "spatial_pattern"]
        random.shuffle(eligible)
        questions = []
        for f in eligible[:n]:
            questions.append({
                "id": f"plan-sa-{f['entityName'][:20]}",
                "subject": "planning", "format": "short_answer",
                "prompt": f"次の空間的特徴を持つパターン名を答えなさい。\n\n{f['value'][:200]}",
                "correctAnswer": f["entityName"],
                "explanation": f"「{f['entityName']}」の特徴。",
            })
        return questions

    @staticmethod
    def generate():
        qs = []
        qs.extend(PlanningGenerator.inline_numeric_select(3))
        qs.extend(PlanningGenerator.correct_statement_select(2))
        qs.extend(PlanningGenerator.short_answer(2))
        return qs

# ============================================================================
# MAIN
# ============================================================================
def main():
    print("=" * 60)
    print("Subject Generators — Phase 2 (Exam Spec v1)")
    print("=" * 60)
    load()

    # Deprecate Group D
    n = deprecate_group_d()
    print(f"\n[0] Deprecated {n} Group D blueprints")

    # Generate
    all_qs = []
    for name, gen in [("History", HistoryGenerator), ("Construction", ConstructionGenerator),
                       ("Environment", EnvironmentGenerator), ("Planning", PlanningGenerator)]:
        qs = gen.generate()
        all_qs.extend(qs)
        fmts = Counter(q["format"] for q in qs)
        print(f"\n[{name}] {len(qs)} questions: {dict(fmts)}")

    print(f"\nTotal: {len(all_qs)} questions")
    total_fmts = Counter(q["format"] for q in all_qs)
    for fmt, cnt in total_fmts.most_common():
        print(f"  {fmt}: {cnt}")

    with open(DATA / "subject-generator-sample.json", "w", encoding="utf-8") as f:
        json.dump({"version": 1, "phase": "subject-generators", "total": len(all_qs),
                    "formats": dict(total_fmts), "questions": all_qs}, f, ensure_ascii=False, indent=2)
    print(f"\n✓ {DATA / 'subject-generator-sample.json'}")

    # Report
    report = f"""# Subject Generator Sample Report

**Phase 2 of Exam Specification v1**

## Format Distribution

"""
    for fmt, cnt in total_fmts.most_common():
        report += f"- **{fmt}**: {cnt}\n"

    report += f"\n## Per-Subject Samples\n\n"
    for q in all_qs:
        report += f"### {q['id']}\n"
        report += f"- **Subject:** {q['subject']} · **Format:** {q['format']}\n"
        report += f"- **Prompt:** {q['prompt'][:200]}\n"
        if q.get("wordBank"):
            report += f"- **Word Bank ({q.get('bankSize','?')} terms):** {', '.join(q['wordBank'][:6])}...\n"
        if q.get("options"):
            report += f"- **Options:** {q['options']}\n"
        report += f"- **Answer:** {q.get('correctAnswer', '?')[:120]}\n\n---\n\n"

    with open(DATA / "subject-generator-report.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ {DATA / 'subject-generator-report.md'}")

if __name__ == "__main__":
    main()
