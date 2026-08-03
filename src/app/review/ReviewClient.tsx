"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import {
  readStudyRecords,
  STUDY_RECORDS_EVENT,
  STUDY_STATUS_META,
  type StudyRecordMap,
  type StudyStatus,
} from "@/lib/study-records";
import { readReviewStates, migrateFromV1, markResolved, markLater, reportIssue, type ReviewState } from "@/lib/review-states";
import { readAttempts, type AttemptRecord } from "@/lib/attempt-records";
import {
  getLocalizedReviewItem,
  REVIEW_ITEMS,
  REVIEW_SUBJECT_META,
  REVIEW_TASK_TYPE_LABELS,
  REVIEW_TASK_TYPE_LABELS_JA,
  type ReviewItem,
  type ReviewItemMedia,
  type ReviewLocale,
  type ReviewItemSource,
  type ReviewItemSubject,
} from "@/lib/review-items";
import {
  isReviewItemDue,
  readReviewItemStates,
  REVIEW_ITEM_STATES_EVENT,
  saveReviewItemRating,
  type ReviewItemRating,
  type ReviewItemState,
  type ReviewItemStateMap,
} from "@/lib/review-item-states";
import ReviewInboxPanel from "./ReviewInboxPanel";

const tabs: { value: Exclude<StudyStatus, "unseen" | "correct">; labelZh: string; labelJa: string; emptyZh: string; emptyJa: string }[] = [
  { value: "wrong", labelZh: "错题", labelJa: "誤答", emptyZh: "还没有错题记录。", emptyJa: "誤答の記録はまだありません。" },
  { value: "uncertain", labelZh: "不确定", labelJa: "不確実", emptyZh: "目前没有不确定的题。", emptyJa: "不確実とした問題はありません。" },
  { value: "later", labelZh: "稍后再做", labelJa: "後で解く", emptyZh: "目前没有被放到稍后的题。", emptyJa: "後で解く問題はありません。" },
];

const ratingMeta: Record<
  ReviewItemRating,
  { labelZh: string; labelJa: string; shortZh: string; shortJa: string; color: string }
> = {
  0: { labelZh: "完全想不起", labelJa: "まったく思い出せない", shortZh: "0 · 不會", shortJa: "0 · 不明", color: "bg-rose-600 text-white hover:bg-rose-700" },
  1: { labelZh: "只有印象", labelJa: "見覚えだけある", shortZh: "1 · 印象", shortJa: "1 · 曖昧", color: "bg-amber-500 text-white hover:bg-amber-600" },
  2: { labelZh: "缺少一部分", labelJa: "一部不足", shortZh: "2 · 部分", shortJa: "2 · 一部", color: "bg-sky-600 text-white hover:bg-sky-700" },
  3: { labelZh: "能完整回答", labelJa: "完全に答えられる", shortZh: "3 · 完整", shortJa: "3 · 完答", color: "bg-emerald-600 text-white hover:bg-emerald-700" },
};

const subjectCardColors: Record<ReviewItemSubject, string> = {
  environment: "border-cyan-200 bg-cyan-50/70",
  construction: "border-orange-200 bg-orange-50/70",
  planning: "border-violet-200 bg-violet-50/70",
  history: "border-amber-200 bg-amber-50/70",
  mechanics: "border-emerald-200 bg-emerald-50/70",
};

const sourceKindLabels: Record<ReviewItemSource["kind"], { zh: string; ja: string }> = {
  notion: { zh: "Notion", ja: "Notion" },
  pdf: { zh: "PDF", ja: "PDF" },
  site: { zh: "網站", ja: "サイト" },
  question: { zh: "真題", ja: "過去問" },
};

const reviewCopy = {
  zh: {
    headerTitle: "把「有印象」變成能閉卷回答",
    headerDescription: "這裡不取代 Notion、PDF 或知識地圖。先從一個最小問題開始，回答後只看最低答案，再把結果排進下一輪。",
    practiceLink: "前往练习页",
    today: "TODAY · 閉卷優先",
    todayTitle: "今天先處理 6 個復盤單元",
    todayDescription: (count: number) => `共有 ${count} 個未複盤或已到期條目；跨科目抽取，不要求一次清空。`,
    viewAll: "查看全部 30 條",
    overview: "覆蓋總覽",
    overviewTitle: "只計算已建立的復盤單元",
    overviewDescription: "「完整」代表最近一次能完整回答，不宣稱永久掌握。",
    columns: ["科目", "條目", "已複盤", "完整", "已到期", "來源類型"],
    library: "復盤資料庫",
    libraryTitle: "搜尋、定位來源，再完成一次提取",
    showing: (shown: number, total: number) => `顯示 ${shown} / ${total}`,
    search: "搜尋：スランプ、Semper、dB、煙突效應……",
    allSubjects: "全部科目", allTypes: "全部類型", allPriorities: "全部優先級", core: "核心", support: "補充",
    allStatuses: "全部狀態", unreviewed: "未複盤", due: "已到期", weak: "0–1 分", mastered: "最近完整", allSources: "全部來源",
    noItems: "沒有符合目前條件的條目。",
    queue: "回流隊列", queueTitle: "重新處理需要補的題", legacy: "舊版", wrong: "錯題", uncertain: "不確定", later: "稍後", migrated: "遷移",
    errorLibrary: "新版錯題庫（含分類與復習計畫）", all: "全部", dueReview: "到期復習", history: "建築史", planning: "建築計畫", environment: "環境工學", construction: "建築構法", reported: "已報告", temporary: "暫時掌握",
    noDue: "沒有到期復習的題目。", noReported: "沒有被報告的題目。", noErrors: "還沒有錯題記錄。做真題時標記「錯題」後會出現在這裡。",
    dueBadge: "到期", reportedBadge: "已報告", unknownSubject: "未知科目", wrongTimes: (n: number) => `錯${n}次`, nextReview: "下次復習", now: "現在",
    retry: "重新作答", resolve: "標記掌握", laterButton: "稍後", report: "報告問題", goPast: "去做過去問",
    question: "問題", attempts: "已記錄", times: "次", latest: "最近答案", correct: "正確答案", errorTimes: "錯誤次數", cognitive: "認知任務", relation: "知識關係", topics: "主題", errorReason: "錯誤原因", unclassified: "尚未分類", basis: "答案依據", retryAgain: "再次作答",
    last: "上次", minimum: "最低答案", compare: "先比較剛才的回答，再自評：", reveal: "先回答，再顯示最低答案", related: "關聯", sourceUnavailable: "原檔尚未放入公開網站",
  },
  ja: {
    headerTitle: "「見覚えがある」を、閉じた状態で答えられる知識へ",
    headerDescription: "Notion、PDF、知識マップを置き換えるページではありません。最小の問いに先に答え、最低限の解答と比較して、次の復習日を決めます。",
    practiceLink: "練習ページへ",
    today: "TODAY · 想起を優先",
    todayTitle: "今日は6ユニットだけ復習する",
    todayDescription: (count: number) => `未復習または期限到来の項目は ${count} 件です。科目をまたいで選び、一度に全部終わらせる必要はありません。`,
    viewAll: "全30件を見る",
    overview: "カバー状況",
    overviewTitle: "登録済みの復習ユニットだけを集計",
    overviewDescription: "「完答」は直近の自己評価であり、永久に習得したという意味ではありません。",
    columns: ["科目", "項目", "復習済", "完答", "期限到来", "情報源"],
    library: "復習ライブラリ",
    libraryTitle: "検索して出典を確認し、もう一度思い出す",
    showing: (shown: number, total: number) => `${shown} / ${total} 件を表示`,
    search: "検索：スランプ、Semper、dB、煙突効果……",
    allSubjects: "全科目", allTypes: "全形式", allPriorities: "全優先度", core: "コア", support: "補足",
    allStatuses: "全状態", unreviewed: "未復習", due: "期限到来", weak: "評価0–1", mastered: "直近で完答", allSources: "全情報源",
    noItems: "現在の条件に一致する項目はありません。",
    queue: "誤答の再処理", queueTitle: "補う必要がある問題をもう一度扱う", legacy: "旧記録", wrong: "誤答", uncertain: "不確実", later: "後で", migrated: "移行",
    errorLibrary: "誤答ライブラリ（分類・復習予定付き）", all: "すべて", dueReview: "期限到来", history: "建築史", planning: "建築計画", environment: "環境工学", construction: "建築構法", reported: "報告済", temporary: "一時習得",
    noDue: "期限が来た問題はありません。", noReported: "報告済みの問題はありません。", noErrors: "誤答記録はまだありません。過去問で「誤答」と記録するとここに表示されます。",
    dueBadge: "期限", reportedBadge: "報告済", unknownSubject: "科目不明", wrongTimes: (n: number) => `誤答${n}回`, nextReview: "次回復習", now: "今", retry: "再解答", resolve: "習得済みにする", laterButton: "後で", report: "問題を報告", goPast: "過去問へ",
    question: "問題", attempts: "記録", times: "回", latest: "直近の解答", correct: "正答", errorTimes: "誤答回数", cognitive: "認知課題", relation: "知識関係", topics: "テーマ", errorReason: "誤答原因", unclassified: "未分類", basis: "解答根拠", retryAgain: "もう一度解く",
    last: "前回", minimum: "最低限の解答", compare: "先ほどの解答と比較して自己評価：", reveal: "先に答えてから最低限の解答を見る", related: "関連年度", sourceUnavailable: "元PDFは公開サイトに未配置",
  },
};

function SourceLink({ source, locale }: { source: ReviewItemSource; locale: ReviewLocale }) {
  const className =
    "inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-violet-300 hover:text-violet-700";

  if (source.kind === "pdf") {
    return (
      <span className={className} title={reviewCopy[locale].sourceUnavailable}>
        {source.label} · {source.fileName}
      </span>
    );
  }
  if (source.kind === "notion") {
    return (
      <a className={className} href={source.href} target="_blank" rel="noreferrer">
        {source.label} ↗
      </a>
    );
  }
  return (
    <Link className={className} href={source.href}>
      {source.label} →
    </Link>
  );
}

function ReviewMediaGallery({
  media,
  locale,
  showCaptions,
}: {
  media: ReviewItemMedia[];
  locale: ReviewLocale;
  showCaptions: boolean;
}) {
  if (media.length === 0) return null;
  const many = media.length > 1;

  return (
    <div className={`mt-3 ${many ? "flex snap-x gap-3 overflow-x-auto pb-2" : ""}`}>
      {media.map((asset, index) => {
        const alt = locale === "ja" ? asset.altJa : asset.altZh;
        const caption = locale === "ja" ? asset.captionJa : asset.captionZh;
        return (
          <figure
            key={`${asset.src}-${index}`}
            className={many ? "min-w-[72%] snap-start sm:min-w-[42%]" : ""}
          >
            <a
              href={asset.src}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-xl border border-white/80 bg-white shadow-sm"
            >
              {/* Static export uses stable files under /public; no expiring Notion URLs. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt={alt}
                loading="lazy"
                className="h-52 w-full object-contain sm:h-60"
              />
            </a>
            {showCaptions && caption && (
              <figcaption className="mt-1.5 px-1 text-xs leading-5 text-slate-500">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}

function ReviewPromptCard({
  item,
  state,
  revealed,
  onReveal,
  onRate,
  compact = false,
  locale,
}: {
  item: ReviewItem;
  state?: ReviewItemState;
  revealed: boolean;
  onReveal: () => void;
  onRate: (rating: ReviewItemRating) => void;
  compact?: boolean;
  locale: ReviewLocale;
}) {
  const t = reviewCopy[locale];
  const localized = getLocalizedReviewItem(item, locale);
  const ratingLabel = state
    ? locale === "ja" ? ratingMeta[state.rating].labelJa : ratingMeta[state.rating].labelZh
    : "";
  const taskLabel = locale === "ja"
    ? REVIEW_TASK_TYPE_LABELS_JA[item.taskType]
    : REVIEW_TASK_TYPE_LABELS[item.taskType];
  const promptMedia = (item.media ?? []).filter((asset) => asset.role === "prompt");
  const revealedMedia = (item.media ?? []).filter((asset) => asset.role !== "prompt");
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${subjectCardColors[item.subject]}`}>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700">{locale === "ja" ? REVIEW_SUBJECT_META[item.subject].labelJa : REVIEW_SUBJECT_META[item.subject].label}</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500">{localized.topic}</span>
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-slate-500">{taskLabel}</span>
        {item.priority === "core" && <span className="rounded-full bg-slate-900 px-2 py-0.5 text-white">{t.core}</span>}
        {state && <span className="ml-auto text-slate-500">{t.last}：{ratingLabel}</span>}
      </div>
      <h3 className="mt-3 text-lg font-bold text-slate-950">{localized.title}</h3>
      <ReviewMediaGallery media={promptMedia} locale={locale} showCaptions={revealed} />
      <p className="mt-3 rounded-xl bg-white/80 p-3 text-sm leading-6 text-slate-800">
        Q. {localized.prompt}
      </p>
      {revealed ? (
        <div className="mt-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{t.minimum}</p>
            <p className="mt-1 text-sm leading-6 text-emerald-950">{localized.minimumAnswer}</p>
          </div>
          <ReviewMediaGallery media={revealedMedia} locale={locale} showCaptions />
          <p className="mt-3 text-xs font-semibold text-slate-600">{t.compare}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([0, 1, 2, 3] as ReviewItemRating[]).map((rating) => (
              <button
                key={rating}
                onClick={() => onRate(rating)}
                title={locale === "ja" ? ratingMeta[rating].labelJa : ratingMeta[rating].labelZh}
                className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${ratingMeta[rating].color}`}
              >
                {locale === "ja" ? ratingMeta[rating].shortJa : ratingMeta[rating].shortZh}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={onReveal}
          className="mt-3 w-full rounded-xl border border-dashed border-violet-300 bg-white/70 px-3 py-3 text-sm font-semibold text-violet-700 hover:bg-white"
        >
          {t.reveal}
        </button>
      )}
      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {item.sources.map((source) => (
            <SourceLink key={`${source.kind}-${source.label}`} source={source} locale={locale} />
          ))}
          {item.years.length > 0 && <span className="text-xs text-slate-400">{t.related}：{item.years.join("、")}</span>}
        </div>
      )}
    </article>
  );
}

export default function ReviewClient({ questions }: { questions: Question[] }) {
  const [locale, setLocale] = useState<ReviewLocale>("zh");
  const [records, setRecords] = useState<StudyRecordMap>({});
  const [active, setActive] = useState<(typeof tabs)[number]["value"]>("wrong");
  const [reviewStates, setReviewStates] = useState<Record<string, ReviewState>>({});
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [errorFilter, setErrorFilter] = useState("all");
  const [migrated, setMigrated] = useState(0);
  const [itemStates, setItemStates] = useState<ReviewItemStateMap>({});
  const [revealedItems, setRevealedItems] = useState<Set<string>>(() => new Set());
  const [itemSearch, setItemSearch] = useState("");
  const [itemSubject, setItemSubject] = useState<ReviewItemSubject | "all">("all");
  const [itemTaskType, setItemTaskType] = useState("all");
  const [itemPriority, setItemPriority] = useState("all");
  const [itemSource, setItemSource] = useState("all");
  const [itemStatus, setItemStatus] = useState("all");

  useEffect(() => {
    const sync = () => {
      setRecords(readStudyRecords());
      setAttempts(readAttempts());
      setItemStates(readReviewItemStates());
    };
    sync();
    window.addEventListener(STUDY_RECORDS_EVENT, sync);
    window.addEventListener(REVIEW_ITEM_STATES_EVENT, sync);
    window.addEventListener("storage", sync);
    // Migrate old records + load review states
    queueMicrotask(() => {
      setMigrated(migrateFromV1());
      setReviewStates(readReviewStates());
    });
    return () => {
      window.removeEventListener(STUDY_RECORDS_EVENT, sync);
      window.removeEventListener(REVIEW_ITEM_STATES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const questionById = useMemo(() => new Map(questions.map((question) => [question.id, question])), [questions]);
  const grouped = useMemo(() => ({
    wrong: Object.values(records).filter((record) => record.status === "wrong"),
    uncertain: Object.values(records).filter((record) => record.status === "uncertain"),
    later: Object.values(records).filter((record) => record.status === "later"),
  }), [records]);
  const attemptsByQuestion = useMemo(() => {
    const groupedAttempts = new Map<string, AttemptRecord[]>();
    for (const attempt of attempts) {
      const entries = groupedAttempts.get(attempt.questionId) ?? [];
      entries.push(attempt);
      groupedAttempts.set(attempt.questionId, entries);
    }
    return groupedAttempts;
  }, [attempts]);

  // Error queue from review states
  const errorQueue = useMemo(() => {
    const all = Object.values(reviewStates).filter((s) =>
      (s.wrongCount > 0 || s.uncertainCount > 0 || s.status === "active") &&
      s.status !== "resolved"
    );
    if (errorFilter === "all") return all;
    if (errorFilter === "due") return all.filter((s) => s.nextReviewAt && s.nextReviewAt <= new Date().toISOString());
    if (errorFilter === "reported") return all.filter((s) => s.reportedIssue);
    if (errorFilter === "mastered") return all.filter((s) => s.status === "temporarily_mastered");
    return all.filter((s) => s.subject === errorFilter);
  }, [reviewStates, errorFilter]);

  const activeTab = tabs.find((tab) => tab.value === active)!;
  const t = reviewCopy[locale];
  const nowIso = new Date().toISOString();
  const isItemStatusMatch = (item: ReviewItem) => {
    const state = itemStates[item.id];
    if (itemStatus === "unreviewed") return !state;
    if (itemStatus === "due") return !!state && state.nextReviewAt <= nowIso;
    if (itemStatus === "weak") return !!state && state.rating <= 1;
    if (itemStatus === "mastered") return !!state && state.rating === 3;
    return true;
  };
  const filteredReviewItems = REVIEW_ITEMS.filter((item) => {
    const query = itemSearch.trim().toLocaleLowerCase();
    const localized = getLocalizedReviewItem(item, locale);
    const haystack = [
      localized.title,
      localized.topic,
      localized.prompt,
      localized.minimumAnswer,
      ...(item.keywords ?? []),
      ...item.sources.map((source) => source.label),
      ...(item.media ?? []).flatMap((asset) => [
        asset.altZh,
        asset.altJa,
        asset.captionZh ?? "",
        asset.captionJa ?? "",
      ]),
    ].join(" ").toLocaleLowerCase();
    return (
      (!query || haystack.includes(query)) &&
      (itemSubject === "all" || item.subject === itemSubject) &&
      (itemTaskType === "all" || item.taskType === itemTaskType) &&
      (itemPriority === "all" || item.priority === itemPriority) &&
      (itemSource === "all" || item.sources.some((source) => source.kind === itemSource)) &&
      isItemStatusMatch(item)
    );
  });
  const dueReviewItems = useMemo(
    () => {
      const due = REVIEW_ITEMS.filter((item) => isReviewItemDue(itemStates[item.id]))
        .sort((a, b) => Number(b.priority === "core") - Number(a.priority === "core"));
      const subjects = Object.keys(REVIEW_SUBJECT_META) as ReviewItemSubject[];
      const balanced = subjects
        .map((subject) => due.find((item) => item.subject === subject))
        .filter((item): item is ReviewItem => Boolean(item));
      const selected = new Set(balanced.map((item) => item.id));
      return [...balanced, ...due.filter((item) => !selected.has(item.id))].slice(0, 6);
    },
    [itemStates],
  );
  const dueReviewItemCount = REVIEW_ITEMS.filter((item) => isReviewItemDue(itemStates[item.id])).length;
  const coverage = (Object.keys(REVIEW_SUBJECT_META) as ReviewItemSubject[]).map((subject) => {
    const items = REVIEW_ITEMS.filter((item) => item.subject === subject);
    const reviewed = items.filter((item) => itemStates[item.id]).length;
    const mastered = items.filter((item) => itemStates[item.id]?.rating === 3).length;
    const due = items.filter((item) => itemStates[item.id] && isReviewItemDue(itemStates[item.id])).length;
    const sources = new Set(items.flatMap((item) => item.sources.map((source) => source.kind))).size;
    return { subject, total: items.length, reviewed, mastered, due, sources };
  });
  const setRevealed = (itemId: string, revealed: boolean) =>
    setRevealedItems((current) => {
      const next = new Set(current);
      if (revealed) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  const rateReviewItem = (itemId: string, rating: ReviewItemRating) => {
    saveReviewItemRating(itemId, rating);
    setItemStates(readReviewItemStates());
    setRevealed(itemId, false);
  };

  return (
    <SidebarLayout>
      <div className="min-h-full bg-violet-50/40 px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-violet-700">REVIEW DESK</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">{t.headerTitle}</h1>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t.headerDescription}</p>
            </div>
            <div className="flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold">
              <button onClick={() => setLocale("zh")} className={`rounded-full px-3 py-1.5 ${locale === "zh" ? "bg-slate-950 text-white" : "text-slate-500"}`}>中文</button>
              <button onClick={() => setLocale("ja")} className={`rounded-full px-3 py-1.5 ${locale === "ja" ? "bg-slate-950 text-white" : "text-slate-500"}`}>日本語</button>
            </div>
          </header>

          <Link href="/practice" className="mt-7 flex items-center justify-between rounded-2xl border border-violet-200 bg-white px-5 py-4 text-sm font-semibold text-violet-800 hover:border-violet-400"><span>✍️ {t.practiceLink}</span><span>→</span></Link>

          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-violet-300">{t.today}</p>
                <h2 className="mt-2 text-2xl font-bold">{t.todayTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{t.todayDescription(dueReviewItemCount)}</p>
              </div>
              <a href="#review-library" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10">{t.viewAll} ↓</a>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {dueReviewItems.map((item) => (
                <ReviewPromptCard
                  key={item.id}
                  item={item}
                  state={itemStates[item.id]}
                  revealed={revealedItems.has(item.id)}
                  onReveal={() => setRevealed(item.id, true)}
                  onRate={(rating) => rateReviewItem(item.id, rating)}
                  compact
                  locale={locale}
                />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">{t.overview}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{t.overviewTitle}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.overviewDescription}</p>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="hidden grid-cols-[1.2fr_repeat(5,0.8fr)] gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500 sm:grid">
                {t.columns.map((column) => <span key={column}>{column}</span>)}
              </div>
              {coverage.map((row) => (
                <button
                  key={row.subject}
                  onClick={() => {
                    setItemSubject(row.subject);
                    document.getElementById("review-library")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="grid w-full grid-cols-3 gap-3 border-b border-slate-100 px-5 py-4 text-left text-sm last:border-0 hover:bg-violet-50 sm:grid-cols-[1.2fr_repeat(5,0.8fr)]"
                >
                  <span className="col-span-3 font-bold text-slate-900 sm:col-span-1">{locale === "ja" ? REVIEW_SUBJECT_META[row.subject].labelJa : REVIEW_SUBJECT_META[row.subject].label}</span>
                  <span><b>{row.total}</b><small className="ml-1 text-slate-400 sm:hidden">條</small></span>
                  <span><b>{row.reviewed}</b><small className="ml-1 text-slate-400 sm:hidden">已複盤</small></span>
                  <span><b>{row.mastered}</b><small className="ml-1 text-slate-400 sm:hidden">完整</small></span>
                  <span className="hidden sm:block">{row.due}</span>
                  <span className="hidden sm:block">{row.sources}</span>
                </button>
              ))}
            </div>
          </section>

          <section id="review-library" className="mt-10 scroll-mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">{t.library}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{t.libraryTitle}</h2>
              </div>
              <p className="text-sm text-slate-500">{t.showing(filteredReviewItems.length, REVIEW_ITEMS.length)}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                value={itemSearch}
                onChange={(event) => setItemSearch(event.target.value)}
                placeholder={t.search}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white"
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                <select value={itemSubject} onChange={(event) => setItemSubject(event.target.value as ReviewItemSubject | "all")} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="all">{t.allSubjects}</option>
                  {(Object.keys(REVIEW_SUBJECT_META) as ReviewItemSubject[]).map((subject) => <option key={subject} value={subject}>{locale === "ja" ? REVIEW_SUBJECT_META[subject].labelJa : REVIEW_SUBJECT_META[subject].label}</option>)}
                </select>
                <select value={itemTaskType} onChange={(event) => setItemTaskType(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="all">{t.allTypes}</option>
                  {Object.entries(locale === "ja" ? REVIEW_TASK_TYPE_LABELS_JA : REVIEW_TASK_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select value={itemPriority} onChange={(event) => setItemPriority(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="all">{t.allPriorities}</option><option value="core">{t.core}</option><option value="support">{t.support}</option>
                </select>
                <select value={itemStatus} onChange={(event) => setItemStatus(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="all">{t.allStatuses}</option><option value="unreviewed">{t.unreviewed}</option><option value="due">{t.due}</option><option value="weak">{t.weak}</option><option value="mastered">{t.mastered}</option>
                </select>
                <select value={itemSource} onChange={(event) => setItemSource(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="all">{t.allSources}</option>
                  {Object.entries(sourceKindLabels).map(([value, label]) => <option key={value} value={value}>{label[locale]}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {filteredReviewItems.map((item) => (
                <ReviewPromptCard
                  key={item.id}
                  item={item}
                  state={itemStates[item.id]}
                  revealed={revealedItems.has(item.id)}
                  onReveal={() => setRevealed(item.id, true)}
                  onRate={(rating) => rateReviewItem(item.id, rating)}
                  locale={locale}
                />
              ))}
            </div>
            {filteredReviewItems.length === 0 && <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500">{t.noItems}</div>}
          </section>

          <ReviewInboxPanel locale={locale} />

          <section className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">{t.queue}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">{t.queueTitle}</h2>
            <p className="mt-1 text-xs text-slate-400">{t.legacy}: {t.wrong}{grouped.wrong.length} · {t.uncertain}{grouped.uncertain.length} · {t.later}{grouped.later.length} · {t.migrated}{migrated}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button key={tab.value} onClick={() => setActive(tab.value)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === tab.value ? STUDY_STATUS_META[tab.value].color + " ring-2 ring-offset-2 ring-violet-200" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
                {locale === "ja" ? tab.labelJa : tab.labelZh} · {grouped[tab.value].length}
              </button>
            ))}
          </div>

          {/* New error queue with filters */}
          <div className="mt-6 rounded-2xl border border-indigo-200 bg-white p-5">
            <p className="text-sm font-bold text-slate-800">📋 {t.errorLibrary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { value: "all", label: `${t.all} (${errorQueue.length})` },
                { value: "due", label: t.dueReview },
                { value: "history", label: t.history },
                { value: "planning", label: t.planning },
                { value: "environment", label: t.environment },
                { value: "construction", label: t.construction },
                { value: "reported", label: t.reported },
                { value: "mastered", label: t.temporary },
              ].map((f) => (
                <button key={f.value} onClick={() => setErrorFilter(f.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${errorFilter === f.value ? "bg-indigo-700 text-white" : "border border-slate-200 text-slate-600"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {errorQueue.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">
                  {errorFilter === "due" ? t.noDue :
                   errorFilter === "reported" ? t.noReported : t.noErrors}
                </p>
              ) : errorQueue.map((state) => {
                const q = questionById.get(state.questionId);
                const nextReview = state.nextReviewAt ? new Date(state.nextReviewAt) : null;
                const isDue = nextReview && nextReview <= new Date();
                return (
                  <div key={state.questionId} className={`rounded-xl border p-3 text-sm ${isDue ? "border-amber-300 bg-amber-50" : state.status === "suspended" ? "border-rose-200 bg-rose-50" : "border-slate-100 bg-slate-50"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {isDue && <span className="rounded bg-amber-200 px-1.5 py-0.5 text-amber-800 font-medium">{t.dueBadge}</span>}
                        {state.reportedIssue && <span className="rounded bg-rose-200 px-1.5 py-0.5 text-rose-800">{t.reportedBadge}</span>}
                        <span>{state.subject || t.unknownSubject}</span>
                        <span>·</span>
                        <span>{state.blueprintId || "—"}</span>
                        <span>·</span>
                        <span>{t.wrongTimes(state.wrongCount)}</span>
                      </div>
                    </div>
                    {q && <p className="mt-1 text-xs text-slate-600 truncate">Q{q.question_number} · {q.subject} · {q.year}</p>}
                    {!q && <p className="mt-1 text-xs text-slate-400">{state.questionId}</p>}
                    {nextReview && (
                      <p className="mt-1 text-xs text-slate-400">
                        {t.nextReview}: {nextReview.toLocaleDateString(locale === "ja" ? "ja-JP" : "zh-CN")}
                        {isDue && ` ← ${t.now}`}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {q && <Link href={`/question/${encodeURIComponent(state.questionId)}`} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{t.retry}</Link>}
                      <button onClick={() => { markResolved(state.questionId); setReviewStates(readReviewStates()); }} className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">{t.resolve}</button>
                      <button onClick={() => { markLater(state.questionId); setReviewStates(readReviewStates()); }} className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">{t.laterButton}</button>
                      <button onClick={() => { reportIssue(state.questionId); setReviewStates(readReviewStates()); }} className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">{t.report}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <section className="mt-6 space-y-3">
            {grouped[active].length === 0 ? (
              <div className="rounded-3xl border border-dashed border-violet-200 bg-white/70 px-6 py-16 text-center">
                <p className="text-sm text-slate-500">{locale === "ja" ? activeTab.emptyJa : activeTab.emptyZh}</p>
                <Link href="/exam/past" className="mt-5 inline-block rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white">{t.goPast}</Link>
              </div>
            ) : grouped[active].map((record) => {
              const source = record.source;
              const questionAttempts = attemptsByQuestion.get(record.questionId) ?? [];
              const latestAttempt = questionAttempts.at(-1);
              const pastExam = latestAttempt?.pastExam;
              const storedQuestion = questionById.get(record.questionId);
              const sourceQuestion = source ? questionById.get(source.sourceQuestionId) : undefined;
              const question = storedQuestion ?? sourceQuestion ?? (source ? {
                id: source.sourceQuestionId,
                year: source.year,
                category: "専門1",
                subject: source.subject,
                question_number: source.sourceLabel,
                content: "",
                tags: source.topicTags,
                images: [],
                fileName: "",
              } : undefined);
              if (!question) return null;
              const href = storedQuestion
                ? `/question/${encodeURIComponent(storedQuestion.id)}`
                : sourceQuestion
                  ? `/question/${encodeURIComponent(sourceQuestion.id)}`
                  : source?.sourceHref && !source.sourceHref.startsWith("/question/")
                    ? source.sourceHref
                    : "/exam/past";
              return (
                <Link key={record.questionId} href={href} className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-300 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{question.year}</span><span>·</span><span>{question.category}</span><span>·</span><span>{question.subject}</span></div>
                    <h2 className="mt-2 font-bold text-slate-900">{t.question} {question.question_number}</h2>
                    <p className="mt-2 text-xs text-slate-400">{t.attempts} {record.attempts} {t.times} · {new Date(record.updatedAt).toLocaleDateString(locale === "ja" ? "ja-JP" : "zh-CN")}</p>
                    {pastExam && <div className="mt-3 space-y-1 text-xs leading-5 text-slate-600">
                      <p><b>{t.latest}：</b>{latestAttempt.userAnswer}　<b>{t.correct}：</b>{latestAttempt.correctAnswer}　<b>{t.errorTimes}：</b>{questionAttempts.filter((attempt) => attempt.result === "wrong").length}</p>
                      <p><b>{t.cognitive}：</b>{pastExam.cognitiveTask}</p>
                      <p><b>{t.relation}：</b>{pastExam.knowledgeRelation}</p>
                      <p><b>{t.topics}：</b>{pastExam.topicTags.join("、") || t.unclassified}　<b>{t.errorReason}：</b>{pastExam.commonErrorTags.join("、") || t.unclassified}</p>
                      <p><b>{t.basis}：</b>{pastExam.answerBasis}</p>
                    </div>}
                  </div>
                  <span className="text-sm font-semibold text-violet-700">{t.retryAgain} <span className="inline-block transition group-hover:translate-x-1">→</span></span>
                </Link>
              );
            })}
          </section>
          </section>
        </div>
      </div>
    </SidebarLayout>
  );
}
