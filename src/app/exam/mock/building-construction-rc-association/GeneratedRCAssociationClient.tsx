"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarLayout } from "@/components/layout";

type Item = { id: string; prompt: string; answer: string };
type Data = { items: Item[]; wordBank: string[]; status: string; prototypeId: string; primaryDomain: string };

export default function GeneratedRCAssociationClient({ data }: { data: Data }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const correct = data.items.filter((item) => answers[item.id] === item.answer).length;
  const choose = (itemId: string, word: string) => setAnswers((current) => {
    const next = { ...current };
    for (const [id, selected] of Object.entries(next)) if (id !== itemId && selected === word) delete next[id];
    next[itemId] = word;
    return next;
  });
  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回模拟组卷</Link>
    <div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold">建筑构法 · RC 构造语群题</h1><p className="mt-1 text-sm text-slate-500">新生成题 · 2017 一对一语群结构 · 单一题域：RC 构造</p><p className="mt-1 text-xs text-amber-700">状态：{data.status}。所有答案均来自已审核事实，仍待最终人工题面审核。</p></div><button onClick={() => setChecked((value) => !value)} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">{checked ? "隐藏核对" : "核对答案"}</button></div>
    <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">【用語群】10 词 · 一对一，不允许复用{checked ? ` · 得分 ${correct}/10` : ""}</p><div className="mt-3 flex flex-wrap gap-1.5">{data.wordBank.map((word) => <span key={word} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">{word}</span>)}</div></section>
    <div className="mt-6 space-y-4">{data.items.map((item, index) => <article key={item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-medium text-slate-800">({index + 1}) {item.prompt}</p><div className="mt-3 flex flex-wrap gap-1.5">{data.wordBank.map((word) => <button key={word} onClick={() => choose(item.id, word)} className={`rounded px-2 py-1 text-xs ${answers[item.id] === word ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{word}</button>)}</div>{checked && <p className={`mt-3 text-sm font-semibold ${answers[item.id] === item.answer ? "text-emerald-700" : "text-amber-700"}`}>答案：{item.answer}{answers[item.id] ? ` · 你的选择：${answers[item.id]}` : " · 尚未选择"}</p>}</article>)}</div>
  </div></main></SidebarLayout>;
}
