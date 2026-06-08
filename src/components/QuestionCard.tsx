"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import type { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  const previewContent =
    question.content.length > 500
      ? question.content.slice(0, 500) + "..."
      : question.content;

  const handleClick = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("questionReferrer", "/");
    }
  };

  return (
    <Link
      href={`/question/${index}`}
      onClick={handleClick}
      className="group block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-900 text-white text-xs font-medium">
            {question.question_number}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {question.subject}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{question.year}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
            {question.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed line-clamp-8">
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className="max-w-full h-auto rounded-lg my-2"
                  alt={props.alt || "問題画像"}
                />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="mb-2 last:mb-0" />
              ),
            }}
          >
            {previewContent}
          </ReactMarkdown>
        </div>

        {/* Thumbnail images */}
        {question.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mt-3">
            {question.images.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="shrink-0 w-32 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
              >
                <img
                  src={img}
                  alt={`図 ${i + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            {question.images.length > 3 && (
              <div className="shrink-0 w-32 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">
                  +{question.images.length - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        {question.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs"
          >
            {tag}
          </span>
        ))}
        {question.tags.length > 5 && (
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 text-xs">
            +{question.tags.length - 5}
          </span>
        )}
      </div>

      {/* Answer Slot Placeholder */}
      {question.answer && (
        <div className="px-5 pb-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-800 mb-1">解答</p>
            <p className="text-sm text-green-700 whitespace-pre-wrap">
              {question.answer}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
}
