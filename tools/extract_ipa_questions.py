from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

import pdfplumber
from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "tmp" / "pdfs"
ASSET_DIR = ROOT / "assets" / "questions"
RENDER_DIR = PDF_DIR / "rendered"
CHOICES = list("アイウエオカキクケコ")
FULLWIDTH_DIGITS = str.maketrans("０１２３４５６７８９", "0123456789")

EXAMS = [
    (2023, "A", "t6hhco0000003zx0-att"),
    (2023, "B", "t6hhco0000003zx0-att"),
    (2024, "A", "eid2eo0000007g1d-att"),
    (2024, "B", "eid2eo0000007g1d-att"),
    (2025, "A", "tbl5kb0000005r9r-att"),
    (2025, "B", "tbl5kb0000005r9r-att"),
]


def file_stem(year: int, section: str) -> str:
    era = {2023: "2023r05", 2024: "2024r06", 2025: "2025r07"}[year]
    return f"{era}_fe_kamoku_{section.lower()}"


def answer_map(path: Path) -> dict[int, str]:
    with pdfplumber.open(path) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    return {int(number): choice for number, choice in re.findall(r"問\s*(\d+)\s+([アイウエオカキクケコ])", text)}


def question_positions(pdf: pdfplumber.PDF, expected: set[int]) -> dict[int, tuple[int, float]]:
    found: dict[int, tuple[int, float]] = {}
    for page_index, page in enumerate(pdf.pages):
        if page_index == 0:
            continue
        for match in page.search(r"問[0-9０-９]+"):
            number = int(match["text"][1:].translate(FULLWIDTH_DIGITS))
            if number in expected and number not in found:
                found[number] = (page_index, float(match["top"]))
    missing = expected - found.keys()
    if missing:
        raise RuntimeError(f"Missing question positions in {pdf.stream.name}: {sorted(missing)}")
    return found


def render_pdf(pdf_path: Path, prefix: Path) -> list[Path]:
    prefix.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["pdftoppm", "-r", "150", "-png", str(pdf_path), str(prefix)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return sorted(prefix.parent.glob(f"{prefix.name}-*.png"))


def clean_text(text: str) -> str:
    lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if re.fullmatch(r"－\s*\d+\s*－", stripped):
            continue
        if stripped == "〔 メ モ 用 紙 〕":
            continue
        lines.append(line.rstrip())
    return "\n".join(lines).strip()


def trim_white(image: Image.Image, margin: int = 20) -> Image.Image:
    white = Image.new("RGB", image.size, "white")
    box = ImageChops.difference(image, white).getbbox()
    if not box:
        return image
    left, top, right, bottom = box
    return image.crop(
        (
            max(0, left - margin),
            max(0, top - margin),
            min(image.width, right + margin),
            min(image.height, bottom + margin),
        )
    )


def extract_exam(year: int, section: str, attachment_dir: str) -> list[dict]:
    stem = file_stem(year, section)
    question_pdf = PDF_DIR / f"{stem}_qs.pdf"
    answers = answer_map(PDF_DIR / f"{stem}_ans.pdf")
    output_dir = ASSET_DIR / str(year) / section.lower()
    output_dir.mkdir(parents=True, exist_ok=True)

    with pdfplumber.open(question_pdf) as pdf:
        positions = question_positions(pdf, set(answers))
        rendered = render_pdf(question_pdf, RENDER_DIR / stem)
        ordered = sorted((page, top, number) for number, (page, top) in positions.items())
        questions = []

        for order_index, (start_page, start_top, number) in enumerate(ordered):
            if order_index + 1 < len(ordered):
                end_page, end_top, _ = ordered[order_index + 1]
            else:
                end_page, end_top = len(pdf.pages), None

            crops = []
            text_parts = []
            for page_index in range(start_page, end_page + 1):
                if page_index >= len(pdf.pages):
                    break
                page = pdf.pages[page_index]
                page_text = page.extract_text() or ""
                if ("メ モ 用 紙" in page_text or "試験問題に記載されている会社名" in page_text) and "問" not in page_text:
                    continue

                top = start_top - 12 if page_index == start_page else 42
                bottom = end_top - 10 if page_index == end_page and end_top is not None else page.height - 65
                if bottom <= top:
                    continue

                cropped_page = page.crop((34, max(0, top), page.width - 34, min(page.height, bottom)))
                extracted = clean_text(cropped_page.extract_text(x_tolerance=2, y_tolerance=3) or "")
                if extracted:
                    text_parts.append(extracted)

                image = Image.open(rendered[page_index]).convert("RGB")
                sx, sy = image.width / page.width, image.height / page.height
                box = (
                    int(34 * sx),
                    int(max(0, top) * sy),
                    int((page.width - 34) * sx),
                    int(min(page.height, bottom) * sy),
                )
                segment = trim_white(image.crop(box))
                if segment.height > 24:
                    crops.append(segment)

            if not crops:
                raise RuntimeError(f"No image crop generated for {year} {section} Q{number}")

            width = max(image.width for image in crops)
            gap = 14
            canvas = Image.new("RGB", (width, sum(image.height for image in crops) + gap * (len(crops) - 1)), "white")
            y = 0
            for image in crops:
                canvas.paste(image, (0, y))
                y += image.height + gap

            relative_image = f"assets/questions/{year}/{section.lower()}/q{number:02d}.webp"
            canvas.save(ROOT / relative_image, "WEBP", quality=88, method=6)

            text = "\n".join(text_parts)
            option_area = text.split("解答群", 1)[-1] if "解答群" in text else text
            detected = [CHOICES.index(choice) + 1 for choice in re.findall(r"(?:^|\s)([アイウエオカキクケコ])(?=\s)", option_area)]
            answer_choice = answers[number]
            option_count = 4 if section == "A" else max([CHOICES.index(answer_choice) + 1, *detected, 4])
            option_count = min(option_count, len(CHOICES))
            source_url = (
                "https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/"
                f"{attachment_dir}/{stem}_qs.pdf"
            )
            questions.append(
                {
                    "id": f"ipa-{year}-{section.lower()}-{number:02d}",
                    "source": "IPA公式公開問題",
                    "sourceUrl": source_url,
                    "year": str(year),
                    "section": f"科目{section}",
                    "category": "アルゴリズム・情報セキュリティ" if section == "B" else "公式公開問題",
                    "title": f"{year}年度 科目{section} 問{number}",
                    "text": text,
                    "image": relative_image,
                    "options": CHOICES[:option_count],
                    "answer": CHOICES.index(answer_choice),
                    "explanation": (
                        f"IPA 官方公布的正确答案是「{answer_choice}」。"
                        "请结合原题中的图表或伪代码复盘；点击“生成解释”可获得中文逐项分析。"
                    ),
                }
            )
        return sorted(questions, key=lambda item: int(item["id"].rsplit("-", 1)[1]))


def write_outputs(questions: list[dict]) -> None:
    data = json.dumps(questions, ensure_ascii=False, indent=2)
    (ROOT / "data" / "ipa-questions.js").write_text(
        f"window.IPA_FE_QUESTIONS = {data};\n", encoding="utf-8"
    )
    assets = [f"./{question['image']}" for question in questions]
    (ROOT / "data" / "ipa-assets.js").write_text(
        f"self.IPA_QUESTION_ASSETS = {json.dumps(assets, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )


def main() -> None:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    questions = []
    for exam in EXAMS:
        questions.extend(extract_exam(*exam))
    write_outputs(questions)
    counts = {}
    for question in questions:
        counts[question["section"]] = counts.get(question["section"], 0) + 1
    print(json.dumps({"total": len(questions), "sections": counts}, ensure_ascii=False))


if __name__ == "__main__":
    main()
