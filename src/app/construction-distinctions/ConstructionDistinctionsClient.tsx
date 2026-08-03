"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import {
  constructionDistinctions,
  constructionExamEvidence,
  type ConstructionDistinction,
} from "@/lib/construction-distinctions";

type Language = "zh" | "ja";
type Category = ConstructionDistinction["category"] | "全部";
type EvidenceLevel = "all" | "direct" | "related" | "foundation";

const categories: Category[] = [
  "全部", "木造", "RC・PC", "S造", "外皮", "基礎", "構造", "組積・材料",
];

const evidenceLabels = {
  direct: { zh: "専門1直接考过", ja: "専門1で直接出題", style: "bg-emerald-100 text-emerald-800" },
  related: { zh: "真题关联扩展", ja: "過去問から関連拡張", style: "bg-blue-100 text-blue-800" },
  foundation: { zh: "基础补充", ja: "基礎補足", style: "bg-slate-100 text-slate-600" },
} as const;

function MiniDiagram({ id }: { id: string }) {
  if (id === "joints") {
    return <div className="grid grid-cols-2 gap-3 text-center text-xs text-slate-500">
      {["芋目地", "馬目地"].map((name, index) => <div key={name}><div className="mb-2 font-medium">{name}</div><div className="space-y-1">{[0,1,2].map(row => <div key={row} className={`flex gap-1 ${index && row % 2 ? "translate-x-3" : ""}`}>{[0,1,2].map(cell => <i key={cell} className="block h-4 flex-1 border border-amber-500 bg-amber-50" />)}</div>)}</div></div>)}
    </div>;
  }
  if (id === "foundation-types") {
    return <div className="grid grid-cols-3 items-end gap-4 text-center text-xs text-slate-500">
      <div><i className="mx-auto mb-2 block h-12 w-3 bg-slate-600"/><i className="mx-auto block h-3 w-16 bg-amber-500"/>独立</div>
      <div><i className="mx-auto mb-2 block h-12 w-16 border-x-4 border-slate-600"/><i className="block h-3 bg-amber-500"/>布</div>
      <div><i className="mx-auto mb-2 block h-12 w-20 border-x-4 border-slate-600"/><i className="block h-3 bg-amber-500"/>べた</div>
    </div>;
  }
  if (id === "src-cft") {
    return <div className="flex justify-center gap-10 text-center text-xs text-slate-500"><div><div className="mb-2 flex h-20 w-20 items-center justify-center border-8 border-stone-300"><i className="block h-10 w-4 bg-slate-700"/></div>SRC</div><div><div className="mb-2 flex h-20 w-20 items-center justify-center border-8 border-slate-700 bg-stone-200"/>CFT</div></div>;
  }
  if (id === "seismic-systems") {
    return <div className="grid grid-cols-3 gap-5 text-center text-xs text-slate-500">{[["耐震","╳"],["制震","◀▶"],["免震","═"]].map(([name, mark]) => <div key={name}><div className="mb-2 border-x-4 border-slate-500 py-3 text-lg font-bold text-violet-600">{mark}</div>{name}</div>)}</div>;
  }
  return null;
}

export default function ConstructionDistinctionsClient() {
  const [language, setLanguage] = useState<Language>("zh");
  const [category, setCategory] = useState<Category>("全部");
  const [evidenceLevel, setEvidenceLevel] = useState<EvidenceLevel>("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => constructionDistinctions.filter(item => {
    const categoryMatch = category === "全部" || item.category === category;
    const evidenceMatch = evidenceLevel === "all" || constructionExamEvidence[item.id]?.level === evidenceLevel;
    const text = [...item.terms, item.titleZh, item.titleJa, item.keyZh, item.keyJa].join(" ").toLowerCase();
    return categoryMatch && evidenceMatch && text.includes(query.trim().toLowerCase());
  }), [category, evidenceLevel, query]);

  const zh = language === "zh";
  return <SidebarLayout><main className="min-h-full bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-4 text-sm"><Link href="/explore" className="text-cyan-700 hover:underline">← {zh ? "返回探索" : "探索に戻る"}</Link><Link href="/construction-methods-knowledge-map" className="text-emerald-700 hover:underline">{zh ? "建筑构法知识地图 →" : "建築構法知識マップ →"}</Link></div>
            <p className="mt-5 text-sm font-semibold text-emerald-700">{zh ? "専門1过去问 × 最小辨析" : "専門1過去問 × 最小限の見分け方"}</p>
            <h1 className="mt-1 text-3xl font-bold">{zh ? "建筑构法辨析词典" : "建築構法・見分け方辞典"}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{zh ? "只围绕専門1整理：先确认是否真实考过，再记位置、功能或传力方式。直接考过的优先，关联扩展用于理解，基础补充放在最后。" : "専門1に限定し、出題実績を確認してから位置・機能・伝力方式を覚える。直接出題を優先し、関連拡張と基礎補足を分けて扱う。"}</p>
          </div>
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-sm">
            <button onClick={() => setLanguage("zh")} className={`rounded px-3 py-1.5 ${zh ? "bg-slate-900 text-white" : "text-slate-600"}`}>中文</button>
            <button onClick={() => setLanguage("ja")} className={`rounded px-3 py-1.5 ${!zh ? "bg-slate-900 text-white" : "text-slate-600"}`}>日本語</button>
          </div>
        </div>
      </div>
    </header>
    <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
      <section className="sticky top-0 z-10 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <input value={query} onChange={event => setQuery(event.target.value)} placeholder={zh ? "搜索构法或部材名称" : "構法・部材名を検索"} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
        <div className="mt-3 flex flex-wrap gap-2">{categories.map(value => <button key={value} onClick={() => setCategory(value)} className={`rounded-full px-3 py-1 text-xs font-medium ${category === value ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800"}`}>{value}</button>)}</div>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {(["all", "direct", "related", "foundation"] as const).map(value => <button key={value} onClick={() => setEvidenceLevel(value)} className={`rounded px-3 py-1 text-xs font-medium ${evidenceLevel === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{value === "all" ? (zh ? "全部证据" : "全エビデンス") : evidenceLabels[value][language]}</button>)}
        </div>
      </section>
      <div className="my-5 flex items-center justify-between text-sm text-slate-500"><span>{zh ? `显示 ${visible.length} / ${constructionDistinctions.length} 组` : `${visible.length} / ${constructionDistinctions.length}組を表示`}</span><span>{zh ? "答案语言可在右上角切换" : "右上で言語を切替"}</span></div>
      <section className="grid gap-4 lg:grid-cols-2">
        {visible.map(item => { const evidence = constructionExamEvidence[item.id]; return <article key={item.id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold text-emerald-700">{item.category}</p><h2 className="mt-1 text-xl font-bold">{zh ? item.titleZh : item.titleJa}</h2><p className="mt-1 text-sm text-slate-500">{item.terms.join(" ／ ")}</p></div>{evidence && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${evidenceLabels[evidence.level].style}`}>{evidenceLabels[evidence.level][language]}</span>}</div>
          {evidence && <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-3"><p className="text-[10px] font-bold tracking-wide text-emerald-800">{zh ? "専門1证据与考法" : "専門1の出題根拠"}</p>{evidence.references.length ? <p className="mt-1 text-xs font-semibold text-slate-700">{evidence.references.join(" ／ ")}</p> : <p className="mt-1 text-xs text-slate-500">{zh ? "尚未确认直接出题年份" : "直接出題年は未確認"}</p>}<p className="mt-1 text-xs leading-5 text-slate-600">{zh ? evidence.focusZh : evidence.focusJa}</p></div>}
          <div className="mt-5 rounded-lg bg-slate-50 p-4"><h3 className="text-xs font-bold tracking-wide text-violet-700">{zh ? "一眼判断" : "見分け方"}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{zh ? item.recognitionZh : item.recognitionJa}</p><div className="mt-4"><MiniDiagram id={item.id}/></div></div>
          <details className="group mt-4 rounded-lg border border-slate-200"><summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700">{zh ? "展开考试最小答案句" : "試験用の最小答案文"}<span className="float-right text-slate-400 group-open:rotate-90">›</span></summary><div className="border-t border-slate-200 px-4 py-4"><p className="text-xs font-bold text-violet-700">{zh ? "日语作答句" : "答案文"}</p><p className="mt-2 text-sm font-medium leading-7 text-slate-800">{item.keyJa}</p>{zh && <p className="mt-3 text-sm leading-7 text-slate-600">{item.keyZh}</p>}<div className="mt-3 flex flex-wrap gap-1.5">{item.examForms.map(form => <span key={form} className="rounded bg-violet-50 px-2 py-1 text-[11px] text-violet-700">{form}</span>)}</div><a href={item.notionUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-medium text-emerald-700 hover:underline">{zh ? "查看 Notion 知识来源 ↗" : "Notionの知識ソース ↗"}</a></div></details>
        </article>})}
      </section>
    </div>
  </main></SidebarLayout>;
}
