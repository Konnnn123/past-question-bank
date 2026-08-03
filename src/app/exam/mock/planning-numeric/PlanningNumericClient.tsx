"use client";
import { useMemo, useState } from "react"; import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import { generatePlanningNumericChoice, type PlanningNumericFact } from "@/lib/planning-numeric-choice-generator";

interface Q { id:string; subRelationId:string; unit:string; useType:string;
  prompt:string; options:string[]; correctIndex:number; correctAnswer:string;
  explanation:string; scores:{technicalAccuracy:number;distractorQuality:number;examFidelity:number}; }

const REL_LABELS:Record<string,string>={"15.1":"面積","15.2":"寸法","15.3":"容量","15.4":"距離"};

export default function PlanningNumericClient({questions,eligibleFacts}:{questions:Q[];eligibleFacts:PlanningNumericFact[]}) {
  const [seed, setSeed] = useState(1);
  const generated = useMemo(() => generatePlanningNumericChoice(eligibleFacts, seed), [eligibleFacts, seed]);
  const generatedQuestion: Q = { ...generated, subRelationId: "15.4", unit: generated.compatibilityGroup.split("|")[0], useType: "runtime", scores: { technicalAccuracy: 5, distractorQuality: 5, examFidelity: 5 } };
  const displayQuestions = [generatedQuestion, ...questions];
  const [revealed,setRevealed]=useState<Set<string>>(new Set());
  const toggle=(id:string)=>{const n=new Set(revealed);if(n.has(id)) n.delete(id); else n.add(id);setRevealed(n);};
  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8"><div className="mx-auto max-w-3xl">
    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><b>deprecated_prototype</b>：本页含“答案数值邻近项”练习，不能保留原题案例的认知操作；不属于正式练习入口、完整卷或发布覆盖。</p>
    <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回</Link>
    <div className="flex items-center justify-between mt-2">
      <div><h1 className="text-2xl font-bold">建築計画 · 数値基準</h1><p className="text-sm text-slate-500">{displayQuestions.length} 题 · 2022 Q4 形式 · 4 sub-relations</p></div>
      <div className="flex gap-2"><button onClick={()=>setSeed((value)=>value+1)} className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700">換一題</button><button onClick={()=>setRevealed(new Set(displayQuestions.map(q=>q.id)))} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">全部展開</button></div>
    </div>
    <p className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">正式 Generator：第 1 題由已審核的 Atomic Facts、同單位數值干擾項規則與 seed 在執行時建立；其餘題目保留為既有原型。</p>
    <div className="mt-6 space-y-4">{displayQuestions.map(q=>{const open=revealed.has(q.id);return(
      <article key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded bg-violet-100 px-2 py-0.5 font-semibold text-violet-700">{REL_LABELS[q.subRelationId]??q.subRelationId}</span>
            <span className="text-slate-400">{q.unit} · {q.useType}</span>
            {q.id === generatedQuestion.id && <span className="font-semibold text-indigo-600">atomic_fact_generator</span>}
            <span className="text-slate-400">T:{q.scores.technicalAccuracy} D:{q.scores.distractorQuality} E:{q.scores.examFidelity}</span>
          </div>
          <button onClick={()=>toggle(q.id)} className="text-xs text-indigo-600 hover:underline">{open?"收起":"查看答案"}</button>
        </div>
        <p className="mt-3 text-sm text-slate-800">{q.prompt}</p>
        <div className="mt-3 space-y-1.5">{q.options.map((opt,i)=>(<div key={i} className={`rounded-lg border px-3 py-2 text-sm ${open&&i===q.correctIndex?"border-emerald-400 bg-emerald-50 font-medium":"border-slate-100 bg-slate-50"}`}><span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65+i)}.</span>{opt}{open&&i===q.correctIndex&&<span className="ml-2 text-xs text-emerald-600">←</span>}</div>))}</div>
        {open&&<p className="mt-2 text-xs text-slate-500">{q.explanation}</p>}
      </article>)})}</div>
  </div></main></SidebarLayout>;
}
