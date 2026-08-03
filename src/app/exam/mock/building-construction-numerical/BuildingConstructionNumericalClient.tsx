"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarLayout } from "@/components/layout";

type Question = {
  id: string;
  subRelationId?: "8.1" | "8.2";
  propertyFamily?: "youngs_modulus" | "linear_thermal_expansion";
  prompt: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  workedSolution: string;
  assumptions: string[];
  examRef: string;
  reasoningSteps: number;
};

function labelFor(question: Question) {
  if (question.propertyFamily === "linear_thermal_expansion") return "材料 → 線膨張係数（2020）";
  if (question.propertyFamily === "youngs_modulus") return "材料 → ヤング係数";
  return question.subRelationId === "8.1" ? "材料 → 密度" : "材料 → 強度";
}

export default function BuildingConstructionNumericalClient({ questions }: { questions: Question[] }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setRevealed((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <SidebarLayout>
      <main className="min-h-full bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回模拟组卷</Link>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">建筑构法 · 材料数值题</h1>
              <p className="mt-1 text-sm text-slate-500">{questions.length} 题 · 8.1 密度、8.2 强度与许容应力度、杨氏模量</p>
              <p className="mt-1 text-xs text-slate-400">干扰项只来自同一性质与单位；强度/许容应力度与杨氏模量绝不共用选项池，不含线膨胀或构造力学内容。</p>
            </div>
            <button onClick={() => setRevealed(new Set(questions.map((q) => q.id)))} className="shrink-0 rounded-full bg-indigo-700 px-3 py-1.5 text-xs font-semibold text-white">全部展开</button>
          </div>
          <div className="mt-6 space-y-4">
            {questions.map((question) => {
              const isOpen = revealed.has(question.id);
              return (
                <article key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded bg-violet-100 px-2 py-0.5 font-semibold text-violet-700">{labelFor(question)}</span>
                      <span className="text-slate-400">数值选择 · {question.reasoningSteps} steps</span>
                    </div>
                    <button onClick={() => toggle(question.id)} className="shrink-0 text-xs text-indigo-600 hover:underline">{isOpen ? "收起" : "查看答案"}</button>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{question.prompt}</p>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {question.options.map((option, index) => <div key={option} className={`rounded-lg border px-3 py-2 text-sm ${isOpen && index === question.correctIndex ? "border-emerald-300 bg-emerald-50 font-medium text-emerald-900" : "border-slate-100 bg-slate-50 text-slate-700"}`}>{String.fromCharCode(65 + index)}. {option}</div>)}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">出题根据: {question.examRef}</p>
                  {isOpen && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">解答: {question.correctAnswer}</p><pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white/80 p-3 font-mono text-xs leading-relaxed text-slate-700">{question.workedSolution}</pre><p className="mt-3 text-xs text-slate-500">前提: {question.assumptions.join("、")}</p></div>}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
