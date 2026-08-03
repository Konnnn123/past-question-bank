#!/usr/bin/env python3
"""Coverage matrix: all blueprints × implementation status."""
import json, sys, io
from pathlib import Path
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent
DATA = BASE / "data"

def main():
    with open(DATA / "question-blueprints.json", "r", encoding="utf-8") as f:
        bps = json.load(f)["blueprints"]
    with open(DATA / "atomic-facts.json", "r", encoding="utf-8") as f:
        facts = json.load(f)["facts"]
    with open(DATA / "questions.json", "r", encoding="utf-8") as f:
        questions = json.load(f)["questions"]

    # Fact counts by subject+relation
    fact_by_relation = defaultdict(int)
    for f in facts:
        fact_by_relation[(f["subject"], f["relation"])] += 1

    # Question counts by blueprint
    q_by_bp = Counter(q["blueprintId"] for q in questions)
    approved_by_bp = Counter(q["blueprintId"] for q in questions if q.get("qualityPassed", True))

    # Audit sample
    audit_path = DATA / "question-audit-sample.json"
    audit_approved = Counter()
    if audit_path.exists():
        with open(audit_path, "r", encoding="utf-8") as f:
            audit = json.load(f)["questions"]
        for aq in audit:
            dec = aq.get("_audit", {}).get("reviewDecision", "")
            if dec == "approved":
                audit_approved[aq["blueprintId"]] += 1

    # Build report
    lines = [
        "# Question Blueprint Coverage Matrix",
        "",
        "## Implemented Blueprints",
        "",
        "| Blueprint | Subject | Exam Years | Exam Count | Implemented | Facts | Questions | Approved | TQ Avg | PQ Avg | Missing Reason |",
        "|-----------|---------|-----------|------------|-------------|-------|-----------|----------|--------|--------|----------------|",
    ]

    for bp in sorted(bps, key=lambda b: -b["occurrenceCount"]):
        sid = bp["id"]
        subj = bp["subject"]
        years = ",".join(str(y) for y in bp.get("years", [])[:5])
        occ = bp["occurrenceCount"]
        implemented = "✅" if q_by_bp.get(sid, 0) > 0 else "❌"
        q_count = q_by_bp.get(sid, 0)
        a_count = approved_by_bp.get(sid, 0)

        # Count relevant facts
        rels = bp.get("requiredFactRelations", [])
        fact_count = sum(fact_by_relation.get((subj, r), 0) for r in rels)

        # Average quality
        bp_qs = [q for q in questions if q["blueprintId"] == sid]
        t_avg = round(sum(q.get("technicalQuality", 100) for q in bp_qs) / len(bp_qs), 1) if bp_qs else 0
        p_avg = round(sum(q.get("pedagogicalQuality", 100) for q in bp_qs) / len(bp_qs), 1) if bp_qs else 0

        audit_ok = audit_approved.get(sid, "-")

        # Missing reason
        if q_count == 0:
            if any(r == "has_image" for r in rels):
                reason = "缺图片绑定（需图片→Anki media 映射）"
            elif fact_count == 0:
                reason = "缺原子事实（需补充数据源）"
            elif occ == 0:
                reason = "未在真题中观察到（需人工设计题型模板）"
            else:
                reason = "生成条件未满足（干扰项不足或字段缺失）"
        else:
            reason = "—"

        lines.append(
            f"| {bp['name']} ({sid}) | {subj} | {years} | {occ} | {implemented} | {fact_count} | {q_count} | {a_count} | {t_avg} | {p_avg} | {reason} |"
        )

    lines += [
        "",
        "## Unimplemented Blueprints (Gap Analysis)",
        "",
    ]

    unimplemented = [bp for bp in bps if q_by_bp.get(bp["id"], 0) == 0]
    if unimplemented:
        for bp in unimplemented:
            rels = bp.get("requiredFactRelations", [])
            fact_count = sum(fact_by_relation.get((bp["subject"], r), 0) for r in rels)
            lines.append(f"### {bp['name']} (`{bp['id']}`)")
            lines.append(f"- **Subject:** {bp['subject']}")
            lines.append(f"- **Exam occurrences:** {bp['occurrenceCount']} ({', '.join(str(y) for y in bp.get('years', []))})")
            lines.append(f"- **Required facts:** {', '.join(rels)} → available: {fact_count}")
            lines.append(f"- **Needs image:** {bp.get('needsImage', False)}")

            if bp.get("needsImage"):
                lines.append("- **Blocked by:** 缺少图片→实体映射。需要从 Anki media 文件或 Notion 图片建立 image_ref 索引。")
            elif fact_count == 0:
                lines.append("- **Blocked by:** 无可用原子事实。需要补充数据源或人工标注。")
            elif any(r == "has_feature" for r in rels):
                lines.append("- **Blocked by:** 特征描述均为候选（candidate），需人工确认后入库。")
            else:
                lines.append("- **Blocked by:** 生成逻辑未覆盖（需脚本支持）。")
            lines.append("")

    lines += [
        "## Summary",
        "",
        f"- Total blueprints: {len(bps)}",
        f"- Implemented: {sum(1 for bp in bps if q_by_bp.get(bp['id'], 0) > 0)}",
        f"- Not yet implemented: {len(unimplemented)}",
        f"- Total questions in pool: {len(questions)}",
    ]

    report = "\n".join(lines)
    report_path = DATA / "question-coverage-report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"✓ {report_path}")
    print(f"  {sum(1 for bp in bps if q_by_bp.get(bp['id'], 0) > 0)}/{len(bps)} blueprints implemented")
    print(f"  {len(unimplemented)} unimplemented")

if __name__ == "__main__":
    main()
