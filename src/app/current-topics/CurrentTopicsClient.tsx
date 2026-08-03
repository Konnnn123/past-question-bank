"use client";

import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import { useExploreLanguage } from "@/components/ExploreLanguageProvider";
import { CURRENT_TOPICS_UPDATED_AT } from "@/lib/current-topics";
import { getLocalizedCurrentTopics } from "@/lib/current-topics-ja";

const copy = {
  zh: {
    eyebrow: "建筑时事｜大学院命题追踪",
    titleBefore: "不追热搜，追踪",
    titleAccent: "可能变成题目的新闻",
    intro: "以2013—2026年过去问为筛网，选择能连接建筑本体、保护制度、构法和论述题的近两年事件。第一版重点覆盖建筑史、计划与构法，同时标记环境工学和构造力学接口。",
    state: "资料状态",
    count: "个核心专题",
    updated: "更新至",
    sourceNote: "新闻事实优先采用政府、文化财机构和主办方原始资料。",
    why: "为什么这样筛",
    whyTitle: "这所考试真的会把新闻写进题干",
    whyBody: "优先级不是行业热度，而是“过去问已经留下接口”的程度。文化财状态变化、著名建筑的新节点和可画成图的构法，权重最高。",
    evidenceSuffix: "年度证据",
    list: "核心清单",
    ranked: "按命题概率排序",
    rankedNote: "“最优先”表示已有直接过去问证据；“高”表示制度或构法高度吻合；“关注”适合作为论述更新素材。",
    open: "打开专题与预测题",
    boundary: "使用边界",
    boundaryBody: "这些是依据过去问推定的复习优先级，不是“押题命中保证”。专题中的预测问法不会混入真题库，真题链接仍指向原始 processed questions。新闻状态会严格区分答申、官报告示后的正式指定、登录和奖项。",
  },
  ja: {
    eyebrow: "建築時事｜大学院入試の出題追跡",
    titleBefore: "話題性ではなく、",
    titleAccent: "問題になりうるニュースを追う",
    intro: "2013〜2026年度の過去問をフィルターとして、建築そのもの、保護制度、構法、論述問題へ接続できる直近2年の出来事を選んだ。第1版は建築史・計画・構法を重点とし、環境工学と構造力学への接点も示す。",
    state: "資料の状態",
    count: "件の重点テーマ",
    updated: "更新日",
    sourceNote: "ニュースの事実確認には、行政、文化財機関、主催者の一次資料を優先した。",
    why: "選定の根拠",
    whyTitle: "この大学院入試は、実際にニュースを問題文へ取り込む",
    whyBody: "優先度は業界での話題性ではなく、過去問がすでに出題の入口を残しているかで決めた。文化財ステータスの変化、著名建築の新局面、図示できる構法を特に重く見ている。",
    evidenceSuffix: "年度の根拠",
    list: "重点テーマ",
    ranked: "出題可能性の順",
    rankedNote: "「最優先」は直接つながる過去問があるもの、「高」は制度・構法との適合が強いもの、「注目」は論述を現在化する材料である。",
    open: "記事と予想問題を開く",
    boundary: "利用上の注意",
    boundaryBody: "これは過去問から推定した復習優先度であり、的中を保証するものではない。予想問題は実際の問題データベースと混在させず、過去問リンクは原文の processed questions を開く。答申、官報告示後の正式指定、登録、受賞は明確に区別した。",
  },
};

const evidence = {
  zh: [
    ["2020", "巴黎圣母院火灾", "法国文化财制度＋灾后修复立场"],
    ["2022", "代代木竞技场文化财答申", "保存意义＋重要文化财／登录文化财比较"],
    ["2024", "保护制度", "重要传统建造物群保存地区＋代表例"],
    ["2025", "既有名作", "住吉的长屋、万博祭典广场进入案例题"],
  ],
  ja: [
    ["2020", "ノートルダム大聖堂火災", "フランスの文化財制度＋災後修復の立場"],
    ["2022", "代々木競技場の文化財答申", "保存の意義＋重要文化財／登録文化財の比較"],
    ["2024", "保護制度", "重要伝統的建造物群保存地区＋代表例"],
    ["2025", "既存の名作", "住吉の長屋・万博お祭り広場が事例問題に登場"],
  ],
};

const subjectStyle: Record<string, string> = {
  建筑史: "border-violet-200 bg-violet-50 text-violet-800", 建築史: "border-violet-200 bg-violet-50 text-violet-800",
  建筑计划: "border-sky-200 bg-sky-50 text-sky-800", 建築計画: "border-sky-200 bg-sky-50 text-sky-800",
  建筑构法: "border-orange-200 bg-orange-50 text-orange-800", 建築構法: "border-orange-200 bg-orange-50 text-orange-800",
  环境工学: "border-emerald-200 bg-emerald-50 text-emerald-800", 建築環境工学: "border-emerald-200 bg-emerald-50 text-emerald-800",
  构造力学: "border-rose-200 bg-rose-50 text-rose-800", 構造力学: "border-rose-200 bg-rose-50 text-rose-800",
};

function priorityClass(priority: string) {
  if (priority === "最优先" || priority === "最優先") return "bg-rose-100 text-rose-800";
  if (priority === "高") return "bg-amber-100 text-amber-800";
  return "bg-slate-200 text-slate-700";
}

export default function CurrentTopicsClient() {
  const { language } = useExploreLanguage();
  const locale = language === "ja" ? "ja" : "zh";
  const t = copy[locale];
  const topics = getLocalizedCurrentTopics(locale);

  return (
    <SidebarLayout>
      <main className="min-h-full bg-[#f4f1ea] text-slate-950">
        <section className="border-b border-stone-300 bg-[#17251e] text-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <p className="text-xs font-semibold tracking-[0.24em] text-emerald-300">{t.eyebrow}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
                  {t.titleBefore}<span className="text-amber-300">{t.titleAccent}</span>
                </h1>
                <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200 sm:text-lg">{t.intro}</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/8 p-5">
                <p className="text-xs text-stone-400">{t.state}</p>
                <p className="mt-2 text-2xl font-bold">{topics.length} {t.count}</p>
                <p className="mt-2 text-sm text-stone-300">{t.updated} {CURRENT_TOPICS_UPDATED_AT}<br />{t.sourceNote}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <section className="rounded-3xl border border-stone-300 bg-white p-6 sm:p-8">
            <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">{t.why}</p>
                <h2 className="mt-3 text-2xl font-black">{t.whyTitle}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{t.whyBody}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {evidence[locale].map(([year, event, question]) => (
                  <div key={`${year}-${event}`} className="rounded-2xl bg-stone-100 p-4">
                    <p className="text-xs font-bold text-emerald-700">{year}{locale === "ja" ? "" : ""}{t.evidenceSuffix}</p>
                    <p className="mt-2 font-bold">{event}</p><p className="mt-1 text-sm leading-6 text-slate-600">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">{t.list}</p><h2 className="mt-2 text-3xl font-black">{t.ranked}</h2></div>
              <p className="max-w-xl text-sm leading-6 text-slate-600">{t.rankedNote}</p>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {topics.map((topic, index) => (
                <article key={topic.id} className="group flex flex-col rounded-3xl border border-stone-300 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3"><span className="text-sm font-black text-stone-300">{String(index + 1).padStart(2, "0")}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(topic.priority)}`}>{topic.priority}</span></div>
                    <time className="text-xs text-slate-500" dateTime={topic.date}>{topic.dateLabel}</time>
                  </div>
                  <h3 className="mt-5 text-2xl font-black leading-snug">{topic.title}</h3>
                  {locale === "zh" && <p className="mt-1 text-sm text-slate-400">{topic.japaneseTitle}</p>}
                  <p className="mt-4 text-sm font-medium leading-7 text-emerald-900">{topic.kicker}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{topic.lead}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{topic.subjects.map((subject) => <span key={subject} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${subjectStyle[subject]}`}>{subject}</span>)}</div>
                  <div className="mt-auto pt-6"><Link href={`/current-topics/${topic.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800">{t.open}<span className="transition group-hover:translate-x-1">→</span></Link></div>
                </article>
              ))}
            </div>
          </section>
          <section className="mt-10 rounded-3xl bg-amber-100 p-6 sm:p-8"><h2 className="text-xl font-black text-amber-950">{t.boundary}</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-amber-950/80">{t.boundaryBody}</p></section>
        </div>
      </main>
    </SidebarLayout>
  );
}
