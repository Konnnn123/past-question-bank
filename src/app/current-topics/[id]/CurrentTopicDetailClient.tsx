"use client";

import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import { useExploreLanguage } from "@/components/ExploreLanguageProvider";
import { getLocalizedCurrentTopic, getLocalizedCurrentTopics } from "@/lib/current-topics-ja";
import TopicConceptDiagram from "../TopicConceptDiagram";

const copy = {
  zh: {
    back: "返回建筑时事", core: "先抓新闻核心", interesting: "建筑为什么有意思", contradiction: "先把它当成一个矛盾来记",
    signals: "命题信号", system: "保护制度", construction: "结构・构法", predicted: "可能怎样出题", rewrite: "把新闻改写成大学院问法",
    circuit: "过去问回路", connected: "不是孤立的新知识", openQuestion: "打开原题", sources: "核对来源", all: "返回全部专题", next: "下一篇",
    sourceKind: { 官方: "官方", 机构: "机构" } as Record<string, string>,
  },
  ja: {
    back: "建築時事へ戻る", core: "まずニュースの核心をつかむ", interesting: "この建築の面白さ", contradiction: "一つの矛盾として記憶する",
    signals: "出題のシグナル", system: "保護制度", construction: "構造・構法", predicted: "どのように出題されるか", rewrite: "ニュースを大学院入試の問いへ置き換える",
    circuit: "過去問との回路", connected: "孤立した新知識ではない", openQuestion: "過去問を開く", sources: "出典を確認する", all: "全テーマへ戻る", next: "次の記事",
    sourceKind: { 官方: "公式", 机构: "機関" } as Record<string, string>,
  },
};

function priorityClass(priority: string) {
  if (priority === "最优先" || priority === "最優先") return "bg-rose-100 text-rose-800";
  if (priority === "高") return "bg-amber-100 text-amber-800";
  return "bg-slate-200 text-slate-700";
}

export default function CurrentTopicDetailClient({ topicId, questionIds }: { topicId: string; questionIds: Record<string, string> }) {
  const { language } = useExploreLanguage();
  const locale = language === "ja" ? "ja" : "zh";
  const t = copy[locale];
  const topics = getLocalizedCurrentTopics(locale);
  const topic = getLocalizedCurrentTopic(topicId, locale);
  if (!topic) return null;
  const currentIndex = topics.findIndex((item) => item.id === topic.id);
  const nextTopic = topics[(currentIndex + 1) % topics.length];

  return (
    <SidebarLayout>
      <main className="min-h-full bg-[#f4f1ea] text-slate-950">
        <header className="border-b border-stone-300 bg-white">
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
            <Link href="/current-topics" className="text-sm font-bold text-emerald-800">← {t.back}</Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(topic.priority)}`}>{topic.priority}</span>
              <time dateTime={topic.date} className="text-sm text-slate-500">{topic.dateLabel}</time>
              <span className="text-sm text-slate-300">/</span><span className="text-sm text-slate-600">{topic.status}</span>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">{topic.title}</h1>
            {locale === "zh" && <p className="mt-3 text-lg text-slate-400">{topic.japaneseTitle}</p>}
            <p className="mt-7 max-w-4xl text-xl font-medium leading-9 text-emerald-950">{topic.kicker}</p>
            <div className="mt-6 flex flex-wrap gap-2">{topic.subjects.map((subject) => <span key={subject} className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-700">{subject}</span>)}</div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-[#17251e] p-7 text-white sm:p-9"><p className="text-xs font-semibold tracking-[0.2em] text-emerald-300">{t.core}</p><p className="mt-4 text-lg leading-8 text-stone-100">{topic.lead}</p>{topic.correction && <div className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">{topic.correction}</div>}</div>
            <dl className="grid gap-px overflow-hidden rounded-3xl border border-stone-300 bg-stone-300">{topic.keyFacts.map((fact) => <div key={fact.label} className="grid grid-cols-[7rem_1fr] bg-white p-4"><dt className="text-xs font-bold text-emerald-800">{fact.label}</dt><dd className="text-sm leading-6 text-slate-700">{fact.value}</dd></div>)}</dl>
          </section>

          <section className="mt-8"><TopicConceptDiagram topicId={topic.id} language={locale} /></section>

          <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_16rem]">
            <div><p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">{t.interesting}</p><h2 className="mt-3 text-3xl font-black">{t.contradiction}</h2><div className="mt-6 space-y-5">{topic.story.map((paragraph) => <p key={paragraph} className="text-base leading-8 text-slate-700">{paragraph}</p>)}</div></div>
            <aside className="h-fit rounded-3xl border border-stone-300 bg-white p-5"><p className="text-xs font-bold tracking-[0.16em] text-slate-400">{t.signals}</p><ul className="mt-4 space-y-3">{topic.examSignals.map((signal) => <li key={signal} className="text-sm leading-6 text-slate-700"><span className="mr-2 text-emerald-600">●</span>{signal}</li>)}</ul></aside>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-violet-200 bg-violet-50 p-7"><p className="text-xs font-semibold tracking-[0.2em] text-violet-700">{t.system}</p><h2 className="mt-3 text-2xl font-black text-violet-950">{topic.systemTitle}</h2><div className="mt-5 space-y-4">{topic.systemExplanation.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-violet-950/80">{paragraph}</p>)}</div></article>
            <article className="rounded-3xl border border-orange-200 bg-orange-50 p-7"><p className="text-xs font-semibold tracking-[0.2em] text-orange-700">{t.construction}</p><h2 className="mt-3 text-2xl font-black text-orange-950">{topic.constructionTitle}</h2><ul className="mt-5 space-y-3">{topic.constructionPoints.map((point) => <li key={point} className="flex gap-3 text-sm leading-7 text-orange-950/80"><span className="font-black text-orange-500">—</span><span>{point}</span></li>)}</ul></article>
          </section>

          <section className="mt-12 rounded-3xl bg-slate-950 p-7 text-white sm:p-9"><p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">{t.predicted}</p><h2 className="mt-3 text-3xl font-black">{t.rewrite}</h2><ol className="mt-7 grid gap-4">{topic.predictedQuestions.map((question, index) => <li key={question} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-lg font-black text-cyan-300">{index + 1}</span><span className="leading-7 text-slate-100">{question}</span></li>)}</ol></section>

          <section className="mt-12"><p className="text-xs font-semibold tracking-[0.2em] text-emerald-700">{t.circuit}</p><h2 className="mt-3 text-3xl font-black">{t.connected}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{topic.pastQuestions.map((question) => <Link key={question.fileName} href={`/question/${questionIds[question.fileName]}`} className="group rounded-2xl border border-stone-300 bg-white p-5 transition hover:border-emerald-500"><p className="font-bold">{question.label}</p><p className="mt-2 text-sm leading-6 text-slate-600">{question.reason}</p><p className="mt-4 text-xs font-bold text-emerald-700 group-hover:underline">{t.openQuestion} →</p></Link>)}</div></section>

          <section className="mt-12 border-t border-stone-300 pt-8"><h2 className="text-lg font-black">{t.sources}</h2><ul className="mt-4 grid gap-3 sm:grid-cols-2">{topic.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="flex h-full items-start justify-between gap-3 rounded-2xl bg-stone-200/60 p-4 text-sm font-medium text-slate-700 hover:bg-stone-200"><span>{source.label}</span><span className="shrink-0 text-xs text-slate-400">{t.sourceKind[source.kind]} ↗</span></a></li>)}</ul></section>

          <nav className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-300 bg-white p-6"><Link href="/current-topics" className="text-sm font-bold text-slate-600">← {t.all}</Link><Link href={`/current-topics/${nextTopic.id}`} className="text-right text-sm font-bold text-emerald-800">{t.next}：{nextTopic.title} →</Link></nav>
        </div>
      </main>
    </SidebarLayout>
  );
}
