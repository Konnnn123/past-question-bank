"use client";
import { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import { saveAttempt } from "@/lib/attempt-records";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";

interface Q {
  id: string; topic: string; relation: string; prompt: string;
  options: string[]; correctIndex: number; correctAnswer: string;
  explanation: string; scores: { technicalAccuracy: number; distractorQuality: number; examFidelity: number };
}

const optionText = (value: string) => value.replace(/^[A-D][.．]\s*/, "");

const TOPIC_LABELS: Record<string, string> = {
  housing: "住宅", school: "学校", hospital: "病院", theater: "劇場",
  library: "図書館", urban: "都市計画", office: "オフィス", welfare: "福祉", general: "一般",
};

export default function PlanningFacilityClient({ questions }: { questions: Q[] }) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const toggle = (id: string) => {
    const next = new Set(revealed); if (next.has(id)) next.delete(id); else next.add(id); setRevealed(next);
  };
  const scorable = questions;
  const score = scorable.filter((question) => answers[question.id] === question.correctIndex).length;
  const submit = () => {
    for (const question of questions) {
      const selected = answers[question.id];
      const result = selected === undefined ? "skipped" : selected === question.correctIndex ? "correct" : "wrong";
      const questionId = `planning-facility:${question.id}`;
      saveAttempt({ questionId, userAnswer: selected === undefined ? "" : optionText(question.options[selected]), correctAnswer: question.correctAnswer, result, confidence: "uncertain" });
      upsertReviewState(questionId, "planning", "planning_facility_fact_recall", {});
      if (result === "correct") markTemporarilyMastered(questionId);
      else applyReviewSchedule(questionId, result === "wrong" ? "wrong" : "uncertain");
    }
    setSubmitted(true);
    setRevealed(new Set(questions.map((question) => question.id)));
  };

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8">
    <div className="mx-auto max-w-3xl">
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><b>deprecated_prototype</b>：安全负向干扰项白名单为 0；本页不属于正式练习入口、完整卷或发布覆盖。</p>
      <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回模拟组卷</Link>
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold">建築計画 · Facility Fact Recall</h1>
          <p className="text-sm text-slate-500">{questions.length} 题 · 跨 {(new Set(questions.map(q=>q.topic))).size} 个 planning topic</p>
        </div>
        <div className="flex gap-2"><button onClick={() => setRevealed(new Set(questions.map(q=>q.id)))} className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700">全部展开</button><button onClick={submit} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">交卷并保存</button></div>
      </div>

      <div className="mt-6 space-y-4">
        {questions.map((q) => {
          const open = revealed.has(q.id);
          return (
            <article key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-violet-100 px-2 py-0.5 font-semibold text-violet-700">{TOPIC_LABELS[q.topic] ?? q.topic}</span>
                  <span className="text-slate-400">{q.relation}</span>
                  <span className="text-slate-400">T:{q.scores.technicalAccuracy} D:{q.scores.distractorQuality} E:{q.scores.examFidelity}</span>
                </div>
                <button onClick={() => toggle(q.id)} className="text-xs text-indigo-600 hover:underline">
                  {open ? "收起" : "查看答案"}
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-800">{q.prompt}</p>

              <div className="mt-3 space-y-1.5">
                {q.options.map((opt, i) => (
                  <button key={i} type="button" onClick={() => { setAnswers((current) => ({ ...current, [q.id]: i })); setSubmitted(false); }} className={`w-full rounded-lg border px-3 py-2 text-left text-sm leading-relaxed ${
                    submitted && i === q.correctIndex ? "border-emerald-400 bg-emerald-50 font-medium" : answers[q.id] === i ? "border-indigo-400 bg-indigo-50" : "border-slate-100 bg-slate-50"
                  }`}>
                    <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                    {optionText(opt)}
                  </button>
                ))}
              </div>

              {open && (
                <p className="mt-2 text-xs text-slate-500">{q.explanation}</p>
              )}
            </article>
          );
        })}
      </div>{submitted && <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">自动核对：{score} / {scorable.length}。作答记录和错题队列已更新。</p>}
    </div>
  </main></SidebarLayout>;
}
