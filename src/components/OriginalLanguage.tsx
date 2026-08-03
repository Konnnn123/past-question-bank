import { getOriginalLanguageTerm } from "@/lib/original-language-terms";

type Props = {
  term: string;
  variant?: "block" | "inline";
  className?: string;
};

export default function OriginalLanguage({ term, variant = "block", className = "" }: Props) {
  const entry = getOriginalLanguageTerm(term);
  if (!entry) return null;

  if (variant === "inline") {
    return <span className={`text-xs font-normal text-slate-400 ${className}`} title={`原語 (${entry.language}): ${entry.original}`}>（{entry.original}）</span>;
  }

  return <p className={`mt-1 text-xs tracking-wide text-slate-500 ${className}`} title={`原語 (${entry.language})`}>
    <span className="mr-1 font-medium text-slate-400">原語</span>
    <span className="font-serif">{entry.original}</span>
    <span className="ml-1 text-slate-400">· {entry.language}</span>
  </p>;
}
