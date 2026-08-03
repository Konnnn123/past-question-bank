#!/usr/bin/env python3
"""Scan ALL past exam files to extract real question formats per subject per year."""
import json, re, sys, io
from pathlib import Path
from collections import defaultdict, Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = Path(__file__).parent.parent
PROCESSED = BASE / "data" / "processed_questions"

# Format detectors
def detect_formats(content, fname):
    """Detect question formats used in this exam file."""
    formats = set()
    subject = ""
    if "建筑史" in fname: subject = "history"
    elif "建筑构法" in fname: subject = "construction"
    elif "建筑环境" in fname: subject = "environment"
    elif "建筑计划" in fname: subject = "planning"
    else: return [], "unknown", 0, "?"

    # Extract year, tier
    ym = re.search(r'(\d{4})', fname)
    year = int(ym.group(1)) if ym else 0
    tier = "専門2-2" if "2-2" in fname else "専門1"

    # 1. Word bank / 語群 matching
    if re.search(r'[語语]群\s*[ABAB]|Group\s*[AB]', content):
        formats.add("word_bank_matching")
        # Count terms in word banks
        groups = re.findall(r'[語语]群\s*([ABAB])', content)
        for g in groups:
            formats.add(f"word_bank_{g}")

    # 2. Image identification (写真→名称)
    imgs = re.findall(r'!\[.*?\]\(|Fig\.\s*\d|<img\b|写真|図\d', content, re.I)
    if len(imgs) >= 3:
        formats.add("image_identification")

    # 3. Fill-blank (空欄→語群)
    blanks = re.findall(r'[（(]\s*[A-Ta-t]\s*[）)]|空欄|穴埋', content)
    if len(blanks) >= 3:
        formats.add("fill_blank")

    # 4. Inline numeric options (数値選択)
    inline = re.findall(r'[（(]\s*\d[\d,，、\s]*\d\s*[）)]', content)
    if len(inline) >= 3:
        formats.add("inline_numeric_select")

    # 5. Formula completion (公式→物理量名+指数)
    if re.search(r'[=＝].*[XYxy]|指数|べき', content):
        formats.add("formula_completion")

    # 6. Numerical calculation (数値計算)
    if re.search(r'求め|計算|算出|値|いくら', content):
        formats.add("numerical_calculation")

    # 7. 論述 / essay (説明/図示)
    if re.search(r'説明|述べ|論じ|図示|描[きか]|スケッチ|模式図|作図', content):
        formats.add("essay")
    if re.search(r'図示|描[きか]|スケッチ|作図|平面図|断面図', content):
        formats.add("diagram")

    # 8. 建築→人物/様式 pairing
    if re.search(r'[①②③④⑤⑥⑦⑧⑨⑩]{1,2}\s*\S', content) and subject == "history":
        formats.add("building_pairing")

    # 9. ○× / true-false
    if re.search(r'[○×]|正し|誤り|適切|不適切|正誤', content):
        if re.search(r'選び|選べ|一つ|1つ|１つ', content):
            formats.add("correct_statement_select")  # "选出正确的一项"

    # 10. 計算 + 選択
    if re.search(r'求め|計算', content) and re.search(r'選び|選べ', content):
        formats.add("calculation_select")

    # 11. 組み合わせ / combination
    if re.search(r'組合せ|組み合わせ|対応', content):
        formats.add("combination")

    # 12. 用語説明 / term explanation
    if re.search(r'次の用語|説明しなさい|とは|について', content) and tier == "専門2-2":
        formats.add("term_explanation")

    # 13. 設計/プロセス説明
    if re.search(r'設計|計画|プロセス|工程|手順|方法', content) and tier == "専門2-2":
        formats.add("design_process")

    # 14. Short answer / 簡答
    if re.search(r'答え|名称|誰|何|いつ|どこ', content) and not re.search(r'選び|選べ', content):
        formats.add("short_answer")

    # 15. 自由記述枠
    if re.search(r'行[以内程度]|字[以内程度]|字数|文字数', content):
        formats.add("free_response_limited")

    return sorted(formats), subject, year, tier


def main():
    print("=" * 70)
    print("All Past Exam Format Scanner")
    print("=" * 70)

    files = sorted(PROCESSED.glob("*.md"))
    print(f"\nScanning {len(files)} files...")

    # Aggregate by (subject, tier)
    all_formats = defaultdict(lambda: defaultdict(Counter))
    by_year = defaultdict(lambda: defaultdict(set))
    subject_files = defaultdict(list)

    for fp in files:
        with open(fp, "r", encoding="utf-8") as f:
            content = f.read()
        formats, subject, year, tier = detect_formats(content, fp.name)
        if not subject: continue

        for fmt in formats:
            all_formats[subject][tier][fmt] += 1
            by_year[subject][year].add(fmt)
        subject_files[subject].append(fp.name)

    # Print per-subject analysis
    for subj in ["history", "construction", "environment", "planning"]:
        print(f"\n{'='*50}")
        print(f"  {subj} ({len(subject_files[subj])} files)")
        print(f"{'='*50}")

        for tier in ["専門1", "専門2-2"]:
            fmts = all_formats[subj][tier]
            if not fmts: continue
            print(f"\n  [{tier}]")
            for fmt, cnt in fmts.most_common():
                bar = "█" * cnt
                print(f"    {fmt:<30} {bar} {cnt}")

        # Year-by-year format evolution
        print(f"\n  Year-by-year formats:")
        for yr in sorted(by_year[subj].keys()):
            fmts = ", ".join(sorted(by_year[subj][yr])[:6])
            print(f"    {yr}: {fmts}")

    # Summary
    print(f"\n{'='*70}")
    print("GLOBAL SUMMARY")
    print(f"{'='*70}")
    global_fmts = Counter()
    for subj in all_formats:
        for tier in all_formats[subj]:
            for fmt, cnt in all_formats[subj][tier].items():
                global_fmts[fmt] += cnt
    for fmt, cnt in global_fmts.most_common():
        print(f"  {fmt:<30} {cnt}")

if __name__ == "__main__":
    main()
