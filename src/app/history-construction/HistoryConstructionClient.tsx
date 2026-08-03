"use client";

import { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import OriginalLanguage from "@/components/OriginalLanguage";
import { useExploreLanguage } from "@/components/ExploreLanguageProvider";
import type { CrossTheme } from "@/lib/history-construction-data";

export default function HistoryConstructionClient({ themes }: { themes: CrossTheme[] }) {
  const { language: lang } = useExploreLanguage();
  const [activeId, setActiveId] = useState(themes[0]?.id ?? "");
  const theme = themes.find((item) => item.id === activeId) ?? themes[0];
  const t = (value: { ja: string; zh: string; en: string }) => value[lang];
  if (!theme) return null;

  return <SidebarLayout>
    <main className="min-h-full bg-slate-50 px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><Link href="/explore" className="mb-3 inline-flex text-sm text-slate-500 hover:text-indigo-700">← {t({ ja: "探索に戻る", zh: "返回探索", en: "Back to Explore" })}</Link><p className="text-xs font-semibold tracking-[0.14em] text-indigo-600">HISTORY × CONSTRUCTION</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{t({ ja: "建築史 × 構法", zh: "建筑史 × 构法", en: "Architectural History × Construction" })}</h1><p className="mt-2 text-sm text-slate-500">{t({ ja: "構法が空間・様式・建築をどう変えたかを、過去問とともに読む。", zh: "从构法如何改变空间、样式和建筑的角度，并结合真题阅读。", en: "Read how construction changes space, style, and buildings alongside past questions." })}</p></div>
        </header>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{themes.map((item, index) => <button key={item.id} onClick={() => setActiveId(item.id)} className={`min-w-48 rounded-xl border p-3 text-left transition ${item.id === theme.id ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"}`}><span className="text-xs opacity-70">0{index + 1}</span><span className="mt-1 block text-sm font-semibold">{t(item.title)}</span></button>)}</div>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white p-5 lg:p-7"><p className="text-sm font-medium text-indigo-600">{t(theme.eyebrow)}</p><h2 className="mt-1 text-2xl font-bold text-slate-900">{t(theme.title)}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t(theme.principle)}</p></div>
          <div className="grid gap-5 p-5 lg:grid-cols-2 lg:p-7">
            <section><h3 className="text-sm font-semibold text-slate-900">{t({ ja: "荷重・構成の流れ", zh: "荷载／构成路径", en: "Load and assembly path" })}</h3><div className="mt-3 flex flex-wrap items-center gap-2">{theme.loadPath.map((item, index) => <span key={item.ja} className="flex items-center gap-2"><span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700">{t(item)}</span>{index < theme.loadPath.length - 1 && <span className="text-indigo-400">→</span>}</span>)}</div><h3 className="mt-7 text-sm font-semibold text-slate-900">{t({ ja: "空間・表現への結果", zh: "对空间／表达的结果", en: "Spatial and expressive result" })}</h3><p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">{t(theme.spatialResult)}</p></section>
            <section><h3 className="text-sm font-semibold text-slate-900">{t({ ja: "歴史的な変化", zh: "历史变化", en: "Historical development" })}</h3><ol className="mt-3 space-y-3 border-l-2 border-indigo-100 pl-4">{theme.historicalSteps.map((step) => <li key={step.label.ja}><p className="text-sm font-semibold text-indigo-700">{t(step.label)}</p><p className="mt-1 text-sm leading-6 text-slate-600">{t(step.note)}</p></li>)}</ol></section>
          </div>
          {theme.caution && <div className="mx-5 mb-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 lg:mx-7">{t({ ja: "注意：", zh: "注意：", en: "Note: " })}{t(theme.caution)}</div>}
          <div className="grid gap-5 p-5 pt-5 lg:grid-cols-2 lg:p-7">
            <section className="rounded-xl border border-slate-200 p-4"><h3 className="text-sm font-semibold text-slate-900">{t({ ja: "歴史側の接続", zh: "历史侧连接", en: "History connections" })}</h3><div className="mt-3 flex flex-wrap gap-2">{theme.historyCards.map((card) => <Link key={card.id} href={`/history#${card.id}`} className="rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 text-xs text-indigo-700 hover:bg-indigo-100">{t(card.name)}{lang === "ja" && <OriginalLanguage term={card.name.ja} variant="inline" className="ml-1" />}</Link>)}</div><div className="mt-4 flex flex-wrap gap-2"><span className="w-full text-xs text-slate-500">{t({ ja: "代表建築", zh: "代表建筑", en: "Key buildings" })}</span>{theme.examples.map((example) => example.buildingId ? <Link key={example.name.ja} href={`/history/buildings/${example.buildingId}`} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-700">{t(example.name)}{lang === "ja" && <OriginalLanguage term={example.name.ja} variant="inline" className="ml-1" />}</Link> : <span key={example.name.ja} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">{t(example.name)}{lang === "ja" && <OriginalLanguage term={example.name.ja} variant="inline" className="ml-1" />}</span>)}</div></section>
            <section className="rounded-xl border border-slate-200 p-4"><h3 className="text-sm font-semibold text-slate-900">{t({ ja: "過去問での見え方", zh: "真题中的考查方式", en: "How it appears in past questions" })}</h3><div className="mt-3 space-y-3 text-sm leading-6"><p><span className="mr-2 rounded bg-rose-50 px-1.5 py-0.5 text-xs font-semibold text-rose-700">{t({ ja: "建築史", zh: "建筑史", en: "History" })}</span>{" "}{t(theme.exam.history)}</p><p><span className="mr-2 rounded bg-orange-50 px-1.5 py-0.5 text-xs font-semibold text-orange-700">{t({ ja: "建築構法", zh: "建筑构法", en: "Construction" })}</span>{" "}{t(theme.exam.construction)}</p></div><a href={theme.notionUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white">{t({ ja: "構法ノートを開く ↗", zh: "打开构法笔记 ↗", en: "Open construction notes ↗" })}</a></section>
          </div>
        </section>
      </div>
    </main>
  </SidebarLayout>;
}
