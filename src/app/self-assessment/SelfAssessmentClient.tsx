"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import {
  ASSESSMENT_SCALE,
  ASSESSMENT_SECTIONS,
  EXAM_DATE,
  TOTAL_ASSESSMENT_ITEMS,
} from "@/lib/self-assessment";
import StudyPlanDashboard from "./StudyPlanDashboard";

type Scores = Record<string, number>;
type Notes = Record<string, string>;
type StoredAssessment = {
  scores: Scores;
  notes: Notes;
  dailyHours: string;
  weeklyRest: string;
  updatedAt: string;
};

const STORAGE_KEY = "past-question-self-assessment-v1";

function daysUntilExam() {
  const now = new Date();
  const exam = new Date(`${EXAM_DATE}T00:00:00+08:00`);
  return Math.max(0, Math.ceil((exam.getTime() - now.getTime()) / 86_400_000));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function SelfAssessmentClient() {
  const [scores, setScores] = useState<Scores>({});
  const [notes, setNotes] = useState<Notes>({});
  const [dailyHours, setDailyHours] = useState("");
  const [weeklyRest, setWeeklyRest] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ASSESSMENT_SECTIONS.map((section, index) => [section.id, index === 0])),
  );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredAssessment;
          setScores(parsed.scores ?? {});
          setNotes(parsed.notes ?? {});
          setDailyHours(parsed.dailyHours ?? "");
          setWeeklyRest(parsed.weeklyRest ?? "");
          setUpdatedAt(parsed.updatedAt ?? "");
        }
      } catch {
        // Keep a clean form if local data is malformed.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timestamp = new Date().toISOString();
    const value: StoredAssessment = { scores, notes, dailyHours, weeklyRest, updatedAt: timestamp };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    const statusTimer = window.setTimeout(() => setUpdatedAt(timestamp), 0);
    return () => window.clearTimeout(statusTimer);
  }, [scores, notes, dailyHours, weeklyRest, ready]);

  useEffect(() => {
    const openAssessment = () => {
      window.localStorage.removeItem(STORAGE_KEY);
      setScores({});
      setNotes({});
      setDailyHours("");
      setWeeklyRest("");
      setUpdatedAt("");
      setCopied(false);
      setOpenSections(Object.fromEntries(ASSESSMENT_SECTIONS.map((section, index) => [section.id, index === 0])));
      setAssessmentOpen(true);
    };
    window.addEventListener("open-self-assessment", openAssessment);
    return () => window.removeEventListener("open-self-assessment", openAssessment);
  }, []);

  useEffect(() => {
    if (!assessmentOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAssessmentOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [assessmentOpen]);

  const answered = Object.keys(scores).filter((id) => scores[id] >= 1 && scores[id] <= 5).length;
  const completion = Math.round((answered / TOTAL_ASSESSMENT_ITEMS) * 100);
  const sectionStats = useMemo(() => ASSESSMENT_SECTIONS.map((section) => {
    const values = section.items.map((item) => scores[item.id]).filter(Boolean);
    return {
      ...section,
      answered: values.length,
      average: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
    };
  }), [scores]);
  const weakest = useMemo(() => ASSESSMENT_SECTIONS.flatMap((section) =>
    section.items
      .filter((item) => scores[item.id])
      .map((item) => ({ ...item, section: section.title, score: scores[item.id] })),
  ).sort((a, b) => a.score - b.score || a.section.localeCompare(b.section, "zh-CN")).slice(0, 8), [scores]);

  const exportText = () => {
    const lines = [
      "# 9月1日考试能力自评",
      `填写进度：${answered}/${TOTAL_ASSESSMENT_ITEMS}`,
      `距考试：${daysUntilExam()}天`,
      `平日可学习时间：${dailyHours || "未填写"}`,
      `每周休息/低强度安排：${weeklyRest || "未填写"}`,
      "",
      "评分：1=不熟悉，2=听说过，3=基本会，4=较熟练，5=能限时闭卷用日语准确作答",
    ];
    sectionStats.forEach((section) => {
      lines.push("", `## ${section.title}（${section.japaneseTitle}）`, `均分：${section.average ? section.average.toFixed(1) : "未完成"}`);
      section.items.forEach((item) => lines.push(`- ${scores[item.id] ?? "未评"}分｜${item.title}`));
      if (notes[section.id]?.trim()) lines.push(`备注：${notes[section.id].trim()}`);
    });
    lines.push("", "请根据以上结果，帮我规划从现在到9月1日的学习进程。请优先处理低分且考试权重高的项目，安排每周目标、每日任务模板、真题/模拟题节奏和复盘节点，并留出考前减量与整卷演练时间。");
    return lines.join("\n");
  };

  const copyResults = async () => {
    await navigator.clipboard.writeText(exportText());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const reset = () => {
    if (!window.confirm("确定清空全部评分和备注吗？此操作不能撤销。")) return;
    setScores({});
    setNotes({});
    setDailyHours("");
    setWeeklyRest("");
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SidebarLayout>
      <div className="min-h-full bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_22rem)] px-4 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <StudyPlanDashboard />

          {assessmentOpen && <div role="dialog" aria-modal="true" aria-labelledby="assessment-title" className="fixed inset-0 z-50 bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
            <div className="mx-auto h-full max-w-6xl overflow-y-auto rounded-[2rem] bg-slate-50 shadow-2xl">
              <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur sm:px-7">
                <div><p className="text-xs font-bold text-violet-700">临时自评</p><p className="text-sm text-slate-500">每次打开都会从空白重新开始</p></div>
                <button type="button" onClick={() => setAssessmentOpen(false)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700">关闭 ✕</button>
              </div>
              <div className="p-4 sm:p-7">
          <header className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-950 to-slate-950 px-6 py-7 text-white shadow-xl sm:px-9 sm:py-9">
            <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-bold tracking-[0.22em] text-amber-300">计划依据 · 能力自评</p>
                <h2 id="assessment-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">重新完成53项能力自评</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">本次填写期间会自动保存，方便你完成后复制结果；关闭后计划记录不受影响，再次打开时自评会重新清空。</p>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:w-72">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs text-slate-400">距离考试</p>
                  <p className="mt-1 text-3xl font-black text-amber-300">{daysUntilExam()}<span className="ml-1 text-sm">天</span></p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs text-slate-400">填写进度</p>
                  <p className="mt-1 text-3xl font-black">{completion}<span className="ml-1 text-sm">%</span></p>
                </div>
              </div>
            </div>
          </header>

          <section className="sticky top-0 z-20 -mx-4 mt-5 border-y border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:-mx-8 sm:px-8 lg:mx-0 lg:rounded-2xl lg:border">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-44 flex-1">
                <div className="flex items-center justify-between text-xs font-medium text-slate-500"><span>已评 {answered} / {TOTAL_ASSESSMENT_ITEMS}</span><span>{completion}%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${completion}%` }} /></div>
              </div>
              <button type="button" onClick={copyResults} disabled={!answered} className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300">{copied ? "已复制，回到对话粘贴给我 ✓" : "复制结果给我"}</button>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <h2 className="text-base font-bold text-slate-950">统一评分标准</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-5">
              {ASSESSMENT_SCALE.map((level) => <div key={level.score} className="rounded-2xl border border-amber-100 bg-white p-3"><p className="font-black text-slate-950">{level.score} · {level.short}</p><p className="mt-1 text-xs leading-5 text-slate-500">{level.detail}</p></div>)}
            </div>
          </section>

          <div className="mt-6 space-y-4">
            {sectionStats.map((section) => {
              const isOpen = openSections[section.id];
              return (
                <section key={section.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <button type="button" onClick={() => setOpenSections((current) => ({ ...current, [section.id]: !isOpen }))} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 sm:p-6" aria-expanded={isOpen}>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">{section.icon}</span>
                    <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><span className="text-lg font-black text-slate-950">{section.title}</span><span className="text-sm text-slate-400">{section.japaneseTitle}</span>{section.optional && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">按需填写</span>}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{section.scope}</span></span>
                    <span className="shrink-0 text-right"><span className="block text-lg font-black text-slate-900">{section.average ? section.average.toFixed(1) : "—"}<span className="text-xs font-medium text-slate-400"> / 5</span></span><span className="text-xs text-slate-400">{section.answered}/{section.items.length} 项</span></span>
                    <span className={`text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pb-6 sm:px-6">
                      {section.items.map((item, index) => (
                        <div key={item.id} className="grid gap-4 border-b border-slate-100 py-5 last:border-0 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                          <div>
                            <h3 className="text-sm font-bold text-slate-950"><span className="mr-2 text-slate-300">{String(index + 1).padStart(2, "0")}</span>{item.title}</h3>
                            <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.description}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-400">自测证据：{item.evidence}</p>
                          </div>
                          <div role="radiogroup" aria-label={`${item.title}评分`} className="grid grid-cols-5 gap-1.5 sm:gap-2">
                            {ASSESSMENT_SCALE.map((level) => {
                              const selected = scores[item.id] === level.score;
                              return <button key={level.score} type="button" role="radio" aria-checked={selected} title={`${level.score}分：${level.short}。${level.detail}`} onClick={() => setScores((current) => ({ ...current, [item.id]: level.score }))} className={`flex min-h-12 min-w-12 flex-col items-center justify-center rounded-xl border px-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${selected ? "border-slate-950 bg-slate-950 text-white shadow-md" : "border-slate-200 bg-white text-slate-500 hover:border-amber-400 hover:bg-amber-50 hover:text-slate-950"}`}><span className="text-base">{level.score}</span><span className="hidden whitespace-nowrap sm:block">{level.short}</span></button>;
                            })}
                          </div>
                        </div>
                      ))}
                      <label className="mt-2 block"><span className="text-xs font-bold text-slate-600">这科的具体困难、最近真题表现或想补充的情况</span><textarea value={notes[section.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [section.id]: event.target.value }))} rows={3} placeholder="例如：公式记得，但计算经常单位错；2024 真题只完成了 60%……" className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100" /></label>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <section className="mt-6 grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-2">
            <div><h2 className="text-lg font-black text-slate-950">计划约束</h2><p className="mt-1 text-sm text-slate-500">这两项会决定计划强度，请尽量写真实可持续的时间。</p></div><div className="grid gap-4 sm:grid-cols-2 lg:col-span-2"><label className="text-sm font-bold text-slate-700">每天实际可学习时间<input value={dailyHours} onChange={(event) => setDailyHours(event.target.value)} placeholder="例：平日 4 小时，周末 7 小时" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /></label><label className="text-sm font-bold text-slate-700">每周休息 / 低强度安排<input value={weeklyRest} onChange={(event) => setWeeklyRest(event.target.value)} placeholder="例：周三晚休息，周日半天" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" /></label></div>
          </section>

          {weakest.length > 0 && <section className="mt-6 rounded-3xl bg-slate-900 p-6 text-white sm:p-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.18em] text-amber-300">当前最低分项目</p><h2 className="mt-2 text-2xl font-black">先看见缺口，暂时不要急着平均用力</h2></div><p className="text-xs text-slate-400">完成全部评分后，排序才最有意义</p></div><div className="mt-5 grid gap-2 md:grid-cols-2">{weakest.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black ${item.score <= 2 ? "bg-rose-400 text-slate-950" : "bg-amber-300 text-slate-950"}`}>{item.score}</span><span><span className="block text-xs text-slate-400">{item.section}</span><span className="text-sm font-bold">{item.title}</span></span></div>)}</div></section>}

          <footer className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:flex-row sm:p-6"><div><p className="text-sm font-bold text-slate-900">{completion === 100 ? "自评已完成，可以生成计划了。" : `还剩 ${TOTAL_ASSESSMENT_ITEMS - answered} 项未评。`}</p><p className="mt-1 text-xs text-slate-400">{updatedAt ? `自动保存于 ${formatDate(updatedAt)}` : "正在准备本地保存…"}</p></div><div className="flex gap-3"><button type="button" onClick={reset} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">清空重填</button><button type="button" onClick={copyResults} disabled={!answered} className="rounded-full bg-amber-400 px-6 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">{copied ? "已复制 ✓" : "复制完整结果"}</button></div></footer>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </SidebarLayout>
  );
}
