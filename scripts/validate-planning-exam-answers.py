"""Validate the answer layer against the planning exam/card index."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
ANSWERS = ROOT / "data" / "planning-exam-answers.json"
INDEX = ROOT / "data" / "planning-exam-card-index.json"
REPORT = ROOT / "data" / "planning-exam-answer-audit.md"


def main() -> None:
    answers = json.loads(ANSWERS.read_text(encoding="utf-8"))
    index = json.loads(INDEX.read_text(encoding="utf-8"))
    item_ids = {item["id"] for question in index["questions"] for item in question["items"]}
    card_names = {card["name"] for card in index["cards"]}

    answer_ids: set[str] = set()
    missing_items: list[str] = []
    duplicate_items: list[str] = []
    missing_cards: list[str] = []
    status_counts: dict[str, int] = {}
    pairing_errors: list[str] = []
    pairing_count = 0

    for record in answers["records"]:
        for item in record["items"]:
            item_id = item["itemId"]
            if item_id in answer_ids:
                duplicate_items.append(item_id)
            answer_ids.add(item_id)
            if item_id not in item_ids:
                missing_items.append(item_id)
            status = item.get("reviewStatus", "missing")
            status_counts[status] = status_counts.get(status, 0) + 1
            for card_name in item.get("evidenceCards", []):
                if card_name not in card_names:
                    missing_cards.append(f"{item_id}: {card_name}")
        pairs = record.get("pairingReference", [])
        if pairs:
            pairing_count += len(pairs)
            left_choices = [pair["group1"]["choice"] for pair in pairs]
            right_choices = [pair["group2"]["choice"] for pair in pairs]
            for pair in pairs:
                status = pair.get("reviewStatus", "missing")
                status_counts[status] = status_counts.get(status, 0) + 1
            if len(pairs) != 20 or len(set(left_choices)) != 20 or len(set(right_choices)) != 20:
                pairing_errors.append(record["questionId"])

    report = [
        "# 建筑计划答案层审计",
        "",
        f"- 已整理答案：{len(answer_ids) + pairing_count}（小问：{len(answer_ids)}；配对：{pairing_count}）",
        f"- 状态：{'、'.join(f'{key} {value}' for key, value in sorted(status_counts.items())) or '—'}",
        f"- 不存在的小问引用：{len(missing_items)}",
        f"- 重复小问引用：{len(duplicate_items)}",
        f"- 不存在的 Anki 卡引用：{len(missing_cards)}",
        f"- 配对表完整性错误：{len(pairing_errors)}",
        "",
    ]
    if missing_items:
        report += ["## 不存在的小问引用", "", *[f"- {value}" for value in missing_items], ""]
    if duplicate_items:
        report += ["## 重复小问引用", "", *[f"- {value}" for value in duplicate_items], ""]
    if missing_cards:
        report += ["## 不存在的 Anki 卡引用", "", *[f"- {value}" for value in missing_cards], ""]
    if pairing_errors:
        report += ["## 配对表完整性错误", "", *[f"- {value}" for value in pairing_errors], ""]
    REPORT.write_text("\n".join(report), encoding="utf-8")

    if missing_items or duplicate_items or missing_cards or pairing_errors:
        raise SystemExit("Answer validation failed; see data/planning-exam-answer-audit.md")


if __name__ == "__main__":
    main()
