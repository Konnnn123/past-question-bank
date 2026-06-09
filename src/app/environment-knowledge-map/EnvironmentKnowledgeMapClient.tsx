"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { SidebarLayout, TocPanel } from "@/components/layout";
import type { TocNode } from "@/types/layout";

interface Props {
  content: string;
}

// === ユーティリティ ===

// セクションごとにユニークなIDを生成するためのカウンター
let headingCounter = 0;

function headingToId(text: string, level: number): string {
  // 絵文字や記号を除去し、テキスト部分のみを取得
  const cleanText = text
    .replace(/[1-7️⃣⭐📊📚🔑]/g, "")
    .replace(/^\d+[\.\s]+/, "")
    .replace(/[（）()・\s]+/g, "-")
    .replace(/[^a-zA-Z0-9　-鿿]/g, "")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // レベルとカウンターでユニークなIDを生成
  return `h${level}-${cleanText}-${headingCounter++}`;
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

// テキストからIDを生成（TOC用）
function textToId(text: string, level: number, index: number): string {
  const cleanText = text
    .replace(/[1-7️⃣⭐📊📚🔑]/g, "")
    .replace(/^\d+[\.\s]+/, "")
    .replace(/[（）()・\s]+/g, "-")
    .replace(/[^a-zA-Z0-9　-鿿]/g, "")
    .toLowerCase()
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `h${level}-${cleanText}-${index}`;
}

// === メインコンポーネント ===

export default function EnvironmentKnowledgeMapClient({ content }: Props) {
  const [activeId, setActiveId] = useState("");

  // TOC構築（IDのカウンターをリセット）
  const tocTree = useMemo(() => {
    headingCounter = 0;
    const items: TocNode[] = [];
    let index = 0;
    for (const line of content.split("\n")) {
      const m = line.match(/^(#{1,3})\s+(.+)$/);
      if (m) {
        const level = m[1].length;
        const text = m[2].trim();
        const id = textToId(text, level, index);
        items.push({ id, text, level });
        index++;
      }
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

  // Markdownコンポーネント定義（IDを一貫させるため）
  const headingIds = useMemo(() => {
    const ids: Record<string, string> = {};
    let index = 0;
    for (const line of content.split("\n")) {
      const m = line.match(/^(#{1,3})\s+(.+)$/);
      if (m) {
        const level = m[1].length;
        const text = m[2].trim();
        ids[text] = textToId(text, level, index);
        index++;
      }
    }
    return ids;
  }, [content]);

  const components = useMemo(
    () => ({
      h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = extractText(children);
        const id = headingIds[text] || textToId(text, 1, 0);
        return (
          <h1 {...props} id={id} className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
            {children}
          </h1>
        );
      },
      h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = extractText(children);
        const id = headingIds[text] || textToId(text, 2, 0);
        return (
          <h2 {...props} id={id} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {children}
          </h2>
        );
      },
      h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
        const text = extractText(children);
        const id = headingIds[text] || textToId(text, 3, 0);

        return (
          <div>
            <h3 {...props} id={id} className="text-base font-semibold text-gray-800 mt-4 mb-2">
              {children}
            </h3>
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
        <blockquote {...props} className="border-l-4 border-teal-300 pl-4 italic text-gray-600 my-4 text-sm" />
      ),
      hr: () => <hr className="my-6 border-gray-200" />,
      strong: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
        <strong {...props} className="font-semibold text-gray-900" />
      ),
    }),
    [headingIds]
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
          <span className="text-sm text-gray-500">建築環境工学 · 知識地図</span>
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
