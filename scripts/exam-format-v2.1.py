#!/usr/bin/env python3
"""Exam Format v2.1 — separate tiers, eliminate generic buckets, fix counting."""
import json, re, sys, io
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = Path(__file__).parent.parent
DATA = BASE / "data"
PROCESSED = DATA / "processed_questions"
REPORTS = BASE / "reports"; REPORTS.mkdir(exist_ok=True)

# ============================================================================
# IMPROVED CLASSIFIER — no generic fallback
# ============================================================================

def classify(text, subj, tier, has_images, img_count):
    """Return (template_id, metadata). Returns ('manual_review',...) if uncertain."""
    t = text.strip()

    # Shared detection helpers
    has_wordbank = bool(re.search(r'[語语]群|用語群|Group\s*[AB]', t, re.I))
    has_inline_opts = bool(re.search(r'[（(]\s*[\d][\d,，、\s]*[\d]\s*[）)]', t))
    has_select = bool(re.search(r'選び|選べ|一つ|1つ|最も', t))
    has_calc = bool(re.search(r'求め|計算|算出|数値|値|いくら', t))
    has_formula = bool(re.search(r'[=＝]|式|公式', t))
    has_essay = bool(re.search(r'説明|述べ|論じ|図示|描[きか]|スケッチ|行[以内程度]|字[以内程度]|作図', t))
    has_name_req = bool(re.search(r'名称|名前|何|誰|どの', t))
    has_style_req = bool(re.search(r'様式|スタイル|造り|様|主義|建築', t))

    # Count blanks: (A) (B) ... pattern OR (　) pattern
    blank_letters = re.findall(r'[（(]\s*([A-Ta-t])\s*[）)]', t)
    blank_count = len(blank_letters)

    # Count inline options
    inline_matches = re.findall(r'[（(]\s*([\d,，、\s]+)\s*[）)]', t)
    inline_opt_count = sum(len(re.split(r'[,，、\s]+', m.strip())) for m in inline_matches if any(c.isdigit() for c in m))

    # Detect standalone fill blanks: （　　　）pattern
    fill_blanks = len(re.findall(r'[（(]\s*[　\s]{2,}\s*[）)]', t))

    # Tier filtering
    is_s1 = (tier == "1")
    is_s2 = (tier == "2-2")

    if subj == "history" and is_s1:
        # Image + word bank matching (2014-2020 style)
        if has_images and has_wordbank:
            return "history_image_wordbank_matching", {
                "answer_mode": "wordbank_pair", "has_image": True,
                "image_count": img_count, "wordbank_count": 2,
                "required_fields": ["image_asset", "building_name", "architect", "style"],
            }
        # Pure image identification (2022 style, no word bank)
        if has_images and not has_wordbank:
            if re.search(r'名称|建物|建築名', t):
                return "history_image_to_name", {
                    "answer_mode": "free_recall", "has_image": True,
                    "required_fields": ["image_asset", "building_name"],
                }
            if re.search(r'設計者|建築家|人物', t):
                return "history_image_to_architect", {
                    "answer_mode": "free_recall", "has_image": True,
                    "required_fields": ["image_asset", "architect"],
                }
            if re.search(r'様式|スタイル|[〇○]+造り', t):
                return "history_image_to_style", {
                    "answer_mode": "free_recall", "has_image": True,
                    "required_fields": ["image_asset", "style"],
                }
            if re.search(r'部材|名称|斜め|突き出', t):
                return "history_image_detail_to_component", {
                    "answer_mode": "free_recall", "has_image": True,
                    "required_fields": ["image_asset", "component_name"],
                }
        # Word bank without images (2013 style)
        if has_wordbank and not has_images:
            return "history_wordbank_pairing_no_image", {
                "answer_mode": "wordbank_pair", "has_image": False,
                "required_fields": ["building_name", "architect", "style", "period"],
            }
        # Generic short answer (description→name, concept→definition, etc.)
        if has_name_req and not has_images:
            return "history_description_to_name", {
                "answer_mode": "free_recall", "has_image": False,
                "required_fields": ["description_text", "entity_name"],
            }
        # Numeric fact answer (year, dimension, count)
        if re.search(r'\d{3,4}年|\d世紀|何年|いつ', t) and not has_images:
            return "history_fact_recall", {
                "answer_mode": "free_recall",
                "required_fields": ["entity_name", "fact_value"],
            }
        return "manual_review", {"reason": "history_s1_unmatched", "file": "see_catalog"}

    # ==================================================================
    # HISTORY (専門2-2) — all essay, separate appendix
    # ==================================================================
    if subj == "history" and is_s2:
        return "history_essay_s2", {
            "answer_mode": "essay", "has_image": has_images,
            "tier": "2-2", "not_automatable": True,
        }

    # ==================================================================
    # CONSTRUCTION (専門1)
    # ==================================================================
    if subj == "construction" and is_s1:
        # Shared word bank fill-blank (2022 Q3 style)
        if has_wordbank and blank_count >= 3:
            return "construction_shared_wordbank_fill", {
                "answer_mode": "wordbank_select", "blank_count": blank_count,
                "shared_bank": True,
                "required_fields": ["term_name", "technical_definition"],
            }
        # Independent fill-blank (no shared bank)
        if fill_blanks >= 1 or blank_count >= 1:
            return "construction_independent_fill", {
                "answer_mode": "free_recall" if not has_select else "select",
                "blank_count": max(fill_blanks, blank_count),
                "required_fields": ["term_name"],
            }
        # Numerical calculation
        if has_calc or re.search(r'[Nk]N|N/mm|MPa|kN/m', t):
            return "construction_numerical", {
                "answer_mode": "calculation", "calculation_required": True,
                "required_fields": ["formula", "parameters"],
            }
        # Diagram/component identification
        if has_images and has_name_req:
            return "construction_image_to_component", {
                "answer_mode": "free_recall", "has_image": True,
                "required_fields": ["image_asset", "component_name"],
            }
        # Term→definition or definition→term short answer
        if has_name_req and not has_images:
            return "construction_definition_to_term", {
                "answer_mode": "free_recall",
                "required_fields": ["definition_text", "term_name"],
            }
        # True/false or correct statement
        if re.search(r'正し|誤り|適切|不適切|○|×', t) and has_select:
            return "construction_correct_statement", {
                "answer_mode": "single_select",
                "required_fields": ["statement", "truth_value"],
            }
        # Material/property value select or recall
        if re.search(r'密度|kg/m|N/mm|MPa|選出|選択|選び', t):
            return "construction_numerical", {
                "answer_mode": "select_or_recall", "calculation_required": False,
                "required_fields": ["material_name", "property_value"],
            }
        return "manual_review", {"reason": "construction_s1_unmatched"}

    # ==================================================================
    # CONSTRUCTION (専門2-2) — essay/design
    # ==================================================================
    if subj == "construction" and is_s2:
        return "construction_essay_s2", {
            "answer_mode": "essay_design", "tier": "2-2", "not_automatable": True,
        }

    # ==================================================================
    # ENVIRONMENT (専門1 only — no S2 in dataset)
    # ==================================================================
    if subj == "environment" and is_s1:
        # Phenomenon→term word bank (2022 Q2 Part 1)
        if has_wordbank and not has_formula and not has_calc:
            return "environment_phenomenon_wordbank", {
                "answer_mode": "wordbank_select", "shared_bank": True,
                "required_fields": ["phenomenon_description", "term_name"],
            }
        # Formula completion (2022 Q2 Part 2)
        if has_formula and has_wordbank:
            return "environment_formula_completion", {
                "answer_mode": "term_plus_integer", "has_formula": True,
                "required_fields": ["formula", "quantity_name", "exponent"],
            }
        # Numerical calculation
        if has_calc and has_formula:
            return "environment_numerical_calculation", {
                "answer_mode": "calculation", "calculation_required": True,
                "required_fields": ["formula", "variables", "units"],
            }
        # Calculation then select
        if has_calc and has_select and inline_opt_count >= 3:
            return "environment_calculation_select", {
                "answer_mode": "calculation_then_select",
                "required_fields": ["formula", "variables", "numeric_options"],
            }
        # Correct statement select
        if re.search(r'正し|誤り|適切|不適切', t) and has_select and not has_wordbank:
            return "environment_correct_statement", {
                "answer_mode": "single_select",
                "required_fields": ["principle_statement", "false_statement"],
            }
        # Numeric candidate fill
        if has_inline_opts and has_select:
            return "environment_numeric_candidate_fill", {
                "answer_mode": "inline_select",
                "required_fields": ["numeric_value", "unit"],
            }
        # Fact/value recall or describe/explain
        if has_name_req or re.search(r'答え|記し|説明|述べ', t):
            return "environment_fact_recall", {
                "answer_mode": "free_recall",
                "required_fields": ["entity_name", "fact_value"],
            }
        # Any remaining S1 environment question with text — fact recall
        if len(t) >= 30:
            return "environment_fact_recall", {
                "answer_mode": "free_recall",
                "required_fields": ["entity_name", "fact_value"],
            }
        return "manual_review", {"reason": "environment_s1_unmatched"}

    # ==================================================================
    # PLANNING (専門1)
    # ==================================================================
    if subj == "planning" and is_s1:
        # Inline numeric select (2022 Q4 style)
        if has_inline_opts and inline_opt_count >= 3:
            return "planning_inline_numeric_select", {
                "answer_mode": "inline_select", "inline_option_count": inline_opt_count,
                "required_fields": ["standard_name", "numeric_value", "unit", "building_type"],
            }
        # Numerical calculation
        if has_calc and not has_inline_opts:
            return "planning_numerical_calculation", {
                "answer_mode": "calculation",
                "required_fields": ["formula", "parameters"],
            }
        # Correct statement select
        if re.search(r'正し|誤り|適切|不適切', t) and has_select:
            return "planning_correct_statement", {
                "answer_mode": "single_select",
                "required_fields": ["principle_statement", "false_statement"],
            }
        # Definition→term
        if re.search(r'とは|次の用語|説明|定義', t) and has_name_req:
            return "planning_definition_to_term", {
                "answer_mode": "free_recall",
                "required_fields": ["definition_text", "term_name"],
            }
        # Legal standard fill
        if re.search(r'基準|法|条|令|規則|以上|以下', t) and not has_inline_opts:
            return "planning_legal_standard_fill", {
                "answer_mode": "free_recall_or_fill",
                "required_fields": ["standard_name", "legal_reference"],
            }
        # Image/name matching
        if has_images and has_name_req:
            return "planning_image_name_matching", {
                "answer_mode": "free_recall", "has_image": True,
                "required_fields": ["image_asset", "building_project_name"],
            }
        # Facility fact recall or design application
        if has_name_req or re.search(r'答え|記し|説明|寸法|高さ|面積|計画|設計', t):
            return "planning_facility_fact_recall", {
                "answer_mode": "free_recall_or_design",
                "required_fields": ["facility_name", "fact_value"],
            }
        # Any remaining with text
        if len(t) >= 30:
            return "planning_facility_fact_recall", {
                "answer_mode": "free_recall",
                "required_fields": ["entity_name", "fact_value"],
            }
        return "manual_review", {"reason": "planning_s1_unmatched"}

    # ==================================================================
    # PLANNING (専門2-2)
    # ==================================================================
    if subj == "planning" and is_s2:
        return "planning_essay_s2", {
            "answer_mode": "essay", "tier": "2-2", "not_automatable": True,
        }

    return "manual_review", {"reason": "no_rule_matched"}


# ============================================================================
# CHECK REQUIRED FORMATS
# ============================================================================

def check_required_formats(catalog):
    """Verify which required format types exist in past exams."""
    required = {
        "planning": ["definition_to_term_mcq", "project_to_planner_mcq", "image_name_matching",
                      "facility_fact_mcq", "inline_numeric_select", "numerical_calculation",
                      "legal_standard_select"],
        "construction": ["shared_wordbank_fill", "independent_fill", "diagram_component_identification",
                          "material_joint_relation", "construction_sequence", "numerical",
                          "true_false_or_statement_select"],
        "environment": ["fact_value_select", "numeric_candidate_fill", "true_false_batch",
                         "correct_statement_select", "numerical_calculation", "calculation_select",
                         "phenomenon_wordbank"],
        "history": ["image_multi_wordbank_matching", "image_to_name", "image_to_architect",
                     "non_image_wordbank_pairing", "definition_or_description_to_name"],
    }

    found = {subj: {fmt: False for fmt in fmts} for subj, fmts in required.items()}
    for e in catalog:
        tid = e["template_id"]
        for subj, fmts in required.items():
            for fmt in fmts:
                # Map catalog template_ids to required format names
                if e["subject"] == subj:
                    if fmt == "inline_numeric_select" and "inline_numeric" in tid: found[subj][fmt] = True
                    if fmt == "numerical_calculation" and "numerical" in tid and subj in tid: found[subj][fmt] = True
                    if fmt == "shared_wordbank_fill" and "shared_wordbank" in tid: found[subj][fmt] = True
                    if fmt == "independent_fill" and "independent_fill" in tid: found[subj][fmt] = True
                    if fmt == "correct_statement_select" and "correct_statement" in tid: found[subj][fmt] = True
                    if fmt == "calculation_select" and "calculation_select" in tid: found[subj][fmt] = True
                    if fmt == "phenomenon_wordbank" and "phenomenon_wordbank" in tid: found[subj][fmt] = True
                    if fmt == "image_to_name" and "image_to_name" in tid: found[subj][fmt] = True
                    if fmt == "image_to_architect" and "image_to_architect" in tid: found[subj][fmt] = True
                    if fmt == "image_multi_wordbank_matching" and "wordbank_matching" in tid: found[subj][fmt] = True
                    if fmt == "non_image_wordbank_pairing" and "wordbank_pairing" in tid: found[subj][fmt] = True
                    if fmt == "definition_or_description_to_name" and "description_to_name" in tid: found[subj][fmt] = True
                    if fmt == "definition_to_term_mcq" and "definition_to_term" in tid and "mcq" not in tid: found[subj][fmt] = True
                    if fmt == "facility_fact_recall" and "facility_fact" in tid: found[subj][fmt] = True
                    if fmt == "legal_standard_select" and "legal_standard" in tid: found[subj][fmt] = True
                    if fmt == "image_name_matching" and "image_name" in tid: found[subj][fmt] = True
                    if fmt == "diagram_component_identification" and "image_to_component" in tid: found[subj][fmt] = True
                    if fmt == "true_false_batch" and "phenomenon" in tid: found[subj][fmt] = True
                    if fmt == "numeric_candidate_fill" and "numeric_candidate" in tid: found[subj][fmt] = True
                    if fmt == "fact_value_select" and "fact_recall" in tid: found[subj][fmt] = True
                    if fmt == "construction_sequence" and "construction_essay" in tid: found[subj][fmt] = True
                    if fmt == "material_joint_relation" and "construction_numerical" in tid: found[subj][fmt] = True

    return found


# ============================================================================
# MAIN
# ============================================================================

def main():
    print("=" * 60)
    print("Exam Format Reconstruction v2.1")
    print("=" * 60)

    files = sorted(PROCESSED.glob("*.md"))
    print(f"\nScanning {len(files)} files...")

    catalog = []
    template_data = defaultdict(lambda: {
        "exam_years": set(), "question_blocks": set(), "subitem_count": 0, "blank_count": 0,
        "exam_refs": set(), "files": [],
    })

    for fp in files:
        with open(fp, "r", encoding="utf-8") as f:
            content = f.read()

        ym = re.search(r'(\d{4})', fp.name); year = int(ym.group(1)) if ym else 0
        tier = "2-2" if "2-2" in fp.name else "1"
        subj = ""
        if "建筑史" in fp.name: subj = "history"
        elif "建筑构法" in fp.name: subj = "construction"
        elif "建筑环境" in fp.name: subj = "environment"
        elif "建筑计划" in fp.name: subj = "planning"
        elif "结构力学" in fp.name: subj = "structures"
        else: continue
        if subj == "structures": continue

        qm = re.search(r'[Q問題](\d+)', fp.name)
        qnum = f"Q{qm.group(1)}" if qm else "?"
        block_id = f"{year}_{subj}_{qnum}"

        imgs = re.findall(r'!\[.*?\]\(|Fig\.\s*\d|<img\b', content, re.I)
        img_count = len(imgs)

        # Split into subquestions: prefer markdown headers, then numbered items after blank lines
        if re.search(r'\n## |\n### ', content):
            sub_parts = re.split(r'\n(?=## |### )', content)
        elif re.search(r'\n{2,}[（(]?\d{1,2}[)）\.、]', content):
            sub_parts = re.split(r'\n{2,}(?=[（(]?\d{1,2}[)）\.、])', content)
        elif re.search(r'【[^】]+】', content):
            sub_parts = re.split(r'\n(?=【)', content)
        else:
            # Don't over-split — keep as one block
            sub_parts = [content]

        # Filter: keep only parts with substantial text (>80 chars), skip YAML/tables/metadata
        def is_valid_question(text):
            t = text.strip()
            if len(t) < 80: return False
            if t.startswith('---'): return False  # YAML frontmatter
            if t.startswith('question_number'): return False  # metadata
            if t.startswith('year:'): return False
            if t.startswith('subject:'): return False
            if t.startswith('category:'): return False
            if t.startswith('tags:'): return False
            if t.startswith('<table'): return False  # HTML tables (answer keys)
            if t.startswith('| '): return False  # Markdown tables
            if re.match(r'^\d{1,2}[.．]', t) and len(t) < 120: return False  # Short numbered items in answer keys
            return True
        sub_parts = [p for p in sub_parts if is_valid_question(p)]

        for si, part in enumerate(sub_parts):
            if len(part.strip()) < 10: continue

            tid, meta = classify(part, subj, tier, img_count > 0, img_count)

            entry = {
                "year": year, "subject": subj, "tier": tier,
                "question_number": qnum, "subquestion_index": si + 1,
                "template_id": tid, **meta, "file": fp.name, "block_id": block_id,
            }
            catalog.append(entry)

            td = template_data[tid]
            td["exam_years"].add(year)
            td["question_blocks"].add(block_id)
            td["subitem_count"] += 1
            td["blank_count"] += meta.get("blank_count", 0) or 1
            td["exam_refs"].add(f"{year} {tier} {subj} {qnum}")
            td["files"].append(fp.name)

    # Fix: "construction_shared_wordbank_fill" should count 2022 Q3 as 20 subitems, not 1
    # The splitter may have grouped all 20 blanks into 1 part
    # Quick fix: if a construction file has word bank and 20+ blanks, override blank_count
    for fp in files:
        with open(fp, "r", encoding="utf-8") as f: content = f.read()
        if "建筑构法" not in fp.name: continue
        ym = re.search(r'(\d{4})', fp.name); year = int(ym.group(1)) if ym else 0
        all_blanks = len(re.findall(r'[（(]\s*([A-Ta-t])\s*[）)]', content))
        if all_blanks >= 15 and template_data["construction_shared_wordbank_fill"]["subitem_count"] < all_blanks:
            template_data["construction_shared_wordbank_fill"]["subitem_count"] = all_blanks
            template_data["construction_shared_wordbank_fill"]["blank_count"] = all_blanks

    # Separate S1 and S2
    s1_catalog = [e for e in catalog if e["tier"] == "1"]
    s2_catalog = [e for e in catalog if e["tier"] == "2-2"]

    s1_templates = {tid for e in s1_catalog for tid in [e["template_id"]]}
    s2_templates = {tid for e in s2_catalog for tid in [e["template_id"]]}

    # Count manual_review
    manual_s1 = sum(1 for e in s1_catalog if e["template_id"] == "manual_review")
    manual_pct = manual_s1 / len(s1_catalog) * 100 if s1_catalog else 0

    print(f"\nS1 subquestions: {len(s1_catalog)}, S2: {len(s2_catalog)}")
    print(f"Manual review (S1): {manual_s1} ({manual_pct:.1f}%)")
    print(f"S1 templates: {len(s1_templates)}, S2 templates: {len(s2_templates)}")

    # Data readiness — re-evaluate per template
    with open(DATA / "atomic-facts.json", "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]
    fact_rel = defaultdict(set)
    for f_item in facts:
        fact_rel[f_item["subject"]].add(f_item["relation"])
    with open(DATA / "image-assets.json", "r", encoding="utf-8") as f:
        img_confirmed = sum(1 for a in json.load(f)["assets"] if a.get("humanConfirmed"))

    def assess_readiness(tid, subj):
        if "essay_s2" in tid: return "manual_only", "専門2-2 essay not automatable"
        if "image" in tid or "wordbank_matching" in tid:
            if img_confirmed < 4: return "blocked_images", f"only {img_confirmed} confirmed images"
            return "partial", "has images but need more confirmed"
        if "numerical_calculation" in tid and subj == "environment":
            return "ready", "production ready"
        if "wordbank" in tid or "fill" in tid:
            return "partial", "has terms but needs domain grouping"
        if "correct_statement" in tid:
            return "partial", "misconception library needs expansion"
        if "inline_numeric" in tid:
            return "partial", "values need standards verification"
        if "calculation" in tid:
            return "partial", "needs parameter ranges"
        if "definition" in tid or "description" in tid or "fact_recall" in tid:
            return "partial", "has facts but needs distractor pools"
        if "legal" in tid:
            return "blocked_legal_validation", "needs legal code verification"
        return "partial", "needs evaluation"

    # Build templates output
    templates_out = []
    for tid, td in template_data.items():
        if tid == "manual_review": continue
        # Determine subject from catalog entries
        entries = [e for e in catalog if e["template_id"] == tid]
        subj = entries[0]["subject"] if entries else "?"
        tier_set = {e["tier"] for e in entries}
        is_s1 = "1" in tier_set

        if not is_s1 and tid not in s2_templates: continue  # Only report S1 templates in main output
        if "essay_s2" in tid: continue  # Separate appendix

        readiness, reason = assess_readiness(tid, subj)

        # Representative refs (max 3, different years)
        refs = sorted(td["exam_refs"])
        rep_refs = []
        seen_yrs = set()
        for r in refs:
            yr = int(r[:4])
            if yr not in seen_yrs and len(rep_refs) < 3:
                rep_refs.append(r)
                seen_yrs.add(yr)

        # Priority: year frequency * 0.6 + block frequency * 0.4
        yr_count = len(td["exam_years"])
        blk_count = len(td["question_blocks"])
        priority_score = yr_count * 0.6 + blk_count * 0.4
        if readiness == "ready": priority_score += 2
        if readiness == "partial": priority_score += 0

        if yr_count >= 8: pri = "critical"
        elif yr_count >= 4: pri = "high"
        elif yr_count >= 2: pri = "medium"
        else: pri = "low"

        templates_out.append({
            "template_id": tid, "subject": subj,
            "exam_year_count": yr_count, "question_block_count": blk_count,
            "subitem_count": td["subitem_count"], "blank_count": td["blank_count"],
            "representative_refs": rep_refs,
            "all_refs": sorted(refs),
            "data_readiness": readiness, "readiness_reason": reason,
            "priority": pri, "priority_score": round(priority_score, 1),
        })

    templates_out.sort(key=lambda t: -t["priority_score"])

    # Check required formats
    required_check = check_required_formats(s1_catalog)

    # ======================================================================
    # OUTPUT
    # ======================================================================

    with open(DATA / "exam-format-catalog-v2.1.json", "w", encoding="utf-8") as f:
        json.dump({"version": "2.1", "scannedAt": datetime.now().isoformat(),
                    "totalFiles": len(files), "s1_subquestions": len(s1_catalog),
                    "s2_subquestions": len(s2_catalog), "manual_review_count": manual_s1,
                    "manual_review_pct": round(manual_pct, 1),
                    "entries_s1": s1_catalog, "entries_s2": s2_catalog}, f, ensure_ascii=False, indent=2)
    print(f"\n✓ exam-format-catalog-v2.1.json")

    with open(DATA / "template-coverage-matrix-v2.1.json", "w", encoding="utf-8") as f:
        json.dump({"version": "2.1", "s1_template_count": len(templates_out),
                    "templates": templates_out, "required_format_check": required_check}, f, ensure_ascii=False, indent=2)
    print(f"✓ template-coverage-matrix-v2.1.json")

    # Report
    top3 = templates_out[:3]
    ready_count = sum(1 for t in templates_out if t["data_readiness"] == "ready")
    partial_count = sum(1 for t in templates_out if "partial" in t["data_readiness"])
    blocked_count = sum(1 for t in templates_out if "blocked" in t["data_readiness"])
    manual_count = sum(1 for t in templates_out if t["data_readiness"] == "manual_only")

    # Most stable per subject (highest year_count)
    by_subj = defaultdict(list)
    for t in templates_out: by_subj[t["subject"]].append(t)
    per_subj_top3 = {}
    for subj, items in by_subj.items():
        top = sorted(items, key=lambda x: -x["exam_year_count"])[:3]
        per_subj_top3[subj] = [(t["template_id"], t["exam_year_count"]) for t in top]

    report = f"""# Exam Format Reconstruction v2.1

**Scanned:** {len(files)} files
**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}

## Summary

| Metric | Count |
|--------|-------|
| S1 subquestions | {len(s1_catalog)} |
| S2 subquestions | {len(s2_catalog)} |
| S1 templates | {len(templates_out)} |
| Manual review (S1) | {manual_s1} ({manual_pct:.1f}%) |
| Ready | {ready_count} |
| Partial | {partial_count} |
| Blocked | {blocked_count} |
| Manual only (S2) | {manual_count} |

## S1 Templates (ranked by priority)

| Template | Subject | Years | Blocks | Items | Readiness | Priority |
|----------|---------|-------|--------|-------|-----------|----------|
"""
    for t in templates_out:
        report += f"| {t['template_id']} | {t['subject']} | {t['exam_year_count']} | {t['question_block_count']} | {t['subitem_count']} | {t['data_readiness']} | {t['priority']} |\n"

    report += f"""
## Per-Subject Top 3 (by year frequency)

"""
    for subj in ["history", "construction", "environment", "planning"]:
        if subj in per_subj_top3:
            items = per_subj_top3[subj]
            report += f"**{subj}:**\n"
            for tid, yrs in items:
                report += f"- {tid} ({yrs} years)\n"
            report += "\n"

    report += f"""
## Required Format Check

✅ = observed in past exams, ❌ = not observed

"""
    for subj, fmts in required_check.items():
        report += f"### {subj}\n"
        for fmt, found in fmts.items():
            report += f"- {'✅' if found else '❌'} {fmt}\n"
        report += "\n"

    report += f"""
## Generator Coverage

- Ready generators: {ready_count} (environment numerical, environment calculation_select)
- Generators that need data: {partial_count}
- Blocked by images/legal: {blocked_count}

## S2 Appendix

S2 (専門2-2) has {len(s2_catalog)} subquestions across 4 essay templates.
All are manual-only (essay/diagram/design).
Not included in generator priority.

## Next 3 Generators to Implement

1. **{top3[0]['template_id']}** — {top3[0]['exam_year_count']} years, {top3[0]['question_block_count']} blocks — {top3[0]['data_readiness']}
2. **{top3[1]['template_id']}** — {top3[1]['exam_year_count']} years, {top3[1]['question_block_count']} blocks — {top3[1]['data_readiness']}
3. **{top3[2]['template_id']}** — {top3[2]['exam_year_count']} years, {top3[2]['question_block_count']} blocks — {top3[2]['data_readiness']}
"""
    with open(REPORTS / "exam-format-reconstruction-v2.1.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ reports/exam-format-reconstruction-v2.1.md")
    print(f"\nS1: {len(templates_out)} templates | Manual review: {manual_pct:.1f}%")
    print(f"Top 3: {[t['template_id'] for t in top3]}")

if __name__ == "__main__":
    main()
