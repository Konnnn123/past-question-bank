"use client";

import { useState } from "react";
import { getAttemptsForQuestion, saveAttempt } from "@/lib/attempt-records";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";
import { saveStudyStatus } from "@/lib/study-records";
import type { OriginalQuestionLink } from "@/components/practice/TrueFalseOriginalAnswer";

export type OriginalChoiceOption = { label: string; text: string };

type Props = {
  questionId: string;
  questionBlockId: string;
  subquestionId: string;
  subject: string;
  subjectCode: string;
  year: number;
  questionNumber: string;
  options: OriginalChoiceOption[];
  correctOptionLabel: string;
  approvedAnswer: string;
  topicTags: string[];
  sourceHref: string;
  answerBasis: string;
  related: OriginalQuestionLink[];
};

export function OriginalChoiceAnswer(props: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = props.options.find((option) => option.label === props.correctOptionLabel);
  if (!correct) return null;

  const submit = () => {
    if (!selected) return;
    const selectedOption = props.options.find((option) => option.label === selected);
    if (!selectedOption) return;
    const isCorrect = selectedOption.label === correct.label;
    const cognitiveTask = "在原题给出的局部选项中选择唯一适切项。";
    const knowledgeRelation = "原题空栏 ↔ 经批准的 slot 级答案索引。";
    const source = {
      sourceQuestionId: props.questionBlockId,
      sourceHref: props.sourceHref,
      sourceLabel: `${props.year} · 専門1 · ${props.questionNumber} · ${props.subquestionId}`,
      subject: props.subject,
      year: props.year,
      topicTags: props.topicTags,
      cognitiveTask,
      answerBasis: props.answerBasis,
    };
    saveAttempt({
      questionId: props.questionId,
      userAnswer: `${selectedOption.label}. ${selectedOption.text}`,
      correctAnswer: `${correct.label}. ${correct.text}`,
      result: isCorrect ? "correct" : "wrong",
      confidence: "sure",
      pastExam: {
        questionBlockId: props.questionBlockId,
        subquestionId: props.subquestionId,
        subject: props.subject,
        year: props.year,
        questionNumber: props.questionNumber,
        cognitiveTask,
        knowledgeRelation,
        topicTags: props.topicTags,
        commonErrorTags: [],
        answerBasis: props.answerBasis,
        sourceHref: props.sourceHref,
        attemptCount: getAttemptsForQuestion(props.questionId).length + 1,
      },
    });
    saveStudyStatus(props.questionId, isCorrect ? "correct" : "wrong", source);
    upsertReviewState(props.questionId, props.subjectCode, "past_exam_local_choice", {});
    if (isCorrect) markTemporarilyMastered(props.questionId);
    else applyReviewSchedule(props.questionId, "wrong");
    setSubmitted(true);
  };

  return <section className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
    <p className="text-xs font-semibold text-emerald-800">自动判分 · 已列入可靠答案 allowlist</p>
    <p className="text-sm font-semibold text-emerald-900">原题作答（局部四选一）</p>
    <p className="mt-1 text-xs text-slate-600">选项来自本题对应空栏；提交后才显示经过批准的答案索引。</p>
    {!submitted ? <>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {props.options.map((option) => <button key={option.label} onClick={() => setSelected(option.label)} aria-pressed={selected === option.label} className={`rounded-lg border p-3 text-left text-sm ${selected === option.label ? "border-emerald-600 bg-emerald-700 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
          <b>{option.label}.</b> {option.text}
        </button>)}
      </div>
      <button disabled={!selected} onClick={submit} className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">提交原题答案</button>
    </> : <div className={`mt-3 rounded-lg border p-3 text-sm ${selected === correct.label ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <p><b>你的答案：</b>{props.options.find((option) => option.label === selected)?.label}. {props.options.find((option) => option.label === selected)?.text}</p>
      <p className="mt-1"><b>正确答案：</b>{correct.label}. {correct.text}（索引答案：{props.approvedAnswer}）</p>
      <p className="mt-2"><b>答案依据：</b>{props.answerBasis}</p>
      <p className="mt-1"><b>认知任务：</b>在原题给出的局部选项中选择唯一适切项。</p>
      <p className="mt-1"><b>知识关系：</b>原题空栏 ↔ 经批准的 slot 级答案索引。</p>
      <p className="mt-1"><b>逐选项解析：</b>现有批准记录仅确认正确选项；未建立逐个错误选项的独立解释。</p>
      <div className="mt-3"><b>同类真实过去问：</b>{props.related.length ? props.related.map((item) => <a key={item.href} href={item.href} className="ml-2 text-emerald-800 underline">{item.label}</a>) : "当前题库中没有更多同类过去问。"}</div>
    </div>}
  </section>;
}
