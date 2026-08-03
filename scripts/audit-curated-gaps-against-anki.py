from __future__ import annotations

import difflib
import json
import re
import unicodedata
from pathlib import Path


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKC", value)
    value = value.replace("净", "浄").replace("佛", "仏").replace("德", "徳")
    value = re.sub(r"[\s・･＝=―—–\-（）()【】\[\]、,。.]", "", value)
    return value.lower()


def main() -> None:
    checklist = json.loads(Path("data/past-exam-curated-coverage-checklist.json").read_text(encoding="utf-8"))
    anki = json.loads(Path("data/anki-import/anki-notes.json").read_text(encoding="utf-8"))
    overrides = json.loads(Path("data/curated-gaps-vs-anki-overrides.json").read_text(encoding="utf-8"))
    notes = []
    for record in anki["records"]:
        fields = record["fields"]
        notes.append({
            "noteId": record["source"]["noteId"],
            "name": fields.get("buildingName") or record.get("name", ""),
            "normalizedName": normalize(fields.get("buildingName") or record.get("name", "")),
            "searchText": normalize(" ".join(fields.values())),
            "style": fields.get("style", ""),
            "people": fields.get("people", ""),
            "labels": [
                fields.get("buildingName") or record.get("name", ""),
                *[v.strip() for v in re.split(r"[、,，／/]", fields.get("people", "")) if v.strip()],
                *[v.strip() for v in re.split(r"[、,，／/]", fields.get("style", "")) if v.strip()],
            ],
        })

    rows = []
    for item in checklist["rows"]:
        if item["coverage"] != "missing":
            continue
        term = item["termJa"]
        key = normalize(term)
        exact_field = [note for note in notes if key and key in note["searchText"]]
        normalized_name = [note for note in notes if key and key == note["normalizedName"]]
        fuzzy = []
        for note in notes:
            best_label, score = "", 0.0
            for label in note["labels"]:
                candidate = normalize(label)
                candidate_score = difflib.SequenceMatcher(None, key, candidate).ratio() if key and candidate else 0
                if candidate_score > score:
                    best_label, score = label, candidate_score
            if score >= 0.62:
                fuzzy.append({"noteId": note["noteId"], "name": note["name"], "matchedField": best_label, "score": round(score, 3)})
        fuzzy.sort(key=lambda candidate: candidate["score"], reverse=True)
        if normalized_name:
            status = "duplicate-normalized-name"
        elif exact_field:
            status = "mentioned-in-existing-card"
        elif fuzzy and fuzzy[0]["score"] >= 0.76:
            status = "possible-alias"
        else:
            status = "no-overlap-found"
        rows.append({
            "termJa": term,
            "entityKind": item["entityKind"],
            "status": status,
            "exactFieldMatches": [{"noteId": n["noteId"], "name": n["name"], "style": n["style"], "people": n["people"]} for n in exact_field],
            "possibleMatches": fuzzy[:5],
            "examFiles": item["examFiles"],
        })
        if term in overrides:
            rows[-1].update(overrides[term])

    result = {"version": 1, "ankiNoteCount": len(notes), "rows": rows}
    Path("data/curated-gaps-vs-anki.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    groups = {
        "duplicate-alias": "确定是同一实体／别名",
        "mentioned-existing-entity": "实体已在 Anki 字段中出现，但没有独立卡",
        "partial-hierarchy-overlap": "存在整体—局部层级重叠",
        "duplicate-normalized-name": "规范化后确定重叠",
        "mentioned-in-existing-card": "已在其他 Anki 卡正文／人物／样式中出现",
        "possible-alias": "可能是别名或名称变体",
        "no-overlap-found": "暂未发现重叠",
    }
    lines = ["# 清理版缺口与 Anki 重叠检测", "", f"- Anki 笔记：{len(notes)}", f"- 检测缺口：{len(rows)}", ""]
    for status, title in groups.items():
        selected = [row for row in rows if row["status"] == status]
        lines += [f"## {title}（{len(selected)}）", "", "| 缺口实体 | Anki 匹配 |", "|---|---|"]
        for row in selected:
            matches = row["exactFieldMatches"] or row["possibleMatches"]
            if row.get("match"):
                label = f"{row['match']}（{row.get('note', '')}）"
            else:
                label = "；".join(f"{m['name']} / {m.get('matchedField', '')} ({m.get('score', '字段命中')})" for m in matches) if matches else "—"
            lines.append(f"| {row['termJa']} | {label} |")
        lines.append("")
    Path("data/curated-gaps-vs-anki.md").write_text("\n".join(lines), encoding="utf-8")


if __name__ == "__main__":
    main()
