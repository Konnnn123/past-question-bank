"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { saveAttempt } from "@/lib/attempt-records";
import { assembleBuildingConstructionMock, type MockBlock, type MockData } from "@/lib/building-construction-mock";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";
import { LEARNING_METADATA } from "@/lib/learning-metadata";

function isCorrect(answer: string, expected: string, accepted?: string[]) {
  return (accepted ?? [expected]).some((value) => answer.trim().toLowerCase() === value.toLowerCase());
}

export default function BuildingConstructionFullMockClient({ data }: { data: MockData }) {
  const [seed, setSeed] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const blocks = useMemo(() => assembleBuildingConstructionMock(data, seed), [data, seed]);
  const scorable = blocks.flatMap((block) => block.mode === "written" ? [] : block.items).filter((item) => item.answer);
  const generatorCount = blocks.filter((block) => block.sourceType === "atomic_fact_generator").flatMap((block) => block.items).length;
  const score = scorable.filter((item) => isCorrect(answers[item.id] ?? "", item.answer ?? "", item.accepted)).length;
  const learning = LEARNING_METADATA.constructionRc;
  const regenerate = () => { setSeed((value) => value + 1); setAnswers({}); setSubmitted(false); };
  const submit = () => {
    scorable.forEach((item) => {
      const userAnswer = answers[item.id] ?? "";
      const questionId = `building-construction-full:${item.id}`;
      const result = userAnswer ? (isCorrect(userAnswer, item.answer ?? "", item.accepted) ? "correct" : "wrong") : "skipped";
      saveAttempt({ questionId, userAnswer, correctAnswer: item.answer ?? "", result, confidence: "uncertain" });
      upsertReviewState(questionId, "building_construction", "building_construction_full", {});
      if (result === "correct") markTemporarilyMastered(questionId);
      else applyReviewSchedule(questionId, result === "wrong" ? "wrong" : "uncertain");
    });
    setSubmitted(true);
  };
  return <SidebarLayout><main className="min-h-full bg-indigo-50/30 px-5 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 模拟题目录</Link>
    <header className="mt-3 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold tracking-wide text-indigo-700">専門1 · 建筑构法</p><h1 className="mt-1 text-3xl font-bold text-slate-950">RC 构法练习</h1><p className="mt-2 max-w-3xl text-sm text-slate-600">仅 RC 共通语群使用已验证的关系约束生成；事实池不可用时，明确回退为 2024 Q3 原题重建。不包含构造力学。</p></div><button onClick={regenerate} className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700">换一组</button></header>
    <section className="mt-5 rounded-xl border border-indigo-100 bg-white p-4 text-sm text-slate-600"><span className="font-semibold text-slate-800">本组：{scorable.length} 道可自动核对题。</span> {generatorCount > 0 ? <><span className="font-mono font-semibold text-indigo-700">已验证生成题</span> · RC 共通语群。</> : <><span className="font-mono font-semibold text-slate-600">过去问重建</span> · 2024 Q3 回退卷。</>}</section>
    <div className="mt-6 space-y-7">{blocks.map((block, blockIndex) => <Block key={block.id} block={block} index={blockIndex + 1} answers={answers} setAnswers={setAnswers} submitted={submitted} />)}</div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5"><button onClick={submit} className="rounded-full bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white">交卷并保存作答记录</button>{submitted && <p className="mt-3 font-semibold text-emerald-700">自动核对：{score} / {scorable.length}。</p>}</section>
  </div></main></SidebarLayout>;
}

function Block({ block, index, answers, setAnswers, submitted }: { block: MockBlock; index: number; answers: Record<string, string>; setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>; submitted: boolean }) {
  const learning = LEARNING_METADATA.constructionRc;
  const choose = (id: string, value: string) => setAnswers((current) => ({ ...current, [id]: value }));
  return <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold text-slate-900">{index}. {block.title}</h2>{block.asset && <><p className="mt-2 text-xs text-slate-500">{block.asset.description}</p><img src={block.asset.path} alt="Source construction diagram" className="mt-3 max-h-[440px] w-full rounded-lg object-contain" /></>}{block.wordBank && <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg bg-slate-50 p-3">{block.wordBank.map((word) => <span key={word} className="rounded border bg-white px-2 py-1 text-xs">{word}</span>)}</div>}<div className="mt-4 space-y-4">{block.items.map((item, itemIndex) => <article key={item.id} className="rounded-xl border border-slate-100 p-4"><p className="font-medium text-slate-800">({itemIndex + 1}) {item.terms ? item.terms.join(" ／ ") : item.prompt}</p>{block.mode === "written" ? <><textarea value={answers[item.id] ?? ""} onChange={(event) => choose(item.id, event.target.value)} className="mt-3 min-h-24 w-full rounded border border-slate-300 p-3 text-sm" placeholder="在此记录文字说明；图请在答题纸完成。" /><details className="mt-3 rounded bg-slate-50 p-3 text-sm"><summary className="cursor-pointer font-semibold">人工审核量规</summary><ul className="mt-2 list-disc pl-5 text-slate-600">{item.rubric?.map((rule) => <li key={rule}>{rule}</li>)}</ul></details></> : block.mode === "input" ? <input value={answers[item.id] ?? ""} onChange={(event) => choose(item.id, event.target.value)} className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="输入术语" /> : block.mode === "choice" ? <div className="mt-3 flex flex-wrap gap-2">{item.choices?.map((choice) => <button key={choice} onClick={() => choose(item.id, choice)} className={`rounded px-3 py-1.5 text-sm ${answers[item.id] === choice ? "bg-indigo-700 text-white" : "bg-slate-100 hover:bg-slate-200"}`}>{choice}</button>)}</div> : <select value={answers[item.id] ?? ""} onChange={(event) => choose(item.id, event.target.value)} className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"><option value="">选择答案</option>{block.wordBank?.map((word) => <option key={word} value={word}>{word}</option>)}</select>}{submitted && item.answer && <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm"><p className={`font-semibold ${isCorrect(answers[item.id] ?? "", item.answer, item.accepted) ? "text-emerald-700" : "text-amber-700"}`}>答案：{item.answer}</p><p className="mt-2 text-slate-700"><b>考查操作：</b>{learning.cognitive_task}</p><p className="mt-1 text-slate-600"><b>答案依据：</b>{learning.answer_basis}</p><p className="mt-1 text-slate-600"><b>主题：</b>{learning.topic_tags.join(" · ")} · <b>置信度：</b>{learning.confidence}</p></div>}</article>)}</div></section>;
}
