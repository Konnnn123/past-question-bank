"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import { PracticeControls, PracticeFilterToggle, needsPractice, useStudyRecords } from "@/components/practice/PracticeControls";
import {
  ESSAY_TEMPLATES,
  getHistoryReviewAnswer,
  getEssayTemplateById,
  getHistoryPracticeQuestions,
  type HistoryPracticeMode,
} from "@/lib/history-review";

type Props = { questions: Question[] };
type View = "word-bank" | "essay" | "templates";

function cleanQuestion(content: string) {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // 画像を扱わない専門1練習では、画像だけを指す空の Fig. 行は情報にならない。
    .replace(/^\s*(?:Fig(?:ure)?\.?|図)\s*\d+(?:\s*[-–—]\s*\d+)?\s*$/gim, "")
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function ArchitectureHistoryKnowledgeMapClient({ questions }: Props) {
  const [view, setView] = useState<View>("essay");
  const [year, setYear] = useState<number | "all">("all");
  const [onlyNeedsPractice, setOnlyNeedsPractice] = useState(false);
  const studyRecords = useStudyRecords();
  const practiceQuestions = useMemo(() => getHistoryPracticeQuestions(questions), [questions]);
  const mode: HistoryPracticeMode | null = view === "templates" ? null : view;
  const visible = practiceQuestions.filter((question) =>
    (!mode || question.mode === mode) && (year === "all" || question.year === year) &&
    (!onlyNeedsPractice || needsPractice(question.id, studyRecords))
  );
  const years = [...new Set(practiceQuestions.filter((q) => !mode || q.mode === mode).map((q) => q.year))].sort((a, b) => b - a);

  const sidebar = (
    <div className="space-y-5 py-1">
      <div>
        <p className="text-xs font-semibold tracking-wide text-gray-400 mb-2">建築史・過去問練習</p>
        <div className="space-y-1">
          {([
            ["essay", "専門2-2　論述・作図"],
            ["word-bank", "専門1　語群マッチング"],
            ["templates", "答案の型"],
          ] as const).map(([key, label]) => (
            <button key={key} onClick={() => { setView(key); setYear("all"); }} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${view === key ? "bg-indigo-600 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {view !== "templates" && <div>
        <p className="text-xs font-semibold tracking-wide text-gray-400 mb-2">年度</p>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setYear("all")} className={`rounded-md px-2 py-1 text-xs ${year === "all" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-500 hover:bg-gray-100"}`}>すべて</button>
          {years.map((item) => <button key={item} onClick={() => setYear(item)} className={`rounded-md px-2 py-1 text-xs ${year === item ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-500 hover:bg-gray-100"}`}>{item}</button>)}
        </div>
      </div>}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
        専門1は画像の正解を推定しません。語群の関係・年代・分類を、自力で対応付ける練習です。
      </div>
    </div>
  );

  return <SidebarLayout slot={sidebar}>
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-sm">
      <Link href="/practice" className="text-sm text-gray-500 hover:text-gray-900">← 练习に戻る</Link>
      <span className="text-sm text-gray-500">建築史・過去問トレーニング</span>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <section className="mb-7">
        <p className="mb-2 text-sm font-semibold text-indigo-600">ARCHITECTURAL HISTORY PRACTICE</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">建築史 過去問トレーニング</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">専門1は語群の対応関係を見抜く練習、専門2-2は短い論述と図解の型を身につける練習です。知識資料を読むページではなく、答案を組み立てるページにします。</p>
      </section>
      <div className="mb-7 flex flex-wrap gap-2">
        {([
          ["essay", "専門2-2｜論述・作図"],
          ["word-bank", "専門1｜語群マッチング"],
          ["templates", "答案の型"],
        ] as const).map(([key, label]) => <button key={key} onClick={() => { setView(key); setYear("all"); }} className={`rounded-full px-4 py-2 text-sm transition-colors ${view === key ? "bg-slate-900 font-semibold text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}</button>)}
        {view !== "templates" && <PracticeFilterToggle active={onlyNeedsPractice} onChange={setOnlyNeedsPractice} count={visible.length} />}
      </div>
      {view === "templates" ? <TemplateGrid /> : <QuestionList questions={visible} mode={mode!} />}
    </main>
  </SidebarLayout>;
}

function TemplateGrid() {
  return <div className="grid gap-4 md:grid-cols-2">
    {ESSAY_TEMPLATES.map((template) => <article key={template.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-indigo-600">答案の型</p><h2 className="mt-1 text-lg font-bold text-slate-900">{template.label}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{template.description}</p>
      <ol className="mt-4 space-y-2 pl-5 text-sm leading-relaxed text-slate-700">{template.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      {template.sketch && <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600"><strong className="text-slate-700">図に入れるもの：</strong>{template.sketch.join(" ／ ")}</div>}
    </article>)}
  </div>;
}

function QuestionList({ questions, mode }: { questions: ReturnType<typeof getHistoryPracticeQuestions>; mode: HistoryPracticeMode }) {
  if (!questions.length) return <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">この条件の問題はまだありません。</div>;
  return <div className="space-y-4">
    {questions.map((question) => {
      const template = mode === "essay" ? getEssayTemplateById(question.template) : null;
      const reviewAnswer = getHistoryReviewAnswer(question.fileName);
      return <article key={question.fileName} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2"><span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">{question.year}年 専門{mode === "essay" ? "2-2" : "1"} Q{question.question_number}</span><span className="text-xs font-medium text-slate-400">{question.formLabel}</span></div>
        {template ? <><h2 className="mt-3 text-xl font-bold text-slate-900">{template.label}</h2><p className="mt-1 text-sm text-slate-600">この問題では：{template.description}</p></> : <><h2 className="mt-3 text-xl font-bold text-slate-900">語群を「関係」と「時代」で対応付ける</h2><p className="mt-1 text-sm text-slate-600">名称を丸暗記せず、建築／人物／様式／都市／理論の関係を手掛かりに一対一対応を作ります。</p></>}
        <div className="mt-4 flex flex-wrap gap-1.5">{question.tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-500">{tag}</span>)}</div>
        <section className="mt-5 rounded-xl border border-slate-200"><h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">問題文</h3><pre className="whitespace-pre-wrap bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">{cleanQuestion(question.content)}</pre></section>
        {template && <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">答題思路・図解チェックを開く</summary><div className="grid gap-3 border-t border-slate-200 p-4 md:grid-cols-2"><div><h3 className="text-sm font-semibold text-slate-800">答案の順序</h3><ol className="mt-2 space-y-1 pl-5 text-sm leading-relaxed text-slate-600">{template.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>{template.sketch && <div><h3 className="text-sm font-semibold text-slate-800">図解チェック</h3><ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-600">{template.sketch.map((item) => <li key={item}>□ {item}</li>)}</ul></div>}</div></details>}
        {mode === "word-bank" && <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-700">答題思路を開く</summary><div className="border-t border-slate-200 p-4 text-sm leading-relaxed text-slate-700"><strong>練習手順：</strong>① 語群を種類で印づける　② 明確な組から先に対応する　③ 残りを年代・地域で絞る　④ 重複不可を最後に確認する</div></details>}
        {reviewAnswer && <section className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-4"><h3 className="text-sm font-semibold text-emerald-800">{mode === "essay" ? "答案例" : "正しい語群対応"}</h3><p className="mt-2 text-sm leading-relaxed text-emerald-900">{reviewAnswer.note}</p>{reviewAnswer.requirement && <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900"><strong>答案量：</strong>{reviewAnswer.requirement}</p>}{reviewAnswer.example && !reviewAnswer.examples && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-7 text-slate-700">{reviewAnswer.example}</p>}{reviewAnswer.examples && <div className="mt-3 space-y-3">{reviewAnswer.examples.map((item) => <article key={item.title} className="rounded-lg bg-white p-4"><h4 className="text-sm font-semibold text-slate-900">{item.title}</h4><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.answer}</p></article>)}</div>}{reviewAnswer.pairings && <div className="mt-3 overflow-x-auto rounded-lg bg-white"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-emerald-100 text-emerald-900"><tr><th className="px-3 py-2">語群A</th><th className="px-3 py-2">正しい対応</th><th className="px-3 py-2">年代</th></tr></thead><tbody>{reviewAnswer.pairings.map((pair) => <tr key={pair.term} className="border-t border-slate-100 text-slate-700"><td className="px-3 py-2">{pair.term}</td><td className="px-3 py-2 font-medium">{pair.answer}</td><td className="px-3 py-2">{pair.period}</td></tr>)}</tbody></table></div>}</section>}
        <PracticeControls questionId={question.id} />
      </article>;
    })}
  </div>;
}
