"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SidebarLayout } from "@/components/layout";
import { saveStudyStatus } from "@/lib/study-records";
import type { LightPracticeQuestion } from "@/lib/light-practice";

type ExamItem = { id: string; subject: string; prompt: string; answer: string; meta: string };

function sample<T>(items: T[], amount: number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy.slice(0, amount);
}

export default function MockExamClient({ units }: { units: LightPracticeQuestion[] }) {
  const [subject, setSubject] = useState("全部");
  const [amount, setAmount] = useState(10);
  const [exam, setExam] = useState<ExamItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const past = units.map((unit) => ({ id: unit.id, subject: unit.subject, prompt: unit.prompt, answer: unit.answer, meta: `${unit.year} · ${unit.assessmentForm}` }));
  const pool = past.filter((item) => subject === "全部" || item.subject === subject);
  const start = () => { setExam(sample(pool, Math.min(amount, pool.length))); setSubmitted(false); };

  return <SidebarLayout><main className="min-h-full bg-indigo-50/30 px-5 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/practice" className="text-sm text-slate-500 hover:text-indigo-700">← 返回练习</Link>
    <header className="mt-5"><p className="text-sm font-semibold tracking-[0.18em] text-indigo-700">过去问练习</p><h1 className="mt-2 text-3xl font-bold text-slate-950">按原题单元抽样练习</h1><p className="mt-3 text-slate-600">此入口只抽取有来源的过去问重建单元。已验证生成题请使用各科专门入口；旧原型不会出现在这里。</p></header>
    {!exam.length ? <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6"><h2 className="font-bold text-slate-900">1. 范围</h2><div className="mt-3 flex flex-wrap gap-2">{["全部", "建筑史", "建筑计划", "建筑环境工学", "建筑构法"].map((value) => <button key={value} onClick={() => setSubject(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${subject === value ? "bg-indigo-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-indigo-300"}`}>{value === "建筑环境工学" ? "环境工学" : value}</button>)}</div><h2 className="mt-6 font-bold text-slate-900">2. 题量</h2><div className="mt-3 flex gap-2">{[5, 10, 20].map((value) => <button key={value} onClick={() => setAmount(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${amount === value ? "bg-indigo-700 text-white" : "border border-slate-300 bg-white text-slate-700 hover:border-indigo-300"}`}>{value} 题</button>)}</div><button onClick={start} disabled={!pool.length} className="mt-7 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">抽取过去问 →</button></section> : <section className="mt-8"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">{exam.length} 题 · 过去问抽样</p><button onClick={() => { setExam([]); setSubmitted(false); }} className="text-sm text-slate-500">重新选择</button></div><div className="space-y-4">{exam.map((item, index) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded bg-slate-900 px-2 py-1 font-bold text-white">{index + 1}</span><span className="rounded bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">过去问抽样</span><span className="px-1 py-1 text-slate-400">{item.subject} · {item.meta}</span></div><div className="prose prose-sm mt-4 max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{item.prompt}</ReactMarkdown></div>{submitted && <div className="mt-5 rounded-xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">参考答案</p><div className="prose prose-sm mt-2 max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{item.answer}</ReactMarkdown></div><div className="mt-3 flex gap-2"><button onClick={() => saveStudyStatus(item.id, "correct")} className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">掌握</button><button onClick={() => saveStudyStatus(item.id, "wrong")} className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">未掌握</button><button onClick={() => saveStudyStatus(item.id, "uncertain")} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">不确定</button></div></div>}</article>)}</div>{!submitted && <button onClick={() => setSubmitted(true)} className="mt-6 w-full rounded-2xl bg-indigo-700 px-5 py-3 font-semibold text-white">交卷并查看答案</button>}</section>}
  </div></main></SidebarLayout>;
}
