#!/usr/bin/env python3
"""
Atomic Fact Extraction — SINGLE SOURCE OF TRUTH
================================================
Reads Anki notes + Notion cache + environment formulas → extracts atomic facts.
Outputs:
  data/atomic-facts.json          — confirmed high/medium facts
  data/candidate-facts.json       — long-text candidates (needs human review)
  data/fact-extraction-report.md  — audit report

Usage: python scripts/build-atomic-facts.py
"""

import json, hashlib, re, sys, io, os
from pathlib import Path
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent  # past-question-bank root
DATA = BASE / "data"

# ============================================================================
# Config
# ============================================================================

SOURCES = {
    "history_anki": {
        "path": DATA / "anki-import" / "anki-notes.json",
        "subject": "history",
        "sourceType": "anki",
        "field_map": {
            "buildingName": "entityName",
            "originalName": "entityNameOriginal",
            "period": "period",
            "style": "style",
            "people": "people",
            "history": "history",
            "pastExam": "pastExam",
        },
    },
    "construction_anki": {
        "path": DATA / "anki-import" / "construction-anki-notes.json",
        "subject": "construction",
        "sourceType": "anki",
        "field_map": {
            "knowledgePoint": "entityName",
            "category": "category",
            "backHtml": "backHtml",
            "pastQuestion": "pastQuestion",
            "examForm": "examForm",
        },
    },
    "planning_anki": {
        "path": DATA / "anki-import" / "planning" / "anki-notes.json",
        "subject": "planning",
        "sourceType": "anki",
        "field_map": {
            "image": "entityName",
            "style": "answer",
            "buildingName": "category",
        },
    },
    "planning_notion": {
        "path": BASE.parent / "planning card" / "building_cache.json",
        "subject": "planning",
        "sourceType": "notion",
        "field_map": {
            "name": "entityName",
            "description": "description",
            "tags": "tags",
        },
    },
}

# ============================================================================
# Helpers
# ============================================================================

def make_id(*parts):
    h = hashlib.md5("|".join(str(p) for p in parts).encode()).hexdigest()[:12]
    return f"fact-{h}"

def clean_text(s):
    if not s:
        return ""
    s = s.strip()
    s = re.sub(r'<[^>]+>', '', s)  # strip HTML
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def is_uncertain(val):
    return not val or val in ("要確認", "要确认", "N/A", "—", "-", "なし", "不明")

# ============================================================================
# History extraction
# ============================================================================

def extract_history_facts(records, stats):
    facts = []
    candidates = []

    for rec in records:
        flds = rec.get("fields", {})
        note_id = rec.get("source", {}).get("noteId", "?")
        name = clean_text(flds.get("buildingName", ""))
        if not name:
            continue

        def add_fact(relation, value, confidence, source_field, evidence=None):
            if is_uncertain(value):
                stats["skipped_uncertain"] += 1
                return
            fid = make_id("history", name, relation, value)
            fact = {
                "id": fid,
                "subject": "history",
                "entityType": "building",
                "entityName": name,
                "relation": relation,
                "value": clean_text(value),
                "valueType": "text",
                "sourceType": "anki",
                "sourceId": note_id,
                "sourceField": source_field,
                "evidenceText": evidence or clean_text(value),
                "confidence": confidence,
                "reviewStatus": "unreviewed",
                "tags": [],
                "usableBlueprints": [],
            }
            if confidence in ("high", "medium"):
                facts.append(fact)
            else:
                candidates.append(fact)

        # Structured fields → high confidence
        orig = flds.get("originalName", "")
        add_fact("has_original_name", orig, "high", "originalName")

        period = flds.get("period", "")
        add_fact("built_in", period, "high" if not is_uncertain(period) else "low", "period")
        if not is_uncertain(period):
            facts[-1]["entityType"] = "building"
            facts[-1]["tags"].append(f"era:{period}")

        style = flds.get("style", "")
        add_fact("has_style", style, "high" if not is_uncertain(style) else "low", "style")
        if not is_uncertain(style):
            facts[-1]["tags"].append(f"style:{style}")

        people = flds.get("people", "")
        add_fact("designed_by", people, "high" if not is_uncertain(people) else "low", "people")
        if not is_uncertain(people):
            # Also create reverse fact: person → building
            fid2 = make_id("history", people, "designed", name)
            facts.append({
                "id": fid2,
                "subject": "history",
                "entityType": "person",
                "entityName": clean_text(people),
                "relation": "designed",
                "value": name,
                "valueType": "text",
                "sourceType": "anki",
                "sourceId": note_id,
                "sourceField": "people",
                "evidenceText": clean_text(people),
                "confidence": "high",
                "reviewStatus": "unreviewed",
                "tags": [],
                "usableBlueprints": [],
            })

        # Past exam links → medium confidence (derived from scan data)
        past = flds.get("pastExam", "")
        if past and "過去問" not in past and past.strip():
            # Parse year mentions from HTML
            years = re.findall(r'(\d{4})年', past)
            for yr in years:
                fid3 = make_id("history", name, "appears_in_exam", yr)
                facts.append({
                    "id": fid3,
                    "subject": "history",
                    "entityType": "building",
                    "entityName": name,
                    "relation": "appears_in_exam",
                    "value": yr,
                    "valueType": "text",
                    "sourceType": "anki",
                    "sourceId": note_id,
                    "sourceField": "pastExam",
                    "evidenceText": past[:200],
                    "confidence": "medium",
                    "reviewStatus": "unreviewed",
                    "tags": [],
                    "usableBlueprints": [],
                })

        # History text → candidates only
        history = flds.get("history", "")
        if history and len(history) >= 12 and not is_uncertain(history):
            sentences = re.split(r'[。！？]', history)
            for si, sent in enumerate(sentences):
                sent = clean_text(sent)
                if len(sent) < 12:
                    continue
                # Only capture sentences with architectural keywords
                kw = re.search(r'特徴|構成|構造|空間|外観|平面|材料|形式|様式|建立|建設|設計|代表|技術|教会|寺院|住宅|宮殿|大聖堂|ドーム|アーチ|屋根|壁|柱', sent)
                if not kw:
                    continue
                fid4 = make_id("history", name, "has_feature_candidate", f"s{si}")
                candidates.append({
                    "id": fid4,
                    "subject": "history",
                    "entityType": "building",
                    "entityName": name,
                    "relation": "has_feature",
                    "value": sent,
                    "valueType": "text",
                    "sourceType": "anki",
                    "sourceId": note_id,
                    "sourceField": "history",
                    "evidenceText": sent,
                    "confidence": "candidate",
                    "reviewStatus": "unreviewed",
                    "tags": [],
                    "usableBlueprints": [],
                })

    return facts, candidates


# ============================================================================
# Construction extraction
# ============================================================================

def extract_construction_facts(records, stats):
    facts = []
    candidates = []

    for rec in records:
        flds = rec.get("fields", {})
        note_id = rec.get("source", {}).get("noteId", "?")
        term = clean_text(flds.get("knowledgePoint", ""))
        if not term or len(term) < 2:
            continue

        def add_fact(relation, value, confidence, source_field, evidence=None):
            if is_uncertain(value):
                stats["skipped_uncertain"] += 1
                return
            fid = make_id("construction", term, relation, value)
            fact = {
                "id": fid,
                "subject": "construction",
                "entityType": "term",
                "entityName": term,
                "relation": relation,
                "value": clean_text(value),
                "valueType": "text",
                "sourceType": "anki",
                "sourceId": note_id,
                "sourceField": source_field,
                "evidenceText": evidence or clean_text(value),
                "confidence": confidence,
                "reviewStatus": "unreviewed",
                "tags": [],
                "usableBlueprints": [],
            }
            if confidence in ("high", "medium"):
                facts.append(fact)
            else:
                candidates.append(fact)

        # Category → high
        cat = flds.get("category", "")
        if cat and cat not in ("未分類", "概念", "その他", ""):
            add_fact("belongs_to", cat, "high", "category")

        # Past question evidence → medium
        pq = flds.get("pastQuestion", "")
        if pq and re.search(r'\d{4}', pq):
            years = re.findall(r'(\d{4})', pq)
            for yr in years:
                add_fact("appears_in_exam", yr, "medium", "pastQuestion", pq[:200])

        # Back HTML → extract intro paragraph as candidate
        back = flds.get("backHtml", "")
        if back:
            intro_match = re.search(r'📝\s*简介\s*(.+?)(?=📋|📖|🏷|$)', back, re.DOTALL)
            if intro_match:
                intro = clean_text(intro_match.group(1))
                if len(intro) >= 8:
                    fid_c = make_id("construction", term, "defined_as_candidate", "0")
                    candidates.append({
                        "id": fid_c,
                        "subject": "construction",
                        "entityType": "term",
                        "entityName": term,
                        "relation": "defined_as",
                        "value": intro,
                        "valueType": "text",
                        "sourceType": "anki",
                        "sourceId": note_id,
                        "sourceField": "backHtml",
                        "evidenceText": intro,
                        "confidence": "candidate",
                        "reviewStatus": "unreviewed",
                        "tags": [],
                        "usableBlueprints": [],
                    })

    return facts, candidates


# ============================================================================
# Planning extraction (Anki + Notion)
# ============================================================================

def extract_planning_facts(anki_records, notion_cards, stats):
    facts = []
    candidates = []

    # Planning Anki
    for rec in anki_records:
        flds = rec.get("fields", {})
        note_id = rec.get("source", {}).get("noteId", "?")
        term = clean_text(flds.get("image", ""))  # 'image' field = knowledge point name
        answer = clean_text(flds.get("style", ""))  # 'style' field = answer
        cat = clean_text(flds.get("buildingName", ""))

        if not term or len(term) < 2:
            continue
        if not answer:
            continue

        fid = make_id("planning", term, "defined_as", answer[:40])
        conf = "medium"
        is_numeric = bool(re.search(r'^\d|cm|mm|m\b|％|%|倍|以上|以下|程度|約', answer))
        relation = "standard_value" if is_numeric else "defined_as"

        facts.append({
            "id": fid,
            "subject": "planning",
            "entityType": "term",
            "entityName": term,
            "relation": relation,
            "value": answer[:200],
            "valueType": "number" if is_numeric else "text",
            "sourceType": "anki",
            "sourceId": note_id,
            "sourceField": "style",
            "evidenceText": answer[:200],
            "confidence": "medium",
            "reviewStatus": "unreviewed",
            "tags": [f"category:{cat}"] if cat else [],
            "usableBlueprints": [],
        })

    # Planning Notion
    for card in notion_cards:
        name = clean_text(card.get("name", ""))
        desc = clean_text(card.get("description", ""))
        if not name or not desc:
            continue

        page_id = card.get("page_id", "?")
        is_numeric = bool(re.search(r'^\d|cm|mm|m\b|％|%|倍|以上|以下|程度|約', desc))

        fid = make_id("planning", name, "standard_value" if is_numeric else "defined_as", desc[:40])
        facts.append({
            "id": fid,
            "subject": "planning",
            "entityType": "term",
            "entityName": name,
            "relation": "standard_value" if is_numeric else "defined_as",
            "value": desc[:200],
            "valueType": "number" if is_numeric else "text",
            "sourceType": "notion",
            "sourceId": page_id,
            "sourceField": "description",
            "evidenceText": desc[:200],
            "confidence": "medium",
            "reviewStatus": "unreviewed",
            "tags": card.get("tags", []),
            "usableBlueprints": [],
        })

    return facts, candidates


# ============================================================================
# Environment extraction
# ============================================================================

def extract_environment_facts(stats):
    facts = []

    env_path = BASE / "src" / "lib" / "environment-knowledge.ts"
    if not env_path.exists():
        print("  WARNING: environment-knowledge.ts not found, skipping")
        return facts

    with open(env_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Parse FORMULA_CARDS array
    # Find the array body
    card_match = re.search(r'const FORMULA_CARDS:.*?\[(.*?)\];', content, re.DOTALL)
    if not card_match:
        print("  WARNING: FORMULA_CARDS not found")
        return facts

    body = card_match.group(1)
    # Extract each card object
    entries = re.findall(r'\{\s*topic:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*formula:\s*"([^"]*)",\s*use:\s*"([^"]*)"[^}]*\}', body)

    print(f"  Parsed {len(entries)} formula cards")

    # Parse reference years
    ref_match = re.search(r'FORMULA_REFERENCE_YEARS:.*?\{(.*?)\}', content, re.DOTALL)
    ref_years = {}
    if ref_match:
        years_body = ref_match.group(1)
        for m in re.finditer(r'(\S+):\s*\[([^\]]+)\]', years_body):
            topic = m.group(1)
            years = [y.strip() for y in m.group(2).split(",") if y.strip().isdigit()]
            ref_years[topic] = years

    for topic, title, formula, use in entries:
        fid = make_id("environment", title, "formula_text", formula[:40])
        facts.append({
            "id": fid,
            "subject": "environment",
            "entityType": "formula",
            "entityName": title,
            "relation": "formula_text",
            "value": formula,
            "valueType": "text",
            "sourceType": "textbook",
            "sourceId": "environment-knowledge.ts",
            "sourceField": "FORMULA_CARDS",
            "evidenceText": f"{formula} — {use}",
            "confidence": "high",
            "reviewStatus": "unreviewed",
            "tags": [f"topic:{topic}"],
            "usableBlueprints": ["formula_to_quantity", "quantity_to_formula"],
        })

        fid2 = make_id("environment", title, "computes", title)
        facts.append({
            "id": fid2,
            "subject": "environment",
            "entityType": "formula",
            "entityName": title,
            "relation": "computes",
            "value": title,
            "valueType": "text",
            "sourceType": "textbook",
            "sourceId": "environment-knowledge.ts",
            "sourceField": "FORMULA_CARDS",
            "evidenceText": use,
            "confidence": "medium",
            "reviewStatus": "unreviewed",
            "tags": [f"topic:{topic}"],
            "usableBlueprints": [],
        })

        years = ref_years.get(topic, [])
        for yr in years:
            fid3 = make_id("environment", title, "appears_in_exam", str(yr))
            facts.append({
                "id": fid3,
                "subject": "environment",
                "entityType": "formula",
                "entityName": title,
                "relation": "appears_in_exam",
                "value": str(yr),
                "valueType": "text",
                "sourceType": "past_exam",
                "sourceId": "environment-knowledge.ts",
                "sourceField": "FORMULA_REFERENCE_YEARS",
                "evidenceText": use,
                "confidence": "high",
                "reviewStatus": "unreviewed",
                "tags": [f"topic:{topic}"],
                "usableBlueprints": [],
            })

    return facts


# ============================================================================
# Main
# ============================================================================

def main():
    all_facts = []
    all_candidates = []
    stats = Counter()

    print("=" * 60)
    print("Atomic Fact Extraction")
    print("=" * 60)

    # --- History Anki ---
    history_path = SOURCES["history_anki"]["path"]
    print(f"\n[1/4] History Anki: {history_path}")
    if history_path.exists():
        with open(history_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        records = data.get("records", [])
        print(f"  {len(records)} records")
        facts, cands = extract_history_facts(records, stats)
        all_facts.extend(facts)
        all_candidates.extend(cands)
        print(f"  → {len(facts)} facts, {len(cands)} candidates")
    else:
        print("  MISSING")

    # --- Construction Anki ---
    const_path = SOURCES["construction_anki"]["path"]
    print(f"\n[2/4] Construction Anki: {const_path}")
    if const_path.exists():
        with open(const_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        records = data.get("records", [])
        print(f"  {len(records)} records")
        facts, cands = extract_construction_facts(records, stats)
        all_facts.extend(facts)
        all_candidates.extend(cands)
        print(f"  → {len(facts)} facts, {len(cands)} candidates")
    else:
        print("  MISSING")

    # --- Planning ---
    plan_anki_path = SOURCES["planning_anki"]["path"]
    plan_notion_path = SOURCES["planning_notion"]["path"]
    print(f"\n[3/4] Planning: Anki={plan_anki_path.exists()}, Notion={plan_notion_path.exists()}")

    anki_recs = []
    if plan_anki_path.exists():
        with open(plan_anki_path, "r", encoding="utf-8") as f:
            anki_recs = json.load(f).get("records", [])
    notion_cards = []
    if plan_notion_path.exists():
        with open(plan_notion_path, "r", encoding="utf-8") as f:
            notion_cards = json.load(f)

    facts, cands = extract_planning_facts(anki_recs, notion_cards, stats)
    all_facts.extend(facts)
    all_candidates.extend(cands)
    print(f"  → {len(facts)} facts, {len(cands)} candidates")

    # --- Environment ---
    print(f"\n[4/4] Environment formulas")
    facts = extract_environment_facts(stats)
    all_facts.extend(facts)
    print(f"  → {len(facts)} facts")

    # --- Deduplicate ---
    print(f"\n--- Deduplication ---")
    print(f"  Before: {len(all_facts)} facts, {len(all_candidates)} candidates")

    seen_facts = set()
    unique_facts = []
    for f in all_facts:
        key = (f["entityName"], f["relation"], f["value"])
        if key not in seen_facts:
            seen_facts.add(key)
            unique_facts.append(f)

    seen_cands = set()
    unique_cands = []
    for c in all_candidates:
        key = (c["entityName"], c["relation"], c["value"][:80])
        if key not in seen_cands:
            seen_cands.add(key)
            unique_cands.append(c)

    stats["facts_before_dedup"] = len(all_facts)
    stats["facts_after_dedup"] = len(unique_facts)
    stats["candidates_before_dedup"] = len(all_candidates)
    stats["candidates_after_dedup"] = len(unique_cands)

    print(f"  After:  {len(unique_facts)} facts, {len(unique_cands)} candidates")
    print(f"  Duplicates removed: facts {len(all_facts)-len(unique_facts)}, candidates {len(all_candidates)-len(unique_cands)}")

    # --- Confidence distribution ---
    conf_dist = Counter(f["confidence"] for f in unique_facts)
    print(f"\n  Confidence: high={conf_dist['high']}, medium={conf_dist['medium']}, low={conf_dist['low']}")

    # --- Write outputs ---
    print(f"\n--- Writing outputs ---")

    facts_path = DATA / "atomic-facts.json"
    with open(facts_path, "w", encoding="utf-8") as f:
        json.dump({
            "version": 1,
            "generatedAt": __import__("datetime").datetime.now().isoformat(),
            "totalFacts": len(unique_facts),
            "facts": unique_facts,
        }, f, ensure_ascii=False, indent=2)
    print(f"  ✓ {facts_path} ({len(unique_facts)} facts)")

    cands_path = DATA / "candidate-facts.json"
    with open(cands_path, "w", encoding="utf-8") as f:
        json.dump({
            "version": 1,
            "generatedAt": __import__("datetime").datetime.now().isoformat(),
            "totalCandidates": len(unique_cands),
            "candidates": unique_cands,
        }, f, ensure_ascii=False, indent=2)
    print(f"  ✓ {cands_path} ({len(unique_cands)} candidates)")

    # --- Audit report ---
    report_path = DATA / "fact-extraction-report.md"
    subj_facts = Counter(f["subject"] for f in unique_facts)
    subj_cands = Counter(c["subject"] for c in unique_cands)
    entity_types = Counter(f["entityType"] for f in unique_facts)
    relations = Counter(f["relation"] for f in unique_facts)

    report = f"""# Atomic Fact Extraction Report

**Generated:** {__import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

## Summary

| Metric | Count |
|--------|-------|
| Total confirmed facts | {len(unique_facts)} |
| Total candidates (needs review) | {len(unique_cands)} |
| Skipped (uncertain value) | {stats.get("skipped_uncertain", 0)} |
| Duplicates removed | {len(all_facts)-len(unique_facts)} |

## Confidence Distribution

| Confidence | Count |
|-----------|-------|
| High | {conf_dist["high"]} |
| Medium | {conf_dist["medium"]} |
| Low | {conf_dist["low"]} |

## By Subject

| Subject | Confirmed Facts | Candidates |
|---------|----------------|------------|
"""
    for subj in ["history", "construction", "planning", "environment"]:
        report += f"| {subj} | {subj_facts.get(subj, 0)} | {subj_cands.get(subj, 0)} |\n"

    report += f"""
## By Entity Type

| Type | Count |
|------|-------|
"""
    for et, cnt in entity_types.most_common():
        report += f"| {et} | {cnt} |\n"

    report += f"""
## Top Relations

| Relation | Count |
|----------|-------|
"""
    for rel, cnt in relations.most_common(15):
        report += f"| {rel} | {cnt} |\n"

    report += """
## Next Steps

1. Review `candidate-facts.json` — confirm, edit, or reject each candidate
2. Run `build-question-blueprints.py` to scan all past exam question patterns
3. Run `generate-preview.py` to produce 20 preview questions per subject
"""

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"  ✓ {report_path}")

    print(f"\n{'='*60}")
    print("Done.")


if __name__ == "__main__":
    main()
