"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { SidebarLayout, TocPanel } from "@/components/layout";
import OriginalLanguage from "@/components/OriginalLanguage";
import OriginalLanguageText from "@/components/OriginalLanguageText";
import type { TocNode } from "@/types/layout";
import type { HistoryLearningCard } from "@/types/history-learning-card";
import { getCardsByKind, getEnrichedCards, getCardById } from "@/lib/history-card-utils";
import { STYLE_COMPARISON_GROUPS, STYLE_TRANSITIONS } from "@/lib/style-evolution-data";
import type { PastExamQuestionMeta } from "@/lib/past-exam-question-meta";
import { URBAN_PLANNING_CARDS } from "@/lib/urban-planning-cards";

interface ExamEvidenceItem {
  year: number;
  category: string;
  questionNumber: string;
  fileName: string;
  relation: string;
  examTerm: string;
}

interface Props {
  buildingLinks: { buildingId: string; buildingNameJa: string; buildingNameEn: string; learningCardIds: string[] }[];
  cardExamEvidence: Record<string, ExamEvidenceItem[]>;
  examQuestionMeta: Record<string, PastExamQuestionMeta>;
  buildingImageMap: Record<string, string[]>;
}

type TabKind = "style" | "movement" | "architect" | "building-type" | "urban-planning";
type ViewMode = "cards" | "evolution" | "comparison";
type HistoryLanguage = "ja" | "zh" | "en";

const HISTORY_LANGUAGE_STORAGE_KEY = "history-language";
const UI_ENGLISH: Record<string, string> = {
  "探索に戻る": "Back to Explore", "建築史学習カード": "Architectural History Learning Cards",
  "カード": "Cards", "様式変化": "Style Evolution", "比較": "Compare",
  "カードを検索…": "Search cards…", "全地域": "All regions", "過去問のみ": "Exam questions only",
  "様式": "Styles", "運動": "Movements", "建築家": "Architects", "建築類型": "Building Types", "都市計画": "Urban Planning",
  "日本": "Japan", "西洋": "Western", "世界": "Global", "東アジア": "East Asia", "すべて": "All",
  "演化": "Evolution", "影響": "Influence", "反動・批判": "Reaction / Critique", "融合": "Synthesis", "相互交流": "Exchange",
  "継承": "Inherited", "変化": "Changed", "比較軸": "Comparison axis", "混同しやすい点": "Common confusion",
  "該当する比較グループがありません": "No comparison group matches the selected filter.", "該当するカードがありません": "No cards match the selected filters.",
  "監査済み": "Reviewed", "過去問": "Exam questions", "建築": "buildings", "形成背景": "Formation background",
  "特徴": "Characteristics", "構造的特徴": "Structural characteristics", "空間的特徴": "Spatial characteristics", "視覚的識別点": "Visual identification clues",
  "社会的背景": "Social background", "反発対象": "Reaction against", "原則": "Principles", "成果・影響": "Results and influence",
  "生涯概要": "Life overview", "設計理念": "Design principles", "反復的特徴": "Recurring characteristics", "職業段階": "Career phases",
  "機能的意義": "Functional significance", "変遷": "Evolution", "関連建築": "Related buildings", "折りたたむ": "Show less", "さらに表示": "Show all",
  "関連カード": "Related cards", "前身": "Predecessors", "後継": "Successors", "関連": "Related", "過去問の考点": "Exam focus",
  "題": "questions", "用語・知識確認": "Terminology and knowledge check", "語群の選択肢": "Word-bank option", "題干に直接出現": "Directly appears in the question", "このカードに関わる語：": "Terms related to this card: ",
  "該当する都市計画カードがありません": "No urban-planning cards match the selected filters.", "計画の論理": "Planning logic", "図面・写真の識別点": "Drawing and photo clues", "代表例": "Representative examples",
  "全カードは人物・年代・用語・因果関係・カード間リンクの内容監査済みです。「監査済み」は教材としての整合性確認を示し、各文が個別の一次資料で実証済みという意味ではありません。過去問表示は出題証拠のある項目だけに付与しています。": "All cards have been reviewed for people, dates, terminology, causal relationships, and links between cards. ‘Reviewed’ indicates a consistency check for this learning material; it does not mean that every statement has been independently verified against a primary source. Exam-question badges appear only where question evidence exists.",
};

type EnglishLocalizedText = { ja: string; zh: string; en: string };
const localizedKey = (ja: string, zh: string) => `${ja}\u0000${zh}`;

function collectEnglishText(value: unknown, target: Map<string, string>, visited = new Set<object>()) {
  if (!value || typeof value !== "object") return;
  if (visited.has(value as object)) return;
  visited.add(value as object);
  const record = value as Record<string, unknown>;
  if (typeof record.ja === "string" && typeof record.zh === "string" && typeof record.en === "string") {
    target.set(localizedKey(record.ja, record.zh), record.en);
  }
  for (const child of Object.values(record)) collectEnglishText(child, target, visited);
}

const TAB_LABELS: { kind: TabKind; ja: string; zh: string }[] = [
  { kind: "style", ja: "様式", zh: "样式" },
  { kind: "movement", ja: "運動", zh: "运动" },
  { kind: "architect", ja: "建築家", zh: "建筑家" },
  { kind: "building-type", ja: "建築類型", zh: "建筑类型" },
  { kind: "urban-planning", ja: "都市計画", zh: "都市计划" },
];

const REGION_OPTIONS = [
  { value: "japan", ja: "日本", zh: "日本" },
  { value: "western", ja: "西洋", zh: "西洋" },
  { value: "global", ja: "世界", zh: "全球" },
  { value: "east-asian", ja: "東アジア", zh: "东亚" },
];

export default function HistoryClient({ buildingLinks, cardExamEvidence, examQuestionMeta, buildingImageMap }: Props) {
  const [lang, setLang] = useState<"ja" | "zh" | "en">("ja");
  const [activeTab, setActiveTab] = useState<TabKind>("style");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [examOnly, setExamOnly] = useState(false);
  const [showAllBuildings, setShowAllBuildings] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [comparisonId, setComparisonId] = useState(STYLE_COMPARISON_GROUPS[0].id);
  const [relationRegion, setRelationRegion] = useState<"all" | "japan" | "western">("all");

  const enriched = useMemo(() => getEnrichedCards(buildingLinks), [buildingLinks]);
  const { styles, movements, architects, buildingTypes } = useMemo(() => getCardsByKind(), []);
  const englishText = useMemo(() => {
    const entries = new Map<string, string>();
    collectEnglishText(HISTORY_LEARNING_CARDS, entries);
    collectEnglishText(STYLE_TRANSITIONS, entries);
    collectEnglishText(STYLE_COMPARISON_GROUPS, entries);
    collectEnglishText(URBAN_PLANNING_CARDS, entries);
    return entries;
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(HISTORY_LANGUAGE_STORAGE_KEY);
    if (stored === "ja" || stored === "zh" || stored === "en") setLang(stored);
  }, []);

  // Track last handled hash to avoid repeated handling
  const lastHashRef = React.useRef("");

  // Handle URL hash: auto-expand and scroll to the target card
  React.useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (!hash || hash === lastHashRef.current) return;
      lastHashRef.current = hash;
      const clean = hash.replace("#", "");
      const targetCard = getCardById(clean);
      if (!targetCard) return;
      // Switch to the correct tab
      if (targetCard.kind === "style") setActiveTab("style");
      else if (targetCard.kind === "movement") setActiveTab("movement");
      else if (targetCard.kind === "architect") setActiveTab("architect");
      else if (targetCard.kind === "building-type") setActiveTab("building-type");
      // Expand the card
      setExpandedIds((prev) => new Set([...prev, clean]));
    };

    // Check immediately
    checkHash();

    // Poll for hash changes (Next.js client nav may not trigger hashchange)
    const interval = setInterval(checkHash, 300);
    window.addEventListener("hashchange", checkHash);
    return () => {
      clearInterval(interval);
      window.removeEventListener("hashchange", checkHash);
    };
  }, []);

  // Scroll to target card after it's expanded and rendered
  React.useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const clean = hash.replace("#", "");
    if (expandedIds.has(clean)) {
      requestAnimationFrame(() => {
        const el = document.getElementById(clean);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }, [expandedIds]);

  const currentCards = useMemo(() => {
    let cards: HistoryLearningCard[] =
      activeTab === "style" ? styles
      : activeTab === "movement" ? movements
      : activeTab === "architect" ? architects
      : activeTab === "building-type" ? buildingTypes
      : [];

    if (regionFilter !== "all") {
      cards = cards.filter((c) => c.regions.includes(regionFilter));
    }
    if (examOnly) {
      cards = cards.filter(
        (c) =>
          c.examEvidence.length > 0 ||
          (cardExamEvidence[c.id] && cardExamEvidence[c.id].length > 0)
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.name.ja.toLowerCase().includes(q) ||
          c.name.zh.toLowerCase().includes(q) ||
          c.aliases.some((a) => a.toLowerCase().includes(q)) ||
          c.keywords.some((k) => (lang === "ja" ? k.ja : k.zh).toLowerCase().includes(q))
      );
    }
    return cards;
  }, [activeTab, regionFilter, searchQuery, styles, movements, architects, buildingTypes, lang, examOnly, cardExamEvidence]);

  const currentUrbanCards = useMemo(() => {
    if (activeTab !== "urban-planning") return [];
    let cards = URBAN_PLANNING_CARDS;
    if (regionFilter !== "all") cards = cards.filter((card) => card.regions.includes(regionFilter));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter((card) =>
        card.name.ja.toLowerCase().includes(q) || card.name.zh.toLowerCase().includes(q) ||
        card.cases.some((item) => item.nameJa.toLowerCase().includes(q) || item.nameZh.toLowerCase().includes(q))
      );
    }
    return examOnly ? [] : cards;
  }, [activeTab, regionFilter, searchQuery, examOnly]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const t = (ja: string, zh: string) => {
    if (lang === "ja") return ja;
    if (lang === "zh") return zh;
    return englishText.get(localizedKey(ja, zh)) ?? UI_ENGLISH[ja] ?? "English text unavailable";
  };
  const changeLanguage = (next: HistoryLanguage) => {
    setLang(next);
    window.localStorage.setItem(HISTORY_LANGUAGE_STORAGE_KEY, next);
  };
  const cardMatchesRelationRegion = (id: string) => {
    if (relationRegion === "all") return true;
    const card = getCardById(id);
    if (!card) return false;
    if (relationRegion === "japan") return card.regions.includes("japan");
    return !card.regions.includes("japan") && (card.regions.includes("western") || card.regions.includes("global"));
  };
  const visibleTransitions = STYLE_TRANSITIONS.filter((item) => (item.fromIds ?? [item.from]).every(cardMatchesRelationRegion) && cardMatchesRelationRegion(item.to));
  const visibleComparisonGroups = STYLE_COMPARISON_GROUPS.filter((group) => {
    if (relationRegion === "all") return true;
    if (relationRegion === "japan") return group.cardIds.some((id) => getCardById(id)?.regions.includes("japan"));
    return group.cardIds.every((id) => {
      const card = getCardById(id);
      return card && !card.regions.includes("japan") && (card.regions.includes("western") || card.regions.includes("global"));
    });
  });

  // Build TOC
  const tocNodes: TocNode[] = viewMode === "cards" ? (activeTab === "urban-planning" ? currentUrbanCards : currentCards).map((c) => ({
    id: c.id,
    text: t(c.name.ja, c.name.zh),
    level: 1,
  })) : [];

  return (
    <SidebarLayout
      slot={<TocPanel tree={tocNodes} />}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/explore" className="mb-2 inline-flex text-sm text-gray-500 hover:text-indigo-700">← {t("探索に戻る", "返回探索")}</Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("建築史学習カード", "建筑史学习卡")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/history/lineage" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
              {t("人物谱系", "人物谱系")}
            </Link>
            <button
              onClick={() => changeLanguage(lang === "ja" ? "zh" : lang === "zh" ? "en" : "ja")}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              {lang === "ja" ? "🇨🇳 中文" : lang === "zh" ? "🇬🇧 English" : "🇯🇵 Japanese"}
            </button>
          </div>
        </div>

        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-800">
          {t(
            "全カードは人物・年代・用語・因果関係・カード間リンクの内容監査済みです。「監査済み」は教材としての整合性確認を示し、各文が個別の一次資料で実証済みという意味ではありません。過去問表示は出題証拠のある項目だけに付与しています。",
            "全部卡片已经完成人物、年代、术语、因果关系和卡片链接审查。“已审查”表示教材层面的内容与关系检查，不代表每句话都具有单独的一手文献证明；真题标记只用于存在题目证据的内容。"
          )}
        </div>

        <div className="mb-5 flex rounded-xl border border-gray-200 bg-white p-1">
          {([['cards','カード','卡片'],['evolution','様式変化','样式变化'],['comparison','比較','比较']] as const).map(([mode, ja, zh]) => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${viewMode === mode ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{t(ja, zh)}</button>
          ))}
        </div>

        {viewMode !== "cards" && (
          <div className="mb-5 flex items-center justify-center gap-2">
            {([['all','すべて','全部'],['japan','日本','日本'],['western','西洋','西洋']] as const).map(([region, ja, zh]) => (
              <button key={region} onClick={() => setRelationRegion(region)} className={`rounded-full border px-4 py-1.5 text-xs font-medium ${relationRegion === region ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-500'}`}>{t(ja,zh)}</button>
            ))}
          </div>
        )}

        {/* Search + Region Filter + Exam Toggle */}
        <div className={`flex gap-3 mb-4 flex-wrap ${viewMode !== "cards" ? "hidden" : ""}`}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("カードを検索…", "搜索卡片…")}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="all">{t("全地域", "全部地区")}</option>
            {REGION_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {t(r.ja, r.zh)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setExamOnly(!examOnly)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
              examOnly
                ? "bg-red-50 text-red-700 border-red-300"
                : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t("過去問のみ", "仅真题")} {examOnly ? "✓" : ""}
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 mb-6 border-b border-gray-200 ${viewMode !== "cards" ? "hidden" : ""}`}>
          {TAB_LABELS.map((tab) => (
            <button
              key={tab.kind}
              onClick={() => setActiveTab(tab.kind)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.kind
                  ? "bg-white text-gray-900 border border-gray-200 border-b-white -mb-px"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t(tab.ja, tab.zh)}
              <span className="ml-1.5 text-xs text-gray-400">
                {tab.kind === "style" ? styles.length
                : tab.kind === "movement" ? movements.length
                : tab.kind === "architect" ? architects.length
                : tab.kind === "building-type" ? buildingTypes.length
                : URBAN_PLANNING_CARDS.length}
              </span>
            </button>
          ))}
        </div>

        {viewMode === "evolution" && (
          <div className="space-y-4">
            <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-5">
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700">━▶ {t("演化", "演化")}</span><span className="rounded-lg bg-violet-50 px-3 py-2 text-violet-700">┄▶ {t("影響", "影响")}</span><span className="rounded-lg bg-red-50 px-3 py-2 text-red-700">◀━ {t("反動・批判", "反动或批判")}</span><span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">┬▶ {t("融合", "融合")}</span><span className="rounded-lg bg-gray-100 px-3 py-2 text-gray-600">◀┄▶ {t("相互交流", "相互交流")}</span>
            </div>
            {visibleTransitions.map((transition, index) => {
              const sources = (transition.fromIds ?? [transition.from]).map(getCardById).filter(Boolean) as HistoryLearningCard[]; const to = getCardById(transition.to);
              if (sources.length === 0 || !to) return null;
              const relationMeta = transition.relation === "evolution" ? {label:t("演化","演化"), symbol:"━▶", line:"border-blue-500", text:"text-blue-700", badge:"bg-blue-50"} : transition.relation === "influence" ? {label:t("影響","影响"), symbol:"┄▶", line:"border-violet-500 border-dashed", text:"text-violet-700", badge:"bg-violet-50"} : transition.relation === "reaction" ? {label:t("反動・批判","反动或批判"), symbol:"◀━", line:"border-red-500", text:"text-red-700", badge:"bg-red-50"} : transition.relation === "exchange" ? {label:t("相互交流","相互交流"), symbol:"◀┄▶", line:"border-gray-500 border-dashed", text:"text-gray-700", badge:"bg-gray-100"} : {label:t("融合","融合"), symbol:"┬▶", line:"border-emerald-500", text:"text-emerald-700", badge:"bg-emerald-50"};
              return <article key={`${transition.from}-${transition.to}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <div className="flex min-w-[150px] flex-col gap-1.5">{sources.map(from=><button key={from.id} onClick={() => {setViewMode("cards"); setActiveTab(from.kind); setExpandedIds(new Set([from.id])); window.location.hash=from.id;}} className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100">{t(from.name.ja,from.name.zh)}</button>)}</div>
                  <div className="flex-1 text-center"><span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${relationMeta.badge} ${relationMeta.text}`}>{relationMeta.label}</span><div className={`mx-auto my-2 w-4/5 border-t-2 ${relationMeta.line}`}></div><div className={`text-xl ${relationMeta.text}`}>{relationMeta.symbol}</div><p className="mt-1 text-xs text-gray-500">{t(transition.cause.ja,transition.cause.zh)}</p></div>
                  <button onClick={() => {setViewMode("cards"); setActiveTab(to.kind); setExpandedIds(new Set([to.id])); window.location.hash=to.id;}} className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800">{t(to.name.ja,to.name.zh)}</button>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800"><b>{t("継承","继承")}：</b>{transition.inherited.map(x=>t(x.ja,x.zh)).join("；")}</div><div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-800"><b>{t("変化","变化")}：</b>{transition.changed.map(x=>t(x.ja,x.zh)).join("；")}</div></div>
              </article>;
            })}
          </div>
        )}

        {viewMode === "comparison" && (() => {
          const group = visibleComparisonGroups.find(x=>x.id===comparisonId) ?? visibleComparisonGroups[0];
          if (!group) return <p className="py-12 text-center text-sm text-gray-400">{t("該当する比較グループがありません","没有符合条件的比较组")}</p>;
          return <div><div className="mb-4 flex gap-2 overflow-x-auto pb-2">{visibleComparisonGroups.map(item=><button key={item.id} onClick={()=>setComparisonId(item.id)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${group.id===item.id?'border-indigo-500 bg-indigo-50 text-indigo-700':'border-gray-200 bg-white text-gray-600'}`}>{t(item.title.ja,item.title.zh)}</button>)}</div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="border-b p-4"><h2 className="font-bold">{t(group.title.ja,group.title.zh)}</h2><p className="mt-1 text-sm text-gray-500">{t(group.description.ja,group.description.zh)}</p></div><div className="overflow-x-auto"><table className="min-w-[700px] w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-left text-xs text-gray-500">{t("比較軸","比较维度")}</th>{group.cardIds.map(id=>{const c=getCardById(id);return <th key={id} className="p-3 text-left text-indigo-700">{c?t(c.name.ja,c.name.zh):id}</th>})}</tr></thead><tbody>{group.axes.map(row=><tr key={row.label.ja} className="border-t"><th className="bg-gray-50 p-3 text-left text-xs">{t(row.label.ja,row.label.zh)}</th>{group.cardIds.map(id=><td key={id} className="p-3 align-top">{row.values[id]?t(row.values[id].ja,row.values[id].zh):"—"}</td>)}</tr>)}</tbody></table></div><div className="border-t border-amber-200 bg-amber-50 p-4"><b className="text-xs text-amber-800">{t("混同しやすい点","容易混淆点")}</b>{group.confusion.map(x=><p key={x.ja} className="mt-1 text-sm text-amber-900">• {t(x.ja,x.zh)}</p>)}</div></div>
          </div>;
        })()}

        {viewMode === "cards" && activeTab === "urban-planning" && (
          <UrbanPlanningSection cards={currentUrbanCards} lang={lang} englishText={englishText} />
        )}

        {/* Card List */}
        <div className={`space-y-3 ${viewMode !== "cards" || activeTab === "urban-planning" ? "hidden" : ""}`}>
          {currentCards.length === 0 && (
            <p className="text-gray-400 text-center py-12">
              {t("該当するカードがありません", "没有匹配的卡片")}
            </p>
          )}
          {currentCards.map((card) => {
            const enrichment = enriched.get(card.id);
            const expanded = expandedIds.has(card.id);
            const isDraft = card.reviewStatus === "draft";
            // Merge exam evidence from card + external mapping
            const externalEvidence = cardExamEvidence[card.id] ?? [];
            const mergedEvidence = [
              ...card.examEvidence.map((e) => ({ ...e, examTerm: "" })),
              ...externalEvidence,
            ];
            // One exam question counts once in the headline; retain distinct
            // term/building paths below so the knowledge-network evidence is visible.
            const questionKeys = new Set(mergedEvidence.map((e) => `${e.year}-${e.category}-${e.questionNumber}`));
            const evidenceByQuestion = new Map<string, { evidence: ExamEvidenceItem[]; terms: string[]; relations: string[] }>();
            for (const evidence of mergedEvidence) {
              const key = `${evidence.year}-${evidence.category}-${evidence.questionNumber}`;
              const group = evidenceByQuestion.get(key) ?? { evidence: [], terms: [], relations: [] };
              group.evidence.push(evidence);
              if (evidence.examTerm && !group.terms.includes(evidence.examTerm)) group.terms.push(evidence.examTerm);
              if (!group.relations.includes(evidence.relation)) group.relations.push(evidence.relation);
              evidenceByQuestion.set(key, group);
            }
            const questionEvidence = [...evidenceByQuestion.values()].sort((a, b) => b.evidence[0].year - a.evidence[0].year);
            const evidenceByMethod = new Map<string, { meta?: PastExamQuestionMeta; questions: typeof questionEvidence }>();
            for (const group of questionEvidence) {
              const meta = examQuestionMeta[group.evidence[0].fileName];
              const methodKey = meta?.typeJa ?? "用語・知識確認";
              const methodGroup = evidenceByMethod.get(methodKey) ?? { meta, questions: [] };
              methodGroup.questions.push(group);
              evidenceByMethod.set(methodKey, methodGroup);
            }
            const methodEvidence = [...evidenceByMethod.values()];
            const totalExamCount = questionKeys.size;

            return (
              <div
                key={card.id}
                id={card.id}
                className={`border rounded-xl overflow-hidden transition-shadow hover:shadow-sm ${
                  isDraft ? "border-amber-200 bg-amber-50/30" : "border-gray-200 bg-white"
                }`}
              >
                {/* Card header */}
                <button
                  onClick={() => toggleExpand(card.id)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900">
                        {t(card.name.ja, card.name.zh)}
                      </span>
                      {lang === "ja" && <OriginalLanguage term={card.name.ja} variant="inline" />}
                      {isDraft && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                          draft
                        </span>
                      )}
                      {!isDraft && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          {t("監査済み", "已审查")}
                        </span>
                      )}
                      {totalExamCount > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                          {t("過去問", "真题")} {totalExamCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      <OriginalLanguageText text={t(card.summary.ja, card.summary.zh)} enabled={lang === "ja"} />
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{t(card.period.ja, card.period.zh)}</span>
                      <span>·</span>
                      <span>
                        {enrichment ? `${enrichment.buildingCount} ${t("建築", "栋建筑")}` : "-"}
                      </span>
                      <span>·</span>
                      <span>{card.regions.map((r) => t(
                        r === "japan" ? "日本" : r === "western" ? "西洋" : r === "global" ? "世界" : r === "east-asian" ? "東アジア" : r
                      , r === "japan" ? "日本" : r === "western" ? "西洋" : r === "global" ? "全球" : r === "east-asian" ? "东亚" : r)).join(", ")}</span>
                    </div>
                  </div>
                  <span className={`text-gray-400 transition-transform mt-1 ${expanded ? "rotate-90" : ""}`}>
                    ▶
                  </span>
                </button>

                {/* Expanded detail */}
                {expanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                    {/* Keywords */}
                    {card.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {card.keywords.map((kw, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {t(kw.ja, kw.zh)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Style-specific fields */}
                    {card.kind === "style" && (
                      <>
                        {/* formationBackground: hide if identical to summary */}
                        {card.formationBackground &&
                          t(card.formationBackground.ja, card.formationBackground.zh) !==
                            t(card.summary.ja, card.summary.zh) && (
                          <DetailSection title={t("形成背景", "形成背景")} content={t(card.formationBackground.ja, card.formationBackground.zh)} />
                        )}
                        {/* Merge identical feature sections */}
                        {card.structuralFeatures &&
                          card.spatialFeatures &&
                          card.visualClues &&
                          JSON.stringify(card.structuralFeatures) === JSON.stringify(card.spatialFeatures) &&
                          JSON.stringify(card.structuralFeatures) === JSON.stringify(card.visualClues) ? (
                          <DetailList title={t("特徴", "特征")} items={card.structuralFeatures.map((f) => t(f.ja, f.zh))} />
                        ) : (
                          <>
                            {card.structuralFeatures && card.structuralFeatures.length > 0 && (
                              <DetailList title={t("構造的特徴", "结构特征")} items={card.structuralFeatures.map((f) => t(f.ja, f.zh))} />
                            )}
                            {card.spatialFeatures && card.spatialFeatures.length > 0 && (
                              <DetailList title={t("空間的特徴", "空间特征")} items={card.spatialFeatures.map((f) => t(f.ja, f.zh))} />
                            )}
                            {card.visualClues && card.visualClues.length > 0 && (
                              <DetailList title={t("視覚的識別点", "视觉识别点")} items={card.visualClues.map((f) => t(f.ja, f.zh))} />
                            )}
                          </>
                        )}
                      </>
                    )}

                    {/* Movement-specific fields */}
                    {card.kind === "movement" && (
                      <>
                        {card.socialBackground && card.socialBackground.length > 0 && (
                          <DetailList title={t("社会的背景", "社会背景")} items={card.socialBackground.map((f) => t(f.ja, f.zh))} />
                        )}
                        {card.reactionAgainst && card.reactionAgainst.length > 0 && (
                          <DetailList title={t("反発対象", "反对对象")} items={card.reactionAgainst.map((f) => t(f.ja, f.zh))} />
                        )}
                        {card.principles && card.principles.length > 0 && (
                          <DetailList title={t("原則", "原则")} items={card.principles.map((f) => t(f.ja, f.zh))} />
                        )}
                        {card.results && card.results.length > 0 && (
                          <DetailList title={t("成果・影響", "成果与影响")} items={card.results.map((f) => t(f.ja, f.zh))} />
                        )}
                      </>
                    )}

                    {/* Architect-specific fields */}
                    {card.kind === "architect" && (
                      <>
                        <DetailSection title={t("生涯概要", "生涯概要")} content={t(card.lifeSummary.ja, card.lifeSummary.zh)} />
                        {card.designPrinciples && card.designPrinciples.length > 0 && (
                          <DetailList title={t("設計理念", "设计理念")} items={card.designPrinciples.map((f) => t(f.ja, f.zh))} />
                        )}
                        {card.recurringFeatures && card.recurringFeatures.length > 0 && (
                          <DetailList title={t("反復的特徴", "重复出现的特征")} items={card.recurringFeatures.map((f) => t(f.ja, f.zh))} />
                        )}
                        {card.careerPhases && card.careerPhases.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">{t("職業段階", "职业阶段")}</h4>
                            <div className="space-y-2">
                              {card.careerPhases.map((phase, i) => (
                                <div key={i} className="pl-3 border-l-2 border-gray-200">
                                  <span className="text-sm font-medium text-gray-800">{t(phase.label.ja, phase.label.zh)}</span>
                                  <p className="text-sm text-gray-500">{t(phase.description.ja, phase.description.zh)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Building-type-specific fields */}
                    {card.kind === "building-type" && (
                      <>
                        <DetailSection title={t("機能的意義", "功能意义")} content={t(card.functionalPurpose.ja, card.functionalPurpose.zh)} />
                        {card.structuralFeatures && card.structuralFeatures.length > 0 && (
                          <DetailList title={t("構造的特徴", "结构特征")} items={card.structuralFeatures.map((f) => t(f.ja, f.zh))} />
                        )}
                        {card.evolution && card.evolution.length > 0 && (
                          <DetailList title={t("変遷", "演变")} items={card.evolution.map((f) => t(f.ja, f.zh))} />
                        )}
                      </>
                    )}

                    {/* Linked buildings */}
                    {enrichment && enrichment.buildings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {t("関連建築", "关联建筑")} ({enrichment.buildingCount})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {(showAllBuildings.has(card.id)
                            ? enrichment.buildings
                            : enrichment.buildings.slice(0, 12)
                          ).map((b) => {
                            const images = buildingImageMap[b.id];
                            const thumb = images?.[0];
                            const nameEn = b.en;
                            const buildingName = lang === "en" ? nameEn : b.ja;
                            return (
                              <Link
                                key={b.id}
                                href={`/history/buildings/${b.id}?from=history`}
                                className="group flex items-center gap-2 p-1.5 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                              >
                                {thumb ? (
                                  <img
                                    src={`/architecture-images/${thumb}`}
                                    alt={buildingName}
                                    className="w-10 h-10 rounded object-cover shrink-0 bg-gray-100"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-xs">
                                    🏛
                                  </div>
                                )}
                                <span className="text-xs text-gray-700 group-hover:text-blue-700 leading-tight line-clamp-2">
                                  {buildingName}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        {enrichment.buildings.length > 12 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAllBuildings((prev) => {
                                const next = new Set(prev);
                                if (next.has(card.id)) next.delete(card.id);
                                else next.add(card.id);
                                return next;
                              });
                            }}
                            className="mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {showAllBuildings.has(card.id)
                              ? t("折りたたむ", "收起")
                              : `${t("さらに表示", "展开全部")} (+${enrichment.buildings.length - 12})`}
                          </button>
                        )}
                      </div>
                    )}
                    {card.kind === "architect" && (!enrichment || enrichment.buildings.length === 0) && (
                      <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                        {t("この建築家の作品は、現在の建築データベースにはまだ収録されていません。", "该建筑家的作品尚未收录到当前建筑数据库。")}
                      </div>
                    )}

                    {/* Related cards */}
                    {(card.relatedCardIds.length > 0 ||
                      (card.kind === "style" && "comparisonCardIds" in card && (card as any).comparisonCardIds?.length > 0) ||
                      (card.kind === "style" && "predecessorCardIds" in card && (card as any).predecessorCardIds?.length > 0) ||
                      (card.kind === "style" && "successorCardIds" in card && (card as any).successorCardIds?.length > 0)) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{t("関連カード", "关联卡片")}</h4>
                        <div className="space-y-1.5">
                          {/* Predecessors */}
                          {card.kind === "style" && "predecessorCardIds" in card && (card as any).predecessorCardIds?.length > 0 && (
                            <RelatedCardRow
                              label={t("前身", "前身")}
                              cardIds={(card as any).predecessorCardIds}
                              lang={lang}
                            />
                          )}
                          {/* Successors */}
                          {card.kind === "style" && "successorCardIds" in card && (card as any).successorCardIds?.length > 0 && (
                            <RelatedCardRow
                              label={t("後継", "后继")}
                              cardIds={(card as any).successorCardIds}
                              lang={lang}
                            />
                          )}
                          {/* Comparisons */}
                          {card.kind === "style" && "comparisonCardIds" in card && (card as any).comparisonCardIds?.length > 0 && (
                            <RelatedCardRow
                              label={t("比較", "比较")}
                              cardIds={(card as any).comparisonCardIds}
                              lang={lang}
                            />
                          )}
                          {/* General related */}
                          {card.relatedCardIds.length > 0 && (
                            <RelatedCardRow
                              label={t("関連", "相关")}
                              cardIds={card.relatedCardIds}
                              lang={lang}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Exam evidence (merged) */}
                    {questionEvidence.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-red-700 mb-2">
                          {t("過去問の考点", "真题考点")} ({totalExamCount})
                        </h4>
                        <div className="space-y-2">
                          {methodEvidence.map((method, methodIndex) => <details key={methodIndex} className="group overflow-hidden rounded-lg border border-red-100 bg-red-50/40">
                            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 p-2.5 text-xs marker:content-none hover:bg-red-50">
                              <span className="text-red-500 transition-transform group-open:rotate-90">›</span>
                              <span className="font-semibold text-gray-700">{method.meta ? t(method.meta.typeJa, method.meta.typeZh) : t("用語・知識確認", "术语／知识确认")}</span>
                              <span className="rounded bg-white px-1.5 py-0.5 text-gray-500">{method.questions.length} {t("題", "题")}</span>
                              {method.meta && <span className="basis-full pl-4 text-gray-500">{t(method.meta.methodJa, method.meta.methodZh)}</span>}
                            </summary>
                            <div className="space-y-2 border-t border-red-100 bg-white/70 p-2.5">
                              {method.questions.map((group, i) => {
                                const ev = group.evidence[0];
                                const sourceLabels = group.relations.map((relation) => relation === "word-bank" ? t("語群の選択肢", "语群备选") : relation === "direct" ? t("題干に直接出現", "题干直接出现") : relation === "related-building" ? t("関連建築", "关联建筑") : t("関連", "相关"));
                                return <div key={i} className="rounded-md border border-gray-100 bg-white p-2 text-xs text-gray-600">
                                  <div className="flex flex-wrap items-center gap-1.5"><span className="font-mono font-medium text-gray-700">{ev.year}年 {ev.category} Q{ev.questionNumber}</span>{sourceLabels.map((label) => <span key={label} className="rounded bg-gray-50 px-1.5 py-0.5 text-gray-500">{label}</span>)}</div>
                                  {group.terms.length > 0 && <p className="mt-1 text-gray-400">{t("このカードに関わる語：", "与此卡相关的词：")}{group.terms.join("、")}</p>}
                                </div>;
                              })}
                            </div>
                          </details>)}
                        </div>
                      </div>
                    )}
                    {card.kind === "architect" && questionEvidence.length === 0 && (
                      <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        {t("現在、確認済みの過去問との直接または関連建築経由のリンクはありません。", "当前尚未找到已确认的真题直接关联或经由关联建筑的链接。")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400">
          {lang === "en"
            ? activeTab === "urban-planning"
              ? `${currentUrbanCards.length} urban-planning categories displayed`
              : `${currentCards.length} of ${HISTORY_LEARNING_CARDS.length} cards displayed`
            : t(
                activeTab === "urban-planning" ? `都市計画 ${currentUrbanCards.length} 分類を表示` : `全${HISTORY_LEARNING_CARDS.length}枚中 ${currentCards.length} 枚表示`,
                activeTab === "urban-planning" ? `显示 ${currentUrbanCards.length} 个都市规划分类` : `显示 ${currentCards.length} / ${HISTORY_LEARNING_CARDS.length} 张卡片`
              )}
        </div>
      </div>
    </SidebarLayout>
  );
}

// ── Helper sub-components ──

function UrbanPlanningSection({ cards, lang, englishText }: { cards: typeof URBAN_PLANNING_CARDS; lang: HistoryLanguage; englishText: Map<string, string> }) {
  const t = (ja: string, zh: string) => lang === "ja" ? ja : lang === "zh" ? zh : englishText.get(localizedKey(ja, zh)) ?? UI_ENGLISH[ja] ?? "English text unavailable";
  if (cards.length === 0) {
    return <p className="py-12 text-center text-gray-400">{t("該当する都市計画カードがありません", "没有匹配的都市规划卡片")}</p>;
  }
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900">
        {t(
          "個別建築ではなく、街路・街区・広場・インフラの組立て方を「計画の型」と「代表例」で学ぶセクションです。",
          "这一部分不以单体建筑为中心，而是通过“规划类型”与“代表案例”学习道路、街块、广场和基础设施的组织方式。"
        )}
      </div>
      {cards.map((card) => (
        <article key={card.id} id={card.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{t(card.name.ja, card.name.zh)}</h2>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">{t("都市計画", "都市规划")}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">{t(card.period.ja, card.period.zh)}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">{t(card.summary.ja, card.summary.zh)}</p>
          </div>
          <div className="grid gap-5 p-5 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800">{t("計画の論理", "规划逻辑")}</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                {card.planningLogic.map((item) => <li key={item.ja} className="flex gap-2"><span className="text-sky-500">◆</span><span>{t(item.ja, item.zh)}</span></li>)}
              </ul>
              <h3 className="mb-2 mt-4 text-sm font-semibold text-gray-800">{t("図面・写真の識別点", "图面／照片识别点")}</h3>
              {card.visualClues.map((item) => <p key={item.ja} className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">{t(item.ja, item.zh)}</p>)}
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800">{t("代表例", "代表案例")}</h3>
              <div className="space-y-2">
                {card.cases.map((item) => {
                  const body = <><span className="font-medium text-gray-900">{t(item.nameJa, item.nameZh)}</span><span className="mt-0.5 block text-xs leading-relaxed text-gray-500">{t(item.noteJa, item.noteZh)}</span></>;
                  return item.buildingId ? (
                    <Link key={item.nameJa} href={`/history/buildings/${item.buildingId}?from=history`} className="block rounded-lg border border-gray-100 p-3 transition hover:border-sky-200 hover:bg-sky-50">{body}</Link>
                  ) : <div key={item.nameJa} className="rounded-lg border border-gray-100 p-3">{body}</div>;
                })}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function RelatedCardRow({ label, cardIds, lang }: { label: string; cardIds: string[]; lang: HistoryLanguage }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-400 min-w-[3rem] pt-0.5">{label}</span>
      <div className="flex flex-wrap gap-1">
        {cardIds.map((cid) => {
          const card = getCardById(cid);
          if (!card) {
            return (
              <span key={cid} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
                {cid}
              </span>
            );
          }
          const cardName = lang === "en"
            ? (card.name as EnglishLocalizedText).en
            : lang === "ja"
              ? card.name.ja
              : card.name.zh;
          const kindLabel = card.kind === "style"
            ? (lang === "en" ? "Style" : lang === "ja" ? "様式" : "样式")
            : card.kind === "movement"
              ? (lang === "en" ? "Movement" : lang === "ja" ? "運動" : "运动")
              : card.kind === "architect"
                ? (lang === "en" ? "Architect" : lang === "ja" ? "建築家" : "建筑家")
                : (lang === "en" ? "Building type" : lang === "ja" ? "類型" : "类型");
          return (
            <Link
              key={cid}
              href={`/history#${cid}`}
              className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
              title={`${kindLabel}: ${cardName}`}
            >
              {cardName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DetailSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-1">{title}</h4>
      <ul className="list-disc list-inside space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600">{item}</li>
        ))}
      </ul>
    </div>
  );
}

// Need this for the footer — import at module level
import { HISTORY_LEARNING_CARDS } from "@/lib/history-learning-cards";
