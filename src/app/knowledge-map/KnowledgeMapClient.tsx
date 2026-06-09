"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { SidebarLayout, TocPanel } from "@/components/layout";
import type { Question } from "@/types/question";
import type { TocNode } from "@/types/layout";

interface Props {
  content: string;
  questions: Question[];
}

// === データ定義 ===

const KP_YEAR_MAP: Record<string, number[]> = {
  "断面2次モーメント（I）": [2013, 2014, 2024],
  "せん断力と曲げモーメント": [2013, 2016, 2017, 2018, 2019, 2024, 2025],
  "支点反力の計算": [2016, 2017, 2018, 2022, 2025, 2026],
  "トラス構造": [2022, 2026],
  "たわみ角法": [2019],
  "オイラー座屈": [2022],
  "熱応力と熱変形": [2015, 2025],
  "塑性解析": [2014],
  // 追加の知識ポイント
  "仮想仕事の原理（単位外力法）": [2013, 2016, 2017, 2018, 2024, 2025, 2026],
  "固定モーメント法（Moment Distribution Method / Hardy Cross法）": [2016, 2017, 2019],
  "D値法（Portal Method の発展）": [2025],
  "剛性マトリクス法": [2024],
  "構造物の終局強度（崩壊メカニズム）": [2014],
  "不静定構造の基本": [2016, 2017, 2019],
  "仕事とエネルギー": [2013, 2015],
  "変形（たわみ）": [2013, 2016, 2017, 2018, 2024, 2025, 2026],
  "静定ラーメン": [2016, 2017, 2018],
  "断面の終局強度": [2014],
};

const RESOURCES: Record<string, { title: string; url: string }[]> = {
  "断面2次モーメント（I）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=断面2次モーメント+計算方法+建築構造" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=断面2次モーメント+構造力学" },
  ],
  "せん断力と曲げモーメント": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=SFD+BMD+描き方+建築構造力学+梁" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=せん断力図+曲げモーメント図+描き方+構造力学" },
  ],
  "支点反力の計算": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=支点反力+計算方法+ピン+ローラー+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=支点反力+構造力学+計算" },
  ],
  "トラス構造": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=トラス+節点法+截面法+内力計算+建築構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=トラス+節点法+構造力学" },
  ],
  "たわみ角法": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=たわみ角法+構造力学+節点方程式+建築構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=たわみ角法+構造力学+ラーメン解析" },
  ],
  "オイラー座屈": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=オイラー座屈+座屈荷重+建築構造力学+圧縮材" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=オイラー座屈+座屈荷重+構造力学" },
  ],
  "熱応力と熱変形": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=熱応力+熱膨張+構造力学+建築" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=熱応力+熱膨張+構造力学" },
  ],
  "塑性解析": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=塑性断面係数+塑性解析+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=塑性解析+構造力学" },
  ],
  "仮想仕事の原理（単位外力法）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=仮想仕事の原理+単位外力法+構造力学+変位計算" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=仮想仕事の原理+構造力学+単位外力法" },
  ],
  "固定モーメント法（Moment Distribution Method / Hardy Cross法）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=固定モーメント法+モーメント分配法+Hardy+Cross+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=固定モーメント法+モーメント分配法+構造力学" },
  ],
  "D値法（Portal Method の発展）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=D値法+建築構造力学+水平力+柱の剛性" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=D値法+ラーメン+地震力+構造力学" },
  ],
  "剛性マトリクス法": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=剛性マトリクス法+構造解析+全体剛性マトリクス+建築構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=剛性マトリクス法+構造解析+建築構造力学" },
  ],
  "構造物の終局強度（崩壊メカニズム）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=崩壊メカニズム+塑性ヒンジ+崩壊荷重+建築構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=崩壊メカニズム+塑性ヒンジ+構造力学" },
  ],
  "不静定構造の基本": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=不静定構造+力法+適合条件+構造力学+建築" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=不静定構造+力法+構造力学+解法" },
  ],
  "仕事とエネルギー": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=ひずみエネルギー+外力仕事+内力仕事+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=ひずみエネルギー+外力仕事+構造力学" },
  ],
  "変形（たわみ）": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=梁+たわみ+変形+構造力学+計算" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=梁+たわみ+変形+構造力学" },
  ],
  "静定ラーメン": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=ゲルバー梁+3ヒンジラーメン+静定ラーメン+構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=ゲルバー梁+構造力学+解析" },
  ],
  "断面の終局強度": [
    { title: "🔍 Google", url: "https://www.google.com/search?q=N-M相関曲線+終局強度+軸力+曲げモーメント+建築構造力学" },
    { title: "📺 YouTube", url: "https://www.youtube.com/results?search_query=N-M相関曲線+終局強度+構造力学" },
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

function buildTocTree(items: TocNode[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];
  for (const item of items) {
    const node = { ...item, children: [] as TocNode[] };
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

  // TOC構築（TocPanel に渡す TocNode[]）
  const tocTree = useMemo(() => {
    const items: TocNode[] = [];
    for (const line of content.split("\n")) {
      const m = line.match(/^(#{1,3})\s+(.+)$/);
      if (m) items.push({ id: headingToId(m[2].trim()), text: m[2].trim(), level: m[1].length });
    }
    return buildTocTree(items);
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

  // 将 TocPanel 注入到侧边栏
  const sidebarSlot = <TocPanel tree={tocTree} activeId={activeId} />;

  return (
    <SidebarLayout slot={sidebarSlot}>
      <div>
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
    </SidebarLayout>
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
