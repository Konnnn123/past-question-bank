"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { saveAttempt } from "@/lib/attempt-records";
import { assembleEnvironmentRuntimeMock } from "@/lib/environment-runtime-mock";
import type { EnvironmentFormulaFact } from "@/lib/environment-formula-choice-generator";
import type { EnvironmentPhenomenonFact } from "@/lib/environment-phenomenon-wordbank-generator";
import type { EnvironmentCorrectStatementFact } from "@/lib/environment-correct-statement-generator";
import type { EnvironmentRuntimeBlueprint } from "@/lib/environment-runtime-mock";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";
import { LEARNING_METADATA } from "@/lib/learning-metadata";

interface ProductionQuestion {
  id: string;
  subject: string;
  format: string;
  familyId: string;
  prompt: string;
  correctAnswer: string;
  workedSolution: string;
  assumptions: string[];
  examRef: string;
}

function normalized(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export default function EnvCalcClient({ questions, formulaFacts, phenomenonFacts, correctStatementFacts, runtimeBlueprint, blueprintLabel }: { questions: ProductionQuestion[]; formulaFacts: EnvironmentFormulaFact[]; phenomenonFacts: EnvironmentPhenomenonFact[]; correctStatementFacts: EnvironmentCorrectStatementFact[]; runtimeBlueprint: EnvironmentRuntimeBlueprint; blueprintLabel: string }) {
  const [seed, setSeed] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const mock = useMemo(() => assembleEnvironmentRuntimeMock(formulaFacts, seed, phenomenonFacts, correctStatementFacts, runtimeBlueprint), [formulaFacts, phenomenonFacts, correctStatementFacts, runtimeBlueprint, seed]);
  const numericalId = mock.numerical.id;
  const scored = [
    { id: numericalId, answer: mock.numerical.correctAnswer },
    ...mock.formulaChoices.map((question) => ({ id: question.id, answer: question.answer })),
    ...(mock.phenomenonWordBank?.items.map((question) => ({ id: question.id, answer: question.answer })) ?? []),
    ...(mock.correctStatement ? [{ id: mock.correctStatement.id, answer: mock.correctStatement.correctAnswer }] : []),
  ];
  const score = scored.filter((question) => normalized(answers[question.id] ?? "") === normalized(question.answer)).length;
  const learning = LEARNING_METADATA.environmentVentilation;
  const regenerate = () => {
    setSeed((current) => current + 1);
    setAnswers({});
    setSubmitted(false);
  };
  const submit = () => {
    scored.forEach((question) => {
      const userAnswer = answers[question.id] ?? "";
      const result = !userAnswer ? "skipped" : normalized(userAnswer) === normalized(question.answer) ? "correct" : "wrong";
      saveAttempt({ questionId: `environment-runtime:${question.id}`, userAnswer, correctAnswer: question.answer, result, confidence: "uncertain" });
      upsertReviewState(`environment-runtime:${question.id}`, "environment", "environment_runtime_mock", {});
      if (result === "correct") markTemporarilyMastered(`environment-runtime:${question.id}`);
      else applyReviewSchedule(`environment-runtime:${question.id}`, result === "wrong" ? "wrong" : "uncertain");
    });
    setSubmitted(true);
  };

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-3xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 模拟组卷</Link>
    <header className="mt-3 flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-indigo-700">専門1 · 環境工学</p><h1 className="mt-1 text-2xl font-bold text-slate-950">换气公式练习</h1><p className="mt-2 text-sm text-slate-600">本入口仅保留具有明确公式、条件、单位和自动复算的 CO₂ 换气计算。其他环境题型作为原题或量规辅助练习，不计入此生成器。</p></div><button onClick={regenerate} className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700">换一题</button></header>
    <section className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 text-sm text-slate-700">{blueprintLabel} · seed {seed} · 1 道数値計算。提交后会写入作答记录与错题队列。</section>
    <section className="mt-6 space-y-4">
      <article className="rounded-2xl border border-indigo-200 bg-white p-5"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-indigo-700">已验证生成题</span><span className="text-slate-500">{mock.numerical.examRef}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">(1) {mock.numerical.prompt}</p><input value={answers[numericalId] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [numericalId]: event.target.value }))} className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="数値と単位を入力" />{submitted && <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><p className="font-semibold text-emerald-700">答案：{mock.numerical.correctAnswer}</p><p className="mt-2 text-slate-700"><b>考查操作：</b>{learning.cognitive_task}</p><p className="mt-1 text-slate-600"><b>答案依据：</b>{learning.answer_basis}</p><p className="mt-1 text-slate-600"><b>主题：</b>{learning.topic_tags.join(" · ")} · <b>置信度：</b>{learning.confidence}</p></div>}</article>
      {mock.formulaChoices.map((question, index) => <article key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-emerald-700">atomic_fact_generator</span><span className="text-slate-500">{question.templateId} · {question.domain}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">({index + 2}) {question.prompt}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <button key={option} onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))} className={`rounded border px-3 py-2 text-left text-sm ${answers[question.id] === option ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-200 bg-slate-50 text-slate-800"}`}>{option}</button>)}</div>{submitted && <p className="mt-3 text-sm font-semibold text-emerald-700">答案：{question.answer}</p>}</article>)}
    </section>
    {mock.phenomenonWordBank && <section className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/40 p-5"><p className="text-xs font-mono text-sky-700">atomic_fact_generator · phenomenon_to_term · 7 answers / 16 terms</p><div className="mt-3 flex flex-wrap gap-2">{mock.phenomenonWordBank.wordBank.map((term) => <span key={term} className="rounded bg-white px-2 py-1 text-xs text-slate-700">{term}</span>)}</div>{mock.phenomenonWordBank.items.map((question, index) => <label key={question.id} className="mt-4 block text-sm text-slate-800">({index + 1}) {question.prompt}<select value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} className="mt-1 block w-full rounded border border-slate-300 bg-white p-2"><option value="">選択</option>{mock.phenomenonWordBank!.wordBank.map((term) => <option key={term}>{term}</option>)}</select>{submitted && <span className="mt-1 block font-semibold text-emerald-700">答え: {question.answer}</span>}</label>)}</section>}
    {mock.correctStatement && <article className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/40 p-5"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-amber-700">atomic_fact_generator</span><span className="text-slate-500">{mock.correctStatement.templateId} · {mock.correctStatement.domain}</span></div><p className="mt-3 text-sm leading-relaxed text-slate-800">{mock.correctStatement.prompt}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{mock.correctStatement.options.map((option) => <button key={option} onClick={() => setAnswers((current) => ({ ...current, [mock.correctStatement!.id]: option }))} className={`rounded border px-3 py-2 text-left text-sm ${answers[mock.correctStatement!.id] === option ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-200 bg-white text-slate-800"}`}>{option}</button>)}</div>{submitted && <p className="mt-3 text-sm font-semibold text-emerald-700">答え: {mock.correctStatement.correctAnswer}</p>}</article>}
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5"><button onClick={submit} className="rounded-full bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white">交卷并保存作答记录</button>{submitted && <p className="mt-3 font-semibold text-emerald-700">自动核对：{score} / {scored.length}</p>}</section>
    <section className="mt-8 border-t border-slate-200 pt-6"><button onClick={() => setShowReference((current) => !current)} className="text-sm font-semibold text-slate-600 underline">{showReference ? "隐藏" : "查看"}静态计算参考题（question_bank_sampler，不计入 Generator）</button>{showReference && <div className="mt-4 space-y-3">{questions.map((question) => <article key={question.id} className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-mono text-slate-500">question_bank_sampler · {question.examRef}</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{question.prompt}</p><details className="mt-2 text-sm"><summary>参考答案</summary><p className="mt-2 text-emerald-700">{question.correctAnswer}</p><pre className="mt-2 whitespace-pre-wrap text-xs text-slate-600">{question.workedSolution}</pre></details></article>)}</div>}</section>
  </div></main></SidebarLayout>;
}
