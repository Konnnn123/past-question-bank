"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { SidebarLayout, TocPanel } from "@/components/layout";
import OriginalLanguage from "@/components/OriginalLanguage";
import type { TocNode } from "@/types/layout";
import { ALL_BUILDINGS } from "@/lib/architecture-data";
import type { BuildingCard } from "@/lib/architecture-data";
import { getCardById } from "@/lib/history-card-utils";

interface Props {
  buildingCardMap: Record<string, { buildingId: string; learningCardIds: string[] }>;
}

// ============================================================
// 时间轴数据：世纪 × 文化圈 二维矩阵（已迁移至 /timeline 页面）
// ============================================================

// ============================================================
// 工具函数
// ============================================================

function buildTocTree(items: TocNode[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: TocNode[] = [];
  for (const item of items) {
    const node = { ...item, children: [] as TocNode[] };
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level)
      stack.pop();
    if (stack.length === 0) root.push(node);
    else {
      const p = stack[stack.length - 1];
      if (!p.children) p.children = [];
      p.children.push(node);
    }
    stack.push(node);
  }
  return root;
}

// ============================================================
// 主组件
// ============================================================

export default function ArchitectureCardsClient({ buildingCardMap }: Props) {
  const [activeTab] = useState<"cards">("cards");
  const [selectedCard, setSelectedCard] = useState<BuildingCard | null>(null);
  const [lang, setLang] = useState<"ja" | "zh">("ja");
  const [cardFilter, setCardFilter] = useState<"all" | "western" | "east-asian">(
    "all"
  );
  const [importanceFilter, setImportanceFilter] = useState<"all" | 2 | 3>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = useCallback((idx: number) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const tocTree = useMemo(() => {
    const items: TocNode[] = [
      { id: "cards", text: lang === "ja" ? "建築カード" : "建筑卡片", level: 1 },
    ];
    return buildTocTree(items);
  }, [lang]);

  return (
    <SidebarLayout
      slot={
        <div className="flex flex-col h-full">
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => setLang("ja")}
              className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                lang === "ja"
                  ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              日本語
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
                lang === "zh"
                  ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              中文
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <TocPanel tree={tocTree} activeId={activeTab} />
          </div>
        </div>
      }
    >
      <div>
        <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-20">
          <Link
            href="/explore"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            {lang === "ja" ? "← 探索に戻る" : "← 返回探索"}
          </Link>
          <span className="text-sm text-gray-500">
            {lang === "ja"
              ? "建築史 · 時間軸 & カード"
              : "建筑史 · 时间轴 & 卡片"}
          </span>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* ==================== CARDS TAB ==================== */}
            <div>
              <Link href="/history/essay-framework#recall" className="mb-6 flex flex-col gap-1 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-violet-950 transition hover:border-violet-400 hover:bg-violet-100 sm:flex-row sm:items-center sm:justify-between">
                <span><strong>{lang === "ja" ? "論述用の事例想起は専門2-2へ" : "论述案例回忆已移至专门2-2"}</strong><span className="mt-1 block text-xs text-violet-700">{lang === "ja" ? "過去問9件をテーマ別に抽出し、Track A／Bへ進む" : "按主题抽取9个过去问案例，再进入 Track A／B"}</span></span>
                <span className="text-sm font-black">{lang === "ja" ? "想起を始める →" : "开始回忆 →"}</span>
              </Link>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {lang === "ja"
                  ? "建築カード（Architectural Flashcards）"
                  : "建筑卡片（Architectural Flashcards）"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {lang === "ja"
                  ? "構造・空間・歴史の3軸で建築物を分析。カードをクリックして展開。"
                  : "从构造、空间、历史三轴分析建筑。点击卡片展开。"}
              </p>

              {/* Filters */}
              <div className="space-y-3 mb-6">
                {/* Region */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-16">
                    {lang === "ja" ? "地域:" : "地区:"}
                  </span>
                  <div className="flex gap-1.5">
                    {[
                      { key: "all", label: lang === "ja" ? "すべて" : "全部" },
                      { key: "western", label: lang === "ja" ? "西洋" : "西方" },
                      { key: "east-asian", label: lang === "ja" ? "東アジア" : "东亚" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setCardFilter(f.key as "all" | "western" | "east-asian")}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          cardFilter === f.key
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Importance */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-16">
                    {lang === "ja" ? "重要度:" : "重要度:"}
                  </span>
                  <div className="flex gap-1.5">
                    {[
                      { key: "all", label: lang === "ja" ? "すべて" : "全部" },
                      { key: "3", label: "⭐⭐⭐" },
                      { key: "2", label: "⭐⭐" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setImportanceFilter(f.key === "all" ? "all" : parseInt(f.key) as 2 | 3)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          String(importanceFilter) === f.key
                            ? "bg-amber-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Type */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 w-16">
                    {lang === "ja" ? "類型:" : "类型:"}
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { key: "all", label: lang === "ja" ? "すべて" : "全部" },
                      { key: "temple", label: lang === "ja" ? "神社・寺院" : "神社·寺院" },
                      { key: "cathedral", label: lang === "ja" ? "大聖堂" : "大教堂" },
                      { key: "palace", label: lang === "ja" ? "宮殿・城" : "宫殿·城" },
                      { key: "civic", label: lang === "ja" ? "公共建築" : "公共建筑" },
                      { key: "residence", label: lang === "ja" ? "住宅" : "住宅" },
                      { key: "monument", label: lang === "ja" ? "記念物" : "纪念物" },
                      { key: "other", label: lang === "ja" ? "その他" : "其他" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setTypeFilter(f.key)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          typeFilter === f.key
                            ? "bg-teal-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Single card detail view */}
              {selectedCard && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div><h3 className="text-lg font-bold text-gray-900">
                      [{lang === "ja" ? selectedCard.name : selectedCard.nameZh}]
                    </h3>{lang === "ja" && <OriginalLanguage term={selectedCard.name} />}</div>
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      {lang === "ja" ? "閉じる" : "关闭"} x
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-sm font-bold text-blue-700 mb-1">
                        {lang === "ja"
                          ? "構造与構法 (Structure & Construction)"
                          : "结构与构法 (Structure & Construction)"}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {lang === "ja"
                          ? selectedCard.structure
                          : selectedCard.structureZh}
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-sm font-bold text-green-700 mb-1">
                        {lang === "ja"
                          ? "空間与平面 (Space & Plan)"
                          : "空间与平面 (Space & Plan)"}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {lang === "ja"
                          ? selectedCard.space
                          : selectedCard.spaceZh}
                      </p>
                    </div>
                    <div className="border-l-4 border-amber-500 pl-4">
                      <h4 className="text-sm font-bold text-amber-700 mb-1">
                        {lang === "ja"
                          ? "歴史与文化 (History, Culture & Society)"
                          : "历史与文化 (History, Culture & Society)"}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {lang === "ja"
                          ? selectedCard.history
                          : selectedCard.historyZh}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsible Card List */}
              <div className="space-y-3">
                {ALL_BUILDINGS.map((b, idx) => {
                  const isExpanded = expandedCards.has(idx);
                  const isWestern = b.region === "western";

                  // All filters
                  if (cardFilter === "western" && !isWestern) return null;
                  if (cardFilter === "east-asian" && isWestern) return null;
                  if (importanceFilter !== "all" && b.importance !== importanceFilter) return null;
                  if (typeFilter !== "all" && b.type !== typeFilter) return null;

                  return (
                    <div
                      key={b.name + idx}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleCard(idx)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              isWestern
                                ? "bg-blue-50 text-blue-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {isWestern
                              ? lang === "ja" ? "西洋" : "西方"
                              : lang === "ja" ? "東アジア" : "东亚"}
                          </span>
                          <span className="text-base font-bold text-gray-900">
                            [{lang === "ja" ? b.name : b.nameZh}]
                            {lang === "ja" && <OriginalLanguage term={b.name} variant="inline" className="ml-1" />}
                          </span>
                          {b.importance === 3 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                              {lang === "ja" ? "重要" : "重要"}
                            </span>
                          )}
                          {b.examFrequency && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">
                              {b.examFrequency}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {lang === "ja" ? b.location : b.locationZh} / {b.year}
                          </span>
                          <span className="text-gray-400 text-lg">
                            {isExpanded ? "-" : "+"}
                          </span>
                        </div>
                      </button>

                      {/* Tags */}
                      <div className="px-5 pb-2 flex flex-wrap gap-1">
                        {(lang === "ja" ? b.tags : b.tagsZh).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
                          {b.structure ? (
                            <>
                              <div className="border-l-4 border-blue-500 pl-4 mt-4">
                                <h4 className="text-sm font-bold text-blue-700 mb-1">
                                  {lang === "ja" ? "構造与構法" : "结构与构法"}
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {lang === "ja" ? b.structure : b.structureZh}
                                </p>
                              </div>
                              <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="text-sm font-bold text-green-700 mb-1">
                                  {lang === "ja" ? "空間与平面" : "空间与平面"}
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {lang === "ja" ? b.space : b.spaceZh}
                                </p>
                              </div>
                              <div className="border-l-4 border-amber-500 pl-4">
                                <h4 className="text-sm font-bold text-amber-700 mb-1">
                                  {lang === "ja" ? "歴史与文化" : "历史与文化"}
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {lang === "ja" ? b.history : b.historyZh}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-500 italic">
                                {lang === "ja"
                                  ? `詳細カードは準備中です。時間-類型軸の該当建築をクリックすると基本情報を確認できます。`
                                  : `详细卡片准备中。点击时间-类型轴中的对应建筑可查看基本信息。`}
                              </p>
                              <div className="mt-2 text-xs text-gray-400">
                                {lang === "ja" ? b.location : b.locationZh} / {b.year}
                                {b.examFrequency && ` / ${b.examFrequency}`}
                              </div>
                            </div>
                          )}

                          {/* Related learning cards */}
                          {buildingCardMap[b.name] && buildingCardMap[b.name].learningCardIds.length > 0 && (
                            <div className="pt-3 border-t border-gray-100">
                              <h4 className="text-xs font-medium text-indigo-600 mb-2">
                                {lang === "ja" ? "🎴 建築様式・運動カード" : "🎴 建筑样式·运动卡片"}
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {buildingCardMap[b.name].learningCardIds.map((cid) => {
                                  const card = getCardById(cid);
                                  if (!card) return null;
                                  const kindBadge =
                                    card.kind === "style" ? (lang === "ja" ? "様式" : "样式")
                                    : card.kind === "movement" ? (lang === "ja" ? "運動" : "运动")
                                    : card.kind === "architect" ? (lang === "ja" ? "建築家" : "建筑家")
                                    : (lang === "ja" ? "類型" : "类型");
                                  return (
                                    <Link
                                      key={cid}
                                      href={`/history#${cid}`}
                                      className="text-[11px] px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                    >
                                      <span className="text-[10px] text-indigo-400 mr-1">[{kindBadge}]</span>
                                      {lang === "ja" ? card.name.ja : card.name.zh}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
