#!/usr/bin/env python3
"""
Image Asset Builder
===================
Indexes available building images from Anki notes and building-image-map.
Creates ImageAsset records for the first 3 image-based blueprints.
Generates 30 preview questions (10 per blueprint).

Usage: python scripts/build-image-assets.py
Output: data/image-assets.json, data/image-preview-questions.json, data/image-preview-report.md
"""

import json, re, sys, io, os, random
from pathlib import Path
from collections import defaultdict
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)

BASE = Path(__file__).parent.parent
DATA = BASE / "data"
ANKI_NOTES = DATA / "anki-import" / "anki-notes.json"
BUILDING_IMG_MAP = DATA / "building-image-map.json"
FACTS_PATH = DATA / "atomic-facts.json"
BLUEPRINTS_PATH = DATA / "question-blueprints.json"

# Media directory from history card project
MEDIA_DIR = BASE.parent / "history card" / "temp_media"

# ============================================================================
# Image Asset Schema
# ============================================================================

def build_assets():
    assets = []
    seen = set()

    # 1. From Anki notes (most direct mapping)
    if ANKI_NOTES.exists():
        with open(ANKI_NOTES, "r", encoding="utf-8") as f:
            notes = json.load(f)["records"]

        for rec in notes:
            flds = rec.get("fields", {})
            img_html = flds.get("image", "")
            name = clean_text(flds.get("buildingName", ""))

            if not img_html or not name:
                continue

            # Extract image filename
            img_files = re.findall(r'src="([^"]+)"', img_html)
            for img_file in img_files:
                key = f"{name}|{img_file}"
                if key in seen:
                    continue
                seen.add(key)

                # Check if file exists
                file_path = MEDIA_DIR / img_file if MEDIA_DIR.exists() else None
                exists = file_path and file_path.exists()

                # Determine image role from context
                role = "exterior"  # default
                if re.search(r'平面|plan|floor', name, re.I):
                    role = "plan"
                elif re.search(r'断面|section|cross', name, re.I):
                    role = "section"
                elif re.search(r'詳細|detail|部分|細部', img_file, re.I):
                    role = "detail"

                assets.append({
                    "id": f"img-{len(assets):04d}",
                    "filePath": str(file_path) if exists else f"temp_media/{img_file}",
                    "fileName": img_file,
                    "sourceType": "anki",
                    "sourceId": rec.get("source", {}).get("noteId", "?"),
                    "entityNames": [name],
                    "imageRole": role,
                    "cropRegion": None,
                    "usableBlueprints": ["image_to_building", "image_to_style_or_architect"],
                    "attribution": "Notion → Anki media",
                    "copyrightStatus": "educational_use",
                    "confidence": "high" if exists else "medium",
                    "humanConfirmed": False,
                })

    # 2. From building-image-map (web app images)
    if BUILDING_IMG_MAP.exists():
        with open(BUILDING_IMG_MAP, "r", encoding="utf-8") as f:
            img_map = json.load(f)

        for bid, info in img_map.items():
            img_files = info.get("imageFiles", [])
            for img_file in img_files:
                key = f"{bid}|{img_file}"
                if key in seen:
                    continue
                seen.add(key)

                assets.append({
                    "id": f"img-{len(assets):04d}",
                    "filePath": f"public/past-exams/{img_file}",
                    "fileName": img_file,
                    "sourceType": "web_app",
                    "sourceId": bid,
                    "entityNames": [],
                    "imageRole": "exterior",
                    "cropRegion": None,
                    "usableBlueprints": ["image_to_building"],
                    "attribution": "Past exam images",
                    "copyrightStatus": "educational_use",
                    "confidence": "medium",
                    "humanConfirmed": False,
                })

    return assets


def clean_text(s):
    if not s: return ""
    return re.sub(r'<[^>]+>', '', s).strip()


# ============================================================================
# Generate image preview questions
# ============================================================================

def generate_preview(assets, facts, blueprints):
    """Generate 10 preview questions for each of 3 image blueprints."""
    bp_map = {bp["id"]: bp for bp in blueprints}

    # Get building facts
    buildings = defaultdict(dict)
    for f in facts:
        if f["subject"] != "history":
            continue
        name = f["entityName"]
        rel = f["relation"]
        val = f["value"]
        if rel == "has_style":
            buildings[name]["style"] = val
        elif rel == "designed_by":
            buildings[name]["people"] = val
        elif rel == "built_in":
            buildings[name]["period"] = val
        buildings[name]["_name"] = name

    # Asset → entity name mapping
    asset_by_name = defaultdict(list)
    for a in assets:
        for name in a.get("entityNames", []):
            asset_by_name[name].append(a)

    # Filter to assets that have matching building facts
    usable = []
    for name, info in buildings.items():
        if name in asset_by_name and (info.get("style") or info.get("people")):
            usable.append((name, info, asset_by_name[name]))

    print(f"  Usable image+building pairs: {len(usable)}")
    random.shuffle(usable)

    questions = []
    styles = list(set(b.get("style", "") for _, b, _ in usable if b.get("style")))
    people = list(set(b.get("people", "") for _, b, _ in usable if b.get("people")))
    all_names = list(set(name for name, _, _ in usable))

    # Blueprint 1: image_to_building (10 questions)
    bp = bp_map.get("image_to_building")
    count = 0
    for name, info, imgs in usable:
        if count >= 10: break
        img = imgs[0]
        distractors = [n for n in all_names if n != name][:3]
        if len(distractors) < 3: continue
        options = [name] + random.sample(distractors, 3)
        random.shuffle(options)
        correct_idx = options.index(name)
        opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]

        questions.append({
            "id": f"preview-img-{count+1:02d}",
            "blueprintId": bp["id"],
            "imageAssetId": img["id"],
            "fileName": img["fileName"],
            "question": {
                "prompt": "次の写真の建築名称を答えなさい。",
                "options": opts,
                "correctIndex": correct_idx,
                "answerExplanation": f"写真は{name}。{info.get('style','')}、{info.get('people','')}。",
            },
            "visibleFeatures": "建筑外观",
            "ambiguity": "none",
            "humanConfirmed": False,
            "traceability": {
                "originalSource": f"anki-notes.json → {img['sourceId']}",
                "originalField": "image",
                "confidence": img["confidence"],
            },
        })
        count += 1

    # Blueprint 2: image_to_style (5) + image_to_architect (5) = 10
    for bp_key in ["image_to_style", "image_to_architect"]:
        bp = bp_map.get(bp_key)
        if not bp: continue
        count = 0
        for name, info, imgs in usable:
            if count >= 5: break
            img = imgs[0]
            if bp_key == "image_to_style":
                target = info.get("style")
                pool = styles
                qtype = "様式"
            else:
                target = info.get("people")
                pool = people
                qtype = "建築家"
            if not target: continue
            distractors = [s for s in pool if s != target][:3]
            if len(distractors) < 3: continue
            options = [target] + random.sample(distractors, 3)
            random.shuffle(options)
            correct_idx = options.index(target)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]

            questions.append({
            "id": f"preview-img-{bp_key}-{count+1:02d}",
            "blueprintId": bp["id"],
            "imageAssetId": img["id"],
            "fileName": img["fileName"],
            "question": {
                "prompt": f"次の写真の建築の{qtype}を答えなさい。",
                "options": opts,
                "correctIndex": correct_idx,
                "answerExplanation": f"写真は{name}。{qtype}は{target}。",
            },
            "visibleFeatures": "建筑外观, 样式特征",
            "ambiguity": "none",
            "humanConfirmed": False,
            "traceability": {
                "originalSource": f"anki-notes.json → {img['sourceId']}",
                "originalField": "image + style/people",
                "confidence": img["confidence"],
            },
        })
            count += 1

    # Blueprint 3: construction_image_to_term (10 questions)
    bp = bp_map.get("image_to_component")
    # For construction, we need image→term mappings. Use construction Anki notes.
    const_path = DATA / "anki-import" / "construction-anki-notes.json"
    const_assets = []
    if const_path.exists():
        with open(const_path, "r", encoding="utf-8") as f:
            const_recs = json.load(f)["records"]
        for rec in const_recs:
            flds = rec.get("fields", {})
            img_html = flds.get("frontHtml", "")
            term = clean_text(flds.get("knowledgePoint", ""))
            img_files = re.findall(r'src="([^"]+)"', img_html)
            for img_file in img_files:
                if term:
                    const_assets.append((term, img_file, rec.get("source", {}).get("noteId", "?")))

    if const_assets:
        const_terms = list(set(t for t, _, _ in const_assets))
        random.shuffle(const_assets)
        count = 0
        for term, img_file, note_id in const_assets:
            if count >= 10: break
            distractors = [t for t in const_terms if t != term][:3]
            if len(distractors) < 3: continue
            options = [term] + random.sample(distractors, 3)
            random.shuffle(options)
            correct_idx = options.index(term)
            opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options)]

            questions.append({
                "id": f"preview-img-const-{count+1:02d}",
                "blueprintId": bp["id"] if bp else "image_to_component",
                "imageAssetId": f"construction-{note_id}",
                "fileName": img_file,
                "question": {
                    "prompt": "次の写真の構法部材・工法の名称を答えなさい。",
                    "options": opts,
                    "correctIndex": correct_idx,
                    "answerExplanation": f"写真は{term}。",
                },
                "visibleFeatures": "部材・工法の外観",
                "ambiguity": "none",
                "humanConfirmed": False,
                "traceability": {
                    "originalSource": f"construction-anki-notes.json → {note_id}",
                    "originalField": "image",
                    "confidence": "medium",
                },
            })
            count += 1

    return questions


# ============================================================================
# Main
# ============================================================================

def main():
    print("=" * 50)
    print("Image Asset Builder")
    print("=" * 50)

    # Build assets
    assets = build_assets()
    print(f"\nTotal image assets: {len(assets)}")
    print(f"  Human confirmed: {sum(1 for a in assets if a['humanConfirmed'])}")

    with open(DATA / "image-assets.json", "w", encoding="utf-8") as f:
        json.dump({"version": 1, "totalAssets": len(assets), "assets": assets}, f, ensure_ascii=False, indent=2)
    print(f"✓ {DATA / 'image-assets.json'}")

    # Load facts + blueprints
    with open(FACTS_PATH, "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]
    with open(BLUEPRINTS_PATH, "r", encoding="utf-8") as f:
        blueprints = json.load(f)["blueprints"]

    # Generate preview questions
    questions = generate_preview(assets, facts, blueprints)
    print(f"\nPreview questions: {len(questions)}")
    by_bp = defaultdict(int)
    for q in questions:
        by_bp[q["blueprintId"]] += 1
    for bp_id, cnt in sorted(by_bp.items()):
        print(f"  [{bp_id}]: {cnt}")

    with open(DATA / "image-preview-questions.json", "w", encoding="utf-8") as f:
        json.dump({"version": 1, "totalQuestions": len(questions), "questions": questions}, f, ensure_ascii=False, indent=2)
    print(f"✓ {DATA / 'image-preview-questions.json'}")

    # Report
    report = f"""# Image Preview Question Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

| Metric | Count |
|--------|-------|
| Total image assets | {len(assets)} |
| Human confirmed | {sum(1 for a in assets if a['humanConfirmed'])} |
| Preview questions | {len(questions)} |

## By Blueprint

| Blueprint | Count |
|-----------|-------|
"""
    for bp_id, cnt in sorted(by_bp.items()):
        bp_name = next((b["name"] for b in blueprints if b["id"] == bp_id), bp_id)
        report += f"| {bp_name} ({bp_id}) | {cnt} |\n"

    report += """
## Important Notes

- **All images marked `humanConfirmed: false`** — must be reviewed before entering the formal question pool.
- **Image files referenced from `temp_media/`** — need to be copied to `public/` for web use.
- **同一图片可支持多个蓝图** — 但每个答案关系必须独立确认。
"""
    with open(DATA / "image-preview-report.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ {DATA / 'image-preview-report.md'}")


if __name__ == "__main__":
    main()
