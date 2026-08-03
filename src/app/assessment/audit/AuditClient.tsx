"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";

interface AuditQuestion {
  id: string; subject: string; blueprintId: string;
  technicalQuality: number; pedagogicalQuality: number;
  question: { prompt: string; options: string[]; correctIndex: number; answerExplanation: string };
  traceability: {
    originalSource?: string; originalField?: string; extractedFacts?: string[]; confidence?: string;
    roleFixed?: string; distractorRule?: string; round1Issue?: string; fixApplied?: string;
    styleAxisFixed?: string; useType?: string; analysisAxis?: string;
    definitionCleaned?: string; domain?: string; expressionType?: string;
  };
  contract?: {
    answerField?: string; answerSemanticType?: string;
    distractorPeerScores?: Record<string, { score: number; breakdown: string[] }>;
    distractorPeerBasis?: string;
    distractorSources?: Record<string, string>;
    mutatedFormulaType?: string;
  };
}

interface AuditResult {
  id: string;
  factCorrect: boolean | null;
  wordingNatural: boolean | null;
  answerUnique: boolean | null;
  distractorsPlausible: boolean | null;
  difficultyAppropriate: boolean | null;
  examRelevant: boolean | null;
  usefulForReview: boolean | null;
  reviewDecision: string | null;
  reviewerNote: string;
  reviewedAt?: string;
}

const DECISIONS = [
  { value: "approved", label: "✓ 通过", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { value: "rewrite", label: "✎ 重写", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "weak_distractors", label: "△ 干扰弱", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: "questionable_fact", label: "? 事实疑", color: "bg-rose-100 text-rose-700 border-rose-300" },
  { value: "wrong_blueprint", label: "↻ 蓝图错", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "low_value", label: "✕ 低价值", color: "bg-slate-200 text-slate-600 border-slate-300" },
];

const BOOL_FIELDS = [
  { key: "factCorrect", label: "事实正确" },
  { key: "wordingNatural", label: "表达自然" },
  { key: "answerUnique", label: "答案唯一" },
  { key: "distractorsPlausible", label: "干扰合理" },
  { key: "difficultyAppropriate", label: "难度适当" },
  { key: "examRelevant", label: "考试相关" },
  { key: "usefulForReview", label: "有复习价值" },
] as const;

const STORAGE_KEY = "audit-progress-v1";
const SUBJECTS = ["all", "history", "construction", "planning", "environment"] as const;

export default function AuditClient({ questions, bySubject }: {
  questions: AuditQuestion[]; bySubject: Record<string, number>;
}) {
  const [results, setResults] = useState<Record<string, AuditResult>>({});
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState<string>("all");
  const [showReviewed, setShowReviewed] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { results: Record<string, AuditResult>; index: number; filter: string };
        setResults(parsed.results ?? {});
        setIndex(parsed.index ?? 0);
        setFilter(parsed.filter ?? "all");
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  // Auto-save
  const save = useCallback((newResults: Record<string, AuditResult>, newIndex: number, newFilter: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ results: newResults, index: newIndex, filter: newFilter }));
  }, []);

  const filtered = (showReviewed
    ? (filter === "all" ? questions : questions.filter((q) => q.subject === filter))
    : (filter === "all" ? questions : questions.filter((q) => q.subject === filter))
      .filter((q) => !results[q.id]?.reviewDecision)
  );
  const current = filtered[index];
  const reviewed = Object.values(results).filter((r) => r.reviewDecision).length;
  const approved = Object.values(results).filter((r) => r.reviewDecision === "approved").length;

  const updateResult = (field: string, value: unknown) => {
    if (!current) return;
    const updated = {
      ...results,
      [current.id]: {
        ...(results[current.id] ?? {
          id: current.id,
          factCorrect: null, wordingNatural: null, answerUnique: null,
          distractorsPlausible: null, difficultyAppropriate: null,
          examRelevant: null, usefulForReview: null,
          reviewDecision: null, reviewerNote: "",
        }),
        [field]: value,
        reviewedAt: new Date().toISOString(),
      },
    };
    setResults(updated);
    save(updated, index, filter);
  };

  const goTo = (delta: number) => {
    const newIdx = Math.max(0, Math.min(filtered.length - 1, index + delta));
    setIndex(newIdx);
    save(results, newIdx, filter);
  };

  const setFilterAndReset = (f: string) => {
    setFilter(f);
    setIndex(0);
    save(results, 0, f);
  };

  const exportResults = () => {
    const report = filtered.map((q) => {
      const { id: _rid, ...rest } = (results[q.id] ?? { id: "", factCorrect: null, wordingNatural: null, answerUnique: null, distractorsPlausible: null, difficultyAppropriate: null, examRelevant: null, usefulForReview: null, reviewDecision: null, reviewerNote: "" });
      return {
        id: q.id,
        subject: q.subject,
        blueprintId: q.blueprintId,
        technicalQuality: q.technicalQuality,
        pedagogicalQuality: q.pedagogicalQuality,
        ...rest,
      };
    });
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `audit-results-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "a" && e.ctrlKey) { e.preventDefault(); updateResult("reviewDecision", "approved"); goTo(1); }
      if (e.key === "r" && e.ctrlKey) { e.preventDefault(); updateResult("reviewDecision", "rewrite"); goTo(1); }
      if (e.key === "x" && e.ctrlKey) { e.preventDefault(); updateResult("reviewDecision", "low_value"); goTo(1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, current, results, filter]);

  if (!loaded) return <SidebarLayout><main className="p-8"><p className="text-slate-400">加载中…</p></main></SidebarLayout>;
  if (!current) return <SidebarLayout><main className="p-8"><p className="text-slate-400">无匹配题目。当前筛选: {filter}，已审: {reviewed}/{questions.length}</p></main></SidebarLayout>;

  const r = results[current.id];

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-3xl">
    {/* Header */}
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div>
        <Link href="/assessment" className="text-sm text-slate-500 hover:text-indigo-700">← 返回评估</Link>
        <h1 className="mt-2 text-2xl font-bold">题目审计</h1>
      </div>
      <div className="flex gap-2">
        <button onClick={exportResults} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">导出结果</button>
        <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setResults({}); setIndex(0); }}
          className="rounded-full border border-rose-200 px-3 py-2 text-xs text-rose-500">重置</button>
      </div>
    </div>

    {/* Stats bar */}
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <span className="font-bold text-slate-700">{reviewed}/{questions.length} 已审</span>
      <span className="text-emerald-600">通过 {approved}</span>
      <span className="text-slate-400">|</span>
      <span>按科目: {Object.entries(bySubject).map(([s, n]) => `${s}:${n}`).join(" · ")}</span>
      <span className="text-slate-400">|</span>
      <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
        <input type="checkbox" checked={showReviewed} onChange={(e) => setShowReviewed(e.target.checked)} className="h-3 w-3" />
        显示已审
      </label>
    </div>

    {/* Progress bar */}
    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
      <div className="h-1.5 rounded-full bg-indigo-600 transition-all" style={{ width: `${(reviewed / questions.length) * 100}%` }} />
    </div>

    {/* Filter */}
    <div className="mt-4 flex gap-1.5 flex-wrap">
      {SUBJECTS.map((f) => (
        <button key={f} onClick={() => setFilterAndReset(f)}
          className={`rounded-full px-3 py-1 text-xs font-medium ${filter === f ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          {f === "all" ? "全部" : f}
        </button>
      ))}
    </div>

    {/* Keyboard hints */}
    <p className="mt-2 text-xs text-slate-400">快捷键: ← → 导航 · Ctrl+A 通过 · Ctrl+R 重写 · Ctrl+X 低价值</p>

    {/* Question card */}
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">{index + 1}/{filtered.length}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">{current.subject}</span>
        <span className="rounded bg-violet-100 px-2 py-0.5 text-violet-700">{current.blueprintId}</span>
        <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${current.technicalQuality >= 90 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>T{current.technicalQuality}</span>
        <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${current.pedagogicalQuality >= 70 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>P{current.pedagogicalQuality}</span>
      </div>

      <h2 className="mt-3 text-sm font-mono text-slate-400 break-all">{current.id}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{current.question.prompt}</p>

      {/* Options */}
      <div className="mt-4 space-y-1.5">
        {current.question.options.map((opt, oi) => (
          <div key={oi} className={`rounded-lg border px-3 py-2 text-sm leading-relaxed ${oi === current.question.correctIndex ? "border-emerald-400 bg-emerald-50 font-medium" : "border-slate-100 bg-slate-50"}`}>
            <span className="mr-2 font-bold text-slate-500">{String.fromCharCode(65 + oi)}.</span>
            <span>{opt.replace(/^[A-D][.．]\s*/, "")}</span>
          </div>
        ))}
      </div>

      {current.question.answerExplanation && (
        <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">📝 {current.question.answerExplanation}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        <span>来源: {current.traceability?.originalSource ?? current.contract?.answerField ?? "—"}</span>
        <span>可信度: {current.traceability?.confidence ?? "—"}</span>
      </div>
      {/* Round 3B contract traceability */}
      {current.contract && (
        <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs">
          <p className="font-medium text-emerald-800">Contract Trace</p>
          {current.contract.answerField && (
            <p className="text-emerald-700">Answer: {current.contract.answerField} · {current.contract.answerSemanticType}</p>
          )}
          {current.contract.distractorPeerScores && (
            <div className="text-emerald-700">
              Peer Scores:
              {Object.entries(current.contract.distractorPeerScores).map(([k, v]) => (
                <span key={k} className="ml-2"> {k}: {v.score} ({v.breakdown.join(", ")})</span>
              ))}
            </div>
          )}
          {current.contract.distractorPeerBasis && (
            <p className="text-emerald-700">Peer Basis: {current.contract.distractorPeerBasis}</p>
          )}
          {current.contract.distractorSources && (
            <div className="text-emerald-700">
              Sources: {Object.entries(current.contract.distractorSources).map(([k, v]) => `${k}:${v}`).join(" · ")}
            </div>
          )}
        </div>
      )}

      {/* Legacy traceability (fallback) */}
      {!current.contract && (current.traceability?.round1Issue || current.traceability?.fixApplied) && (
        <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs">
          <p className="font-medium text-amber-800">修正追溯</p>
          {current.traceability.round1Issue && <p className="text-amber-700">问题: {current.traceability.round1Issue}</p>}
          {current.traceability.fixApplied && <p className="text-amber-700">修正: {current.traceability.fixApplied}</p>}
        </div>
      )}

      {/* Audit checkboxes */}
      <div className="mt-5 border-t pt-4">
        <p className="text-sm font-bold text-slate-700">审查标记</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {BOOL_FIELDS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:bg-slate-50 rounded px-2 py-1">
              <input type="checkbox"
                checked={r?.[key as keyof AuditResult] === true}
                onChange={(e) => updateResult(key, e.target.checked ? true : null)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div className="mt-4">
        <p className="text-sm font-bold text-slate-700">审查决策</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DECISIONS.map((d) => (
            <button key={d.value} onClick={() => updateResult("reviewDecision", d.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${r?.reviewDecision === d.value ? d.color + " ring-2 ring-offset-1" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <textarea value={r?.reviewerNote ?? ""}
        onChange={(e) => updateResult("reviewerNote", e.target.value)}
        placeholder="审查备注…（如：干扰项 C 时代太远，建议用同时代建筑师代替）" rows={2}
        className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none" />
    </section>

    {/* Navigation */}
    <div className="mt-4 flex items-center justify-between">
      <button onClick={() => goTo(-1)} disabled={index === 0}
        className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium disabled:opacity-30 hover:bg-slate-50">← 上一题</button>
      <span className="text-sm text-slate-400">{index + 1} / {filtered.length}</span>
      <button onClick={() => goTo(1)} disabled={index === filtered.length - 1}
        className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium disabled:opacity-30 hover:bg-slate-50">下一题 →</button>
    </div>

    {/* Quick-jump unreviewed */}
    {!showReviewed && (
      <p className="mt-3 text-center text-sm text-amber-600">仅显示未审查题目 · {filtered.length} 题待审</p>
    )}
  </div></main></SidebarLayout>;
}
