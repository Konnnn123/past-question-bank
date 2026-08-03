"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useExploreLanguage } from "@/components/ExploreLanguageProvider";
import OriginalLanguageText from "@/components/OriginalLanguageText";
import { SidebarLayout } from "@/components/layout";
import RecallPractice, { type RecallProfile } from "../../architecture-cards/RecallPractice";
import {
  BUILDING_EXAMPLES,
  ESSAY_CASES,
  FRAMEWORK_ROUTES,
  MECHANISMS,
  OPERATIONS,
  TECH_TYPES,
  WRITING_STEPS,
  c,
  type Copy,
  type FrameworkMode,
} from "./framework-content";
import {
  BUILDING_FAMILIES,
  PAST_QUESTION_AUDIT,
  TECHNOLOGY_TOPICS,
  type AuditStatus,
  type TechnologyTopic,
} from "./framework-extension-content";

export default function FrameworkLearningClient({ mode, recallProfiles = [] }: { mode: FrameworkMode; recallProfiles?: RecallProfile[] }) {
  const { language } = useExploreLanguage();
  const t = (value: Copy) => value[language];
  const gloss = language === "ja";

  return (
    <SidebarLayout slot={<FrameworkSidebar mode={mode} t={t} />}>
      <div className="min-h-full overflow-x-hidden bg-[#f4f1e9] text-slate-950 [overflow-wrap:anywhere] [word-break:normal]">
        {mode === "home" && <FrameworkHome t={t} gloss={gloss} recallProfiles={recallProfiles} recallLang={language === "zh" ? "zh" : "ja"} />}
        {mode === "audit" && <PastQuestionAudit t={t} gloss={gloss} />}
        {mode === "building" && <BuildingTrack t={t} gloss={gloss} />}
        {mode === "thematic" && <ThematicTrack t={t} gloss={gloss} />}
        {mode === "technology" && <TechnologyBuilder t={t} gloss={gloss} />}
        {mode === "writing" && <WritingWorkbench t={t} gloss={gloss} />}
      </div>
    </SidebarLayout>
  );
}

function FrameworkSidebar({ mode, t }: { mode: FrameworkMode; t: (value: Copy) => string }) {
  return (
    <div>
      <p className="text-[10px] font-black tracking-[0.18em] text-violet-700">SPECIALIST 2-2</p>
      <h3 className="mt-1 text-sm font-black text-slate-900">{t(c("建筑史论述学习", "建築史論述学習", "History essay learning"))}</h3>
      <nav className="mt-4 space-y-1.5" aria-label={t(c("学习路线", "学習ルート", "Learning routes"))}>
        {FRAMEWORK_ROUTES.map((item) => (
          <Link key={item.mode} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${mode === item.mode ? "bg-violet-700 text-white shadow-sm" : "bg-white text-slate-700 hover:bg-violet-50"}`}>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${mode === item.mode ? "bg-amber-300 text-slate-950" : "bg-stone-100"}`}>{item.number}</span>
            <span className="min-w-0"><span className="block text-xs font-bold">{t(item.title)}</span><span className={`mt-0.5 block truncate text-[10px] ${mode === item.mode ? "text-violet-100" : "text-slate-400"}`}>{t(item.short)}</span></span>
          </Link>
        ))}
      </nav>
      {mode !== "home" && <Link href="/history/essay-framework" className="mt-5 inline-flex text-xs font-bold text-violet-700 hover:text-violet-900">← {t(c("返回路线选择", "ルート選択へ戻る", "Back to route map"))}</Link>}
    </div>
  );
}

function FrameworkHome({ t, gloss, recallProfiles, recallLang }: { t: (value: Copy) => string; gloss: boolean; recallProfiles: RecallProfile[]; recallLang: "ja" | "zh" }) {
  return (
    <>
      <FrameworkHeader eyebrow="SPECIALIST 2-2 · LEARNING MAP" title={t(c("今天先学一种操作，\n不必一次看完整套框架", "今日は一つの操作を学ぶ。\n全体を一度に読まなくてよい", "Learn one operation today.\nDo not read the whole framework at once."))} description={t(c("这不是长篇目录。选择一条路线后，页面会用同一个案例逐步演示：看什么、为什么、怎样连接，以及最后如何成为答案。", "長い目次ではない。ルートを選ぶと、一つの事例で「何を見るか・なぜか・どうつなぐか・どう答案になるか」を段階的に示す。", "Choose a route and follow one case through what to observe, why it matters, how it connects, and how it becomes an answer."))} gloss={gloss} />
      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-12">
        {recallProfiles.length > 0 && <div className="relative z-10 -mt-10"><RecallPractice profiles={recallProfiles} lang={recallLang} /></div>}
        <section className={`${recallProfiles.length > 0 ? "mt-8" : "relative z-10 -mt-10"} grid min-w-0 gap-5 2xl:grid-cols-2`}>
          <RouteHero href="/history/essay-framework/building" label="TRACK A" color="amber" title={t(c("单体建筑／图面分析", "単体建築・図面分析", "Building and drawing analysis"))} question={t(c("看到陌生平面、断面或照片时，如何从证据推到结构、空间与历史？", "未知の平面・断面・写真から、構造・空間・歴史へどう進むか。", "How can unfamiliar drawings lead to structure, space, and history?"))} steps={[t(c("选择完整建筑示例", "完成事例を選ぶ", "Choose a worked building")), t(c("逐层读取五种证据", "五層の証拠を読む", "Read five evidence layers")), t(c("查看可推断与不可推断", "推論可能／不可能を分ける", "Separate valid and invalid inference")), t(c("组合成完整答案", "完全答案へ組み立てる", "Assemble the answer"))]} />
          <RouteHero href="/history/essay-framework/thematic" label="TRACK B" color="violet" title={t(c("主题论述", "主題論述", "Thematic essays"))} question={t(c("题目不重复时，如何判断它要求哪种思考，并把零散材料组织成因果？", "対象が反復しないとき、思考操作を判定し、材料を因果へどう組織するか。", "When cases do not repeat, how do you classify the operation and organize evidence causally?"))} steps={[t(c("从题干动词判型", "設問動詞から判型", "Classify from prompt verbs")), t(c("区分必需、补充和危险材料", "必須・補助・危険材料を分ける", "Sort required, supporting, and risky evidence")), t(c("逐个解释因果箭头", "因果矢印を説明する", "Explain each causal arrow")), t(c("查看短答、标准答案与错误例", "短答・標準答案・誤答を見る", "See short, standard, and wrong answers"))]} />
        </section>
        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          <ToolLink href="/history/essay-framework/audit" code="24Q" title={t(c("过去问适配审计", "過去問適応監査", "Past-question audit"))} note={t(c("按年度、题型和A／B／C状态检查框架实际覆盖到哪里。", "年度・型・A／B／C判定から実際の適応範囲を確認する。", "Inspect actual coverage by year, type, and A/B/C status."))} />
          <ToolLink href="/history/essay-framework/technology" code="T×M×O" title={t(c("技术史组合生成器", "技術史組合せジェネレーター", "Technology history builder"))} note={t(c("选择变化对象、变化机制和设问操作，动态生成分析图与段落骨架。", "変化対象・機制・設問操作を選び、分析図と段落骨格を生成する。", "Select object, mechanisms, and operation to generate an analysis and paragraph scaffold."))} />
          <ToolLink href="/history/essay-framework/writing" code="1→6" title={t(c("论述工作台", "論述ワークベンチ", "Writing workbench"))} note={t(c("先看完整演示：从圈题干、定结论到选择证据和成文。", "設問確認・結論・証拠選択・成文までを完成演示で見る。", "Watch a full demonstration from reading the prompt to selecting evidence and writing."))} />
        </section>
        <section className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950"><strong>{t(c("建议顺序：", "推奨順序：", "Suggested order:"))}</strong> {t(c("如果现在还不会做题，先进入 Track B 看一个完整案例，再去论述工作台。T×M×O 适合在基本因果关系已经看懂后使用。", "まだ解けない段階では、Track Bの完成事例を見てから論述ワークベンチへ進む。T×M×Oは基本因果を理解した後に使う。", "If you cannot yet answer questions, begin with one worked Track B case, then use the writing workbench. Use T×M×O after basic causality is clear."))}</section>
      </main>
    </>
  );
}

function PastQuestionAudit({ t, gloss }: { t: (value: Copy) => string; gloss: boolean }) {
  const [statusFilter, setStatusFilter] = useState<"ALL" | AuditStatus>("ALL");
  const [selectedId, setSelectedId] = useState(PAST_QUESTION_AUDIT[0].id);
  const filtered = statusFilter === "ALL" ? PAST_QUESTION_AUDIT : PAST_QUESTION_AUDIT.filter((item) => item.status === statusFilter);
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? PAST_QUESTION_AUDIT[0];
  const counts = { A: PAST_QUESTION_AUDIT.filter((item) => item.status === "A").length, B: PAST_QUESTION_AUDIT.filter((item) => item.status === "B").length, C: PAST_QUESTION_AUDIT.filter((item) => item.status === "C").length };
  const statusCopy: Record<AuditStatus, Copy> = {
    A: c("可以选择", "選択可能", "Ready to choose"),
    B: c("有条件", "条件付き", "Conditional"),
    C: c("暂时回避", "現状回避", "Avoid for now"),
  };

  return <>
    <FrameworkHeader eyebrow="24 PAST QUESTIONS · FINAL RE-AUDIT" title={t(c("框架是否真的覆盖过去问，\n不能靠感觉判断", "枠組みが過去問を覆うか、\n感覚ではなく24題で検証する", "Does the framework really cover the exam?\nTest it against 24 questions."))} description={t(c("这里的“覆盖”不是说每题都能写满，而是考场上能否在60秒内判型，并调用具体论点、例子或简图。点击每题查看现有资产与剩余缺口。", "ここでの適応は満点答案ではなく、60秒で判型し、具体論点・例・簡図を呼び出せること。各題を選び、資産と残る穴を確認する。", "Coverage means classifying within 60 seconds and retrieving concrete claims, a case, or a sketch—not claiming a perfect answer. Select a question to inspect assets and gaps."))} compact gloss={gloss} />
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-12">
      <section className="relative z-10 -mt-8 grid gap-3 sm:grid-cols-3">
        {(["A", "B", "C"] as const).map((status) => <button key={status} type="button" onClick={() => setStatusFilter(status)} className={`rounded-2xl border p-5 text-left shadow-sm transition ${statusFilter === status ? "border-slate-950 bg-slate-950 text-white" : "border-stone-200 bg-white hover:border-violet-300"}`}><div className="flex items-center justify-between"><StatusBadge status={status} /><span className="text-3xl font-black">{counts[status]}</span></div><p className="mt-3 text-sm font-black">{t(statusCopy[status])}</p><p className={`mt-1 text-xs leading-5 ${statusFilter === status ? "text-stone-300" : "text-slate-500"}`}>{status === "A" ? t(c("型、最小知识和图／例都已具备", "型・最小知識・図／例が揃う", "Type, minimum knowledge, and case/sketch are ready")) : status === "B" ? t(c("方法成立，但个别对象知识仍有缺口", "方法は成立するが固有知識に穴がある", "Method works, but specific knowledge has gaps")) : t(c("不是框架失败，而是原始图像缺失", "枠組みでなく原資料欠損が原因", "Blocked by missing source images, not by the framework"))}</p></button>)}
      </section>

      <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-950"><strong>{t(c("最终再审计：", "最終再監査：", "Final re-audit:"))}</strong> {t(c("A＋B为23／24题（95.8%）；其中13题可以直接作为选择候选，10题需要少量固有知识。唯一C题是2019 Q5，其公开照片缺失，不能据此认定论述框架失效。", "A＋Bは23／24題（95.8%）。13題は選択候補、10題は少量の固有知識が必要。唯一のCは2019 Q5で、公開写真欠落によるため論述枠組みの失敗ではない。", "A+B covers 23 of 24 questions (95.8%): 13 are ready choices and 10 need limited specific knowledge. The only C is 2019 Q5, blocked by missing public photographs rather than a failure of the essay framework."))}</section>

      <div className="mt-7 flex flex-wrap gap-2">{(["ALL", "A", "B", "C"] as const).map((status) => <button key={status} type="button" onClick={() => setStatusFilter(status)} aria-pressed={statusFilter === status} className={`rounded-full px-4 py-2 text-xs font-black ${statusFilter === status ? "bg-violet-700 text-white" : "border border-stone-200 bg-white text-slate-600"}`}>{status === "ALL" ? t(c("全部24题", "全24題", "All 24")) : `${status} · ${t(statusCopy[status])}`}</button>)}</div>

      <section className="mt-4 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <div className="grid grid-cols-[5rem_3rem_1fr_4rem] border-b border-stone-100 bg-stone-50 px-4 py-3 text-[10px] font-black tracking-[0.12em] text-stone-500"><span>YEAR</span><span>TYPE</span><span>{t(c("中心课题", "中心課題", "TOPIC"))}</span><span>STATUS</span></div>
          <div className="max-h-[42rem] overflow-y-auto">{filtered.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={selected.id === item.id} className={`grid w-full grid-cols-[5rem_3rem_minmax(0,1fr)_4rem] items-center border-b border-stone-100 px-4 py-3 text-left last:border-b-0 ${selected.id === item.id ? "bg-violet-50" : "hover:bg-stone-50"}`}><span className="text-xs font-black">{item.year} {item.question}</span><span className="text-sm font-black text-violet-700">{item.primaryType}</span><span className="min-w-0 pr-3 text-xs leading-5 text-slate-700"><StudyText text={t(item.topic)} gloss={gloss} /></span><StatusBadge status={item.status} compact /></button>)}</div>
        </div>

        <article className="self-start rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm sm:p-8 xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-4"><p className="text-xs font-black tracking-[0.16em] text-amber-300">{selected.year} · {selected.question}</p><StatusBadge status={selected.status} /></div>
          <h2 className="mt-4 text-2xl font-black leading-9"><StudyText text={t(selected.topic)} gloss={gloss} /></h2>
          <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-black text-violet-950">{t(c("主型", "主型", "PRIMARY"))} {selected.primaryType}</span>{selected.secondaryType !== "—" && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{t(c("副型", "副型", "SECONDARY"))} {selected.secondaryType}</span>}</div>
          <AuditDetail label={t(c("题目要求的操作", "設問操作", "Required operation"))}><StudyText text={t(selected.operation)} gloss={gloss} /></AuditDetail>
          <AuditDetail label={t(c("现在可以调用什么", "現在使える資産", "Available assets"))}><StudyText text={t(selected.assets)} gloss={gloss} /></AuditDetail>
          <AuditDetail label={selected.status === "A" ? t(c("剩余练习", "残る練習", "Remaining practice")) : t(c("最小缺口", "最小の穴", "Minimum gap"))}><StudyText text={t(selected.gap)} gloss={gloss} /></AuditDetail>
          <p className="mt-6 border-t border-white/15 pt-5 text-xs leading-6 text-stone-400">{selected.status === "A" ? t(c("考场策略：原则上可选，但仍要检查是否能画图并在规定字数内再现。", "考場戦略：原則選択可。ただし作図と字数内再現を確認する。", "Exam strategy: generally selectable, but confirm sketch and timed recall.")) : selected.status === "B" ? t(c("考场策略：有熟悉对象或安全选项时选择；不要只靠通用模板。", "考場戦略：得意な対象・安全な選択肢がある場合に選ぶ。汎用テンプレートだけに頼らない。", "Exam strategy: choose only with a familiar object or safe option; do not rely on a generic template alone.")) : t(c("考场策略：当前回避，不根据缺失照片猜建筑名。", "考場戦略：現状は回避し、欠落写真から建築名を推測しない。", "Exam strategy: avoid for now; do not guess buildings from missing images."))}</p>
        </article>
      </section>
    </main>
  </>;
}

function StatusBadge({ status, compact = false }: { status: AuditStatus; compact?: boolean }) {
  const classes = { A: "bg-emerald-300 text-emerald-950", B: "bg-amber-300 text-amber-950", C: "bg-rose-300 text-rose-950" }[status];
  return <span className={`inline-flex items-center justify-center rounded-full font-black ${classes} ${compact ? "h-7 w-7 text-[11px]" : "px-3 py-1 text-xs"}`}>{status}</span>;
}

function AuditDetail({ label, children }: { label: string; children: ReactNode }) {
  return <div className="mt-5 rounded-xl border border-white/15 bg-white/10 p-4"><p className="text-[10px] font-black tracking-[0.14em] text-amber-300">{label}</p><div className="mt-2 text-sm leading-7 text-stone-100">{children}</div></div>;
}

function BuildingTrack({ t, gloss }: { t: (value: Copy) => string; gloss: boolean }) {
  const [exampleId, setExampleId] = useState(BUILDING_EXAMPLES[0].id);
  const [layerIndex, setLayerIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const example = BUILDING_EXAMPLES.find((item) => item.id === exampleId) ?? BUILDING_EXAMPLES[0];
  const layer = example.layers[layerIndex];
  const chooseExample = (id: string) => { setExampleId(id); setLayerIndex(0); setShowAnswer(false); };

  return (
    <>
      <FrameworkHeader eyebrow="TRACK A · GUIDED BUILDING READING" title={t(c("不要先猜名字，\n先让图面给出五层证据", "名称を当てる前に、\n図面から五層の証拠を得る", "Before guessing the name,\nlet the drawing provide five layers of evidence."))} description={t(c("点击每一层查看：应当观察什么、可以推出什么，以及最容易发生的过度推断。完成五层后再看答案。", "各層で「観察・推論・過剰推論」を確認し、五層を終えてから答案を見る。", "For each layer, inspect observation, inference, and overreach. View the answer after all five."))} compact gloss={gloss} />
      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-12">
        <section className="relative z-10 -mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-black tracking-[0.16em] text-stone-400">{t(c("选择演示建筑", "演示建築を選ぶ", "Choose a worked building"))}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{BUILDING_EXAMPLES.map((item) => <button key={item.id} type="button" onClick={() => chooseExample(item.id)} aria-pressed={example.id === item.id} className={`rounded-xl border p-4 text-left transition ${example.id === item.id ? "border-amber-500 bg-amber-50 ring-2 ring-amber-200" : "border-stone-200 hover:border-amber-300"}`}><span className="font-black">{t(item.name)}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{t(item.subtitle)}</span></button>)}</div>
        </section>
        <section className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm"><BuildingDiagram exampleId={example.id} image={example.image} name={t(example.name)} t={t} gloss={gloss} /><div className="border-t border-stone-100 p-5"><p className="text-xs font-bold text-stone-400">{t(c("当前观察问题", "現在の観察問題", "Current observation question"))}</p><p className="mt-2 text-base font-black leading-7"><StudyText text={t(layer.ask)} gloss={gloss} /></p></div></div>
          <div>
            <div className="grid grid-cols-5 gap-1.5">{example.layers.map((item, index) => <button key={item.id} type="button" onClick={() => setLayerIndex(index)} aria-pressed={layerIndex === index} className={`rounded-xl px-2 py-3 text-[11px] font-black transition sm:text-xs ${layerIndex === index ? "bg-slate-950 text-white" : index < layerIndex ? "bg-emerald-100 text-emerald-900" : "bg-white text-slate-500"}`}>{t(item.title)}</button>)}</div>
            <article className="mt-3 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-black tracking-[0.16em] text-amber-700">EVIDENCE LAYER {layerIndex + 1}/5</p><h2 className="mt-2 text-2xl font-black">{t(layer.title)}</h2>
              <LearningBlock color="blue" label={t(c("图上看到什么", "図から何を見るか", "What is visible"))}><StudyText text={t(layer.observe)} gloss={gloss} /></LearningBlock>
              <LearningBlock color="green" label={t(c("因此可以推出什么", "そこから何を推論できるか", "What it supports"))}><StudyText text={t(layer.infer)} gloss={gloss} /></LearningBlock>
              <LearningBlock color="rose" label={t(c("不能直接推出什么", "直接には推論できないこと", "What it does not prove"))}><StudyText text={t(layer.limit)} gloss={gloss} /></LearningBlock>
              <div className="mt-6 flex justify-between gap-3"><button type="button" disabled={layerIndex === 0} onClick={() => setLayerIndex((value) => Math.max(0, value - 1))} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-bold disabled:opacity-30">← {t(c("上一层", "前の層", "Previous"))}</button>{layerIndex < 4 ? <button type="button" onClick={() => setLayerIndex((value) => Math.min(4, value + 1))} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white">{t(c("下一层证据", "次の証拠層", "Next layer"))} →</button> : <button type="button" onClick={() => setShowAnswer(true)} className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-slate-950">{t(c("组合成答案", "答案へ組み立てる", "Assemble answer"))} →</button>}</div>
            </article>
          </div>
        </section>
        {showAnswer && <section className="mt-7 rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10"><p className="text-xs font-black tracking-[0.18em] text-amber-300">FROM EVIDENCE TO ANSWER</p><h2 className="mt-3 text-2xl font-black">{t(c("五层证据怎样合成一段论述", "五層の証拠を一段落へ", "Five layers become one paragraph"))}</h2><div className="mt-6 grid gap-2 sm:grid-cols-5">{example.layers.map((item, index) => <div key={item.id} className="rounded-xl border border-white/15 bg-white/10 p-3 text-xs leading-5"><span className="text-amber-300">{index + 1}</span><p className="mt-1 font-bold">{t(item.title)}</p></div>)}</div><p className="mt-7 border-l-4 border-amber-300 pl-5 text-base leading-8 text-stone-100"><StudyText text={t(example.answer)} gloss={gloss} /></p></section>}
        <BuildingFamilyEntrances t={t} gloss={gloss} />
      </main>
    </>
  );
}

const CAUSAL_LINKS: Record<string, Copy[]> = {
  A: [
    c("为了覆盖中央大空间，穹顶荷载必须被导向少数支点。", "中央大空間を覆うため、ドーム荷重を少数の支点へ導く必要がある。", "Covering a central volume requires the dome load to reach a limited number of supports."),
    c("帆拱把圆形穹顶过渡到方形支承，使四座主墩承受集中荷载。", "ペンデンティブは円形ドームを方形支持へ移行させ、四つの主墩に荷重を集中させる。", "Pendentives translate the circular dome into a square support system and concentrate load on four piers."),
    c("支承被集中后，中央空间得以开放，并可与东西向礼仪轴结合。", "支持が集中することで中央空間が開放され、東西の礼拝軸と結合できる。", "Concentrated support opens the center and allows it to combine with the east-west liturgical axis."),
  ],
  B: [
    c("柱梁以构件抗弯跨越空间，因此受材料长度与跨距限制。", "柱梁は部材の曲げで空間を跨ぐため、材料長とスパンに制約される。", "Post-and-lintel construction spans by bending members and is therefore limited by material length and span."),
    c("拱券把荷载转为压缩并传向支点，混凝土又使连续曲面可以整体构筑。", "アーチは荷重を圧縮へ変えて支点へ流し、コンクリートは連続曲面の一体構築を可能にする。", "Arches redirect load into compression, while concrete enables continuous curved construction."),
    c("更大的连续覆盖减少内部支点，使空间表现从构件排列转向包裹性的内部。", "大きな連続被覆は内部支点を減らし、表現を部材配列から包摂的内部へ変える。", "Larger continuous coverage reduces internal supports and shifts expression from component order to enveloping interior space."),
  ],
  C: [
    c("新的观念先改变社会对建筑应当表现什么的期待。", "新しい理念が建築に何を表現させるかという期待を変える。", "A new idea changes what society expects architecture to express."),
    c("期待必须通过制度、赞助者或设计者才能进入建造过程。", "理念は制度・施主・設計者を介して建設過程に入る。", "Institutions, patrons, or designers carry that expectation into building."),
    c("观念被转译为平面、立面和构造选择，最终形成形式。", "理念が平面・立面・構造の選択へ翻訳され、形式となる。", "The idea is translated into plan, elevation, and structural choices, producing form."),
  ],
  D: [
    c("战乱后的统一使新政权必须同时处理统治、防御和物资流通。", "戦乱後の統一により、新政権は統治・防御・物資流通を同時に処理する必要が生じた。", "Unification after conflict required the new regime to manage rule, defense, and material circulation together."),
    c("这些政治目标被转译为聚乐第、御土居、寺町与街路重组等空间操作。", "政治目的は聚楽第・御土居・寺町・街路再編という空間操作へ翻訳された。", "These political aims were translated into Jurakudai, Odoi, Teramachi, and street reorganization."),
    c("据点、边界与用途配置被重组后，近世京都的中心和流通秩序随之形成。", "拠点・境界・用途配置の再編により、近世京都の中心と流通秩序が形成された。", "Reorganizing nodes, boundaries, and land use produced the center and circulation order of early-modern Kyoto."),
  ],
  E: [
    c("火灾造成的损伤与结构风险要求先调查残存构件，而不是直接决定复原外观。", "火災損傷と構造リスクがあるため、外観復原を先決せず残存部材を調査する。", "Fire damage and structural risk require survey of surviving fabric before deciding on visual reconstruction."),
    c("调查识别形态、材料、技术与历史痕迹中哪些属性真正承载价值。", "調査により、形態・材料・技術・痕跡のどの属性が価値を担うかを特定する。", "Survey identifies which attributes in form, material, technique, and traces actually carry value."),
    c("以价值为依据的记录与最小必要介入，才能同时协调真实性、安全和继续使用。", "価値に基づく記録と必要最小限の介入によって、真正性・安全・継続利用を調整できる。", "Documented minimum intervention based on value can balance authenticity, safety, and continued use."),
  ],
  F: [
    c("顺木纹劈裂受原木形状、木纹与劳动量限制，难以稳定取得大量板材。", "木目に沿う割裂は原木形状・木目・労働量に制約され、大量の板材を安定供給しにくい。", "Splitting along the grain is constrained by log shape, grain, and labor, limiting stable board supply."),
    c("纵锯与专门木挽劳动普及后，加工方向和生产分工被重新组织。", "縦挽鋸と木挽専門労働の普及が、加工方向と生産分業を再編した。", "The spread of rip saws and specialist sawyers reorganized cutting direction and production labor."),
    c("产量和尺寸选择增加后，板材才更广泛进入地板、墙壁、屋面与建具。", "生産量と寸法選択が増え、板材は床・壁・屋根・建具へ広く用いられるようになった。", "Greater output and dimensional choice enabled wider use of boards in floors, walls, roofs, and fittings."),
  ],
};

function ThematicTrack({ t, gloss }: { t: (value: Copy) => string; gloss: boolean }) {
  const [caseId, setCaseId] = useState(ESSAY_CASES[0].id);
  const [stage, setStage] = useState<"classify" | "materials" | "chain" | "answer" | "mistake">("classify");
  const [answerLength, setAnswerLength] = useState<"skeleton" | "short" | "standard">("skeleton");
  const item = ESSAY_CASES.find((entry) => entry.id === caseId) ?? ESSAY_CASES[0];
  const chooseCase = (id: string) => { setCaseId(id); setStage("classify"); setAnswerLength("skeleton"); };
  const stages = [
    ["classify", c("1 判型", "1 判型", "1 Classify")], ["materials", c("2 选材料", "2 材料選択", "2 Select evidence")], ["chain", c("3 连因果", "3 因果接続", "3 Link causality")], ["answer", c("4 展开答案", "4 答案展開", "4 Build answer")], ["mistake", c("5 纠错", "5 誤答修正", "5 Correct mistakes")],
  ] as const;

  return (
    <>
      <FrameworkHeader eyebrow="TRACK B · GUIDED ESSAY CASES" title={t(c("六型不是六条口诀，\n而是六次完整的思考演示", "六型は六つの暗記句ではなく、\n六つの思考演示である", "Six types are not six slogans.\nThey are six complete demonstrations."))} description={t(c("先读题干，再看为什么这样判型；随后亲眼看见材料被筛选、因果被连接、短答被展开，并用错误答案理解边界。", "設問を読み、判型理由・材料選択・因果接続・答案展開・誤答修正を順に見る。", "Read the prompt, then see classification, evidence selection, causal linking, answer expansion, and error correction."))} compact gloss={gloss} />
      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-12">
        <section className="relative z-10 -mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7"><p className="text-xs font-black tracking-[0.16em] text-stone-400">{t(c("选择论述操作与演示案例", "論述操作と演示事例を選ぶ", "Choose an operation and worked case"))}</p><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{ESSAY_CASES.map((entry) => <button key={entry.id} type="button" onClick={() => chooseCase(entry.id)} aria-pressed={entry.id === item.id} className={`rounded-xl border p-3 text-left transition ${entry.id === item.id ? "border-violet-600 bg-violet-700 text-white" : "border-stone-200 hover:border-violet-300"}`}><span className={`text-2xl font-black ${entry.id === item.id ? "text-amber-300" : "text-violet-700"}`}>{entry.letter}</span><span className="mt-1 block text-xs font-bold leading-5">{t(entry.title)}</span></button>)}</div></section>
        <section className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 bg-slate-950 p-6 text-white sm:p-8"><p className="text-xs font-black tracking-[0.16em] text-amber-300">CASE · {item.letter}</p><h1 className="mt-2 text-2xl font-black">{t(item.caseName)}</h1><p className="mt-4 rounded-xl border border-white/15 bg-white/10 p-4 text-sm leading-7">{t(item.prompt)}</p></div>
          <div className="grid grid-cols-5 border-b border-stone-100">{stages.map(([id, label]) => <button key={id} type="button" onClick={() => setStage(id)} aria-pressed={stage === id} className={`min-h-14 border-r border-stone-100 px-2 py-3 text-[10px] font-black last:border-r-0 sm:text-xs ${stage === id ? "bg-amber-200 text-slate-950" : "bg-stone-50 text-slate-500 hover:bg-amber-50"}`}>{t(label)}</button>)}</div>
          <div className="p-6 sm:p-9">
            {stage === "classify" && <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><div><StepLabel number="01" title={t(c("先圈出题干动词", "設問動詞を囲む", "Mark the prompt verbs"))} /><div className="mt-4 flex flex-wrap gap-2">{item.verbs.map((verb) => <span key={verb.en} className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-black text-amber-900">{t(verb)}</span>)}</div></div><div className="rounded-2xl bg-violet-50 p-5"><p className="text-xs font-black text-violet-700">WHY THIS TYPE?</p><p className="mt-3 text-sm leading-7 text-violet-950">{t(item.why)}</p><p className="mt-4 border-t border-violet-100 pt-4 text-xs leading-6 text-violet-700">{t(c("判型不是猜章节，而是把题干动词转换成答案需要执行的操作。", "判型は章当てではなく、設問動詞を答案操作へ変換すること。", "Classification converts prompt verbs into answer operations; it does not guess a textbook chapter."))}</p></div></div>}
            {stage === "materials" && <div><StepLabel number="02" title={t(c("材料不是越多越好：先分类", "材料は多いほどよいのではなく、まず分類する", "More evidence is not better: sort it"))} /><div className="mt-6 grid gap-4 md:grid-cols-3"><MaterialColumn tone="green" title={t(c("必须使用", "必須", "Required"))} note={t(c("直接证明题目要求", "設問要求を直接証明", "Directly proves the prompt"))} items={item.materials.must.map(t)} gloss={gloss} /><MaterialColumn tone="blue" title={t(c("可以补充", "補助", "Supporting"))} note={t(c("有字数时增强解释", "字数があれば補強", "Adds depth when space allows"))} items={item.materials.support.map(t)} gloss={gloss} /><MaterialColumn tone="rose" title={t(c("危险材料", "危険", "Risky"))} note={t(c("看似相关但会造成跳跃", "関連して見えるが飛躍を生む", "Looks relevant but creates a leap"))} items={item.materials.avoid.map(t)} gloss={gloss} /></div></div>}
            {stage === "chain" && <div><StepLabel number="03" title={t(c("把名词列表变成“因为 A，所以 B”", "名詞列を「AだからB」へ変える", "Turn a noun list into ‘because A, therefore B’"))} /><div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm leading-7 text-sky-950"><strong>{t(c("这一部分的作用：", "この段階の役割：", "Purpose of this step:"))}</strong> {t(c("上方方框只负责排列论点；下方三句话才是你在答案中真正要写出的逻辑。箭头不表示“然后”，而表示可解释的因果。", "上の箱は論点の順序、下の三文は答案に実際に書く論理である。矢印は「次に」ではなく、説明可能な因果を示す。", "The boxes order claims; the three sentences below are the logic you actually write. An arrow means explainable causality, not merely ‘then’."))}</div><div className="mt-5 flex flex-col gap-2 xl:flex-row xl:items-stretch">{item.chain.map((node, index) => <div key={node.en} className="contents"><div className="flex-1 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-center text-sm font-black leading-6 text-violet-950"><span className="mb-2 block text-[10px] text-violet-500">{String(index + 1).padStart(2, "0")}</span><StudyText text={t(node)} gloss={gloss} /></div>{index < item.chain.length - 1 && <div className="flex items-center justify-center text-xl font-black text-amber-600 xl:px-1">↓<span className="hidden xl:inline">→</span></div>}</div>)}</div><div className="mt-5 grid gap-3 md:grid-cols-3">{(CAUSAL_LINKS[item.letter] ?? []).map((link, index) => <div key={index} className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950"><span className="mb-2 block text-[10px] font-black tracking-[0.12em] text-amber-700">{t(c(`箭头 ${index + 1} 为什么成立`, `矢印 ${index + 1} が成立する理由`, `WHY ARROW ${index + 1} WORKS`))}</span><StudyText text={t(link)} gloss={gloss} /></div>)}</div><div className="mt-5 rounded-xl bg-slate-950 p-4 text-sm leading-7 text-white"><strong className="text-amber-300">{t(c("完成标准：", "完成基準：", "Completion test:"))}</strong> {t(c("你已经得到一段答案的逻辑骨架；若某句说不出“谁、通过什么机制、在什么条件下”，就回去补材料。", "これで答案段落の論理骨格ができる。各文で「誰が・どの機制で・どの条件下で」を言えなければ、材料へ戻る。", "You now have a paragraph’s logical skeleton. If a sentence cannot name the agent, mechanism, or condition, return to the evidence step."))}</div></div>}
            {stage === "answer" && <div><StepLabel number="04" title={t(c("同一组因果，可以压缩成不同长度", "同じ因果を異なる長さへ圧縮する", "Compress the same causality to different lengths"))} /><div className="mt-5 flex flex-wrap gap-2">{(["skeleton", "short", "standard"] as const).map((length) => <button key={length} type="button" onClick={() => setAnswerLength(length)} aria-pressed={answerLength === length} className={`rounded-full px-4 py-2 text-sm font-bold ${answerLength === length ? "bg-slate-950 text-white" : "border border-stone-200"}`}>{length === "skeleton" ? t(c("骨架", "骨格", "Skeleton")) : length === "short" ? t(c("短答", "短答", "Short")) : t(c("标准答案", "標準答案", "Standard"))}</button>)}</div><div className="mt-5 rounded-2xl bg-[#f4f1e9] p-6"><p className="text-xs font-black tracking-[0.14em] text-stone-500">{answerLength.toUpperCase()}</p><p className="mt-3 text-base leading-8 text-slate-800">{answerLength === "skeleton" ? t(item.skeleton) : answerLength === "short" ? t(item.short) : t(item.standard)}</p></div><p className="mt-4 text-xs leading-6 text-slate-500">{t(c("注意：长度变化时删的是例子和修饰，不是因果箭头。", "短くするとき削るのは例・修飾であり、因果矢印ではない。", "When shortening, remove examples and modifiers—not causal links."))}</p></div>}
            {stage === "mistake" && <div><StepLabel number="05" title={t(c("看起来像答案，为什么仍然不够", "答案らしいのに、なぜ不足するか", "Why an answer-like sentence is still insufficient"))} /><div className="mt-6 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-rose-200 bg-rose-50 p-5"><p className="text-xs font-black text-rose-700">× {t(c("错误答案", "誤答", "Weak answer"))}</p><p className="mt-3 text-sm leading-7 text-rose-950">{t(item.wrong)}</p></div><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-xs font-black text-emerald-700">✓ {t(c("缺失的思考", "不足した思考", "Missing reasoning"))}</p><p className="mt-3 text-sm leading-7 text-emerald-950">{t(item.correction)}</p></div></div></div>}
            <div className="mt-8 flex justify-between"><button type="button" onClick={() => moveStage(stages, stage, -1, setStage)} disabled={stage === stages[0][0]} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-bold disabled:opacity-30">← {t(c("上一步", "前へ", "Previous"))}</button><button type="button" onClick={() => moveStage(stages, stage, 1, setStage)} disabled={stage === stages[stages.length - 1][0]} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-30">{t(c("下一步", "次へ", "Next"))} →</button></div>
          </div>
        </section>
      </main>
    </>
  );
}

function TechnologyBuilder({ t, gloss }: { t: (value: Copy) => string; gloss: boolean }) {
  const [typeId, setTypeId] = useState("T1");
  const [mechanismIds, setMechanismIds] = useState(["M1", "M2", "M6"]);
  const [operationId, setOperationId] = useState("O2");
  const [selectedTopicId, setSelectedTopicId] = useState(TECHNOLOGY_TOPICS[0].id);
  const [builderStage, setBuilderStage] = useState<"T" | "M" | "O">("T");
  const type = TECH_TYPES.find((item) => item.id === typeId) ?? TECH_TYPES[0];
  const selectedMechanisms = MECHANISMS.filter((item) => mechanismIds.includes(item.id));
  const operation = OPERATIONS.find((item) => item.id === operationId) ?? OPERATIONS[1];
  const selectedTopic = TECHNOLOGY_TOPICS.find((item) => item.id === selectedTopicId) ?? null;
  const toggleMechanism = (id: string) => { setSelectedTopicId(""); setMechanismIds((current) => current.includes(id) ? current.length === 1 ? current : current.filter((value) => value !== id) : current.length >= 3 ? [...current.slice(1), id] : [...current, id]); };
  const chooseType = (id: string) => { setSelectedTopicId(""); setTypeId(id); };
  const chooseOperation = (id: string) => { setSelectedTopicId(""); setOperationId(id); };
  const applyTopic = (id: string) => { const topic = TECHNOLOGY_TOPICS.find((item) => item.id === id); if (!topic) return; setSelectedTopicId(id); setTypeId(topic.typeId); setMechanismIds(topic.mechanismIds); setOperationId(topic.operationId); };
  const weakCombination = useMemo(() => typeId === "T8" && mechanismIds.every((id) => !["M8", "M10", "M6"].includes(id)), [typeId, mechanismIds]);

  return (
    <>
      <FrameworkHeader eyebrow="TECHNOLOGY HISTORY · INTERACTIVE BUILDER" title={t(c("选择 T、M、O，\n看分析怎样被具体生成", "T・M・Oを選び、\n分析が生成される過程を見る", "Choose T, M, and O.\nSee the analysis become concrete."))} description={t(c("T说明什么发生变化，M解释为什么变化，O决定答案执行什么操作。系统会生成分析图、追问与骨架；只有已经核实的组合才显示具体实例。", "Tは変化対象、Mは変化機制、Oは答案操作。分析図・追問・骨格を生成し、検証済みの組合せだけ具体例を示す。", "T identifies what changed, M why it changed, and O what the answer must do. It generates a diagram, questions, and scaffold; only verified combinations show a concrete case."))} compact gloss={gloss} />
      <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 lg:px-12">
        <section className="relative z-10 -mt-8 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-violet-700">VERIFIED TOPIC LIBRARY</p><h2 className="mt-2 text-2xl font-black">{t(c("先从六个已核实主题进入，再观察它们怎样落到T×M×O", "六つの検証済みテーマから入り、T×M×Oへの配置を見る", "Start from six verified topics, then see how each maps to T×M×O"))}</h2></div><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800">6 / 6 {t(c("已嵌入", "実装済み", "embedded"))}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{TECHNOLOGY_TOPICS.map((topic) => <button key={topic.id} type="button" onClick={() => applyTopic(topic.id)} aria-pressed={selectedTopicId === topic.id} className={`rounded-2xl border p-4 text-left transition ${selectedTopicId === topic.id ? "border-violet-600 bg-violet-700 text-white" : "border-stone-200 hover:border-violet-300"}`}><div className="flex items-center justify-between gap-3"><span className={`text-[10px] font-black tracking-[0.12em] ${selectedTopicId === topic.id ? "text-amber-300" : "text-violet-700"}`}>{topic.typeId} × {topic.mechanismIds.join("+")} × {topic.operationId}</span><span className={`text-[10px] ${selectedTopicId === topic.id ? "text-violet-100" : "text-stone-400"}`}>{t(topic.exam)}</span></div><strong className="mt-2 block text-sm leading-6"><StudyText text={t(topic.title)} gloss={gloss} /></strong></button>)}</div></section>
        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="lg:hidden">
            <div className="grid grid-cols-3 rounded-xl bg-stone-100 p-1">{(["T", "M", "O"] as const).map((value) => <button key={value} type="button" onClick={() => setBuilderStage(value)} aria-pressed={builderStage === value} className={`rounded-lg px-2 py-2 text-[11px] font-black ${builderStage === value ? "bg-slate-950 text-white" : "text-slate-500"}`}>{value === "T" ? t(c("1 对象 T", "1 対象 T", "1 Object T")) : value === "M" ? t(c("2 原因 M", "2 原因 M", "2 Cause M")) : t(c("3 操作 O", "3 操作 O", "3 Operation O"))}</button>)}</div>
            <div className="mt-5">
              {builderStage === "T" && <SelectorColumn label="T · OBJECT" title={t(c("什么发生变化？", "何が変化したか。", "What changed?"))}>{TECH_TYPES.map((item) => <SelectButton key={item.id} active={typeId === item.id} onClick={() => chooseType(item.id)} code={item.id} label={t(item.title)} />)}</SelectorColumn>}
              {builderStage === "M" && <SelectorColumn label="M · MECHANISM" title={t(c("为什么变化？选择1—3个", "なぜ変化したか。1〜3個", "Why? Choose 1–3"))}>{MECHANISMS.map((item) => <SelectButton key={item.id} active={mechanismIds.includes(item.id)} onClick={() => toggleMechanism(item.id)} code={item.id} label={t(item.title)} checkbox />)}</SelectorColumn>}
              {builderStage === "O" && <SelectorColumn label="O · OPERATION" title={t(c("题目要求做什么？", "設問は何を求めるか。", "What must the answer do?"))}>{OPERATIONS.map((item) => <SelectButton key={item.id} active={operationId === item.id} onClick={() => chooseOperation(item.id)} code={item.id} label={t(item.title)} />)}</SelectorColumn>}
            </div>
            <div className="mt-4 flex justify-between"><button type="button" disabled={builderStage === "T"} onClick={() => setBuilderStage(builderStage === "O" ? "M" : "T")} className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold disabled:opacity-30">← {t(c("上一步", "前へ", "Previous"))}</button><button type="button" disabled={builderStage === "O"} onClick={() => setBuilderStage(builderStage === "T" ? "M" : "O")} className="rounded-xl bg-violet-700 px-4 py-2 text-xs font-bold text-white disabled:opacity-30">{t(c("下一步", "次へ", "Next"))} →</button></div>
          </div>
          <div className="hidden gap-4 lg:grid lg:grid-cols-3">
            <SelectorColumn label="T · OBJECT" title={t(c("什么发生变化？", "何が変化したか。", "What changed?"))}>{TECH_TYPES.map((item) => <SelectButton key={item.id} active={typeId === item.id} onClick={() => chooseType(item.id)} code={item.id} label={t(item.title)} />)}</SelectorColumn>
            <SelectorColumn label="M · MECHANISM" title={t(c("为什么变化？选择1—3个", "なぜ変化したか。1〜3個", "Why? Choose 1–3"))}>{MECHANISMS.map((item) => <SelectButton key={item.id} active={mechanismIds.includes(item.id)} onClick={() => toggleMechanism(item.id)} code={item.id} label={t(item.title)} checkbox />)}</SelectorColumn>
            <SelectorColumn label="O · OPERATION" title={t(c("题目要求做什么？", "設問は何を求めるか。", "What must the answer do?"))}>{OPERATIONS.map((item) => <SelectButton key={item.id} active={operationId === item.id} onClick={() => chooseOperation(item.id)} code={item.id} label={t(item.title)} />)}</SelectorColumn>
          </div>
        </section>
        <section className="mt-7 rounded-[2rem] bg-slate-950 p-5 text-white sm:p-7">
          <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-slate-950">{type.id}</span>{selectedMechanisms.map((item) => <span key={item.id} className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">× {item.id}</span>)}<span className="rounded-full bg-violet-300 px-3 py-1 text-xs font-black text-slate-950">× {operation.id}</span></div>
          <h2 className="mt-4 text-xl font-black leading-8"><StudyText text={`${t(type.title)} × ${selectedMechanisms.map((item) => t(item.title)).join("＋")} × ${t(operation.title)}`} gloss={gloss} /></h2>
          <p className="mt-2 text-sm leading-7 text-stone-300">{t(c("当前可用于：", "現在の対象例：", "Current case pool:"))} <StudyText text={t(type.example)} gloss={gloss} /></p>
          {weakCombination && <div className="mt-5 rounded-xl border border-amber-400/40 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100"><strong>{t(c("组合提醒：", "組合せの注意：", "Combination note:"))}</strong> {t(c("T8讨论知识与证据，但当前机制没有解释证据怎样产生或保存。建议加入M8或M10。", "T8は知識・証拠を扱うが、現在のMでは証拠生成・継承を説明しにくい。M8またはM10を推奨する。", "T8 concerns knowledge and evidence, but the chosen mechanisms do not explain how evidence is produced or preserved. Add M8 or M10."))}</div>}
          <div className="mt-5 grid gap-2 md:flex md:items-stretch"><FlowNode number="01" title={t(c("旧阶段", "旧段階", "Old stage"))} text={t(type.old)} gloss={gloss} /><FlowArrow /><FlowNode number="02" title={t(c("变化机制", "変化機制", "Mechanisms"))} text={selectedMechanisms.map((item) => t(item.bridge)).join("；")} gloss={gloss} /><FlowArrow /><FlowNode number="03" title={t(c("系统变化", "体系変化", "System change"))} text={t(type.system)} gloss={gloss} /><FlowArrow /><FlowNode number="04" title={t(c("建筑结果", "建築的結果", "Architectural result"))} text={t(type.result)} gloss={gloss} /></div>
        </section>
        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"><StepLabel number="A" title={t(c("回答前必须查明的问题", "答案前に確認する問い", "Questions to answer first"))} /><ul className="mt-5 space-y-3">{selectedMechanisms.map((item) => <li key={item.id} className="flex gap-3 rounded-xl bg-stone-50 p-3 text-sm leading-6"><span className="font-black text-amber-700">{item.id}</span><span>{t(item.question)}</span></li>)}</ul><div className="mt-4 rounded-xl bg-violet-50 p-4 text-sm leading-6 text-violet-950"><strong>{operation.id}：</strong>{t(operation.order)}</div></article>
          <article className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"><StepLabel number="B" title={t(c("动态段落骨架", "動的段落骨格", "Dynamic paragraph scaffold"))} /><p className="mt-5 rounded-xl bg-slate-950 p-4 text-sm leading-7 text-white">{t(operation.opener)}</p><p className="mt-4 text-sm leading-7 text-slate-700">{t(c("以", "対象は", "For"))}<strong>{t(type.object)}</strong>{t(c("为对象：", "である。", ":"))} {t(type.old)}。{selectedMechanisms.map((item) => t(item.bridge)).join("、")}，{t(type.system)}。{t(c("其结果是", "その結果、", "As a result, "))}{t(type.result)}。</p><p className="mt-4 text-xs leading-6 text-slate-500">{t(c("这仍是骨架。下一步必须把“对象”替换成具体材料、工具、建筑和年代证据。", "これは骨格であり、対象を具体的材料・道具・建築・年代証拠へ置き換える必要がある。", "This remains a scaffold. Replace the object with a specific material, tool, building, and dated evidence."))}</p></article>
        </section>
        {selectedTopic && <TechnologyTopicPanel topic={selectedTopic} t={t} gloss={gloss} />}
      </main>
    </>
  );
}

function WritingWorkbench({ t, gloss }: { t: (value: Copy) => string; gloss: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [view, setView] = useState<"demo" | "why">("demo");
  const step = WRITING_STEPS[stepIndex];
  return (
    <>
      <FrameworkHeader eyebrow="WRITING WORKBENCH · WATCH FIRST" title={t(c("先看一篇答案怎样长出来，\n现在不用自己作答", "答案ができる過程を先に見る。\n今は自分で解かなくてよい", "Watch an answer grow first.\nYou do not need to answer yet."))} description={t(c("用“大佛样的成立背景与特征”作为固定演示。每次只处理一个决定，避免一上来面对空白答案纸。", "「大仏様の成立背景と特徴」を固定事例とし、一度に一つの判断だけを見る。", "The worked example is Daibutsuyō. Each screen handles one decision, avoiding the blank-page problem."))} compact gloss={gloss} />
      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8 lg:px-12">
        <section className="relative z-10 -mt-8 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white sm:p-8"><p className="text-xs font-black tracking-[0.16em] text-amber-300">WORKED PROMPT</p><p className="mt-3 text-lg font-black leading-8">{t(c("说明大佛样的成立背景及其建筑特征。", "大仏様の成立背景と建築的特徴を説明せよ。", "Explain the background and architectural characteristics of Daibutsuyō."))}</p></div>
          <div className="overflow-x-auto border-b border-stone-100"><div className="flex min-w-[42rem]">{WRITING_STEPS.map((item, index) => <button key={item.id} type="button" onClick={() => setStepIndex(index)} aria-pressed={stepIndex === index} className={`flex-1 border-r border-stone-100 px-3 py-4 text-xs font-black last:border-r-0 ${stepIndex === index ? "bg-amber-200" : index < stepIndex ? "bg-emerald-50 text-emerald-800" : "bg-stone-50 text-slate-500"}`}>{t(item.title)}</button>)}</div></div>
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-violet-700">STEP {stepIndex + 1}/6</p><h1 className="mt-2 text-3xl font-black">{t(step.title)}</h1></div><div className="flex rounded-xl border border-stone-200 p-1"><button type="button" onClick={() => setView("demo")} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${view === "demo" ? "bg-slate-950 text-white" : "text-slate-500"}`}>{t(c("看示例", "事例を見る", "See example"))}</button><button type="button" onClick={() => setView("why")} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${view === "why" ? "bg-slate-950 text-white" : "text-slate-500"}`}>{t(c("为什么", "なぜ", "Why"))}</button></div></div>
            <div className="mt-7 rounded-2xl bg-[#f4f1e9] p-6"><p className="text-xs font-black text-stone-500">{view === "demo" ? t(c("本步演示", "この段階の演示", "Step demonstration")) : t(c("本步的作用", "この段階の役割", "Why this step exists"))}</p><p className="mt-3 text-base leading-8 text-slate-800">{view === "demo" ? t(step.demo) : t(step.task)}</p></div>
            {stepIndex === 4 && <CausalSentence t={t} />}
            {stepIndex === 5 && <ColorCodedAnswer t={t} />}
            <div className="mt-8 flex justify-between"><button type="button" disabled={stepIndex === 0} onClick={() => { setStepIndex((value) => Math.max(0, value - 1)); setView("demo"); }} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-bold disabled:opacity-30">← {t(c("上一步", "前へ", "Previous"))}</button><button type="button" disabled={stepIndex === 5} onClick={() => { setStepIndex((value) => Math.min(5, value + 1)); setView("demo"); }} className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-30">{t(c("下一步", "次へ", "Next"))} →</button></div>
          </div>
        </section>
        <section className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm leading-7 text-sky-950"><strong>{t(c("当前模式：", "現在のモード：", "Current mode:"))}</strong> {t(c("观看演示。这里不会要求输入答案。等六步都理解后，第二阶段才会增加“自己尝试”。", "演示閲覧。ここでは入力を求めない。六段階を理解した後に「自分で試す」を追加する。", "Demonstration only. No answer input is required. A self-attempt mode comes only after all six steps are understood."))}</section>
      </main>
    </>
  );
}

function FrameworkHeader({ eyebrow, title, description, compact = false, gloss = false }: { eyebrow: string; title: string; description: string; compact?: boolean; gloss?: boolean }) {
  return <header className={`relative overflow-hidden bg-slate-950 px-5 text-white sm:px-8 lg:px-12 ${compact ? "pb-16 pt-10" : "pb-20 pt-12"}`}><div className="pointer-events-none absolute -right-28 -top-44 h-[32rem] w-[32rem] rounded-full border border-amber-300/15" /><div className="relative mx-auto w-full min-w-0 max-w-6xl"><Link href="/explore" className="text-xs font-bold tracking-[0.16em] text-amber-300 hover:text-amber-200">← EXPLORE</Link><div className={`grid min-w-0 gap-7 2xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] 2xl:items-end ${compact ? "mt-7" : "mt-11"}`}><div className="min-w-0"><p className="break-words text-xs font-black tracking-[0.2em] text-amber-300">{eyebrow}</p><h1 className={`${compact ? "mt-3 text-3xl sm:text-5xl" : "mt-4 text-[2.35rem] sm:text-6xl"} max-w-4xl break-words whitespace-pre-line font-black leading-[1.08] tracking-tight`}><StudyText text={title} gloss={gloss} /></h1></div><div className="min-w-0 max-w-3xl break-words border-l border-white/20 pl-5 text-sm leading-7 text-stone-300"><StudyText text={description} gloss={gloss} /></div></div>{gloss && <p className="mt-5 max-w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] leading-5 text-stone-300">片仮名の初出に原語を併記：ペンデンティブ (pendentive)</p>}</div></header>;
}

function RouteHero({ href, label, title, question, steps, color }: { href: string; label: string; title: string; question: string; steps: string[]; color: "amber" | "violet" }) {
  const accent = color === "amber" ? "bg-amber-300 text-amber-950" : "bg-violet-300 text-violet-950";
  return <Link href={href} className="group min-w-0 overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-9"><span className={`rounded-full px-3 py-1 text-xs font-black ${accent}`}>{label}</span><h2 className="mt-5 break-words text-2xl font-black">{title}</h2><p className="mt-3 break-words text-sm leading-7 text-slate-600">{question}</p><ol className="mt-6 space-y-3">{steps.map((step, index) => <li key={step} className="flex min-w-0 items-center gap-3 text-sm"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-black">{index + 1}</span><span className="min-w-0 break-words font-semibold text-slate-700">{step}</span></li>)}</ol><p className="mt-7 text-sm font-black text-violet-700">START <span className="transition group-hover:ml-1">→</span></p></Link>;
}

function ToolLink({ href, code, title, note }: { href: string; code: string; title: string; note: string }) { return <Link href={href} className="group flex gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-md"><span className="flex h-12 min-w-16 items-center justify-center rounded-xl bg-slate-950 px-2 text-sm font-black text-amber-300">{code}</span><span><strong className="block text-base">{title}</strong><span className="mt-1 block text-sm leading-6 text-slate-500">{note}</span><span className="mt-3 block text-xs font-black text-violet-700">OPEN →</span></span></Link>; }

function StudyText({ text, gloss }: { text: string; gloss: boolean }) {
  return <OriginalLanguageText text={text} enabled={gloss} />;
}

function BuildingDiagram({ exampleId, image, name, t, gloss }: { exampleId: string; image: string; name: string; t: (value: Copy) => string; gloss: boolean }) {
  const legends = exampleId === "nakagin"
    ? [
        c("固定：钢筋混凝土交通核心", "固定：RCコア", "Fixed: reinforced-concrete core"),
        c("附加：工厂制造的钢制胶囊", "付加：工場製作の鋼製カプセル", "Attached: factory-made steel capsule"),
        c("虚线框：可更换是设计构想，并非实际完成的更新史", "破線枠：交換可能性は設計構想であり、実際の更新実績ではない", "Dashed box: replaceability was a design intention, not a completed renewal history"),
      ]
    : exampleId === "jodoji"
      ? [
          c("平面：方三间中央设置阿弥陀三尊，周围空间连续", "平面：方三間の中央に阿弥陀三尊を置き、周囲を連続させる", "Plan: a central Amida triad within a continuous three-bay square"),
          c("架构：贯、插肘木、斗、虹梁与大瓶束被直接显露", "架構：貫・挿肘木・斗・虹梁・大瓶束を直接見せる", "Frame: nuki, inserted arms, blocks, rainbow beams, and bottle posts remain visible"),
          c("光：西背面蔀户引入夕阳，使来迎思想成为空间体验", "光：西背面の蔀戸から夕日を導き、来迎を空間体験にする", "Light: western shutters admit sunset to stage the descent of Amida"),
        ]
      : [
        c("上部：中央穹顶与东西半穹顶", "上部：中央ドームと東西半ドーム", "Top: central dome and east-west half-domes"),
        c("过渡：帆拱把圆形穹顶荷载导向四个主墩", "移行：ペンデンティブが円形ドーム荷重を四主ピアへ導く", "Transition: pendentives direct the circular dome load to four main piers"),
        c("下部：主墩、侧廊与后世扶壁共同承担并调整推力", "下部：主ピア・側廊・後世のバットレスが推力を負担・調整する", "Below: piers, aisles, and later buttresses carry and adjust thrust"),
      ];

  return <div><div className="relative aspect-[4/3] min-h-72 bg-stone-50"><Image src={image} alt={name} fill unoptimized className="object-contain p-3 sm:p-5" /></div><div className="border-t border-stone-100 bg-stone-50 p-4"><p className="text-[10px] font-black tracking-[0.14em] text-stone-500">{t(c("清晰图例（以这里的文字为准）", "読みやすい凡例（本文はこちらを参照）", "READABLE LEGEND"))}</p><ul className="mt-3 grid gap-2 text-xs leading-5 text-slate-700">{legends.map((legend, index) => <li key={legend.en} className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-black">{index + 1}</span><span><StudyText text={t(legend)} gloss={gloss} /></span></li>)}</ul></div></div>;
}

function LearningBlock({ color, label, children }: { color: "blue" | "green" | "rose"; label: string; children: ReactNode }) {
  const classes = { blue: "border-sky-200 bg-sky-50 text-sky-950", green: "border-emerald-200 bg-emerald-50 text-emerald-950", rose: "border-rose-200 bg-rose-50 text-rose-950" }[color];
  return <div className={`mt-4 rounded-xl border p-4 ${classes}`}><p className="text-[10px] font-black tracking-[0.14em] opacity-65">{label}</p><p className="mt-2 text-sm leading-7">{children}</p></div>;
}

function BuildingFamilyEntrances({ t, gloss }: { t: (value: Copy) => string; gloss: boolean }) {
  const [familyId, setFamilyId] = useState(BUILDING_FAMILIES[0].id);
  const family = BUILDING_FAMILIES.find((item) => item.id === familyId) ?? BUILDING_FAMILIES[0];
  return <section className="mt-10"><p className="text-xs font-black tracking-[0.16em] text-violet-700">FIVE TRANSFERABLE FAMILIES</p><h2 className="mt-2 text-2xl font-black">{t(c("五类不是额外的背诵清单，而是遇到陌生建筑时的入口", "五ファミリーは暗記一覧ではなく、未知建築を読む入口", "Five families are entry points for unfamiliar buildings—not another memorization list"))}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{t(c("先选择最接近的构筑家族，再用同一观察顺序寻找结构、空间与历史条件。点击卡片查看识别线索、因果链和可替换实例。", "最も近い構築家族を選び、同じ観察順序で構造・空間・歴史条件を探す。カードから識別・因果・差替え事例を見る。", "Choose the nearest construction family, then inspect structure, space, and historical conditions in a stable order."))}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{BUILDING_FAMILIES.map((item, index) => <button key={item.id} type="button" onClick={() => setFamilyId(item.id)} aria-pressed={item.id === family.id} className={`min-w-0 rounded-2xl border p-4 text-left transition ${item.id === family.id ? "border-violet-600 bg-violet-700 text-white" : "border-stone-200 bg-white hover:border-violet-300"}`}><span className={`text-xs font-black ${item.id === family.id ? "text-amber-300" : "text-violet-700"}`}>F{index + 1}</span><span className="mt-2 block text-sm font-black leading-6"><StudyText text={t(item.title)} gloss={gloss} /></span><span className={`mt-1 block text-xs leading-5 ${item.id === family.id ? "text-violet-100" : "text-slate-500"}`}>{t(item.subtitle)}</span></button>)}</div><article className="mt-4 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm"><div className="grid lg:grid-cols-[0.9fr_1.1fr]"><div className="relative min-h-72 bg-stone-50 lg:min-h-[25rem]"><Image src={family.image} alt={t(family.title)} fill unoptimized className="object-contain p-4 sm:p-6" /></div><div className="p-6 sm:p-8"><p className="text-xs font-black tracking-[0.14em] text-violet-700">ACTIVE FAMILY</p><h3 className="mt-2 text-2xl font-black"><StudyText text={t(family.title)} gloss={gloss} /></h3><FamilyDetail label={t(c("先看什么", "最初に見るもの", "WHAT TO SEE FIRST"))} text={t(family.recognition)} gloss={gloss} /><FamilyDetail label={t(c("稳定因果链", "安定した因果鎖", "STABLE CAUSAL CHAIN"))} text={t(family.causalChain)} gloss={gloss} accent /><FamilyDetail label={t(c("可以替换的实例", "差替え可能な事例", "SWAPPABLE CASES"))} text={t(family.examples)} gloss={gloss} /><div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-950"><strong>{t(c("边界：", "境界：", "Boundary:"))}</strong> <StudyText text={t(family.caution)} gloss={gloss} /></div></div></div></article></section>;
}

function FamilyDetail({ label, text, gloss, accent = false }: { label: string; text: string; gloss: boolean; accent?: boolean }) {
  return <div className={`mt-4 rounded-xl p-4 ${accent ? "bg-slate-950 text-white" : "bg-stone-50 text-slate-800"}`}><p className={`text-[10px] font-black tracking-[0.14em] ${accent ? "text-amber-300" : "text-stone-500"}`}>{label}</p><p className="mt-2 text-sm leading-7"><StudyText text={text} gloss={gloss} /></p></div>;
}

function StepLabel({ number, title }: { number: string; title: string }) { return <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-200 text-xs font-black text-amber-950">{number}</span><h2 className="text-xl font-black">{title}</h2></div>; }

function MaterialColumn({ tone, title, note, items, gloss }: { tone: "green" | "blue" | "rose"; title: string; note: string; items: string[]; gloss: boolean }) {
  const classes = { green: "border-emerald-200 bg-emerald-50 text-emerald-950", blue: "border-sky-200 bg-sky-50 text-sky-950", rose: "border-rose-200 bg-rose-50 text-rose-950" }[tone];
  return <div className={`min-w-0 rounded-2xl border p-5 ${classes}`}><h3 className="font-black">{title}</h3><p className="mt-1 text-xs opacity-65">{note}</p><ul className="mt-4 space-y-3">{items.map((item) => <li key={item} className="break-words rounded-xl bg-white/70 p-3 text-sm leading-6"><StudyText text={item} gloss={gloss} /></li>)}</ul></div>;
}

function moveStage<T extends readonly (readonly [string, Copy])[]>(stages: T, current: T[number][0], direction: number, setter: (value: T[number][0]) => void) { const index = stages.findIndex(([id]) => id === current); const next = stages[Math.max(0, Math.min(stages.length - 1, index + direction))]; setter(next[0]); }

function SelectorColumn({ label, title, children }: { label: string; title: string; children: ReactNode }) { return <div><p className="text-[10px] font-black tracking-[0.16em] text-violet-700">{label}</p><h2 className="mt-1 text-sm font-black">{title}</h2><div className="mt-4 max-h-[26rem] space-y-1.5 overflow-y-auto pr-1">{children}</div></div>; }

function SelectButton({ active, onClick, code, label, checkbox = false }: { active: boolean; onClick: () => void; code: string; label: string; checkbox?: boolean }) { return <button type="button" onClick={onClick} aria-pressed={active} className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition ${active ? "border-violet-600 bg-violet-700 text-white" : "border-stone-200 hover:border-violet-300"}`}><span className={`flex h-6 min-w-8 items-center justify-center rounded-md text-[10px] font-black ${active ? "bg-amber-300 text-slate-950" : "bg-stone-100 text-slate-600"}`}>{checkbox ? (active ? "✓" : "+") : code}</span><span className="font-bold">{label}</span></button>; }

function FlowNode({ number, title, text, gloss }: { number: string; title: string; text: string; gloss: boolean }) { return <div className="min-w-0 rounded-xl border border-white/15 bg-white/10 p-3 md:flex-1"><span className="text-[10px] font-black text-amber-300">{number}</span><h3 className="mt-1 text-sm font-black">{title}</h3><p className="mt-1.5 break-words text-xs leading-5 text-stone-300"><StudyText text={text} gloss={gloss} /></p></div>; }
function FlowArrow() { return <div className="flex items-center justify-center text-lg font-black text-amber-300 md:w-5 md:shrink-0"><span className="md:hidden">↓</span><span className="hidden md:inline">→</span></div>; }

function TechnologyTopicPanel({ topic, t, gloss }: { topic: TechnologyTopic; t: (value: Copy) => string; gloss: boolean }) {
  return <section className="mt-6 overflow-hidden rounded-[2rem] border border-amber-200 bg-amber-50 shadow-sm"><div className="grid lg:grid-cols-[0.85fr_1.15fr]"><div className="relative min-h-80 border-b border-amber-100 bg-white lg:min-h-[32rem] lg:border-b-0 lg:border-r"><Image src={topic.diagram} alt={t(topic.title)} fill unoptimized className="object-contain p-4 sm:p-6" /></div><div className="p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-black tracking-[0.16em] text-amber-800">{t(c("已核实技术史主题", "検証済み技術史テーマ", "VERIFIED TECHNOLOGY-HISTORY TOPIC"))}</p><span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-amber-900">{t(topic.exam)}</span></div><h2 className="mt-3 text-2xl font-black"><StudyText text={t(topic.title)} gloss={gloss} /></h2><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black">{topic.typeId}</span>{topic.mechanismIds.map((id) => <span key={id} className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black">× {id}</span>)}<span className="rounded-full bg-violet-200 px-3 py-1 text-xs font-black">× {topic.operationId}</span></div><div className="mt-5 grid gap-2 sm:grid-cols-2">{topic.chain.map((step, index) => <div key={step.en} className="rounded-xl bg-white p-3 text-sm leading-6"><span className="mr-2 font-black text-amber-700">{String(index + 1).padStart(2, "0")}</span><StudyText text={t(step)} gloss={gloss} /></div>)}</div><div className="mt-5 rounded-xl bg-slate-950 p-4 text-sm leading-7 text-white"><strong className="text-amber-300">{t(c("这一题真正要证明：", "この題で証明すること：", "What this topic must prove:"))}</strong> <StudyText text={t(topic.point)} gloss={gloss} /></div><details className="mt-4 rounded-xl border border-amber-200 bg-white p-4"><summary className="cursor-pointer text-sm font-black text-slate-900">{t(c("展开可直接学习的答案", "学習用答案を開く", "Open the study answer"))}</summary><p className="mt-4 text-sm leading-8 text-slate-700"><StudyText text={t(topic.answer)} gloss={gloss} /></p></details><div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm leading-7 text-rose-950"><strong>{t(c("不要这样写：", "避ける書き方：", "Avoid:"))}</strong> <StudyText text={t(topic.caution)} gloss={gloss} /></div><p className="mt-4 text-[11px] leading-5 text-stone-500"><strong>{t(c("资料依据：", "資料根拠：", "Evidence basis:"))}</strong> <StudyText text={t(topic.source)} gloss={gloss} /></p></div></div></section>;
}

function CausalSentence({ t }: { t: (value: Copy) => string }) { return <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch"><span className="rounded-xl bg-sky-100 p-3 text-sm font-bold text-sky-950">{t(c("背景：东大寺复兴", "背景：東大寺復興", "Context: Tōdai-ji reconstruction"))}</span><span className="self-center font-black text-amber-700">→</span><span className="rounded-xl bg-amber-100 p-3 text-sm font-bold text-amber-950">{t(c("媒介：重源", "媒介：重源", "Mediator: Chōgen"))}</span><span className="self-center font-black text-amber-700">→</span><span className="rounded-xl bg-violet-100 p-3 text-sm font-bold text-violet-950">{t(c("手段：贯、插肘木", "手段：貫・挿肘木", "Means: nuki, inserted brackets"))}</span><span className="self-center font-black text-amber-700">→</span><span className="rounded-xl bg-emerald-100 p-3 text-sm font-bold text-emerald-950">{t(c("结果：结构成为空间表现", "結果：構造が空間表現となる", "Result: structure becomes spatial expression"))}</span></div>; }

function ColorCodedAnswer({ t }: { t: (value: Copy) => string }) { return <div className="mt-6 rounded-2xl border border-stone-200 p-5"><div className="mb-4 flex flex-wrap gap-2 text-[10px] font-black"><span className="rounded bg-sky-100 px-2 py-1 text-sky-900">{t(c("历史条件", "歴史条件", "CONTEXT"))}</span><span className="rounded bg-amber-100 px-2 py-1 text-amber-900">{t(c("媒介／机制", "媒介・機制", "MECHANISM"))}</span><span className="rounded bg-emerald-100 px-2 py-1 text-emerald-900">{t(c("建筑结果", "建築結果", "RESULT"))}</span><span className="rounded bg-violet-100 px-2 py-1 text-violet-900">{t(c("意义／限界", "意義・限界", "MEANING"))}</span></div><p className="text-sm leading-8"><mark className="bg-sky-100 px-1">{t(c("大佛样形成于镰仓初期东大寺复兴的背景下。", "大仏様は鎌倉初期の東大寺復興を背景に成立した。", "Daibutsuyō emerged during the early Kamakura reconstruction of Tōdai-ji."))}</mark> <mark className="bg-amber-100 px-1">{t(c("重源通过造营网络引入宋代建筑知识，并采用贯、插肘木与大断面部材。", "重源は造営網を通じて宋代建築知識を導入し、貫・挿肘木・大断面部材を用いた。", "Chōgen introduced Song building knowledge through construction networks, using nuki, inserted brackets, and large timbers."))}</mark> <mark className="bg-emerald-100 px-1">{t(c("这些手段强化水平联系与出檐支承，使构造本身成为空间表现。", "これらは水平連結と軒支持を強化し、構造自体を空間表現とした。", "These strengthened lateral ties and eave support, making structure itself a spatial expression."))}</mark> <mark className="bg-violet-100 px-1">{t(c("因此它不是宋代形式的原样复制，而是在日本材料、工匠与寺院造营中重新组织的体系。", "したがって宋代形式の複製ではなく、日本の材料・工匠・寺院造営で再編された体系である。", "It was therefore not a direct copy but a system reorganized through Japanese materials, craftspeople, and temple construction."))}</mark></p></div>; }
