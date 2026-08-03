"use client";

import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import {
  architectureExpressions,
  type ArchitectureExpression,
  type EntryType,
  type ExpressionCategory,
  type ExpressionSkill,
  type FacilityType,
  type InferenceStrength,
  type ObservationAxis,
} from "@/lib/architecture-expressions";
import { exampleHighlightById, observationAxes, readingLenses } from "@/lib/architecture-planning-reading";

const categories: (ExpressionCategory | "全部")[] = ["全部", "建筑计划", "建筑史", "建筑构法"];
const skills: (ExpressionSkill | "全部")[] = ["全部", "描述", "比较", "原因", "结果", "评价"];
const entryTypes: (EntryType | "全部")[] = ["全部", "表达", "Pattern", "结果"];
const facilities: (FacilityType | "全部")[] = ["全部", "住宅", "教育", "医疗・福祉", "商业・办公", "文化・公共", "都市"];

const categoryStyle: Record<ExpressionCategory, string> = {
  建筑计划: "border-cyan-200 bg-cyan-50 text-cyan-800",
  建筑史: "border-amber-200 bg-amber-50 text-amber-800",
  建筑构法: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const entryTypeStyle: Record<EntryType, string> = {
  表达: "bg-slate-100 text-slate-600",
  Pattern: "bg-violet-100 text-violet-800",
  结果: "bg-emerald-100 text-emerald-800",
};

const inferenceStyle: Record<InferenceStrength, string> = {
  直接观察: "bg-sky-50 text-sky-700",
  较强推论: "bg-amber-50 text-amber-700",
  需要背景知识: "bg-rose-50 text-rose-700",
};

const inferenceIcon: Record<InferenceStrength, string> = {
  直接观察: "👁", 较强推论: "🔗", 需要背景知识: "📚",
};

function filterCount(predicate: (item: ArchitectureExpression) => boolean) {
  return architectureExpressions.filter(predicate).length;
}

function ExampleSentence({ example, expression, highlight }: { example: string; expression: string; highlight?: string }) {
  const normalized = expression.replaceAll("〜", "");
  const candidates = [
    normalized,
    ...expression.split("〜").map((part) => part.trim()).filter((part) => part.length >= 3),
  ].sort((a, b) => b.length - a.length);
  const matched = highlight && example.includes(highlight) ? highlight : candidates.find((candidate) => example.includes(candidate));

  if (!matched) return <>{example}</>;

  const start = example.indexOf(matched);
  return <>{example.slice(0, start)}<strong className="font-bold text-violet-800">{matched}</strong>{example.slice(start + matched.length)}</>;
}

export default function ExpressionLibraryClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ExpressionCategory | "全部">("全部");
  const [axis, setAxis] = useState<ObservationAxis | "全部">("全部");
  const [entryType, setEntryType] = useState<EntryType | "全部">("全部");
  const [facility, setFacility] = useState<FacilityType | "全部">("全部");
  const [skill, setSkill] = useState<ExpressionSkill | "全部">("全部");
  const [networkFocus, setNetworkFocus] = useState<string | null>(null);

  const cardById = useMemo(() => new Map(architectureExpressions.map((item) => [String(item.id), item])), []);
  const planningCards = useMemo(() => architectureExpressions.filter((item) => item.category === "建筑计划"), []);
  const patternCount = useMemo(() => planningCards.filter((item) => item.entryType === "Pattern").length, [planningCards]);
  const expressionCount = useMemo(() => planningCards.filter((item) => item.entryType === "表达").length, [planningCards]);
  const resultCount = useMemo(() => planningCards.filter((item) => item.entryType === "结果").length, [planningCards]);
  const selectedLens = facility === "全部" ? null : readingLenses.find((lens) => lens.id === facility);

  const visible = (() => {
    const needle = query.trim().toLocaleLowerCase();
    return architectureExpressions.filter((item) => {
      const matchesCategory = category === "全部" || item.category === category;
      const matchesAxis = axis === "全部" || item.axis === axis || item.secondaryAxes?.includes(axis);
      const matchesEntryType = entryType === "全部" || item.entryType === entryType;
      const matchesFacility = facility === "全部" || item.facilities?.includes(facility);
      const matchesSkill = skill === "全部" || item.skills.includes(skill);
      const matchesNetwork = !networkFocus || String(item.id) === networkFocus || item.relatedPatternIds?.includes(networkFocus);
      const text = [
        item.meaning, item.japanese, item.scene, item.recognition, item.example, item.axis,
        ...(item.secondaryAxes ?? []), ...(item.visualCues ?? []), ...(item.effects ?? []),
        ...(item.related ?? []), ...(item.facilities ?? []),
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      return matchesCategory && matchesAxis && matchesEntryType && matchesFacility && matchesSkill && matchesNetwork && (!needle || text.includes(needle));
    });
  })();

  const clearFilters = () => {
    setCategory("全部"); setAxis("全部"); setEntryType("全部"); setFacility("全部"); setSkill("全部"); setQuery(""); setNetworkFocus(null);
  };

  const focusNetwork = (id: string) => {
    setNetworkFocus(id);
    setCategory("建筑计划");
    document.getElementById("library-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filterPanel = (
    <div className="space-y-5 text-sm">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">学科</p>
        <div className="space-y-1">
          {categories.map((value) => (
            <button key={value} onClick={() => { setCategory(value); setNetworkFocus(null); }} className={`w-full rounded-lg px-3 py-2 text-left transition ${category === value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {value}<span className="float-right opacity-60">{value === "全部" ? architectureExpressions.length : filterCount((item) => item.category === value)}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">阅读层</p>
        <div className="space-y-1">
          {entryTypes.map((value) => (
            <button key={value} onClick={() => { setEntryType(value); setCategory(value === "全部" ? category : "建筑计划"); setNetworkFocus(null); }} className={`w-full rounded-lg px-3 py-2 text-left transition ${entryType === value ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-violet-50"}`}>
              {value === "全部" ? "全部" : value === "Pattern" ? "Pattern 空间类型" : value}<span className="float-right opacity-60">{value === "全部" ? planningCards.length : filterCount((item) => item.category === "建筑计划" && item.entryType === value)}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">观察轴</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => { setAxis("全部"); setNetworkFocus(null); }} className={`rounded-full px-2.5 py-1 text-[11px] ${axis === "全部" ? "bg-cyan-700 text-white" : "bg-cyan-50 text-cyan-800"}`}>全部</button>
          {observationAxes.map((value) => <button key={value} onClick={() => { setAxis(value); setCategory("建筑计划"); setNetworkFocus(null); }} className={`rounded-full px-2.5 py-1 text-[11px] ${axis === value ? "bg-cyan-700 text-white" : "bg-cyan-50 text-cyan-800"}`}>{value}</button>)}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">用途透镜</p>
        <div className="flex flex-wrap gap-1.5">
          {facilities.map((value) => <button key={value} onClick={() => { setFacility(value); if (value !== "全部") setCategory("建筑计划"); setNetworkFocus(null); }} className={`rounded-full px-2.5 py-1 text-[11px] ${facility === value ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-800"}`}>{value}</button>)}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">技能标签</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((value) => <button key={value} onClick={() => { setSkill(value); setNetworkFocus(null); }} className={`rounded-full px-3 py-1.5 text-xs transition ${skill === value ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"}`}>{value}</button>)}
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs leading-5 text-slate-500">
        <span className="font-bold text-slate-700">READING TIP</span><br />先写看见的图面事实，再用「〜しやすい」「〜と考えられる」说明作用。
      </div>
    </div>
  );

  return (
    <SidebarLayout slot={filterPanel}>
      <div className="min-h-full bg-[#f7f7f3] text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-600"><span className="rounded bg-violet-600 px-2 py-1 text-white">V1.1</span> Architecture Reading System</div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">建筑日语表达 <span className="font-serif italic text-violet-600">Library</span></h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">从 Pattern 读出图面事实，再组织合理推论，最后写成可直接用于入试的日语。</p>
              </div>
              <div className="flex gap-5 border-l-2 border-violet-200 pl-5 text-sm">
                <div><p className="text-2xl font-bold">{planningCards.length}</p><p className="text-xs text-slate-500">PLAN CARDS</p></div>
                <div><p className="text-2xl font-bold">{patternCount}</p><p className="text-xs text-slate-500">PATTERNS</p></div>
                <div><p className="text-2xl font-bold">{resultCount}</p><p className="text-xs text-slate-500">REASONING</p></div>
              </div>
            </div>
            <ol className="mt-7 grid gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:grid-cols-7">
              {["建筑类型？", "主要使用者？", "公共空间？", "私密空间？", "动线？", "为什么这样？", "事实还是推论？"].map((step, index) => <li key={step} className="flex items-center gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[10px] font-bold text-violet-700">{index + 1}</span>{step}</li>)}
            </ol>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <div className="sticky top-0 z-20 -mx-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">搜索表达</span><span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">⌕</span>
                <input value={query} onChange={(event) => { setQuery(event.target.value); setNetworkFocus(null); }} placeholder="搜索 Pattern、日语、Visual Cue、作用或用途…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100" />
              </label>
              <div className="flex gap-2 overflow-x-auto lg:hidden">
                {categories.map((value) => <button key={value} onClick={() => setCategory(value)} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium ${category === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{value}</button>)}
              </div>
            </div>
          </div>

          {selectedLens && <section lang="ja" className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5"><div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-emerald-100 pb-3"><div><p className="text-xs font-bold tracking-[0.16em] text-emerald-700">用途別・読解の視点</p><h2 className="mt-1 text-base font-bold text-slate-900">{selectedLens.japanese}</h2></div><p className="text-xs text-emerald-800">図面を見る前に、用途に固有の条件を確認する。</p></div><div className="mt-4 grid gap-4 text-xs leading-5 text-slate-600 sm:grid-cols-2 xl:grid-cols-4"><div><p className="font-bold text-slate-800">主な利用者</p><p className="mt-1">{selectedLens.users}</p></div><div><p className="font-bold text-slate-800">基本機能</p><p className="mt-1">{selectedLens.function}</p></div><div><p className="font-bold text-slate-800">図面で確認する点</p><ul className="mt-1 space-y-0.5">{selectedLens.lookFor.map((item) => <li key={item}>・{item}</li>)}</ul></div><div><p className="font-bold text-slate-800">答案で考えること</p><p className="mt-1">{selectedLens.answerFocus}</p></div></div></section>}

          <div id="library-results" className="my-5 flex items-center justify-between gap-4 text-xs text-slate-500">
            <p>显示 <strong className="text-slate-900">{visible.length}</strong> / {architectureExpressions.length} 条{category === "建筑计划" && <span className="ml-2 text-violet-700">其中：表达 {expressionCount} · Pattern {patternCount} · 结果 {resultCount}</span>}</p>
            {(category !== "全部" || axis !== "全部" || entryType !== "全部" || facility !== "全部" || skill !== "全部" || query || networkFocus) && <button onClick={clearFilters} className="shrink-0 font-medium text-violet-700 hover:underline">清除筛选</button>}
          </div>

          {networkFocus && <div className="mb-4 flex items-center justify-between rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs text-violet-800"><span>正在查看 Pattern Network：中心卡与其直接关联卡</span><button onClick={() => setNetworkFocus(null)} className="font-semibold hover:underline">显示全部</button></div>}

          {visible.length > 0 ? (
            <section className="grid gap-4 xl:grid-cols-2">
              {visible.map((item) => {
                const relatedCards = (item.relatedPatternIds ?? []).map((id) => cardById.get(id)).filter((card): card is ArchitectureExpression => Boolean(card));
                return <article key={String(item.id)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:p-6">
                  <div className="absolute right-4 top-3 font-mono text-[10px] tracking-widest text-slate-300">PATTERN {String(item.id).replace("plan-", "").replace("pattern-", "P-").replace("result-", "R-").toUpperCase()}</div>
                  <div className="flex flex-wrap items-center gap-2 pr-24">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${categoryStyle[item.category]}`}>{item.category}</span>
                    {item.entryType && <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${entryTypeStyle[item.entryType]}`}>{item.entryType}</span>}
                    {item.inference && <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${inferenceStyle[item.inference]}`}>{inferenceIcon[item.inference]} {item.inference}</span>}
                    <span className="text-xs tracking-widest text-amber-400" aria-label={`难度 ${item.difficulty} 星`}>{"★".repeat(item.difficulty)}<span className="text-slate-200">{"★".repeat(3 - item.difficulty)}</span></span>
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-500">{item.meaning}</p>
                  <h2 lang="ja" className="mt-1 text-xl font-bold leading-8 tracking-tight text-slate-950 sm:text-2xl">{item.japanese}</h2>
                  {item.visualCues && <div className="mt-4 flex flex-wrap gap-1.5"><span className="mr-1 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Visual Cue</span>{item.visualCues.map((cue) => <span key={cue} lang="ja" className="rounded-md border border-violet-100 bg-violet-50 px-2 py-1 text-[11px] text-violet-800">□ {cue}</span>)}</div>}
                  <div className="mt-4 grid gap-3 border-y border-slate-100 py-4 sm:grid-cols-[5rem_1fr]">
                    {item.axis && <><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">观察轴</p><p className="text-sm text-slate-600">{[item.axis, ...(item.secondaryAxes ?? [])].join(" ／ ")}</p></>}
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">图面识别</p><p className="text-sm leading-6 text-slate-600">{item.recognition ?? item.scene}</p>
                    {item.effects && <><p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">可能作用</p><p className="text-sm leading-6 text-slate-600">{item.effects.join(" · ")}</p></>}
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">例句</p><p lang="ja" className="text-sm font-medium leading-6 text-slate-800"><ExampleSentence example={item.example} expression={item.japanese} highlight={exampleHighlightById[String(item.id)]} /></p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {item.facilities && <div className="flex flex-wrap gap-1.5"><span className="mr-1 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">用途</span>{item.facilities.map((value) => <span key={value} className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] text-emerald-800">{value}</span>)}</div>}
                    {relatedCards.length > 0 && <div className="flex flex-wrap gap-1.5"><span className="mr-1 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Network</span>{relatedCards.map((relatedCard) => <button key={String(relatedCard.id)} onClick={() => focusNetwork(String(relatedCard.id))} className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700 transition hover:bg-violet-100">↗ {relatedCard.meaning}</button>)}</div>}
                    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-1.5">{item.related.map((word) => <span key={word} lang="ja" className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-600">#{word}</span>)}</div><div className="flex gap-1.5">{item.skills.map((tag) => <span key={tag} className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700">{tag}</span>)}</div></div>
                  </div>
                </article>;
              })}
            </section>
          ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center"><p className="text-2xl">⌕</p><p className="mt-3 font-medium">没有找到对应表达</p><p className="mt-1 text-sm text-slate-500">试试更短的关键词或清除筛选。</p></div>}
        </main>
      </div>
    </SidebarLayout>
  );
}
