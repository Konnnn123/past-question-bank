"""Create a complete, conservative disposition for all remaining person labels."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# These labels explicitly identify a designer, an architectural office, or an
# engineering designer in the source dataset. Everyone else remains a related
# person: patron, ruler, clergy, artist, theorist, or an attribution that is
# insufficiently specific to create a learning card.
DESIGNER_CANDIDATES = {
    "A·ダービー", "G・G・スコット", "J・F・へーガー", "アンドレ・ル・ノートル",
    "ヴァルター・グロピウス＆アドルフ・マイヤー", "ウィトルウィウス", "エリアス・デレハム（Elias of Dereham）",
    "ゲルハルト・フォン・リーレ（初代建築家）", "ドミニク・ベロー", "ハイメ・ファブラ（初代建築家）",
    "ピエール・ブレ", "ブスケトゥス（Buscheto）／ライナルドゥス（Rainaldo）", "フリードリヒ・フォン・ゲルトナー",
    "ヤン・ブラジェイ・サンティーニ＝アイヘル", "ユスティニアヌス1世／アンテミオス・トラーリス", "ヨーゼフ・ホフマン",
    "ヨーゼフ・マリア・オルブリッヒ", "ヨーン・ウツソン", "ヨハン・ベルンハルト・フィッシャー・フォン・エルラッハ",
    "リチャード・ノーマン・ショウ", "リチャード・ロジャース", "リュイス・ドメネク・イ・ムンタネー",
    "ルイ・ル・ヴォー", "ルチアーノ・ラウラーナ（設計）", "レンゾ・ピアノ", "ロベール・ド・リュザルシュ（要確認）",
    "ロベルト・ファント・ホフ", "本野精吾", "曾禰達蔵・中條精一郎（曾禰中條建築事務所）",
    "曾禰中條建築事務所（曾禰達蔵", "大熊喜邦", "渡辺仁", "岡田信一郎", "高橋兼吉", "東孝光",
    "吉田鉄郎", "磯崎新", "前田健二郎", "清家清", "清水喜助", "日建設計", "象設計集団",
    "岩元禄", "野口孫市", "遠藤新", "増沢洵", "立石清重",
}

def load_map(path: Path) -> dict[str, str]:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}

def main() -> None:
    source = json.loads((ROOT / "data/architecture-normalized-candidates.json").read_text(encoding="utf-8"))
    names = load_map(ROOT / "data/architect-card-name-map.json")
    names.update(load_map(ROOT / "data/architect-card-name-map-batch-four.json"))
    unresolved: dict[str, list[dict]] = {}
    for building in source["buildings"]:
        for person in building.get("normalizedPersonNames", []):
            if not person or person == "要確認" or person in names:
                continue
            unresolved.setdefault(person, []).append({
                "buildingId": building["id"],
                "buildingNameJa": building["name"]["ja"],
                "pastExamCount": len(building.get("examEvidence", [])),
            })
    rows = []
    for person, buildings in sorted(unresolved.items()):
        status = "architect-card-candidate" if person in DESIGNER_CANDIDATES else "related-person"
        rows.append({"nameJa": person, "status": status, "buildings": buildings, "pastExamCount": sum(x["pastExamCount"] for x in buildings)})
    result = {
        "version": 1,
        "scope": "all unresolved normalizedPersonNames after architect-card batches 1-4",
        "summary": {
            "total": len(rows),
            "architectCardCandidates": sum(x["status"] == "architect-card-candidate" for x in rows),
            "relatedPeople": sum(x["status"] == "related-person" for x in rows),
        },
        "rows": rows,
    }
    (ROOT / "data/architect-person-audit-final.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = ["# 建筑史人物最终审核", "", f"- 总计：{result['summary']['total']}", f"- 应补建筑家卡：{result['summary']['architectCardCandidates']}", f"- 关联人物（不进入建筑家分类）：{result['summary']['relatedPeople']}", "", "| 人物 | 结论 | 作品数 | 真题次数 |", "| --- | --- | ---: | ---: |"]
    for row in rows:
        label = "建筑家卡候选" if row["status"] == "architect-card-candidate" else "关联人物"
        lines.append(f"| {row['nameJa']} | {label} | {len(row['buildings'])} | {row['pastExamCount']} |")
    (ROOT / "data/architect-person-audit-final.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
