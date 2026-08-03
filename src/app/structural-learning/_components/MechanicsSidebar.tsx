import Link from "next/link";
import { learningStages, mechanicsQuestions } from "@/lib/structural-learning";

export default function MechanicsSidebar({ locale = "zh" }: { locale?: "zh" | "ja" }) {
  const ja = locale === "ja";
  const scaleJa = { 截面: "断面", 构件: "部材", 系统: "システム" } as const;
  return (
    <div className="space-y-6 pb-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Structural mechanics</p>
        <h3 className="mt-1 text-sm font-bold text-slate-900">{ja ? "構造力学学習記録" : "结构力学学习档案"}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{ja ? "過去問を起点に、知識構造が形成される過程を残す。" : "从过去问出发，保留每个阶段形成知识结构的过程。"}</p>
      </div>

      <nav className="space-y-1 text-sm">
        <Link href="/structural-learning" className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 font-medium text-white">
          <span>⌂</span><span>{ja ? "現在の学習段階" : "当前阶段总览"}</span>
        </Link>
        <Link href="/knowledge-map" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-slate-600 hover:bg-slate-100">
          <span>↗</span><span>{ja ? "試験範囲の知識地図" : "完整考试知识地图"}</span>
        </Link>
      </nav>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{ja ? "学習済みの問題" : "已完成的题目"}</p>
        <div className="space-y-1.5">
          {mechanicsQuestions.map((question) => (
            <Link key={question.slug} href={`/structural-learning/questions/${question.slug}${ja ? "/ja" : ""}`} className="group flex gap-3 rounded-xl border border-transparent px-2.5 py-2.5 hover:border-slate-200 hover:bg-white">
              <span className="mt-0.5 text-xs font-semibold text-slate-400">{question.number}</span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-slate-800">{ja ? question.titleJa : question.title}</span>
                <span className="mt-0.5 block text-[11px] text-slate-400">{ja ? `${scaleJa[question.scale]} · 学習済み` : `${question.scale}层级 · ${question.status}`}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{ja ? "段階スナップショット" : "阶段快照"}</p>
        {learningStages.map((stage) => (
          <Link key={stage.slug} href={`/structural-learning/stages/${stage.slug}`} className="block rounded-xl border border-slate-200 bg-white p-3 hover:border-slate-300 hover:shadow-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Stage {stage.number} · {stage.date}</span>
            <span className="mt-1 block text-xs font-semibold text-slate-800">{stage.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
