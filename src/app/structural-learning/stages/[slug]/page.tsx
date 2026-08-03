import Link from "next/link";
import { notFound } from "next/navigation";
import LearningShell from "../../_components/LearningShell";
import { getLearningStage, getMechanicsQuestion, learningStages } from "@/lib/structural-learning";

export function generateStaticParams() { return learningStages.map((stage) => ({ slug: stage.slug })); }

export default async function StagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stage = getLearningStage(slug);
  if (!stage) notFound();
  const questions = stage.questionSlugs.map(getMechanicsQuestion).filter(Boolean);

  return <LearningShell><div className="min-h-full bg-[#f7f8f6]"><main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
    <Link href="/structural-learning" className="text-xs font-semibold text-slate-500 hover:text-slate-950">← 返回当前学习阶段</Link>
    <section className="mt-7 rounded-[32px] bg-slate-950 p-7 text-white sm:p-12"><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-semibold text-emerald-300">STAGE {stage.number}</span><span className="text-xs text-slate-400">{stage.date} · 固定快照</span></div><h1 className="mt-7 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{stage.title}</h1><p className="mt-3 text-sm text-slate-400 sm:text-base">{stage.subtitle}</p><p className="mt-8 max-w-3xl border-l border-emerald-400 pl-5 text-base leading-8 text-slate-200">{stage.thesis}</p></section>
    <section className="py-12"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">What changed</p><h2 className="mt-2 text-2xl font-bold text-slate-950">这个阶段形成的认识</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{stage.gains.map((gain, index) => <article key={gain.title} className="rounded-3xl border border-slate-200 bg-white p-6"><span className="font-mono text-xs font-bold text-emerald-600">0{index + 1}</span><h3 className="mt-3 text-base font-bold text-slate-900">{gain.title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{gain.body}</p></article>)}</div></section>
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Evidence</p><h2 className="mt-2 text-xl font-bold text-slate-950">构成这个阶段的三道题</h2></div><span className="text-xs text-slate-400">截面 → 构件 → 系统</span></div><div className="mt-6 divide-y divide-slate-100">{questions.map((question) => question && <Link key={question.slug} href={`/structural-learning/questions/${question.slug}`} className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"><span className="font-mono text-sm text-slate-400">{question.number}</span><div className="sm:ml-4 sm:flex-1"><h3 className="text-sm font-bold text-slate-900">{question.title}</h3><p className="mt-1 text-xs text-slate-500">{question.coreQuestion}</p></div><span className="self-start rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600 sm:self-auto">{question.scale}</span></Link>)}</div></section>
    <section className="mt-8 grid gap-5 lg:grid-cols-2"><div className="rounded-3xl border border-amber-200 bg-amber-50 p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">仍然开放的问题</p><ul className="mt-4 space-y-4">{stage.openQuestions.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="font-bold text-amber-600">?</span>{item}</li>)}</ul></div><div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">下一阶段接口</p><ul className="mt-4 space-y-4">{stage.next.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="text-emerald-600">→</span>{item}</li>)}</ul></div></section>
    <p className="mt-10 text-center text-xs leading-5 text-slate-400">这个页面保留阶段 01 当时形成的认识。以后新增阶段时不会覆盖它。</p>
  </main></div></LearningShell>;
}
