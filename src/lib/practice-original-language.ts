import { ORIGINAL_LANGUAGE_TERMS } from "@/lib/original-language-terms";

type Gloss = { ja: string; original: string };

// The history glossary already covers names, styles, and movements.  These
// common technical terms occur in the other three subjects, where a Japanese
// katakana spelling is otherwise easy to lose track of.
const SUBJECT_GLOSSARY: Gloss[] = [
  { ja: "カーテンウォール", original: "curtain wall" },
  { ja: "キングポストラス", original: "king-post truss" },
  { ja: "コンクリート", original: "concrete" },
  { ja: "コミュニティ", original: "community" },
  { ja: "スーパーマーケット", original: "supermarket" },
  { ja: "スタフナ", original: "stiffener" },
  { ja: "スランプ", original: "slump" },
  { ja: "タワー", original: "tower" },
  { ja: "テーブル", original: "table" },
  { ja: "ブロック", original: "block" },
  { ja: "ボルト", original: "bolt" },
  { ja: "ホテル", original: "hotel" },
  { ja: "マンセル", original: "Munsell" },
  { ja: "ミーティング", original: "meeting" },
  { ja: "モーメント", original: "moment" },
  { ja: "モデル", original: "model" },
  { ja: "ヤング", original: "Young" },
  { ja: "エネルギー", original: "energy" },
  { ja: "ガス", original: "gas" },
  { ja: "シェル", original: "shell" },
  { ja: "ペイント", original: "paint" },
];

const hasKatakana = (value: string) => /[\u30a1-\u30ff]/u.test(value);

const glosses = [
  ...ORIGINAL_LANGUAGE_TERMS.flatMap((term) =>
    [term.ja, ...(term.aliases ?? [])]
      .filter(hasKatakana)
      .map((ja) => ({ ja, original: term.original })),
  ),
  ...SUBJECT_GLOSSARY,
]
  .filter(({ ja, original }) => ja.trim() && original.trim())
  .sort((a, b) => b.ja.length - a.ja.length);

/**
 * Adds the verified original spelling after every katakana term in a practice
 * prompt or answer. This runs on the server so the large glossary is never
 * shipped in the light-practice entry bundle.
 */
export function annotatePracticeOriginalLanguage(text: string) {
  if (!text) return text;

  let result = "";
  let cursor = 0;
  while (cursor < text.length) {
    const match = glosses.find(({ ja }) => text.startsWith(ja, cursor));
    if (!match) {
      result += text[cursor];
      cursor += 1;
      continue;
    }

    result += match.ja;
    const next = text.slice(cursor + match.ja.length);
    if (!next.startsWith(`（${match.original}）`) && !next.startsWith(`(${match.original})`)) {
      result += `（${match.original}）`;
    }
    cursor += match.ja.length;
  }
  return result;
}
