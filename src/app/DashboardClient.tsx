"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import {
  LAST_QUESTION_KEY,
  readStudyRecords,
  STUDY_RECORDS_EVENT,
  type StudyRecordMap,
} from "@/lib/study-records";

const modes = [
  { href: "/explore", icon: "🧭", title: "探索", subtitle: "从兴趣和联系进入", description: "时间轴、知识地图、建筑卡与关系网络。允许跳跃，也随时能回到过去问。", accent: "from-cyan-50 to-sky-100", button: "开始漫游" },
  { href: "/exam/past", icon: "📚", title: "试题库", subtitle: "从完整试题进入", description: "收纳真实过去问；未来的模拟试题也会从这里进入，并保留出题依据。", accent: "from-amber-50 to-orange-100", button: "浏览试题" },
  { href: "/practice", icon: "✍️", title: "练习", subtitle: "按知识类别拆开训练", description: "从各科知识地图进入题目与分类练习，用作答暴露真正的缺口。", accent: "from-violet-50 to-fuchsia-100", button: "开始练习" },
  { href: "/review", icon: "↺", title: "复习", subtitle: "闭卷提取与错题回流", description: "复盘 PDF、Notion、知识地图与过去问错题，并安排下一轮复习。", accent: "from-emerald-50 to-teal-100", button: "进入复习" },
];

export default function DashboardClient({ totalQuestions, questionIds }: { totalQuestions: number; questionIds: string[] }) {
  const [records, setRecords] = useState<StudyRecordMap>({});
  const [lastQuestionId, setLastQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setRecords(readStudyRecords());
      setLastQuestionId(localStorage.getItem(LAST_QUESTION_KEY));
    };
    sync();
    window.addEventListener(STUDY_RECORDS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STUDY_RECORDS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const counts = useMemo(() => Object.values(records).reduce(
    (result, record) => ({ ...result, [record.status]: result[record.status] + 1 }),
    { correct: 0, wrong: 0, uncertain: 0, later: 0 },
  ), [records]);

  const attempted = Object.keys(records).length;

  return (
    <SidebarLayout>
      <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_#ecfeff,_transparent_35%),radial-gradient(circle_at_top_right,_#fff7ed,_transparent_32%)] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-6 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-teal-700">建筑考试学习中心</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">今天想从哪里进入？</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">可以先沿着一条有趣的知识路径漫游，也可以直接做题。探索、考试与复习共享同一批知识，不是三套孤立系统。</p>
            </div>
            {lastQuestionId && questionIds.includes(lastQuestionId) && (
              <Link href={`/question/${encodeURIComponent(lastQuestionId)}`} className="shrink-0 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5">
                继续上次题目 →
              </Link>
            )}
          </header>

          <Link href="/self-assessment" className="group mt-6 flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-xl">◎</span>
              <div><p className="text-xs font-bold tracking-[0.16em] text-amber-700">9月1日考试 · 一个月执行工作台</p><h2 className="mt-1 text-lg font-black text-slate-950">今天任务、状态降级、每日记录与每周复盘</h2><p className="mt-1 text-sm text-slate-600">五周计划与53项能力自评已经合并，所有记录自动保存在本地。</p></div>
            </div>
            <span className="shrink-0 text-sm font-bold text-slate-900">进入今日计划 <span className="inline-block transition group-hover:translate-x-1">→</span></span>
          </Link>

          <section className="grid gap-4 py-8 md:grid-cols-2 xl:grid-cols-4">
            {modes.map((mode) => (
              <Link key={mode.href} href={mode.href} className={`group rounded-3xl border border-white/80 bg-gradient-to-br ${mode.accent} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}>
                <div className="text-3xl">{mode.icon}</div>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{mode.subtitle}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{mode.title}</h2>
                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{mode.description}</p>
                <p className="mt-6 text-sm font-semibold text-slate-900">{mode.button} <span className="inline-block transition group-hover:translate-x-1">→</span></p>
              </Link>
            ))}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">当前学习足迹</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">真实状态，不虚构掌握率</h2>
              </div>
              <p className="text-sm text-slate-500">已留下记录 {attempted} / {totalQuestions} 题</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                ["题目总数", totalQuestions, "text-slate-900"],
                ["答对", counts.correct, "text-emerald-700"],
                ["错题", counts.wrong, "text-rose-700"],
                ["不确定", counts.uncertain, "text-amber-700"],
                ["稍后再做", counts.later, "text-violet-700"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SidebarLayout>
  );
}
