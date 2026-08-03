"""Build an auditable index linking building-planning exam items to Anki cards.

The source deck lives next to this repository in ``../planning card``.  Links are
only emitted when either (a) the card itself declares a past-exam reference, or
(b) its name occurs verbatim in an individual exam item.  This deliberately
avoids speculative similarity matching.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CACHE_PATH = ROOT.parent / "planning card" / "building_cache.json"
QUESTION_DIR = ROOT / "data" / "processed_questions"
OUT_PATH = ROOT / "data" / "planning-exam-card-index.json"
REPORT_PATH = ROOT / "data" / "planning-exam-card-index.md"

GENERIC_CARD_NAMES = {
    "住宅", "病院", "集合住宅", "バリアフリー", "避難計画", "階段室型",
    "公共図書館", "特別教室", "普通教室", "地方都市", "領域",
}


def parse_frontmatter(raw: str) -> tuple[dict[str, object], str]:
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", raw, re.S)
    if not match:
        return {}, raw
    values: dict[str, object] = {}
    for line in match.group(1).splitlines():
        found = re.match(r"^(year|subject|category|question_number):\s*[\"']?([^\"']*)", line)
        if found:
            key, value = found.groups()
            values[key] = int(value) if key == "year" and value.isdigit() else value.strip()
    return values, match.group(2).strip()


def parse_tags(raw: str) -> list[str]:
    match = re.match(r"^---\s*\n(.*?)\n---", raw, re.S)
    return re.findall(r'^\s*-\s+["\']([^"\']+)["\']', match.group(1), re.M) if match else []


def normalized(value: str) -> str:
    return re.sub(r"\s+", "", value).replace("・", "")


def question_key(year: int, category: str, number: str) -> str:
    return f"{year}:{category}:{number}"


def split_items(body: str, file_name: str) -> list[dict[str, str]]:
    # Most years use (1) … (20), while 2022 uses [A] … [T]. Keep IDs
    # ASCII-only so answer data does not depend on source-file encoding.
    matches = list(re.finditer(r"(?m)^\s*[（(](\d{1,2})[）)]", body))
    label_kind = "number"
    if len(matches) < 2:
        # 2022 places several lettered blanks in one paragraph, so these are
        # intentionally not anchored to the start of a line.
        first_prompt = body.find("・")
        matches = [
            match for match in re.finditer(r"\[([A-T])\]", body)
            if match.start() > first_prompt
        ]
        label_kind = "letter"
    if len(matches) < 2:
        matches = list(re.finditer(r"(?m)^图4-(\d{1,2})\s*$", body))
        label_kind = "figure"
    if len(matches) < 2:
        return [{"id": f"{file_name}#q", "label": "question", "text": body}]
    if label_kind == "letter":
        # The instruction itself mentions “[A] to [T]”; retain the later,
        # actual blank when a letter occurs twice.
        by_label = {match.group(1): match for match in matches}
        matches = sorted(by_label.values(), key=lambda match: match.start())
    items = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        items.append({
            "id": f"{file_name}#s{int(match.group(1)):02d}" if label_kind in {"number", "figure"} else f"{file_name}#s{match.group(1).lower()}",
            "label": f"subquestion-{match.group(1)}",
            "text": body[match.start():end].strip(),
        })
    return items


def parse_declared_exam_refs(value: str) -> list[tuple[int, str]]:
    return [(int(year), number) for year, number in re.findall(r"(20\d{2})\s*Q(?:問題)?\s*(\d+)", value)]


def main() -> None:
    if not CACHE_PATH.exists():
        raise SystemExit(f"Planning-card cache not found: {CACHE_PATH}")

    cards = json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    questions = []
    by_year_number: dict[tuple[int, str], list[dict[str, object]]] = defaultdict(list)

    for file_path in sorted(QUESTION_DIR.glob("*.md")):
        raw = file_path.read_text(encoding="utf-8")
        front, body = parse_frontmatter(raw)
        if front.get("subject") != "建筑计划":
            continue
        row = {
            "id": question_key(int(front["year"]), str(front["category"]), str(front["question_number"])),
            "fileName": file_path.name,
            "year": front["year"],
            "category": front["category"],
            "questionNumber": front["question_number"],
            "tags": parse_tags(raw),
            "items": split_items(body, file_path.name),
        }
        questions.append(row)
        by_year_number[(int(front["year"]), str(front["question_number"]).replace("問題", ""))].append(row)

    card_rows = [{
        "id": card["page_id"],
        "name": card["name"],
        "type": card.get("item_type", ""),
        "tags": card.get("tags", []),
        "pastExam": card.get("past_exam", ""),
        "questionFormat": card.get("question_format", ""),
    } for card in cards]

    links: list[dict[str, object]] = []
    unresolved_declared_refs = []
    linked_keys = set()

    def add_link(card: dict[str, object], question: dict[str, object], item_id: str | None, relation: str, confidence: str, basis: str) -> None:
        key = (card["id"], question["id"], item_id, relation)
        if key in linked_keys:
            return
        linked_keys.add(key)
        links.append({
            "cardId": card["id"],
            "cardName": card["name"],
            "questionId": question["id"],
            "fileName": question["fileName"],
            "itemId": item_id,
            "relation": relation,
            "confidence": confidence,
            "evidenceBasis": basis,
        })

    # Card-maintained references cover the whole question unless a future
    # manual review refines them to a specific subquestion.
    for card in card_rows:
        for year, number in parse_declared_exam_refs(str(card["pastExam"])):
            targets = by_year_number.get((year, number), [])
            if len(targets) == 1:
                add_link(card, targets[0], None, "declared-past-exam", "declared", "card.past_exam")
            elif len(targets) > 1:
                # A year can contain the same question number in both papers.
                # Resolve only when the card name itself appears in exactly one
                # candidate paper; otherwise preserve the ambiguity for review.
                name = str(card["name"])
                name_key = normalized(name)
                textual_targets = [
                    target for target in targets
                    if name_key and any(name_key in normalized(item["text"]) for item in target["items"])
                ]
                if len(textual_targets) == 1:
                    add_link(card, textual_targets[0], None, "declared-past-exam", "declared", "card.past_exam + unique-verbatim-target")
                else:
                    tagged_targets = [
                        target for target in targets
                        if name_key and any(name_key == normalized(tag) for tag in target["tags"])
                    ]
                    if len(tagged_targets) == 1:
                        add_link(card, tagged_targets[0], None, "declared-past-exam", "declared", "card.past_exam + unique-question-tag")
                    else:
                        unresolved_declared_refs.append({
                            "cardId": card["id"], "cardName": card["name"], "year": year,
                            "questionNumber": number, "candidateQuestionIds": [target["id"] for target in targets],
                        })
            else:
                unresolved_declared_refs.append({
                    "cardId": card["id"], "cardName": card["name"], "year": year,
                    "questionNumber": number, "candidateQuestionIds": [target["id"] for target in targets],
                })

    # Exact name matches are direct item-level evidence.  Generic terms are
    # intentionally excluded because they do not identify one card uniquely.
    for card in card_rows:
        name = str(card["name"]).strip()
        if len(name) < 4 or name in GENERIC_CARD_NAMES:
            continue
        for question in questions:
            for item in question["items"]:
                if normalized(name) in normalized(item["text"]):
                    add_link(card, question, item["id"], "exact-name-in-item", "confirmed", "verbatim-card-name")

    links.sort(key=lambda link: (link["fileName"], str(link["itemId"]), link["cardName"], link["relation"]))
    payload = {
        "version": 1,
        "description": "Auditable links between 建筑计划 exam items and planning Anki cards. No similarity-only links are included.",
        "sources": {
            "questionDirectory": "data/processed_questions",
            "cardCache": "../planning card/building_cache.json",
        },
        "questionCount": len(questions),
        "cardCount": len(card_rows),
        "linkCount": len(links),
        "questions": questions,
        "cards": card_rows,
        "links": links,
        "unresolvedDeclaredReferences": unresolved_declared_refs,
    }
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    counts = defaultdict(int)
    for link in links:
        counts[link["relation"]] += 1
    report = [
        "# 建筑计划过去问—Anki 卡关联索引",
        "",
        "仅包含卡片声明的过去问关联，或卡名逐字出现在题干中的关联；不以相似度推断关联。",
        "",
        f"- 题目：{len(questions)}",
        f"- 卡片：{len(card_rows)}",
        f"- 关联：{len(links)}（声明：{counts['declared-past-exam']}；题干逐字匹配：{counts['exact-name-in-item']}）",
        f"- 待消歧声明关联：{len(unresolved_declared_refs)}",
        "",
        "## 待人工细化",
        "",
        "- `declared-past-exam` 仅定位到大题；需在后续审核时定位到具体小问。",
        "- 未链接的考点不代表不重要，只表示当前没有足够的直接证据。",
    ]
    REPORT_PATH.write_text("\n".join(report) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
