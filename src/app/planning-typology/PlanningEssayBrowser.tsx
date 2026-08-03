"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PLANNING_ESSAY_CONCEPTS,
  PLANNING_ESSAY_DETAIL_BLOCKS,
  PLANNING_ESSAY_EXCLUDED_NUMERIC,
  PLANNING_ESSAY_QUESTIONS,
  PLANNING_ESSAY_SOURCE_LIMITS,
  type PlanningEssayConcept,
} from "@/lib/planning-essay-index";

type Language = "zh" | "ja";
type Mode = "concepts" | "questions";
type ConceptCategory = "all" | PlanningEssayConcept["category"];
type ExamFilter = "all" | "専門1" | "専門2-2";

const CATEGORY_LABELS: Record<ConceptCategory, [string, string]> = {
  all: ["全部", "すべて"],
  space: ["空间组织", "空間構成"],
  design: ["设计思想", "設計思想"],
  city: ["城市理论", "都市理論"],
  society: ["使用与社会", "利用・社会"],
  technology: ["技术体系", "技術体系"],
};

const KIND_LABELS = {
  concept: ["概念论述", "概念論述"],
  "case-reading": ["案例判读", "事例読解"],
  comparison: ["比较论述", "比較論述"],
  "spatial-analysis": ["空间分析", "空間分析"],
} as const;

function questionHref(fileName: string) {
  const input = new TextEncoder().encode(fileName.replace(/\.md$/, ""));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let output = "";
  for (let index = 0; index < input.length; index += 3) {
    const a = input[index];
    const hasB = index + 1 < input.length;
    const hasC = index + 2 < input.length;
    const b = hasB ? input[index + 1] : 0;
    const c = hasC ? input[index + 2] : 0;
    output += alphabet[a >> 2];
    output += alphabet[((a & 3) << 4) | (b >> 4)];
    if (hasB) output += alphabet[((b & 15) << 2) | (c >> 6)];
    if (hasC) output += alphabet[c & 63];
  }
  return `/question/${output}`;
}

function ExamReference({ concept, language }: { concept: PlanningEssayConcept; language: Language }) {
  return (
    <div className="flex flex-wrap gap-2">
      {concept.examRefs.map((ref) => (
        <span key={`${ref.year}-${ref.exam}-${ref.question}-${ref.subQuestion ?? ""}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {ref.year} {ref.exam} Q{ref.question}{ref.subQuestion ? ` ${ref.subQuestion}` : ""}
        </span>
      ))}
      {language === "zh" && <span className="self-center text-[10px] text-slate-400">出现记录，不代表每次都是主答案</span>}
    </div>
  );
}

function ConceptsView({ language }: { language: Language }) {
  const [category, setCategory] = useState<ConceptCategory>("all");
  const [selectedId, setSelectedId] = useState("five-points");
  const filtered = useMemo(
    () => PLANNING_ESSAY_CONCEPTS.filter((item) => category === "all" || item.category === category),
    [category],
  );
  const selected = PLANNING_ESSAY_CONCEPTS.find((item) => item.id === selectedId) ?? filtered[0];
  const q2015 = PLANNING_ESSAY_CONCEPTS.filter((item) => item.examRefs.some((ref) => ref.year === 2015 && ref.exam === "専門1" && ref.question === "5"));
  const correct2015 = q2015.filter((item) => item.correctFor2015).sort((a, b) => Number(a.imageNumber) - Number(b.imageNumber));
  const term = (item: PlanningEssayConcept) => language === "zh" ? item.termZh : item.termJa;
  const findTerm = (id: string) => {
    const item = PLANNING_ESSAY_CONCEPTS.find((concept) => concept.id === id);
    return item ? term(item) : id;
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-white">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_.9fr] lg:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Concept atlas</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{language === "zh" ? "从图与关键词，反向找到理论" : "図とキーワードから理論へ戻る"}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{language === "zh" ? "这一轴只收录论述题中真正需要定义、辨认或比较的概念。每张卡片都把“定义—图面证据—空间机制—易混概念—出题记录”连成一条答题链。" : "論述で定義・識別・比較が必要な概念だけを収録し、定義・図面根拠・空間メカニズム・類似概念・出題履歴を一つの回答経路にまとめます。"}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-end">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black">{PLANNING_ESSAY_CONCEPTS.length}</p><p className="mt-1 text-xs text-slate-400">{language === "zh" ? "已定位概念" : "整理済み概念"}</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-black">5</p><p className="mt-1 text-xs text-slate-400">{language === "zh" ? "2015 Q5 图像答案" : "2015 Q5 図像回答"}</p></div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as ConceptCategory[]).map((id) => (
            <button key={id} type="button" onClick={() => { setCategory(id); const next = PLANNING_ESSAY_CONCEPTS.find((item) => id === "all" || item.category === id); if (next) setSelectedId(next.id); }} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${category === id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {CATEGORY_LABELS[id][language === "zh" ? 0 : 1]}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="max-h-[690px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`w-full rounded-2xl border p-3 text-left transition ${selected?.id === item.id ? "border-cyan-500 bg-cyan-50 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
                <p className="text-sm font-bold text-slate-900">{term(item)}</p>
                <p lang={language === "zh" ? "ja" : "zh"} className="mt-1 text-[11px] text-slate-400">{language === "zh" ? item.termJa : item.termZh}</p>
              </button>
            ))}
          </div>
          {selected && <article className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid bg-slate-50 md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-700">{CATEGORY_LABELS[selected.category][language === "zh" ? 0 : 1]}</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">{term(selected)}</h3>
                <p className="mt-1 text-sm text-slate-400">{language === "zh" ? selected.termJa : selected.termZh}</p>
                <p className="mt-5 text-sm leading-7 text-slate-700">{language === "zh" ? selected.definitionZh : selected.definitionJa}</p>
              </div>
              {selected.image ? <div className="relative min-h-52 border-t border-slate-200 bg-white md:border-l md:border-t-0"><Image src={selected.image} alt={term(selected)} fill unoptimized sizes="240px" className="object-contain p-3" /></div> : <div className="grid min-h-40 place-items-center border-t border-dashed border-slate-300 bg-white px-5 text-center text-xs text-slate-400 md:border-l md:border-t-0">{language === "zh" ? "该词不依赖单一固定图像，优先记关系与判别词。" : "単一画像ではなく、関係と識別語を優先して覚える。"}</div>}
            </div>
            <div className="grid gap-px bg-slate-200 md:grid-cols-2">
              <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Visual evidence</p><ul className="mt-3 space-y-2 text-sm text-slate-700">{(language === "zh" ? selected.visualCuesZh : selected.visualCuesJa).map((cue) => <li key={cue} className="flex gap-2"><span className="text-cyan-600">●</span><span>{cue}</span></li>)}</ul></div>
              <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Spatial mechanism</p><p className="mt-3 text-sm leading-7 text-slate-700">{language === "zh" ? selected.mechanismZh : selected.mechanismJa}</p></div>
              <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Do not confuse</p><div className="mt-3 flex flex-wrap gap-2">{selected.contrasts.map((id) => <button key={id} type="button" onClick={() => PLANNING_ESSAY_CONCEPTS.some((item) => item.id === id) && setSelectedId(id)} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">{findTerm(id)}</button>)}</div></div>
              <div className="bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Exam record</p><div className="mt-3"><ExamReference concept={selected} language={language} /></div></div>
            </div>
          </article>}
        </div>
      </section>

      <section className="rounded-3xl border border-violet-200 bg-violet-50 p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-700">2015 専門1 Q5 · closed loop</p><h2 className="mt-2 text-2xl font-bold text-slate-950">{language === "zh" ? "五张图的识别闭环" : "五つの図像を識別する閉ループ"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{language === "zh" ? "先用可见证据选词，再按“提出者／时代 → 定义 → 机制 → 图中证据”写约200字。不要从17个词的字面意思猜。" : "可視的根拠から用語を選び、提唱者・時代 → 定義 → メカニズム → 図中の根拠の順で約200字を書く。"}</p></div><Link href={questionHref("2015_専門1_建筑计划_Q5.md")} className="rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-800">{language === "zh" ? "打开原题 →" : "原題を開く →"}</Link></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {correct2015.map((item) => <button key={item.id} type="button" onClick={() => { setCategory("all"); setSelectedId(item.id); }} className="overflow-hidden rounded-2xl border border-violet-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="relative aspect-[4/3] bg-slate-50"><Image src={item.image!} alt={`Figure ${item.imageNumber}`} fill unoptimized sizes="240px" className="object-contain p-2" /></div><div className="border-t border-slate-100 p-4"><p className="text-[10px] font-black text-violet-600">FIGURE {item.imageNumber}</p><p className="mt-1 text-sm font-bold text-slate-900">{term(item)}</p><p className="mt-2 text-xs leading-5 text-slate-500">{(language === "zh" ? item.visualCuesZh : item.visualCuesJa).slice(0, 2).join(" · ")}</p></div></button>)}
        </div>
        <div className="mt-5 rounded-2xl border border-violet-200 bg-white p-4"><p className="text-xs font-bold text-slate-700">{language === "zh" ? "题目给出的17个候选词" : "設問に示された17候補語"}</p><div className="mt-3 flex flex-wrap gap-2">{q2015.map((item) => <span key={item.id} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.correctFor2015 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{term(item)}{item.correctFor2015 ? ` · ${language === "zh" ? "本题答案" : "正答"}` : ""}</span>)}</div></div>
      </section>
    </div>
  );
}

function QuestionsView({ language }: { language: Language }) {
  const [exam, setExam] = useState<ExamFilter>("all");
  const [year, setYear] = useState<number | "all">("all");
  const years = [...new Set(PLANNING_ESSAY_QUESTIONS.map((item) => item.ref.year))].sort((a, b) => b - a);
  const counts = {
    s1: PLANNING_ESSAY_QUESTIONS.filter((item) => item.ref.exam === "専門1").length,
    s22: PLANNING_ESSAY_QUESTIONS.filter((item) => item.ref.exam === "専門2-2").length,
    ready: PLANNING_ESSAY_QUESTIONS.filter((item) => !PLANNING_ESSAY_SOURCE_LIMITS[item.id]).length,
    sourceLimited: Object.keys(PLANNING_ESSAY_SOURCE_LIMITS).length,
  };
  const filtered = PLANNING_ESSAY_QUESTIONS.filter((item) => (exam === "all" || item.ref.exam === exam) && (year === "all" || item.ref.year === year));
  const conceptName = (id: string) => {
    const concept = PLANNING_ESSAY_CONCEPTS.find((item) => item.id === id);
    return concept ? (language === "zh" ? concept.termZh : concept.termJa) : id;
  };

  return <div className="space-y-6">
    <section className="rounded-3xl bg-slate-950 p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-rose-300">Essay question index</p><div className="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h2 className="text-2xl font-bold sm:text-3xl">{language === "zh" ? "按考题组织案例与理论" : "設問から事例と理論を引く"}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{language === "zh" ? "收录需要文字论述、图面判读或空间关系分析的题目。专门2-2的数理计划法已从这一索引排除。" : "記述、図面読解、空間関係の分析が必要な設問を収録。専門2-2の数理計画法は除外済みです。"}</p></div><div className="flex gap-3"><div className="rounded-2xl bg-white/5 px-4 py-3"><b className="text-xl">{counts.s1}</b><span className="ml-2 text-xs text-slate-400">専門1</span></div><div className="rounded-2xl bg-white/5 px-4 py-3"><b className="text-xl">{counts.s22}</b><span className="ml-2 text-xs text-slate-400">専門2-2</span></div></div></div></section>

    <section className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-2xl font-black text-emerald-800">{counts.ready}</p><p className="mt-1 text-xs text-emerald-700">{language === "zh" ? "索引与拆解可用" : "索引・設問分解が利用可能"}</p></div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-2xl font-black text-amber-800">{counts.sourceLimited}</p><p className="mt-1 text-xs text-amber-700">{language === "zh" ? "公开图源受限" : "公開図版に制限"}</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-2xl font-black text-slate-800">0</p><p className="mt-1 text-xs text-slate-500">{language === "zh" ? "完全缺失" : "未収録"}</p></div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">{(["all", "専門1", "専門2-2"] as ExamFilter[]).map((id) => <button key={id} type="button" onClick={() => setExam(id)} className={`rounded-full px-3 py-2 text-xs font-bold ${exam === id ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>{id === "all" ? (language === "zh" ? "全部考试" : "全試験") : id}</button>)}<select aria-label={language === "zh" ? "按年份筛选" : "年度で絞り込み"} value={year} onChange={(event) => setYear(event.target.value === "all" ? "all" : Number(event.target.value))} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"><option value="all">{language === "zh" ? "全部年份" : "全年度"}</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select><span className="ml-auto text-xs text-slate-400">{filtered.length} {language === "zh" ? "题" : "問"}</span></div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {filtered.map((item) => {
          const sourceLimit = PLANNING_ESSAY_SOURCE_LIMITS[item.id];
          const detailBlocks = PLANNING_ESSAY_DETAIL_BLOCKS[item.id] ?? [];
          return <article key={item.id} className={`flex flex-col rounded-2xl border p-5 ${sourceLimit ? "border-amber-200 bg-amber-50/20" : "border-slate-200"}`}>
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[11px] font-black text-rose-700">{item.ref.year} · {item.ref.exam} · Q{item.ref.question}</p><h3 className="mt-2 text-lg font-bold text-slate-950">{language === "zh" ? item.titleZh : item.titleJa}</h3></div>
              <div className="flex shrink-0 flex-col items-end gap-1.5"><span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">{KIND_LABELS[item.kind][language === "zh" ? 0 : 1]}</span>{sourceLimit && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">{language === "zh" ? "图源受限" : "図版制限"}</span>}</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{language === "zh" ? item.requirementZh : item.requirementJa}</p>
            {sourceLimit && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">{language === "zh" ? sourceLimit.zh : sourceLimit.ja}</p>}
            {item.concepts.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{item.concepts.map((id) => <span key={id} className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-800">{conceptName(id)}</span>)}</div>}
            <div className="mt-4"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">Cases / objects</p><p className="mt-1 text-xs leading-5 text-slate-600">{item.cases.join(" ／ ")}</p></div>
            <ol className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">{(language === "zh" ? item.answerFrameworkZh : item.answerFrameworkJa).map((step, index) => <li key={step} className="flex gap-2 rounded-xl bg-slate-50 p-2.5"><span className="font-black text-rose-500">{index + 1}</span><span>{step}</span></li>)}</ol>
            {detailBlocks.length > 0 && <details className="mt-4 rounded-xl border border-violet-200 bg-violet-50/50 p-3">
              <summary className="cursor-pointer text-xs font-bold text-violet-800">{language === "zh" ? `展开已核对拆解（${detailBlocks.length}）` : `確認済みの設問分解（${detailBlocks.length}）`}</summary>
              <div className="mt-3 space-y-3">{detailBlocks.map((block) => <section key={block.id} className="overflow-hidden rounded-xl border border-violet-100 bg-white">
                {block.image && <div className="relative aspect-[16/9] border-b border-violet-100 bg-slate-50"><Image src={block.image} alt={language === "zh" ? block.titleZh : block.titleJa} fill unoptimized sizes="420px" className="object-contain p-2" /></div>}
                <div className="p-3"><div className="flex items-start justify-between gap-2"><h4 className="text-xs font-bold text-slate-900">{language === "zh" ? block.titleZh : block.titleJa}</h4>{block.sourceStatus === "public-source-redacted" && <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">{language === "zh" ? "公开版缺图" : "公開版欠落"}</span>}</div><p className="mt-2 text-[11px] leading-5 text-slate-500">{language === "zh" ? block.promptZh : block.promptJa}</p><ul className="mt-2 space-y-1.5 text-[11px] leading-5 text-slate-700">{(language === "zh" ? block.keyPointsZh : block.keyPointsJa).map((point) => <li key={point} className="flex gap-2"><span className="text-violet-500">●</span><span>{point}</span></li>)}</ul></div>
              </section>)}</div>
            </details>}
            <Link href={questionHref(item.fileName)} className="mt-5 self-start rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-rose-300 hover:text-rose-700">{language === "zh" ? "打开题目详情 →" : "設問詳細を開く →"}</Link>
          </article>;
        })}
      </div>
    </section>

    <details className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><summary className="cursor-pointer text-sm font-bold text-amber-900">{language === "zh" ? `已排除的数理计划法题目（${PLANNING_ESSAY_EXCLUDED_NUMERIC.length}）` : `除外した数理計画法（${PLANNING_ESSAY_EXCLUDED_NUMERIC.length}）`}</summary><ul className="mt-4 grid gap-2 text-xs leading-5 text-amber-900 sm:grid-cols-2">{PLANNING_ESSAY_EXCLUDED_NUMERIC.map((item) => <li key={item} className="rounded-xl bg-white/70 px-3 py-2">{item}</li>)}</ul></details>
  </div>;
}

export function PlanningEssayBrowser({ language, mode }: { language: Language; mode: Mode }) {
  return mode === "concepts" ? <ConceptsView language={language} /> : <QuestionsView language={language} />;
}
