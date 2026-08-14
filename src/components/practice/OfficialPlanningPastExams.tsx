"use client";

import { useState } from "react";
import {
  FIRST_CLASS_ARCHITECT_PLANNING_EXAMS,
  FIRST_CLASS_ARCHITECT_PLANNING_QUESTIONS,
  type FirstClassArchitectPlanningQuestion,
} from "@/lib/first-class-architect-planning-exams";

type Locale = "zh" | "ja";

const copy = {
  zh: {
    questions: "学科Ⅰ・计划 20 题",
    open: "展开题目",
    questionPdf: "官方试题 PDF ↗",
    answerPdf: "官方答案 PDF ↗",
    imported: "PDF 导入题目",
    previous: "上一题",
    next: "下一题",
    correct: "回答正确",
    incorrect: (answer: string) => `回答错误。官方答案是第 ${answer} 项。`,
    source: "在官方 PDF 查看图面与原始排版 ↗",
    dualAnswer: "※ No.7 根据官方处理，第 1、4 项均为正确答案。",
  },
  ja: {
    questions: "学科Ⅰ・計画 20問",
    open: "問題を開く",
    questionPdf: "公式問題 PDF ↗",
    answerPdf: "公式正答 PDF ↗",
    imported: "PDF取込済み問題",
    previous: "前の問題",
    next: "次の問題",
    correct: "正解です",
    incorrect: (answer: string) => `不正解です。公式正答は第 ${answer} 肢です。`,
    source: "図・原レイアウトを公式PDFで確認 ↗",
    dualAnswer: "※ No.7は公式措置により、第1・第4肢の両方が正答です。",
  },
};

export default function OfficialPlanningPastExams({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <div className="grid gap-4">
    {FIRST_CLASS_ARCHITECT_PLANNING_EXAMS.map((exam, examIndex) => {
      const questions = FIRST_CLASS_ARCHITECT_PLANNING_QUESTIONS.filter((question) => question.year === exam.year);
      return <details key={exam.year} open={examIndex === 0} className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
          <div><p className="text-lg font-black text-slate-950">{exam.eraLabel}（{exam.year}）</p><p className="mt-1 text-xs text-slate-500">{t.questions}</p></div>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 group-open:bg-violet-700 group-open:text-white">{t.open}</span>
        </summary>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
          <a href={exam.questionHref} target="_blank" rel="noreferrer" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white">{t.questionPdf}</a>
          <a href={exam.answerHref} target="_blank" rel="noreferrer" className="rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700">{t.answerPdf}</a>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-10">
          {exam.answers.map((answer, index) => <div key={`${exam.year}-${index + 1}`} className="rounded-xl bg-stone-50 px-2 py-2 text-center"><p className="text-[10px] text-slate-400">No.{index + 1}</p><p className="mt-0.5 font-black text-slate-900">{answer}</p></div>)}
        </div>
        {exam.year === 2020 && <p className="mt-3 text-xs leading-6 text-amber-700">{t.dualAnswer}</p>}
        <OfficialExamQuiz questions={questions} locale={locale} />
      </details>;
    })}
  </div>;
}

function OfficialExamQuiz({ questions, locale }: { questions: FirstClassArchitectPlanningQuestion[]; locale: Locale }) {
  const t = copy[locale];
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const question = questions[index];
  if (!question) return null;
  const accepted = question.correctOption.split("・").map(Number);
  const isCorrect = selected !== null && accepted.includes(selected);
  const move = (nextIndex: number) => { setIndex(nextIndex); setSelected(null); };
  return <div className="mt-5 border-t border-stone-100 pt-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-black text-slate-900">{t.imported} · No.{question.number}</p>
      <div className="flex gap-2">
        <button type="button" disabled={index === 0} onClick={() => move(index - 1)} className="rounded-full border border-stone-200 px-3 py-1 text-xs font-bold disabled:opacity-30">← {t.previous}</button>
        <button type="button" disabled={index + 1 === questions.length} onClick={() => move(index + 1)} className="rounded-full border border-stone-200 px-3 py-1 text-xs font-bold disabled:opacity-30">{t.next} →</button>
      </div>
    </div>
    <p className="mt-4 text-sm font-bold leading-7 text-slate-900">{question.prompt}</p>
    <div className="mt-4 grid gap-2">
      {question.options.map((option, optionIndex) => {
        const number = optionIndex + 1;
        const correctOption = accepted.includes(number);
        const chosen = selected === number;
        return <button key={number} type="button" disabled={selected !== null} onClick={() => setSelected(number)} className={`rounded-xl border px-3 py-3 text-left text-sm leading-6 ${selected !== null && correctOption ? "border-emerald-400 bg-emerald-50 text-emerald-900" : chosen ? "border-rose-300 bg-rose-50 text-rose-800" : "border-stone-200 hover:border-violet-300 hover:bg-violet-50"}`}><span className="mr-2 font-black text-slate-400">{number}.</span>{option}</button>;
      })}
    </div>
    {selected !== null && <div className={`mt-4 rounded-xl p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}><p className="font-black">{isCorrect ? t.correct : t.incorrect(question.correctOption)}</p></div>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-1.5">{questions.map((item, itemIndex) => <button key={item.id} type="button" onClick={() => move(itemIndex)} aria-label={`No.${item.number}`} className={`h-7 w-7 rounded-full text-[11px] font-bold ${itemIndex === index ? "bg-violet-700 text-white" : "bg-stone-100 text-slate-600 hover:bg-violet-100"}`}>{item.number}</button>)}</div>
      <a href={`${question.questionHref}#page=${question.sourcePage}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-violet-700">{t.source}</a>
    </div>
  </div>;
}
