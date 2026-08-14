"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarLayout } from "@/components/layout";
import { useExploreLanguage, type ExploreLanguage } from "@/components/ExploreLanguageProvider";
import type { PlanningCopy, PlanningLibraryItem, PlanningPracticeMode } from "@/lib/planning-library-types";
import { PLANNING_MANUAL_PRACTICE_QUESTIONS, type PlanningManualPracticeQuestion } from "@/lib/planning-practice-questions";
import { officialPlanningSource } from "@/lib/first-class-architect-planning-exams";
import {
  EMPTY_PLANNING_LIBRARY_PROGRESS,
  localPlanningDate,
  planningFamiliarity,
  readPlanningProgress,
  writePlanningProgress,
  type PlanningLibraryProgress,
} from "@/lib/planning-library-progress";

type ViewMode = "library" | "photos" | PlanningPracticeMode;
type ImageQuestion = { target: PlanningLibraryItem; choices: PlanningLibraryItem[] };
type ShuffledManualQuestion = Omit<PlanningManualPracticeQuestion, "choicesJa"> & { choicesJa: string[] };

const COPY = {
  back: { zh: "返回探索", ja: "探索に戻る", en: "Back to Explore" },
  eyebrow: { zh: "建筑计划 · 记忆实验室", ja: "建築計画・記憶ラボ", en: "Architectural Planning · Memory Lab" },
  title: { zh: "把零散知识变成可以辨认的关系", ja: "断片的な知識を、見分けられる関係へ", en: "Turn isolated facts into recognizable relationships" },
  intro: { zh: "浏览计划知识，或用短小测试辨认案例、空间特征和数值标准。", ja: "計画知識を閲覧し、短いクイズで事例・空間特性・数値基準を見分けます。", en: "Browse planning knowledge or use short quizzes to distinguish cases, spatial features, and numerical standards." },
  library: { zh: "知识库", ja: "知識ライブラリ", en: "Library" },
  photos: { zh: "图片卡", ja: "画像カード", en: "Image cards" },
  image: { zh: "看图识案例", ja: "画像当て", en: "Image challenge" },
  match: { zh: "案例匹配", ja: "事例マッチ", en: "Case matching" },
  numeric: { zh: "数值速答", ja: "数値クイズ", en: "Numeric recall" },
  daily: { zh: "每日十题", ja: "今日の10問", en: "Daily ten" },
  search: { zh: "搜索案例、设施或关键词", ja: "事例・施設・キーワードを検索", en: "Search cases, facilities, or keywords" },
  allCategories: { zh: "全部类别", ja: "すべての分野", en: "All categories" },
  allProgress: { zh: "全部进度", ja: "すべての進捗", en: "All progress" },
  unseen: { zh: "未学习", ja: "未学習", en: "Unseen" },
  learning: { zh: "学习中", ja: "学習中", en: "Learning" },
  familiar: { zh: "较熟悉", ja: "ほぼ定着", en: "Familiar" },
  mastered: { zh: "已掌握", ja: "習得済み", en: "Mastered" },
  sourceNote: { zh: "日文考试知识原文", ja: "試験知識の原文", en: "Original Japanese exam note" },
  showAnswer: { zh: "展开要点", ja: "要点を見る", en: "Show key points" },
  hideAnswer: { zh: "收起", ja: "閉じる", en: "Collapse" },
  results: { zh: "显示", ja: "表示", en: "Showing" },
  loadMore: { zh: "再显示 60 条", ja: "さらに60件表示", en: "Show 60 more" },
  attempts: { zh: "练习次数", ja: "練習回数", en: "Attempts" },
  accuracy: { zh: "正确率", ja: "正答率", en: "Accuracy" },
  streak: { zh: "连续学习", ja: "連続学習", en: "Daily streak" },
  days: { zh: "天", ja: "日", en: "days" },
  startMatch: { zh: "每组三题：从三个说明中找出与案例或知识点对应的一项。", ja: "1セット3問。事例・用語に対応する説明を三つから選びます。", en: "Three questions per set: match each case or term with the correct explanation." },
  startNumeric: { zh: "每组三题：辨认 UD、停车场和各类设施的尺寸与数值条件。", ja: "1セット3問。UD・駐車場・各施設の寸法や数値条件を見分けます。", en: "Three questions per set on dimensions and numerical conditions for UD, parking, and facilities." },
  startDaily: { zh: "每天固定十题，混合案例与数值知识，并记录连续学习天数。", ja: "毎日固定の10問。事例と数値知識を組み合わせ、連続学習日数を記録します。", en: "A fixed daily set of ten mixed case and numeric questions, with a daily streak." },
  start: { zh: "开始", ja: "始める", en: "Start" },
  question: { zh: "下列哪项说明与这个知识点相符？", ja: "この知識項目に当てはまる説明はどれですか？", en: "Which explanation matches this knowledge item?" },
  correct: { zh: "回答正确", ja: "正解です", en: "Correct" },
  incorrect: { zh: "再留意这个区别", ja: "この違いをもう一度確認しましょう", en: "Review this distinction" },
  next: { zh: "下一题", ja: "次の問題", en: "Next question" },
  finish: { zh: "查看结果", ja: "結果を見る", en: "View results" },
  newSet: { zh: "换一组", ja: "別のセット", en: "New set" },
  quickReview: { zh: "快速回顾", ja: "クイックレビュー", en: "Quick review" },
  close: { zh: "关闭", ja: "閉じる", en: "Close" },
  complete: { zh: "本组完成", ja: "セット完了", en: "Set complete" },
  dailyComplete: { zh: "今天的十题完成", ja: "今日の10問が完了しました", en: "Today’s ten completed" },
  noResults: { zh: "没有符合条件的知识卡。", ja: "条件に合う知識カードがありません。", en: "No knowledge cards match these filters." },
  cleaned: { zh: "条空白或重复记录已从练习池排除", ja: "件の空欄・重複レコードを練習対象外にしました", en: "blank or duplicate records excluded from practice" },
  imageOnly: { zh: "查看图片", ja: "画像を見る", en: "View image" },
  photoIntro: { zh: "集中浏览原 Anki 中的图片与图面。", ja: "元のAnkiに収録されていた写真・図面をまとめて閲覧できます。", en: "Browse the photographs and drawings from the original Anki deck." },
  openPractice: { zh: "进入计划记忆练习", ja: "計画の記憶練習へ", en: "Open planning memory practice" },
  backLibrary: { zh: "返回知识库", ja: "知識ライブラリに戻る", en: "Back to library" },
  practiceTitle: { zh: "看图、联想、补数值", ja: "見て、結んで、数値を埋める", en: "See, connect, and fill the value" },
  practiceIntro: { zh: "图片、概念和数值可分别练习，每局三题；每日题组为十题。", ja: "画像・概念・数値は1ゲーム3問ずつ、デイリーセットは10問に挑戦します。", en: "Practice images, concepts, and values in three-question games, or take the ten-question daily set." },
  stars: { zh: "获得星星", ja: "獲得スター", en: "Stars earned" },
  challenged: { zh: "挑战卡片", ja: "挑戦カード", en: "Cards challenged" },
  imageHelp: { zh: "观察图片，从三个名称中选择正确案例。", ja: "画像を見て、三つの名称から正しい事例を選びます。", en: "Identify the case shown in the image from three names." },
  imageQuestion: { zh: "这是什么案例？", ja: "この画像はどの事例？", en: "Which case is shown?" },
  numericHelp: { zh: "阅读人工整理的条件题，选择正确数值。", ja: "整理済みの条件問題を読み、正しい数値を選びます。", en: "Read a curated condition question and choose the correct value." },
  numericQuestion: { zh: "正确数值是哪一项？", ja: "正しい数値はどれ？", en: "Which value is correct?" },
} satisfies Record<string, PlanningCopy>;

const MODE_OPTIONS: { value: ViewMode; label: keyof typeof COPY; icon: string }[] = [
  { value: "library", label: "library", icon: "▦" },
  { value: "photos", label: "photos", icon: "▧" },
  { value: "match", label: "match", icon: "↔" },
  { value: "numeric", label: "numeric", icon: "#" },
  { value: "daily", label: "daily", icon: "✦" },
];
const PRACTICE_OPTIONS: { value: ViewMode; label: keyof typeof COPY; icon: string }[] = [
  { value: "image", label: "image", icon: "▧" },
  { value: "match", label: "match", icon: "↔" },
  { value: "numeric", label: "numeric", icon: "#" },
  { value: "daily", label: "daily", icon: "✦" },
];

function hash(value: string) { let result = 0; for (let index = 0; index < value.length; index += 1) result = (result * 31 + value.charCodeAt(index)) >>> 0; return result; }
function seeded<T>(values: T[], seed: string) { return [...values].sort((a, b) => hash(`${seed}-${JSON.stringify(a)}`) - hash(`${seed}-${JSON.stringify(b)}`)); }
function normalized(value: string) { return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase(); }
const randomSessionSeed = (mode: string) => `${mode}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function buildImageQuestions(pool: PlanningLibraryItem[], count: number, seed: string, completed: Set<string>): ImageQuestion[] {
  const targets = [...seeded(pool.filter((item) => !completed.has(item.id)), `${seed}-unseen`), ...seeded(pool.filter((item) => completed.has(item.id)), `${seed}-review`)].slice(0, count);
  return targets.flatMap((target, index) => {
    const seen = new Set([normalized(target.answer)]);
    const distractors = seeded(pool.filter((item) => item.id !== target.id), `${seed}-${target.id}-${index}`).filter((item) => {
      const key = normalized(item.answer);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 2);
    return distractors.length === 2 ? [{ target, choices: seeded([target, ...distractors], `${seed}-${target.id}-choices`) }] : [];
  });
}

function spreadManualCategories(questions: PlanningManualPracticeQuestion[], seed: string) {
  const buckets = new Map<string, PlanningManualPracticeQuestion[]>();
  for (const question of questions) {
    const bucket = buckets.get(question.categoryJa) ?? [];
    bucket.push(question);
    buckets.set(question.categoryJa, bucket);
  }

  const categories = seeded([...buckets.keys()], `${seed}-categories`);
  const orderedBuckets = new Map(categories.map((category) => [category, seeded(buckets.get(category) ?? [], `${seed}-${category}`)]));
  const result: PlanningManualPracticeQuestion[] = [];
  let depth = 0;
  while (result.length < questions.length) {
    for (const category of categories) {
      const question = orderedBuckets.get(category)?.[depth];
      if (question) result.push(question);
    }
    depth += 1;
  }
  return result;
}

function buildManualQuestions(mode: PlanningPracticeMode, count: number, seed: string, completed: Set<string>) {
  const pool = PLANNING_MANUAL_PRACTICE_QUESTIONS.filter((question) => mode === "daily" || question.mode === mode);
  const ordered = mode === "daily" ? (() => {
    const matchQuestions = spreadManualCategories(pool.filter((question) => question.mode === "match"), `${seed}-daily-match`).slice(0, 7);
    const matchCategories = new Set(matchQuestions.map((question) => question.categoryJa));
    const numericPool = spreadManualCategories(pool.filter((question) => question.mode === "numeric"), `${seed}-daily-numeric`);
    const numericQuestions = [
      ...numericPool.filter((question) => !matchCategories.has(question.categoryJa)),
      ...numericPool.filter((question) => matchCategories.has(question.categoryJa)),
    ].slice(0, 3);
    return seeded([...matchQuestions, ...numericQuestions], `${seed}-daily-order`);
  })() : [
    ...spreadManualCategories(pool.filter((question) => !completed.has(`manual:${question.id}`)), `${seed}-unseen`),
    ...spreadManualCategories(pool.filter((question) => completed.has(`manual:${question.id}`)), `${seed}-review`),
  ];
  return ordered.slice(0, count).map((question, index) => ({ ...question, choicesJa: seeded([...question.choicesJa], `${seed}-${index}-choices`) }));
}

function familiarityClass(level: ReturnType<typeof planningFamiliarity>) {
  return level === "mastered" ? "bg-emerald-100 text-emerald-800" : level === "familiar" ? "bg-sky-100 text-sky-800" : level === "learning" ? "bg-amber-100 text-amber-800" : "bg-stone-100 text-stone-500";
}

export default function PlanningLibraryClient({ items, excludedCount, surface }: { items: PlanningLibraryItem[]; excludedCount: number; surface: "library" | "practice" }) {
  const { language } = useExploreLanguage();
  const t = (copy: PlanningCopy) => copy[language];
  const [mode, setMode] = useState<ViewMode>(surface === "library" ? "library" : "image");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [limit, setLimit] = useState(60);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reviewItem, setReviewItem] = useState<PlanningLibraryItem | null>(null);
  const [progress, setProgress] = useState<PlanningLibraryProgress>(EMPTY_PLANNING_LIBRARY_PROGRESS);

  useEffect(() => {
    const timer = window.setTimeout(() => setProgress(readPlanningProgress()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateProgress = useCallback((id: string, correct: boolean, practiceMode: PlanningPracticeMode) => {
    setProgress((current) => {
      const previous = current.items[id] ?? { attempts: 0, correct: 0, streak: 0, lastSeenAt: "", byMode: {} };
      const modePrevious = previous.byMode[practiceMode] ?? { attempts: 0, correct: 0 };
      const next: PlanningLibraryProgress = { ...current, items: { ...current.items, [id]: {
        attempts: previous.attempts + 1,
        correct: previous.correct + (correct ? 1 : 0),
        streak: correct ? previous.streak + 1 : 0,
        lastSeenAt: new Date().toISOString(),
        byMode: { ...previous.byMode, [practiceMode]: { attempts: modePrevious.attempts + 1, correct: modePrevious.correct + (correct ? 1 : 0) } },
      } } };
      writePlanningProgress(next);
      return next;
    });
  }, []);

  const completeSession = useCallback((practiceMode: PlanningPracticeMode, correct: number, total: number) => {
    setProgress((current) => {
      const date = localPlanningDate();
      const sessions = practiceMode === "daily"
        ? [...current.sessions.filter((session) => !(session.mode === "daily" && session.date === date)), { mode: practiceMode, date, correct, total, completedAt: new Date().toISOString() }]
        : [...current.sessions, { mode: practiceMode, date, correct, total, completedAt: new Date().toISOString() }];
      const next = { ...current, sessions };
      writePlanningProgress(next);
      return next;
    });
  }, []);

  const categories = useMemo(() => Array.from(new Map(items.map((item) => [item.categoryKey, item.category])).entries()), [items]);
  const filtered = useMemo(() => items.filter((item) => {
    const text = normalized(`${item.prompt} ${item.answer} ${item.category.zh} ${item.category.ja}`);
    return (!query.trim() || text.includes(normalized(query)))
      && (category === "all" || item.categoryKey === category)
      && (progressFilter === "all" || planningFamiliarity(progress.items[item.id]) === progressFilter);
  }), [category, items, progress.items, progressFilter, query]);
  const correct = Object.values(progress.items).reduce((sum, item) => sum + item.correct, 0);
  const mastery = Object.values(progress.items).filter((item) => planningFamiliarity(item) === "mastered").length;

  return <SidebarLayout>
    <div className="min-h-full bg-[#f5f4ef] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href={surface === "library" ? "/explore" : "/planning/library"} className="text-sm text-slate-500 hover:text-violet-700">← {t(surface === "library" ? COPY.back : COPY.backLibrary)}</Link>
        <header className="mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 p-6 text-white shadow-xl sm:p-9">
          <p className="text-xs font-bold tracking-[0.2em] text-amber-300">{t(COPY.eyebrow)}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">{t(surface === "library" ? COPY.title : COPY.practiceTitle)}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-indigo-100">{t(surface === "library" ? COPY.intro : COPY.practiceIntro)}</p>
          {surface === "library" ? <Link href="/planning/practice" className="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950">{t(COPY.openPractice)} →</Link> : <div className="mt-6 grid gap-3 sm:grid-cols-3"><Stat label={t(COPY.challenged)} value={String(Object.keys(progress.items).length)} /><Stat label={t(COPY.stars)} value={`★ ${correct}`} /><Stat label={t(COPY.mastered)} value={String(mastery)} /></div>}
        </header>

        <nav className={`mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm ${surface === "library" ? "sm:grid-cols-2" : "sm:grid-cols-5"}`}>
          {(surface === "library" ? MODE_OPTIONS.filter((option) => option.value === "library" || option.value === "photos") : PRACTICE_OPTIONS).map((option) => <button key={option.value} onClick={() => setMode(option.value)} className={`rounded-xl px-3 py-3 text-sm font-bold transition ${mode === option.value ? "bg-violet-700 text-white" : "text-slate-600 hover:bg-violet-50"}`}><span className="mr-2">{option.icon}</span>{t(COPY[option.label])}</button>)}
        </nav>

        {mode === "library" ? <section className="mt-6">
          <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[1fr_220px_180px]">
            <input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(60); }} placeholder={t(COPY.search)} className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400" />
            <select value={category} onChange={(event) => { setCategory(event.target.value); setLimit(60); }} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm"><option value="all">{t(COPY.allCategories)}</option>{categories.map(([key, label]) => <option key={key} value={key}>{label[language]}</option>)}</select>
            <select value={progressFilter} onChange={(event) => { setProgressFilter(event.target.value); setLimit(60); }} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm"><option value="all">{t(COPY.allProgress)}</option>{(["unseen", "learning", "familiar", "mastered"] as const).map((value) => <option key={value} value={value}>{t(COPY[value])}</option>)}</select>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500"><p>{t(COPY.results)} <strong>{Math.min(limit, filtered.length)}</strong> / {filtered.length} · {items.length} cards</p><p>{excludedCount} {t(COPY.cleaned)} · {mastery} {t(COPY.mastered)}</p></div>
          {filtered.length ? <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, limit).map((item) => {
            const open = expanded.has(item.id); const level = planningFamiliarity(progress.items[item.id]);
            return <article key={item.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">{item.category[language]}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${familiarityClass(level)}`}>{t(COPY[level])}</span></div>
              <h2 className="mt-4 text-lg font-black leading-7">{item.prompt}</h2><p className="mt-1 text-xs text-slate-400">{t(COPY.sourceNote)}{item.numeric ? " · #" : ""}</p>
              {open && item.answer && <p className="mt-4 border-t border-stone-100 pt-4 text-sm leading-7 text-slate-700">{item.answer}</p>}
              {item.answer ? <button onClick={() => setExpanded((current) => { const next = new Set(current); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next; })} className="mt-4 text-sm font-bold text-violet-700">{open ? t(COPY.hideAnswer) : t(COPY.showAnswer)} {open ? "↑" : "↓"}</button> : <button onClick={() => setReviewItem(item)} className="mt-4 text-sm font-bold text-violet-700">{t(COPY.imageOnly)} ↗</button>}
            </article>;
          })}</div> : <p className="mt-10 text-center text-slate-500">{t(COPY.noResults)}</p>}
          {limit < filtered.length && <button onClick={() => setLimit((value) => value + 60)} className="mx-auto mt-6 block rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white">{t(COPY.loadMore)}</button>}
        </section> : mode === "photos" ? <PhotoGallery items={items} progress={progress} onReview={setReviewItem} t={t} /> : <PracticeArea key={mode} mode={mode as PlanningPracticeMode} items={items} progress={progress} language={language} t={t} onResult={updateProgress} onComplete={completeSession} onReview={setReviewItem} />}
      </div>
      {reviewItem && <ReviewModal item={reviewItem} language={language} t={t} onClose={() => setReviewItem(null)} />}
    </div>
  </SidebarLayout>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white/10 px-4 py-3"><p className="text-xs text-indigo-200">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>; }

function PhotoGallery({ items, progress, onReview, t }: { items: PlanningLibraryItem[]; progress: PlanningLibraryProgress; onReview: (item: PlanningLibraryItem) => void; t: (copy: PlanningCopy) => string }) {
  const imageItems = useMemo(() => items.filter((item) => item.images.length > 0), [items]);
  const categories = useMemo(() => Array.from(new Map(imageItems.map((item) => [item.categoryKey, item.category.ja])).entries()), [imageItems]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [limit, setLimit] = useState(40);
  const filtered = useMemo(() => imageItems.filter((item) => (!query.trim() || normalized(`${item.prompt} ${item.answer}`).includes(normalized(query))) && (category === "all" || item.categoryKey === category)), [category, imageItems, query]);
  return <section className="mt-6">
    <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black">{t(COPY.photos)}</h2><p className="mt-2 text-sm text-slate-500">{t(COPY.photoIntro)}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_240px]"><input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(40); }} placeholder={t(COPY.search)} className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400" /><select value={category} onChange={(event) => { setCategory(event.target.value); setLimit(40); }} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm"><option value="all">{t(COPY.allCategories)}</option>{categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
    </div>
    <p className="mt-4 text-xs text-slate-500">{t(COPY.results)} <strong>{Math.min(limit, filtered.length)}</strong> / {filtered.length} · {imageItems.length} cards</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.slice(0, limit).map((item) => {
      const level = planningFamiliarity(progress.items[item.id]);
      return <button key={item.id} type="button" onClick={() => onReview(item)} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-stone-100"><Image src={`/planning-images/${item.images[0]}`} alt={item.prompt} fill unoptimized sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 92vw" className="object-contain" />{item.images.length > 1 && <span className="absolute bottom-2 right-2 rounded-full bg-slate-950/75 px-2 py-1 text-[11px] font-bold text-white">+{item.images.length - 1}</span>}</div>
        <div className="p-4"><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">{item.category.ja}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${familiarityClass(level)}`}>{t(COPY[level])}</span></div><h3 className="mt-3 text-lg font-black leading-7 text-slate-900">{item.prompt}</h3><p className="mt-3 text-xs font-bold text-violet-700">{t(COPY.quickReview)} ↗</p></div>
      </button>;
    })}</div>
    {limit < filtered.length && <button onClick={() => setLimit((value) => value + 40)} className="mx-auto mt-6 block rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white">{t(COPY.loadMore)}</button>}
  </section>;
}

function PracticeArea({ mode, items, progress, language, t, onResult, onComplete, onReview }: { mode: PlanningPracticeMode; items: PlanningLibraryItem[]; progress: PlanningLibraryProgress; language: ExploreLanguage; t: (copy: PlanningCopy) => string; onResult: (id: string, correct: boolean, mode: PlanningPracticeMode) => void; onComplete: (mode: PlanningPracticeMode, correct: number, total: number) => void; onReview: (item: PlanningLibraryItem) => void }) {
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState("");
  const [completedAtStart, setCompletedAtStart] = useState<string[]>([]);
  const completed = useMemo(() => new Set(completedAtStart), [completedAtStart]);
  const imagePool = useMemo(() => items.filter((item) => item.images.length > 0), [items]);
  const imageQuestions = useMemo(() => buildImageQuestions(imagePool, 3, seed, completed), [completed, imagePool, seed]);
  const manualQuestions = useMemo(() => buildManualQuestions(mode, mode === "daily" ? 10 : 3, seed, completed), [completed, mode, seed]);
  const itemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const description = mode === "image" ? COPY.imageHelp : mode === "match" ? COPY.startMatch : mode === "numeric" ? COPY.numericHelp : COPY.startDaily;
  const start = () => { setCompletedAtStart(Object.keys(progress.items)); setSeed(mode === "daily" ? localPlanningDate() : randomSessionSeed(mode)); setStarted(true); };
  if (!started) return <Intro icon={mode === "image" ? "▧" : mode === "match" ? "↔" : mode === "numeric" ? "#" : "✦"} title={t(COPY[mode])} description={t(description)} onStart={start} start={mode === "daily" ? `今日の10問 · ${t(COPY.start)}` : `ランダム3問 · ${t(COPY.start)}`} />;
  const restart = () => { setStarted(false); setSeed(""); };
  return mode === "image"
    ? <ImageQuiz questions={imageQuestions} language={language} t={t} onResult={onResult} onComplete={onComplete} onReview={onReview} onRestart={restart} />
    : <ManualQuiz questions={manualQuestions} mode={mode} itemById={itemById} t={t} onResult={onResult} onComplete={onComplete} onReview={onReview} onRestart={restart} />;
}

function Intro({ icon, title, description, onStart, start }: { icon: string; title: string; description: string; onStart: () => void; start: string }) { return <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"><div className="text-5xl">{icon}</div><h2 className="mt-4 text-2xl font-black">{title}</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">{description}</p><button onClick={onStart} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950">{start}</button></section>; }

function ImageQuiz({ questions, language, t, onResult, onComplete, onReview, onRestart }: { questions: ImageQuestion[]; language: ExploreLanguage; t: (copy: PlanningCopy) => string; onResult: (id: string, correct: boolean, mode: PlanningPracticeMode) => void; onComplete: (mode: PlanningPracticeMode, correct: number, total: number) => void; onReview: (item: PlanningLibraryItem) => void; onRestart: () => void }) {
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [score, setScore] = useState(0);
  const question = questions[index];
  if (!question) return <section className="mx-auto mt-6 max-w-3xl rounded-3xl bg-white p-10 text-center"><p className="text-4xl font-black">{score} / {questions.length}</p><p className="mt-3 font-bold text-violet-700">{t(COPY.complete)}</p><button onClick={onRestart} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold">{t(COPY.newSet)}</button></section>;
  const correct = answer === question.target.id;
  const choose = (id: string) => { if (answer) return; const isCorrect = id === question.target.id; setAnswer(id); if (isCorrect) setScore((value) => value + 1); onResult(question.target.id, isCorrect, "image"); };
  const next = () => { const final = index + 1 === questions.length; if (final) onComplete("image", score + (correct ? 1 : 0), questions.length); setIndex((value) => value + 1); setAnswer(null); };
  return <section className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4"><div><p className="text-xs font-bold text-violet-600">{index + 1} / {questions.length}</p><h2 className="mt-1 text-xl font-black">{t(COPY.imageQuestion)}</h2></div><p className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold">★ {score}</p></div>
    <div className="p-6"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{question.target.category[language]}</span></div><div className="relative mx-auto mt-4 aspect-[4/3] max-w-2xl overflow-hidden rounded-2xl bg-stone-100"><Image src={`/planning-images/${question.target.images[0]}`} alt="出題画像" fill unoptimized className="object-contain" /></div>
      <div className="mt-6 grid gap-3">{question.choices.map((choice, choiceIndex) => { const isCorrect = choice.id === question.target.id; const chosen = answer === choice.id; return <button key={choice.id} disabled={Boolean(answer)} onClick={() => choose(choice.id)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold leading-6 ${answer && isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-900" : answer && chosen ? "border-rose-300 bg-rose-50 text-rose-800" : "border-stone-200 hover:border-violet-300 hover:bg-violet-50"}`}><span className="mr-2 text-stone-400">{String.fromCharCode(65 + choiceIndex)}.</span>{choice.prompt}</button>; })}</div>
      {answer && <div className={`mt-5 rounded-2xl p-4 ${correct ? "bg-emerald-50" : "bg-amber-50"}`}><p className="font-black">{correct ? t(COPY.correct) : t(COPY.incorrect)}</p><button onClick={() => onReview(question.target)} className="mt-2 text-sm font-bold text-violet-700">{t(COPY.quickReview)} ↗</button></div>}
      {answer && <button onClick={next} className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">{index + 1 === questions.length ? t(COPY.finish) : t(COPY.next)}</button>}
    </div>
  </section>;
}

function ManualQuiz({ questions, mode, itemById, t, onResult, onComplete, onReview, onRestart }: { questions: ShuffledManualQuestion[]; mode: PlanningPracticeMode; itemById: Map<string, PlanningLibraryItem>; t: (copy: PlanningCopy) => string; onResult: (id: string, correct: boolean, mode: PlanningPracticeMode) => void; onComplete: (mode: PlanningPracticeMode, correct: number, total: number) => void; onReview: (item: PlanningLibraryItem) => void; onRestart: () => void }) {
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [score, setScore] = useState(0); const question = questions[index];
  if (!question) return <section className="mx-auto mt-6 max-w-3xl rounded-3xl bg-white p-10 text-center"><p className="text-4xl font-black">{score} / {questions.length}</p><p className="mt-3 font-bold text-violet-700">{mode === "daily" ? t(COPY.dailyComplete) : t(COPY.complete)}</p><button onClick={onRestart} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold">{t(COPY.newSet)}</button></section>;
  const correct = answer === question.answerJa;
  const reviewItem = question.reviewItemId ? itemById.get(question.reviewItemId) : undefined;
  const officialSource = officialPlanningSource(question.id);
  const choose = (value: string) => { if (answer) return; const result = value === question.answerJa; setAnswer(value); if (result) setScore((current) => current + 1); onResult(`manual:${question.id}`, result, mode); };
  const next = () => { if (index + 1 === questions.length) onComplete(mode, score + (correct ? 1 : 0), questions.length); setIndex((current) => current + 1); setAnswer(null); };
  return <section className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-stone-100 px-6 py-4"><div><p className="text-xs font-bold text-violet-600">{index + 1} / {questions.length}</p><h2 className="mt-1 text-xl font-black">{t(mode === "numeric" ? COPY.numericQuestion : COPY.question)}</h2></div><p className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold">★ {score}</p></div><div className="p-6"><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{question.categoryJa}</span><h3 className="mt-4 text-xl font-black leading-8">{question.promptJa}</h3><div className="mt-5 grid gap-3">{question.choicesJa.map((choice, choiceIndex) => <button key={choice} disabled={Boolean(answer)} onClick={() => choose(choice)} className={`rounded-2xl border px-4 py-4 text-left font-bold ${answer && choice === question.answerJa ? "border-emerald-400 bg-emerald-50 text-emerald-800" : answer === choice ? "border-rose-300 bg-rose-50 text-rose-700" : "border-stone-200 hover:border-violet-300"}`}><span className="mr-2 text-stone-400">{String.fromCharCode(65 + choiceIndex)}.</span>{choice}</button>)}</div>{answer && <div className={`mt-5 rounded-2xl p-4 ${correct ? "bg-emerald-50" : "bg-amber-50"}`}><p className="font-black">{correct ? t(COPY.correct) : t(COPY.incorrect)}</p><p className="mt-2 font-bold text-slate-800">練習題正解：{question.answerJa}</p><p className="mt-2 text-sm leading-7 text-slate-700">{question.explanationJa}</p>{officialSource && <div className="mt-4 rounded-xl border border-violet-200 bg-white/70 p-3"><p className="text-sm font-black text-violet-900">公式原題正答：第 {officialSource.answer} 肢</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-violet-700"><a href={officialSource.exam.questionHref} target="_blank" rel="noreferrer">{officialSource.exam.eraLabel} No.{officialSource.questionNo} 問題PDF ↗</a><a href={officialSource.exam.answerHref} target="_blank" rel="noreferrer">公式正答PDF ↗</a></div></div>}{!officialSource && question.sourceHref && <a href={question.sourceHref} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-bold text-violet-700">出典：{question.sourceLabel ?? "公式過去問"} ↗</a>}{reviewItem && <button onClick={() => onReview(reviewItem)} className="mt-2 block text-sm font-bold text-violet-700">{t(COPY.quickReview)} ↗</button>}</div>}{answer && <button onClick={next} className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">{index + 1 === questions.length ? t(COPY.finish) : t(COPY.next)}</button>}</div></section>;
}

function ReviewModal({ item, language, t, onClose }: { item: PlanningLibraryItem; language: ExploreLanguage; t: (copy: PlanningCopy) => string; onClose: () => void }) {
  useEffect(() => { const previous = document.body.style.overflow; const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.body.style.overflow = "hidden"; window.addEventListener("keydown", escape); return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", escape); }; }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section role="dialog" aria-modal="true" aria-label={t(COPY.quickReview)} className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-violet-700">{t(COPY.quickReview)}</p><span className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{item.category[language]}</span><h2 className="mt-4 text-2xl font-black">{item.prompt}</h2></div><button onClick={onClose} aria-label={t(COPY.close)} className="rounded-full bg-stone-100 px-4 py-2 text-xl text-slate-500">×</button></div>{item.images.length > 0 && <div className={`mt-6 grid gap-3 ${item.images.length > 1 ? "sm:grid-cols-2" : ""}`}>{item.images.map((file, index) => <div key={file} className="relative min-h-64 overflow-hidden rounded-2xl bg-stone-100"><Image src={`/planning-images/${file}`} alt={`${item.prompt}${item.images.length > 1 ? ` ${index + 1}` : ""}`} fill unoptimized sizes="(min-width: 640px) 42rem, 92vw" className="object-contain" /></div>)}</div>}{item.answer && <p className="mt-6 border-t border-stone-100 pt-6 leading-8 text-slate-700">{item.answer}</p>}<button onClick={onClose} className="mt-7 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white">{t(COPY.close)}</button></section></div>;
}
