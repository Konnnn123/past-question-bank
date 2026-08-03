"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import type { AssessmentDraft } from "@/lib/assessment-drafts";

const QUEUE_KEY = "assessment-candidate-queue-v1";
const APPROVED_KEY = "assessment-approved-drafts-v2";
const readinessStyle: Record<AssessmentDraft["readiness"], string> = {
  "自动可用": "bg-emerald-100 text-emerald-700",
  "建议抽查": "bg-cyan-100 text-cyan-700",
  "必须人工确认": "bg-amber-100 text-amber-800",
  "资料不足": "bg-rose-100 text-rose-700",
};

export default function DraftWorkbenchClient({ drafts }: { drafts: AssessmentDraft[] }) {
  const [queue, setQueue] = useState<string[]>([]);
  const [approved, setApproved] = useState<string[]>([]);
  useEffect(() => { queueMicrotask(() => { try { setQueue(JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as string[]); setApproved(JSON.parse(localStorage.getItem(APPROVED_KEY) ?? "[]") as string[]); } catch { setQueue([]); setApproved([]); } }); }, []);
  const selected = queue.map((id) => drafts.find((draft) => draft.id === id)).filter((draft): draft is AssessmentDraft => Boolean(draft));
  const isUsable = (draft: AssessmentDraft) => draft.readiness === "自动可用" || draft.readiness === "建议抽查" || approved.includes(draft.id);
  const toggleApproval = (id: string) => {
    const next = approved.includes(id) ? approved.filter((value) => value !== id) : [...approved, id];
    setApproved(next); localStorage.setItem(APPROVED_KEY, JSON.stringify(next));
  };
  const remove = (id: string) => { const next = queue.filter((value) => value !== id); setQueue(next); localStorage.setItem(QUEUE_KEY, JSON.stringify(next)); };

  return <SidebarLayout><main className="min-h-full bg-slate-50 px-5 py-8 sm:px-8"><div className="mx-auto max-w-5xl">
    <Link href="/assessment" className="text-sm text-slate-500 hover:text-cyan-700">← 返回考查单元库</Link>
    <header className="mt-5"><p className="text-sm font-semibold tracking-[0.18em] text-fuchsia-700">DRAFT WORKBENCH</p><h1 className="mt-2 text-3xl font-bold text-slate-950">出题工作台</h1><p className="mt-3 max-w-3xl leading-7 text-slate-600">这里只处理你从缺口队列选中的知识。所有内容都标记为模拟草案，审核通过之前不会进入练习或模拟组卷。</p></header>
    <div className="mt-6 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-white px-4 py-2 text-slate-600">候选 {selected.length}</span><span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">可直接使用 {selected.filter(isUsable).length}</span><span className="rounded-full bg-amber-100 px-4 py-2 text-amber-800">需要你确认 {selected.filter((item) => item.readiness === "必须人工确认" && !approved.includes(item.id)).length}</span><span className="rounded-full bg-rose-100 px-4 py-2 text-rose-700">资料不足 {selected.filter((item) => item.readiness === "资料不足").length}</span></div>
    {!selected.length ? <section className="mt-8 rounded-3xl border border-dashed border-fuchsia-200 bg-white p-12 text-center"><p className="text-slate-500">出题队列还是空的。</p><Link href="/assessment" className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">去选择知识候选</Link></section> : <div className="mt-6 space-y-4">{selected.map((draft) => <article key={draft.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2 text-[11px]"><span className={`rounded px-2 py-1 font-semibold ${readinessStyle[draft.readiness]}`}>{draft.readiness}</span><span className="rounded bg-cyan-50 px-2 py-1 text-cyan-700">{draft.form}</span><span className="px-1 py-1 text-slate-400">{draft.subject}</span></div><h2 className="mt-3 text-lg font-bold text-slate-900">{draft.knowledgeName}</h2></div><button onClick={() => remove(draft.id)} className="text-xs text-slate-400 hover:text-rose-600">移出队列</button></div><div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">题干草案</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{draft.prompt}</p></div><details className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/40"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-emerald-700">查看答案依据</summary><div className="border-t border-emerald-100 p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{draft.answer || "当前来源没有足够内容，不能生成可靠答案。"}</p><p className="mt-3 text-xs text-slate-400">来源：{draft.evidence}</p></div></details>
      {draft.readiness === "自动可用" && <p className="mt-4 text-sm font-semibold text-emerald-700">✓ 来源与答案明确，自动进入可用状态</p>}
      {draft.readiness === "建议抽查" && <p className="mt-4 text-sm text-cyan-700">可直接使用；建议在遇到表述问题时再回来抽查。</p>}
      {draft.readiness === "必须人工确认" && <button onClick={() => toggleApproval(draft.id)} className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold ${approved.includes(draft.id) ? "bg-emerald-600 text-white" : "border border-amber-300 text-amber-800"}`}>{approved.includes(draft.id) ? "✓ 已确认，可进入题库" : "确认答案与题干"}</button>}
      {draft.readiness === "资料不足" && <p className="mt-4 text-sm font-semibold text-rose-600">缺少可靠答案，暂不允许进入题库。</p>}
    </article>)}</div>}
  </div></main></SidebarLayout>;
}
