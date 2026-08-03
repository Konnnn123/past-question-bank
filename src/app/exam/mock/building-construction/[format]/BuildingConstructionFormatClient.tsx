"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarLayout } from "@/components/layout";

type Item = { id: string; prompt?: string; answer?: string; choices?: string[]; accepted?: string[]; terms?: string[]; rubric?: string[] };
type Family = { status: string; prototype: { source: string; itemCount?: number; labelCount?: number; pairCount?: number; responseMode?: string }; items: Item[]; wordBank?: string[]; asset?: { path: string; description: string }; reviewMode?: string; distractorRule?: string; assetPolicy?: string };

const titles: Record<string, string> = {
  "shared-word-bank": "構法・共通語群穴埋め",
  "short-answer": "構法・用語短答",
  "inline-four-choice": "構法・文脈別四択穴埋め",
  "diagram-label": "構法・図版ラベル語群",
  "image-form-matching": "構法・構造形式ビジュアル照合",
  "constrained-explanation": "構法・作図説明",
  "comparison-explanation": "構法・対比作図説明"
};

export default function BuildingConstructionFormatClient({ format, family }: { format: string; family: Family }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const isWritten = Boolean(family.reviewMode);
  const correct = family.items.filter((item) => item.answer && answers[item.id] === item.answer).length;
  const choose = (id: string, value: string) => setAnswers((current) => ({ ...current, [id]: value }));

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 模拟题目录</Link>
    <div className="mt-3 flex flex-wrap justify-between gap-3"><div><h1 className="text-2xl font-bold text-slate-900">{titles[format] ?? "建築構法"}</h1><p className="mt-1 text-sm text-slate-600">新生成内容 · 原型：{family.prototype.source}</p><p className="mt-1 text-xs text-slate-500">{family.status}{family.distractorRule ? ` · ${family.distractorRule}` : ""}</p></div>{!isWritten && <button onClick={() => setChecked((value) => !value)} className="h-fit rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">{checked ? "隐藏答案" : "核对答案"}</button>}</div>
    {family.asset && <section className="mt-5 rounded-xl border border-slate-200 p-4"><p className="mb-3 text-xs text-slate-500">{family.asset.description}</p><img src={family.asset.path} alt="Source roof-frame diagram" className="max-h-[460px] w-full rounded-lg object-contain" /></section>}
    {family.assetPolicy && <p className="mt-5 rounded-lg bg-sky-50 p-3 text-xs text-sky-800">{family.assetPolicy}</p>}
    {family.wordBank && <section className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">语群（{family.wordBank.length} 词）</p><div className="mt-2 flex flex-wrap gap-1.5">{family.wordBank.map((word) => <span key={word} className="rounded border bg-white px-2 py-1 text-sm">{word}</span>)}</div></section>}
    <div className="mt-6 space-y-4">{family.items.map((item, index) => <article key={item.id} className="rounded-xl border border-slate-200 p-4"><p className="font-medium text-slate-800">({index + 1}) {item.terms ? item.terms.join(" ／ ") : item.prompt}</p>
      {isWritten ? <><textarea value={responses[item.id] ?? ""} onChange={(event) => setResponses((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="在此输入说明；作图请按题意在答题纸完成。" className="mt-3 min-h-24 w-full rounded border border-slate-300 p-3 text-sm" /> <details className="mt-3 rounded bg-slate-50 p-3 text-sm"><summary className="cursor-pointer font-semibold">人工审核量规</summary><ul className="mt-2 list-disc pl-5 text-slate-600">{item.rubric?.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></details></> : <>
        {item.choices ? <div className="mt-3 flex flex-wrap gap-2">{item.choices.map((choice) => <button key={choice} onClick={() => choose(item.id, choice)} className={`rounded px-3 py-1.5 text-sm ${answers[item.id] === choice ? "bg-indigo-700 text-white" : "bg-slate-100 hover:bg-slate-200"}`}>{choice}</button>)}</div> : item.accepted ? <input value={answers[item.id] ?? ""} onChange={(event) => choose(item.id, event.target.value)} placeholder="输入术语" className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" /> : <select value={answers[item.id] ?? ""} onChange={(event) => choose(item.id, event.target.value)} className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"><option value="">选择答案</option>{family.wordBank?.map((word) => <option key={word} value={word}>{word}</option>)}</select>}
        {checked && item.answer && <p className={`mt-3 text-sm font-semibold ${answers[item.id] === item.answer ? "text-emerald-700" : "text-amber-700"}`}>答案：{item.answer}{answers[item.id] ? ` · 你的选择：${answers[item.id]}` : ""}</p>}
      </>}</article>)}</div>
    {!isWritten && checked && <p className="mt-5 rounded-xl bg-indigo-50 p-4 font-semibold text-indigo-900">得分：{correct} / {family.items.length}</p>}
  </div></main></SidebarLayout>;
}
