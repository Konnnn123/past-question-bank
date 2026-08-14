from __future__ import annotations

import json
import re
import subprocess
import tempfile
import unicodedata
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "data" / "first-class-architect-planning"
CACHE_DIR = Path(tempfile.gettempdir()) / "codex-first-class-architect-planning-pdfs"


EXAMS = [
    (2025, "令和7年", [4, 2, 1, 3, 4, 2, 2, 3, 1, 2, 3, 4, 4, 1, 4, 4, 2, 2, 1, 3]),
    (2024, "令和6年", [3, 3, 4, 2, 2, 3, 1, 3, 2, 4, 4, 3, 3, 4, 2, 4, 1, 4, 1, 1]),
    (2023, "令和5年", [4, 2, 4, 2, 4, 2, 4, 3, 1, 1, 1, 3, 3, 4, 3, 2, 4, 2, 1, 3]),
    (2022, "令和4年", [3, 3, 2, 2, 3, 4, 4, 1, 1, 2, 4, 4, 4, 1, 4, 3, 1, 2, 3, 2]),
    (2021, "令和3年", [3, 3, 3, 4, 2, 2, 2, 1, 2, 4, 1, 2, 4, 1, 4, 3, 1, 2, 3, 1]),
    (2020, "令和2年", [2, 3, 3, 4, 2, 4, "1・4", 4, 1, 1, 4, 3, 4, 3, 2, 2, 2, 1, 3, 4]),
    (2019, "令和元年", [1, 4, 1, 4, 3, 3, 2, 2, 3, 4, 2, 3, 2, 2, 3, 3, 4, 3, 1, 4]),
    (2018, "平成30年", [3, 1, 4, 2, 3, 3, 1, 2, 1, 1, 1, 2, 4, 3, 1, 2, 3, 3, 4, 4]),
    (2017, "平成29年", [2, 4, 4, 4, 2, 2, 3, 4, 3, 3, 1, 3, 4, 1, 4, 2, 1, 4, 3, 2]),
    (2016, "平成28年", [2, 3, 3, 2, 4, 4, 2, 2, 4, 1, 4, 3, 1, 1, 3, 1, 3, 1, 3, 3]),
]


QUESTION_MARKER = re.compile(r"〔\s*N\s*o\s*[.]\s*(\d+)\s*〕", re.IGNORECASE)
OPTION_MARKER = re.compile(r"(?:^|\n)\s*([1-4])\s*[．.]\s*", re.MULTILINE)
SUBJECT_FOOTER = re.compile(r"学科I{1,2}(?:\s*\([^)]*\))?(?:\s*(?:[―\-⎜|]\s*)?\d+(?:\s*[―\-⎜|])?)?")

QUESTION_OVERRIDES = {
    (2021, 3): {
        "number": 3,
        "sourcePage": 3,
        "prompt": "図に示す日本の歴史的な建築物に関する次の記述のうち、最も不適当なものはどれか。",
        "options": [
            "三重塔の各層に裳階を付け、六つの屋根が交互に出入りする独特の構造を有する建築物である。",
            "貫で軸部を水平方向に固め、挿肘木を重ねて軒の荷重を支える大仏様の建築物である。",
            "主体部の柱と裳階の柱を海老虹梁でつなぎ、組物を柱の上のみならず柱と柱の間にも組んで詰組とする禅宗様の建築物である。",
            "長い束柱を貫で固めた足代によって、急な崖の上に張り出した床を支える懸造の建築物である。",
        ],
    },
}


def official_url(year: int, kind: str) -> str:
    suffix = "-r" if year == 2021 and kind == "gakka1_2" else ""
    return f"https://www.jaeic.or.jp/assets/pdf/shiken/1k/1k-mondai/1k-{year}-1st-{kind}{suffix}.pdf"


def download(year: int, kind: str) -> Path:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    target = CACHE_DIR / f"1k-{year}-{kind}.pdf"
    if target.exists() and target.stat().st_size > 10_000:
        return target
    request = urllib.request.Request(official_url(year, kind), headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        target.write_bytes(response.read())
    return target


def clean_text(value: str) -> str:
    value = SUBJECT_FOOTER.sub(" ", value)
    value = re.sub(r"[\x00-\x1f]", " ", value)
    value = re.sub(r"[●•]+", "", value)
    value = re.sub(r"(?:\s+4){3,}(?=\s|$)", " ", value)
    value = re.sub(r"\s+", " ", value)
    japanese = r"ぁ-んァ-ヶ一-龯々〆ヵヶ"
    value = re.sub(fr"(?<=[{japanese}])\s+(?=[{japanese}])", "", value)
    value = re.sub(r"\s+([。、，．）」』】])", r"\1", value)
    value = re.sub(r"([（「『【])\s+", r"\1", value)
    value = re.sub(r"。\s+[ぁ-ん]{1,5}$", "。", value)
    value = re.sub(r"(?<=。)\s+\d+$", "", value)
    return value.strip()


def extract_pages(pdf_path: Path, year: int) -> list[str]:
    result = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    pages = result.stdout.split("\f")
    return [unicodedata.normalize("NFKC", page) for page in pages]


def verify_official_answers(pdf_path: Path, expected: list[str]) -> str:
    result = subprocess.run(
        ["pdftotext", "-layout", str(pdf_path), "-"],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    text = unicodedata.normalize("NFKC", result.stdout)
    row = re.search(r"学科I\s+([^\r\n]+)", text)
    if not row:
        return "official-pdf-image"
    extracted = re.findall(r"[1-4](?:[・/][1-4])?", row.group(1))[:20]
    if extracted != expected:
        raise ValueError(f"official answer PDF mismatch: expected {expected}, extracted {extracted}")
    return "official-pdf-text"


def planning_question_chunks(pages: list[str]) -> list[tuple[int, int, str]]:
    chunks: dict[int, tuple[int, int, str]] = {}
    found_last_question = False
    for page_number, page_text in enumerate(pages, start=1):
        markers = list(QUESTION_MARKER.finditer(page_text))
        if found_last_question and any(int(marker.group(1)) == 1 for marker in markers):
            break
        for index, marker in enumerate(markers):
            number = int(marker.group(1))
            if number in chunks:
                continue
            end = markers[index + 1].start() if index + 1 < len(markers) else len(page_text)
            chunks[number] = (number, page_number, page_text[marker.end():end])
            if number == 20:
                found_last_question = True
    return [chunks[number] for number in sorted(chunks)]


def parse_question(number: int, page_number: int, chunk: str) -> dict[str, object]:
    chunk = chunk.translate(str.maketrans("₁₂₃₄", "1234"))
    option_markers = list(OPTION_MARKER.finditer(chunk))
    if [int(marker.group(1)) for marker in option_markers[:4]] != [1, 2, 3, 4]:
        found = [marker.group(1) for marker in option_markers[:8]]
        raise ValueError(f"No.{number}: expected option markers 1-4, found {found}")
    option_markers = option_markers[:4]
    prompt = clean_text(chunk[:option_markers[0].start()])
    options = []
    for index, marker in enumerate(option_markers):
        end = option_markers[index + 1].start() if index + 1 < 4 else len(chunk)
        options.append(clean_text(chunk[marker.end():end]))
    if not prompt or any(not option for option in options):
        raise ValueError(f"No.{number}: empty prompt or option")
    if any("(cid:" in value for value in [prompt, *options]):
        raise ValueError(f"No.{number}: unresolved PDF character mapping")
    return {"number": number, "sourcePage": page_number, "prompt": prompt, "options": options}


def render_markdown(exam: dict[str, object], questions: list[dict[str, object]]) -> str:
    lines = [
        f"# {exam['eraLabel']}（{exam['year']}）一級建築士 学科Ⅰ（計画）",
        "",
        f"- 公式問題: {exam['questionHref']}",
        f"- 公式正答: {exam['answerHref']}",
        "- 注記: 問題文・正答は試験実施時点の法令、規格、基準に基づく。",
        "",
    ]
    for question in questions:
        lines.extend([f"## No.{question['number']}", "", str(question["prompt"]), ""])
        lines.extend(f"{index}. {option}" for index, option in enumerate(question["options"], start=1))
        lines.extend(["", f"**公式正答：第 {question['correctOption']} 肢**", ""])
    return "\n".join(lines).rstrip() + "\n"


def import_exam(config: tuple[int, str, list[int | str]], pdf_path: Path, answer_pdf_path: Path) -> tuple[dict[str, object], list[dict[str, object]]]:
    year, era_label, answers = config
    pages = extract_pages(pdf_path, year)
    parsed_by_number = {question["number"]: question for question in (parse_question(*chunk) for chunk in planning_question_chunks(pages))}
    for (override_year, number), question in QUESTION_OVERRIDES.items():
        if override_year == year:
            parsed_by_number[number] = question
    missing = [number for number in range(1, 21) if number not in parsed_by_number]
    if missing:
        raise ValueError(f"{year}: missing planning questions {missing}")
    parsed = [parsed_by_number[number] for number in range(1, 21)]
    normalized_answers = [str(answer) for answer in answers]
    exam = {
        "year": year,
        "eraLabel": era_label,
        "questionHref": official_url(year, "gakka1_2"),
        "answerHref": official_url(year, "gokakukijun"),
        "answers": normalized_answers,
        "answerVerification": verify_official_answers(answer_pdf_path, normalized_answers),
    }
    questions = []
    for question, answer in zip(parsed, exam["answers"], strict=True):
        questions.append({
            "id": f"1k-{year}-{question['number']:02d}",
            "year": year,
            "eraLabel": era_label,
            **question,
            "correctOption": answer,
            "questionHref": exam["questionHref"],
            "answerHref": exam["answerHref"],
        })
    return exam, questions


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    assets = [(year, kind) for year, _, _ in EXAMS for kind in ("gakka1_2", "gokakukijun")]
    with ThreadPoolExecutor(max_workers=5) as executor:
        downloaded = dict(zip(assets, executor.map(lambda asset: download(*asset), assets), strict=True))

    manifest: list[dict[str, object]] = []
    all_questions: list[dict[str, object]] = []
    for config in EXAMS:
        year = config[0]
        exam, questions = import_exam(config, downloaded[(year, "gakka1_2")], downloaded[(year, "gokakukijun")])
        manifest.append(exam)
        all_questions.extend(questions)
        (OUTPUT_DIR / f"{config[0]}.md").write_text(render_markdown(exam, questions), encoding="utf-8")
        print(f"{config[0]}: imported {len(questions)} questions")

    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUTPUT_DIR / "questions.json").write_text(json.dumps(all_questions, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"total: imported {len(all_questions)} questions")


if __name__ == "__main__":
    main()
