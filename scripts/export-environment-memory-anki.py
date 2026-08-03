#!/usr/bin/env python3
"""Export concept/phenomenon cards from the environment-memory page to Anki."""

from __future__ import annotations

import argparse
import html
import json
import os
import sqlite3
import subprocess
import tempfile
import zipfile
from collections import Counter
from pathlib import Path

import genanki


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "lib" / "environment-memory.ts"
DEFAULT_OUTPUT = ROOT / "exports" / "建築環境工学_概念・現象_記憶カード.apkg"
NPX = "npx.cmd" if os.name == "nt" else "npx"

# Calculation-first cards belong to the formula page. This export intentionally
# keeps definitions, distinctions, mechanisms, phenomena, and common traps.
FORMULA_FOCUSED_IDS = {
    "sun-sc",
    "ventilation-co2",
    "ventilation-natural",
    "heat-resistance",
    "heat-radiation",
    "system-efficiency",
    "sun-altitude",
    "sun-bouguer",
    "sun-sat",
    "sun-glass",
    "sun-wien",
    "light-point",
    "light-daylight",
    "light-lumen",
    "light-room-index",
    "vent-airchange",
    "vent-pressure",
    "vent-stack",
    "vent-decay",
    "heat-fourier",
    "heat-newton",
    "heat-viewfactor",
    "moist-rh",
    "moist-enthalpy",
    "moist-permeation",
    "sound-lp",
    "sound-sabine",
    "sound-eyring",
    "sound-distance",
    "sound-octave",
}


def load_memory_data() -> dict:
    """Compile the typed source in a temporary folder and read its exports."""
    with tempfile.TemporaryDirectory(prefix="environment-memory-") as directory:
        compiled = Path(directory)
        subprocess.run(
            [
                NPX,
                "tsc",
                str(SOURCE),
                "--target",
                "ES2020",
                "--module",
                "commonjs",
                "--esModuleInterop",
                "--skipLibCheck",
                "--outDir",
                str(compiled),
            ],
            cwd=ROOT,
            check=True,
        )
        module = compiled / "environment-memory.js"
        result = subprocess.run(
            ["node", "-e", "console.log(JSON.stringify(require(process.argv[1])))", str(module)],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
    return json.loads(result.stdout)


def validate(data: dict) -> tuple[list[dict], dict, Counter]:
    cards = data["ENVIRONMENT_MEMORY_CARDS"]
    japanese = data["JAPANESE_MEMORY_COPY"]
    topics = {item["id"] for item in data["MEMORY_TOPICS"]}
    ids = [card["id"] for card in cards]
    duplicates = [card_id for card_id, count in Counter(ids).items() if count > 1]
    if duplicates:
        raise ValueError(f"Duplicate card IDs: {', '.join(duplicates)}")
    unknown_copy = set(japanese) - set(ids)
    if unknown_copy:
        raise ValueError(f"Japanese copy has unknown IDs: {', '.join(sorted(unknown_copy))}")
    required = ("id", "topic", "title", "prompt", "answer", "hook", "trap", "years")
    for card in cards:
        missing = [field for field in required if not str(card.get(field, "")).strip()]
        if missing:
            raise ValueError(f"{card.get('id', '<unknown>')} has empty fields: {', '.join(missing)}")
        if card["topic"] not in topics:
            raise ValueError(f"{card['id']} has unknown topic {card['topic']}")
    selected = [card for card in cards if card["id"] not in FORMULA_FOCUSED_IDS]
    if not selected:
        raise ValueError("No concept cards selected for export.")
    return selected, japanese, Counter(card["topic"] for card in selected)


def text(value: str) -> str:
    return html.escape(value).replace("\n", "<br>")


def build_deck(cards: list[dict], japanese: dict, output: Path) -> None:
    model = genanki.Model(
        1979203101,
        "建築環境工学｜概念・現象記憶",
        fields=[
            {"name": "Topic"},
            {"name": "Title"},
            {"name": "Question"},
            {"name": "Answer"},
            {"name": "Hook"},
            {"name": "Trap"},
            {"name": "ChineseHelp"},
            {"name": "Years"},
        ],
        templates=[
            {
                "name": "想起",
                "qfmt": """
                  <div class=topic>{{Topic}}</div>
                  <div class=title>{{Title}}</div>
                  <div class=question>Q. {{Question}}</div>
                """,
                "afmt": """
                  {{FrontSide}}<hr id=answer>
                  <div class=section><b>答え</b><br>{{Answer}}</div>
                  <div class=hook><b>記憶フック</b><br>{{Hook}}</div>
                  <div class=trap><b>よくある誤り</b><br>{{Trap}}</div>
                  {{#ChineseHelp}}<details><summary>中文辅助</summary><div class=chinese>{{ChineseHelp}}</div></details>{{/ChineseHelp}}
                  <div class=years>関連過去問：{{Years}}</div>
                """,
            }
        ],
        css="""
          .card { font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans JP', sans-serif; font-size: 20px; text-align: left; color: #172033; background: #f7fafc; padding: 22px; }
          .topic { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 13px; font-weight: 700; color: #0f766e; background: #ccfbf1; }
          .title { margin: 14px 0 18px; font-size: 27px; font-weight: 800; color: #0f172a; }
          .question { border-left: 4px solid #0891b2; padding: 12px 14px; background: #ffffff; line-height: 1.65; }
          #answer { border: 0; border-top: 1px solid #cbd5e1; margin: 22px 0; }
          .section, .hook, .trap { margin-top: 12px; padding: 12px 14px; border-radius: 10px; font-size: 17px; line-height: 1.65; }
          .section { background: #ecfdf5; color: #064e3b; }
          .hook { background: #fffbeb; color: #78350f; }
          .trap { background: #fff1f2; color: #881337; }
          details { margin-top: 14px; padding: 10px 12px; border-radius: 10px; background: #eff6ff; font-size: 15px; color: #1e3a8a; }
          summary { cursor: pointer; font-weight: 700; }
          .chinese { margin-top: 8px; line-height: 1.6; }
          .years { margin-top: 18px; color: #64748b; font-size: 13px; }
        """,
    )
    deck = genanki.Deck(1979203102, "建築環境工学::概念・現象")
    for card in cards:
        japanese_card = japanese.get(card["id"], card)
        chinese = ""
        if card["id"] in japanese:
            chinese = "<b>問題：</b>" + text(card["prompt"])
            chinese += "<br><b>答案：</b>" + text(card["answer"])
            chinese += "<br><b>记忆钩子：</b>" + text(card["hook"])
            chinese += "<br><b>易错点：</b>" + text(card["trap"])
        deck.add_note(
            genanki.Note(
                model=model,
                fields=[
                    text(card["topic"]),
                    text(japanese_card["title"]),
                    text(japanese_card["prompt"]),
                    text(japanese_card["answer"]),
                    text(japanese_card["hook"]),
                    text(japanese_card["trap"]),
                    chinese,
                    text(card["years"]),
                ],
                tags=["建築環境工学", f"分野::{card['topic']}", "概念・現象"],
                guid=genanki.guid_for("environment-concept-memory", card["id"]),
            )
        )
    output.parent.mkdir(parents=True, exist_ok=True)
    genanki.Package(deck).write_to_file(output)


def audit_package(output: Path, expected_cards: int) -> None:
    with tempfile.TemporaryDirectory(prefix="environment-anki-audit-") as directory:
        extracted = Path(directory)
        with zipfile.ZipFile(output) as archive:
            archive.extract("collection.anki2", extracted)
        database = sqlite3.connect(extracted / "collection.anki2")
        try:
            note_count = database.execute("select count(*) from notes").fetchone()[0]
            card_count = database.execute("select count(*) from cards").fetchone()[0]
            decks = json.loads(database.execute("select decks from col").fetchone()[0])
        finally:
            database.close()
    if note_count != expected_cards or card_count != expected_cards:
        raise ValueError(f"Package audit failed: notes={note_count}, cards={card_count}, expected={expected_cards}")
    if not any(deck.get("name") == "建築環境工学::概念・現象" for deck in decks.values()):
        raise ValueError("Package audit failed: deck name missing")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    data = load_memory_data()
    cards, japanese, topics = validate(data)
    build_deck(cards, japanese, args.output)
    audit_package(args.output, len(cards))
    print("Created deck package.")
    print(f"Cards: {len(cards)} (formula-focused cards excluded: {len(FORMULA_FOCUSED_IDS)})")
    print(f"Topic groups: {len(topics)}")


if __name__ == "__main__":
    main()
