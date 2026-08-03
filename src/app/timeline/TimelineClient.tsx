"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TIMELINE_DATA, type TimelineNode } from "@/lib/timeline-data";
import EraComparisonDetail from "./EraComparisonDetail";
import EraOverviewCard from "./EraOverviewCard";
import VerticalEraTimeline from "./VerticalEraTimeline";
import { UI, type TimelineLanguage } from "./timeline-i18n";

type Lane = "both" | "western" | "eastAsian";
interface Building { id: string; nameJa: string; nameZh: string; nameEn: string; cardIds: string[]; examCount: number; region: "western" | "japan" | "unassigned"; period: string; style: string; imageFile: string | null; }
const STORAGE_KEY = "timeline-language";

export default function TimelineClient({ buildingLinks }: { buildingLinks: Building[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eraParam = searchParams.get("era");
  const initialIndex = Math.max(0, TIMELINE_DATA.findIndex((node) => node.id === eraParam));
  const selectedNode: TimelineNode | null = TIMELINE_DATA[initialIndex] ?? null;
  // Keep the server render and first client render identical.  The persisted
  // preference is restored only after hydration, matching ExploreLanguageProvider.
  const [lang, setLang] = useState<TimelineLanguage>("ja");
  const [lane, setLane] = useState<Lane>("both");
  const [examOnly, setExamOnly] = useState(false);
  const labels = UI[lang];
  useEffect(() => {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "ja" || value === "zh" || value === "en") {
      setLang(value);
    }
  }, []);
  const examCounts = useMemo(() => Object.fromEntries(TIMELINE_DATA.map((node) => [node.id, node.examKeywords.length ? 1 : 0])), []);
  const setLanguage = (value: TimelineLanguage) => { window.localStorage.setItem(STORAGE_KEY, value); setLang(value); };
  const goToIndex = useCallback((index: number) => { const node = TIMELINE_DATA[Math.max(0, Math.min(index, TIMELINE_DATA.length - 1))]; if (!node) return; const params = new URLSearchParams(searchParams.toString()); params.set("era", node.id); router.replace(`?${params}`, { scroll: false }); }, [router, searchParams]);
  const goToId = useCallback((id: string) => { const params = new URLSearchParams(searchParams.toString()); params.set("era", id); router.replace(`?${params}`, { scroll: false }); }, [router, searchParams]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement).tagName)) {
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        goToIndex(initialIndex + (event.key === "ArrowUp" ? -1 : 1));
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [goToIndex, initialIndex]);
  const buildings = useMemo(() => { if (!selectedNode) return []; const ids = new Set(selectedNode.relatedCardIds ?? []); const explicit = new Set(selectedNode.buildingIds ?? []); return buildingLinks.filter((building) => explicit.size ? explicit.has(building.id) : building.cardIds.some((id) => ids.has(id))).filter((building) => !examOnly || building.examCount > 0); }, [buildingLinks, examOnly, selectedNode]);
  const eraTitle = selectedNode ? (lang === "ja" ? selectedNode.century : lang === "zh" ? selectedNode.centuryZh : selectedNode.centuryEn) : "";
  const controls = <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-0.5">{(["ja", "zh", "en"] as const).map((value) => <button key={value} onClick={() => setLanguage(value)} aria-pressed={lang === value} className={`rounded px-2 py-1 text-[10px] font-medium ${lang === value ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}>{value === "ja" ? "日本語" : value === "zh" ? "中文" : "English"}</button>)}</div>;
  return <div className="h-screen overflow-y-auto bg-gray-50"><header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-2 backdrop-blur-sm"><Link href="/explore" className="text-xs text-gray-500 hover:text-gray-900">← {labels.back}</Link><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><h1 className="text-xs font-semibold text-gray-800">{labels.title}</h1><p className="text-[10px] text-gray-400">{labels.timeline}</p></div>{controls}</div></header>
    <div className="mx-auto grid max-w-7xl gap-4 p-3 lg:grid-cols-[240px_320px_minmax(0,1fr)]"><aside className="rounded-xl border border-gray-200 bg-white p-3 lg:sticky lg:top-14 lg:h-[calc(100vh-70px)]"><h2 className="mb-3 text-xs font-bold text-gray-700">{labels.timeline}</h2><VerticalEraTimeline nodes={TIMELINE_DATA} selectedId={selectedNode?.id ?? null} lang={lang} lane={lane} examOnly={examOnly} examCounts={examCounts} onSelect={goToId} onLaneChange={setLane} onExamOnlyToggle={() => setExamOnly((value) => !value)} /></aside>
      <aside className="rounded-xl border border-gray-200 bg-white p-4 lg:sticky lg:top-14 lg:h-fit"><h2 className="mb-3 text-xs font-bold text-gray-700">{labels.overview}</h2><EraOverviewCard node={selectedNode} lang={lang} selectedIndex={initialIndex} totalNodes={TIMELINE_DATA.length} onNavigate={goToIndex} /></aside>
      <main className="min-w-0 rounded-xl border border-gray-200 bg-white p-4"><div className="mb-4 flex items-center gap-2"><div className="h-5 w-1.5 rounded-full bg-violet-500" /><h2 className="text-sm font-bold text-gray-900">{eraTitle} <span className="text-[11px] font-normal text-gray-400">({selectedNode?.year})</span></h2></div><EraComparisonDetail node={selectedNode} lang={lang} buildings={buildings} /></main>
    </div>
  </div>;
}
