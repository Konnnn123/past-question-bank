"""Rebuild traceable building-level past-exam evidence from processed history questions."""
from __future__ import annotations
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS = ROOT / "data" / "processed_questions"
ARCH = ROOT / "data" / "architecture-normalized-candidates.json"
LINKS = ROOT / "data" / "building-learning-card-links.json"

MANUAL_ALIASES = {
    "building-9bb925429472": ["永保寺観音堂"],
    "building-62de22f13d90": ["円覚寺舎利殿"],
    "building-50b4a1f5a92c": ["室生寺金堂", "室生寺五重塔"],
    "building-aeb9da82ed0e": ["東大寺南大門", "東大寺鐘楼"],
    "building-7da3f3b68c2e": ["東山殿東求堂", "慈照寺東求堂"],
    "building-b20352982a51": ["リチャーズ研究所", "リチャーズ医学研究所"],
    "building-08193cc0dffa": ["フィレンツェ大聖堂", "サンタ・マリア・デル・フィオーレ大聖堂"],
    "building-4a787cf0bd1b": ["サンタ・コスタンツァ", "サンタ・コスタンツァ廟堂"],
    "building-be29f430720e": ["東京カテドラル聖マリア大聖堂", "東京カテドラルマリア大聖堂"],
    "building-2893a6b19010": ["聖墳墓", "聖墳墓教会"],
    "building-0260c34dc1be": ["パリのノートル＝ダム大聖堂", "ノートル＝ダム大聖堂"],
    "building-35a018aea663": ["パンテオン（パリ）", "サント・ジュヌヴィエーヴ教会"],
    "building-c90fcc3d63b9": ["平等院鳳凰堂"],
    "building-4a300426c168": ["法隆寺金堂", "法隆寺五重塔"],
    "building-e103164c6ab5": ["パルテノン"],
    "building-ad7b5b62435c": ["ハギア・ソフィア", "アヤソフィア"],
    "building-b7685f6d8bea": ["水晶宮", "クリスタル・パレス"],
    "building-10afb84fced6": ["ユニテ・ダビタシオン"],
}

def fm(text: str, key: str) -> str:
    m = re.search(rf"^{re.escape(key)}:\s*[\"']?([^\"'\n]+)", text, re.M)
    return m.group(1).strip() if m else ""

def normalized(s: str) -> str:
    return re.sub(r"[\s・·.．,，&＆\-—―()（）「」『』]", "", s).replace("聖堂", "教会堂")

def occurrence_kind(text: str, start: int) -> tuple[str, str]:
    """Classify the occurrence without pretending an option is a correct answer.

    A name printed in a word bank is a confirmed past-exam knowledge point.
    The relation field records its textual source (word bank vs. question stem),
    rather than claiming anything about the source image.
    """
    before = text[:start]
    headings = list(re.finditer(r"(?m)^#{1,6}\s*(.+)$", before))
    heading = headings[-1].group(1).strip() if headings else ""
    if re.search(r"語群|用語群|Group\s*[A-Z0-9]|グループ", heading, re.I):
        return "word-bank", "confirmed"

    line_start = text.rfind("\n", 0, start) + 1
    line_end = text.find("\n", start)
    line = text[line_start : line_end if line_end >= 0 else len(text)]
    # Some OCR output omits the Markdown heading marker on option-bank labels.
    nearby = text[max(0, line_start - 220):line_start]
    if re.search(r"(?:語群|用語群|Group)\s*[A-ZⅠⅡ0-9]*\s*$", nearby, re.I):
        return "word-bank", "confirmed"
    if re.match(r"\s*(?:[a-zA-Z][.．)]|\(?\d+[.)．]|[①-⑳])\s*", line) and "語群" in nearby:
        return "word-bank", "confirmed"
    return "direct", "confirmed"

def excerpt(text: str, start: int, end: int) -> str:
    line_start = text.rfind("\n", 0, start) + 1
    line_end = text.find("\n", end)
    if line_end < 0: line_end = len(text)
    return text[line_start:line_end].strip()[:300]

def main() -> None:
    data = json.loads(ARCH.read_text(encoding="utf-8"))
    links = json.loads(LINKS.read_text(encoding="utf-8"))
    old_map_path = ROOT / "data" / "old-building-name-map.json"
    old_map = json.loads(old_map_path.read_text(encoding="utf-8")) if old_map_path.exists() else {}
    old_aliases: dict[str, list[str]] = {}
    for name, value in old_map.items():
        old_aliases.setdefault(value["buildingId"], []).append(name)

    questions = []
    for path in sorted(QUESTIONS.glob("*.md")):
        if "建筑史" not in path.name and "建築史" not in path.name: continue
        text = path.read_text(encoding="utf-8")
        year = fm(text, "year")
        if not year: continue
        questions.append({"year":int(year), "category":fm(text,"category"), "questionNumber":fm(text,"question_number"), "fileName":path.name, "text":text})

    evidence_by_building: dict[str, list[dict]] = {}
    for building in data["buildings"]:
        bid = building["id"]
        aliases = [building["name"]["ja"], *building.get("aliases", []), *old_aliases.get(bid, []), *MANUAL_ALIASES.get(bid, [])]
        aliases = sorted({a.strip() for a in aliases if len(normalized(a)) >= 4}, key=len, reverse=True)
        found = []
        for q in questions:
            matches = []
            for alias in aliases:
                pos = q["text"].find(alias)
                if pos >= 0: matches.append((pos, alias))
            if not matches: continue
            pos, alias = min(matches, key=lambda x:x[0])
            relation, confidence = occurrence_kind(q["text"], pos)
            found.append({
                "year":q["year"], "category":q["category"], "questionNumber":q["questionNumber"],
                "fileName":q["fileName"], "relation":relation, "matchedAlias":alias,
                "originalText":excerpt(q["text"], pos, pos+len(alias)), "confidence":confidence,
            })
        unique = {(e["year"],e["category"],e["questionNumber"],e["relation"]):e for e in found}
        evidence = sorted(unique.values(), key=lambda e:(e["year"],e["category"],e["questionNumber"]))
        evidence_by_building[bid] = evidence
        building["examEvidence"] = evidence
        # A word-bank item is a tested knowledge point and counts in frequency.
        freq = len(evidence)
        building["importance"]["examFrequency"] = freq
        building["importance"]["examImportance"] = 3 if freq >= 3 else 2 if freq else 1

    for row in links["buildings"]:
        row["examEvidence"] = evidence_by_building.get(row["buildingId"], [])

    all_evidence = [e for rows in evidence_by_building.values() for e in rows]
    stats = {
        "questionFilesScanned": len(questions),
        "buildingQuestionLinks": len(all_evidence),
        "directNameLinks": sum(e["relation"] == "direct" for e in all_evidence),
        "wordBankAppearanceLinks": sum(e["relation"] == "word-bank" for e in all_evidence),
        "buildingsWithEvidence": sum(bool(rows) for rows in evidence_by_building.values()),
        "buildingsOnlyInWordBanks": sum(bool(rows) and all(e["relation"] == "word-bank" for e in rows) for rows in evidence_by_building.values()),
    }
    data["examEvidenceStats"] = stats
    ARCH.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    LINKS.write_text(json.dumps(links,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    out={"version":3,"method":"exact-name occurrences in architecture-history question stems and word banks are counted as confirmed past-exam knowledge-point appearances; relation records the textual source","stats":stats,"buildings":[{"buildingId":b["id"],"nameJa":b["name"]["ja"],"evidence":evidence_by_building[b["id"]]} for b in data["buildings"] if evidence_by_building[b["id"]]]}
    (ROOT/"data"/"past-exam-building-evidence.json").write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    direct_count = lambda x: sum(e["relation"] == "direct" for e in x["evidence"])
    word_bank_count = lambda x: sum(e["relation"] == "word-bank" for e in x["evidence"])
    ranked=sorted(out["buildings"],key=lambda x:(len(x["evidence"]), direct_count(x)),reverse=True)
    lines=["# Past-exam building evidence","",f"- Scanned question files: {stats['questionFilesScanned']}",f"- Direct name appearances: {stats['directNameLinks']}",f"- Word-bank knowledge-point appearances: {stats['wordBankAppearanceLinks']}",f"- Buildings with exam evidence: {stats['buildingsWithEvidence']}","","> Evidence is extracted from text: question stems and word banks in 専門Ⅰ / 専門Ⅱ-2 architecture-history materials.","","## Ranked buildings",""]
    lines += [f"- {x['nameJa']}: total {len(x['evidence'])} (direct {direct_count(x)}, word-bank {word_bank_count(x)})" for x in ranked]
    (ROOT/"data"/"past-exam-building-evidence.md").write_text("\n".join(lines)+"\n",encoding="utf-8")
    print(stats)

if __name__ == "__main__": main()
