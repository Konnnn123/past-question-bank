"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import type { Question } from "@/types/question";

interface QuestionDetailClientProps {
  question: Question | undefined;
  questionIndex: number;
  totalQuestions: number;
}

export default function QuestionDetailClient({
  question,
  questionIndex,
  totalQuestions,
}: QuestionDetailClientProps) {
  const [answer, setAnswer] = useState(question?.answer || "");
  const [isEditing, setIsEditing] = useState(false);
  const [referrer, setReferrer] = useState("/");

  useEffect(() => {
    const stored = localStorage.getItem("questionReferrer");
    if (stored) {
      setReferrer(stored);
    }
  }, []);

  const handleBack = () => {
    localStorage.removeItem("questionReferrer");
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">問題が見つかりません</p>
          <Link
            href="/"
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            問題一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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

        {/* Answer Section (Placeholder) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">解答</h2>
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
      </div>
    </div>
  );
}
