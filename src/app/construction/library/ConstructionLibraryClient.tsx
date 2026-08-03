"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import type { ConstructionLibraryItem } from "@/lib/construction-library-types";
import { CONSTRUCTION_CONCEPT_QUESTIONS, type ConstructionConceptQuestion } from "@/lib/construction-practice-questions";

type LibraryMode = "images" | "concepts";
type PracticeMode = "image" | "distinction";
type ImageQuestion = { target: ConstructionLibraryItem; choices: ConstructionLibraryItem[] };
type DistinctionQuestion = { id: string; promptJa: string; choices: string[]; answerJa: string; explanationJa: string };
type ProgressItem = { attempts: number; correct: number };
type Progress = { attempts: number; correct: number; items: Record<string, ProgressItem> };

const PROGRESS_KEY = "construction-memory-progress-v1";
const normalized = (value: string) => value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase();
const hash = (value: string) => { let result = 0; for (let index = 0; index < value.length; index += 1) result = (result * 31 + value.charCodeAt(index)) >>> 0; return result; };
const seeded = <T,>(values: T[], seed: string) => [...values].sort((a, b) => hash(`${seed}-${JSON.stringify(a)}`) - hash(`${seed}-${JSON.stringify(b)}`));
const sessionSeed = (mode: string) => `${mode}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const unseenFirst = <T,>(values: T[], completed: Set<string>, id: (value: T) => string, seed: string) => [
  ...seeded(values.filter((value) => !completed.has(id(value))), `${seed}-unseen`),
  ...seeded(values.filter((value) => completed.has(id(value))), `${seed}-review`),
];

function buildImageQuestions(items: ConstructionLibraryItem[], seed: string, completed: Set<string>): ImageQuestion[] {
  const eligible = items.filter((item) => item.images.length > 0 && item.explanation.length >= 16 && item.title.length <= 32 && item.kind !== "other");
  const targets = unseenFirst(eligible, completed, (item) => `image:${item.id}`, `${seed}-targets`).slice(0, 3);
  return targets.flatMap((target, index) => {
    const seen = new Set([normalized(target.title)]);
    const candidates = seeded(items.filter((item) => item.id !== target.id), `${seed}-${target.id}-${index}`).filter((item) => {
      const key = normalized(item.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const similarity = (item: ConstructionLibraryItem) => (item.system === target.system ? 4 : 0) + (item.kind === target.kind ? 2 : 0);
    const distractors = candidates.sort((left, right) => similarity(right) - similarity(left)).slice(0, 2);
    return distractors.length === 2 ? [{ target, choices: seeded([target, ...distractors], `${seed}-${target.id}-choices`) }] : [];
  });
}

function buildDistinctionPool(): DistinctionQuestion[] {
  return CONSTRUCTION_CONCEPT_QUESTIONS.map((question: ConstructionConceptQuestion) => ({
    id: `curated:${question.id}`, promptJa: question.promptJa, choices: question.choicesJa,
    answerJa: question.answerJa, explanationJa: question.explanationJa,
  }));
}

function buildDistinctionQuestions(seed: string, completed: Set<string>): DistinctionQuestion[] {
  return unseenFirst(buildDistinctionPool(), completed, (question) => question.id, `${seed}-targets`).slice(0, 3).map((question, index) => ({
    ...question,
    choices: seeded(question.choices, `${seed}-${index}-choices`),
  }));
}

export default function ConstructionLibraryClient({ items, excludedCount, surface }: { items: ConstructionLibraryItem[]; excludedCount: number; surface: "library" | "practice" }) {
  const [libraryMode, setLibraryMode] = useState<LibraryMode>("images");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("image");
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const [limit, setLimit] = useState(48);
  const [reviewItem, setReviewItem] = useState<ConstructionLibraryItem | null>(null);
  const [progress, setProgress] = useState<Progress>({ attempts: 0, correct: 0, items: {} });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) ?? "null") as Partial<Progress> | null;
        if (stored && Number.isFinite(stored.attempts) && Number.isFinite(stored.correct)) setProgress({ attempts: stored.attempts!, correct: stored.correct!, items: stored.items ?? {} });
      } catch { /* Ignore invalid local progress. */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const recordResult = (id: string, correct: boolean) => setProgress((current) => {
    const before = current.items[id] ?? { attempts: 0, correct: 0 };
    const next = { attempts: current.attempts + 1, correct: current.correct + (correct ? 1 : 0), items: { ...current.items, [id]: { attempts: before.attempts + 1, correct: before.correct + (correct ? 1 : 0) } } };
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    return next;
  });
  const systems = useMemo(() => [...new Set(items.map((item) => item.system))], [items]);
  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesMode = libraryMode === "images" ? item.images.length > 0 : item.images.length === 0;
    const haystack = normalized(`${item.title} ${item.explanation} ${item.system} ${item.kindLabel} ${item.pastQuestion}`);
    return matchesMode && (system === "all" || item.system === system) && (!query.trim() || haystack.includes(normalized(query)));
  }), [items, libraryMode, query, system]);
  const imageCount = items.filter((item) => item.images.length > 0).length;

  return <SidebarLayout>
    <div className="min-h-full bg-[#f5f4ef] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href={surface === "library" ? "/explore" : "/construction/library"} className="text-sm text-slate-500 hover:text-orange-700">← {surface === "library" ? "探索に戻る" : "記憶ライブラリに戻る"}</Link>
        <header className="mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-orange-950 to-amber-900 p-6 text-white shadow-xl sm:p-9">
          <p className="text-xs font-bold tracking-[0.2em] text-amber-300">建築構法・記憶ラボ</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">{surface === "library" ? "図と部材から、構法を見分ける" : "見て、比べて、構法を結ぶ"}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-orange-100">{surface === "library" ? `全${items.length}枚のカードを、図解${imageCount}枚と概念・工法に分けて閲覧できます。` : "画像識別と紛らわしい構法の比較を、1ゲーム3問ずつ練習します。"}</p>
          {surface === "library" ? <Link href="/construction/practice" className="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950">ゲーム練習へ →</Link> : <div className="mt-6 grid gap-3 sm:grid-cols-2"><Stat label="挑戦数" value={String(progress.attempts)} /><Stat label="獲得スター" value={`★ ${progress.correct}`} /></div>}
        </header>

        {surface === "library" ? <>
          <nav className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            <ModeButton active={libraryMode === "images"} onClick={() => { setLibraryMode("images"); setLimit(48); }} icon="▧" label={`図解カード (${imageCount})`} />
            <ModeButton active={libraryMode === "concepts"} onClick={() => { setLibraryMode("concepts"); setLimit(48); }} icon="#" label={`概念・工法 (${items.length - imageCount})`} />
          </nav>
          <section className="mt-6">
            <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[1fr_260px]">
              <input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(48); }} placeholder="構法・部材・材料を検索" className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
              <select value={system} onChange={(event) => { setSystem(event.target.value); setLimit(48); }} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm"><option value="all">すべての構造体系</option>{systems.map((value) => <option key={value} value={value}>{value}</option>)}</select>
            </div>
            <p className="mt-4 text-xs text-slate-500">表示 <b>{Math.min(limit, visibleItems.length)}</b> / {visibleItems.length} · 除外 {excludedCount}</p>
            {visibleItems.length ? <div className={`mt-4 grid gap-4 ${libraryMode === "images" ? "sm:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3"}`}>{visibleItems.slice(0, limit).map((item) => <LibraryCard key={item.id} item={item} practiced={Boolean(progress.items[`image:${item.id}`]?.attempts || progress.items[`library:${item.id}`]?.attempts)} onOpen={() => setReviewItem(item)} />)}</div> : <p className="mt-10 text-center text-slate-500">条件に合うカードがありません。</p>}
            {limit < visibleItems.length && <button onClick={() => setLimit((current) => current + 48)} className="mx-auto mt-6 block rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white">さらに表示</button>}
          </section>
        </> : <>
          <nav className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            <ModeButton active={practiceMode === "image"} onClick={() => setPracticeMode("image")} icon="▧" label="画像で識別" />
            <ModeButton active={practiceMode === "distinction"} onClick={() => setPracticeMode("distinction")} icon="⇄" label="構法を見分ける" />
          </nav>
          <ConstructionPractice key={practiceMode} mode={practiceMode} items={items} progress={progress} onResult={recordResult} onReview={setReviewItem} />
        </>}
      </div>
      {reviewItem && <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} />}
    </div>
  </SidebarLayout>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white/10 px-4 py-3"><p className="text-xs text-orange-200">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>; }
function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) { return <button type="button" onClick={onClick} className={`rounded-xl px-3 py-3 text-sm font-bold transition ${active ? "bg-orange-700 text-white" : "text-slate-600 hover:bg-orange-50"}`}><span className="mr-2">{icon}</span>{label}</button>; }

function LibraryCard({ item, practiced, onOpen }: { item: ConstructionLibraryItem; practiced: boolean; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg">
    {item.images.length > 0 && <div className="relative aspect-[4/3] bg-stone-100"><Image src={`/construction-images/${item.images[0]}`} alt={item.title} fill unoptimized sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 92vw" className="object-contain" />{item.images.length > 1 && <span className="absolute bottom-2 right-2 rounded-full bg-slate-950/75 px-2 py-1 text-[11px] font-bold text-white">+{item.images.length - 1}</span>}</div>}
    <div className="p-5"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">{item.system}</span><span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{item.kindLabel}</span>{practiced && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">回答済み</span>}</div><h2 className="mt-3 text-lg font-black leading-7">{item.title}</h2>{item.explanation && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{item.explanation}</p>}<p className="mt-4 text-xs font-bold text-orange-700">カードを見る ↗</p></div>
  </button>;
}

function ConstructionPractice({ mode, items, progress, onResult, onReview }: { mode: PracticeMode; items: ConstructionLibraryItem[]; progress: Progress; onResult: (id: string, correct: boolean) => void; onReview: (item: ConstructionLibraryItem) => void }) {
  const [started, setStarted] = useState(false);
  const [seed, setSeed] = useState("");
  const [completedAtStart, setCompletedAtStart] = useState<string[]>([]);
  const completed = useMemo(() => new Set(completedAtStart), [completedAtStart]);
  const imageQuestions = useMemo(() => buildImageQuestions(items, seed, completed), [completed, items, seed]);
  const distinctionQuestions = useMemo(() => buildDistinctionQuestions(seed, completed), [completed, seed]);
  const questionCount = mode === "image" ? items.filter((item) => item.images.length > 0 && item.explanation.length >= 16 && item.title.length <= 32 && item.kind !== "other").length : buildDistinctionPool().length;
  const start = () => { setCompletedAtStart(Object.keys(progress.items)); setSeed(sessionSeed(mode)); setStarted(true); };
  if (!started) return <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"><div className="text-5xl">{mode === "image" ? "▧" : "⇄"}</div><h2 className="mt-4 text-2xl font-black">{mode === "image" ? "画像で識別" : "構法を見分ける"}</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">{mode === "image" ? "図や写真を見て、同じ構造体系・部材分類の近い選択肢から答えます。" : "位置・受力・施工方法を読み、条件に当てはまる構法や部材を選びます。"}</p><p className="mt-3 text-sm font-bold text-orange-700">全{questionCount}問 · 未回答を優先</p><button onClick={start} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950">ランダム3問に挑戦</button></section>;
  const restart = () => { setStarted(false); setSeed(""); };
  return mode === "image" ? <ImageQuiz questions={imageQuestions} onResult={onResult} onReview={onReview} onRestart={restart} /> : <DistinctionQuiz questions={distinctionQuestions} onResult={onResult} onRestart={restart} />;
}

function ImageQuiz({ questions, onResult, onReview, onRestart }: { questions: ImageQuestion[]; onResult: (id: string, correct: boolean) => void; onReview: (item: ConstructionLibraryItem) => void; onRestart: () => void }) {
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [score, setScore] = useState(0); const question = questions[index];
  if (!question) return <Completion score={score} total={questions.length} onRestart={onRestart} />;
  const correct = answer === question.target.id;
  const choose = (id: string) => { if (answer) return; const result = id === question.target.id; setAnswer(id); if (result) setScore((current) => current + 1); onResult(`image:${question.target.id}`, result); };
  return <QuizShell index={index} total={questions.length} score={score} title="図に最も近い構法・部材は？"><div className="relative mx-auto aspect-[4/3] max-w-2xl overflow-hidden rounded-2xl bg-stone-100"><Image src={`/construction-images/${question.target.images[0]}`} alt="構法識別問題" fill unoptimized className="object-contain" /></div><Choices choices={question.choices.map((item) => ({ id: item.id, label: item.title }))} answer={answer} correctId={question.target.id} onChoose={choose} />{answer && <Feedback correct={correct}><p className="mt-2 text-sm font-bold text-slate-800">正解：{question.target.title}</p><p className="mt-1 text-sm leading-7 text-slate-700">{question.target.explanation}</p><button onClick={() => onReview(question.target)} className="mt-2 text-sm font-bold text-orange-700">クイックレビュー ↗</button></Feedback>}{answer && <NextButton final={index + 1 === questions.length} onClick={() => { setIndex((current) => current + 1); setAnswer(null); }} />}</QuizShell>;
}

function DistinctionQuiz({ questions, onResult, onRestart }: { questions: DistinctionQuestion[]; onResult: (id: string, correct: boolean) => void; onRestart: () => void }) {
  const [index, setIndex] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [score, setScore] = useState(0); const question = questions[index];
  if (!question) return <Completion score={score} total={questions.length} onRestart={onRestart} />;
  const correct = answer === question.answerJa;
  const choose = (value: string) => { if (answer) return; const result = value === question.answerJa; setAnswer(value); if (result) setScore((current) => current + 1); onResult(question.id, result); };
  return <QuizShell index={index} total={questions.length} score={score} title="この条件に当てはまる用語は？"><div className="rounded-2xl bg-amber-50 p-5"><p className="text-xs font-bold text-amber-800">設問</p><p className="mt-2 font-semibold leading-8 text-slate-800">{question.promptJa}</p></div><Choices choices={question.choices.map((choice) => ({ id: choice, label: choice }))} answer={answer} correctId={question.answerJa} onChoose={choose} />{answer && <Feedback correct={correct}><p className="mt-2 text-sm font-bold text-slate-800">正解：{question.answerJa}</p><p className="mt-1 text-sm leading-7 text-slate-700">{question.explanationJa}</p></Feedback>}{answer && <NextButton final={index + 1 === questions.length} onClick={() => { setIndex((current) => current + 1); setAnswer(null); }} />}</QuizShell>;
}

function QuizShell({ index, total, score, title, children }: { index: number; total: number; score: number; title: string; children: React.ReactNode }) { return <section className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-stone-100 px-6 py-4"><div><p className="text-xs font-bold text-orange-600">{index + 1} / {total}</p><h2 className="mt-1 text-xl font-black">{title}</h2></div><p className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold">★ {score}</p></div><div className="p-6">{children}</div></section>; }
function Choices({ choices, answer, correctId, onChoose }: { choices: { id: string; label: string }[]; answer: string | null; correctId: string; onChoose: (id: string) => void }) { return <div className="mt-6 grid gap-3">{choices.map((choice, index) => <button key={choice.id} disabled={Boolean(answer)} onClick={() => onChoose(choice.id)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold leading-6 ${answer && choice.id === correctId ? "border-emerald-400 bg-emerald-50 text-emerald-900" : answer === choice.id ? "border-rose-300 bg-rose-50 text-rose-800" : "border-stone-200 hover:border-orange-300 hover:bg-orange-50"}`}><span className="mr-2 text-stone-400">{String.fromCharCode(65 + index)}.</span>{choice.label}</button>)}</div>; }
function Feedback({ correct, children }: { correct: boolean; children: React.ReactNode }) { return <div className={`mt-5 rounded-2xl p-4 ${correct ? "bg-emerald-50" : "bg-amber-50"}`}><p className="font-black">{correct ? "正解です" : "この違いを確認しましょう"}</p>{children}</div>; }
function NextButton({ final, onClick }: { final: boolean; onClick: () => void }) { return <button onClick={onClick} className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">{final ? "結果を見る" : "次の問題"}</button>; }
function Completion({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) { return <section className="mx-auto mt-6 max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm"><p className="text-5xl">{score === total ? "🏆" : "⭐"}</p><p className="mt-4 text-4xl font-black">{score} / {total}</p><p className="mt-3 font-bold text-orange-700">セット完了</p><button onClick={onRestart} className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-bold">別の3問</button></section>; }

function ReviewModal({ item, onClose }: { item: ConstructionLibraryItem; onClose: () => void }) {
  useEffect(() => { const previous = document.body.style.overflow; const escape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.body.style.overflow = "hidden"; window.addEventListener("keydown", escape); return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", escape); }; }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}><section role="dialog" aria-modal="true" aria-label={item.title} className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{item.system}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-slate-600">{item.kindLabel}</span></div><h2 className="mt-4 text-2xl font-black">{item.title}</h2></div><button onClick={onClose} aria-label="閉じる" className="rounded-full bg-stone-100 px-4 py-2 text-xl text-slate-500">×</button></div>{item.images.length > 0 && <div className={`mt-6 grid gap-3 ${item.images.length > 1 ? "sm:grid-cols-2" : ""}`}>{item.images.map((file, index) => <div key={file} className="relative min-h-64 overflow-hidden rounded-2xl bg-stone-100"><Image src={`/construction-images/${file}`} alt={`${item.title}${item.images.length > 1 ? ` ${index + 1}` : ""}`} fill unoptimized sizes="(min-width: 640px) 42rem, 92vw" className="object-contain" /></div>)}</div>}{item.explanation && <div className="mt-6"><h3 className="text-sm font-bold text-slate-400">要点</h3><p className="mt-2 leading-8 text-slate-700">{item.explanation}</p></div>}{item.examForms.length > 0 && <div className="mt-5"><h3 className="text-sm font-bold text-slate-400">出題形式</h3><div className="mt-2 flex flex-wrap gap-2">{item.examForms.map((form) => <span key={form} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{form}</span>)}</div></div>}{item.pastQuestion && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="text-sm font-bold text-slate-500">過去問との関係</h3><p className="mt-2 text-sm leading-7 text-slate-700">{item.pastQuestion}</p></div>}<div className="mt-7 flex flex-wrap gap-3"><button onClick={onClose} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white">閉じる</button>{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full border border-stone-200 px-6 py-3 text-sm font-bold text-orange-700">原ノート ↗</a>}</div></section></div>;
}
