import Link from "next/link";
import { notFound } from "next/navigation";
import LearningShell from "../../_components/LearningShell";
import { getMechanicsConcept, getQuestionsForConcept, mechanicsConcepts } from "@/lib/structural-learning";

export function generateStaticParams() { return mechanicsConcepts.map((concept) => ({ slug: concept.slug })); }

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getMechanicsConcept(slug);
  if (!concept) notFound();
  const related = getQuestionsForConcept(slug);
  const upstream = concept.upstream.map(getMechanicsConcept).filter(Boolean);
  const downstream = concept.downstream.map(getMechanicsConcept).filter(Boolean);

  return <LearningShell><div className="min-h-full bg-[#f7f8f6]"><main className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
    <Link href="/structural-learning#quantity-map" className="text-xs font-semibold text-slate-500 hover:text-slate-950">← 返回物理量地图</Link>
    <section className="mt-7 overflow-hidden rounded-[32px] border border-slate-200 bg-white">
      <div className="grid lg:grid-cols-[280px_1fr]"><div className="bg-slate-950 p-8 text-white sm:p-10"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{concept.category} · {concept.unit}</span><h1 className="mt-6 font-mono text-4xl font-bold">{concept.symbol}</h1><p className="mt-3 text-lg font-semibold">{concept.name}</p><p className="mt-1 text-xs text-slate-400">{concept.nameJa}</p></div><div className="p-8 sm:p-10"><p className="text-lg leading-8 text-slate-700">{concept.summary}</p><div className="mt-8 rounded-2xl bg-[#f4f6f3] p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">直观理解</p><p className="mt-2 text-sm leading-7 text-slate-600">{concept.intuition}</p></div><div className="mt-5 rounded-2xl border border-slate-200 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">核心关系</p><p className="mt-2 font-mono text-base font-semibold leading-7 text-slate-900">{concept.relation}</p></div></div></div>
    </section>
    <section className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">它从哪里来</p><div className="mt-4 flex flex-wrap gap-2">{upstream.length ? upstream.map((item) => <Link key={item!.slug} href={`/structural-learning/concepts/${item!.slug}`} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">{item!.symbol} · {item!.name}</Link>) : <span className="text-sm text-slate-400">这是当前链条的外部输入或基础量。</span>}</div></div><div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">它继续影响什么</p><div className="mt-4 flex flex-wrap gap-2">{downstream.length ? downstream.map((item) => <Link key={item!.slug} href={`/structural-learning/concepts/${item!.slug}`} className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100">{item!.symbol} · {item!.name}</Link>) : <span className="text-sm text-slate-400">这是当前学习链条的输出端。</span>}</div></div></section>
    <section className="mt-8"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Appears in</p><h2 className="mt-2 text-xl font-bold text-slate-950">目前在哪些题中出现</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{related.map((question) => <Link key={question.slug} href={`/structural-learning/questions/${question.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 hover:-translate-y-0.5 hover:shadow-md"><span className="text-[10px] font-semibold text-slate-400">QUESTION {question.number} · {question.scale}</span><h3 className="mt-2 text-sm font-bold text-slate-900">{question.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{question.coreQuestion}</p></Link>)}</div></section>
  </main></div></LearningShell>;
}
