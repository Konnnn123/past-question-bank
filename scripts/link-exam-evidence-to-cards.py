"""
Link curated past-exam evidence to learning cards.
Reads the curated coverage checklist and maps exam terms to card IDs.
"""
from __future__ import annotations
import json, re
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent

# ---- Manual mapping: exam term → card ID ----
# These are exam terms that match existing cards by name or alias
TERM_TO_CARD = {
    # People with existing architect cards
    "パラーディオ": "architect-andrea-palladio",
    "アドルフ・ロース": "architect-adolf-loos",
    "藤井厚二": "architect-koji-fujii",
    "アントニオ・サンテリア": "movement-constructivism",  # Futurist architect, linked to constructivism
    "ジョン・ラスキン": "movement-arts-crafts",  # Key theorist for Arts & Crafts
    "シナン": "style-byzantine",  # Ottoman architect, linked to Byzantine tradition
    "シャルルマーニュ": "style-carolingian",  # Carolingian renaissance
    "シュジェール": "style-gothic",  # Abbot Suger, father of Gothic
    "シンケル": "style-neoclassical",  # Karl Friedrich Schinkel
    "ヨン・ウッツオン": "style-expressionism",  # Sydney Opera House
    "栄西": "style-zenshuyo",  # Brought Zen and Song architecture
    "空海": "style-wayo",  # Brought esoteric Buddhism, influenced temple architecture
    "重源": "style-daibutsuyo",  # Already referenced in daibutsuyo card
    "芦原義信": "movement-metabolism",  # Japanese architect, urban theorist
    "田中角栄": "movement-metabolism",  # PM during Japan's urban boom, linked to metabolism era
    "聖徳太子": "style-asuka",  # Promoted Buddhism and temple building

    # Concepts/theory → existing cards
    "ローマン・コンクリート": "style-roman",  # Roman concrete
    "鉄とレンガの混構造": "style-industrial-iron-glass",  # Already covered
    "鉄と石の混構造": "style-industrial-iron-glass",  # Already covered

    # Buildings → existing style cards
    "サン・ドニ修道院": "style-gothic",  # First Gothic building
    "サン・ドニ修道院教会": "style-gothic",
    "トウーゲントハット邸": "movement-modernism",  # Mies van der Rohe
    "ラウレンツィアーナ図書館": "style-mannerism",  # Michelangelo
    "ランス大聖堂": "style-gothic",
    "ル・ランシーのノートル＝ダム聖堂": "movement-modernism",  # Perret, reinforced concrete
    "伊勢神宮内宮正殿": "style-shinmei",  # 唯一神明造
    "東京カテドラル聖マリア大聖堂": "movement-modernism",  # Tange Kenzo
    "山梨文化会館": "movement-metabolism",  # Tange Kenzo, metabolist
    "園城寺客殿": "style-shoin",  # Shoin-zukuri example
    "東三条殿": "style-shinden",  # Prime shinden-zukuri example
    "吉島家住宅": "type-minka",  # Traditional town house
    "二条城二の丸御殿": "style-shoin",  # Already in DB
    "慈照寺東求堂": "style-shoin",  # Already in DB

    # Alias matches
    "保存修復": "style-historicism",  # Architectural conservation → historicism (19th c. restoration movement)
    "建築保存": "style-historicism",  # Same as above
    "近代建築の5原則": "movement-modernism",  # Le Corbusier's 5 points → modernism

    # Additional building matches
    "ラウレンツィアーナ図書館": "style-mannerism",  # Michelangelo
    "ファグス靴工場": "movement-modernism",  # Gropius
    "ケルン大聖堂": "style-gothic",
    "ノートル＝ダム大聖堂": "style-gothic",
    "東大寺南大門": "style-daibutsuyo",
    "浄土寺浄土堂": "style-daibutsuyo",
    "室生寺金堂": "style-wayo",
    "平等院鳳凰堂": "style-wayo",
    "宇治上神社本殿": "style-nagare",
    "長弓寺本堂": "style-wayo",
    "ラウレンツィアーナ図書館": "style-mannerism",  # Michelangelo
    "寺内町": "type-jinaicho",
}

# ---- Manual mapping: people → new architect reference (no full card yet) ----
# These will get a minimal reference entry
PERSON_REFERENCES = {
    "フランツ・ヨーゼフ": {"ja": "フランツ・ヨーゼフ1世", "zh": "弗朗茨·约瑟夫一世",
                          "note_ja": "オーストリア皇帝。ウィーン環状道路建設を推進し、歴史主義建築の大規模都市計画を実現した。",
                          "note_zh": "奥地利皇帝。推动维也纳环城大道建设，实现了历史主义建筑的大规模城市规划。"},
    "ジョン・ソーン": {"ja": "ジョン・ソーン", "zh": "约翰·索恩",
                     "note_ja": "イギリスの新古典主義建築家。イングランド銀行や自邸（ソーン美術館）で知られる。",
                     "note_zh": "英国新古典主义建筑师。以英格兰银行和自宅（索恩美术馆）闻名。"},
    "アナトール・ド・ボド": {"ja": "アナトール・ド・ボド", "zh": "阿纳托尔·德·博多",
                            "note_ja": "フランスの建築家。鉄筋コンクリート教会サン・ジャン・ド・モンマルトルを設計。",
                            "note_zh": "法国建筑师。设计了钢筋混凝土教堂圣让德蒙马特。"},
    "ジャイルズ・ギルバート・スコット": {"ja": "ジャイルズ・ギルバート・スコット", "zh": "贾尔斯·吉尔伯特·斯科特",
                                        "note_ja": "イギリスの建築家。リヴァプール大聖堂やバタシー発電所の設計で知られるゴシック・リヴァイヴァル建築家。",
                                        "note_zh": "英国建筑师。以利物浦大教堂和巴特西发电站设计闻名的哥特复兴建筑师。"},
    "ジャコモ・バロッツィ・ダ・ヴィニョーラ": {"ja": "ジャコモ・バロッツィ・ダ・ヴィニョーラ", "zh": "贾科莫·巴罗齐·达·维尼奥拉",
                                              "note_ja": "イタリアのマニエリスム建築家。イル・ジェズ教会を設計し、『建築の五オーダー』を著した。",
                                              "note_zh": "意大利手法主义建筑师。设计了耶稣教堂，著有《建筑的五种柱式》。"},
    "ジャック・ジェルメン・スフロ": {"ja": "ジャック・ジェルメン・スフロ", "zh": "雅克·热尔曼·苏夫洛",
                                    "note_ja": "フランスの新古典主義建築家。パリのパンテオン（サント・ジュヌヴィエーヴ教会）を設計。",
                                    "note_zh": "法国新古典主义建筑师。设计了巴黎先贤祠（圣热纳维耶芙教堂）。"},
    "ドメニコ・フォンターナ": {"ja": "ドメニコ・フォンターナ", "zh": "多梅尼科·丰塔纳",
                              "note_ja": "イタリアのバロック建築家。シクストゥス5世のもとローマ都市計画を推進。",
                              "note_zh": "意大利巴洛克建筑师。在西克斯图斯五世治下推进罗马城市规划。"},
    "マルク・アントワーヌ・ロージエ": {"ja": "マルク・アントワーヌ・ロージエ", "zh": "马克·安托万·洛吉耶",
                                      "note_ja": "フランスの建築理論家。『建築試論』で原始の小屋を建築の本質とし、新古典主義の理論的基礎を築いた。",
                                      "note_zh": "法国建筑理论家。在《建筑试论》中以原始小屋为建筑本质，奠定了新古典主义的理论基础。"},
    "ヨハン・ヨアヒム・ヴィンケルマン": {"ja": "ヨハン・ヨアヒム・ヴィンケルマン", "zh": "约翰·约阿希姆·温克尔曼",
                                        "note_ja": "ドイツの美術史家。古代ギリシア美術を理想とし、新古典主義の理論的基盤を形成した。",
                                        "note_zh": "德国美术史家。以古希腊美术为理想，形成新古典主义的理论基础。"},
    "佐野利器": {"ja": "佐野利器", "zh": "佐野利器",
               "note_ja": "日本の建築家・構造家。耐震構造学の先駆者で、東京帝国大学教授。",
               "note_zh": "日本建筑师、结构学家。抗震结构学先驱，东京帝国大学教授。"},
    "内田祥三": {"ja": "内田祥三", "zh": "内田祥三",
               "note_ja": "日本の建築家。東京帝国大学の復興計画や安田講堂を設計。",
               "note_zh": "日本建筑师。设计了东京帝国大学复兴计划和安田讲堂。"},
    "後藤慶二": {"ja": "後藤慶二", "zh": "后藤庆二",
               "note_ja": "日本の建築家。表現主義的傾向をもつ建築を設計。",
               "note_zh": "日本建筑师。设计具有表现主义倾向的建筑。"},
    "フランチェスコ・ボッロミーニ": {"ja": "フランチェスコ・ボッロミーニ", "zh": "弗朗切斯科·博罗米尼",
                                    "note_ja": "イタリアのバロック建築家。サン・カルロ・アッレ・クワトロ・フォンターネ聖堂で知られる。",
                                    "note_zh": "意大利巴洛克建筑师。以四泉圣卡洛教堂闻名。"},
    "アンリ・ラブルースト": {"ja": "アンリ・ラブルースト", "zh": "亨利·拉布鲁斯特",
                            "note_ja": "フランスの建築家。パリのサント・ジュヌヴィエーヴ図書館や国立図書館で鉄骨構造を革新的に用いた。",
                            "note_zh": "法国建筑师。在巴黎圣热纳维耶芙图书馆和国家图书馆中创新性地使用铁骨结构。"},
    "ジョセフ・パクストン": {"ja": "ジョセフ・パクストン", "zh": "约瑟夫·帕克斯顿",
                           "note_ja": "イギリスの庭師・建築家。水晶宮（クリスタル・パレス）を設計し、鉄とガラスの建築の先駆けとなった。",
                           "note_zh": "英国园艺师、建筑师。设计了水晶宫，成为铁与玻璃建筑的先驱。"},
}

# ---- Theory/Concept cards to create ----
NEW_CONCEPT_CARDS = [
    {
        "id": "concept-jinaicho",
        "kind": "theory-or-institution",
        "name_ja": "寺内町",
        "name_zh": "寺内町",
        "summary_ja": "中世末期、浄土真宗寺院を中心に形成された環濠をもつ宗教都市・自治集落。",
        "summary_zh": "中世末期以净土真宗寺院为中心形成的带环壕的宗教城市与自治聚落。",
        "aliases": ["じないちょう", "寺内町"],
        "period_ja": "戦国時代〜江戸初期",
        "period_zh": "战国时代至江户初期",
        "regions": ["japan"],
        "keywords_ja": ["寺内町", "環濠", "一向宗", "自治都市", "大阪"],
        "keywords_zh": ["寺内町", "环壕", "一向宗", "自治城市", "大阪"],
        "exam_count": 4,
    },
    {
        "id": "concept-roman-concrete",
        "kind": "theory-or-institution",
        "name_ja": "ローマン・コンクリート",
        "name_zh": "罗马混凝土",
        "summary_ja": "古代ローマで発達した、火山灰（ポッツォラーナ）・石灰・骨材を混合した建築材料。",
        "summary_zh": "古罗马发展起来的以火山灰、石灰和骨材混合的建筑材料。",
        "aliases": ["ローマンコンクリート", "opus caementicium"],
        "period_ja": "古代ローマ",
        "period_zh": "古罗马",
        "regions": ["western"],
        "keywords_ja": ["ローマン・コンクリート", "ポッツォラーナ", "アーチ", "ヴォールト", "ドーム"],
        "keywords_zh": ["罗马混凝土", "火山灰", "拱券", "拱顶", "穹顶"],
        "exam_count": 1,
    },
]


def main():
    # Load existing data
    checklist = json.loads((ROOT / "data/past-exam-curated-coverage-checklist.json").read_text(encoding="utf-8"))
    card_links = json.loads((ROOT / "data/building-learning-card-links.json").read_text(encoding="utf-8"))

    # Build reverse index: card ID → list of buildings
    card_to_buildings = defaultdict(list)
    for b in card_links["buildings"]:
        for cid in b["learningCardIds"]:
            card_to_buildings[cid].append(b["buildingNameJa"])

    # Collect exam evidence for each card
    card_exam_evidence = defaultdict(list)
    matched = 0
    unmatched = []

    for row in checklist["rows"]:
        term = row["termJa"]
        if row["coverage"] == "exact":
            continue  # Already covered

        exam_files = row.get("examFiles", [])
        card_id = TERM_TO_CARD.get(term)

        if card_id:
            for ef in exam_files:
                card_exam_evidence[card_id].append({
                    "year": int(ef.split("_")[0]) if "_" in ef else 0,
                    "category": "専門1" if "専門1" in ef else "専門2-2",
                    "questionNumber": ef.split("_Q")[-1].replace(".md", "") if "_Q" in ef else "",
                    "fileName": ef,
                    "relation": "direct",
                    "examTerm": term,
                })
            matched += 1
        else:
            unmatched.append(row)

    print(f"Matched {matched} terms to existing cards")
    print(f"Unmatched: {len(unmatched)}")
    print()

    # Output the exam evidence mapping
    evidence_map = {}
    for cid, evidence in card_exam_evidence.items():
        # Deduplicate by year+category+question
        seen = set()
        deduped = []
        for e in evidence:
            key = (e["year"], e["category"], e["questionNumber"])
            if key not in seen:
                seen.add(key)
                deduped.append(e)
        evidence_map[cid] = deduped

    # Write the evidence map
    out_path = ROOT / "data/past-exam-card-evidence.json"
    out_path.write_text(json.dumps({
        "version": 1,
        "description": "Past exam evidence mapped to learning card IDs",
        "cardEvidence": evidence_map,
        "personReferences": PERSON_REFERENCES,
        "newConceptCards": NEW_CONCEPT_CARDS,
        "unmatchedTerms": [{
            "term": r["termJa"],
            "kind": r["entityKind"],
            "examCount": r["examFileCount"],
            "examFiles": r.get("examFiles", []),
        } for r in unmatched],
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Evidence map written to {out_path}")
    print(f"Cards with exam evidence: {len(evidence_map)}")

    # Summary
    for cid in sorted(evidence_map.keys()):
        evidence = evidence_map[cid]
        years = sorted(set(e["year"] for e in evidence))
        print(f"  {cid}: {len(evidence)} evidence items, years: {years}")

    # Show unmatched for manual review
    if unmatched:
        print(f"\nUnmatched terms ({len(unmatched)}):")
        for r in sorted(unmatched, key=lambda x: -x["examFileCount"]):
            print(f"  [{r['entityKind']}] {r['termJa']} (×{r['examFileCount']})")


if __name__ == "__main__":
    main()
