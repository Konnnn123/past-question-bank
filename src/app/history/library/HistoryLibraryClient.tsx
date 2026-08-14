"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import { useExploreLanguage, type ExploreLanguage } from "@/components/ExploreLanguageProvider";
import { getOriginalLanguageTerm } from "@/lib/original-language-terms";
import {
  dailyStreak,
  EMPTY_HISTORY_LIBRARY_PROGRESS,
  familiarityOf,
  localDateKey,
  readHistoryLibraryProgress,
  writeHistoryLibraryProgress,
  type Familiarity,
  type HistoryLibraryProgress,
  type HistoryPracticeMode,
} from "@/lib/history-library-progress";

export type LibraryCopy = Record<ExploreLanguage, string>;
export type BuildingCategory = "religious" | "residential" | "civic" | "fortification" | "urban" | "other";
export type HistoryAssociationKind = "architect" | "style" | "movement" | "feature";
type ViewMode = "library" | HistoryPracticeMode;

export interface HistoryAssociation {
  kind: HistoryAssociationKind;
  label: LibraryCopy;
}

export interface HistoryLibraryItem {
  id: string;
  name: LibraryCopy;
  aliases: string[];
  period: LibraryCopy;
  chronology: LibraryCopy | null;
  regions: string[];
  typeIds: string[];
  styles: string[];
  people: string[];
  sortYear: number | null;
  examCount: number;
  priority: "S" | "A" | "B" | "normal";
  relatedCards: { id: string; name: LibraryCopy }[];
  associations: HistoryAssociation[];
  image: { file: string } | null;
  href: string;
}

export interface HistoryQuizBuilding {
  id: string;
  name: string;
  nameJa: string;
  imageFile: string;
  period: LibraryCopy;
  chronology: LibraryCopy | null;
  sortYear: number | null;
  architects: string[];
  regions: string[];
  relatedCards: { id: string; name: LibraryCopy }[];
  href: string;
}

interface Props { items: HistoryLibraryItem[]; quizBuildings: HistoryQuizBuilding[] }

const COPY = {
  back: { zh: "返回探索", ja: "探索に戻る", en: "Back to Explore" },
  eyebrow: { zh: "建筑史探索馆", ja: "建築史探索ギャラリー", en: "Architectural History Gallery" },
  title: { zh: "从图片和关系开始认识建筑史", ja: "写真とつながりから建築史をたどる", en: "Explore architectural history through images and connections" },
  intro: { zh: "浏览具体建筑，也可以用更有趣的测试建立自己的学习进度。", ja: "具体的な建築を見ながら、さまざまなクイズで学習記録を育てられます。", en: "Browse individual buildings and build your learning record through playful challenges." },
  library: { zh: "展示库", ja: "ギャラリー", en: "Gallery" },
  image: { zh: "看图挑战", ja: "画像クイズ", en: "Image quiz" },
  chronology: { zh: "年代排序", ja: "年代順クイズ", en: "Chronology" },
  architect: { zh: "模拟语群题", ja: "模擬語群問題", en: "Word-bank mock" },
  daily: { zh: "每日十题", ja: "今日の10問", en: "Daily ten" },
  progress: { zh: "学习进度", ja: "学習進捗", en: "Learning progress" },
  explored: { zh: "已学习建筑", ja: "学習した建築", en: "Buildings studied" },
  familiar: { zh: "熟悉", ja: "定着", en: "Familiar" },
  mastered: { zh: "掌握", ja: "習得", en: "Mastered" },
  accuracy: { zh: "正确率", ja: "正答率", en: "Accuracy" },
  streak: { zh: "连续学习", ja: "連続学習", en: "Daily streak" },
  days: { zh: "天", ja: "日", en: "days" },
  todayDone: { zh: "今日十题已完成", ja: "今日の10問は完了", en: "Daily ten complete" },
  todayOpen: { zh: "完成每日十题可延续记录", ja: "今日の10問で記録を続けよう", en: "Complete the daily ten to continue your streak" },
  unseen: { zh: "未学习", ja: "未学習", en: "Unseen" },
  learning: { zh: "学习中", ja: "学習中", en: "Learning" },
  search: { zh: "搜索建筑名、年代、样式或建筑师…", ja: "建築名・年代・様式・建築家を検索…", en: "Search buildings, periods, styles, or architects…" },
  all: { zh: "全部", ja: "すべて", en: "All" },
  religious: { zh: "宗教建筑", ja: "宗教建築", en: "Religious" },
  residential: { zh: "住宅", ja: "住宅", en: "Residential" },
  civic: { zh: "公共建筑", ja: "公共建築", en: "Civic" },
  fortification: { zh: "城郭与纪念物", ja: "城郭・記念物", en: "Fortifications" },
  urban: { zh: "城市与聚落", ja: "都市・集落", en: "Urban" },
  other: { zh: "其他", ja: "その他", en: "Other" },
  japan: { zh: "日本", ja: "日本", en: "Japan" },
  western: { zh: "西方", ja: "西洋", en: "Western" },
  global: { zh: "全球", ja: "世界", en: "Global" },
  eastAsian: { zh: "东亚", ja: "東アジア", en: "East Asia" },
  withImages: { zh: "仅看有图片", ja: "画像ありのみ", en: "Images only" },
  random: { zh: "随机漫游", ja: "ランダムに見る", en: "Surprise me" },
  cardsShown: { zh: "张卡片", ja: "枚のカード", en: "cards" },
  exam: { zh: "真题", ja: "過去問", en: "Exam" },
  noImage: { zh: "暂无代表图片", ja: "代表画像なし", en: "No representative image" },
  empty: { zh: "没有符合当前条件的卡片。", ja: "条件に合うカードがありません。", en: "No cards match these filters." },
  start: { zh: "开始", ja: "スタート", en: "Start" },
  newSet: { zh: "换一组", ja: "別の問題", en: "New set" },
  nextSet: { zh: "下一组题", ja: "次の問題セット", en: "Next set" },
  next: { zh: "下一题", ja: "次の問題", en: "Next" },
  submit: { zh: "提交答案", ja: "回答する", en: "Check answer" },
  result: { zh: "本轮完成", ja: "セット完了", en: "Round complete" },
  correct: { zh: "答对了！", ja: "正解！", en: "Correct!" },
  incorrect: { zh: "再观察一下线索", ja: "手がかりをもう一度確認しよう", en: "Take another look at the clues" },
  imagePrompt: { zh: "这座建筑叫什么？", ja: "この建築は何でしょう？", en: "Which building is this?" },
  imageQuizHelp: { zh: "参照过去问的语群结构，在建筑师、样式、运动与相关关键词之间轮换；同一学习卡的多个关键词也会随批次变化。", ja: "過去問の語群構成を参照し、建築家・様式・運動・関連キーワードを交替で出題します。同じ学習カードでもキーワードはセットごとに変わります。", en: "Following past-exam word-bank structure, questions rotate among architects, styles, movements, and related keywords; a card's keyword also varies between sets." },
  imageTypeBuilding: { zh: "建筑名称", ja: "建築名", en: "Building" },
  imageTypeMixed: { zh: "混合关系", ja: "混合関係", en: "Mixed" },
  imageTypeArchitect: { zh: "建筑师", ja: "建築家", en: "Architect" },
  imageTypeStyle: { zh: "建筑风格", ja: "建築様式", en: "Style" },
  imageTypeMovement: { zh: "背后的运动", ja: "背景の運動", en: "Movement" },
  imageTypeFeature: { zh: "相关关键词", ja: "関連キーワード", en: "Related keyword" },
  imageArchitectPrompt: { zh: "哪位建筑师与这座建筑有关？", ja: "この建築に関係する建築家は？", en: "Which architect is associated with this building?" },
  imageStylePrompt: { zh: "这座建筑属于哪种风格？", ja: "この建築の様式は？", en: "Which style is associated with this building?" },
  imageMovementPrompt: { zh: "这座建筑与哪项运动有关？", ja: "この建築に関係する運動は？", en: "Which movement is associated with this building?" },
  imageFeaturePrompt: { zh: "哪项关键词与这座建筑最相关？", ja: "この建築に最も関係するキーワードは？", en: "Which keyword is most closely associated with this building?" },
  chronologyPrompt: { zh: "按由早到晚排列", ja: "古い順に並べてください", en: "Arrange from earliest to latest" },
  chronologyHelp: { zh: "用上下按钮移动卡片，提交后显示正确年代。", ja: "上下ボタンで並べ替え、回答後に年代を確認できます。", en: "Move the cards with the arrow buttons, then reveal the dates." },
  correctOrder: { zh: "正确顺序", ja: "正しい順序", en: "Correct order" },
  architectPrompt: { zh: "建筑史模拟语群题", ja: "建築史・模擬語群問題", en: "Architectural history word-bank mock" },
  architectHelp: { zh: "每批自动生成 10 题。语群 A 为建筑名称，语群 B 参照过去问混合建筑师、样式、运动与相关关键词；语群 C 每批只采用“世纪”或“单一年份”其中一种格式。", ja: "1セット10問を自動生成します。語群Aは建築名、語群Bは過去問にならい建築家・様式・運動・関連キーワードを組み合わせます。語群Cはセット全体を「世紀」または「単一年」のどちらか一方に統一します。", en: "Each set has 10 items. Following past exams, Group A contains buildings while Group B mixes architects, styles, movements, and related keywords. Group C consistently uses either centuries or single years." },
  architectLabel: { zh: "建筑师", ja: "建築家", en: "Architect" },
  peopleLabel: { zh: "建筑师／相关人物", ja: "建築家・関連人物", en: "Architects / related people" },
  styleMovementLabel: { zh: "风格／社会运动时期", ja: "様式・社会運動の時期", en: "Style / movement period" },
  groupA: { zh: "语群 A · 建筑名称", ja: "語群 A・建築名", en: "Group A · Building" },
  groupB: { zh: "语群 B · 关系关键词", ja: "語群 B・関連キーワード", en: "Group B · Related keyword" },
  groupCCentury: { zh: "语群 C · 世纪", ja: "語群 C・世紀", en: "Group C · Century" },
  groupCYear: { zh: "语群 C · 相关年份", ja: "語群 C・関連年", en: "Group C · Related year" },
  selectFromGroup: { zh: "请选择", ja: "選択してください", en: "Select" },
  associationArchitect: { zh: "建筑师", ja: "建築家", en: "Architect" },
  associationStyle: { zh: "建筑风格", ja: "建築様式", en: "Style" },
  associationMovement: { zh: "背后的运动", ja: "背景となる運動", en: "Movement" },
  associationFeature: { zh: "相关关键词", ja: "関連キーワード", en: "Related keyword" },
  dailyIntro: { zh: "每天固定十题，混合看图、建筑师与年代判断；刷新后题目不变。", ja: "毎日固定の10問。画像・建築家・年代を組み合わせ、再読み込みしても問題は変わりません。", en: "Ten fixed questions each day, mixing images, architects, and chronology. Refreshing keeps the same set." },
  earlierPrompt: { zh: "哪座建筑更早？", ja: "どちらが古いでしょう？", en: "Which building is earlier?" },
  architectQuestion: { zh: "这座建筑的建筑师是谁？", ja: "この建築の建築家は誰でしょう？", en: "Who designed this building?" },
  period: { zh: "年代", ja: "年代", en: "Period" },
  details: { zh: "查看建筑详情", ja: "建築の詳細を見る", en: "View building details" },
  review: { zh: "快速回顾", ja: "クイック復習", en: "Quick review" },
  reviewHint: { zh: "答题后无需离开页面即可查看建筑线索。", ja: "ページを離れずに建築の手がかりを確認できます。", en: "Review the building without leaving the quiz." },
  close: { zh: "关闭", ja: "閉じる", en: "Close" },
  stylesLabel: { zh: "风格／运动", ja: "様式・運動", en: "Styles / movements" },
  relatedCardsLabel: { zh: "相关历史卡片", ja: "関連する歴史カード", en: "Related history cards" },
  noRecordedPeople: { zh: "暂无人物资料", ja: "人物情報なし", en: "No people recorded" },
  noRecordedStyle: { zh: "暂无风格资料", ja: "様式情報なし", en: "No style recorded" },
} satisfies Record<string, LibraryCopy>;

const CATEGORY_OPTIONS: { value: "all" | BuildingCategory; label: keyof typeof COPY }[] = [
  { value: "all", label: "all" }, { value: "religious", label: "religious" }, { value: "residential", label: "residential" },
  { value: "civic", label: "civic" }, { value: "fortification", label: "fortification" }, { value: "urban", label: "urban" }, { value: "other", label: "other" },
];
const REGION_OPTIONS = [
  { value: "all", label: "all" }, { value: "japan", label: "japan" }, { value: "western", label: "western" },
  { value: "global", label: "global" }, { value: "east-asian", label: "eastAsian" },
] as const;
const MODE_OPTIONS: { value: ViewMode; label: keyof typeof COPY; icon: string }[] = [
  { value: "library", label: "library", icon: "▦" }, { value: "image", label: "image", icon: "◉" },
  { value: "chronology", label: "chronology", icon: "↕" }, { value: "architect", label: "architect", icon: "⌁" },
  { value: "daily", label: "daily", icon: "✦" },
];

function hash(value: string) { let result = 0; for (let index = 0; index < value.length; index += 1) result = (result * 31 + value.charCodeAt(index)) >>> 0; return result; }
function seeded<T>(values: T[], seed: string) {
  const next = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const random = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}
function shuffled<T>(values: T[]) { const next = [...values]; for (let index = next.length - 1; index > 0; index -= 1) { const swap = Math.floor(Math.random() * (index + 1)); [next[index], next[swap]] = [next[swap], next[index]]; } return next; }
function newBatchSeed() {
  const random = new Uint32Array(1);
  window.crypto?.getRandomValues(random);
  return `${Date.now()}-${random[0]}`;
}
function normalizedChoice(value: string) { return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase(); }
function distinctByLabel<T>(values: T[], label: (value: T) => string) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = normalizedChoice(label(value));
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function buildingCategory(typeIds: string[]): BuildingCategory {
  if (typeIds.some((id) => ["type-church", "type-buddhist-temple", "type-temple", "type-mosque", "type-shrine"].includes(id))) return "religious";
  if (typeIds.some((id) => ["type-civic-cultural", "type-office", "type-museum-library", "type-theater", "type-station", "type-exhibition", "type-school"].includes(id))) return "civic";
  if (typeIds.some((id) => ["type-fortification", "type-castle", "type-monument-tomb"].includes(id))) return "fortification";
  if (typeIds.some((id) => ["type-residential", "type-residence", "type-aristocratic-residence", "type-machiya", "type-minka", "type-collective-housing"].includes(id))) return "residential";
  if (typeIds.some((id) => ["type-urban-space", "type-jinaicho", "type-moated-settlement", "type-pit-dwelling", "type-hottate-bashira"].includes(id))) return "urban";
  return "other";
}

function familiarityClass(level: Familiarity) {
  return level === "mastered" ? "bg-emerald-600 text-white" : level === "familiar" ? "bg-sky-100 text-sky-800" : level === "learning" ? "bg-amber-100 text-amber-800" : "bg-white/90 text-stone-500";
}

function quizBuildingLabel(building: HistoryQuizBuilding, language: ExploreLanguage) {
  if (building.name === building.nameJa) return building.name;
  return language === "en" ? `${building.name} / ${building.nameJa}` : `${building.nameJa}（${building.name}）`;
}

function libraryBuildingLabel(building: HistoryLibraryItem, language: ExploreLanguage) {
  const japaneseName = building.name.ja.trim();
  const originalName = building.name.en.trim();
  if (!originalName || normalizedChoice(originalName) === normalizedChoice(japaneseName)) return japaneseName;
  return language === "en" ? `${originalName} / ${japaneseName}` : `${japaneseName}（${originalName}）`;
}

function chronologyLabel(item: HistoryLibraryItem, language: ExploreLanguage) {
  const period = item.period[language];
  const chronology = item.chronology?.[language];
  const unresolvedPeriod = language !== "ja" && normalizedChoice(period) === normalizedChoice(item.period.ja);
  if (chronology && unresolvedPeriod) return chronology;
  return chronology && chronology !== period ? `${period} · ${chronology}` : period;
}

function ordinal(value: number) {
  const remainder = value % 100;
  if (remainder >= 11 && remainder <= 13) return `${value}th`;
  return `${value}${value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th"}`;
}

type PeriodBankMode = "century" | "year";

function centuryPeriodLabel(item: HistoryLibraryItem, language: ExploreLanguage) {
  const year = item.sortYear as number;
  const century = Math.max(1, Math.ceil(Math.abs(year) / 100));
  if (language === "en") return `${ordinal(century)} century ${year < 0 ? "BCE" : "CE"}`;
  return `${year < 0 ? language === "zh" ? "公元前" : "紀元前" : ""}${century}${language === "zh" ? "世纪" : "世紀"}`;
}

function exactRelatedYear(item: HistoryLibraryItem) {
  const source = item.period.ja.normalize("NFKC");
  if (/\d{3,4}年代/.test(source)) return null;
  if (/\d{3,4}\s*年?\s*[〜～–—-]\s*\d{2,4}年/.test(source)) return null;
  const values = [...new Set([...source.matchAll(/(?<!\d)(\d{3,4})(?!\d)/g)].map((match) => Number(match[1])))];
  if (values.length !== 1) return null;
  return source.includes("紀元前") ? -values[0] : values[0];
}

function exactYearLabel(item: HistoryLibraryItem, language: ExploreLanguage) {
  const year = exactRelatedYear(item);
  if (year === null) return null;
  if (language === "en") return `${Math.abs(year)} ${year < 0 ? "BCE" : "CE"}`;
  return `${year < 0 ? language === "zh" ? "公元前" : "紀元前" : ""}${Math.abs(year)}年`;
}

function periodBankMode(batchSeed: string): PeriodBankMode {
  return hash(`period-bank-${batchSeed || "initial"}`) % 2 === 0 ? "century" : "year";
}

function localizedFacetLabel(value: string, language: ExploreLanguage) {
  if (language === "ja") return value;
  return getOriginalLanguageTerm(value)?.original ?? value;
}

function localizedStyleLabels(item: HistoryLibraryItem, language: ExploreLanguage) {
  const related = item.relatedCards.filter((card) => /^(style|movement)-/.test(card.id)).map((card) => card.name[language]);
  return distinctByLabel(related.length ? related : item.styles.map((style) => localizedFacetLabel(style, language)), (value) => value);
}

function localizedPeopleLabels(item: HistoryLibraryItem, language: ExploreLanguage) {
  const related = item.relatedCards.filter((card) => card.id.startsWith("architect-")).map((card) => card.name[language]);
  return distinctByLabel(related.length ? related : item.people.map((person) => localizedFacetLabel(person, language)), (value) => value);
}

function architectAnswerLabel(item: HistoryLibraryItem, language: ExploreLanguage) {
  const people = distinctByLabel(
    item.relatedCards.filter((card) => card.id.startsWith("architect-")).map((card) => card.name[language]),
    (value) => value,
  );
  return people.join(language === "en" ? " & " : "、");
}

function pickChronologyCards(eligible: HistoryLibraryItem[], randomize: boolean, completed = new Set<string>()) {
  const years = new Set<number>();
  const names = new Set<string>();
  const shuffledPool = randomize ? shuffled(eligible) : seeded(eligible, "chronology-initial");
  const pool = [...shuffledPool.filter((item) => !completed.has(item.id)), ...shuffledPool.filter((item) => completed.has(item.id))];
  return pool.filter((item) => {
    const year = item.sortYear as number;
    const name = normalizedChoice(`${item.name.ja}|${item.name.en}`);
    if (names.has(name) || [...years].some((existing) => Math.abs(existing - year) < 40)) return false;
    names.add(name);
    years.add(year);
    return true;
  }).slice(0, 4);
}

interface WordBankMatchCard {
  item: HistoryLibraryItem;
  association: HistoryAssociation;
  buildingLabel: string;
  associationLabel: string;
  periodLabel: string;
}

function pickWordBankCards(eligible: HistoryLibraryItem[], language: ExploreLanguage, batchSeed: string, completed = new Set<string>()) {
  const source = seeded(eligible, `history-word-bank-${batchSeed || "initial"}`);
  const periodMode = periodBankMode(batchSeed);
  const pool = [...source.filter((item) => !completed.has(item.id)), ...source.filter((item) => completed.has(item.id))];
  const usedBuildings = new Set<string>();
  const usedAssociations = new Set<string>();
  const usedPeriods = new Set<string>();
  const kindCounts: Record<HistoryAssociationKind, number> = { architect: 0, style: 0, movement: 0, feature: 0 };
  const selected: WordBankMatchCard[] = [];

  for (const item of pool) {
    const buildingLabel = libraryBuildingLabel(item, language);
    const periodLabel = periodMode === "century" ? centuryPeriodLabel(item, language) : exactYearLabel(item, language);
    if (!periodLabel) continue;
    const buildingKey = normalizedChoice(buildingLabel);
    const periodKey = normalizedChoice(periodLabel);
    if (usedBuildings.has(buildingKey) || usedPeriods.has(periodKey)) continue;

    const associations = seeded(item.associations, `${batchSeed || "initial"}-${item.id}-${selected.length}`)
      .filter((association) => !usedAssociations.has(normalizedChoice(association.label[language])))
      .sort((left, right) => kindCounts[left.kind] - kindCounts[right.kind]);
    const association = associations[0];
    if (!association) continue;

    const associationLabel = association.label[language];
    selected.push({ item, association, buildingLabel, associationLabel, periodLabel });
    usedBuildings.add(buildingKey);
    usedAssociations.add(normalizedChoice(associationLabel));
    usedPeriods.add(periodKey);
    kindCounts[association.kind] += 1;
    if (selected.length === 10) break;
  }
  return selected;
}

export default function HistoryLibraryClient({ items, quizBuildings }: Props) {
  const { language } = useExploreLanguage();
  const searchParams = useSearchParams();
  const requested = searchParams.get("mode");
  const requestedMode: ViewMode = requested === "quiz" ? "image" : MODE_OPTIONS.some((option) => option.value === requested) ? requested as ViewMode : "library";
  const mode = requestedMode;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | BuildingCategory>("all");
  const [region, setRegion] = useState("all");
  const [imagesOnly, setImagesOnly] = useState(false);
  const [progress, setProgress] = useState<HistoryLibraryProgress>(EMPTY_HISTORY_LIBRARY_PROGRESS);
  const [reviewId, setReviewId] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setProgress(readHistoryLibraryProgress()));
  }, []);

  const t = (copy: LibraryCopy) => copy[language];
  const detailHref = (href: string) => `${href}?from=library&mode=${mode === "image" ? "quiz" : mode}`;
  const reviewItem = reviewId ? items.find((item) => item.id === reviewId) ?? null : null;
  const record = (results: { id: string; correct: boolean }[], practiceMode: HistoryPracticeMode, complete = false) => {
    setProgress((current) => {
      const buildings = { ...current.buildings };
      const now = new Date().toISOString();
      for (const result of results) {
        const before = buildings[result.id] ?? { attempts: 0, correct: 0, streak: 0, lastSeenAt: now, byMode: {} };
        const modeBefore = before.byMode[practiceMode] ?? { attempts: 0, correct: 0 };
        buildings[result.id] = {
          attempts: before.attempts + 1, correct: before.correct + (result.correct ? 1 : 0),
          streak: result.correct ? before.streak + 1 : 0, lastSeenAt: now,
          byMode: { ...before.byMode, [practiceMode]: { attempts: modeBefore.attempts + 1, correct: modeBefore.correct + (result.correct ? 1 : 0) } },
        };
      }
      const sessions = complete ? [...current.sessions.filter((session) => practiceMode !== "daily" || session.date !== localDateKey()), {
        mode: practiceMode, date: localDateKey(), correct: results.filter((result) => result.correct).length, total: results.length, completedAt: now,
      }].slice(-120) : current.sessions;
      const next = { version: 1 as const, buildings, sessions };
      writeHistoryLibraryProgress(next);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && buildingCategory(item.typeIds) !== category) return false;
      if (region !== "all" && !item.regions.includes(region)) return false;
      if (imagesOnly && !item.image) return false;
      if (!normalized) return true;
      return `${item.name.ja} ${item.name.zh} ${item.name.en} ${item.aliases.join(" ")} ${item.period.ja} ${item.period.zh} ${item.period.en} ${item.styles.join(" ")} ${item.people.join(" ")}`.toLowerCase().includes(normalized);
    });
  }, [category, imagesOnly, items, query, region]);

  const totals = useMemo(() => {
    const values = Object.values(progress.buildings);
    const attempts = values.reduce((sum, value) => sum + value.attempts, 0);
    const correct = values.reduce((sum, value) => sum + value.correct, 0);
    const todaySession = progress.sessions.find((session) => session.mode === "daily" && session.date === localDateKey() && session.total >= 10);
    return {
      studied: values.filter((value) => value.attempts > 0).length,
      familiar: values.filter((value) => ["familiar", "mastered"].includes(familiarityOf(value))).length,
      mastered: values.filter((value) => familiarityOf(value) === "mastered").length,
      accuracy: attempts ? Math.round(correct / attempts * 100) : 0,
      streak: dailyStreak(progress.sessions),
      todayDone: Boolean(todaySession),
      todayScore: todaySession?.correct ?? 0,
    };
  }, [progress]);

  const randomItem = () => { if (filtered.length) window.location.href = detailHref(filtered[Math.floor(Math.random() * filtered.length)].href); };

  return <><SidebarLayout><div className="min-h-full overflow-y-auto bg-[#f5f4ef] px-4 py-8 sm:px-8"><div className="mx-auto max-w-7xl">
    <Link href="/explore" className="text-sm text-slate-500 hover:text-violet-700">← {t(COPY.back)}</Link>
    <header className="mt-5 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
      <p className="text-xs font-bold tracking-[0.24em] text-amber-300">{t(COPY.eyebrow)}</p>
      <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl">{t(COPY.title)}</h1><p className="mt-4 max-w-2xl leading-7 text-slate-300">{t(COPY.intro)}</p>
      <nav className="mt-7 flex flex-wrap gap-2">{MODE_OPTIONS.map((option) => <Link key={option.value} href={option.value === "library" ? "/history/library" : `/history/library?mode=${option.value}`} className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${mode === option.value ? "bg-amber-300 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}><span className="mr-1.5">{option.icon}</span>{t(COPY[option.label])}</Link>)}</nav>
    </header>

    <section className="mt-6 grid gap-3 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
      <div className="sm:col-span-3 lg:col-span-1"><p className="text-xs font-bold text-violet-600">{t(COPY.progress)}</p><p className="mt-1 text-sm text-slate-500">{totals.todayDone ? t(COPY.todayDone) : t(COPY.todayOpen)}</p></div>
      {[[COPY.explored, `${totals.studied}/${items.length}`], [COPY.familiar, totals.familiar], [COPY.mastered, totals.mastered], [COPY.accuracy, `${totals.accuracy}%`], [COPY.streak, `${totals.streak} ${t(COPY.days)}`]].map(([label, value], index) => <div key={index} className="rounded-2xl bg-stone-50 px-4 py-3"><p className="text-[11px] text-stone-500">{t(label as LibraryCopy)}</p><p className="mt-1 text-xl font-black text-slate-900">{String(value)}</p></div>)}
    </section>

    {mode === "library" ? <>
      <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t(COPY.search)} className="min-w-0 flex-1 rounded-2xl bg-stone-100 px-4 py-3 text-sm outline-none ring-violet-300 focus:ring-2" /><div className="flex flex-wrap gap-2">{CATEGORY_OPTIONS.map((option) => <button key={option.value} onClick={() => setCategory(option.value)} className={`rounded-full px-3 py-2 text-xs font-bold ${category === option.value ? "bg-violet-600 text-white" : "bg-stone-100 text-slate-600 hover:bg-stone-200"}`}>{t(COPY[option.label])}</button>)}</div></div>
        <div className="flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">{REGION_OPTIONS.map((option) => <button key={option.value} onClick={() => setRegion(option.value)} className={`rounded-full px-3 py-1.5 text-xs font-medium ${region === option.value ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-stone-100"}`}>{t(COPY[option.label])}</button>)}<label className="ml-auto flex cursor-pointer items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-xs text-slate-600"><input type="checkbox" checked={imagesOnly} onChange={(event) => setImagesOnly(event.target.checked)} />{t(COPY.withImages)}</label><button onClick={randomItem} disabled={!filtered.length} className="rounded-full bg-amber-300 px-4 py-2 text-xs font-bold text-slate-900 disabled:opacity-40">✦ {t(COPY.random)}</button></div>
      </div></section>
      <p className="mt-6 text-sm text-slate-500"><b className="text-slate-900">{filtered.length}</b> {t(COPY.cardsShown)}</p>
      {filtered.length ? <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((item) => {
        const level = familiarityOf(progress.buildings[item.id]);
        return <Link key={item.id} href={detailHref(item.href)} className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-amber-50">{item.image ? <Image src={`/architecture-images/${item.image.file}`} alt={libraryBuildingLabel(item, language)} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-center text-xs font-medium text-stone-400">◇<br />{t(COPY.noImage)}</div>}<span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${familiarityClass(level)}`}>{t(COPY[level])}</span>{item.examCount > 0 && <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white">{t(COPY.exam)} {item.examCount}</span>}</div>
          <div className="p-5"><p className="text-xs font-semibold text-violet-600">{chronologyLabel(item, language)}</p><h2 className="mt-1 text-lg font-black leading-snug text-slate-900">{libraryBuildingLabel(item, language)}</h2><div className="mt-3 flex flex-wrap gap-1.5">{localizedStyleLabels(item, language).slice(0, 2).map((style) => <span key={style} className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700">{style}</span>)}{localizedPeopleLabels(item, language).slice(0, 1).map((person) => <span key={person} className="rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600">{person}</span>)}</div></div>
        </Link>;
      })}</section> : <p className="mt-6 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">{t(COPY.empty)}</p>}
    </> : <PracticePanel mode={mode} items={items} quizBuildings={quizBuildings} progress={progress} language={language} t={t} detailHref={detailHref} onReview={setReviewId} record={record} todayDone={totals.todayDone} todayScore={totals.todayScore} />}
  </div></div></SidebarLayout>{reviewItem && <BuildingReviewModal item={reviewItem} language={language} t={t} detailHref={detailHref} onClose={() => setReviewId(null)} />}</>;
}

interface PracticeProps {
  mode: HistoryPracticeMode; items: HistoryLibraryItem[]; quizBuildings: HistoryQuizBuilding[]; progress: HistoryLibraryProgress; language: ExploreLanguage;
  t: (copy: LibraryCopy) => string; detailHref: (href: string) => string;
  onReview: (id: string) => void;
  record: (results: { id: string; correct: boolean }[], mode: HistoryPracticeMode, complete?: boolean) => void; todayDone: boolean; todayScore: number;
}

function PracticePanel(props: PracticeProps) {
  if (props.mode === "chronology") return <ChronologyQuiz {...props} />;
  if (props.mode === "architect") return <ArchitectQuiz {...props} />;
  if (props.mode === "daily") return <DailyQuiz {...props} />;
  return <ImageQuiz {...props} />;
}

type ImageQuestionType = "building" | HistoryAssociationKind | "mixed";
const IMAGE_QUESTION_OPTIONS: { value: ImageQuestionType; label: keyof typeof COPY }[] = [
  { value: "mixed", label: "imageTypeMixed" }, { value: "building", label: "imageTypeBuilding" },
  { value: "architect", label: "imageTypeArchitect" }, { value: "style", label: "imageTypeStyle" },
  { value: "movement", label: "imageTypeMovement" }, { value: "feature", label: "imageTypeFeature" },
];

interface ImageRelationQuestion {
  target: HistoryLibraryItem;
  kind: "building" | HistoryAssociationKind;
  correctId: string;
  choices: { id: string; label: string }[];
}

function buildImageRelationQuestions(items: HistoryLibraryItem[], language: ExploreLanguage, questionType: ImageQuestionType, batchSeed: string) {
  const imageItems = items.filter((item) => item.image);
  const source = seeded(imageItems, `image-${questionType}-${batchSeed || "initial"}`);
  const usedAnswers = new Set<string>();
  const kindCounts: Record<HistoryAssociationKind, number> = { architect: 0, style: 0, movement: 0, feature: 0 };
  const questions: ImageRelationQuestion[] = [];
  for (const target of source) {
    const associations = questionType === "building" ? [] : seeded(
      target.associations.filter((association) => questionType === "mixed" || association.kind === questionType),
      `${batchSeed || "initial"}-${target.id}-associations`,
    )
      .filter((association) => !usedAnswers.has(normalizedChoice(association.label[language])))
      .sort((left, right) => kindCounts[left.kind] - kindCounts[right.kind]);
    const association = associations[0];
    if (questionType !== "building" && !association) continue;
    const kind: "building" | HistoryAssociationKind = questionType === "building" ? "building" : association!.kind;
    const correctLabel = questionType === "building" ? libraryBuildingLabel(target, language) : association!.label[language];
    if (usedAnswers.has(normalizedChoice(correctLabel))) continue;
    const distractorLabels = kind === "building"
      ? imageItems.filter((item) => item.id !== target.id).map((item) => libraryBuildingLabel(item, language))
      : imageItems.flatMap((item) => item.id === target.id ? [] : item.associations.filter((candidate) => candidate.kind === kind).map((candidate) => candidate.label[language]));
    const distractors = distinctByLabel(seeded(distractorLabels.filter((label) => normalizedChoice(label) !== normalizedChoice(correctLabel)), `${batchSeed || "initial"}-${target.id}-${kind}-distractors`), (label) => label).slice(0, 3);
    if (distractors.length < 3) continue;
    const choices = seeded([correctLabel, ...distractors], `${batchSeed || "initial"}-${target.id}-${kind}-choices`).map((label) => ({ id: label, label }));
    questions.push({ target, kind, correctId: correctLabel, choices });
    usedAnswers.add(normalizedChoice(correctLabel));
    if (association) kindCounts[association.kind] += 1;
    if (questions.length === 10) break;
  }
  return questions;
}

function ImageQuiz({ items, language, t, detailHref, onReview, record }: PracticeProps) {
  const [questionType, setQuestionType] = useState<ImageQuestionType>("mixed");
  const [batchSeed, setBatchSeed] = useState("");
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [score, setScore] = useState(0);
  useEffect(() => { queueMicrotask(() => setBatchSeed(newBatchSeed())); }, []);
  const questions = useMemo(() => buildImageRelationQuestions(items, language, questionType, batchSeed), [batchSeed, items, language, questionType]);
  const question = questions[index]; const finished = questions.length > 0 && index >= questions.length;
  const restart = () => { setBatchSeed(newBatchSeed()); setIndex(0); setAnswer(null); setScore(0); };
  const changeType = (value: ImageQuestionType) => { setQuestionType(value); setBatchSeed(newBatchSeed()); setIndex(0); setAnswer(null); setScore(0); };
  const promptByKind: Record<"building" | HistoryAssociationKind, LibraryCopy> = { building: COPY.imagePrompt, architect: COPY.imageArchitectPrompt, style: COPY.imageStylePrompt, movement: COPY.imageMovementPrompt, feature: COPY.imageFeaturePrompt };
  const typePicker = <section className="mx-auto mt-6 max-w-4xl rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"><p className="text-sm leading-6 text-slate-500">{t(COPY.imageQuizHelp)}</p><div className="mt-3 flex flex-wrap gap-2">{IMAGE_QUESTION_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => changeType(option.value)} className={`rounded-full px-3.5 py-2 text-xs font-black transition ${questionType === option.value ? "bg-violet-600 text-white" : "bg-stone-100 text-slate-600 hover:bg-stone-200"}`}>{t(COPY[option.label])}</button>)}</div></section>;
  if (finished) return <>{typePicker}<ResultCard score={score} total={questions.length} onRestart={restart} t={t} /></>;
  if (!question) return <>{typePicker}<IntroCard icon="◉" title={t(COPY.image)} description={t(COPY.imagePrompt)} onStart={restart} t={t} /></>;
  const choose = (id: string) => { if (answer) return; const correct = id === question.correctId; setAnswer(id); if (correct) setScore((value) => value + 1); record([{ id: question.target.id, correct }], "image", index + 1 === questions.length); };
  return <>{typePicker}<section className="mx-auto mt-4 max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg"><QuizHeader index={index} total={questions.length} score={score} title={t(promptByKind[question.kind])} /><div className="grid lg:grid-cols-[1.15fr_1fr]"><div className="relative min-h-[320px] bg-stone-100 lg:min-h-[520px]"><Image src={`/architecture-images/${question.target.image!.file}`} alt={t(promptByKind[question.kind])} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="object-contain" /></div><div className="flex flex-col p-5 sm:p-7"><ChoiceButtons choices={question.choices} answer={answer} correctId={question.correctId} onChoose={choose} />{answer && <Feedback correct={answer === question.correctId} t={t}><p className="mt-2 text-sm font-bold text-slate-800">{libraryBuildingLabel(question.target, language)}</p><p className="mt-1 text-sm text-slate-600"><b>{t(COPY.period)}：</b>{chronologyLabel(question.target, language)}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => onReview(question.target.id)} className="text-sm font-bold text-violet-700">{t(COPY.review)} ↗</button><Link href={detailHref(question.target.href)} className="text-sm font-bold text-slate-500">{t(COPY.details)} →</Link></div></Feedback>}<NextButton visible={Boolean(answer)} final={index + 1 === questions.length} onClick={() => { setIndex((value) => value + 1); setAnswer(null); }} t={t} /></div></div></section></>;
}

function ChronologyQuiz({ items, progress, language, t, onReview, record }: PracticeProps) {
  const eligible = useMemo(() => items.filter((item) => item.sortYear !== null), [items]);
  const completed = useMemo(() => new Set(Object.keys(progress.buildings)), [progress.buildings]);
  const [cards, setCards] = useState(() => pickChronologyCards(eligible, false)); const [checked, setChecked] = useState(false); const [results, setResults] = useState<boolean[]>([]);
  const correctOrder = useMemo(() => [...cards].sort((a, b) => (a.sortYear ?? 0) - (b.sortYear ?? 0)), [cards]);
  useEffect(() => {
    if (checked) return;
    const nextCards = pickChronologyCards(eligible, true, completed);
    queueMicrotask(() => setCards(nextCards));
  }, [checked, completed, eligible]);
  const reset = () => { setCards(pickChronologyCards(eligible, true, completed)); setChecked(false); setResults([]); };
  const move = (from: number, direction: -1 | 1) => { if (checked) return; const to = from + direction; if (to < 0 || to >= cards.length) return; setCards((current) => { const next = [...current]; [next[from], next[to]] = [next[to], next[from]]; return next; }); };
  const check = () => { const next = cards.map((card, index) => card.id === correctOrder[index].id); setResults(next); setChecked(true); record(cards.map((card, index) => ({ id: card.id, correct: next[index] })), "chronology", true); };
  return <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-black text-slate-900">{t(COPY.chronologyPrompt)}</h2><p className="mt-2 text-sm text-slate-500">{t(COPY.chronologyHelp)}</p><div className="mt-6 space-y-3">{cards.map((card, index) => <div key={card.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${checked ? results[index] ? "border-emerald-300 bg-emerald-50" : "border-rose-200 bg-rose-50" : "border-stone-200"}`}><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>{card.image && <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100"><Image src={`/architecture-images/${card.image.file}`} alt={libraryBuildingLabel(card, language)} fill unoptimized className="object-cover" /></div>}<div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{libraryBuildingLabel(card, language)}</p>{checked && <p className="text-xs text-slate-500">{chronologyLabel(card, language)}</p>}</div><div className="flex gap-1"><button aria-label="Move earlier" onClick={() => move(index, -1)} disabled={checked || index === 0} className="rounded-lg bg-stone-100 px-3 py-2 disabled:opacity-30">↑</button><button aria-label="Move later" onClick={() => move(index, 1)} disabled={checked || index === cards.length - 1} className="rounded-lg bg-stone-100 px-3 py-2 disabled:opacity-30">↓</button></div></div>)}</div>{checked && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><h3 className="font-black text-emerald-900">{t(COPY.correctOrder)}</h3><p className="mt-1 text-xs text-emerald-800">{t(COPY.reviewHint)}</p><ol className="mt-3 space-y-2">{correctOrder.map((card, index) => <li key={card.id} className="flex items-start gap-3 rounded-xl bg-white px-3 py-2.5"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">{index + 1}</span><button type="button" aria-label={`${t(COPY.review)}: ${libraryBuildingLabel(card, language)}`} onClick={() => onReview(card.id)} className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"><span><b className="block text-sm text-slate-900">{libraryBuildingLabel(card, language)}</b><span className="text-xs text-slate-500">{chronologyLabel(card, language)}</span></span><span aria-hidden="true" className="shrink-0 text-violet-600">↗</span></button></li>)}</ol></div>}{checked ? <button onClick={reset} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-3 font-bold text-slate-950">{t(COPY.nextSet)}</button> : <button onClick={check} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white">{t(COPY.submit)}</button>}</section>;
}

function ArchitectQuiz({ items, progress, language, t, onReview, record }: PracticeProps) {
  const eligible = useMemo(() => items.filter((item) => item.image && item.sortYear !== null && item.associations.length > 0), [items]);
  const completed = useMemo(() => new Set(Object.keys(progress.buildings)), [progress.buildings]);
  const [batchSeed, setBatchSeed] = useState("");
  const [cards, setCards] = useState(() => pickWordBankCards(eligible, language, ""));
  const [answers, setAnswers] = useState<Record<string, { building?: string; association?: string; period?: string }>>({});
  const [checked, setChecked] = useState(false);
  useEffect(() => { queueMicrotask(() => setBatchSeed(newBatchSeed())); }, []);
  useEffect(() => {
    if (!batchSeed || checked || Object.keys(answers).length > 0) return;
    const nextCards = pickWordBankCards(eligible, language, batchSeed, completed);
    queueMicrotask(() => setCards(nextCards));
  }, [answers, batchSeed, checked, completed, eligible, language]);
  const seed = cards.map((card) => card.item.id).join("-");
  const banks = useMemo(() => ({
    building: seeded(cards.map((card) => card.buildingLabel), `${seed}-building`),
    association: seeded(cards.map((card) => card.associationLabel), `${seed}-association`),
    period: seeded(cards.map((card) => card.periodLabel), `${seed}-period`),
  }), [cards, seed]);
  const updateAnswer = (id: string, axis: "building" | "association" | "period", value: string) => setAnswers((current) => ({ ...current, [id]: { ...current[id], [axis]: value } }));
  const isCorrect = (card: WordBankMatchCard, axis: "building" | "association" | "period") => answers[card.item.id]?.[axis] === card[`${axis}Label`];
  const reset = () => { const nextSeed = newBatchSeed(); setBatchSeed(nextSeed); setCards(pickWordBankCards(eligible, language, nextSeed, completed)); setAnswers({}); setChecked(false); };
  const check = () => {
    setChecked(true);
    record(cards.map((card) => ({ id: card.item.id, correct: (["building", "association", "period"] as const).every((axis) => isCorrect(card, axis)) })), "architect", true);
  };
  const kindCopy: Record<HistoryAssociationKind, LibraryCopy> = { architect: COPY.associationArchitect, style: COPY.associationStyle, movement: COPY.associationMovement, feature: COPY.associationFeature };
  const currentPeriodMode = periodBankMode(batchSeed);
  const bankGroups = [[COPY.groupA, banks.building], [COPY.groupB, banks.association], [currentPeriodMode === "century" ? COPY.groupCCentury : COPY.groupCYear, banks.period]] as const;
  const complete = cards.length === 10 && cards.every((card) => answers[card.item.id]?.building && answers[card.item.id]?.association && answers[card.item.id]?.period);

  return <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"><h2 className="text-2xl font-black text-slate-900">{t(COPY.architectPrompt)}</h2><p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">{t(COPY.architectHelp)}</p>
    <div className="mt-6 grid gap-3 lg:grid-cols-3">{bankGroups.map(([title, terms], groupIndex) => <section key={groupIndex} className={`rounded-2xl p-4 ${groupIndex === 0 ? "bg-violet-50" : groupIndex === 1 ? "bg-amber-50" : "bg-sky-50"}`}><h3 className="text-sm font-black text-slate-900">{t(title)}</h3><ol className="mt-3 grid gap-x-4 gap-y-1 text-xs leading-5 text-slate-600 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{terms.map((term, index) => <li key={term}><span className="mr-1 font-black text-slate-400">{index + 1}.</span>{term}</li>)}</ol></section>)}</div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">{cards.map((card, index) => { const axes = ["building", "association", "period"] as const; const correct = axes.every((axis) => isCorrect(card, axis)); return <article key={card.item.id} className={`overflow-hidden rounded-2xl border ${checked ? correct ? "border-emerald-300 bg-emerald-50/30" : "border-rose-300 bg-rose-50/20" : "border-stone-200"}`}><div className="grid sm:grid-cols-[12rem_1fr]"><div className="relative min-h-48 bg-stone-100"><Image src={`/architecture-images/${card.item.image!.file}`} alt={`${index + 1}`} fill unoptimized sizes="(max-width: 640px) 100vw, 12rem" className="object-contain" /><span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</span></div><div className="p-4">{axes.map((axis, axisIndex) => { const choices = axis === "building" ? banks.building : axis === "association" ? banks.association : banks.period; const selected = answers[card.item.id]?.[axis] ?? ""; const axisCorrect = isCorrect(card, axis); return <label key={axis} className={`${axisIndex ? "mt-3" : ""} block text-xs font-black text-slate-500`}><span>{String.fromCharCode(65 + axisIndex)}</span><select value={selected} onChange={(event) => updateAnswer(card.item.id, axis, event.target.value)} disabled={checked} className={`mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm font-medium ${checked ? axisCorrect ? "border-emerald-300 text-emerald-800" : "border-rose-300 text-rose-700" : "border-stone-200"}`}><option value="">— {t(COPY.selectFromGroup)} —</option>{choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}</select>{checked && !axisCorrect && <span className="mt-1 block text-xs font-bold text-rose-700">✓ {card[`${axis}Label`]}</span>}</label>; })}{checked && <div className="mt-4 border-t border-stone-200 pt-3"><p className="font-black text-slate-900">{card.buildingLabel}</p><p className="mt-1 text-xs font-bold text-amber-800">{t(kindCopy[card.association.kind])} · {card.associationLabel}</p><button type="button" onClick={() => onReview(card.item.id)} className="mt-2 text-xs font-bold text-violet-700">{t(COPY.review)} ↗</button></div>}</div></div></article>; })}</div>
    {checked ? <button onClick={reset} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-3 font-bold text-slate-950">{t(COPY.nextSet)}</button> : <button onClick={check} disabled={!complete} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-40">{t(COPY.submit)}</button>}
  </section>;
}

interface DailyQuestion { id: string; buildingId: string; reviewBuildingIds: string[]; prompt: LibraryCopy; image?: string; choices: { id: string; label: string }[]; correctId: string }
function DailyQuiz({ items, quizBuildings, language, t, onReview, record, todayDone, todayScore }: PracticeProps) {
  const date = localDateKey();
  const questions = useMemo(() => {
    const result: DailyQuestion[] = [];
    const imagePool = distinctByLabel(seeded(quizBuildings, `${date}-images`), (item) => `${item.nameJa}|${item.name}`);
    const architectPool = distinctByLabel(seeded(items.filter((item) => architectAnswerLabel(item, language)), `${date}-architects`), (item) => `${item.name.ja}|${item.name.en}`);
    const datedPool = distinctByLabel(seeded(items.filter((item) => item.sortYear !== null), `${date}-dates`), (item) => `${item.name.ja}|${item.name.en}`);
    const usedBuildingIds = new Set<string>();
    const unusedFrom = <T extends { id: string }>(pool: T[], offset: number) => {
      const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
      return rotated.find((item) => !usedBuildingIds.has(item.id));
    };
    for (let index = 0; index < 10; index += 1) {
      if (index % 3 === 0) {
        const target = unusedFrom(imagePool, index);
        if (target) {
          usedBuildingIds.add(target.id);
          const targetLabel = normalizedChoice(quizBuildingLabel(target, language));
          const distractors = distinctByLabel(seeded(quizBuildings.filter((item) => item.id !== target.id && normalizedChoice(quizBuildingLabel(item, language)) !== targetLabel), `${date}-${index}`), (item) => quizBuildingLabel(item, language)).slice(0, 3);
          const choices = seeded([target, ...distractors], `${date}-${index}-choice`).map((item) => ({ id: item.id, label: quizBuildingLabel(item, language) }));
          result.push({ id: `image-${target.id}`, buildingId: target.id, reviewBuildingIds: [target.id], prompt: COPY.imagePrompt, image: target.imageFile, choices, correctId: target.id });
          continue;
        }
      }
      if (index % 3 === 1) {
        const target = unusedFrom(architectPool, index);
        if (target) {
          usedBuildingIds.add(target.id);
          const targetArchitect = architectAnswerLabel(target, language);
          const targetArchitectKey = normalizedChoice(targetArchitect);
          const people = distinctByLabel(
            seeded(items.filter((item) => item.id !== target.id).map((item) => architectAnswerLabel(item, language)).filter((person) => person && normalizedChoice(person) !== targetArchitectKey), `${date}-${index}`),
            (person) => person,
          ).slice(0, 3);
          const displayName = libraryBuildingLabel(target, language);
          result.push({ id: `architect-${target.id}`, buildingId: target.id, reviewBuildingIds: [target.id], prompt: { zh: `${displayName} 的建筑师是谁？`, ja: `${displayName}の建築家は？`, en: `Who designed ${displayName}?` }, choices: seeded([targetArchitect, ...people], `${date}-${index}-people`).map((label) => ({ id: label, label })), correctId: targetArchitect });
          continue;
        }
      }
      const first = unusedFrom(datedPool, index);
      const second = first ? [...datedPool.slice(index + 10), ...datedPool.slice(0, index + 10)].find((candidate) => candidate.id !== first.id && !usedBuildingIds.has(candidate.id) && normalizedChoice(`${candidate.name.ja}|${candidate.name.en}`) !== normalizedChoice(`${first.name.ja}|${first.name.en}`)) : undefined;
      if (first && second) {
        usedBuildingIds.add(first.id);
        usedBuildingIds.add(second.id);
        const correct = (first.sortYear ?? 0) <= (second.sortYear ?? 0) ? first : second;
        result.push({ id: `earlier-${first.id}-${second.id}`, buildingId: correct.id, reviewBuildingIds: [first.id, second.id], prompt: COPY.earlierPrompt, choices: [first, second].map((item) => ({ id: item.id, label: libraryBuildingLabel(item, language) })), correctId: correct.id });
      }
    }
    return result.slice(0, 10);
  }, [date, items, language, quizBuildings]);
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [results, setResults] = useState<{ id: string; correct: boolean }[]>([]);
  const question = questions[index]; const finished = questions.length > 0 && index >= questions.length;
  const reset = () => { setIndex(0); setAnswer(null); setResults([]); };
  if (finished || todayDone && index === 0) return <ResultCard score={finished ? results.filter((item) => item.correct).length : todayScore} total={10} onRestart={reset} t={t} note={todayDone ? t(COPY.todayDone) : undefined} />;
  if (!question) return <IntroCard icon="✦" title={t(COPY.daily)} description={t(COPY.dailyIntro)} onStart={reset} t={t} />;
  const reviewItems = question.reviewBuildingIds.flatMap((id) => { const item = items.find((candidate) => candidate.id === id); return item ? [item] : []; });
  const choose = (id: string) => { if (answer) return; setAnswer(id); setResults((current) => [...current, { id: question.buildingId, correct: id === question.correctId }]); };
  const next = () => { const completed = index + 1 === questions.length; if (completed) record(results, "daily", true); setIndex((value) => value + 1); setAnswer(null); };
  return <section className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg"><QuizHeader index={index} total={questions.length} score={results.filter((item) => item.correct).length} title={t(question.prompt)} />{question.image && <div className="relative min-h-[320px] bg-stone-100"><Image src={`/architecture-images/${question.image}`} alt={t(question.prompt)} fill unoptimized className="object-contain" /></div>}<div className="p-6"><ChoiceButtons choices={question.choices} answer={answer} correctId={question.correctId} onChoose={choose} />{answer && <Feedback correct={answer === question.correctId} t={t}><div className="mt-3 flex flex-wrap gap-2">{reviewItems.map((item) => <button key={item.id} type="button" onClick={() => onReview(item.id)} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-700 shadow-sm">{t(COPY.review)} · {libraryBuildingLabel(item, language)}</button>)}</div></Feedback>}<NextButton visible={Boolean(answer)} final={index + 1 === questions.length} onClick={next} t={t} /></div></section>;
}

function BuildingReviewModal({ item, language, t, detailHref, onClose }: {
  item: HistoryLibraryItem;
  language: ExploreLanguage;
  t: (copy: LibraryCopy) => string;
  detailHref: (href: string) => string;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const title = libraryBuildingLabel(item, language);
  const otherCards = item.relatedCards.filter((card) => !/^(style|movement|architect)-/.test(card.id));
  const people = localizedPeopleLabels(item, language);
  const styles = localizedStyleLabels(item, language);
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="building-review-title" onMouseDown={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
        <div><p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600">{t(COPY.review)}</p><p className="mt-1 text-sm text-slate-500">{t(COPY.reviewHint)}</p></div>
        <button type="button" autoFocus onClick={onClose} aria-label={t(COPY.close)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xl text-slate-600 hover:bg-stone-200">×</button>
      </div>
      <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-64 bg-stone-100 md:min-h-[430px]">{item.image ? <Image src={`/architecture-images/${item.image.file}`} alt={title} fill unoptimized sizes="(max-width: 768px) 100vw, 45vw" className="object-contain" /> : <div className="flex h-full min-h-64 items-center justify-center text-sm text-stone-400">{t(COPY.noImage)}</div>}</div>
        <div className="p-6 sm:p-8">
          <h2 id="building-review-title" className="text-2xl font-black leading-tight text-slate-950">{title}</h2>
          <p className="mt-3 rounded-xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-800">{chronologyLabel(item, language)}</p>
          <div className="mt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">{t(COPY.peopleLabel)}</h3>
            <div className="mt-2 flex flex-wrap gap-2">{people.length ? people.map((person) => <span key={person} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-slate-700">{person}</span>) : <span className="text-sm text-stone-400">{t(COPY.noRecordedPeople)}</span>}</div>
          </div>
          <div className="mt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">{t(COPY.stylesLabel)}</h3>
            <div className="mt-2 flex flex-wrap gap-2">{styles.length ? styles.map((style) => <span key={style} className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-900">{style}</span>) : <span className="text-sm text-stone-400">{t(COPY.noRecordedStyle)}</span>}</div>
          </div>
          {otherCards.length > 0 && <div className="mt-6"><h3 className="text-xs font-black uppercase tracking-wider text-slate-400">{t(COPY.relatedCardsLabel)}</h3><div className="mt-2 flex flex-wrap gap-2">{otherCards.map((card) => <span key={card.id} className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800">{card.name[language]}</span>)}</div></div>}
          <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={onClose} className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">{t(COPY.close)}</button><Link href={detailHref(item.href)} className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-bold text-violet-700">{t(COPY.details)} →</Link></div>
        </div>
      </div>
    </section>
  </div>;
}

function QuizHeader({ index, total, score, title }: { index: number; total: number; score: number; title: string }) { return <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4"><div><p className="text-xs font-bold text-violet-600">{index + 1} / {total}</p><h2 className="mt-1 text-xl font-black text-slate-900">{title}</h2></div><p className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold text-slate-600">{score} ✓</p></div>; }
function ChoiceButtons({ choices, answer, correctId, onChoose }: { choices: { id: string; label: string }[]; answer: string | null; correctId: string; onChoose: (id: string) => void }) { return <div className="grid gap-3">{choices.map((choice, index) => { const correct = choice.id === correctId; const chosen = choice.id === answer; return <button key={`${choice.id}-${index}`} onClick={() => onChoose(choice.id)} disabled={Boolean(answer)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${answer && correct ? "border-emerald-400 bg-emerald-50 text-emerald-800" : answer && chosen ? "border-rose-300 bg-rose-50 text-rose-700" : "border-stone-200 hover:border-violet-300 hover:bg-violet-50"}`}><span className="mr-2 text-stone-400">{String.fromCharCode(65 + index)}.</span>{choice.label}</button>; })}</div>; }
function Feedback({ correct, t, children }: { correct: boolean; t: (copy: LibraryCopy) => string; children?: React.ReactNode }) { return <div className={`mt-5 rounded-2xl p-4 ${correct ? "bg-emerald-50" : "bg-amber-50"}`}><p className="font-black text-slate-900">{correct ? t(COPY.correct) : t(COPY.incorrect)}</p>{children}</div>; }
function NextButton({ visible, final, onClick, t }: { visible: boolean; final: boolean; onClick: () => void; t: (copy: LibraryCopy) => string }) { return visible ? <button onClick={onClick} className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">{final ? t(COPY.result) : t(COPY.next)}</button> : null; }
function IntroCard({ icon, title, description, onStart, t }: { icon: string; title: string; description: string; onStart: () => void; t: (copy: LibraryCopy) => string }) { return <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"><div className="text-5xl">{icon}</div><h2 className="mt-4 text-2xl font-black text-slate-900">{title}</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">{description}</p><button onClick={onStart} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950">{t(COPY.start)}</button></section>; }
function ResultCard({ score, total, onRestart, t, note }: { score: number; total: number; onRestart: () => void; t: (copy: LibraryCopy) => string; note?: string }) { return <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"><p className="text-sm font-bold text-violet-600">{note ?? t(COPY.result)}</p><p className="mt-3 text-5xl font-black text-slate-950">{score} / {total}</p><button onClick={onRestart} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950">{t(COPY.newSet)}</button></section>; }
