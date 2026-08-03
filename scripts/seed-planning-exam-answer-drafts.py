"""Add reviewed answer drafts for the remaining building-planning choice papers.

These are intentionally marked as drafts: a choice may be supported by the
question wording and study materials without being an official released key.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "planning-exam-answers.json"


def rows(file_name: str, choices: str, answers: str, *, letters: bool = False, status: str = "card-supported-draft") -> list[dict[str, object]]:
    choice_values = choices.split()
    answer_values = answers.split("|")
    if len(choice_values) != len(answer_values):
        raise ValueError(f"Answer count mismatch for {file_name}")
    labels = [chr(ord("a") + index) for index in range(len(choice_values))] if letters else [f"{index:02d}" for index in range(1, len(choice_values) + 1)]
    return [
        {
            "itemId": f"{file_name}#s{label}",
            "reviewStatus": status,
            "choice": choice,
            "answer": answer,
            "evidenceCards": [],
        }
        for label, choice, answer in zip(labels, choice_values, answer_values)
    ]


DRAFTS = [
    ("2019:専門1:問題4", "2019_専門1_建筑计划_Q4.md", rows(
        "2019_専門1_建筑计划_Q4.md", "D B A C C C B B B A B B C C A C D D A C",
        "ルシオ・コスタ|ラドバーン|HOPE計画|NEXT21|高齢者向けデイサービス|求道学舎|50床|東京臨海病院|25㎡|小規模多機能型居宅介護|施設入所支援|フォドレア小学校|笠原小学校|日野市立図書館|武蔵野プレイス|十和田市現代美術館|バイロイト祝祭劇場|守りやすい空間|ケヴィン・リンチ|50室")),
    ("2020:専門1:問題4", "2020_専門1_建筑计划_Q4.md", rows(
        "2020_専門1_建筑计划_Q4.md", "C A B C C A D C A A A B A C A A C D D D",
        "チャンディガール|トランジットモール|約8,000〜10,000人|コホーティング|大阪南港事件判決|第一種住居地域|斜線制限|2,000㎡|1:1.25|全階|準住居地域|都市計画決定|市街化区域|変更許可|第36条|第36条|第38条|建築物エネルギー消費性能計画届出|建築物エネルギー消費性能認定|建築物エネルギー消費性能審査", status="historical-law-draft")),
    ("2022:専門1:問題4", "2022_専門1_建筑计划_Q4.md", rows(
        "2022_専門1_建筑计划_Q4.md", "B C D B D D B A B C C D B B B A C G D C",
        "10000㎡|220人|50000㎡|6m|30m|110cm|800m|2m|2DK|3つ|3層|2300m|2本|2本|1949年|1964年|66年|1400m|1080m|1000m", letters=True)),
    ("2024:専門1:問題4", "2024_専門1_建筑计划_Q4.md", rows(
        "2024_専門1_建筑计划_Q4.md", "C C B A C D D D B C B A A C D B D C A C",
        "レッチワース|ラドバーン|500m|コーポラティブハウス|スカイハウス|東雲キャナルコート|両端型|ケアハウス|せんねん村|6.4㎡|三角型|北側廊下南側教室|テアトロ・ファルネーゼ|22m|りゅーとぴあ|坂倉準三|宮城県図書館|3/1|クリストファー・アレクザンダー|1:1.618")),
    ("2025:専門1:問題4", "2025_専門1_建筑计划_Q4.md", rows(
        "2025_専門1_建筑计划_Q4.md", "? ? ? ? ? ? ? ? ? ?",
        "原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验|原始图像导出为黑块，需从可阅读 PDF 页核验", status="image-source-unresolved")),
    ("2026:専門1:問題4", "2026_専門1_建筑计划_Q4.md", rows(
        "2026_専門1_建筑计划_Q4.md", "A B C C A B C B A B D A C D A C D A B C",
        "パーソナルスペース|蹴上15cm・踏面30cm|約1/18|普通車2.5m・車椅子用3.5m|テラスハウス|中廊下型|六甲の集合住宅|普通教室70㎡|児童間の交流を促進|レンタブル比80%|パレスサイドビル|診療部門を外来部門と病棟部門の間に配置|座席幅50cm・前後間隔100cm|グッゲンハイム美術館|ポンピドゥー・センター|チューブ状の構造コア|専用の障害者向け機能|廊下幅150cm以上|小学校を核にした徒歩圏|スカイライン")),
]

# 2025 問題4 is useful even without the ten figures: every term in the two
# word banks has one intended counterpart.  The figures can be added later as
# optional visual cues, but the review outline should expose these pairs now.
PAIRING_REFERENCE_2025 = [
    ("a", "コモンシティ星田", "a", "ボンエルフ"),
    ("b", "田園都市", "g", "E. ハワード"),
    ("c", "工業都市", "i", "トニー・ガルニエ"),
    ("d", "住宅営団", "c", "土地区画整理事業"),
    ("e", "近隣住区", "h", "C. A. ペリー"),
    ("f", "コミュニティケア型仮設住宅", "d", "東日本大震災"),
    ("g", "ラドバーン", "b", "歩車分離"),
    ("h", "高蔵寺ニュータウン", "e", "ワンセンター方式"),
    ("i", "シーサイド", "f", "ニュー・アーバニズム"),
    ("j", "池田室町", "j", "阪急電鉄"),
    ("k", "阿佐ヶ谷住宅", "n", "W. M. ヴォーリズ"),
    ("l", "同潤会代官山アパート", "p", "関東大震災"),
    ("m", "本郷館", "l", "高等下宿"),
    ("n", "軍艦島30号棟", "s", "炭鉱住宅"),
    ("o", "大島四丁目団地", "q", "面開発市街地住宅"),
    ("p", "御茶ノ水文化住宅", "k", "津端修一"),
    ("q", "玉姫公設長屋", "t", "浅草大火"),
    ("r", "桜台コートビレッジ", "o", "コーポラティブ・ハウス"),
    ("s", "猿江裏町", "m", "不良住宅地区改良事業"),
    ("t", "ユーコート", "r", "内井昭蔵"),
]


def main() -> None:
    payload = json.loads(OUT.read_text(encoding="utf-8"))
    known = {record["questionId"] for record in payload["records"]}
    for question_id, file_name, items in DRAFTS:
        if question_id not in known:
            payload["records"].append({"questionId": question_id, "fileName": file_name, "items": items})
    pairing_record = next(record for record in payload["records"] if record["questionId"] == "2025:専門1:問題4")
    # This source has no usable figure labels. Treat it as a 20-pair review
    # bank, rather than pretending ten unknown figure answers are available.
    pairing_record["items"] = []
    pairing_record["pairingReference"] = [
        {
            "reviewStatus": "concept-pair-draft",
            "group1": {"choice": left_choice, "answer": left_answer},
            "group2": {"choice": right_choice, "answer": right_answer},
        }
        for left_choice, left_answer, right_choice, right_answer in PAIRING_REFERENCE_2025
    ]
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
