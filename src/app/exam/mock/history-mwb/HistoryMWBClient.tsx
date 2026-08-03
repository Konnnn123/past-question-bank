"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import { saveAttempt } from "@/lib/attempt-records";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";
import type { HistoryImageWordBankFact } from "@/lib/history-image-wordbank-eligibility";
import { generateHistoryImageWordBank } from "@/lib/history-image-wordbank-generator";
import { LEARNING_METADATA } from "@/lib/learning-metadata";

export default function HistoryMWBClient({ facts }: { facts: HistoryImageWordBankFact[] }) {
  const [seed, setSeed] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const set = useMemo(() => generateHistoryImageWordBank(facts, seed), [facts, seed]);
  const score = set.items.reduce((total, item) => total + (["building", "architect"] as const).filter((axis) => answers[`${item.id}:${axis}`] === item.answers[axis]).length, 0);
  const learning = LEARNING_METADATA.historyImageMatching;
  const regenerate = () => { setSeed((value) => value + 1); setAnswers({}); setChecked(false); setSubmitted(false); };
  const submit = () => {
    for (const item of set.items) for (const axis of ["building", "architect"] as const) {
      const questionId = `history-mwb:${seed}:${item.factId}:${axis}`;
      const userAnswer = answers[`${item.id}:${axis}`] ?? "";
      const result = !userAnswer ? "skipped" : userAnswer === item.answers[axis] ? "correct" : "wrong";
      saveAttempt({ questionId, userAnswer, correctAnswer: item.answers[axis], result, confidence: "uncertain" });
      upsertReviewState(questionId, "history", "history_image_multi_wordbank_matching", {});
      if (result === "correct") markTemporarilyMastered(questionId); else applyReviewSchedule(questionId, result === "wrong" ? "wrong" : "uncertain");
    }
    setChecked(true); setSubmitted(true);
  };

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 模拟组卷</Link>
    <div className="mt-2 flex flex-wrap items-start justify-between gap-4"><div>
      <p className="text-sm font-semibold text-indigo-700">已验证生成题 · 建筑史图片—共通语群</p>
      <h1 className="mt-1 text-2xl font-bold">建築史・多語群画像照合</h1>
      <p className="mt-2 text-sm text-slate-600">2019 専門1 建築史 Q5 原型：25 图、2 个 30 词语群、每组 5 个 constrained surplus。seed {seed}</p>
    </div><div className="flex gap-2"><button onClick={regenerate} className="rounded-full border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700">换一组</button><button onClick={() => setChecked((value) => !value)} className="rounded-full border border-indigo-300 px-4 py-2 text-sm font-semibold text-indigo-700">{checked ? "隐藏答案" : "核对答案"}</button><button onClick={submit} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">交卷</button></div></div>

    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{(["building", "architect"] as const).map((axis) => <section key={axis} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-bold text-slate-600">{set.wordBanks[axis].semanticField} · 30 terms</p><div className="mt-2 space-y-1">{set.wordBanks[axis].terms.map((term) => <p key={term} className="text-xs text-slate-800">{term}</p>)}</div></section>)}</div>

    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{set.items.map((item, index) => <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4"><p className="mb-2 text-xs font-bold text-slate-500">({index + 1})</p><div className="flex justify-center rounded-lg bg-slate-100 p-2"><img src={item.image.webPath} alt="建築史画像問題" className="max-h-48 rounded object-contain" /></div>{(["building", "architect"] as const).map((axis) => <label key={axis} className="mt-3 block text-xs font-medium text-slate-700">{set.wordBanks[axis].semanticField}<select value={answers[`${item.id}:${axis}`] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [`${item.id}:${axis}`]: event.target.value }))} className="mt-1 block w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"><option value="">选择术语</option>{set.wordBanks[axis].terms.map((term) => <option key={term}>{term}</option>)}</select>{checked && <span className={`mt-1 block ${answers[`${item.id}:${axis}`] === item.answers[axis] ? "text-emerald-700" : "text-amber-700"}`}>答案：{item.answers[axis]}</span>}</label>)}</article>)}</div>
    {checked && <section className="mt-4 rounded-xl bg-slate-50 p-4 text-sm"><p className="font-semibold text-indigo-700">得分：{score}/50 · validation: {set.validation.passed ? "pass" : "failed"}{submitted ? " · 作答记录和错题队列已更新" : ""}</p><p className="mt-2 text-slate-700"><b>考查操作：</b>{learning.cognitive_task}</p><p className="mt-1 text-slate-600"><b>答案依据：</b>{learning.answer_basis}</p><p className="mt-1 text-slate-600"><b>主题：</b>{learning.topic_tags.join(" · ")} · <b>置信度：</b>{learning.confidence}</p></section>}
  </div></main></SidebarLayout>;
}
