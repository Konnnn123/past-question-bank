"use client";

import React, { useState } from "react";
import type { TocPanelProps, TocNode } from "@/types/layout";

// ============================================================
// TOC Panel — 知识地图页面的目录面板
// ============================================================

export default function TocPanel({ tree, activeId }: TocPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  /** 切换单个节点展开/折叠 */
  const toggleNode = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /** 全展开 / 全折叠 */
  const toggleAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    const walk = (nodes: TocNode[]) => {
      for (const n of nodes) {
        if (n.children && n.children.length > 0) {
          next[n.id] = expand;
          walk(n.children);
        }
      }
    };
    walk(tree);
    setExpanded(next);
  };

  /** 滚动到指定锚点 */
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /** 递归渲染 TOC 节点 */
  const renderNodes = (nodes: TocNode[]): React.ReactElement[] =>
    nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isOpen = expanded[node.id] !== false;
      const cleanText = node.text.replace(/[1-7️⃣⭐📊📚🔑]/g, "").trim();

      return (
        <li key={node.id}>
          <div className="flex items-center">
            {hasChildren ? (
              <button
                onClick={() => toggleNode(node.id)}
                className="shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <span className={`text-[10px] transition-transform ${isOpen ? "rotate-90" : ""}`}>
                  ▶
                </span>
              </button>
            ) : (
              <span className="shrink-0 w-4" />
            )}
            <button
              onClick={() => scrollTo(node.id)}
              className={`flex-1 text-left px-1.5 py-1 rounded-md text-xs transition-all hover:bg-gray-200 ${
                node.level === 1
                  ? "font-semibold text-gray-900"
                  : node.level === 2
                  ? "font-medium text-gray-700 pl-2"
                  : "text-gray-500 pl-4"
              } ${activeId === node.id ? "bg-blue-50 text-blue-700 font-medium" : ""}`}
            >
              {cleanText}
            </button>
          </div>
          {hasChildren && isOpen && (
            <ul className="ml-2 mt-0.5">{renderNodes(node.children!)}</ul>
          )}
        </li>
      );
    });

  return (
    <div className="space-y-3">
      {/* 标题 + 折叠按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 tracking-wider">目次</h3>
      </div>

      {/* 全展开 / 全折叠 */}
      <div className="flex gap-2">
        <button
          onClick={() => toggleAll(true)}
          className="text-[10px] text-blue-600 hover:text-blue-800 transition-colors"
        >
          全展開
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => toggleAll(false)}
          className="text-[10px] text-blue-600 hover:text-blue-800 transition-colors"
        >
          全折畳
        </button>
      </div>

      {/* 目录树 */}
      <ul className="space-y-0.5">{renderNodes(tree)}</ul>
    </div>
  );
}
