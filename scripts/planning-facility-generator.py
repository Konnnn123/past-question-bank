#!/usr/bin/env python3
"""Planning Facility Fact Recall Generator — first production version."""
import json, re, random, sys, io
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(2025)
BASE = Path(__file__).parent.parent
DATA = BASE / "data"

def load():
    with open(DATA / "atomic-facts.json", "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]
    return [f for f in facts if f["subject"] == "planning"]

# Topic keywords for grouping
TOPICS = {
    "housing": ["住宅", "住戸", "集合住宅", "公営", "団地", "ニュータウン", "51C", "居室", "寝室", "台所", "LDK", "DK"],
    "school": ["学校", "教室", "教育", "図書", "学習", "児童", "生徒", "幼稚園", "保育"],
    "hospital": ["病院", "病棟", "医療", "患者", "看護", "ナース", "手術", "ベッド", "療養"],
    "theater": ["劇場", "ホール", "舞台", "客席", "プロセニアム", "オペラ", "音響", "観客"],
    "library": ["図書館", "書架", "閲覧", "蔵書", "開架", "閉架", "収蔵"],
    "urban": ["都市", "地区", "計画", "用途", "ゾーン", "コンパクト", "近隣", "住区", "コミュニティ"],
    "office": ["事務所", "オフィス", "執務", "基準階", "コア", "レンタブル"],
    "welfare": ["福祉", "高齢", "障害", "バリアフリー", "ユニバーサル", "介護", "ケア"],
    "parking": ["駐車", "車路", "ランプ", "スパン"],
    "museum": ["美術館", "博物館", "展示", "収蔵"],
}

def classify_topic(name, value):
    text = name + value
    for topic, kws in TOPICS.items():
        if any(kw in text for kw in kws):
            return topic
    return "general"

def make_question(facts, relation, topic_filter, prompt_template, n=3):
    """Generate n MCQ questions from facts with given relation and topic."""
    eligible = [f for f in facts if f["relation"] == relation and classify_topic(f["entityName"], f["value"]) == topic_filter]
    if len(eligible) < 6:
        # Relax topic filter
        eligible = [f for f in facts if f["relation"] == relation]
    random.shuffle(eligible)
    qs = []
    for f in eligible[:n]:
        correct_name = f["entityName"]
        correct_val = f["value"][:150]
        # Find distractors: same relation, same topic if possible, different entity
        topic = classify_topic(correct_name, correct_val)
        peers = [p for p in facts if p["relation"] == relation and p["entityName"] != correct_name]
        same_topic = [p for p in peers if classify_topic(p["entityName"], p["value"]) == topic]
        if len(same_topic) >= 3:
            distractors = random.sample(same_topic, 3)
        elif len(peers) >= 3:
            distractors = random.sample(peers, 3)
        else:
            continue
        options = [correct_val] + [d["value"][:150] for d in distractors]
        random.shuffle(options)
        ci = options.index(correct_val)
        # Truncate options to 120 chars for readability
        options_display = [o[:120] for o in options]
        opts = [f"{chr(65+i)}. {o}" for i, o in enumerate(options_display)]

        # Scores
        same_topic_count = sum(1 for d in distractors if classify_topic(d["entityName"], d["value"]) == topic)
        distractor_quality = 5 if same_topic_count >= 2 else (4 if same_topic_count >= 1 else 3)
        opt_lens = [len(o) for o in options_display]
        len_ratio = max(opt_lens) / max(1, min(opt_lens))
        tech_acc = 5  # from verified facts

        qs.append({
            "id": f"plan-fac-{topic_filter}-{len(qs)+1:02d}",
            "subject": "planning", "format": "facility_fact_recall",
            "topic": topic, "relation": relation,
            "prompt": prompt_template.replace("{entity}", correct_name),
            "options": opts, "correctIndex": ci,
            "correctAnswer": correct_val,
            "sourceFactId": f["id"],
            "distractorFactIds": [d["id"] for d in distractors],
            "scores": {
                "technicalAccuracy": tech_acc,
                "distractorQuality": distractor_quality,
                "examFidelity": 5 if same_topic_count >= 2 else 4,
            },
            "explanation": f"「{correct_name}」についての正しい記述。",
        })
    return qs

def main():
    print("=" * 50)
    print("Planning Facility Fact Recall Generator")
    print("=" * 50)
    facts = load()
    all_qs = []

    # 1. term → definition (defined_as) across topics
    for topic in ["housing", "hospital", "school", "theater", "library", "urban"]:
        qs = make_question(facts, "defined_as", topic,
            "次の建築計画用語「{entity}」の説明として、最も適切なものを一つ選びなさい。", n=2)
        all_qs.extend(qs)

    # 2. spatial pattern → feature (has_feature or has_layout)
    for topic in ["housing", "hospital", "office"]:
        qs = make_question(facts, "has_feature", topic,
            "次の空間的特徴に該当する計画概念として、最も適切なものを一つ選びなさい。", n=2)
        all_qs.extend(qs)

    # Pad to 12 if needed
    if len(all_qs) < 12:
        extra = make_question(facts, "standard_value", "general",
            "建築計画における次の基準値として、最も適切なものを一つ選びなさい。\n\n「{entity}」", n=12-len(all_qs))
        all_qs.extend(extra)

    all_qs = all_qs[:12]

    # Score and filter
    passed = []
    rejected = []
    for q in all_qs:
        s = q["scores"]
        if s["technicalAccuracy"] >= 4.5 and s["distractorQuality"] >= 4.0 and s["examFidelity"] >= 4.0:
            passed.append(q)
        else:
            rejected.append(q)

    print(f"\nGenerated: {len(all_qs)} | Passed: {len(passed)} | Rejected: {len(rejected)}")
    for q in rejected:
        print(f"  REJECTED {q['id']}: scores={q['scores']}")

    # Output
    output = {"version": 1, "template": "planning_facility_fact_recall",
              "generatedAt": datetime.now().isoformat(),
              "total": len(passed), "rejected": len(rejected), "questions": passed}
    with open(DATA / "planning-facility-pilot.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n✓ planning-facility-pilot.json ({len(passed)} passed)")

    # Report
    topics_used = Counter(q["topic"] for q in passed)
    report = f"""# Planning Facility Fact Recall — Pilot Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
**Passed:** {len(passed)}/12 | **Rejected:** {len(rejected)}

## Topic Coverage

"""
    for t, n in topics_used.most_common():
        report += f"- {t}: {n}\n"

    report += f"\n## Per-Question Scores\n\n"
    for q in passed:
        s = q["scores"]
        report += f"### {q['id']}\n"
        report += f"- Topic: {q['topic']} | Relation: {q['relation']}\n"
        report += f"- T:{s['technicalAccuracy']} D:{s['distractorQuality']} E:{s['examFidelity']}\n"
        report += f"- Prompt: {q['prompt'][:150]}\n"
        report += f"- Answer: {q['correctAnswer'][:100]}\n\n"

    for q in rejected:
        s = q["scores"]
        report += f"### {q['id']} (REJECTED)\n"
        report += f"- Scores: T:{s['technicalAccuracy']} D:{s['distractorQuality']} E:{s['examFidelity']}\n"
        report += f"- Reason: distractor quality or exam fidelity below threshold\n\n"

    with open(DATA / "planning-facility-pilot-report.md", "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ planning-facility-pilot-report.md")

if __name__ == "__main__":
    main()
