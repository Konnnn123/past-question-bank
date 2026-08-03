import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LearningShell from "../../_components/LearningShell";
import QuestionSolutionFlow from "../../_components/QuantityFlow";
import { getMechanicsConcept, getMechanicsQuestion, mechanicsQuestions } from "@/lib/structural-learning";

export function generateStaticParams() {
  return mechanicsQuestions.map((question) => ({ slug: question.slug }));
}

function LanguageSwitch({ slug }: { slug: string }) {
  return <div className="flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-semibold shadow-sm"><span className="rounded-lg bg-slate-950 px-3 py-1.5 text-white">中文解析</span><Link href={`/structural-learning/questions/${slug}/ja`} className="rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-950">日本語</Link></div>;
}

export default async function MechanicsQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = getMechanicsQuestion(slug);
  if (!question) notFound();
  const graphId = { "composite-beam": "composite", "tapered-cantilever": "tower", "thermal-restraint": "thermal" }[question.slug];

  return <LearningShell><div className="min-h-full bg-[#f7f8f6] text-slate-900">
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f8f6]/90 px-4 py-3 backdrop-blur sm:px-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><div className="flex items-center gap-2 text-xs text-slate-500"><Link href="/structural-learning" className="hover:text-slate-950">结构力学</Link><span>/</span><span className="font-medium text-slate-800">题目 {question.number}</span></div><LanguageSwitch slug={slug} /></div></header>

    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <section className="border-b border-slate-200 pb-10">
        <div className="flex flex-wrap items-center gap-3"><span className="font-mono text-sm font-semibold text-slate-400">QUESTION {question.number}</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">{question.scale}层级</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">✓ {question.status}</span></div>
        <h1 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">{question.title}</h1>
        <p className="mt-3 text-sm text-slate-500 sm:text-base">{question.subtitle}</p>
        <div className="mt-7 max-w-4xl border-l-2 border-slate-950 pl-5"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">这道题真正问什么</p><p className="mt-2 text-lg font-medium leading-8 text-slate-800">{question.coreQuestion}</p></div>
      </section>

      <section className="py-10" id="original-question">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">01 · Original question</p><h2 className="mt-2 text-2xl font-bold text-slate-950">原题与完整图面</h2></div><p className="text-xs text-slate-500">原题为日文；点击图片可在新标签中查看原尺寸。</p></div>
        <a href={question.originalImage} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm hover:border-slate-300"><Image src={question.originalImage} alt={`${question.title}原题扫描`} width={1429} height={2021} priority unoptimized className="h-auto w-full rounded-2xl" /></a>
      </section>

      <section className="pb-12" id="full-solution">
        <div className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">02 · Full walkthrough</p><h2 className="mt-2 text-2xl font-bold text-slate-950">按原题小问逐步拆解</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">每一节都从“题目要什么”开始，再说明判断入口、计算步骤、最终答案和自检。默认展开第一问，其余小问可按需要打开。</p></div>
        <div className="space-y-4">{question.subproblems.map((part, partIndex) => <details key={part.id} open={partIndex === 0} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 sm:px-7"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-mono text-xs font-bold text-white">{part.id}</span><div className="min-w-0 flex-1"><h3 className="text-base font-bold text-slate-900 sm:text-lg">{part.title}</h3><p className="mt-1 truncate text-xs text-slate-400">{part.titleJa}</p></div><span className="text-xl text-slate-300 transition group-open:rotate-45">＋</span></summary>
          <div className="border-t border-slate-100 px-5 py-6 sm:px-7 sm:py-8">
            <div className="grid gap-5 lg:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">题目要什么</p><p className="mt-2 text-sm leading-7 text-slate-700">{part.task}</p></div><div className="rounded-2xl bg-blue-50 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">判断入口</p><p className="mt-2 text-sm leading-7 text-slate-700">{part.approach}</p></div></div>
            <div className="mt-7"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">逐步计算</p><div className="mt-3 space-y-3">{part.steps.map((step, index) => <div key={`${part.id}-${step.label}`} className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-[42px_180px_1fr] sm:items-start"><span className="font-mono text-xs font-bold text-slate-400">{String(index + 1).padStart(2,"0")}</span><p className="text-sm font-bold text-slate-900">{step.label}</p><div><p className="text-sm leading-6 text-slate-600">{step.explanation}</p>{step.formula && <p className="mt-3 overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm font-semibold leading-6 text-white">{step.formula}</p>}</div></div>)}</div></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_1fr]"><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">答案</p><p className="mt-2 text-sm font-bold leading-7 text-slate-900">{part.answer}</p></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">自检 / 易错点</p><p className="mt-2 text-sm leading-7 text-slate-700">{part.check}</p></div></div>
          </div>
        </details>)}</div>
      </section>

      <section className="pb-12"><div className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">03 · Solution flow</p><h2 className="mt-2 text-2xl font-bold text-slate-950">这道题的物理量怎样流动</h2><p className="mt-3 text-sm leading-6 text-slate-500">这张图只服务于当前过去问，用来复盘从题目条件到答案的解题路径。</p></div><QuestionSolutionFlow initialGraphId={graphId} showTabs={false} showHeader={false} /></section>

      <section className="grid gap-6 border-t border-slate-200 py-12 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">04 · Model</p><h2 className="mt-2 text-xl font-bold text-slate-950">整题压缩后的力学模型</h2><p className="mt-4 text-sm leading-7 text-slate-600">{question.model}</p><div className="mt-6 flex flex-wrap gap-2">{question.givens.map((given) => <span key={given} className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">{given}</span>)}</div></div>
        <div className="rounded-3xl bg-slate-950 p-6 text-white"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">本题使用的物理量</p><div className="mt-4 flex flex-wrap gap-2">{question.concepts.map((conceptSlug) => { const concept = getMechanicsConcept(conceptSlug)!; return <Link key={conceptSlug} href={`/structural-learning/concepts/${conceptSlug}`} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"><span className="block text-sm font-bold">{concept.symbol}</span><span className="text-[10px] text-slate-400">{concept.name}</span></Link>; })}</div></div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">{[{ label: "现在形成的理解", body: question.insight, tone: "bg-emerald-50 border-emerald-200" }, { label: "第一次卡住的地方", body: question.firstBlock, tone: "bg-amber-50 border-amber-200" }, { label: "迁移到下一道题", body: question.transfer, tone: "bg-blue-50 border-blue-200" }].map((item) => <div key={item.label} className={`rounded-3xl border p-6 ${item.tone}`}><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p><p className="mt-3 text-sm leading-7 text-slate-700">{item.body}</p></div>)}</section>
    </main>
  </div></LearningShell>;
}
