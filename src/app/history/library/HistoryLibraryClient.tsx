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
type ViewMode = "library" | HistoryPracticeMode;

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
  architect: { zh: "建筑师配对", ja: "建築家マッチ", en: "Architect match" },
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
  chronologyPrompt: { zh: "按由早到晚排列", ja: "古い順に並べてください", en: "Arrange from earliest to latest" },
  chronologyHelp: { zh: "用上下按钮移动卡片，提交后显示正确年代。", ja: "上下ボタンで並べ替え、回答後に年代を確認できます。", en: "Move the cards with the arrow buttons, then reveal the dates." },
  correctOrder: { zh: "正确顺序", ja: "正しい順序", en: "Correct order" },
  architectPrompt: { zh: "建筑师与风格配对", ja: "建築家・様式マッチ", en: "Architect and style match" },
  architectHelp: { zh: "每轮 3 座建筑，同时匹配建筑师与对应的风格／社会运动时期。", ja: "1セット3件。建築家と様式・社会運動の時期を同時に組み合わせます。", en: "Three buildings per round. Match both the architect and the associated style or movement period." },
  architectLabel: { zh: "建筑师", ja: "建築家", en: "Architect" },
  peopleLabel: { zh: "建筑师／相关人物", ja: "建築家・関連人物", en: "Architects / related people" },
  styleMovementLabel: { zh: "风格／社会运动时期", ja: "様式・社会運動の時期", en: "Style / movement period" },
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
function seeded<T>(values: T[], seed: string) { return [...values].sort((a, b) => hash(`${seed}-${JSON.stringify(a)}`) - hash(`${seed}-${JSON.stringify(b)}`)); }
function shuffled<T>(values: T[]) { const next = [...values]; for (let index = next.length - 1; index > 0; index -= 1) { const swap = Math.floor(Math.random() * (index + 1)); [next[index], next[swap]] = [next[swap], next[index]]; } return next; }
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

function uniqueQuizBuildings(buildings: HistoryQuizBuilding[], randomize: boolean, limit: number, completed = new Set<string>()) {
  const pool = randomize ? shuffled(buildings) : seeded(buildings, "image-initial");
  const distinct = distinctByLabel(pool, (building) => `${building.nameJa}|${building.name}`);
  return [...distinct.filter((building) => !completed.has(building.id)), ...distinct.filter((building) => completed.has(building.id))].slice(0, limit);
}

function chronologyLabel(item: HistoryLibraryItem, language: ExploreLanguage) {
  const period = item.period[language];
  const chronology = item.chronology?.[language];
  const unresolvedPeriod = language !== "ja" && normalizedChoice(period) === normalizedChoice(item.period.ja);
  if (chronology && unresolvedPeriod) return chronology;
  return chronology && chronology !== period ? `${period} · ${chronology}` : period;
}

function quizChronologyLabel(item: HistoryQuizBuilding, language: ExploreLanguage) {
  const period = item.period[language];
  const chronology = item.chronology?.[language];
  const unresolvedPeriod = language !== "ja" && normalizedChoice(period) === normalizedChoice(item.period.ja);
  if (chronology && unresolvedPeriod) return chronology;
  return chronology && chronology !== period ? `${period} · ${chronology}` : period;
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

function pickArchitectStyleCards(eligible: HistoryLibraryItem[], randomize: boolean, completed = new Set<string>()) {
  const usedArchitects = new Set<string>();
  const usedStyles = new Set<string>();
  const usedBuildings = new Set<string>();
  const shuffledPool = randomize ? shuffled(eligible) : seeded(eligible, "architect-style-initial");
  const pool = [...shuffledPool.filter((item) => !completed.has(item.id)), ...shuffledPool.filter((item) => completed.has(item.id))];
  return pool.filter((item) => {
    const architect = item.people[0];
    const style = item.styles[0];
    const architectKey = normalizedChoice(architect);
    const styleKey = normalizedChoice(style);
    const building = normalizedChoice(`${item.name.ja}|${item.name.en}`);
    if (usedBuildings.has(building) || usedArchitects.has(architectKey) || usedStyles.has(styleKey)) return false;
    usedBuildings.add(building);
    usedArchitects.add(architectKey);
    usedStyles.add(styleKey);
    return true;
  }).slice(0, 3);
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

function ImageQuiz({ quizBuildings, progress, language, t, detailHref, onReview, record }: PracticeProps) {
  const completed = useMemo(() => new Set(Object.keys(progress.buildings)), [progress.buildings]);
  const [ids, setIds] = useState(() => uniqueQuizBuildings(quizBuildings, false, 10).map((item) => item.id));
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [score, setScore] = useState(0);
  useEffect(() => {
    if (index !== 0 || answer !== null) return;
    const nextIds = uniqueQuizBuildings(quizBuildings, true, 10, completed).map((item) => item.id);
    queueMicrotask(() => setIds(nextIds));
  }, [answer, completed, index, quizBuildings]);
  const byId = useMemo(() => new Map(quizBuildings.map((item) => [item.id, item])), [quizBuildings]);
  const questions = useMemo(() => ids.flatMap((id, questionIndex) => { const target = byId.get(id); if (!target) return []; const targetLabel = normalizedChoice(quizBuildingLabel(target, language)); const distractors = distinctByLabel(seeded(quizBuildings.filter((item) => item.id !== id && normalizedChoice(quizBuildingLabel(item, language)) !== targetLabel), `${id}-${questionIndex}`), (item) => quizBuildingLabel(item, language)).slice(0, 3); const choices = seeded([target, ...distractors], `${id}-choices`); return [{ target, choices }]; }), [byId, ids, language, quizBuildings]);
  const question = questions[index]; const finished = questions.length > 0 && index >= questions.length;
  const restart = () => { setIds(uniqueQuizBuildings(quizBuildings, true, 10, completed).map((item) => item.id)); setIndex(0); setAnswer(null); setScore(0); };
  if (finished) return <ResultCard score={score} total={questions.length} onRestart={restart} t={t} />;
  if (!question) return <IntroCard icon="◉" title={t(COPY.image)} description={t(COPY.imagePrompt)} onStart={restart} t={t} />;
  const choose = (id: string) => { if (answer) return; const correct = id === question.target.id; setAnswer(id); if (correct) setScore((value) => value + 1); record([{ id: question.target.id, correct }], "image", index + 1 === questions.length); };
  return <section className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg"><QuizHeader index={index} total={questions.length} score={score} title={t(COPY.imagePrompt)} /><div className="grid lg:grid-cols-[1.15fr_1fr]"><div className="relative min-h-[320px] bg-stone-100 lg:min-h-[520px]"><Image src={`/architecture-images/${question.target.imageFile}`} alt={t(COPY.imagePrompt)} fill priority unoptimized sizes="(max-width: 1024px) 100vw, 55vw" className="object-contain" /></div><div className="flex flex-col p-5 sm:p-7"><ChoiceButtons choices={question.choices.map((item) => ({ id: item.id, label: quizBuildingLabel(item, language) }))} answer={answer} correctId={question.target.id} onChoose={choose} />{answer && <Feedback correct={answer === question.target.id} t={t}><p className="mt-2 text-sm text-slate-600"><b>{t(COPY.period)}：</b>{quizChronologyLabel(question.target, language)}</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => onReview(question.target.id)} className="text-sm font-bold text-violet-700">{t(COPY.review)} ↗</button><Link href={detailHref(question.target.href)} className="text-sm font-bold text-slate-500">{t(COPY.details)} →</Link></div></Feedback>}<NextButton visible={Boolean(answer)} final={index + 1 === questions.length} onClick={() => { setIndex((value) => value + 1); setAnswer(null); }} t={t} /></div></div></section>;
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
  const eligible = useMemo(() => items.filter((item) => item.people.length > 0 && item.styles.length > 0 && item.image), [items]);
  const completed = useMemo(() => new Set(Object.keys(progress.buildings)), [progress.buildings]);
  const [cards, setCards] = useState(() => pickArchitectStyleCards(eligible, false)); const [architectAnswers, setArchitectAnswers] = useState<Record<string, string>>({}); const [styleAnswers, setStyleAnswers] = useState<Record<string, string>>({}); const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (checked || Object.keys(architectAnswers).length > 0 || Object.keys(styleAnswers).length > 0) return;
    const nextCards = pickArchitectStyleCards(eligible, true, completed);
    queueMicrotask(() => setCards(nextCards));
  }, [architectAnswers, checked, completed, eligible, styleAnswers]);
  const architects = useMemo(() => seeded(cards.map((card) => card.people[0]), cards.map((card) => card.id).join("-")), [cards]);
  const styleChoices = useMemo(() => seeded(cards.map((card) => ({ value: card.styles[0], label: `${card.styles[0]} · ${card.period[language]}` })), `${language}-${cards.map((card) => card.id).join("-")}`), [cards, language]);
  const reset = () => { setCards(pickArchitectStyleCards(eligible, true, completed)); setArchitectAnswers({}); setStyleAnswers({}); setChecked(false); };
  const check = () => { setChecked(true); record(cards.map((card) => ({ id: card.id, correct: architectAnswers[card.id] === card.people[0] && styleAnswers[card.id] === card.styles[0] })), "architect", true); };
  return <section className="mx-auto mt-6 max-w-5xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-black text-slate-900">{t(COPY.architectPrompt)}</h2><p className="mt-2 text-sm text-slate-500">{t(COPY.architectHelp)}</p><div className="mt-6 grid gap-4 lg:grid-cols-3">{cards.map((card) => { const architectCorrect = architectAnswers[card.id] === card.people[0]; const styleCorrect = styleAnswers[card.id] === card.styles[0]; const correct = architectCorrect && styleCorrect; return <article key={card.id} className={`overflow-hidden rounded-2xl border ${checked ? correct ? "border-emerald-300" : "border-rose-300" : "border-stone-200"}`}><div className="relative aspect-[16/9] bg-stone-100"><Image src={`/architecture-images/${card.image!.file}`} alt={libraryBuildingLabel(card, language)} fill unoptimized className="object-cover" /></div><div className="p-4"><h3 className="font-black text-slate-900">{libraryBuildingLabel(card, language)}</h3>{checked && <button type="button" onClick={() => onReview(card.id)} className="mt-1 text-xs font-bold text-violet-700">{t(COPY.review)} ↗</button>}<label className="mt-4 block text-xs font-bold text-slate-500">{t(COPY.architectLabel)}</label><select value={architectAnswers[card.id] ?? ""} onChange={(event) => setArchitectAnswers((current) => ({ ...current, [card.id]: event.target.value }))} disabled={checked} className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"><option value="">—</option>{architects.map((architect) => <option key={architect} value={architect}>{architect}</option>)}</select>{checked && !architectCorrect && <p className="mt-1.5 text-xs font-bold text-rose-700">✓ {card.people[0]}</p>}<label className="mt-4 block text-xs font-bold text-slate-500">{t(COPY.styleMovementLabel)}</label><select value={styleAnswers[card.id] ?? ""} onChange={(event) => setStyleAnswers((current) => ({ ...current, [card.id]: event.target.value }))} disabled={checked} className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"><option value="">—</option>{styleChoices.map((style) => <option key={style.value} value={style.value}>{style.label}</option>)}</select>{checked && !styleCorrect && <p className="mt-1.5 text-xs font-bold text-rose-700">✓ {card.styles[0]} · {card.period[language]}</p>}</div></article>; })}</div>{checked ? <button onClick={reset} className="mt-6 w-full rounded-2xl bg-amber-300 px-5 py-3 font-bold text-slate-950">{t(COPY.nextSet)}</button> : <button onClick={check} disabled={cards.some((card) => !architectAnswers[card.id] || !styleAnswers[card.id])} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-40">{t(COPY.submit)}</button>}</section>;
}

interface DailyQuestion { id: string; buildingId: string; reviewBuildingIds: string[]; prompt: LibraryCopy; image?: string; choices: { id: string; label: string }[]; correctId: string }
function DailyQuiz({ items, quizBuildings, language, t, onReview, record, todayDone, todayScore }: PracticeProps) {
  const date = localDateKey();
  const questions = useMemo(() => {
    const result: DailyQuestion[] = [];
    const imagePool = distinctByLabel(seeded(quizBuildings, `${date}-images`), (item) => `${item.nameJa}|${item.name}`);
    const architectPool = distinctByLabel(seeded(items.filter((item) => item.people.length > 0), `${date}-architects`), (item) => `${item.name.ja}|${item.name.en}`);
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
          const targetArchitect = normalizedChoice(target.people[0]);
          const people = distinctByLabel(seeded(items.filter((item) => item.id !== target.id && item.people.length > 0).map((item) => item.people[0]).filter((person) => normalizedChoice(person) !== targetArchitect), `${date}-${index}`), (person) => person).slice(0, 3);
          const displayName = libraryBuildingLabel(target, language);
          result.push({ id: `architect-${target.id}`, buildingId: target.id, reviewBuildingIds: [target.id], prompt: { zh: `${displayName} 的建筑师是谁？`, ja: `${displayName}の建築家は？`, en: `Who designed ${displayName}?` }, choices: seeded([target.people[0], ...people], `${date}-${index}-people`).map((label) => ({ id: label, label })), correctId: target.people[0] });
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
