#!/usr/bin/env python3
"""Relation Detection & Frequency Analysis v1."""
import json, re, sys, io
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = Path(__file__).parent.parent
DATA = BASE / "data"
PROCESSED = DATA / "processed_questions"
REPORTS = BASE / "reports"; REPORTS.mkdir(exist_ok=True)
DOCS = BASE / "docs"

# ============================================================================
# SUB-RELATION DEFINITIONS with detection rules
# ============================================================================

SUB_RELATIONS = {
    # === HISTORY ===
    "1.1": {"name":"Image→Building Name","subject":"history","template":"history_image_wordbank_matching",
        "detection":{"subject":"history","has_image":True,"entity_type":"building","answer_field":"building_name"},
        "positive":["image_asset→entityName for any building with confirmed image"],
        "negative":["image of a detail, not the whole building→use 1.5"],
        "ambiguity":"If the image shows a building detail rather than the whole, use 1.5.",},
    "1.2": {"name":"Image→Architect","subject":"history","template":"history_image_wordbank_matching",
        "detection":{"subject":"history","has_image":True,"entity_type":"building","relation":"designed_by_architect|designed_by_office"},
        "positive":["building image→architect from designed_by_architect"],
        "negative":["patron/ruler in people field→exclude from architect bank"],
        "ambiguity":"Only designed_by_architect and designed_by_office. built_under_ruler, patronized_by excluded.",},
    "1.3": {"name":"Image→Style","subject":"history","template":"history_image_wordbank_matching",
        "detection":{"subject":"history","has_image":True,"entity_type":"building","relation":"has_architectural_style|has_regional_style"},
        "positive":["building image→architectural_style"],
        "negative":["building_type or classical_order→use separate bank or exclude"],
        "ambiguity":"Only has_architectural_style and has_regional_style. has_building_type excluded.",},
    "1.4": {"name":"Image→Period","subject":"history","template":"history_image_wordbank_matching",
        "detection":{"subject":"history","has_image":True,"entity_type":"building","relation":"built_in"},
        "positive":["building image→period/era"],
        "negative":["要確認 values→exclude"],
        "ambiguity":"Only built_in relation.",},
    "1.5": {"name":"Image→Detail/Component","subject":"history","template":"history_image_wordbank_matching",
        "detection":{"subject":"history","has_image":True,"is_detail":True},
        "positive":["close-up of roof detail, structural element"],
        "negative":["full building exterior→use 1.1"],
        "ambiguity":"Requires manual annotation of image role=detail.",},
    "2.1": {"name":"Exterior Photo→Name","subject":"history","template":"history_image_to_name",
        "detection":{"subject":"history","has_image":True,"free_recall":True,"answer":"building_name"},"positive":[],"negative":[],"ambiguity":""},
    "2.2": {"name":"Interior Photo→Name","subject":"history","template":"history_image_to_name",
        "detection":{"subject":"history","has_image":True,"free_recall":True,"image_role":"interior"},"positive":[],"negative":[],"ambiguity":""},
    "2.3": {"name":"Detail Photo→Name","subject":"history","template":"history_image_to_name",
        "detection":{"subject":"history","has_image":True,"free_recall":True,"image_role":"detail"},"positive":[],"negative":[],"ambiguity":""},
    "3.1": {"name":"Building Photo→Architect","subject":"history","template":"history_image_to_architect",
        "detection":{"subject":"history","has_image":True,"free_recall":True,"answer":"architect"},"positive":[],"negative":[],"ambiguity":""},
    "4.1": {"name":"Building Name→Architect","subject":"history","template":"history_wordbank_pairing_no_image",
        "detection":{"subject":"history","has_image":False,"relation":"designed_by_architect|designed_by_office"},"positive":[],"negative":[],"ambiguity":""},
    "4.2": {"name":"Building Name→Style","subject":"history","template":"history_wordbank_pairing_no_image",
        "detection":{"subject":"history","has_image":False,"relation":"has_architectural_style"},"positive":[],"negative":[],"ambiguity":""},
    "4.3": {"name":"Building Name→Period","subject":"history","template":"history_wordbank_pairing_no_image",
        "detection":{"subject":"history","has_image":False,"relation":"built_in"},"positive":[],"negative":[],"ambiguity":""},
    "4.4": {"name":"Style Name→Example Building","subject":"history","template":"history_wordbank_pairing_no_image",
        "detection":{"subject":"history","entity_type":"style","reverse":True},"positive":[],"negative":[],"ambiguity":""},
    "5.1": {"name":"Feature Description→Building Name","subject":"history","template":"history_description_to_name",
        "detection":{"subject":"history","has_image":False,"value_is_description":True},"positive":[],"negative":[],"ambiguity":""},
    "5.2": {"name":"Historical Event→Related Building","subject":"history","template":"history_description_to_name",
        "detection":{"subject":"history","has_image":False,"value_type":"event"},"positive":[],"negative":[],"ambiguity":""},
    "5.3": {"name":"Style Description→Style Name","subject":"history","template":"history_description_to_name",
        "detection":{"subject":"history","has_image":False,"value_is_style_description":True},"positive":[],"negative":[],"ambiguity":""},

    # === BUILDING CONSTRUCTION (建築構法) ===
    "6.1": {"name":"Material Context→Material Name","subject":"building_construction","template":"building_construction_shared_wordbank_fill",
        "detection":{"subject":"building_construction","context":"material","answer":"material_term"},"positive":[],"negative":[],"ambiguity":""},
    "6.2": {"name":"Structural Context→Structural Term","subject":"building_construction","template":"building_construction_shared_wordbank_fill",
        "detection":{"subject":"building_construction","context":"structural","answer":"structural_term"},"positive":[],"negative":[],"ambiguity":""},
    "6.3": {"name":"Process Context→Process Term","subject":"building_construction","template":"building_construction_shared_wordbank_fill",
        "detection":{"subject":"building_construction","context":"process","answer":"process_term"},"positive":[],"negative":[],"ambiguity":""},
    "6.4": {"name":"Defect Context→Defect Name","subject":"building_construction","template":"building_construction_shared_wordbank_fill",
        "detection":{"subject":"building_construction","context":"defect","answer":"defect_term"},"positive":[],"negative":[],"ambiguity":""},
    "7.1": {"name":"Definition→Term","subject":"building_construction","template":"building_construction_independent_fill",
        "detection":{"subject":"building_construction","free_recall":True,"answer":"term_name"},"positive":[],"negative":[],"ambiguity":""},
    "7.2": {"name":"Function Description→Component","subject":"building_construction","template":"building_construction_independent_fill",
        "detection":{"subject":"building_construction","free_recall":True,"answer":"component_name"},"positive":[],"negative":[],"ambiguity":""},
    "8.1": {"name":"Material→Density","subject":"building_construction","template":"building_construction_numerical",
        "detection":{"subject":"building_construction","unit":"kg/m³"},"positive":[],"negative":[],"ambiguity":""},
    "8.2": {"name":"Material→Strength","subject":"building_construction","template":"building_construction_numerical",
        "detection":{"subject":"building_construction","unit":"N/mm²|MPa"},"positive":[],"negative":[],"ambiguity":""},
    "8.3": {"name":"Element→Dimension","subject":"building_construction","template":"building_construction_numerical",
        "detection":{"subject":"building_construction","unit":"mm|cm|m","not":"N/mm²|kg/m³"},"positive":[],"negative":[],"ambiguity":""},

    # === ENVIRONMENT ===
    "10.1": {"name":"Given Values→Ventilation Rate","subject":"environment","template":"environment_numerical_calculation",
        "detection":{"subject":"environment","family":"ventilation_co2"},"positive":[],"negative":[],"ambiguity":""},
    "10.2": {"name":"Given Values→U-value","subject":"environment","template":"environment_numerical_calculation",
        "detection":{"subject":"environment","family":"thermal_transmission"},"positive":[],"negative":[],"ambiguity":""},
    "10.3": {"name":"Given Values→Reverberation Time","subject":"environment","template":"environment_numerical_calculation",
        "detection":{"subject":"environment","family":"reverberation"},"positive":[],"negative":[],"ambiguity":""},
    "10.4": {"name":"Given Values→Illuminance","subject":"environment","template":"environment_numerical_calculation",
        "detection":{"subject":"environment","family":"illuminance_point"},"positive":[],"negative":[],"ambiguity":""},
    "10.5": {"name":"Given Values→Dynamic Pressure","subject":"environment","template":"environment_numerical_calculation",
        "detection":{"subject":"environment","family":"dynamic_pressure"},"positive":[],"negative":[],"ambiguity":""},
    "11.1": {"name":"Everyday Observation→Physical Law","subject":"environment","template":"environment_phenomenon_wordbank",
        "detection":{"subject":"environment","phenomenon_description":True},"positive":[],"negative":[],"ambiguity":""},
    "11.2": {"name":"Lab Condition→Measurement Method","subject":"environment","template":"environment_phenomenon_wordbank",
        "detection":{"subject":"environment","phenomenon_description":True},"positive":[],"negative":[],"ambiguity":""},
    "12.1": {"name":"Formula→Quantity Name","subject":"environment","template":"environment_formula_completion",
        "detection":{"subject":"environment","has_formula":True,"answer":"quantity_name"},"positive":[],"negative":[],"ambiguity":""},
    "12.2": {"name":"Formula→Missing Exponent","subject":"environment","template":"environment_formula_completion",
        "detection":{"subject":"environment","has_formula":True,"answer":"integer"},"positive":[],"negative":[],"ambiguity":""},
    "13.1": {"name":"Term→Definition","subject":"environment","template":"environment_fact_recall",
        "detection":{"subject":"environment","free_recall":True,"answer":"definition"},"positive":[],"negative":[],"ambiguity":""},
    "13.2": {"name":"Law/Principle→Description","subject":"environment","template":"environment_fact_recall",
        "detection":{"subject":"environment","free_recall":True,"value_type":"principle"},"positive":[],"negative":[],"ambiguity":""},
    "13.3": {"name":"Quantity→Typical Value","subject":"environment","template":"environment_fact_recall",
        "detection":{"subject":"environment","free_recall":True,"value_type":"numeric"},"positive":[],"negative":[],"ambiguity":""},
    "14.1": {"name":"Principle→Correct","subject":"environment","template":"environment_correct_statement",
        "detection":{"subject":"environment","select":True,"same_topic":True},"positive":[],"negative":[],"ambiguity":""},

    # === PLANNING ===
    "15.1": {"name":"Area Standard→m² Value","subject":"planning","template":"planning_inline_numeric_select",
        "detection":{"subject":"planning","unit":"m²|㎡","relation":"standard_value"},"positive":[],"negative":[],"ambiguity":""},
    "15.2": {"name":"Dimension Standard→cm/m Value","subject":"planning","template":"planning_inline_numeric_select",
        "detection":{"subject":"planning","unit":"cm|m","relation":"standard_value"},"positive":[],"negative":[],"ambiguity":""},
    "15.3": {"name":"Capacity Standard→Person Count","subject":"planning","template":"planning_inline_numeric_select",
        "detection":{"subject":"planning","unit":"人|台","relation":"standard_value"},"positive":[],"negative":[],"ambiguity":""},
    "15.4": {"name":"Distance Standard→m Value","subject":"planning","template":"planning_inline_numeric_select",
        "detection":{"subject":"planning","unit":"m","value_is_distance":True},"positive":[],"negative":[],"ambiguity":""},
    "16.1": {"name":"Concept→Definition","subject":"planning","template":"planning_facility_fact_recall",
        "detection":{"subject":"planning","relation":"defined_as","conceptLevel":"concept"},"positive":[],"negative":[],"ambiguity":""},
    "16.2": {"name":"Case→Description","subject":"planning","template":"planning_facility_fact_recall",
        "detection":{"subject":"planning","relation":"exemplifies|has_feature","conceptLevel":"building_case"},"positive":[],"negative":[],"ambiguity":""},
    "16.3": {"name":"Theory→Example","subject":"planning","template":"planning_facility_fact_recall",
        "detection":{"subject":"planning","relation":"defined_as","conceptLevel":"person_view"},"positive":[],"negative":[],"ambiguity":""},
    "16.4": {"name":"Facility→Spatial Feature","subject":"planning","template":"planning_facility_fact_recall",
        "detection":{"subject":"planning","relation":"has_feature|has_layout","conceptLevel":"spatial_pattern"},"positive":[],"negative":[],"ambiguity":""},
    "16.5": {"name":"Project→Planner/Architect","subject":"planning","template":"planning_facility_fact_recall",
        "detection":{"subject":"planning","relation":"defined_as","value_contains_person":True},"positive":[],"negative":[],"ambiguity":""},
    "16.6": {"name":"Building→Spatial Pattern","subject":"planning","template":"planning_facility_fact_recall",
        "detection":{"subject":"planning","relation":"exemplifies","conceptLevel":"building_case"},"positive":[],"negative":[],"ambiguity":""},
    "17.1": {"name":"Building Code→Dimension","subject":"planning","template":"planning_legal_standard_fill",
        "detection":{"subject":"planning","legal_reference":True,"unit":"mm|cm|m"},"positive":[],"negative":[],"ambiguity":""},
    "17.2": {"name":"Fire Safety→Distance/Width","subject":"planning","template":"planning_legal_standard_fill",
        "detection":{"subject":"planning","topic":"fire|避難|消防"},"positive":[],"negative":[],"ambiguity":""},
    "17.3": {"name":"Accessibility→Dimension","subject":"planning","template":"planning_legal_standard_fill",
        "detection":{"subject":"planning","topic":"accessibility|バリアフリー"},"positive":[],"negative":[],"ambiguity":""},
    "17.4": {"name":"Area Standard→Minimum Area","subject":"planning","template":"planning_legal_standard_fill",
        "detection":{"subject":"planning","relation":"standard_value","unit":"m²|㎡","legal_reference":True},"positive":[],"negative":[],"ambiguity":""},
}

# ============================================================================
# FREQUENCY ANALYSIS — scan past exams
# ============================================================================

def scan_frequency():
    """Map each past exam subquestion to a sub-relation."""
    freq = defaultdict(lambda: {"exam_years":set(),"blocks":set(),"items":0,"refs":[]})
    manual = []
    total_s1 = 0

    files = sorted(PROCESSED.glob("*.md"))
    for fp in files:
        with open(fp,"r",encoding="utf-8") as f: content = f.read()
        ym = re.search(r'(\d{4})',fp.name); year=int(ym.group(1)) if ym else 0
        tier = "2-2" if "2-2" in fp.name else "1"
        subj=""
        if "建筑史" in fp.name: subj="history"
        elif "建筑构法" in fp.name: subj="building_construction"
        elif "结构力学" in fp.name: subj="structural_mechanics"
        elif "建筑环境" in fp.name: subj="environment"
        elif "建筑计划" in fp.name: subj="planning"
        else: continue
        if tier!="1" or subj=="structural_mechanics": continue
        total_s1 += 1

        qm=re.search(r'[Q問題](\d+)',fp.name); qnum=f"Q{qm.group(1)}" if qm else "?"
        block=f"{year}_{subj}_{qnum}"
        has_imgs=bool(re.search(r'!\[.*?\]\(|<img\b',content,re.I))

        # Map to sub-relations based on content patterns
        matched=set()
        if subj=="history":
            if has_imgs and re.search(r'[語语]群',content): matched.update(["1.1","1.2","1.3"])
            elif has_imgs and re.search(r'名称|建物',content): matched.add("1.1")
            elif has_imgs and re.search(r'設計者|建築家',content): matched.add("1.2")
            elif has_imgs and re.search(r'様式',content): matched.add("1.3")
            elif has_imgs and re.search(r'部材',content): matched.add("1.5")
            elif re.search(r'[語语]群',content) and not has_imgs: matched.update(["4.1","4.2","4.3"])
            elif re.search(r'説明|述べ|特徴',content) and not has_imgs: matched.add("5.1")
            else: manual.append({"file":fp.name,"reason":"history_unmatched"})
        elif subj=="building_construction":
            if re.search(r'[語语]群|用語群',content) and re.search(r'[（(]\s*[A-T]',content): matched.update(["6.1","6.2","6.3"])
            elif re.search(r'名称|答え',content) and not re.search(r'計算|求め|kN|N/mm',content): matched.add("7.1")
            elif re.search(r'密度|kg/m',content): matched.add("8.1")
            elif re.search(r'N/mm|MPa',content): matched.add("8.2")
            elif has_imgs: matched.add("9.1")
            else: manual.append({"file":fp.name,"reason":"building_construction_unmatched"})
        elif subj=="environment":
            if re.search(r'[語语]群',content) and not re.search(r'[=＝]|式',content): matched.update(["11.1","11.2"])
            elif re.search(r'[=＝]|式|公式',content) and re.search(r'[語语]群',content): matched.update(["12.1","12.2"])
            elif re.search(r'求め|計算',content) and re.search(r'[=＝]|式',content): matched.update(["10.1","10.2","10.3","10.4","10.5"])
            elif re.search(r'正し|誤り|適切',content) and re.search(r'選び|選べ',content): matched.add("14.1")
            elif re.search(r'答え|説明|述べ|名称',content): matched.update(["13.1","13.2"])
            else: manual.append({"file":fp.name,"reason":"environment_unmatched"})
        elif subj=="planning":
            if re.search(r'[（(]\s*\d[\d,，、\s]*\d\s*[）)]',content) and re.search(r'm²|㎡|m\b|cm|mm|人|台',content):
                matched.update(["15.1","15.2","15.3","15.4"])
            elif re.search(r'法|基準|条|令|規則',content) and re.search(r'以上|以下',content): matched.update(["17.1","17.4"])
            elif re.search(r'選び|選べ|適切',content) and not re.search(r'[（(]\s*\d',content): matched.update(["16.1","16.4"])
            elif re.search(r'事例|建築|設計|代表|例',content): matched.update(["16.2","16.6"])
            elif re.search(r'説明|述べ|答え|名称',content): matched.add("16.1")
            else: manual.append({"file":fp.name,"reason":"planning_unmatched"})

        for sid in matched:
            if sid in SUB_RELATIONS:
                freq[sid]["exam_years"].add(year)
                freq[sid]["blocks"].add(block)
                freq[sid]["items"]+=1
                freq[sid]["refs"].append(f"{year} {subj} {qnum}")

    return freq, manual, total_s1

# ============================================================================
# MAIN
# ============================================================================

def main():
    print("="*60)
    print("Relation Detection & Frequency Analysis v1")
    print("="*60)

    freq, manual, total_s1 = scan_frequency()

    # Build detection rules output
    rules_out = {}
    for sid, sr in SUB_RELATIONS.items():
        fd = freq.get(sid, {"exam_years":set(),"blocks":set(),"items":0,"refs":[]})
        yr_cnt = len(fd["exam_years"])
        blk_cnt = len(fd["blocks"])
        rules_out[sid] = {
            "id": sid, "name": sr["name"], "subject": sr["subject"], "template": sr["template"],
            "detection_rule": sr["detection"],
            "observed_frequency": {
                "exam_years": yr_cnt, "question_blocks": blk_cnt, "subitems": fd["items"],
                "status": "observed" if yr_cnt>0 else "not_observed",
            },
            "representative_refs": sorted(set(fd["refs"]))[:3],
            "positive_examples": sr["positive"], "negative_examples": sr["negative"],
            "ambiguity_rule": sr["ambiguity"],
            "current_field_support": "partially_supported",
        }

    with open(DATA/"relation-detection-rules-v1.json","w",encoding="utf-8") as f:
        json.dump({"version":1,"sub_relations":rules_out},f,ensure_ascii=False,indent=2)
    print(f"✓ relation-detection-rules-v1.json ({len(rules_out)} sub-relations)")

    # Frequency analysis
    freq_out = []
    for sid,fd in sorted(freq.items(),key=lambda x:-len(x[1]["exam_years"])):
        freq_out.append({
            "sub_relation_id":sid,"name":SUB_RELATIONS[sid]["name"],
            "subject":SUB_RELATIONS[sid]["subject"],
            "exam_year_count":len(fd["exam_years"]),
            "question_block_count":len(fd["blocks"]),
            "subitem_count":fd["items"],
            "representative_refs":sorted(set(fd["refs"]))[:3],
        })
    with open(DATA/"relation-frequency-analysis-v1.json","w",encoding="utf-8") as f:
        json.dump({"version":1,"total_s1_files":total_s1,"manual_review":len(manual),
                    "sub_relations":freq_out},f,ensure_ascii=False,indent=2)
    print(f"✓ relation-frequency-analysis-v1.json")

    # Priority matrix
    priority = []
    for sr_entry in freq_out:
        sid = sr_entry["sub_relation_id"]
        yr = sr_entry["exam_year_count"]
        blk = sr_entry["question_block_count"]
        sr_def = SUB_RELATIONS.get(sid,{})
        data_ready = "partial"
        if "10." in sid: data_ready = "ready"
        if "1." in sid or "2." in sid or "3." in sid or "9." in sid: data_ready = "blocked_images"
        if "17." in sid: data_ready = "blocked_legal"
        diff = "medium"
        if "image" in sr_def.get("template",""): diff = "medium"
        if "calculation" in sr_def.get("template","") or "numerical" in sr_def.get("template",""): diff = "low"
        if "correct_statement" in sr_def.get("template",""): diff = "medium"
        if "essay" in sr_def.get("template",""): diff = "high"
        score = yr*3 + blk*2 + (3 if data_ready=="ready" else (2 if data_ready=="partial" else 1))
        if yr>=5: tier="P0"
        elif yr>=3: tier="P1"
        else: tier="P2"
        priority.append({"sub_relation_id":sid,"name":sr_entry["name"],"exam_year_count":yr,
                          "question_block_count":blk,"data_readiness":data_ready,
                          "implementation_difficulty":diff,"priority_tier":tier,"score":score})
    priority.sort(key=lambda x:-x["score"])
    with open(DATA/"relation-priority-matrix-v1.json","w",encoding="utf-8") as f:
        json.dump({"version":1,"priority":priority},f,ensure_ascii=False,indent=2)
    print(f"✓ relation-priority-matrix-v1.json")

    # Per-subject top 3
    by_subj=defaultdict(list)
    for p in priority:
        by_subj[SUB_RELATIONS[p["sub_relation_id"]]["subject"]].append(p)
    top3={s:[(p["sub_relation_id"],p["name"],p["exam_year_count"]) for p in items[:3]] for s,items in by_subj.items()}

    observed=sum(1 for p in priority if p["exam_year_count"]>0)
    not_obs=sum(1 for p in priority if p["exam_year_count"]==0)
    ready=sum(1 for p in priority if p["data_readiness"]=="ready" and p["exam_year_count"]>0)
    next3=priority[:3]

    report=f"""# Relation Frequency Analysis v1

**Scanned:** {total_s1} S1 files | **Manual review:** {len(manual)} unmatched

## Summary

| Metric | Count |
|--------|-------|
| Sub-relations defined | {len(rules_out)} |
| Observed in past exams | {observed} |
| Not observed | {not_obs} |
| Data-ready now | {ready} |
| P0 (high freq, ready) | {sum(1 for p in priority if p['priority_tier']=='P0')} |
| P1 (high freq, needs tags) | {sum(1 for p in priority if p['priority_tier']=='P1')} |
| P2 (low freq or blocked) | {sum(1 for p in priority if p['priority_tier']=='P2')} |

## Per-Subject Top 3

"""
    for subj in ["history","building_construction","environment","planning"]:
        if subj in top3:
            report+=f"### {subj}\n"
            for sid,name,yr in top3[subj]:
                report+=f"- **{sid} {name}** — {yr} years\n"
            report+="\n"

    report+=f"""## Priority Matrix (P0 first)

| Tier | Sub-relation | Subject | Years | Blocks | Data | Difficulty |
|------|-------------|---------|-------|--------|------|-----------|
"""
    for p in priority:
        report+=f"| {p['priority_tier']} | {p['sub_relation_id']} {p['name']} | {SUB_RELATIONS[p['sub_relation_id']]['subject']} | {p['exam_year_count']} | {p['question_block_count']} | {p['data_readiness']} | {p['implementation_difficulty']} |\n"

    report+=f"""
## Not Observed

"""
    for p in priority:
        if p["exam_year_count"]==0:
            report+=f"- {p['sub_relation_id']} {p['name']}\n"

    report+=f"""
## Next 3 to Implement

"""
    for i,p in enumerate(next3,1):
        report+=f"{i}. **{p['sub_relation_id']} {p['name']}** — {p['exam_year_count']} years, {p['question_block_count']} blocks — {p['data_readiness']}\n"

    with open(REPORTS/"relation-frequency-analysis-v1.md","w",encoding="utf-8") as f:
        f.write(report)
    print(f"✓ reports/relation-frequency-analysis-v1.md")

    print(f"\nObserved: {observed}/{len(rules_out)} | Not observed: {not_obs} | Ready: {ready}")
    print(f"Top 3: {[(p['sub_relation_id'],p['name']) for p in next3]}")

if __name__=="__main__":
    main()
