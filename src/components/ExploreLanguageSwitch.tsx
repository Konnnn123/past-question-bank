"use client";

import { usePathname } from "next/navigation";
import { useExploreLanguage, type ExploreLanguage } from "./ExploreLanguageProvider";

const labels: Record<ExploreLanguage, string> = { zh: "中文", ja: "日本語", en: "English" };

export default function ExploreLanguageSwitch() {
  const pathname = usePathname();
  const { language, setLanguage } = useExploreLanguage();
  const supportsLanguageSwitch =
    pathname === "/explore" ||
    pathname === "/history/library" ||
    pathname === "/history/topics" ||
    pathname.startsWith("/history/essay-framework") ||
    pathname === "/history-construction" ||
    pathname.startsWith("/current-topics");
  if (!supportsLanguageSwitch) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex rounded-xl border border-slate-200 bg-white p-1 shadow-md" aria-label="Language selector">
      {(Object.keys(labels) as ExploreLanguage[]).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${language === option ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          aria-pressed={language === option}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
