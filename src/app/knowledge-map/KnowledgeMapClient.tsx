"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import type { Question } from "@/types/question";

interface Props {
  content: string;
  questions: Question[];
}

// === データ定義 ===

const KP_YEAR_MAP: Record<string, number[]> = {
  "断面2次モーメント（I）": [2013, 2014, 2024],
  "曲げモーメント（M）とせん断力（V）": [2013, 2016, 2017, 2018, 2019, 2024, 2025],
  "支点反力の計算": [2016, 2017, 2018, 2022, 2025, 2026],
  "たわみ角法": [2019],
  "トラス構造": [2022, 2026],
  "オイラー座屈": [2022],
  "熱応力と熱変形": [2015, 2025],
  "塑性解析": [2014],
};

const RESOURCES: Record<string, { title: string; url: string }[]> = {
  "断面2次モーメント（I）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=断面2次モーメント+計算方法+建築構造" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=断面2次モーメント+構造力学" },
  ],
  "曲げモーメント（M）とせん断力（V）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=曲げモーメント図+せん断力図+描き方+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=曲げモーメント図+せん断力図+構造力学" },
  ],
  "支点反力の計算": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=支点反力+計算方法+ピン+ローラー+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=支点反力+構造力学+計算" },
  ],
  "たわみ角法": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=たわみ角法+slope+deflection+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=たわみ角法+構造力学" },
  ],
  "トラス構造": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=トラス構造+軸力計算+節点法+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=トラス+軸力+構造力学" },
  ],
  "オイラー座屈": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=オイラー座屈+座屈荷重+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=オイラー座屈+座屈+構造力学" },
  ],
  "熱応力と熱変形": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=熱応力+熱膨張+構造力学+建築" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=熱応力+熱膨張+構造力学" },
  ],
  "塑性解析": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=塑性断面係数+塑性解析+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=塑性解析+構造力学" },
  ],
};

// === ユーティリティ ===

function headingToId(text: string): string {
  return text
    .replace(/^\d+[\.\s]+/, "")
    .replace(/[（）()・\s]+/g, "-")
    .replace(/[^a-zA-Z0-9　-鿿]/g, "")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractText(children: React.ReactNode): string {
  const parts: string[] = [];
  React.Children.forEach(children, (child) => {
    if (typeof child === "string") parts.push(child);
    else if (typeof child === "number") parts.push(String(child));
    else if (React.isValidElement(child)) {
      const p = child.props as { children?: React.ReactNode };
      parts.push(extractText(p.children));
    }
  });
  return parts.join("");
}

// === TOC ===

interface TocItem { id: string; text: string; level: number; children?: TocItem[]; }

function buildTocTree(items: TocItem[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];
  for (const item of items) {
    const node = { ...item, children: [] as TocItem[] };
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) stack.pop();
    if (stack.length === 0) root.push(node);
    else { const p = stack[stack.length - 1]; if (!p.children) p.children = []; p.children.push(node); }
    stack.push(node);
  }
  return root;
}

// === 関連問題パネル ===

function RelatedQuestions({
  kpName,
  allQuestions,
}: {
  kpName: string;
  allQuestions: Question[];
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const years = KP_YEAR_MAP[kpName] || [];
  const related = allQuestions.filter(
    (q) => q.subject === "结构力学" && years.includes(q.year)
  );

  if (related.length === 0) return null;

  return (
    <div className="mt-3 ml-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
          📝 関連過去問 ({related.length}問)
        </span>
      </div>
      <div className="space-y-2">
        {related.map((q) => {
          const key = `${kpName}-${q.year}`;
          const preview =
            q.content.length > 200 ? q.content.slice(0, 200) + "..." : q.content;

          return (
            <details
              key={key}
              open={openMap[key] || false}
              onToggle={(e) =>
                setOpenMap((prev) => ({
                  ...prev,
                  [key]: (e.target as HTMLDetailsElement).open,
                }))
              }
              className="group border border-gray-200 rounded-lg overflow-hidden"
            >
              <summary className="flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors select-none">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-900 text-white text-[10px] font-bold">
                    {q.question_number}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {q.subject}
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{q.year}</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-medium">
                    {q.category}
                  </span>
                </div>
                <span className="text-gray-400 group-open:rotate-90 transition-transform text-xs">
                  ▶
                </span>
              </summary>
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed max-h-96 overflow-y-auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex]}
                    components={miniMarkdownComponents}
                  >
                    {preview}
                  </ReactMarkdown>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                  <Link
                    href={`/question/${allQuestions.indexOf(q)}`}
                    onClick={() =>
                      localStorage.setItem("questionReferrer", "/knowledge-map")
                    }
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    全文を見る →
                  </Link>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

// === メインコンポーネント ===

export default function KnowledgeMapClient({ content, questions }: Props) {
  const [activeId, setActiveId] = useState("");
  const [expandedToc, setExpandedToc] = useState<Record<string, boolean>>({});
  const [tocOpen, setTocOpen] = useState(true);

  // TOC構築
  const tocTree = useMemo(() => {
    const items: TocItem[] = [];
    for (const line of content.split("\n")) {
      const m = line.match(/^(#{1,3})\s+(.+)$/);
      if (m) items.push({ id: headingToId(m[2].trim()), text: m[2].trim(), level: m[1].length });
    }
    return buildTocTree(items);
  }, [content]);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    for (const line of content.split("\n")) {
      const m = line.match(/^#\s+(.+)$/);
      if (m) initial[headingToId(m[1].trim())] = true;
    }
    setExpandedToc(initial);
  }, [content]);

  // スクロール追跡
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 }
    );
    document.querySelectorAll("[id]").forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Markdownコンポーネント定義
  const components = useMemo(
    () => ({
      h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = extractText(children);
        return (
          <h1 {...props} id={headingToId(text)} className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            {children}
          </h1>
        );
      },
      h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = extractText(children);
        return (
          <h2 {...props} id={headingToId(text)} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {children}
          </h2>
        );
      },
      h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = extractText(children);
        const id = headingToId(text);
        const resources = RESOURCES[text] || [];
        const years = KP_YEAR_MAP[text] || [];
        const isKp = years.length > 0;

        return (
          <div>
            <h3 {...props} id={id} className="text-base font-semibold text-gray-800 mt-4 mb-2">
              {children}
            </h3>
            {isKp && resources.length > 0 && (
              <div className="flex gap-2 mb-2">
                {resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors">
                    {r.title}
                  </a>
                ))}
              </div>
            )}
            {isKp && <RelatedQuestions kpName={text} allQuestions={questions} />}
          </div>
        );
      },
      p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p {...props} className="mb-3 last:mb-0 leading-relaxed text-sm" />
      ),
      ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul {...props} className="list-disc pl-5 mb-3 space-y-1 text-sm" />
      ),
      ol: ({ ...props }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol {...props} className="list-decimal pl-5 mb-3 space-y-1 text-sm" />
      ),
      li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => (
        <li {...props} className="leading-relaxed text-sm" />
      ),
      table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-4">
          <table {...props} className="min-w-full text-sm border border-gray-200" />
        </div>
      ),
      thead: ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <thead {...props} className="bg-gray-100" />
      ),
      th: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th {...props} className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200" />
      ),
      td: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td {...props} className="px-3 py-2 border-b border-gray-100 text-sm" />
      ),
      pre: ({ ...props }: React.HTMLAttributes<HTMLPreElement>) => (
        <pre {...props} className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-3 text-sm" />
      ),
      code: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
        <code {...props} className="bg-gray-100 px-1.5 py-0.5 rounded text-sm" />
      ),
      blockquote: ({ ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4 text-sm" />
      ),
      hr: () => <hr className="my-6 border-gray-200" />,
      strong: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
        <strong {...props} className="font-semibold text-gray-900" />
      ),
    }),
    [questions]
  );

  // TOCツリーレンダリング
  const renderTocItems = (items: TocItem[]) =>
    items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedToc[item.id] !== false;
      return (
        <li key={item.id}>
          <div className="flex items-center">
            {hasChildren && (
              <button
                onClick={() => setExpandedToc((p) => ({ ...p, [item.id]: !p[item.id] }))}
                className="shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <span className={`text-[10px] transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                  ▶
                </span>
              </button>
            )}
            {!hasChildren && <span className="shrink-0 w-4" />}
            <button
              onClick={() => scrollTo(item.id)}
              className={`flex-1 text-left px-1.5 py-1 rounded-md text-xs transition-all hover:bg-gray-200 ${
                item.level === 1
                  ? "font-semibold text-gray-900"
                  : item.level === 2
                  ? "font-medium text-gray-700 pl-2"
                  : "text-gray-500 pl-4"
              } ${activeId === item.id ? "bg-blue-50 text-blue-700 font-medium" : ""}`}
            >
              {item.text}
            </button>
          </div>
          {hasChildren && isExpanded && (
            <ul className="ml-2 mt-0.5">{renderTocItems(item.children!)}</ul>
          )}
        </li>
      );
    });

  return (
    <div className="min-h-screen bg-white flex">
      {/* メインコンテンツ */}
      <div className="flex-1 min-w-0">
        <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-20">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← 問題一覧に戻る
          </Link>
          <span className="text-sm text-gray-500">構造力学 · 知識地図</span>
        </header>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={components}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* TOC */}
      <nav
        className={`${
          tocOpen ? "w-56" : "w-0"
        } shrink-0 border-l border-gray-200 bg-gray-50/50 h-screen sticky top-0 overflow-hidden transition-all duration-300 hidden lg:block`}
      >
        <div className="p-4 w-56">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">目次</h3>
            <button onClick={() => setTocOpen(false)} className="text-gray-400 hover:text-gray-600 text-xs">
              ✕
            </button>
          </div>
          <ul className="space-y-0.5">{renderTocItems(tocTree)}</ul>
        </div>
      </nav>

      {!tocOpen && (
        <button
          onClick={() => setTocOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 border border-gray-200 border-r-0 rounded-l-lg px-2 py-4 text-xs text-gray-500 transition-colors z-30 hidden lg:block"
        >
          📋
        </button>
      )}
    </div>
  );
}

// 折りたたみパネル内部で使う最小限のMarkdownコンポーネント
const miniMarkdownComponents = {
  p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="mb-2 last:mb-0 text-sm" />
  ),
  img: ({ ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} className="max-w-full h-auto rounded my-2" alt={props.alt || ""} />
  ),
};
