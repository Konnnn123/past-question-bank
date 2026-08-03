"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SidebarLayout, TocPanel } from "@/components/layout";
import OriginalLanguage from "@/components/OriginalLanguage";
import OriginalLanguageText from "@/components/OriginalLanguageText";
import type { TocNode } from "@/types/layout";
import { getCardById } from "@/lib/history-card-utils";
import { getJapaneseBuildingChronology } from "@/lib/japanese-building-chronology";
import type { HistoryLearningCard } from "@/types/history-learning-card";

interface BuildingData {
  id: string;
  name: { ja: string; zh: string };
  aliases: string[];
  period: { ja: string; zh: string };
  location: { ja: string; zh: string };
  regions: string[];
  typeIds: string[];
  styleIds: string[];
  movementIds: string[];
  architectIds: string[];
  structure: { ja: string; zh: string };
  space: { ja: string; zh: string };
  history: { ja: string; zh: string };
  imageIds: string[];
  examEvidence: {
    year: number;
    category: string;
    questionNumber: string;
    fileName: string;
    relation: string;
    confidence?: "confirmed" | "candidate";
  }[];
  reviewStatus: string;
  rawAnki?: { style?: string; people?: string };
  normalizedStyleNames?: string[];
  normalizedPersonNames?: string[];
}

interface Props {
  building: BuildingData;
  learningCardIds: string[];
  imageFiles: string[];
}

function BuildingBackLink({ lang }: { lang: "ja" | "zh" }) {
  const searchParams = useSearchParams();
  const source = searchParams.get("from");
  const mode = searchParams.get("mode");
  const era = searchParams.get("era");

  let href = "/history";
  let label = lang === "ja" ? "学習カード一覧に戻る" : "返回学习卡列表";

  if (source === "library") {
    href = mode === "quiz" ? "/history/library?mode=quiz" : "/history/library";
    label = mode === "quiz"
      ? (lang === "ja" ? "画像チャレンジに戻る" : "返回看图挑战")
      : (lang === "ja" ? "建築ライブラリに戻る" : "返回建筑卡片库");
  } else if (source === "timeline") {
    href = era && /^[a-z0-9-]+$/i.test(era) ? `/timeline?era=${encodeURIComponent(era)}` : "/timeline";
    label = lang === "ja" ? "タイムラインに戻る" : "返回时间轴";
  } else if (source === "network") {
    href = "/history/network";
    label = lang === "ja" ? "関連ネットワークに戻る" : "返回关系网络";
  }

  return <Link href={href} className="text-sm text-gray-500 hover:text-gray-700">← {label}</Link>;
}

function DefaultBuildingBackLink({ lang }: { lang: "ja" | "zh" }) {
  return <Link href="/history" className="text-sm text-gray-500 hover:text-gray-700">← {lang === "ja" ? "学習カード一覧に戻る" : "返回学习卡列表"}</Link>;
}

export default function BuildingDetailClient({ building, learningCardIds, imageFiles }: Props) {
  const [lang, setLang] = useState<"ja" | "zh">("ja");

  const t = (ja: string, zh: string) => (lang === "ja" ? ja : zh);
  const has = (field: "history" | "structure" | "space") => building[field][lang].trim();

  const linkedCards = useMemo(() => {
    return learningCardIds
      .map((id) => getCardById(id))
      .filter(Boolean) as HistoryLearningCard[];
  }, [learningCardIds]);
  const chronology = getJapaneseBuildingChronology(building, lang);

  // Build TOC — only include sections that have content
  const tocNodes: TocNode[] = [
    { id: "overview", text: t("概要", "概要"), level: 1 },
    ...(imageFiles.length > 0 ? [{ id: "images", text: t("画像", "图片"), level: 1 }] : []),
    ...(has("history") ? [{ id: "history", text: t("来歴", "历史"), level: 1 }] : []),
    ...(has("structure") ? [{ id: "structure", text: t("構造", "结构"), level: 1 }] : []),
    ...(has("space") ? [{ id: "space", text: t("空間", "空间"), level: 1 }] : []),
    ...(linkedCards.length > 0 ? [{ id: "cards", text: t("学習カード", "学习卡"), level: 1 }] : []),
    ...(building.examEvidence.length > 0 ? [{ id: "exam", text: t("過去問", "真题"), level: 1 }] : []),
  ];

  return (
    <SidebarLayout slot={<TocPanel tree={tocNodes} />}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Language toggle + back link */}
        <div className="flex items-center justify-between mb-6">
          <Suspense fallback={<DefaultBuildingBackLink lang={lang} />}>
            <BuildingBackLink lang={lang} />
          </Suspense>
          <button
            onClick={() => setLang(lang === "ja" ? "zh" : "ja")}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {lang === "ja" ? "🇨🇳 中文" : "🇯🇵 日本語"}
          </button>
        </div>

        {/* Building name */}
        <h1 id="overview" className="text-2xl font-bold text-gray-900 mb-2">
          {t(building.name.ja, building.name.zh || building.name.ja)}
        </h1>
        {lang === "ja" && <OriginalLanguage term={building.name.ja} className="mb-3" />}

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
            {t(building.period.ja, building.period.zh || building.period.ja)}
          </span>
          {chronology && (
            <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700" title={t("西暦による年代・世紀", "公元纪年与世纪")}>
              {chronology}
            </span>
          )}
          {building.location.ja && (
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
              {t(building.location.ja, building.location.zh || building.location.ja)}
            </span>
          )}
          {building.regions.map((r) => (
            <span key={r} className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600">
              {r === "japan" ? t("日本", "日本") : r === "western" ? t("西洋", "西洋") : r === "global" ? t("世界", "全球") : r === "east-asian" ? t("東アジア", "东亚") : r}
            </span>
          ))}
          {building.reviewStatus === "needs-review" && (
            <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
              {t("要確認", "待确认")}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {building.normalizedStyleNames && building.normalizedStyleNames.length > 0 && building.normalizedStyleNames[0] !== "要確認" && (
            <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-600">
              {building.normalizedStyleNames.join(", ")}
            </span>
          )}
        </div>

        {/* Aliases */}
        {building.aliases.length > 0 && (
          <p className="text-sm text-gray-400 mb-6">
            AKA: {building.aliases.join(", ")}
          </p>
        )}

        {/* Images */}
        {imageFiles.length > 0 && (
          <section id="images" className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {imageFiles.map((file, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={`/architecture-images/${file}`}
                    alt={`${t(building.name.ja, building.name.zh || building.name.ja)} - ${i + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* History (always show — has content from Anki) */}
        {has("history") && (
          <section id="history" className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("来歴", "历史")}</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              <OriginalLanguageText text={t(building.history.ja, building.history.zh || building.history.ja)} enabled={lang === "ja"} />
            </p>
          </section>
        )}

        {/* Structure (only if has content) */}
        {has("structure") && (
          <section id="structure" className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("構造", "结构")}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              <OriginalLanguageText text={t(building.structure.ja, building.structure.zh || building.structure.ja)} enabled={lang === "ja"} />
            </p>
          </section>
        )}

        {/* Space (only if has content) */}
        {has("space") && (
          <section id="space" className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{t("空間", "空间")}</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              <OriginalLanguageText text={t(building.space.ja, building.space.zh || building.space.ja)} enabled={lang === "ja"} />
            </p>
          </section>
        )}

        {/* Linked learning cards */}
        {linkedCards.length > 0 && (
          <section id="cards" className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {t("関連学習カード", "关联学习卡")} ({linkedCards.length})
            </h2>
            <div className="space-y-2">
              {linkedCards.map((card) => (
                <Link
                  key={card.id}
                  href={`/history#${card.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono shrink-0">
                    {card.kind === "style" ? t("様式", "样式")
                    : card.kind === "movement" ? t("運動", "运动")
                    : card.kind === "architect" ? t("建築家", "建筑家")
                    : t("類型", "类型")}
                  </span>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-800">
                      {t(card.name.ja, card.name.zh)}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {t(card.summary.ja, card.summary.zh)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Exam evidence */}
        {building.examEvidence.length > 0 && (
          <section id="exam" className="mb-6">
            <h2 className="text-lg font-semibold text-red-700 mb-1">
              {t("過去問の考点", "真题考点")} ({building.examEvidence.length})
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              {t(
                "建築史の問題文・語群から抽出した出題証拠。",
                "从建筑史题干和语群中提取的真题证据。"
              )}
            </p>
            <div className="space-y-1">
              {building.examEvidence.map((ev, i) => (
                <div key={i} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-mono">
                    {ev.year}
                  </span>
                  <span>{ev.category} Q{ev.questionNumber}</span>
                  {ev.relation === "word-bank" && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">
                      {t("語群", "语群")}
                    </span>
                  )}
                  {ev.relation === "direct" && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {t("題干", "题干")}
                    </span>
                  )}
                  {ev.relation === "related" && (
                    <span className="text-xs text-gray-400">({t("関連", "相关")})</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </SidebarLayout>
  );
}
