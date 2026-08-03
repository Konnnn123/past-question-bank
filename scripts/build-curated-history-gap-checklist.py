from __future__ import annotations

import collections
import json
import re
from pathlib import Path


EXCLUDE = {
    "建築史", "建築家", "建築作品", "建築物", "日本建築", "西洋建築", "近代建築", "近現代建築",
    "中世建築", "歴史的建造物", "建築事例", "建築群", "様式", "時代区分", "建築の年代",
    "歴史的変化", "建築群の比較", "建築コンセプト", "建築解釈", "空間構成", "断面計画",
    "建築構築", "構造体系", "建築史比較", "意匠と構造", "デザイン", "キーワード", "コンセプト",
    "イタリア", "フランス", "ドイツ", "日本", "西洋", "東洋", "ヨーロッパ", "画像", "図版",
    "建築作品識別", "建築史用語", "建築概念", "建築構成要素", "建築設計者", "日本仏教建築",
    "近代建築， 建築家， 建築样式， 構造システム", "鎌倉期建築", "古代都城", "国際憲章",
}
BUILDING_WORDS = ("寺", "神社", "神宮", "本堂", "金堂", "仏殿", "舎利殿", "浄土堂", "鳳凰堂", "大聖堂", "聖堂", "教会", "修道院", "宮殿", "殿", "邸", "住宅", "図書館", "博物館", "美術館", "劇場", "駅", "会館", "工場", "塔", "門", "城", "パルテノン", "パンテオン", "テンピエット", "カサ・ミラ", "アンコール・ワット", "ハギア・ソフィア", "アヤ・ソフィア")
STYLE_WORDS = ("様", "様式", "建築", "主義", "運動", "モダニズム", "メタボリズム", "ゴシック", "バロック", "ロマネスク", "ルネサンス", "アール・ヌーヴォー", "アール・デコ", "バウハウス")
THEORY_WORDS = ("憲章", "制度", "保存", "修復", "活用", "オーセンティシティ", "リユース", "原則", "オーダー", "ペンデンティブ", "コンクリート", "混構造", "条坊制", "パターン・ランゲージ", "スポリア")
URBAN_WORDS = ("都市", "町", "近隣住区", "田園都市", "ラドバーン", "都城")
PERSON_TERMS = {
    "アンリ・ラブルースト", "フランチェスコ・ボッロミーニ", "ドメニコ・フォンターナ", "ブルーノ・タウト",
    "ジョセフ・パクストン", "アドルフ・ロース", "アントニオ・サンテリア", "ジャコモ・バロッツィ・ダ・ヴィニョーラ",
    "マルク・アントワーヌ・ロージエ", "後藤慶二", "山田守", "ジャイルズ・ギルバート・スコット",
    "オットー・ワーグナー", "藤井厚二", "ヴァルター・グロピウス", "ジャック・ジェルメン・スフロ",
    "シャルルマーニュ", "織田有楽", "ヨハン・ヨアヒム・ヴィンケルマン", "佐野利器", "ゴットフリート・ゼンパー",
    "レオン・バッティスタ・アルベルティ", "ジョン・ラスキン", "ミケランジェロ・ブオナローティ", "アナトール・ド・ボド",
    "丹下健三", "足利義満", "菊竹清訓", "辰野金吾", "聖徳太子", "田中角栄", "内田祥三", "芦原義信",
    "ルイス・カーン", "ジョン・ソーン", "ヨン・ウッツオン", "シンケル", "シナン", "シュジェール", "重源", "空海",
    "足利義政", "藤原道長", "ブラマンテ", "パラーディオ", "栄西", "フランク・ロイド・ライト", "ル・コルビュジエ",
    "フィリッポ・ブルネレスキ", "イニゴ・ジョーンズ", "ハドリアヌス帝", "千利休", "フランツ・ヨーゼフ",
}


def clean(term: str) -> str:
    term = re.sub(r"（[^）]*）|\([^)]*\)", "", term)
    return term.strip(" #*、。・:：／/0123456789.-")


def kind(term: str) -> str | None:
    if term in EXCLUDE or len(term) < 2:
        return None
    if term in PERSON_TERMS:
        return "person"
    if any(word in term for word in URBAN_WORDS):
        return "urban-or-settlement"
    if any(word in term for word in THEORY_WORDS):
        return "theory-or-institution"
    if any(word in term for word in BUILDING_WORDS):
        return "building"
    if any(word in term for word in STYLE_WORDS):
        return "style-or-movement"
    return None


def main() -> None:
    question_files = [p for p in Path("data/processed_questions").glob("*.md") if "建筑史" in p.name or "建築史" in p.name]
    question_text = {p.name: p.read_text(encoding="utf-8") for p in question_files}
    knowledge = Path("data/建築史_知識地図.md").read_text(encoding="utf-8")
    curation = json.loads(Path("data/past-exam-curation-index.json").read_text(encoding="utf-8"))
    staging = json.loads(Path("data/anki-import/anki-notes.json").read_text(encoding="utf-8"))
    aliases = json.loads(Path("data/past-exam-coverage-aliases.json").read_text(encoding="utf-8"))

    anki_text = "\n".join(" ".join([r.get("name", ""), *r["fields"].values()]) for r in staging["records"])
    topic_text = Path("src/lib/history-topics.ts").read_text(encoding="utf-8")
    database_text = anki_text + "\n" + topic_text

    raw_terms = set(re.findall(r"\*\*([^*]+)\*\*", knowledge))
    raw_terms.update(PERSON_TERMS)
    for question in curation["questions"]:
        raw_terms.update(question["tags"])

    rows = []
    for raw in raw_terms:
        term = clean(raw)
        entity_kind = kind(term)
        if not entity_kind:
            continue
        evidence = [name for name, text in question_text.items() if term in text]
        if not evidence:
            continue
        if term in database_text:
            coverage, matched = "exact", term
        elif term in aliases and aliases[term] in database_text:
            coverage, matched = "alias", aliases[term]
        else:
            coverage, matched = "missing", ""
        rows.append({
            "termJa": term,
            "entityKind": entity_kind,
            "coverage": coverage,
            "matchedDatabaseName": matched,
            "examFileCount": len(evidence),
            "examFiles": sorted(evidence),
            "reviewStatus": "confirmed-source-term",
            "suggestedAction": "review-and-add" if coverage == "missing" else "add-alias" if coverage == "alias" else "none",
        })
    unique = {row["termJa"]: row for row in rows}
    rows = sorted(unique.values(), key=lambda r: ({"missing": 0, "alias": 1, "exact": 2}[r["coverage"]], -r["examFileCount"], r["termJa"]))
    result = {"version": 1, "scope": "40 processed architecture-history questions", "rows": rows}
    Path("data/past-exam-curated-coverage-checklist.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    gaps = [r for r in rows if r["coverage"] == "missing"]
    lines = [
        "# 建筑史过去问人工语义清理版缺口清单",
        "",
        "来源：40份 processed_questions、逐题标签与明确语群／选项、既有建筑史知识地图。已排除国家、课程范围、普通说明词和截断词。",
        "",
        f"- 有效知识实体：{len(rows)}",
        f"- 资料库已有：{sum(r['coverage']=='exact' for r in rows)}",
        f"- 别名覆盖：{sum(r['coverage']=='alias' for r in rows)}",
        f"- 待补缺口：{len(gaps)}",
        "",
        "## 待补缺口",
        "",
        "| 实体 | 类型 | 出现题目数 |",
        "|---|---|---:|",
    ]
    lines.extend(f"| {r['termJa']} | {r['entityKind']} | {r['examFileCount']} |" for r in gaps)
    lines += ["", "完整覆盖项、别名和题目文件出处见 JSON。", ""]
    Path("data/past-exam-curated-coverage-checklist.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
