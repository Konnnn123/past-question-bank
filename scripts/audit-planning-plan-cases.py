"""Audit named building/urban-planning cases in past exams against planning Anki."""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CARDS = ROOT.parent / "planning card" / "building_cache.json"
OUT_JSON = ROOT / "data" / "planning-plan-case-gaps.json"
OUT_MD = ROOT / "data" / "planning-plan-case-gaps.md"

# Named cases that past questions require the learner to identify or discuss
# from a plan/configuration, or use as a planning precedent. Pure dimensions,
# people, laws and generic building types are intentionally excluded.
CASES: list[tuple[str, str, str, list[str]]] = [
    ("2015 Q9", "建筑", "旧丸ビル", ["旧丸ノ内ビルヂング", "丸ビル"]),
    ("2015 Q9", "建筑", "新宿三井ビル", []),
    ("2015 Q11", "建筑", "阿佐ヶ谷住宅", ["阿佐谷住宅"]),
    ("2015 Q11 / 2017 Q1 / 2023 Q4 / 2026 2-2", "建筑", "晴海高層アパート", ["晴海高層アパートメント", "晴海高層パート"]),
    ("2015 Q11", "规划", "坂出人工土地", []),
    ("2015 Q11", "建筑", "広島基町高層住宅", ["基町高層住宅", "広島市基町高層アパート"]),
    ("2017 Q1", "规划", "レッチワース", ["Letchworth"]),
    ("2017 Q1", "建筑", "シュレーダー邸", []),
    ("2017 Q1", "建筑", "ルイジアナ近代美術館", ["ルイジアナ美術館"]),
    ("2017 Q1", "规划", "ラドバーン", ["Radburn"]),
    ("2019 Q4", "规划", "ブラジリア", ["Brasília"]),
    ("2019 Q4", "规划", "NEXT21", ["NEXT 21"]),
    ("2019 Q4", "建筑", "求道学舎", []),
    ("2019 Q4", "建筑", "東京臨海病院", []),
    ("2019 Q4", "建筑", "フォドレア小学校", ["フォードレア小学校"]),
    ("2019 Q4", "建筑", "笠原小学校", []),
    ("2019 Q4 / 2026 2-2", "建筑", "日野市立中央図書館", ["日野市立図書館"]),
    ("2019 Q4", "建筑", "武蔵野プレイス", []),
    ("2019 Q4 / 2025 2-2", "建筑", "十和田市現代美術館", []),
    ("2019 Q4", "建筑", "バイロイト祝祭劇場", []),
    ("2020 2-2", "建筑", "こもれびの家", ["認知症高齢者グループホームこもれびの家"]),
    ("2020 2-2", "建筑", "旧宮前小学校", ["宮前小学校", "(旧)宮前小学校", "(旧)官前小学校", "宫前小学校"]),
    ("2020 Q4", "规划", "チャンディガール", ["Chandigarh"]),
    ("2023 Q4", "建筑", "コモンシティ星田", []),
    ("2023 Q4", "建筑", "真野ふれあい住宅", []),
    ("2023 Q4", "建筑", "神戸市立西神戸医療センター", ["西神戸医療センター"]),
    ("2023 Q4", "建筑", "西戸山小学校", []),
    ("2023 Q4", "建筑", "キンベル美術館", ["キンベル美術館"]),
    ("2023 Q4", "建筑", "霞ヶ関ビル", ["霞が関ビル"]),
    ("2024 Q4", "建筑", "スカイハウス", []),
    ("2024 Q4", "建筑", "東雲キャナルコート", ["東雲キャナルコートCODAN"]),
    ("2024 Q4", "建筑", "せんねん村", []),
    ("2024 Q4", "建筑", "テアトロ・ファルネーゼ", ["テアトロファルネーゼ", "テアトロ·ファルネ一ゼ"]),
    ("2024 Q4", "建筑", "りゅーとぴあ", ["新潟市民芸術文化会館"]),
    ("2024 Q4", "建筑", "宮城県図書館", ["宮城県立図書館", "宫城県立図書館"]),
    ("2025 2-2", "建筑", "ベルコリーヌ南大沢", []),
    ("2025 2-2", "建筑", "山崎邸", []),
    ("2025 2-2", "建筑", "正面のない家（N氏邸）", ["正面のない家", "正面のない家(N氏邸)"]),
    ("2025 2-2", "建筑", "住吉の長屋", []),
    ("2022 Q4 / 2025 2-2", "建筑", "公営住宅標準設計51C型", ["51C型", "公営住宅標準設計51Ｃ型"]),
    ("2026 Q4", "建筑", "六甲の集合住宅", ["六甲集合住宅"]),
    ("2026 Q4", "建筑", "パレスサイドビル", []),
    ("2026 Q4", "建筑", "グッゲンハイム美術館", ["ソロモン・R・グッゲンハイム美術館"]),
    ("2026 Q4", "建筑", "ポンピドゥー・センター", ["ポンピドーセンター", "ポンビドーセンター"]),
    ("2026 2-2", "建筑", "イブリン・ロウ小学校", ["イブリンロウ小学校"]),
    # 2025 matching question: named housing/urban precedents.
    ("2025 Q4", "规划", "高蔵寺ニュータウン", []),
    ("2025 Q4", "规划", "シーサイド", ["Seaside"]),
    ("2025 Q4", "建筑", "池田室町", ["池田室町住宅地"]),
    ("2025 Q4", "建筑", "同潤会代官山アパート", ["代官山アパート"]),
    ("2025 Q4", "建筑", "本郷館", []),
    ("2025 Q4", "建筑", "軍艦島30号棟", ["端島30号棟"]),
    ("2025 Q4", "建筑", "大島四丁目団地", []),
    ("2025 Q4", "建筑", "御茶ノ水文化住宅", ["御茶ノ水文化アパート"]),
    ("2025 Q4", "建筑", "玉姫公設長屋", []),
    ("2025 Q4", "建筑", "桜台コートビレッジ", []),
    ("2025 Q4", "建筑", "猿江裏町", ["猿江裏町共同住宅"]),
    ("2025 Q4", "建筑", "ユーコート", ["Uコート"]),
    ("2025 Q4", "规划", "コモンシティ星田", []),
]


def norm(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).lower()
    value = value.replace("パ一卜", "パート").replace("ユ一", "ユー")
    return re.sub(r"[\s・·･ー\-‐―—（）().,'\"/]", "", value)


def main() -> None:
    cards = json.loads(CARDS.read_text(encoding="utf-8"))
    rows = []
    seen = set()
    for exam, domain, name, aliases in CASES:
        key = norm(name)
        if key in seen:
            continue
        seen.add(key)
        keys = {norm(name), *(norm(alias) for alias in aliases)}
        independent, mentioned = [], []
        for card in cards:
            card_name = norm(card.get("name", ""))
            body = norm(" ".join(str(card.get(k, "")) for k in ("name", "description", "highlighted_text", "past_exam")))
            # An independent case card must carry the case name (or a reviewed
            # alias) as its title. A generic title such as 病院 or 集合住宅 is
            # concept coverage, not coverage of 東京臨海病院 or 六甲の集合住宅.
            name_hit = card_name in keys
            body_hit = any(k and k in body for k in keys if len(k) >= 3)
            hit = {"name": card.get("name"), "tags": card.get("tags", []), "hasImage": bool(card.get("local_image_paths") or card.get("image_urls"))}
            if name_hit:
                independent.append(hit)
            elif body_hit:
                mentioned.append(hit)
        status = "independent-card" if independent else "mentioned-only" if mentioned else "missing"
        rows.append({"exam": exam, "domain": domain, "name": name, "aliases": aliases, "status": status, "independentMatches": independent, "mentionedMatches": mentioned})

    counts = {status: sum(r["status"] == status for r in rows) for status in ("independent-card", "mentioned-only", "missing")}
    OUT_JSON.write_text(json.dumps({"scope": "Past-exam named building and urban-planning cases used for plan/image recognition or precedent discussion", "cardCount": len(cards), "caseCount": len(rows), "counts": counts, "rows": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    labels = {"missing": "完全缺失", "mentioned-only": "仅在其他卡正文提及", "independent-card": "已有独立卡"}
    lines = ["# 建筑计划平面案例：过去问 × Anki 缺口", "", "范围：过去问中需要从平面／配置／建筑图像识别、比较或作为规划先例说明的具名建筑与规划案例；不含纯数值、法规、人物与一般类型。", "", f"- 对照 Anki：{len(cards)} 张", f"- 案例：{len(rows)} 个", f"- 已有独立卡：{counts['independent-card']}", f"- 仅正文提及：{counts['mentioned-only']}", f"- 完全缺失：{counts['missing']}", ""]
    for status in ("missing", "mentioned-only", "independent-card"):
        selected = [r for r in rows if r["status"] == status]
        lines += [f"## {labels[status]}（{len(selected)}）", "", "| 过去问 | 类别 | 案例 | Anki 匹配 |", "|---|---|---|---|"]
        for row in selected:
            matches = row["independentMatches"] or row["mentionedMatches"]
            match_text = "、".join(m["name"] for m in matches) if matches else "—"
            lines.append(f"| {row['exam']} | {row['domain']} | {row['name']} | {match_text} |")
        lines.append("")
    OUT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(counts, ensure_ascii=False))


if __name__ == "__main__":
    main()
