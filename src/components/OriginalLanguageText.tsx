import { Fragment } from "react";
import { ORIGINAL_LANGUAGE_TERMS, type OriginalLanguageTerm } from "@/lib/original-language-terms";

type Props = {
  text: string;
  enabled?: boolean;
};

type Match = { value: string; term: OriginalLanguageTerm };

// Long names must win over shorter terms contained inside them (for example a
// building name before its city name).  Aliases are included so imported Anki
// wording can still receive the verified original-language label.
const matches: Match[] = ORIGINAL_LANGUAGE_TERMS.flatMap((term) =>
  [term.ja, ...(term.aliases ?? [])].map((value) => ({ value, term })),
).sort((a, b) => b.value.length - a.value.length);

/**
 * Adds a quiet original-language gloss only at the first occurrence of a
 * term in one text block.  It deliberately returns the source text unchanged
 * in Chinese mode and does not parse or alter past-exam question wording.
 */
export default function OriginalLanguageText({ text, enabled = true }: Props) {
  if (!enabled || !text) return <>{text}</>;

  const output: React.ReactNode[] = [];
  const used = new Set<string>();
  let plain = "";
  let cursor = 0;

  const flush = () => {
    if (plain) output.push(plain);
    plain = "";
  };

  while (cursor < text.length) {
    const match = matches.find(({ value, term }) =>
      !used.has(term.ja) && text.startsWith(value, cursor),
    );
    if (!match) {
      plain += text[cursor];
      cursor += 1;
      continue;
    }

    flush();
    used.add(match.term.ja);
    output.push(
      <Fragment key={`${match.term.ja}-${cursor}`}>
        {match.value}
        <span className="ml-1 whitespace-nowrap text-[0.82em] font-normal text-slate-400" title={`原語 (${match.term.language}): ${match.term.original}`}>
          ({match.term.original})
        </span>
      </Fragment>,
    );
    cursor += match.value.length;
  }
  flush();

  return <>{output}</>;
}
