"use client";

import { useMemo, useState } from "react";
import { getAttemptsForQuestion, saveAttempt } from "@/lib/attempt-records";
import { applyReviewSchedule, markTemporarilyMastered, upsertReviewState } from "@/lib/review-states";
import { saveStudyStatus } from "@/lib/study-records";

export type OriginalQuestionLink = { href: string; label: string };

type Props = {
  questionId: string;
  questionBlockId: string;
  subquestionId: string;
  subject: string;
  subjectCode: string;
  year: number;
  questionNumber: string;
  correctAnswerText: string;
  topicTags: string[];
  sourceHref: string;
  answerBasis: string;
  related: OriginalQuestionLink[];
};

function answerMark(answer: string) {
  return answer.trim().startsWith("○") ? "○" : answer.trim().startsWith("×") ? "×" : null;
}

export function TrueFalseOriginalAnswer(props: Props) {
  const [selected, setSelected] = useState<"○" | "×" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = useMemo(() => answerMark(props.correctAnswerText), [props.correctAnswerText]);
  if (!correct) return null;

  const submit = () => {
    if (!selected) return;
    const isCorrect = selected === correct;
    const cognitiveTask = "根据原题陈述进行正误判断。";
    const knowledgeRelation = "原题陈述 ↔ 可由答案索引确认的真伪判断。";
    const commonErrorTags: string[] = [];
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
      userAnswer: selected,
      correctAnswer: correct,
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
        commonErrorTags,
        answerBasis: props.answerBasis,
        sourceHref: props.sourceHref,
        attemptCount: getAttemptsForQuestion(props.questionId).length + 1,
      },
    });
    saveStudyStatus(props.questionId, isCorrect ? "correct" : "wrong", source);
    upsertReviewState(props.questionId, props.subjectCode, "past_exam_true_false", {});
    if (isCorrect) markTemporarilyMastered(props.questionId);
    else applyReviewSchedule(props.questionId, "wrong");
    setSubmitted(true);
  };

  return <section className="mt-4 rounded-xl border border-violet-200 bg-violet-50/40 p-4">
    <p className="text-xs font-semibold text-violet-800">自动判分 · 已列入可靠答案 allowlist</p>
    <p className="text-sm font-semibold text-violet-900">原题作答（正误判断）</p>
    <p className="mt-1 text-xs text-slate-600">请选择原题陈述的判断；提交后才显示答案索引与依据。</p>
    {!submitted ? <>
      <div className="mt-3 flex gap-2">
        {(["○", "×"] as const).map((mark) => <button key={mark} onClick={() => setSelected(mark)} aria-pressed={selected === mark} className={`rounded-full border px-5 py-2 text-sm font-bold ${selected === mark ? "border-violet-600 bg-violet-700 text-white" : "border-slate-300 bg-white text-slate-700"}`}>{mark}</button>)}
      </div>
      <button disabled={!selected} onClick={submit} className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">提交原题答案</button>
    </> : <div className={`mt-3 rounded-lg border p-3 text-sm ${selected === correct ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <p><b>你的答案：</b>{selected}　<b>正确答案：</b>{correct}　<b>{selected === correct ? "正确" : "错误"}</b></p>
      <p className="mt-2"><b>答案依据：</b>{props.answerBasis}</p>
      <p className="mt-1"><b>认知任务：</b>根据原题陈述进行正误判断。</p>
      <p className="mt-1"><b>知识关系：</b>原题陈述 ↔ 可由答案索引确认的真伪判断。</p>
      <p className="mt-1"><b>逐选项解析：</b>现有资料仅能确认正确答案，尚无足够证据逐项解释其他选项。</p>
      <div className="mt-3"><b>同类真实过去问：</b>{props.related.length ? props.related.map((item) => <a key={item.href} href={item.href} className="ml-2 text-violet-700 underline">{item.label}</a>) : "当前题库中没有更多同类过去问。"}</div>
    </div>}
  </section>;
}
