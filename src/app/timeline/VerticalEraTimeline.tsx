"use client";

import { useEffect, useRef } from "react";
import type { TimelineNode } from "@/lib/timeline-data";
import { UI, type TimelineLanguage } from "./timeline-i18n";

type Lane = "both" | "western" | "eastAsian";

export default function VerticalEraTimeline({ nodes, selectedId, lang, lane, examOnly, examCounts, onSelect, onLaneChange, onExamOnlyToggle }: { nodes: TimelineNode[]; selectedId: string | null; lang: TimelineLanguage; lane: Lane; examOnly: boolean; examCounts: Record<string, number>; onSelect: (id: string) => void; onLaneChange: (lane: Lane) => void; onExamOnlyToggle: () => void }) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);
  const labels = UI[lang];
  const laneLabel = (value: Lane) => value === "both" ? labels.both : value === "western" ? labels.western : labels.japan;
  return <nav className="flex h-full flex-col" aria-label={labels.timeline}>
    <div className="mb-4 flex flex-wrap gap-1 px-1">
      {(["both", "western", "eastAsian"] as const).map((value) => <button key={value} onClick={() => onLaneChange(value)} className={`rounded-full border px-2 py-1 text-[10px] ${lane === value ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-500"}`}>{laneLabel(value)}</button>)}
      <button onClick={onExamOnlyToggle} className={`rounded-full border px-2 py-1 text-[10px] ${examOnly ? "border-amber-400 bg-amber-50 text-amber-700" : "border-gray-200 bg-white text-gray-500"}`}>{labels.exam}</button>
    </div>
    <div className="relative flex-1 overflow-y-auto"><div className="absolute bottom-0 left-[9px] top-0 w-px bg-gray-200" />
      {nodes.map((node) => { const selected = node.id === selectedId; const count = examCounts[node.id] ?? 0; return <button key={node.id} ref={selected ? selectedRef : undefined} onClick={() => onSelect(node.id)} className={`relative block w-full border-l-2 py-3 pl-7 pr-2 text-left ${selected ? "border-violet-500 bg-violet-50" : "border-transparent hover:bg-gray-50"}`}>
        <span className={`absolute left-0 top-4 h-[19px] w-[19px] -translate-x-1/2 rounded-full border-2 ${selected ? "border-violet-400 bg-violet-600" : "border-gray-300 bg-white"}`} />
        <span className="text-[11px] font-bold text-gray-800">{node.year}{count > 0 && <span className="ml-1 rounded bg-amber-100 px-1 text-[9px] text-amber-700">{count}</span>}</span>
        {(lane === "both" || lane === "western") && <p className="truncate text-[10px] text-sky-600">{lang === "ja" ? node.westernLabel : lang === "zh" ? node.westernLabelZh : node.westernLabelEn}</p>}
        {(lane === "both" || lane === "eastAsian") && <p className="truncate text-[10px] text-amber-600">{lang === "ja" ? node.eastAsianLabel : lang === "zh" ? node.eastAsianLabelZh : node.eastAsianLabelEn}</p>}
        <p className="truncate text-[9px] text-gray-400">{lang === "ja" ? node.century : lang === "zh" ? node.centuryZh : node.centuryEn}</p>
      </button>; })}
    </div>
  </nav>;
}
