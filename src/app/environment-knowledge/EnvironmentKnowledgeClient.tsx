"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import {
  ENVIRONMENT_FORMULAS,
  ENVIRONMENT_KNOWLEDGE_TOPICS,
} from "@/lib/environment-knowledge";

const colorMap = {
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  violet: "border-violet-200 bg-violet-50 text-violet-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
  orange: "border-orange-200 bg-orange-50 text-orange-800",
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  slate: "border-slate-200 bg-slate-50 text-slate-800",
} as const;

type Props = { questions: Question[] };

export default function EnvironmentKnowledgeClient({ questions }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [formulasHidden, setFormulasHidden] = useState(false);
  const [revealedFormulas, setRevealedFormulas] = useState<Set<string>>(
    () => new Set(),
  );
  const questionByYear = useMemo(
    () => new Map(questions.map((question) => [question.year, question.id])),
    [questions],
  );
  const formulas = useMemo(
    () =>
      selectedTopic === "all"
        ? ENVIRONMENT_FORMULAS
        : ENVIRONMENT_FORMULAS.filter((item) =>
            item.topic.includes(selectedTopic),
          ),
    [selectedTopic],
  );
  const sidebar = (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          建築環境工学 · 知識
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          公式、適用条件、典型的な誤りを一画面で確認。
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">ページ内</p>
        <div className="space-y-1 text-xs">
          <a href="#map" className="block text-slate-600 hover:text-violet-700">
            知识地图
          </a>
          <a
            href="#formulas"
            className="block text-slate-600 hover:text-violet-700"
          >
            核心公式
          </a>
          <a
            href="#workflow"
            className="block text-slate-600 hover:text-violet-700"
          >
            复习流程
          </a>
        </div>
      </div>
      <Link
        href="/environment-knowledge-map"
        className="block text-xs font-medium text-emerald-700 hover:text-emerald-900"
      >
        过去问训练 →
      </Link>
    </div>
  );

  return (
    <SidebarLayout slot={sidebar}>
      <div className="min-h-full bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
          <Link
            href="/practice"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← 返回练习
          </Link>
        </header>
        <main className="mx-auto max-w-6xl space-y-10 px-5 py-8 sm:px-8">
          <section>
            <p className="text-sm font-semibold text-violet-700">
              建築環境工学 · 重点知识与公式
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              从考点到公式的一页地图
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              这页用于做题前的快速建框架和做题后的定向补漏。每一张卡同时写明：会考什么、容易在哪一步出错，以及应该回到哪类过去问练习。
            </p>
          </section>
          <section id="map" className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  七个训练模块
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  先抓 A 级高频模块，再将判断题的散点归回模块。
                </p>
              </div>
              <Link
                href="/environment-knowledge-map"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                进入过去问训练 →
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ENVIRONMENT_KNOWLEDGE_TOPICS.map((item) => (
                <article
                  id={item.id}
                  key={item.id}
                  className={`scroll-mt-24 rounded-2xl border p-5 ${colorMap[item.accent]}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold tracking-wider opacity-70">
                        {item.number} · {item.frequency}
                      </p>
                      <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
                    </div>
                    <span className="rounded-full bg-white/70 px-2 py-1 text-xs font-semibold">
                      {item.years}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold opacity-70">先会这些</p>
                    <ul className="mt-2 space-y-1 text-sm leading-6">
                      {item.focus.map((value) => (
                        <li key={value}>• {value}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-xl border border-white/70 bg-white/55 p-3">
                    <p className="text-xs font-semibold opacity-70">易错条件</p>
                    <ul className="mt-1 space-y-1 text-xs leading-5">
                      {item.traps.map((value) => (
                        <li key={value}>× {value}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="formulas" className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">核心公式卡</h2>
                <p className="mt-1 text-sm text-slate-500">
                  按主题筛选。先遮住公式口头复述，再展开过去问计算。
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedTopic("all")}
                  className={`rounded px-2 py-1 text-xs ${selectedTopic === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  全部
                </button>
                {[
                  "日射",
                  "伝熱",
                  "換気",
                  "照明",
                  "音響",
                  "温熱",
                  "湿気",
                  "設備",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedTopic(item)}
                    className={`rounded px-2 py-1 text-xs ${selectedTopic === item ? "bg-violet-700 text-white" : "bg-violet-50 text-violet-700"}`}
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  data-testid="formula-visibility-toggle"
                  onClick={() => {
                    if (formulasHidden) {
                      setFormulasHidden(false);
                    } else {
                      setRevealedFormulas(new Set());
                      setFormulasHidden(true);
                    }
                  }}
                  className={`rounded px-2 py-1 text-xs font-medium ${formulasHidden ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-800"}`}
                >
                  {formulasHidden ? "显示公式" : "遮住公式"}
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {formulas.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <span className="rounded-full bg-violet-50 px-2 py-1 text-xs text-violet-700">
                      {item.topic}
                    </span>
                  </div>
                  {formulasHidden && !revealedFormulas.has(item.title) ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedFormulas((current) =>
                          new Set(current).add(item.title),
                        )
                      }
                      className="mt-4 w-full rounded-lg bg-slate-950 px-4 py-3 text-left font-mono text-sm text-slate-400 hover:text-emerald-200"
                    >
                      点击显示这一条公式
                    </button>
                  ) : (
                    <div className="mt-4 break-words rounded-lg bg-slate-950 px-4 py-3 font-mono text-sm text-emerald-200">
                      {item.formula}
                    </div>
                  )}
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-800">
                        用于：
                      </span>
                      {item.use}
                    </p>
                    <p className="text-amber-700">
                      <span className="font-semibold">条件：</span>
                      {item.condition}
                    </p>
                  </div>
                  {!!item.referenceYears?.length && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 text-xs">
                      <span className="font-medium text-slate-500">
                        参考过去问：
                      </span>
                      {item.referenceYears.map((year) => {
                        const questionId = questionByYear.get(year);
                        return questionId === undefined ? (
                          <span key={year} className="text-slate-400">
                            {year}
                          </span>
                        ) : (
                          <Link
                            key={year}
                            href={`/question/${encodeURIComponent(questionId)}`}
                            className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-100"
                          >
                            {year} →
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
          <section
            id="workflow"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-bold text-slate-900">
              30 分钟复习循环
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">01 · 5分钟</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  选一个模块，遮住公式默写。
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">02 · 15分钟</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  进入训练页，完成一年度原题。
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">03 · 5分钟</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  展开答案，只记录错误原因。
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">04 · 5分钟</p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  回到公式卡，复述适用条件。
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
}
