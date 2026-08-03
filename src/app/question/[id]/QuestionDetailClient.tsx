"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import { findOriginalLanguageTermsInText } from "@/lib/original-language-terms";
import {
  readStudyRecords,
  saveStudyStatus,
  STUDY_STATUS_META,
  type StudyStatus,
} from "@/lib/study-records";
import type {
  AnswerReliability,
  QuestionAnswerRecord,
} from "@/types/question-answer";

interface QuestionDetailClientProps {
  question: Question | undefined;
  questionIndex: number;
  totalQuestions: number;
  previousQuestionId?: string;
  nextQuestionId?: string;
  answerRecord?: QuestionAnswerRecord;
}

export default function QuestionDetailClient({
  question,
  questionIndex,
  totalQuestions,
  previousQuestionId,
  nextQuestionId,
  answerRecord,
}: QuestionDetailClientProps) {
  const [answer, setAnswer] = useState(question?.answer || "");
  const [isEditing, setIsEditing] = useState(false);
  const [referrer, setReferrer] = useState("/");
  const [studyStatus, setStudyStatus] = useState<StudyStatus>("unseen");
  const [showReferenceAnswer, setShowReferenceAnswer] = useState(false);
  const originalTerms = question ? findOriginalLanguageTermsInText(question.content) : [];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = localStorage.getItem("questionReferrer");
      if (stored) setReferrer(stored);
      if (question) setStudyStatus(readStudyRecords()[question.id]?.status ?? "unseen");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [question]);

  const updateStudyStatus = (status: Exclude<StudyStatus, "unseen">) => {
    if (!question) return;
    saveStudyStatus(question.id, status);
    setStudyStatus(status);
  };

  const reliabilityMeta: Record<AnswerReliability, { label: string; color: string }> = {
    "source-supported": { label: "资料支持草稿", color: "bg-blue-100 text-blue-800" },
    "ai-draft": { label: "AI／图像草稿", color: "bg-amber-100 text-amber-800" },
    questionable: { label: "存在疑问", color: "bg-rose-100 text-rose-800" },
  };

  const handleBack = () => {
    localStorage.removeItem("questionReferrer");
  };

  if (!question) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-400">問題が見つかりません</p>
            <Link
              href="/exam/past"
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              返回过去问
            </Link>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="bg-white">
      {/* Top Bar */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <Link
          href={referrer}
          onClick={handleBack}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← 戻る
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {question.year} · {question.category} · {question.subject} · 問題{" "}
            {question.question_number}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-500">这道题现在是什么状态？</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {STUDY_STATUS_META[studyStatus].label}
                <span className="ml-2 font-normal text-slate-400">{questionIndex + 1} / {totalQuestions}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["correct", "wrong", "uncertain", "later"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => updateStudyStatus(status)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    studyStatus === status
                      ? STUDY_STATUS_META[status].color + " ring-2 ring-offset-1 ring-slate-300"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {STUDY_STATUS_META[status].shortLabel}
                </button>
              ))}
            </div>
          </div>
        </section>
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 text-white text-lg font-bold">
              {question.question_number}
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {question.subject}
              </h1>
              <p className="text-sm text-gray-500">{question.category}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">原題</h2>
          </div>
          <div className="p-6">
            <div className="prose prose-gray max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="max-w-full h-auto rounded-lg my-4"
                      alt={props.alt || "問題画像"}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      {...props}
                      className="text-lg font-bold text-gray-900 mt-6 mb-3"
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      {...props}
                      className="text-base font-semibold text-gray-800 mt-4 mb-2"
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      {...props}
                      className="text-sm font-semibold text-gray-700 mt-3 mb-2"
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p {...props} className="mb-3 last:mb-0 leading-relaxed" />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul {...props} className="list-disc pl-5 mb-3 space-y-1" />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal pl-5 mb-3 space-y-1"
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li {...props} className="leading-relaxed" />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      {...props}
                      className="bg-gray-100 px-1.5 py-0.5 rounded text-sm"
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      {...props}
                      className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-3"
                    />
                  ),
                }}
              >
                {question.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {originalTerms.length > 0 && (
          <details className="mb-8 rounded-xl border border-violet-100 bg-violet-50/40">
            <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-violet-800 marker:text-violet-500">
              片仮名・原語 ({originalTerms.length})
            </summary>
            <div className="grid gap-2 border-t border-violet-100 px-6 py-4 sm:grid-cols-2">
              {originalTerms.map((term) => (
                <div key={term.ja} className="rounded-lg border border-white bg-white/80 px-3 py-2 text-sm">
                  <p className="font-medium text-slate-800">{term.ja}</p>
                  <p className="mt-0.5 font-serif text-xs tracking-wide text-violet-700">{term.original} <span className="font-sans text-slate-400">· {term.language}</span></p>
                </div>
              ))}
            </div>
          </details>
        )}

        {answerRecord && answerRecord.items.length > 0 && (
          <section className="mb-8 overflow-hidden rounded-xl border border-blue-200 bg-blue-50/30">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-6 py-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-blue-950">整理中的参考答案</h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700">{answerRecord.items.length} 小问</span>
                </div>
                <p className="mt-1 text-xs text-blue-700">这些答案来自现有资料整理，并非官方答案；请结合状态判断可靠性。</p>
              </div>
              <button onClick={() => setShowReferenceAnswer((value) => !value)} className="rounded-full bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-800">
                {showReferenceAnswer ? "隐藏答案" : "显示答案"}
              </button>
            </div>
            {showReferenceAnswer && (
              <div className="space-y-3 p-4 sm:p-6">
                {answerRecord.items.map((item, index) => {
                  const meta = reliabilityMeta[item.reliability];
                  return (
                    <article key={item.itemId} className="rounded-xl border border-blue-100 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-500">小问 {index + 1}{item.prompt ? ` · ${item.prompt}` : ""}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.color}`} title={item.sourceStatus}>{meta.label}</span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-900">{item.choice ? `${item.choice} · ` : ""}{item.answer}</p>
                      {item.explanation && <p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p>}
                      {item.drawingPoints && item.drawingPoints.length > 0 && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-500">作图要点</p><ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">{item.drawingPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Personal answer section */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">我的答案／补充</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isEditing ? "保存" : "編集"}
            </button>
          </div>
          <div className="p-6">
            {isEditing ? (
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="解答を入力してください..."
                className="w-full h-48 text-sm text-gray-800 leading-relaxed border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            ) : answer ? (
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                まだ解答がありません — 「編集」をクリックして解答を入力してください
              </p>
            )}
          </div>
        </div>
        <nav className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          {previousQuestionId ? (
            <Link href={`/question/${encodeURIComponent(previousQuestionId)}`} className="text-sm text-slate-600 hover:text-slate-950">
              ← 上一题
            </Link>
          ) : <span />}
          <Link href="/practice" className="text-sm font-medium text-violet-700 hover:text-violet-900">进入练习队列</Link>
          {nextQuestionId ? (
            <Link href={`/question/${encodeURIComponent(nextQuestionId)}`} className="text-sm text-slate-600 hover:text-slate-950">
              下一题 →
            </Link>
          ) : <span />}
        </nav>
      </div>
    </div>
    </SidebarLayout>
  );
}
