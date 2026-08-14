"use client";

import Link from "next/link";
import { useState } from "react";
import { SidebarLayout } from "@/components/layout";
import OfficialPlanningPastExams from "@/components/practice/OfficialPlanningPastExams";

type Locale = "zh" | "ja";

const copy = {
  zh: {
    back: "返回练习首页",
    eyebrow: "一級建築士・学科Ⅰ（計画）",
    title: "一级建筑师官方真题",
    description: "2016～2025 年共 10 年、200 道官方试题。可直接作答、核对官方答案，并打开原 PDF 查看图面与排版。题目依据考试当时的法律、规范与标准。",
  },
  ja: {
    back: "練習トップへ戻る",
    eyebrow: "一級建築士・学科Ⅰ（計画）",
    title: "一級建築士 公式過去問",
    description: "2016～2025年の10年分・全200問です。そのまま解答し、公式正答を確認できます。図面と原レイアウトは公式PDFで参照できます。問題は試験実施時点の法令・規格に基づきます。",
  },
};

export default function FirstClassPlanningPracticeClient() {
  const [locale, setLocale] = useState<Locale>("zh");
  const t = copy[locale];

  return <SidebarLayout>
    <div className="min-h-full bg-[#f5f4ef] px-5 py-8 text-slate-900 sm:px-8">
      <main className="mx-auto max-w-6xl">
        <Link href="/practice" className="text-sm font-bold text-slate-500 hover:text-violet-700">← {t.back}</Link>
        <header className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 p-6 text-white shadow-xl sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-amber-300">{t.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black sm:text-4xl">{t.title}</h1>
              <p className="mt-4 max-w-3xl leading-7 text-indigo-100">{t.description}</p>
            </div>
            <div className="flex rounded-full border border-white/20 bg-white/10 p-1 text-xs font-semibold">
              <button type="button" onClick={() => setLocale("zh")} className={`rounded-full px-3 py-1.5 ${locale === "zh" ? "bg-white text-slate-950" : "text-indigo-100"}`}>中文</button>
              <button type="button" onClick={() => setLocale("ja")} className={`rounded-full px-3 py-1.5 ${locale === "ja" ? "bg-white text-slate-950" : "text-indigo-100"}`}>日本語</button>
            </div>
          </div>
        </header>
        <section className="mt-5"><OfficialPlanningPastExams locale={locale} /></section>
      </main>
    </div>
  </SidebarLayout>;
}
