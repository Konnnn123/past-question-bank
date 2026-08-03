"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { saveStudyStatus, type StudyStatus } from "@/lib/study-records";
import { isTextOnlyPracticePrompt, type LightPracticeQuestion } from "@/lib/light-practice";
import { saveAttempt } from "@/lib/attempt-records";
import { upsertReviewState, applyReviewSchedule, markTemporarilyMastered, reportIssue } from "@/lib/review-states";

const LightPracticeQuestionContent = dynamic(() => import("./LightPracticeQuestionContent"), {
  ssr: false,
  loading: () => <p className="py-4 text-sm text-slate-400">正在载入题目…</p>,
});

const subjects = [
  { value: "建筑史", label: "建筑史", icon: "🏺" },
  { value: "建筑计划", label: "建筑计划", icon: "📐" },
  { value: "建筑环境工学", label: "环境工学", icon: "🌤️" },
  { value: "建筑构法", label: "建筑构法", icon: "🧱" },
] as const;
const amounts = [1, 3, 5, "random"] as const;

type SessionQuestion = {
  id: string; subject: string; year?: number; category: string; label: string;
  prompt: string; answer: string;
  options?: string[]; correctIndex?: number; blueprintId?: string;
  answerExplanation?: string; traceability?: Record<string, unknown>;
  sourceKind: "past-exam";
  sourceQuestionId?: string;
};

const marks: Array<{ value: Exclude<StudyStatus, "unseen">; label: string; style: string }> = [
  { value: "correct", label: "掌握", style: "border-emerald-300 bg-emerald-50 text-emerald-800" },
  { value: "wrong", label: "未掌握", style: "border-rose-300 bg-rose-50 text-rose-800" },
  { value: "uncertain", label: "不确定", style: "border-amber-300 bg-amber-50 text-amber-800" },
  { value: "later", label: "稍后再做", style: "border-violet-300 bg-violet-50 text-violet-800" },
];

const errorTypes = [
  { value: "knowledge_gap", label: "不会" },
  { value: "confusion", label: "概念混淆" },
  { value: "retrieval_failure", label: "想不起来" },
  { value: "language_misread", label: "读题／日语" },
  { value: "numeric_or_unit", label: "数值／单位" },
  { value: "careless", label: "粗心" },
  { value: "source_or_question_issue", label: "题目有问题" },
] as const;

function sample<T>(items: T[], amount: number) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, amount);
}

export default function LightPracticeClient({ questions }: { questions: LightPracticeQuestion[] }) {
  const [subject, setSubject] = useState<(typeof subjects)[number]["value"]>("建筑史");
  const [amount, setAmount] = useState<(typeof amounts)[number]>(3);
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [autoJudged, setAutoJudged] = useState<"correct" | "wrong" | null>(null);
  const [showErrorCause, setShowErrorCause] = useState(false);
  const [results, setResults] = useState<Record<string, Exclude<StudyStatus, "unseen">>>({});
  const [finished, setFinished] = useState(false);

  const pastPool = useMemo<SessionQuestion[]>(() =>
    questions.filter((q) => isTextOnlyPracticePrompt(q.prompt)).map((q) => ({
      id: q.id, subject: q.subject, year: q.year, category: q.category,
      label: q.label, prompt: q.prompt, answer: q.answer,
      options: q.options, correctIndex: q.correctIndex,
      sourceKind: "past-exam" as const, sourceQuestionId: q.sourceQuestionId,
    })), [questions]);

  const pool = pastPool.filter((q) => q.subject === subject);
  const current = session[index];
  const isInteractive = current?.options && current.options.length >= 2;

  const start = () => {
    const n = amount === "random" ? Math.floor(Math.random() * Math.min(5, pool.length)) + 1 : amount;
    setSession(sample(pool, Math.min(n, pool.length))); setIndex(0);
    setRevealed(false); setSelectedOption(null); setFillAnswer(""); setAutoJudged(null);
    setShowErrorCause(false); setResults({}); setFinished(false);
  };

  const handleOptionClick = (optIdx: number) => {
    if (revealed) return;
    setSelectedOption(optIdx);
  };

  const handleSubmit = () => {
    if (!current) return;
    setRevealed(true);

    // Auto-judge for interactive questions
    if (isInteractive && current.correctIndex !== undefined) {
      const isCorrect = selectedOption === current.correctIndex;
      setAutoJudged(isCorrect ? "correct" : "wrong");

      const userAns = selectedOption !== null && current.options
        ? current.options[selectedOption]
        : "(未选择)";
      const correctAns = current.options?.[current.correctIndex] ?? "";

      // Save attempt record
      saveAttempt({
        questionId: current.id,
        userAnswer: userAns,
        correctAnswer: correctAns,
        result: isCorrect ? "correct" : "wrong",
        confidence: "sure",
      });

      // Update review state
      const subj = current.subject;
      const bp = current.blueprintId ?? "";

      if (isCorrect) {
        markTemporarilyMastered(current.id);
        upsertReviewState(current.id, subj, bp, {});
        setResults((v) => ({ ...v, [current.id]: "correct" }));
      } else {
        applyReviewSchedule(current.id, "wrong");
        upsertReviewState(current.id, subj, bp, {});
        setResults((v) => ({ ...v, [current.id]: "wrong" }));
        setShowErrorCause(true);
      }
    }
    // For fill-blank (text input)
    else if (current?.options === undefined && fillAnswer.trim()) {
      const correct = current.answer.trim();
      const userNorm = fillAnswer.trim().replace(/\s+/g, " ").toLowerCase();
      const correctNorm = correct.replace(/\s+/g, " ").toLowerCase();
      const isCorrect = userNorm === correctNorm;

      setAutoJudged(isCorrect ? "correct" : "wrong");
      saveAttempt({
        questionId: current.id,
        userAnswer: fillAnswer.trim(),
        correctAnswer: correct,
        result: isCorrect ? "correct" : "wrong",
        confidence: "sure",
      });

      const subj = current.subject;
      const bp = current.blueprintId ?? "";
      if (isCorrect) {
        markTemporarilyMastered(current.id);
        upsertReviewState(current.id, subj, bp, {});
        setResults((v) => ({ ...v, [current.id]: "correct" }));
      } else {
        applyReviewSchedule(current.id, "wrong");
        upsertReviewState(current.id, subj, bp, {});
        setResults((v) => ({ ...v, [current.id]: "wrong" }));
        setShowErrorCause(true);
      }
    }
  };

  const handleErrorCause = (errorType: string) => {
    if (!current) return;
    setShowErrorCause(false);

    if (errorType === "source_or_question_issue") {
      reportIssue(current.id);
    }
  };

  const mark = (status: Exclude<StudyStatus, "unseen">) => {
    if (!current) return;
    saveStudyStatus(current.id, status);
    setResults((v) => ({ ...v, [current.id]: status }));

    const subj = current.subject;
    const bp = current.blueprintId ?? "";
    if (status === "wrong") {
      applyReviewSchedule(current.id, "wrong");
      upsertReviewState(current.id, subj, bp, {});
    } else if (status === "uncertain") {
      applyReviewSchedule(current.id, "uncertain");
      upsertReviewState(current.id, subj, bp, {});
    } else if (status === "correct") {
      markTemporarilyMastered(current.id);
    }
    advanceOrFinish();
  };

  const advanceOrFinish = () => {
    if (index === session.length - 1) setFinished(true);
    else {
      setIndex((v) => v + 1); setRevealed(false);
      setSelectedOption(null); setFillAnswer(""); setAutoJudged(null);
      setShowErrorCause(false);
    }
  };

  const nextQuestion = () => {
    advanceOrFinish();
  };

  const subjectLabel = subjects.find((s) => s.value === subject)?.label ?? subject;

  return <SidebarLayout><main className="min-h-full bg-violet-50/40 px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl">
    <Link href="/practice" className="text-sm text-slate-500 hover:text-violet-700">← 返回练习</Link>
    <header className="mt-5"><p className="text-sm font-semibold tracking-[0.18em] text-violet-700">真题轻量练习</p><h1 className="mt-2 text-3xl font-bold text-slate-950">只做一个很小的真题回合</h1><p className="mt-3 text-slate-600">题目全部来自历年真题。选择题可点击选项自动判分，填空题可输入答案。</p></header>

    {!session.length ? <section className="mt-8 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm">
      <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">当前练习仅使用历年真题。</p>
      <h2 className="mt-7 font-bold text-slate-900">1. 选择科目</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{subjects.map((item) => { const count = pastPool.filter((q) => q.subject === item.value).length; return <button key={item.value} disabled={!count} onClick={() => setSubject(item.value)} className={`rounded-2xl border p-4 text-left transition disabled:opacity-40 ${subject === item.value ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 hover:border-violet-200"}`}><span className="mr-3 text-xl">{item.icon}</span><span className="font-semibold text-slate-800">{item.label}</span><span className="ml-2 text-xs text-slate-400">{count} 小题</span></button>; })}</div>
      <h2 className="mt-7 font-bold text-slate-900">2. 选择题量</h2><div className="mt-4 flex flex-wrap gap-2">{amounts.map((value) => <button key={value} onClick={() => setAmount(value)} className={`rounded-full border px-5 py-2 text-sm font-medium ${amount === value ? "border-violet-500 bg-violet-600 text-white" : "border-slate-200 text-slate-600"}`}>{value === "random" ? "随机数（1–5）" : `${value} 道题`}</button>)}</div>
      <button onClick={start} disabled={!pool.length} className="mt-7 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">开始轻量练习 →</button>
    </section> : finished ? <section className="mt-8 rounded-3xl border border-violet-100 bg-white p-7 text-center shadow-sm"><p className="text-4xl">✓</p><h2 className="mt-3 text-2xl font-bold">本轮完成</h2><p className="mt-2 text-slate-500">共 {session.length} 题，掌握 {Object.values(results).filter((v) => v === "correct").length} 题，需要再练 {Object.values(results).filter((v) => v !== "correct").length} 题。</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={start} className="rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white">同条件再来一轮</button><button onClick={() => { setSession([]); setFinished(false); }} className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold">重新选择</button></div></section> : current && <section className="mt-8">
      <div className="mb-3 flex justify-between text-sm text-slate-500"><span>{subjectLabel}{current.year ? ` · ${current.year}` : ""}</span><span>{index + 1} / {session.length}</span></div>
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
            真题{current.year ? ` · ${current.year}` : ""}
          </span>
          <span className="px-1 py-1 font-semibold text-violet-600">{current.category} · {current.label}</span>
          {current.blueprintId && <span className="px-1 py-1 text-slate-400">{current.blueprintId}</span>}
        </div>
        <div className="prose prose-slate mt-5 max-w-none"><LightPracticeQuestionContent text={current.prompt} /></div>

        {/* Interactive options */}
        {isInteractive && !revealed && (
          <div className="mt-5 space-y-2">
            {current.options!.map((opt, oi) => (
              <button key={oi} onClick={() => handleOptionClick(oi)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selectedOption === oi
                    ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200 font-medium"
                    : "border-slate-200 hover:border-violet-200"
                }`}>
                <span className="mr-2 font-bold text-violet-600">{String.fromCharCode(65 + oi)}.</span>
                {opt.replace(/^[A-D][.．]\s*/, "")}
              </button>
            ))}
          </div>
        )}

        {/* Fill-blank input */}
        {!isInteractive && current.options === undefined && !revealed && (
          <div className="mt-5">
            <input type="text" value={fillAnswer} onChange={(e) => setFillAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="输入你的答案…"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
        )}

        {/* Submit / Reveal */}
        {!revealed && (
          <button onClick={handleSubmit}
            disabled={isInteractive ? selectedOption === null : !fillAnswer.trim() && !isInteractive}
            className="mt-5 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
            {isInteractive || current.options === undefined ? "提交答案" : "查看答案"}
          </button>
        )}

        {/* Answer display */}
        {revealed && (
          <div className={`mt-5 rounded-2xl border p-4 ${
            autoJudged === "correct" ? "border-emerald-300 bg-emerald-50" :
            autoJudged === "wrong" ? "border-rose-300 bg-rose-50" :
            "border-emerald-200 bg-emerald-50"
          }`}>
            {/* User answer */}
            {autoJudged && (
              <div className="mb-3">
                <p className="text-xs font-bold text-slate-500">你的答案</p>
                <p className={`text-sm font-medium ${autoJudged === "correct" ? "text-emerald-700" : "text-rose-700"}`}>
                  {autoJudged === "correct" ? "✓ 正确" : "✗ 错误"}
                  {selectedOption !== null && current.options && ` — ${current.options[selectedOption]}`}
                  {fillAnswer && ` — ${fillAnswer}`}
                </p>
              </div>
            )}

            <p className="text-xs font-bold text-slate-500">正确答案</p>
            <div className="prose prose-sm mt-1 max-w-none text-slate-800">
              {isInteractive && current.correctIndex !== undefined && current.options
                ? <p className="font-medium">{current.options[current.correctIndex]}</p>
                : <LightPracticeQuestionContent text={current.answer} />
              }
            </div>

            {current.answerExplanation && (
              <div className="mt-2 rounded-lg bg-white/60 p-2">
                <p className="text-xs text-slate-500">{current.answerExplanation}</p>
              </div>
            )}

            {/* Source + blueprint info */}
            {current.traceability && (
              <div className="mt-2 flex flex-wrap gap-1 text-xs text-slate-400">
                <span>来源: {(current.traceability as Record<string,unknown>).originalSource as string ?? "—"}</span>
                <span>·</span>
                <span>蓝图: {current.blueprintId ?? "—"}</span>
              </div>
            )}
          </div>
        )}

        {/* Error cause selector */}
        {showErrorCause && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">为什么错了？</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {errorTypes.map((et) => (
                <button key={et.value} onClick={() => handleErrorCause(et.value)}
                  className="rounded-full border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                  {et.label}
                </button>
              ))}
              <button onClick={() => setShowErrorCause(false)}
                className="rounded-full border border-amber-200 px-3 py-1.5 text-xs text-amber-500 hover:bg-amber-50">
                跳过
              </button>
            </div>
          </div>
        )}

        {current.sourceQuestionId && (
          <Link href={`/question/${encodeURIComponent(current.sourceQuestionId)}`} className="mt-4 inline-flex text-xs text-slate-400 hover:text-violet-700">查看它来自哪道过去问 →</Link>
        )}
      </article>

      {/* Self-assessment mark bar (always shown after reveal, for non-auto-judged) */}
      {revealed && !autoJudged && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-700">看完答案后标记：</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {marks.map((item) => (
              <button key={item.value} onClick={() => mark(item.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${item.style}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Next question button (auto-judged) */}
      {revealed && autoJudged && (
        <div className="mt-4 flex gap-2">
          <button onClick={nextQuestion}
            className="flex-1 rounded-full bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white">
            {index === session.length - 1 ? "查看总结" : "下一题 →"}
          </button>
          {autoJudged === "wrong" && current.blueprintId && (
            <button onClick={() => {
              // Same-type question: re-sample from pool with same blueprint
              const sameType = pool.filter((q) => q.blueprintId === current.blueprintId && q.id !== current.id);
              if (sameType.length) {
                const extra = sample(sameType, 1)[0];
                setSession((s) => [...s.slice(0, index + 1), extra, ...s.slice(index + 1)]);
              }
              nextQuestion();
            }} className="rounded-full border border-violet-300 px-4 py-2.5 text-sm font-medium text-violet-700">
              同类型再来一题
            </button>
          )}
        </div>
      )}

      {/* Report issue button */}
      {revealed && (
        <button onClick={() => { if (current) { reportIssue(current.id); setShowErrorCause(false); } }}
          className="mt-2 text-xs text-slate-400 hover:text-rose-500">
          ⚠ 题目有问题
        </button>
      )}
    </section>}
  </div></main></SidebarLayout>;
}
