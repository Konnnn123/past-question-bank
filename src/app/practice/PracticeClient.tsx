"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarLayout } from "@/components/layout";

type Locale = "zh" | "ja";

const practiceMaps = [
  { href: "/architecture-history-knowledge-map", icon: "🏺", titleZh: "建筑史", titleJa: "建築史", descriptionZh: "按历史考点与过去问关系进行拆分练习", descriptionJa: "歴史の論点と過去問の関係から分解して練習する" },
  { href: "/planning-knowledge-map", icon: "📐", titleZh: "建筑计划", titleJa: "建築計画", descriptionZh: "建筑类型、平面与解答练习", descriptionJa: "建築類型・平面・解答形式を練習する" },
  { href: "/environment-knowledge-map", icon: "🌤️", titleZh: "环境工学", titleJa: "環境工学", descriptionZh: "按主题训练环境工学过去问", descriptionJa: "テーマ別に環境工学の過去問を練習する" },
  { href: "/construction-methods-knowledge-map", icon: "🧱", titleZh: "建筑构法", titleJa: "建築構法", descriptionZh: "材料、部材与工法的分类练习", descriptionJa: "材料・部材・工法の分類と識別を練習する" },
  { href: "/knowledge-map", icon: "🏗️", titleZh: "结构力学", titleJa: "構造力学", descriptionZh: "按概念与题型定位结构练习", descriptionJa: "概念と問題形式から力学練習へ進む" },
  { href: "/practice/first-class-planning", icon: "📝", titleZh: "一级建筑师真题", titleJa: "一級建築士過去問", descriptionZh: "2016～2025 学科Ⅰ（计划）官方真题与答案", descriptionJa: "2016～2025年 学科Ⅰ（計画）の公式問題と正答" },
];

const copy = {
  zh: {
    eyebrow: "PRACTICE DESK",
    title: "练习：用题目暴露缺口",
    description: "这里负责做题、按知识类别训练和检查答案；需要整理错点或闭卷复盘时，再进入独立的复习页。",
    review: "前往复习总台",
    lightTitle: "轻量练习：只做 1、3、5 道题",
    lightDescription: "先选科目，再从过去问中随机抽题。适合没有力气打开整张知识地图的时候。",
    start: "开始一个小回合",
    assessment: "考查单元库",
    assessmentDescription: "查看真题、Notion 与 Anki 的覆盖关系",
    open: "打开",
    section: "分类练习",
    sectionTitle: "从知识地图进入",
    past: "查看完整试题库",
    enter: "进入练习",
  },
  ja: {
    eyebrow: "PRACTICE DESK",
    title: "練習：問題を使って弱点を見つける",
    description: "ここでは問題演習、分野別トレーニング、解答確認を行います。誤答の整理や閉じた状態での想起は、独立した復習ページで行います。",
    review: "復習デスクへ",
    lightTitle: "軽量練習：1・3・5問だけ解く",
    lightDescription: "科目を選び、過去問から少数だけ取り出します。知識マップ全体を開く余力がない時にも使えます。",
    start: "短いセットを始める",
    assessment: "考査ユニット一覧",
    assessmentDescription: "過去問・Notion・Anki のカバー関係を確認する",
    open: "開く",
    section: "分野別練習",
    sectionTitle: "知識マップから始める",
    past: "過去問一覧を見る",
    enter: "練習へ",
  },
};

export default function PracticeClient() {
  const [locale, setLocale] = useState<Locale>("zh");
  const t = copy[locale];

  return (
    <SidebarLayout>
      <div className="min-h-full bg-violet-50/40 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-violet-700">{t.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t.title}</h1>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t.description}</p>
            </div>
            <div className="flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold">
              <button onClick={() => setLocale("zh")} className={`rounded-full px-3 py-1.5 ${locale === "zh" ? "bg-slate-950 text-white" : "text-slate-500"}`}>中文</button>
              <button onClick={() => setLocale("ja")} className={`rounded-full px-3 py-1.5 ${locale === "ja" ? "bg-slate-950 text-white" : "text-slate-500"}`}>日本語</button>
            </div>
          </header>

          <Link href="/review" className="mt-7 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-900 hover:border-emerald-400">
            <span>↺ {t.review}</span><span>→</span>
          </Link>

          <Link href="/practice/light" className="group mt-5 flex flex-col gap-4 rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-700 to-indigo-700 p-6 text-white shadow-lg transition hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-semibold tracking-[0.18em] text-violet-200">LIGHT PRACTICE</p><h2 className="mt-2 text-xl font-bold">{t.lightTitle}</h2><p className="mt-2 text-sm leading-6 text-violet-100">{t.lightDescription}</p></div><span className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-violet-700">{t.start} →</span>
          </Link>
          <Link href="/assessment" className="mt-3 flex items-center justify-between rounded-2xl border border-cyan-200 bg-white px-5 py-4 text-sm text-slate-600 hover:border-cyan-400"><span><strong className="text-slate-900">{t.assessment}</strong> · {t.assessmentDescription}</span><span className="font-semibold text-cyan-700">{t.open} →</span></Link>

          <section className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">{t.section}</p><h2 className="mt-2 text-xl font-bold text-slate-900">{t.sectionTitle}</h2></div>
              <Link href="/exam/past" className="text-sm font-medium text-slate-500 hover:text-slate-900">{t.past} →</Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {practiceMaps.map((item) => (
                <Link key={item.href} href={item.href} className="group rounded-2xl border border-violet-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
                  <div className="flex items-start gap-3"><span className="text-2xl">{item.icon}</span><div><h3 className="font-bold text-slate-900">{locale === "ja" ? item.titleJa : item.titleZh}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{locale === "ja" ? item.descriptionJa : item.descriptionZh}</p><p className="mt-3 text-xs font-semibold text-violet-700">{t.enter} →</p></div></div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SidebarLayout>
  );
}
