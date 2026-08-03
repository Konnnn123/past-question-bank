"""Build a traceable, complete architecture-history exam-point library.

Unlike the earlier regex candidate list, this reads every item printed in a
word bank.  Each raw spelling is retained and independently matched against
the current building database, so name normalization is reviewable.
"""
from __future__ import annotations

import collections
import difflib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS = ROOT / "data" / "processed_questions"
ARCH = ROOT / "data" / "architecture-normalized-candidates.json"
OUT = ROOT / "data" / "complete-past-exam-point-library.json"
REPORT = ROOT / "data" / "complete-past-exam-point-library.md"
OVERRIDES = ROOT / "data" / "past-exam-term-overrides.json"

GROUP_HEADING = re.compile(r"(?mi)^#{1,6}\s*(?:\[?\s*)?(?:語群|用語群|Group)\s*[A-ZＡ-ＺⅠⅡⅢⅣ0-9０-９]*[^\n]*$")
# A marker must begin a line or follow a list delimiter.  This prevents the
# final 'e）' in an English translation from being misread as item 'e'.
ITEM_MARKER = re.compile(r"(?<![^\s、,，;；])(?:[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚]|[a-zA-Z][.)．]|\(?[0-9]{1,2}[)）.．])\s*")
ANY_HEADING = re.compile(r"(?m)^#{1,6}\s+")

MANUAL_BUILDING_ALIASES = {
    "ハギア・ソフィア": "building-ad7b5b62435c",
    "アヤ・ソフィア": "building-ad7b5b62435c",
    "パンテオン（サント＝ジュヌヴィエーヴ聖堂）": "building-35a018aea663",
    "パンテオン（パリ）": "building-35a018aea663",
    "ラウレンツィアーナ図書館": "building-74a48dc75410",
    "ファグス靴工場": "building-e005da0846ca",
    "宇治上神社本殿": "building-0f467f59d5ea",
}


def norm(value: str) -> str:
    return re.sub(r"[\s・·.．,，&＆\-—―()（）\[\]【】「」『』]", "", value).replace("聖堂", "教会堂")


def frontmatter(text: str, key: str) -> str:
    match = re.search(rf"^{re.escape(key)}:\s*[\"']?([^\"'\n]+)", text, re.M)
    return match.group(1).strip() if match else ""


def clean_item(value: str) -> str:
    value = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", value)
    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\[WWWC\]", "", value)
    value = re.sub(r"\s+", " ", value).strip(" 、,，;；:：|・.．")
    return value


def display_name(raw: str) -> str:
    # Remove parenthetical Latin translations but preserve Japanese qualifiers
    # such as パンテオン（パリ） that disambiguate an entity.
    return re.sub(r"\s*[（(][A-Za-zÀ-ÿ0-9 ,.'’\-＝=・]+[）)]", "", raw).strip()


def split_items(block: str) -> list[str]:
    block = re.sub(r"<table[\s\S]*?</table>", "", block, flags=re.I)
    # OCR sometimes drops the dot in a numbered list, e.g. `1ヴィラ・マダマ`.
    block = re.sub(r"(?m)^(\s*)([0-9]{1,2})(?![.)．])\s*", r"\1\2. ", block)
    matches = list(ITEM_MARKER.finditer(block))
    if not matches:
        return []
    items = []
    for i, marker in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(block)
        item = clean_item(block[marker.end():end])
        # A word bank ends before figures/another question even when OCR did not
        # produce a heading for it.
        item = re.split(r"(?:\n|\s)(?:Fig\.?|図|图)\s*\d+|\n\s*【問題", item, maxsplit=1, flags=re.I)[0].strip()
        if (2 <= len(item) <= 180 and
                not re.search(r"以下|選び|解答例|各図|同じ語|問題|^Fig\.?|^[0-9]+\s*世紀$", item, re.I)):
            items.append(item)
    return items


def classify(name: str, building_id: str | None) -> str:
    if building_id:
        return "building"
    if any(x in name for x in ("大聖堂", "聖堂", "教会", "寺", "神社", "神宮", "堂", "殿", "邸", "住宅", "館", "塔", "門", "宮殿", "図書館", "博物館", "美術館", "工場", "城", "修道院", "ワット", "シャペル", "ロトンダ", "マダマ", "ヴィターレ", "ノヴェッラ", "ミラ", "サピエンツァ")):
        return "building"
    if any(x in name for x in ("様式", "主義", "運動", "ゴシック", "バロック", "ロココ", "ロマネスク", "ビザンチン", "ルネサンス", "和様", "禅宗様", "大仏様", "神明造", "春日造", "流造")):
        return "style-or-movement"
    if any(x in name for x in ("論", "規則", "要素", "憲章", "原則", "オーダー", "構法", "構造", "ペンデンティブ", "ゾーニング", "トラス", "フライング・バットレス", "トリフォリウム", "アトリウム", "スポリア")):
        return "theory-or-technology"
    if any(x in name for x in ("町", "都市", "京", "ローマ", "エジプト", "ウィーン", "ケルン", "エルサレム", "イスタンブール", "アテネ")):
        return "place-or-settlement"
    if "・" in name or "＝" in name:
        return "person-or-title"
    return "needs-classification"


def main() -> None:
    architecture = json.loads(ARCH.read_text(encoding="utf-8"))
    overrides = json.loads(OVERRIDES.read_text(encoding="utf-8")) if OVERRIDES.exists() else {}
    aliases: dict[str, str] = {}
    alias_candidates: list[tuple[str, str, str]] = []
    for building in architecture["buildings"]:
        for name in [building["name"]["ja"], *building.get("aliases", [])]:
            if len(norm(name)) >= 3:
                aliases[norm(name)] = building["id"]
                alias_candidates.append((norm(name), building["id"], name))
    old_map_path = ROOT / "data" / "old-building-name-map.json"
    if old_map_path.exists():
        for name, row in json.loads(old_map_path.read_text(encoding="utf-8")).items():
            aliases[norm(name)] = row["buildingId"]
            alias_candidates.append((norm(name), row["buildingId"], name))

    occurrences = []
    file_contexts = []
    scanned_files = []
    for path in sorted(QUESTIONS.glob("*.md")):
        if "建筑史" not in path.name and "建築史" not in path.name:
            continue
        text = path.read_text(encoding="utf-8")
        scanned_files.append(path.name)
        year = int(frontmatter(text, "year") or path.name[:4])
        category = frontmatter(text, "category")
        question_number = frontmatter(text, "question_number")
        file_contexts.append({"text": text, "path": path.name, "year": year, "category": category, "questionNumber": question_number})
        headings = list(GROUP_HEADING.finditer(text))
        all_headings = list(ANY_HEADING.finditer(text))
        for heading in headings:
            next_heading = next((h for h in all_headings if h.start() > heading.start()), None)
            end = next_heading.start() if next_heading else len(text)
            for raw in split_items(text[heading.end():end]):
                display = display_name(raw)
                key = norm(display)
                building_id = (overrides.get("confirmedBuildingMatches", {}).get(display)
                               or MANUAL_BUILDING_ALIASES.get(display)
                               or aliases.get(key))
                kind = overrides.get("classificationOverrides", {}).get(display) or classify(display, building_id)
                occurrences.append({
                    "year": year,
                    "category": category,
                    "questionNumber": question_number,
                    "fileName": path.name,
                    "sourceType": "word-bank",
                    "wordBank": heading.group(0).lstrip("#").strip(),
                    "rawTerm": raw,
                    "displayName": display,
                    "normalizedKey": key,
                    "matchedBuildingId": building_id,
                    "matchStatus": "matched-building" if building_id else "unmatched",
                    "entityKind": kind,
                })

    # Add direct mentions in 専門Ⅱ-2 after masking word-bank sections.  The
    # controlled vocabulary is built from every word-bank item plus every
    # current building name, which keeps the text scan reviewable and avoids
    # inventing entities from broad OCR regexes.
    vocabulary: dict[str, tuple[str, str | None]] = {}
    for row in occurrences:
        if len(row["displayName"]) >= 3:
            vocabulary.setdefault(row["displayName"], (row["entityKind"], row["matchedBuildingId"]))
    for building in architecture["buildings"]:
        name = building["name"]["ja"]
        if len(name) >= 3:
            vocabulary.setdefault(name, ("building", building["id"]))

    for context in file_contexts:
        if context["category"] != "専門2-2":
            continue
        masked = context["text"]
        group_starts = list(GROUP_HEADING.finditer(masked))
        all_headings = list(ANY_HEADING.finditer(masked))
        spans = []
        for heading in group_starts:
            next_heading = next((h for h in all_headings if h.start() > heading.start()), None)
            spans.append((heading.start(), next_heading.start() if next_heading else len(masked)))
        for start, end in reversed(spans):
            masked = masked[:start] + (" " * (end - start)) + masked[end:]
        for name, (kind, building_id) in vocabulary.items():
            if name in masked:
                occurrences.append({
                    "year": context["year"],
                    "category": context["category"],
                    "questionNumber": context["questionNumber"],
                    "fileName": context["path"],
                    "sourceType": "direct-text",
                    "wordBank": "",
                    "rawTerm": name,
                    "displayName": name,
                    "normalizedKey": norm(name),
                    "matchedBuildingId": building_id,
                    "matchStatus": "matched-building" if building_id else "unmatched",
                    "entityKind": kind,
                })

    grouped: dict[str, list[dict]] = collections.defaultdict(list)
    for row in occurrences:
        grouped[row["normalizedKey"]].append(row)
    points = []
    for key, rows in grouped.items():
        first = rows[0]
        variants = sorted({row["rawTerm"] for row in rows})
        building_ids = sorted({row["matchedBuildingId"] for row in rows if row["matchedBuildingId"]})
        review_candidates = []
        if (not building_ids and first["displayName"] not in overrides.get("rejectedFuzzyMatches", {})
                and len(key) >= 4 and first["entityKind"] in {"building", "needs-classification", "person-or-title"}):
            scored = []
            for alias_key, building_id, alias in alias_candidates:
                score = difflib.SequenceMatcher(None, key, alias_key).ratio()
                if score >= 0.64:
                    scored.append((score, building_id, alias))
            seen = set()
            for score, building_id, alias in sorted(scored, reverse=True)[:10]:
                if building_id in seen:
                    continue
                seen.add(building_id)
                review_candidates.append({"buildingId": building_id, "matchedAlias": alias, "score": round(score, 3)})
                if len(review_candidates) == 3:
                    break
        points.append({
            "normalizedKey": key,
            "canonicalDisplayName": first["displayName"],
            "rawVariants": variants,
            "entityKind": overrides.get("classificationOverrides", {}).get(first["displayName"], first["entityKind"]),
            "matchedBuildingIds": building_ids,
            "matchStatus": "matched-building" if building_ids else ("possible-alias-match" if review_candidates else "needs-name-review"),
            "nameReviewCandidates": review_candidates,
            "appearanceCount": len(rows),
            "questionCount": len({(r["year"], r["category"], r["questionNumber"]) for r in rows}),
            "sources": [{k: r[k] for k in ("year", "category", "questionNumber", "fileName", "sourceType", "wordBank", "rawTerm")} for r in rows],
        })
    points.sort(key=lambda row: (-row["appearanceCount"], row["canonicalDisplayName"]))

    output = {
        "version": 1,
        "method": "Every enumerated item in architecture-history word banks is retained; building matching uses normalized names, existing aliases, old-name mappings, and documented manual aliases.",
        "stats": {
            "questionFilesScanned": len(scanned_files),
            "totalEvidenceOccurrences": len(occurrences),
            "wordBankItems": sum(r["sourceType"] == "word-bank" for r in occurrences),
            "directTextMentionsInSpecialty2_2": sum(r["sourceType"] == "direct-text" for r in occurrences),
            "uniqueNormalizedPoints": len(points),
            "matchedBuildingPoints": sum(bool(p["matchedBuildingIds"]) for p in points),
            "needsNameReview": sum(not p["matchedBuildingIds"] for p in points),
            "possibleAliasMatches": sum(p["matchStatus"] == "possible-alias-match" for p in points),
        },
        "points": points,
    }
    OUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# 完整建筑史过去问考点库（语群）",
        "",
        f"- 扫描建筑史题目：{output['stats']['questionFilesScanned']} 份",
        f"- 语群原始条目：{output['stats']['wordBankItems']} 条",
        f"- 专门Ⅱ-2正文同名提及：{output['stats']['directTextMentionsInSpecialty2_2']} 条",
        f"- 规范化后考点：{output['stats']['uniqueNormalizedPoints']} 个",
        f"- 已匹配现有建筑库：{output['stats']['matchedBuildingPoints']} 个",
        f"- 待名称／类别复核：{output['stats']['needsNameReview']} 个",
        f"- 其中有名称近似匹配建议：{output['stats']['possibleAliasMatches']} 个",
        "",
        "每个原文写法、来源年份、语群、别名匹配结果及近似名称建议都保存在 JSON；近似建议不自动合并，须人工复核。未匹配不代表资料库缺失，也可能是人名、样式、理论、地点或名称写法尚未复核。",
        "",
        "## 高频考点（前 80）",
        "",
        "| 考点 | 类别 | 次数 | 建筑匹配 |",
        "|---|---|---:|---|",
    ]
    for point in points[:80]:
        matched = ", ".join(point["matchedBuildingIds"]) or "待复核"
        lines.append(f"| {point['canonicalDisplayName']} | {point['entityKind']} | {point['appearanceCount']} | {matched} |")
    lines.extend([
        "",
        "## 名称复核建议（不自动合并）",
        "",
        "| 过去问原文 | 可能对应的现有建筑别名 | 相似度 |",
        "|---|---|---:|",
    ])
    for point in points:
        if not point["nameReviewCandidates"]:
            continue
        best = point["nameReviewCandidates"][0]
        if best["score"] >= 0.8:
            lines.append(f"| {point['canonicalDisplayName']} | {best['matchedAlias']} | {best['score']:.3f} |")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(output["stats"])


if __name__ == "__main__":
    main()
