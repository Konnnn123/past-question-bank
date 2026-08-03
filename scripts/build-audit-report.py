#!/usr/bin/env python3
"""Process audit results → detailed manual-audit-report.md"""
import json, sys, io
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = Path(__file__).parent.parent
DATA = BASE / "data"

def main():
    # Load audit results (if user exported them)
    results_files = list(BASE.glob("audit-results-*.json")) + list(BASE.glob("public/audit-results-*.json"))
    sample_path = DATA / "question-audit-sample.json"

    print("Looking for audit results...")
    results = None
    for rf in results_files:
        try:
            with open(rf, "r", encoding="utf-8") as f:
                results = json.load(f)
            print(f"  Found: {rf.name} ({len(results)} entries)")
            break
        except:
            continue

    if not results:
        print("  No audit results found. Generating template report.")
        # Generate template from sample
        if sample_path.exists():
            with open(sample_path, "r", encoding="utf-8") as f:
                sample = json.load(f)["questions"]
            results = [{"id": q["id"], "subject": q["subject"], "blueprintId": q["blueprintId"],
                        "reviewDecision": None} for q in sample]
        else:
            print("  No sample file either. Aborting.")
            return

    # Stats
    total = len(results)
    reviewed = [r for r in results if r.get("reviewDecision")]
    not_reviewed = total - len(reviewed)

    decisions = Counter(r.get("reviewDecision") for r in reviewed)
    by_subject = defaultdict(lambda: {"total": 0, "reviewed": 0, "approved": 0, "decisions": Counter()})
    by_blueprint = defaultdict(lambda: {"total": 0, "reviewed": 0, "approved": 0, "decisions": Counter(), "issues": []})

    for r in results:
        subj = r.get("subject", "unknown")
        bp = r.get("blueprintId", "unknown")
        dec = r.get("reviewDecision")

        by_subject[subj]["total"] += 1
        by_blueprint[bp]["total"] += 1

        if dec:
            by_subject[subj]["reviewed"] += 1
            by_subject[subj]["decisions"][dec] += 1
            by_blueprint[bp]["reviewed"] += 1
            by_blueprint[bp]["decisions"][dec] += 1
            if dec == "approved":
                by_subject[subj]["approved"] += 1
                by_blueprint[bp]["approved"] += 1

        # Collect issues from notes
        note = r.get("reviewerNote", "")
        if note:
            by_blueprint[bp]["issues"].append(note[:200])

    # Common issues
    all_issues = []
    for r in reviewed:
        note = r.get("reviewerNote", "")
        if note and len(note) > 5:
            all_issues.append(note)

    issue_keywords = Counter()
    for note in all_issues:
        for kw in ["干扰项", "时代", "定义", "太长", "随机", "单位", "数值", "蓝图", "事实", "选项", "样式", "分类", "短", "重复", "一眼"]:
            if kw in note:
                issue_keywords[kw] += 1

    # Generate report
    report = f"""# Manual Audit Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 1. Overall Statistics

| Metric | Count |
|--------|-------|
| Planned sample | 100 |
| Actual sample | {total} |
| Reviewed | {len(reviewed)} |
| Not yet reviewed | {not_reviewed} |
| Approved | {decisions.get('approved', 0)} |
| Needs rewrite | {decisions.get('rewrite', 0)} |
| Weak distractors | {decisions.get('weak_distractors', 0)} |
| Questionable facts | {decisions.get('questionable_fact', 0)} |
| Wrong blueprint | {decisions.get('wrong_blueprint', 0)} |
| Low value | {decisions.get('low_value', 0)} |

## 2. By Subject

| Subject | Total | Reviewed | Approved | Pass Rate |
|---------|-------|----------|----------|-----------|
"""
    for subj in ["history", "construction", "planning", "environment"]:
        s = by_subject[subj]
        rate = f"{s['approved'] / s['reviewed'] * 100:.0f}%" if s["reviewed"] > 0 else "—"
        report += f"| {subj} | {s['total']} | {s['reviewed']} | {s['approved']} | {rate} |\n"

    report += f"""
## 3. By Blueprint

| Blueprint | Subject | Total | Reviewed | Approved | Pass Rate | Decisions | Common Issues |
|-----------|---------|-------|----------|----------|-----------|-----------|---------------|
"""
    for bp_id in sorted(by_blueprint.keys()):
        b = by_blueprint[bp_id]
        subj = "?"
        for r in results:
            if r.get("blueprintId") == bp_id:
                subj = r.get("subject", "?")
                break
        rate = f"{b['approved'] / b['reviewed'] * 100:.0f}%" if b["reviewed"] > 0 else "—"
        dec_str = ", ".join(f"{k}:{v}" for k, v in b["decisions"].most_common(3))
        issues_str = "; ".join(b["issues"][:3]) if b["issues"] else "—"
        report += f"| {bp_id} | {subj} | {b['total']} | {b['reviewed']} | {b['approved']} | {rate} | {dec_str} | {issues_str[:100]} |\n"

    report += f"""
## 4. Decision Distribution

| Decision | Count |
|----------|-------|
"""
    for dec, cnt in decisions.most_common():
        report += f"| {dec} | {cnt} |\n"

    report += f"""
## 5. Most Common Issues (from reviewer notes)

| Keyword | Mentions |
|---------|----------|
"""
    for kw, cnt in issue_keywords.most_common(15):
        report += f"| {kw} | {cnt} |\n"

    report += f"""
## 6. Rules to Adjust (derived from issues)

"""
    if issue_keywords.get("干扰项", 0) > 3:
        report += "- **干扰项策略需调整** — 多次提到干扰项不够混淆（时代太远/类型不同/一眼排除）\n"
    if issue_keywords.get("定义", 0) > 3 or issue_keywords.get("太长", 0) > 2:
        report += "- **定义压缩需加强** — 部分选项仍然过长，需进一步截断或提取关键句\n"
    if issue_keywords.get("单位", 0) > 2 or issue_keywords.get("数值", 0) > 2:
        report += "- **Planning 数值聚类需改进** — 干扰项单位不一致，需强制同单位同量级\n"
    if issue_keywords.get("分類", 0) > 2 or issue_keywords.get("分类", 0) > 2:
        report += "- **Construction 分类标签需审计** — 部分 category 为内部管理标签而非知识分类\n"
    if issue_keywords.get("蓝图", 0) > 2:
        report += "- **蓝图适配需修正** — 部分题目使用了不合适的题型蓝图\n"
    if issue_keywords.get("样式", 0) > 2:
        report += "- **样式家族邻近器需加强** — 干扰项样式与正确答案不在同一家族\n"

    report += f"""
## 7. Facts Needing Human Verification

"""
    questionable = [r for r in results if r.get("reviewDecision") == "questionable_fact"]
    if questionable:
        for r in questionable[:20]:
            report += f"- `{r['id']}` ({r.get('subject', '?')}/{r.get('blueprintId', '?')}): {r.get('reviewerNote', '(no note)')[:150]}\n"
    else:
        report += "- (No questionable facts flagged yet — run audit first)\n"

    report += f"""
## 8. Fields/Categories to Deprecate

"""
    if issue_keywords.get("分類", 0) > 2:
        report += "- **Construction `category` field**: some values are internal Notion/Anki tags, not exam-relevant knowledge categories. Audit needed.\n"
    if issue_keywords.get("数值", 0) > 2:
        report += "- **Planning `standard_value` relation**: currently mixing numeric standards with concept definitions. Needs splitting.\n"

    report += """
## 9. Next Steps

1. Apply fixes to generation rules (distractor strategies, length caps, relation splits)
2. Re-run `build-atomic-facts.py` with updated extraction rules
3. Re-run `generate-questions.py` to regenerate affected questions
4. Re-run `rescore-questions.py` for updated dual-quality scores
5. Run `build-audit-sample.py` for a fresh audit batch
"""

    out = DATA / "manual-audit-report.md"
    with open(out, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✓ {out}")


if __name__ == "__main__":
    main()
