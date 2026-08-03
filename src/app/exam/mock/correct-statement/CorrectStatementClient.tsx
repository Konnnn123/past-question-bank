"use client";
import { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";

interface CSQuestion {
  id: string; subject: string; topic: string;
  prompt: string; options: string[]; correctIndex: number;
  explanation: string; scores: { technicalAccuracy: number; distractorQuality: number; examFidelity: number };
}

export default function CorrectStatementClient({ questions }: { questions: CSQuestion[] }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    const next = new Set(revealed); if (next.has(id)) next.delete(id); else next.add(id); setRevealed(next);
  };

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8">
    <div className="mx-auto max-w-3xl">
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"><b>过去问抽样</b>：固定命题包抽样，不是新语义生成题；不计入 Generator coverage。</p>
      <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回模拟组卷</Link>
      <h1 className="mt-2 text-2xl font-bold">正誤判断 · 環境工学 + 建築計画</h1>
      <p className="text-sm text-slate-500">{questions.length} 题 · V2 revision · 全选项同topic · 无标签泄露</p>

      <div className="mt-6 space-y-4">
        {questions.map((q) => {
          const open = revealed.has(q.id);
          return (
            <article key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`rounded px-2 py-0.5 font-semibold ${q.subject === "environment" ? "bg-cyan-100 text-cyan-700" : "bg-violet-100 text-violet-700"}`}>{q.subject === "environment" ? "環境" : "計画"}</span>
                  <span className="text-slate-500">{q.topic}</span>
                  <span className="text-slate-400">T:{q.scores.technicalAccuracy} D:{q.scores.distractorQuality} E:{q.scores.examFidelity}</span>
                </div>
                <button onClick={() => toggle(q.id)} className="text-xs text-indigo-600 hover:underline">
                  {open ? "收起" : "查看答案"}
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-800">{q.prompt}</p>

              <div className="mt-3 space-y-1.5">
                {q.options.map((opt, i) => (
                  <div key={i} className={`rounded-lg border px-3 py-2 text-sm leading-relaxed ${
                    open && i === q.correctIndex ? "border-emerald-400 bg-emerald-50 font-medium" : "border-slate-100 bg-slate-50"
                  }`}>
                    <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {open && i === q.correctIndex && <span className="ml-2 text-xs text-emerald-600">←</span>}
                  </div>
                ))}
              </div>

              {open && (
                <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-xs font-bold text-emerald-700">正解: {q.options[q.correctIndex]}</p>
                  <p className="mt-1 text-xs text-slate-600">{q.explanation}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  </main></SidebarLayout>;
}
