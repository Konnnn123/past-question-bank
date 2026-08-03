"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarLayout } from "@/components/layout";

type Item = { id: string; prompt: string; answer: string; domain: string };
type SourceSet = { id: string; source: string; reuseAllowed: boolean; wordBank: string[]; items: Item[] };

export default function BuildingConstructionAssociationClient({ sets, notice }: { sets: SourceSet[]; notice: string }) {
  const [activeSetId, setActiveSetId] = useState(sets[0]?.id ?? "");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const active = sets.find((set) => set.id === activeSetId) ?? sets[0];

  if (!active) return <SidebarLayout><main className="p-8">No source set available.</main></SidebarLayout>;
  const choose = (itemId: string, choice: string) => setSelections((current) => ({ ...current, [itemId]: choice }));
  const correctCount = active.items.filter((item) => selections[item.id] === item.answer).length;

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回题型页面</Link>
    <div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">建筑构法 · 语义关联语群</h1><p className="mt-1 text-sm text-slate-500">Past Exam Reconstruction · 专门1原题结构核验，不是模拟题 Generator</p><p className="mt-1 text-xs text-amber-700">{notice}</p></div><button onClick={() => setRevealed((value) => !value)} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">{revealed ? "隐藏答案" : "核对答案"}</button></div>
    <div className="mt-6 flex flex-wrap gap-2">{sets.map((set) => <button key={set.id} onClick={() => { setActiveSetId(set.id); setRevealed(false); }} className={`rounded-full px-3 py-1.5 text-sm ${set.id === active.id ? "bg-indigo-100 font-semibold text-indigo-800" : "bg-slate-100 text-slate-600"}`}>{set.source}</button>)}</div>
    <section className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-xs font-bold text-slate-500">【用語群】 {active.wordBank.length} 词</p><p className="text-xs text-slate-500">{active.reuseAllowed ? "原题允许同一词重复使用" : "原题为一对一配对"}{revealed ? ` · 已答对 ${correctCount}/${active.items.length}` : ""}</p></div><div className="mt-3 flex flex-wrap gap-1.5">{active.wordBank.map((word) => <span key={word} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">{word}</span>)}</div></section>
    <div className="mt-6 space-y-4">{active.items.map((item, index) => { const selected = selections[item.id]; const isCorrect = selected === item.answer; return <article key={item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-medium text-slate-800">({index + 1}) {item.prompt}</p><div className="mt-3 flex flex-wrap gap-1.5">{active.wordBank.map((word) => <button key={word} onClick={() => choose(item.id, word)} className={`rounded px-2 py-1 text-xs ${selected === word ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{word}</button>)}</div>{revealed && <p className={`mt-3 text-sm font-semibold ${isCorrect ? "text-emerald-700" : "text-amber-700"}`}>答案：{item.answer}{selected ? ` · 你的选择：${selected}` : " · 尚未选择"}</p>}</article>; })}</div>
  </div></main></SidebarLayout>;
}
