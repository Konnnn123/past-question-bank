"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { saveAttempt } from "@/lib/attempt-records";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";
import { assemblePlanningFullMock, type PlanningFullMockData } from "@/lib/planning-full-mock";
import { LEARNING_METADATA } from "@/lib/learning-metadata";

const normal = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

export default function PlanningFullMockClient({ data }: { data: PlanningFullMockData }) {
  const [seed, setSeed] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const items = useMemo(() => assemblePlanningFullMock(data, seed), [data, seed]);
  const learning = LEARNING_METADATA.planning;
  const score = items.filter((item) => normal(answers[item.id] ?? "") === normal(item.answer)).length;
  const regenerate = () => { setSeed((value) => value + 1); setAnswers({}); setSubmitted(false); };
  const submit = () => {
    items.forEach((item) => {
      const userAnswer = answers[item.id] ?? "";
      const result = !userAnswer ? "skipped" : normal(userAnswer) === normal(item.answer) ? "correct" : "wrong";
      const questionId = `planning-full:${item.id}`;
      saveAttempt({ questionId, userAnswer, correctAnswer: item.answer, result, confidence: "uncertain" });
      upsertReviewState(questionId, "planning", "planning_full_mock", {});
      if (result === "correct") markTemporarilyMastered(questionId);
      else applyReviewSchedule(questionId, result === "wrong" ? "wrong" : "uncertain");
    });
    setSubmitted(true);
  };
  return <SidebarLayout><main className="min-h-full bg-violet-50/30 px-5 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-violet-700">← 模拟题目录</Link>
    <header className="mt-3 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-violet-700">専門1 · 建筑计划</p><h1 className="mt-1 text-3xl font-bold text-slate-950">过去问重建练习</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">完整保留 2023 年専門1建筑计划 Q4 的 20 个已索引小问；不以独立数值事实替换原题的案例与条件。</p></div><button onClick={regenerate} className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700">重新打开本卷</button></header>
    <p className="mt-5 rounded-xl border border-violet-100 bg-white p-4 text-sm text-slate-600"><span className="font-mono font-semibold text-violet-700">过去问重建</span> · {items.length} 道可自动核对题。答案依据为原题答案索引；题目置信度为 {learning.confidence}。</p>
    <div className="mt-6 space-y-4">{items.map((item, index) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex justify-between gap-4 text-xs text-slate-400"><span>({index + 1}) · 过去问重建</span><span>{item.sourceFile} · {item.sourceLocation}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{item.prompt}</p>{item.options ? <div className="mt-3 flex flex-wrap gap-2">{item.options.map((option) => <button key={option} onClick={() => setAnswers((state) => ({ ...state, [item.id]: option }))} className={`rounded px-3 py-1.5 text-sm ${answers[item.id] === option ? "bg-violet-700 text-white" : "bg-slate-100"}`}>{option}</button>)}</div> : <input value={answers[item.id] ?? ""} onChange={(event) => setAnswers((state) => ({ ...state, [item.id]: event.target.value }))} className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="输入答案" />}{submitted && <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><p className={`font-semibold ${normal(answers[item.id] ?? "") === normal(item.answer) ? "text-emerald-700" : "text-amber-700"}`}>答案：{item.answer}</p><p className="mt-2 text-slate-700"><b>考查操作：</b>{learning.cognitive_task}</p><p className="mt-1 text-slate-600"><b>答案依据：</b>{learning.answer_basis}</p><p className="mt-1 text-slate-600"><b>主题：</b>{learning.topic_tags.join(" · ")} · <b>置信度：</b>{learning.confidence}</p></div>}</article>)}</div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><button onClick={submit} className="rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white">交卷并保存作答记录</button>{submitted && <p className="mt-3 font-semibold text-emerald-700">自动核对：{score} / {items.length}。作答记录和错题队列已更新。</p>}</section>
  </div></main></SidebarLayout>;
}
