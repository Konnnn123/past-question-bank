"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { readAttempts, saveAttempt, type AttemptRecord } from "@/lib/attempt-records";
import type { TrainerBlock, TrainerSubject, TrainerUnit } from "@/lib/past-exam-trainer";

type Props = { blocks: TrainerBlock[]; units: TrainerUnit[] };
type View = "browse" | "sample" | "wrong" | "path";
const labels: Record<TrainerSubject, string> = { history: "建筑史", planning: "建筑计划", building_construction: "建筑构法", environment: "环境工学" };
const noOptionEvidence = "现有资料仅能确认正确答案，尚无足够证据逐项解释其他选项。";

function unique<T>(items: T[]) { return [...new Set(items)]; }
function normal(value: string) { return value.trim().replace(/\s+/g, " ").toLowerCase(); }

export default function TrainerClient({ blocks, units }: Props) {
  const [view, setView] = useState<View>("browse");
  const [subject, setSubject] = useState<TrainerSubject | "all">("all");
  const [year, setYear] = useState("all");
  const [surface, setSurface] = useState("all");
  const [task, setTask] = useState("all");
  const [tag, setTag] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [selectedBlock, setSelectedBlock] = useState<TrainerBlock | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<TrainerUnit | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [mastered, setMastered] = useState<string[]>([]);

  const allItems = useMemo(() => [...blocks, ...units], [blocks, units]);
  const filteredBlocks = blocks.filter((block) => (subject === "all" || block.trainerSubject === subject) && (year === "all" || String(block.year) === year) && (tag === "all" || block.metadata.topicTags.includes(tag)) && (confidence === "all" || block.metadata.confidence === confidence));
  const filteredUnits = units.filter((unit) => (subject === "all" || unit.trainerSubject === subject) && (year === "all" || String(unit.year) === year) && (surface === "all" || unit.metadata.surfaceFormat === surface) && (task === "all" || unit.metadata.cognitiveTask === task) && (tag === "all" || unit.metadata.topicTags.includes(tag)) && (confidence === "all" || unit.metadata.confidence === confidence));
  const years = unique(allItems.map((item) => item.year)).sort((a, b) => b - a);
  const tags = unique(allItems.flatMap((item) => item.metadata.topicTags)).sort();
  const surfaces = unique(units.map((item) => item.metadata.surfaceFormat));
  const tasks = unique(units.map((item) => item.metadata.cognitiveTask));
  const wrongs = attempts.filter((attempt) => attempt.result === "wrong" && attempt.trainer);

  const openUnit = (unit: TrainerUnit) => { setSelectedUnit(unit); setSelectedBlock(null); setAnswer(""); setSubmitted(false); };
  const submit = () => {
    if (!selectedUnit) return;
    const correct = normal(answer) === normal(selectedUnit.answer);
    const previous = attempts.filter((attempt) => attempt.questionId === selectedUnit.id);
    const record = saveAttempt({ questionId: selectedUnit.id, userAnswer: answer || "（未作答）", correctAnswer: selectedUnit.answer, result: correct ? "correct" : "wrong", confidence: "sure", trainer: {
      subject: selectedUnit.trainerSubject, year: selectedUnit.year, cognitiveTask: selectedUnit.metadata.cognitiveTask, knowledgeRelation: selectedUnit.metadata.knowledgeRelation, topicTags: selectedUnit.metadata.topicTags, commonErrorTags: selectedUnit.metadata.commonErrorTags, sourceQuestionId: selectedUnit.sourceQuestionId,
    }});
    setAttempts([...attempts, record]); setSubmitted(true);
    if (correct && previous.some((attempt) => attempt.result === "wrong")) setMastered(unique([...mastered, selectedUnit.id]));
  };
  const related = selectedUnit ? units.filter((unit) => unit.id !== selectedUnit.id && unit.trainerSubject === selectedUnit.trainerSubject && (unit.metadata.cognitiveTask === selectedUnit.metadata.cognitiveTask || unit.metadata.topicTags.some((tag) => selectedUnit.metadata.topicTags.includes(tag)))).slice(0, 3) : [];
  const recommendations = useMemo(() => {
    const wrongById = new Map<string, AttemptRecord[]>();
    wrongs.forEach((attempt) => wrongById.set(attempt.questionId, [...(wrongById.get(attempt.questionId) ?? []), attempt]));
    const ranked = units.map((unit) => {
      const own = wrongById.get(unit.id) ?? [];
      const relatedErrors = wrongs.filter((attempt) => attempt.trainer && (attempt.trainer.cognitiveTask === unit.metadata.cognitiveTask || attempt.trainer.topicTags.some((tag) => unit.metadata.topicTags.includes(tag))));
      const done = attempts.filter((attempt) => attempt.questionId === unit.id);
      const correctRate = done.length ? Math.round(done.filter((attempt) => attempt.result === "correct").length / done.length * 100) : null;
      const reason = own.length ? `回炉：已错 ${own.length} 次` : relatedErrors.length ? "同认知任务／主题的真实过去问" : done.length ? "巩固已做过的原题" : "同类未做的真实过去问";
      return { unit, score: own.length * 10 + relatedErrors.length * 3 + (done.length ? 0 : 2), reason, correctRate, errorTags: unique(relatedErrors.flatMap((attempt) => attempt.trainer?.commonErrorTags ?? [])) };
    });
    return ranked.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [attempts, units, wrongs]);

  const filterSelect = (value: string, setValue: (value: string) => void, options: Array<{ value: string; label: string }>, label: string) => <label className="grid gap-1 text-xs font-medium text-slate-600"><span>{label}</span><select value={value} onChange={(event) => setValue(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-800">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
  const openAttempts = () => setAttempts(readAttempts());

  return <SidebarLayout><main className="min-h-full bg-violet-50/40 px-5 py-8 sm:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/practice" className="text-sm text-slate-500 hover:text-violet-700">← 返回练习</Link>
    <header className="mt-4"><p className="text-xs font-semibold tracking-[.2em] text-violet-700">PAST EXAM INTELLIGENT TRAINER v1</p><h1 className="mt-2 text-3xl font-bold text-slate-950">过去问训练中心</h1><p className="mt-2 text-slate-600">只浏览、抽样与复练仓库中真实存在的过去问；不将重排内容伪称为新题。</p></header>
    <nav className="mt-6 flex flex-wrap gap-2">{([ ["browse", "按年份浏览"], ["sample", "按条件抽样"], ["wrong", "错题本"], ["path", "今日学习路径"] ] as Array<[View, string]>).map(([key, text]) => <button key={key} onClick={() => { setView(key); if (key === "wrong" || key === "path") openAttempts(); }} className={`rounded-full px-4 py-2 text-sm font-semibold ${view === key ? "bg-violet-700 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{text}</button>)}<Link href="/exam/mock/history-mwb" className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">已验证 Generator</Link></nav>
    {(view === "browse" || view === "sample") && <section className="mt-6 rounded-2xl border border-violet-100 bg-white p-4"><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {filterSelect(subject, (value) => setSubject(value as TrainerSubject | "all"), [{ value: "all", label: "全部科目" }, ...Object.entries(labels).map(([value, label]) => ({ value, label }))], "科目")}
      {filterSelect(year, setYear, [{ value: "all", label: "全部年份" }, ...years.map((value) => ({ value: String(value), label: `${value}` }))], "年份")}
      {view === "sample" && filterSelect(surface, setSurface, [{ value: "all", label: "全部表面形式" }, ...surfaces.map((value) => ({ value, label: value }))], "题面形式")}
      {view === "sample" && filterSelect(task, setTask, [{ value: "all", label: "全部认知任务" }, ...tasks.map((value) => ({ value, label: value }))], "认知任务")}
      {filterSelect(tag, setTag, [{ value: "all", label: "全部主题／设施" }, ...tags.map((value) => ({ value, label: value }))], "主题／设施")}
      {filterSelect(confidence, setConfidence, [{ value: "all", label: "全部置信度" }, { value: "verified", label: "verified" }, { value: "draft", label: "draft" }, { value: "incomplete", label: "incomplete" }], "答案置信度")}
    </div></section>}
    {view === "browse" && <section className="mt-6 space-y-3"><h2 className="font-bold text-slate-900">真实大题块（{filteredBlocks.length}）</h2>{filteredBlocks.map((block) => <article key={block.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap gap-2 text-xs"><span className="rounded bg-violet-100 px-2 py-1 font-semibold text-violet-800">{labels[block.trainerSubject]} · {block.year} · 大题 {block.question_number}</span><span className="rounded bg-slate-100 px-2 py-1">past_exam_reconstruction</span><span className="rounded bg-amber-100 px-2 py-1 text-amber-800">{block.gradingStatus === "missing_source_material" ? "missing_source_material" : "仅浏览／自评"}</span></div><p className="mt-3 text-sm text-slate-600">来源：{block.sourcePath}</p><button onClick={() => { setSelectedBlock(block); setSelectedUnit(null); }} className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">打开原题块</button></article>)}</section>}
    {view === "sample" && <section className="mt-6 space-y-3"><h2 className="font-bold text-slate-900">可自动判分的真实小问（{filteredUnits.length}）</h2>{filteredUnits.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">当前题库中没有更多同类过去问。</p> : filteredUnits.map((unit) => <article key={unit.id} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap gap-2 text-xs"><span>{labels[unit.trainerSubject]} · {unit.year} · {unit.label}</span><span className="rounded bg-slate-100 px-2 py-1">Level {unit.level}</span><span className="rounded bg-violet-100 px-2 py-1">{unit.metadata.surfaceFormat}</span></div><p className="mt-3 text-sm text-slate-600 line-clamp-2">{unit.prompt}</p><button onClick={() => openUnit(unit)} className="mt-3 rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white">开始此题</button></article>)}</section>}
    {view === "wrong" && <section className="mt-6"><h2 className="font-bold text-slate-900">错题聚合</h2>{wrongs.length === 0 ? <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">尚无本训练中心的错题记录。完成一题后会保留历史，不会因答对而删除。</p> : <div className="mt-3 space-y-3">{Object.entries(wrongs.reduce<Record<string, AttemptRecord[]>>((map, item) => { map[item.questionId] = [...(map[item.questionId] ?? []), item]; return map; }, {})).map(([id, records]) => { const unit = units.find((item) => item.id === id); const meta = records.at(-1)?.trainer; return <article key={id} className="rounded-2xl border border-rose-200 bg-white p-5"><p className="text-sm font-bold">{meta && `${labels[meta.subject]} · ${meta.year}`} · 错误 {records.length} 次</p><p className="mt-1 text-xs text-slate-500">认知任务：{meta?.cognitiveTask}；主题：{meta?.topicTags.join("、")}；最近：{new Date(records.at(-1)!.answeredAt).toLocaleString("zh-CN")}</p><p className="mt-1 text-xs text-slate-500">错误标签：{meta?.commonErrorTags.join("、") || "未标注"}</p><div className="mt-3 flex gap-2">{unit && <button onClick={() => { setView("sample"); openUnit(unit); }} className="rounded-full bg-rose-700 px-3 py-2 text-sm font-semibold text-white">重新练此题</button>}{unit && <button onClick={() => { setView("sample"); setSubject(unit.trainerSubject); setTask(unit.metadata.cognitiveTask); }} className="rounded-full border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">同类真实题</button>}<button onClick={() => setMastered(unique([...mastered, id]))} className="rounded-full border border-slate-300 px-3 py-2 text-sm">{mastered.includes(id) ? "已掌握" : "标为已掌握"}</button></div></article>; })}</div>}</section>}
    {view === "path" && <section className="mt-6"><h2 className="font-bold text-slate-900">今日建议 5 题</h2><p className="mt-1 text-sm text-slate-600">优先回炉错误题，再推荐同认知任务、同关系或同主题的真实过去问。</p><div className="mt-4 space-y-3">{recommendations.length ? recommendations.map(({ unit, reason, correctRate, errorTags }) => <article key={unit.id} className="rounded-2xl border border-emerald-200 bg-white p-5"><p className="font-bold">{labels[unit.trainerSubject]} · {unit.year} · {unit.label}</p><p className="mt-1 text-sm text-slate-600">推荐原因：{reason}</p><p className="mt-1 text-xs text-slate-500">训练目标：{unit.metadata.cognitiveTask} · 错误标签：{errorTags.join("、") || "暂无"} · 历史正确率：{correctRate === null ? "未作答" : `${correctRate}%`}</p><button onClick={() => { setView("sample"); openUnit(unit); }} className="mt-3 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">开始训练</button></article>) : <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">当前题库中没有更多同类过去问。</p>}</div></section>}
    {selectedBlock && <section className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4"><article className="mx-auto max-w-4xl rounded-3xl bg-white p-6"><button onClick={() => setSelectedBlock(null)} className="text-sm text-slate-500">关闭</button><div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded bg-violet-100 px-2 py-1">{selectedBlock.year} · 大题 {selectedBlock.question_number}</span><span className="rounded bg-slate-100 px-2 py-1">past_exam_reconstruction</span><span className="rounded bg-amber-100 px-2 py-1">{selectedBlock.metadata.confidence}</span></div><p className="mt-3 text-sm text-slate-500">{selectedBlock.sourcePath}</p><div className="prose mt-5 max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedBlock.content}</ReactMarkdown></div>{selectedBlock.gradingStatus === "missing_source_material" ? <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">missing_source_material：可浏览原题，但没有可追溯的正式答案，不能伪造自动评分。</p> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">此大题块保持原始结构与小问顺序；当前仅支持浏览与自评。</p>}</article></section>}
    {selectedUnit && <section className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4"><article className="mx-auto max-w-3xl rounded-3xl bg-white p-6"><button onClick={() => setSelectedUnit(null)} className="text-sm text-slate-500">关闭</button><p className="mt-4 text-xs font-semibold text-violet-700">{labels[selectedUnit.trainerSubject]} · {selectedUnit.year} · {selectedUnit.label} · Level {selectedUnit.level}</p><div className="prose mt-4 max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedUnit.prompt}</ReactMarkdown></div>{!submitted ? <><input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="输入你的答案" className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3"/><button disabled={!answer.trim()} onClick={submit} className="mt-3 rounded-full bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">提交并查看解析</button></> : <div className="mt-5 space-y-3 rounded-2xl border border-violet-100 bg-violet-50 p-5"><p><b>你的答案：</b>{answer}</p><p><b>正确答案：</b>{selectedUnit.answer}</p><p><b>结果：</b>{normal(answer) === normal(selectedUnit.answer) ? "正确" : "错误"}</p><p><b>认知任务：</b>{selectedUnit.metadata.cognitiveTask}</p><p><b>知识关系：</b>{selectedUnit.metadata.knowledgeRelation}</p><p><b>答案依据：</b>{selectedUnit.metadata.answerBasis}</p><p><b>置信度：</b>{selectedUnit.metadata.confidence}</p><p><b>主题：</b>{selectedUnit.metadata.topicTags.join("、")}</p><p><b>原题来源：</b>{selectedUnit.sourcePath}</p><p><b>选项说明：</b>{selectedUnit.metadata.optionAnalysis.length ? selectedUnit.metadata.optionAnalysis.map((item) => `${item.option}：${item.reason}`).join("；") : noOptionEvidence}</p><div><b>相关过去问：</b>{related.length ? related.map((unit) => <button key={unit.id} onClick={() => openUnit(unit)} className="mr-2 text-violet-700 underline">{unit.year} {unit.label}</button>) : "当前题库中没有更多同类过去问。"}</div></div>}</article></section>}
  </div></main></SidebarLayout>;
}
