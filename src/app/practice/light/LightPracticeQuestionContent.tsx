"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function LightPracticeQuestionContent({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
      {text}
    </ReactMarkdown>
  );
}
