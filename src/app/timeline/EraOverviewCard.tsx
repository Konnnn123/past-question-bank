"use client";

import type { TimelineNode } from "@/lib/timeline-data";
import { UI, type TimelineLanguage } from "./timeline-i18n";

function firstSentence(value: string) { return value.split(/[。.!?]/)[0] ?? value; }

export default function EraOverviewCard({ node, lang, selectedIndex, totalNodes, onNavigate }: { node: TimelineNode | null; lang: TimelineLanguage; selectedIndex: number; totalNodes: number; onNavigate: (index: number) => void }) {
  const labels = UI[lang];
  if (!node) return <div className="flex h-64 items-center justify-center text-sm text-gray-400">{labels.noSelection}</div>;
  const social = node.comparison[0];
  const westTags = lang === "ja" ? node.westernTags : lang === "zh" ? node.westernTagsZh : node.westernTagsEn;
  const eastTags = lang === "ja" ? node.eastAsianTags : lang === "zh" ? node.eastAsianTagsZh : node.eastAsianTagsEn;
  const westRegion = lang === "ja" ? node.westernRegionLabel : lang === "zh" ? node.westernRegionLabelZh : node.westernRegionLabelEn;
  const eastRegion = lang === "ja" ? node.easternRegionLabel : lang === "zh" ? node.easternRegionLabelZh : node.easternRegionLabelEn;
  const westSocial = lang === "ja" ? social?.western : lang === "zh" ? social?.westernZh : social?.westernEn;
  const eastSocial = lang === "ja" ? social?.eastAsian : lang === "zh" ? social?.eastAsianZh : social?.eastAsianEn;
  return <div className="flex h-full flex-col">
    <div className="mb-3"><p className="text-xs font-bold tracking-wide text-violet-600">{lang === "ja" ? node.century : lang === "zh" ? node.centuryZh : node.centuryEn}</p><p className="text-[10px] text-gray-400">{node.year}</p></div>
    {[[labels.western, westRegion, westSocial, westTags, "sky"], [labels.japan, eastRegion, eastSocial, eastTags, "amber"]].map(([region, name, summary, tags, color]) => <section key={String(region)} className={`mb-3 rounded-lg border p-3 ${color === "sky" ? "border-sky-200 bg-sky-50/40" : "border-amber-200 bg-amber-50/50"}`}><h3 className="mb-1 text-[11px] font-bold text-gray-800">{region}: {name}</h3><p className="text-[10px] leading-relaxed text-gray-700"><span className="font-medium">{labels.social}: </span>{firstSentence(String(summary ?? ""))}</p><div className="mt-2 flex flex-wrap gap-1">{(tags as string[]).slice(0, 3).map((tag) => <span key={tag} className="rounded border border-white bg-white px-1.5 py-0.5 text-[9px] text-gray-600">{tag}</span>)}</div></section>)}
    <div className="mt-auto flex justify-between border-t pt-3"><button disabled={selectedIndex <= 0} onClick={() => onNavigate(selectedIndex - 1)} className="text-[10px] text-violet-700 disabled:text-gray-300">← {labels.previous}</button><button disabled={selectedIndex >= totalNodes - 1} onClick={() => onNavigate(selectedIndex + 1)} className="text-[10px] text-violet-700 disabled:text-gray-300">{labels.next} →</button></div>
  </div>;
}
