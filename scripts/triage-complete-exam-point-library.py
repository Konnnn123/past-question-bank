"""Split the complete past-exam point library into reusable, review, and gap queues."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERIC_TERMS = {
    "図書館", "博物館", "美術館", "市場", "監獄", "大聖堂", "教会", "寺院", "建築",
    "都市", "住宅", "城", "塔", "門", "宮殿", "神社", "神宮",
}


def norm(value: str) -> str:
    return (re.sub(r"[\s・·.．,，&＆\-—―()（）\[\]【】「」『』]", "", value)
            .replace("聖堂", "教会堂")
            .translate(str.maketrans({"宮": "宫", "鳳": "凤", "凰": "凰", "浄": "净", "聖": "圣", "図": "图", "様": "样"})))


def main() -> None:
    library = json.loads((ROOT / "data/complete-past-exam-point-library.json").read_text(encoding="utf-8"))
    card_evidence = json.loads((ROOT / "data/past-exam-card-evidence.json").read_text(encoding="utf-8"))
    building_links = json.loads((ROOT / "data/building-learning-card-links.json").read_text(encoding="utf-8"))
    card_index = json.loads((ROOT / "data/learning-card-name-index.json").read_text(encoding="utf-8"))
    coverage = json.loads((ROOT / "data/past-exam-curated-coverage-checklist.json").read_text(encoding="utf-8"))
    anki = json.loads((ROOT / "data/anki-import/anki-notes.json").read_text(encoding="utf-8"))

    term_to_cards: dict[str, set[str]] = {}
    for card_id, rows in card_evidence.get("cardEvidence", {}).items():
        for row in rows:
            term = row.get("examTerm", "")
            if len(norm(term)) >= 3:
                term_to_cards.setdefault(norm(term), set()).add(card_id)
    # The curated evidence map is incomplete. Index the names of the actual
    # learning-card modules as well, including common suffix-free forms such as
    # ゴシック → ゴシック建築.
    for card in card_index.get("cards", []):
        name = card["nameJa"]
        variants = {norm(name)}
        for suffix in ("建築", "様式", "運動"):
            if name.endswith(suffix):
                variants.add(norm(name[:-len(suffix)]))
        for key in variants:
            if len(key) >= 2:
                term_to_cards.setdefault(key, set()).add(card["cardId"])
    # Orthographic variants which are deliberately not handled by punctuation
    # normalization alone.
    for term, card_id in {
        "ビザンチン": "style-byzantine",
        "ビザンティン": "style-byzantine",
        "ロマネスク": "style-romanesque",
        "ルネサンス": "style-renaissance",
        "バロック": "style-baroque",
        "大仏様": "style-daibutsuyo",
        "禅宗様": "style-zenshuyo",
        "和様": "style-wayo",
        "書院造": "style-shoin",
        "寝殿造": "style-shinden",
        "春日造": "style-kasuga",
        "流造": "style-nagare",
        "神明造": "style-shinmei",
        "大社造": "style-taisha",
    }.items():
        term_to_cards.setdefault(norm(term), set()).add(card_id)
    building_to_cards = {row["buildingId"]: row.get("learningCardIds", []) for row in building_links.get("buildings", [])}
    existing_records: dict[str, list[str]] = {}
    for row in coverage.get("rows", []):
        if row.get("coverage") == "exact" and row.get("matchedDatabaseName"):
            existing_records.setdefault(norm(row["termJa"]), []).append(row["matchedDatabaseName"])
    anki_records = []
    for record in anki.get("records", []):
        name = record.get("name", "")
        fields = record.get("fields", {})
        label = fields.get("buildingName") or name
        searchable = norm(" ".join([name, *[str(value) for value in fields.values()]]))
        exact_names = {norm(name), norm(str(fields.get("buildingName", "")))} - {""}
        anki_records.append({"label": label, "searchable": searchable, "exactNames": exact_names})

    buckets = {
        "existing-building": [], "existing-learning-card": [], "existing-database-record": [],
        "existing-database-mention": [], "name-review": [], "generic-category-term": [],
        "potential-missing-building": [], "person-reference": [], "place-context": [],
        "concept-or-keyword": [], "needs-classification": [],
    }
    rows = []
    for point in library["points"]:
        term_key = norm(point["canonicalDisplayName"])
        building_ids = point.get("matchedBuildingIds", [])
        card_ids = set(term_to_cards.get(term_key, set()))
        for bid in building_ids:
            card_ids.update(building_to_cards.get(bid, []))
        row = {
            "term": point["canonicalDisplayName"],
            "entityKind": point["entityKind"],
            "appearanceCount": point["appearanceCount"],
            "questionCount": point["questionCount"],
            "matchedBuildingIds": building_ids,
            "linkedLearningCardIds": sorted(card_ids),
            "existingDatabaseNames": sorted(set(existing_records.get(term_key, []))),
            "nameReviewCandidates": point.get("nameReviewCandidates", []),
            "rawVariants": point["rawVariants"],
        }
        exact_anki = [r["label"] for r in anki_records if term_key in r["exactNames"]]
        mention_anki = [r["label"] for r in anki_records if term_key and term_key in r["searchable"]]
        row["ankiExactRecordNames"] = sorted(set(exact_anki))
        row["ankiMentionRecordNames"] = sorted(set(mention_anki))[:12]
        if point["canonicalDisplayName"] in GENERIC_TERMS:
            status = "generic-category-term"
        elif building_ids:
            status = "existing-building"
        elif card_ids:
            status = "existing-learning-card"
        elif row["existingDatabaseNames"]:
            status = "existing-database-record"
        elif row["ankiExactRecordNames"]:
            status = "existing-database-record"
        elif row["ankiMentionRecordNames"]:
            status = "existing-database-mention"
        elif point.get("nameReviewCandidates"):
            status = "name-review"
        elif point["entityKind"] == "building":
            status = "potential-missing-building"
        elif point["entityKind"] == "person-or-title":
            status = "person-reference"
        elif point["entityKind"] == "place-or-settlement":
            status = "place-context"
        elif point["entityKind"] in {"theory-or-technology", "style-or-movement"}:
            status = "concept-or-keyword"
        else:
            status = "needs-classification"
        row["status"] = status
        buckets[status].append(row)
        rows.append(row)

    for values in buckets.values():
        values.sort(key=lambda r: (-r["appearanceCount"], r["term"]))
    output = {
        "version": 1,
        "method": "Exact building matches take priority. Similar-name suggestions remain review-only. Exact term-to-card links are derived from existing curated card evidence; all remaining points require classification or a new card/entity.",
        "stats": {key: len(value) for key, value in buckets.items()},
        "buckets": buckets,
        "rows": rows,
    }
    (ROOT / "data/complete-past-exam-point-triage.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# 完整过去问考点库：资料库分流",
        "",
        f"- 已有建筑（精确名称匹配）：{len(buckets['existing-building'])}",
        f"- 已有学习卡（精确术语匹配）：{len(buckets['existing-learning-card'])}",
        f"- 已有资料库记录（Anki／规范化资料）：{len(buckets['existing-database-record'])}",
        f"- 已在资料库正文出现（可补链接，不必新建）：{len(buckets['existing-database-mention'])}",
        f"- 待名称复核（只给建议，不自动合并）：{len(buckets['name-review'])}",
        f"- 泛用类别词（不作为新增实体）：{len(buckets['generic-category-term'])}",
        f"- 可能缺少的建筑实体：{len(buckets['potential-missing-building'])}",
        f"- 人物参照项（不等于要新建卡）：{len(buckets['person-reference'])}",
        f"- 地点／聚落语境项：{len(buckets['place-context'])}",
        f"- 概念／构法关键词：{len(buckets['concept-or-keyword'])}",
        f"- 仍需判别类别：{len(buckets['needs-classification'])}",
        "",
        "## 待名称复核",
        "",
        "| 考点 | 次数 | 建议匹配 | 相似度 |",
        "|---|---:|---|---:|",
    ]
    for row in buckets["name-review"]:
        best = row["nameReviewCandidates"][0]
        lines.append(f"| {row['term']} | {row['appearanceCount']} | {best['matchedAlias']} | {best['score']:.3f} |")
    lines.extend(["", "## 泛用类别词（不新增为独立实体）", "", "| 词语 | 次数 | 当前处理 |", "|---|---:|---|"])
    for row in buckets["generic-category-term"]:
        lines.append(f"| {row['term']} | {row['appearanceCount']} | 作为类型／关系线索保留 |")
    lines.extend(["", "## 已有资料库记录（尚未单独接入学习卡）", "", "| 考点 | 次数 | 现有资料库名称 |", "|---|---:|---|"])
    for row in buckets["existing-database-record"]:
        names = row["existingDatabaseNames"] or row["ankiExactRecordNames"]
        lines.append(f"| {row['term']} | {row['appearanceCount']} | {', '.join(names)} |")
    lines.extend(["", "## 已在资料库正文出现（可补链接，不必新建）", "", "| 考点 | 次数 | 出现于现有记录 |", "|---|---:|---|"])
    for row in buckets["existing-database-mention"]:
        lines.append(f"| {row['term']} | {row['appearanceCount']} | {', '.join(row['ankiMentionRecordNames'][:4])} |")
    section_specs = [
        ("potential-missing-building", "可能缺少的建筑实体（候选，仍需核对）"),
        ("person-reference", "人物参照项（先连接现有建筑／样式；不自动新增卡）"),
        ("place-context", "地点／聚落语境项（先作为地点标签或关系）"),
        ("concept-or-keyword", "概念／构法关键词（先连接现有卡；仅高频且无归属时再考虑新卡）"),
        ("needs-classification", "尚需人工判别的考点"),
    ]
    for bucket, title in section_specs:
        lines.extend(["", f"## {title}", "", "| 考点 | 推定类别 | 次数 |", "|---|---|---:|"])
        for row in buckets[bucket]:
            lines.append(f"| {row['term']} | {row['entityKind']} | {row['appearanceCount']} |")
    (ROOT / "data/complete-past-exam-point-triage.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(output["stats"])


if __name__ == "__main__":
    main()
