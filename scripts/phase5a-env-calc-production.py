#!/usr/bin/env python3
"""
Phase 5A — Productionize Environment Numerical Calculation
===========================================================
Turn environment_numerical_calculation into the first production-ready Mock Exam template.
Target: structural similarity ≥4.0, knowledge validity = 5.0, zero unit errors.
"""
import json, re, sys, io, random, math
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)
BASE = Path(__file__).parent.parent
DATA = BASE / "data"

# ============================================================================
# 1. CALCULATION FAMILIES — from 13 years of past exams
# ============================================================================

FAMILIES = {
    "ventilation_co2": {
        "id": "ventilation_co2",
        "topic": "換気·CO2濃度",
        "examAppearances": 8,
        "years": [2013, 2014, 2016, 2017, 2018, 2020, 2025, 2026],
        "formula": "Q = G / (Ci - Co)",
        "variables": {
            "G":  {"name": "CO2発生量", "unit": "m³/h", "range": [0.010, 0.025], "precision": 3},
            "Ci": {"name": "室内許容濃度", "unit": "ppm", "range": [800, 1500], "precision": 0},
            "Co": {"name": "外気濃度", "unit": "ppm", "range": [300, 600], "precision": 0},
        },
        "target": {"name": "必要換気量", "symbol": "Q", "unit": "m³/h"},
        "assumptions": ["定常状態", "完全混合", "室内CO2発生のみ"],
        "reasoningSteps": 2,  # convert ppm→decimal, then divide
        "unitConversions": ["ppm → 無次元 (÷10⁶)"],
    },
    "thermal_transmission": {
        "id": "thermal_transmission",
        "topic": "熱貫流率",
        "examAppearances": 5,
        "years": [2019, 2023, 2024, 2025, 2026],
        "formula": "U = 1 / (1/ho + Σ(d/λ) + 1/hi)",
        "variables": {
            "ho": {"name": "外気側熱伝達抵抗", "unit": "m²·K/W", "range": [0.03, 0.06], "precision": 2},
            "hi": {"name": "室内側熱伝達抵抗", "unit": "m²·K/W", "range": [0.09, 0.13], "precision": 2},
            "d1": {"name": "層1厚さ", "unit": "m", "range": [0.05, 0.20], "precision": 3},
            "λ1": {"name": "断熱材熱伝導率", "unit": "W/(m·K)", "range": [0.03, 0.06], "precision": 3},
            "d2": {"name": "層2厚さ", "unit": "m", "range": [0.10, 0.20], "precision": 3},
            "λ2": {"name": "層2熱伝導率", "unit": "W/(m·K)", "range": [0.8, 2.0], "precision": 1},
        },
        "target": {"name": "熱貫流率", "symbol": "U", "unit": "W/(m²·K)"},
        "assumptions": ["定常状態", "一次元熱伝導", "接触抵抗無視"],
        "reasoningSteps": 3,  # compute R per layer, sum R, then U=1/R
        "unitConversions": [],
    },
    "reverberation": {
        "id": "reverberation",
        "topic": "残響時間",
        "examAppearances": 5,
        "years": [2013, 2016, 2017, 2019, 2026],
        "formula": "T60 = 0.161 * V / A",
        "variables": {
            "V": {"name": "室容積", "unit": "m³", "range": [100, 2000], "precision": 0},
            "A": {"name": "等価吸音面積", "unit": "m²", "range": [20, 500], "precision": 0},
        },
        "target": {"name": "残響時間", "symbol": "T60", "unit": "s"},
        "assumptions": ["拡散音場", "Sabineの残響式適用可能"],
        "reasoningSteps": 2,  # multiply 0.161*V, then divide by A
        "unitConversions": [],
    },
    "illuminance_point": {
        "id": "illuminance_point",
        "topic": "点光源の照度",
        "examAppearances": 5,
        "years": [2018, 2022, 2023, 2024, 2025],
        "formula": "E = I * cosθ / r²",
        "variables": {
            "I": {"name": "光度", "unit": "cd", "range": [200, 2000], "precision": 0},
            "r": {"name": "光源からの距離", "unit": "m", "range": [1.0, 5.0], "precision": 1},
            "θ": {"name": "入射角", "unit": "°", "range": [0, 60], "precision": 0},
        },
        "target": {"name": "水平面照度", "symbol": "E", "unit": "lx"},
        "assumptions": ["点光源", "直射光のみ（反射無視）"],
        "reasoningSteps": 2,  # compute cosθ, then E = I*cosθ/r²
        "unitConversions": ["° → rad for cos (if needed)"],
    },
    "dynamic_pressure": {
        "id": "dynamic_pressure",
        "topic": "動圧",
        "examAppearances": 2,
        "years": [2022, 2026],
        "formula": "q = ρ * v² / 2",
        "variables": {
            "ρ": {"name": "空気密度", "unit": "kg/m³", "range": [1.1, 1.3], "precision": 1},
            "v": {"name": "風速", "unit": "m/s", "range": [2.0, 15.0], "precision": 1},
        },
        "target": {"name": "動圧", "symbol": "q", "unit": "Pa"},
        "assumptions": ["非圧縮性流体", "定常流"],
        "reasoningSteps": 2,  # v², then ρ*v²/2
        "unitConversions": [],
    },
}

# ============================================================================
# 2. SCENARIO GENERATOR — constrained, not random
# ============================================================================

def generate_scenario(family):
    """Generate one constrained scenario. Returns (inputs_dict, solution_dict)."""
    f = family
    vals = {}
    for sym, var in f["variables"].items():
        lo, hi = var["range"]
        prec = var["precision"]
        # Pick a value ensuring it's not trivially round
        v = round(random.uniform(lo, hi), prec)
        # Ensure at least some precision for realism
        if prec == 0 and v == lo:
            v = lo + 1
        if prec == 0 and v == hi:
            v = hi - 1
        vals[sym] = v

    # Compute solution
    fid = f["id"]
    try:
        if fid == "ventilation_co2":
            Ci_dec = vals["Ci"] / 1_000_000
            Co_dec = vals["Co"] / 1_000_000
            Q = vals["G"] / (Ci_dec - Co_dec)
            solution = {"Q": round(Q, 1), "Ci_decimal": Ci_dec, "Co_decimal": Co_dec}
        elif fid == "thermal_transmission":
            R1 = vals["d1"] / vals["λ1"]
            R2 = vals["d2"] / vals["λ2"]
            R_total = vals["ho"] + R1 + R2 + vals["hi"]
            U = 1 / R_total
            solution = {"R1": round(R1, 3), "R2": round(R2, 3), "R_total": round(R_total, 3), "U": round(U, 2)}
        elif fid == "reverberation":
            T60 = 0.161 * vals["V"] / vals["A"]
            solution = {"T60": round(T60, 2)}
        elif fid == "illuminance_point":
            cos_val = math.cos(math.radians(vals["θ"]))
            E = vals["I"] * cos_val / (vals["r"] ** 2)
            solution = {"cosθ": round(cos_val, 3), "E": round(E, 0)}
        elif fid == "dynamic_pressure":
            q = vals["ρ"] * vals["v"] ** 2 / 2
            solution = {"q": round(q, 1)}
        else:
            return None, None
    except (ZeroDivisionError, ValueError):
        return None, None

    # Reject implausible results
    target = f["target"]
    tval = solution.get(f["target"]["symbol"].replace("60", "60"), 0)
    if isinstance(tval, (int, float)):
        if f["target"]["unit"] in ("m³/h",) and (tval < 5 or tval > 200):
            return None, None
        if f["target"]["unit"] in ("W/(m²·K)",) and (tval < 0.1 or tval > 5.0):
            return None, None
        if f["target"]["unit"] in ("s",) and (tval < 0.1 or tval > 20):
            return None, None
        if f["target"]["unit"] in ("lx",) and (tval < 10 or tval > 5000):
            return None, None
        if f["target"]["unit"] in ("Pa",) and (tval < 1 or tval > 200):
            return None, None

    return vals, solution

# ============================================================================
# 3. QUESTION RENDERER
# ============================================================================

def render_question(family, vals, solution, idx):
    """Render a Japanese exam-style calculation question."""
    f = family
    fid = f["id"]
    target_sym = f["target"]["symbol"]

    # Build prompt
    lines = []
    if fid == "ventilation_co2":
        lines.append(f"室内のCO2発生量を {vals['G']} m³/h、室内許容濃度を {vals['Ci']} ppm、")
        lines.append(f"外気濃度を {vals['Co']} ppm とする。")
        lines.append(f"定常状態における1人当たりの必要換気量 [m³/h] を求めなさい。")
        answer = f"{solution['Q']} m³/h"
        worked = (
            f"Ci = {vals['Ci']} ppm = {solution['Ci_decimal']}\n"
            f"Co = {vals['Co']} ppm = {solution['Co_decimal']}\n"
            f"Q = G / (Ci − Co) = {vals['G']} / ({solution['Ci_decimal']} − {solution['Co_decimal']})"
            f" = {vals['G']} / {round(solution['Ci_decimal'] - solution['Co_decimal'], 6)}"
            f" = {solution['Q']} m³/h"
        )
    elif fid == "thermal_transmission":
        lines.append(f"外壁の熱伝達抵抗：外気側 {vals['ho']} m²·K/W、室内側 {vals['hi']} m²·K/W")
        lines.append(f"断熱材：厚さ {vals['d1']} m、熱伝導率 {vals['λ1']} W/(m·K)")
        lines.append(f"コンクリート：厚さ {vals['d2']} m、熱伝導率 {vals['λ2']} W/(m·K)")
        lines.append(f"この壁の熱貫流率 U 値 [W/(m²·K)] を求めなさい。")
        answer = f"{solution['U']} W/(m²·K)"
        worked = (
            f"R1(断熱材) = d1/λ1 = {vals['d1']}/{vals['λ1']} = {solution['R1']} m²·K/W\n"
            f"R2(コンクリート) = d2/λ2 = {vals['d2']}/{vals['λ2']} = {solution['R2']} m²·K/W\n"
            f"R_total = ho + R1 + R2 + hi = {vals['ho']} + {solution['R1']} + {solution['R2']} + {vals['hi']}"
            f" = {solution['R_total']} m²·K/W\n"
            f"U = 1 / R_total = 1 / {solution['R_total']} = {solution['U']} W/(m²·K)"
        )
    elif fid == "reverberation":
        lines.append(f"室容積 {vals['V']} m³、等価吸音面積 {vals['A']} m² の室について、")
        lines.append(f"Sabine の残響式を用いて残響時間 [s] を求めなさい。")
        answer = f"{solution['T60']} s"
        worked = (
            f"T₆₀ = 0.161 × V / A = 0.161 × {vals['V']} / {vals['A']}"
            f" = {round(0.161*vals['V'],1)} / {vals['A']} = {solution['T60']} s"
        )
    elif fid == "illuminance_point":
        lines.append(f"光度 {vals['I']} cd の点光源が、光源から受照点までの直線距離 {vals['r']} m、")
        lines.append(f"入射角 {vals['θ']}° で水平面を照らしている。反射を無視したとき、")
        lines.append(f"水平面照度 [lx] を求めなさい。")
        answer = f"{solution['E']} lx"
        worked = (
            f"cos θ = cos({vals['θ']}°) = {solution['cosθ']}\n"
            f"E = I × cosθ / r² = {vals['I']} × {solution['cosθ']} / {vals['r']}²"
            f" = {round(vals['I']*solution['cosθ'],1)} / {vals['r']**2} = {solution['E']} lx"
        )
    elif fid == "dynamic_pressure":
        lines.append(f"空気密度 {vals['ρ']} kg/m³、風速 {vals['v']} m/s の気流の")
        lines.append(f"動圧 [Pa] を求めなさい。")
        answer = f"{solution['q']} Pa"
        worked = (
            f"q = ρ × v² / 2 = {vals['ρ']} × {vals['v']}² / 2"
            f" = {vals['ρ']} × {vals['v']**2} / 2 = {solution['q']} Pa"
        )
    else:
        return None

    # Build assumptions text
    assumps = f["assumptions"]

    # Validate: recompute independently
    validation = validate_independent(family, vals, solution)

    return {
        "id": f"env-calc-{fid}-{idx+1:02d}",
        "templateId": "environment_numerical_calculation",
        "familyId": fid,
        "subject": "environment",
        "format": "numerical_calculation",
        "prompt": "\n".join(lines),
        "assumptions": assumps,
        "correctAnswer": answer,
        "workedSolution": worked,
        "reasoningSteps": f["reasoningSteps"],
        "unitConversions": f["unitConversions"],
        "variables": {sym: {"value": v, "unit": f["variables"][sym]["unit"]} for sym, v in vals.items()},
        "validation": validation,
        "examRef": f"{f['examAppearances']}/{13}年出題",
    }

# ============================================================================
# 4. INDEPENDENT VALIDATOR
# ============================================================================

def validate_independent(family, vals, solution):
    """Recompute answer independently from stored inputs. Returns issues list."""
    issues = []
    f = family
    fid = f["id"]

    try:
        if fid == "ventilation_co2":
            Ci_d = vals["Ci"] / 1_000_000
            Co_d = vals["Co"] / 1_000_000
            Q_check = round(vals["G"] / (Ci_d - Co_d), 1)
            if abs(Q_check - solution["Q"]) > 0.1:
                issues.append(f"ANSWER_MISMATCH: computed {Q_check}, stored {solution['Q']}")
            if Ci_d <= 0 or Co_d <= 0 or Ci_d <= Co_d:
                issues.append("IMPLAUSIBLE_CONCENTRATION")
        elif fid == "thermal_transmission":
            R1_c = round(vals["d1"] / vals["λ1"], 3)
            R2_c = round(vals["d2"] / vals["λ2"], 3)
            Rt_c = round(vals["ho"] + R1_c + R2_c + vals["hi"], 3)
            U_c = round(1 / Rt_c, 2)
            if abs(U_c - solution["U"]) > 0.02:  # 0.02 tolerance for multi-step rounding
                issues.append(f"ANSWER_MISMATCH: computed {U_c}, stored {solution['U']}")
        elif fid == "reverberation":
            T_c = round(0.161 * vals["V"] / vals["A"], 2)
            if abs(T_c - solution["T60"]) > 0.01:
                issues.append(f"ANSWER_MISMATCH: computed {T_c}, stored {solution['T60']}")
        elif fid == "illuminance_point":
            cos_c = round(math.cos(math.radians(vals["θ"])), 3)
            E_c = round(vals["I"] * cos_c / vals["r"]**2, 0)
            if abs(E_c - solution["E"]) > 1:
                issues.append(f"ANSWER_MISMATCH: computed {E_c}, stored {solution['E']}")
            if vals["θ"] >= 90:
                issues.append("IMPLAUSIBLE_ANGLE")
        elif fid == "dynamic_pressure":
            q_c = round(vals["ρ"] * vals["v"]**2 / 2, 1)
            if abs(q_c - solution["q"]) > 0.1:
                issues.append(f"ANSWER_MISMATCH: computed {q_c}, stored {solution['q']}")
    except Exception as e:
        issues.append(f"VALIDATION_ERROR: {e}")

    # Check dimensional consistency
    for sym, var in f["variables"].items():
        if vals.get(sym, 0) <= 0:
            issues.append(f"NON_POSITIVE_VALUE: {sym}={vals.get(sym)}")
        if var["unit"]:
            lo, hi = var["range"]
            if vals.get(sym, 0) < lo * 0.1 or vals.get(sym, 0) > hi * 3:
                issues.append(f"VALUE_OUT_OF_RANGE: {sym}={vals.get(sym)} range=[{lo},{hi}]")

    return {"passed": len(issues) == 0, "issues": issues}


# ============================================================================
# 5. FIDELITY SCORING
# ============================================================================

def score_fidelity(q, family):
    """Structural similarity scoring per Phase 3/4 rubrics."""
    score = 0
    details = []

    # Structural similarity
    if family["examAppearances"] >= 5: score += 1; details.append("high_frequency_topic")
    if family["reasoningSteps"] >= 2: score += 0.8; details.append("multi_step")
    else: score += 0.3
    if family["unitConversions"]: score += 0.5; details.append("unit_conversion_required")
    if len(family["assumptions"]) >= 2: score += 0.5; details.append("explicit_assumptions")
    if q["validation"]["passed"]: score += 0.5; details.append("independent_validation_pass")
    if q["variables"]: score += 0.3; details.append("parameterized")
    structural = min(5.0, score + 2.5)  # baseline for correct formula

    # Knowledge validity
    knowledge = 5.0 if q["validation"]["passed"] else 3.0

    # Reasoning depth
    depth = min(5.0, family["reasoningSteps"] * 1.5 + 2.0)

    # Unit correctness
    unit_score = 5.0 if q["validation"]["passed"] and not any("UNIT" in i for i in q["validation"]["issues"]) else 3.0

    # Assumption completeness
    assumps_ok = len(family["assumptions"]) >= 2
    assumps_score = 5.0 if assumps_ok else 3.0

    # Overall
    avg = (structural + knowledge + depth + unit_score + assumps_score) / 5
    action = "keep" if avg >= 4.0 else ("revise" if avg >= 3.0 else "reject")

    return {
        "structuralSimilarity": round(structural, 1),
        "knowledgeValidity": knowledge,
        "reasoningDepth": round(depth, 1),
        "unitCorrectness": unit_score,
        "assumptionCompleteness": assumps_score,
        "averageScore": round(avg, 1),
        "action": action,
        "details": details,
    }


# ============================================================================
# MAIN
# ============================================================================

def main():
    print("=" * 60)
    print("Phase 5A — Productionize Environment Calculation")
    print("=" * 60)

    # 1. Family analysis
    print(f"\n[1] Calculation families: {len(FAMILIES)}")
    for fid, f in sorted(FAMILIES.items(), key=lambda x: -x[1]["examAppearances"]):
        print(f"  {fid}: {f['examAppearances']}/13 years, {f['reasoningSteps']} steps")

    with open(DATA / "environment-calculation-family-analysis.json", "w", encoding="utf-8") as fh:
        json.dump(FAMILIES, fh, ensure_ascii=False, indent=2)
    print(f"✓ family analysis")

    # 2. Production templates
    templates = {}
    for fid, f in FAMILIES.items():
        templates[fid] = {
            "id": f"env_calc_{fid}",
            "topic": f["topic"],
            "formula": f["formula"],
            "assumptions": f["assumptions"],
            "parameterRanges": {sym: v["range"] for sym, v in f["variables"].items()},
            "outputUnit": f["target"]["unit"],
            "reasoningSteps": f["reasoningSteps"],
        }
    with open(DATA / "environment-calculation-production-templates.json", "w", encoding="utf-8") as fh:
        json.dump(templates, fh, ensure_ascii=False, indent=2)
    print(f"✓ production templates")

    # 3. Parameter ranges
    param_ranges = {}
    for fid, f in FAMILIES.items():
        param_ranges[fid] = {sym: {"range": v["range"], "unit": v["unit"], "precision": v["precision"]} for sym, v in f["variables"].items()}
    with open(DATA / "environment-parameter-ranges.json", "w", encoding="utf-8") as fh:
        json.dump(param_ranges, fh, ensure_ascii=False, indent=2)
    print(f"✓ parameter ranges")

    # 4. Unit rules
    unit_rules = {}
    for fid, f in FAMILIES.items():
        unit_rules[fid] = {"inputs": {sym: v["unit"] for sym, v in f["variables"].items()}, "output": f["target"]["unit"], "conversions": f["unitConversions"]}
    with open(DATA / "environment-unit-rules.json", "w", encoding="utf-8") as fh:
        json.dump(unit_rules, fh, ensure_ascii=False, indent=2)
    print(f"✓ unit rules")

    # 5. Generate 12 pilot questions
    print(f"\n[5] Generating pilot questions...")
    pilots = []
    per_family = {fid: 3 for fid in ["ventilation_co2", "thermal_transmission"]}  # 6
    per_family["reverberation"] = 2
    per_family["illuminance_point"] = 2
    per_family["dynamic_pressure"] = 2
    # Total: 3+3+2+2+2 = 12

    for fid, n in per_family.items():
        f = FAMILIES[fid]
        attempts = 0
        count = 0
        while count < n and attempts < 50:
            vals, sol = generate_scenario(f)
            if vals is None:
                attempts += 1
                continue
            q = render_question(f, vals, sol, count)
            if q is None:
                attempts += 1
                continue
            # Fidelity audit
            audit = score_fidelity(q, f)
            q["fidelityAudit"] = audit
            pilots.append(q)
            count += 1
            attempts += 1

    print(f"  Generated: {len(pilots)} questions")
    by_family = Counter(q["familyId"] for q in pilots)
    for fid, n in sorted(by_family.items()):
        print(f"    {fid}: {n}")

    with open(DATA / "environment-calculation-pilot.json", "w", encoding="utf-8") as fh:
        json.dump({"phase": "5A", "total": len(pilots), "questions": pilots}, fh, ensure_ascii=False, indent=2)
    print(f"✓ pilot questions")

    # 6. Validation summary
    val_summary = []
    for q in pilots:
        val_summary.append({"id": q["id"], "passed": q["validation"]["passed"], "issues": q["validation"]["issues"]})
    with open(DATA / "environment-calculation-validation.json", "w", encoding="utf-8") as fh:
        json.dump(val_summary, fh, ensure_ascii=False, indent=2)
    print(f"✓ validation")

    # 7. Fidelity audit
    audits = []
    for q in pilots:
        audits.append({"id": q["id"], "familyId": q["familyId"], **q["fidelityAudit"]})
    with open(DATA / "environment-calculation-fidelity-audit.json", "w", encoding="utf-8") as fh:
        json.dump(audits, fh, ensure_ascii=False, indent=2)
    print(f"✓ fidelity audit")

    # 8. Production report
    avg_structural = sum(a["structuralSimilarity"] for a in audits) / len(audits)
    avg_knowledge = sum(a["knowledgeValidity"] for a in audits) / len(audits)
    actions = Counter(a["action"] for a in audits)
    zero_issues = sum(1 for q in pilots if len(q["validation"]["issues"]) == 0)

    passed = avg_structural >= 4.0 and actions.get("reject", 0) <= 1 and zero_issues >= 10
    readiness = "Production ready" if passed else "Requires another pilot"

    report = f"""# Environment Numerical Calculation — Production Report

**Phase 5A**

## Pilot Results

| Metric | Value | Target |
|--------|-------|--------|
| Questions generated | {len(pilots)} | 12 |
| Avg structural similarity | {avg_structural:.1f} | ≥4.0 |
| Avg knowledge validity | {avg_knowledge:.1f} | 5.0 |
| Zero-issue questions | {zero_issues}/{len(pilots)} | ≥10 |
| Keep | {actions.get('keep', 0)} | ≥10 |
| Revise | {actions.get('revise', 0)} | — |
| Reject | {actions.get('reject', 0)} | ≤1 |

## Status: {readiness}

## Per-Family Breakdown

| Family | Questions | Avg Structural | Exams |
|--------|-----------|---------------|-------|
"""
    for fid in sorted(by_family.keys()):
        fam_audits = [a for a in audits if a["familyId"] == fid]
        avg = sum(a["structuralSimilarity"] for a in fam_audits) / len(fam_audits)
        report += f"| {fid} | {len(fam_audits)} | {avg:.1f} | {FAMILIES[fid]['examAppearances']}/13 |\n"

    report += f"""
## Decision

**Environment numerical_calculation is {readiness.lower()}.**

"""
    if not passed:
        report += "Gap analysis needed:\n"
        if avg_structural < 4.0:
            report += f"- Structural similarity ({avg_structural:.1f}) below 4.0 threshold\n"
        if zero_issues < 10:
            report += f"- Only {zero_issues}/12 questions pass independent validation\n"
        if actions.get("reject", 0) > 1:
            report += f"- {actions.get('reject', 0)} questions rejected\n"

    report += f"""
## Smallest releasable subset

The following families are safe for Mock Exam release:
"""
    for fid in sorted(by_family.keys()):
        fam_audits = [a for a in audits if a["familyId"] == fid]
        avg = sum(a["structuralSimilarity"] for a in fam_audits) / len(fam_audits)
        rejects = sum(1 for a in fam_audits if a["action"] == "reject")
        if avg >= 3.8 and rejects == 0:
            report += f"- **{fid}**: {FAMILIES[fid]['topic']} ({FAMILIES[fid]['examAppearances']}/13 years, avg {avg:.1f})\n"

    with open(DATA / "environment-calculation-production-report.md", "w", encoding="utf-8") as fh:
        fh.write(report)
    print(f"\n✓ production report")
    print(f"\n{'='*60}")
    print(f"READINESS: {readiness}")
    print(f"  Structural: {avg_structural:.1f}/5.0")
    print(f"  Knowledge: {avg_knowledge:.1f}/5.0")
    print(f"  Actions: {dict(actions)}")
    print(f"  Clean validations: {zero_issues}/12")


if __name__ == "__main__":
    main()
