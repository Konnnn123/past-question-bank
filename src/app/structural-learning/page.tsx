import Link from "next/link";
import LearningShell from "./_components/LearningShell";
import PhysicalQuantityMap from "./_components/PhysicalQuantityMap";
import QuestionCard from "./_components/QuestionCard";
import { learningStages, mechanicsQuestions } from "@/lib/structural-learning";

export default function StructuralLearningPage() {
  const stage = learningStages[0];

  return (
    <LearningShell>
      <div className="min-h-full bg-[#f7f8f6] text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f7f8f6]/90 px-4 py-3 backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-950">学习中心</Link><span>/</span><span className="font-medium text-slate-800">结构力学</span>
            </div>
            <Link href="/knowledge-map" className="text-xs font-semibold text-slate-600 hover:text-slate-950">完整考试地图 ↗</Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
          <section className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-10 h-48 w-48 rounded-full border border-white/10" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-300">STAGE {stage.number}</span>
                  <span className="text-xs text-slate-400">{stage.date} · 阶段性学习快照</span>
                </div>
                <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">从三道过去问，建立第一张结构力学地图</h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">这里保存的不是整理完成的教材，而是知识结构形成的过程：每道题怎样理解、公式为何出现，以及新的内容以后接到哪里。</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href="#questions" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-100">复习三道题</a>
                  <a href="#quantity-map" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">查看物理量地图</a>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  [mechanicsQuestions.length, "已完成题目"],
                  [25, "物理量符号"],
                  [3, "分析尺度"],
                ].map(([value, label]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-3xl font-light tracking-tight text-white">{value}</p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              { index: "01", title: "截面", subtitle: "同一截面内部", body: "材料分布、应变与应力、中立轴、截面量", color: "text-amber-600" },
              { index: "02", title: "构件", subtitle: "沿构件长度", body: "I(x)、M(x)、曲率以及局部贡献的累积", color: "text-blue-600" },
              { index: "03", title: "系统", subtitle: "多个构件连接", body: "边界、刚度与柔度、共同节点的变形协调", color: "text-teal-600" },
            ].map((item, index) => (
              <div key={item.title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-4">
                  <span className={`font-mono text-xs font-bold ${item.color}`}>{item.index}</span>
                  <div>
                    <div className="flex items-baseline gap-2"><h2 className="text-lg font-bold text-slate-950">{item.title}</h2><span className="text-xs text-slate-400">{item.subtitle}</span></div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.body}</p>
                  </div>
                </div>
                {index < 2 && <span className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-[#f7f8f6] text-xs text-slate-400 md:flex">→</span>}
              </div>
            ))}
          </section>

          <section id="questions" className="scroll-mt-20 pt-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Question archive</p><h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">三道题，三个分析尺度</h2></div>
              <p className="max-w-lg text-xs leading-5 text-slate-500">每道题使用同一套档案结构：模型定位、解题路线、公式使用理由、第一次卡点、迁移提示和考场检查。</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">{mechanicsQuestions.map((question) => <QuestionCard key={question.slug} question={question} />)}</div>
          </section>

          <div className="pt-16"><PhysicalQuantityMap /></div>

          <section className="mt-16 grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_380px]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Stage snapshot</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{stage.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{stage.thesis}</p>
              <Link href={`/structural-learning/stages/${stage.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">阅读阶段 01 总结 <span>→</span></Link>
            </div>
            <div className="rounded-2xl bg-[#f3f5f2] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">下一阶段的接口</p>
              <ul className="mt-3 space-y-3">{stage.next.map((item) => <li key={item} className="flex gap-3 text-xs leading-5 text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{item}</li>)}</ul>
            </div>
          </section>
        </main>
      </div>
    </LearningShell>
  );
}
