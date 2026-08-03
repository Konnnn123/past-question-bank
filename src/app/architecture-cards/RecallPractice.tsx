"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Localized = { ja: string; zh: string; en?: string };
type RecallMark = "remembered" | "fuzzy" | "missed" | "wrong";
type RecallLevel = "blank" | "impression" | "keywords" | "explain" | "essay";
type RelationMark = "not-yet" | "fuzzy" | "can-explain";

export interface RecallProfile {
  id: string;
  buildingId: string;
  names: Localized & { original: string };
  minimumKeywords: string[];
  standardFacts: Array<{
    id: string;
    dimension: string;
    required: boolean;
    text: Localized;
    keywords: string[];
  }>;
  relations: Array<{
    id: string;
    type: "cause" | "compare";
    targetBuildingId?: string;
    prompt: { ja: string; zh: string };
    answerFrame: { ja: string; zh: string };
  }>;
  termSupport: Array<{ ja: string; zh: string; original: string; language: string }>;
  diagram: { recommendedViews: string[]; labels: string[] };
  cautions: string[];
  imageFile: string | null;
  examRefs: Array<{ year: number; question: string; relation: string }>;
  themes: Array<{ id: string; name: Localized }>;
}

const LEVELS: Array<{ id: RecallLevel; ja: string; zh: string }> = [
  { id: "blank", ja: "完全に思い出せない", zh: "完全想不起来" },
  { id: "impression", ja: "印象だけある", zh: "只记得一点印象" },
  { id: "keywords", ja: "キーワードを書ける", zh: "能写几个关键词" },
  { id: "explain", ja: "おおよそ説明できる", zh: "大致能说明" },
  { id: "essay", ja: "論述に使える", zh: "可以用于论述" },
];

const MARKS: Array<{ id: RecallMark; ja: string; zh: string; color: string }> = [
  { id: "remembered", ja: "想起できた", zh: "记得", color: "border-emerald-400 bg-emerald-50 text-emerald-800" },
  { id: "fuzzy", ja: "曖昧", zh: "模糊", color: "border-amber-400 bg-amber-50 text-amber-800" },
  { id: "missed", ja: "思い出せない", zh: "没记住", color: "border-slate-300 bg-slate-50 text-slate-600" },
  { id: "wrong", ja: "誤っていた", zh: "记错", color: "border-rose-400 bg-rose-50 text-rose-800" },
];

const dimensionLabels: Record<string, Localized> = {
  period: { ja: "時代", zh: "时代" },
  location: { ja: "地域", zh: "地域" },
  structure: { ja: "構造・構法", zh: "结构／构法" },
  space: { ja: "空間・平面", zh: "空间／平面" },
  design: { ja: "設計操作", zh: "设计操作" },
  significance: { ja: "歴史的意義", zh: "历史意义" },
  history: { ja: "後世・現状", zh: "后续／现状" },
  "period-location": { ja: "時代・地域", zh: "时代／地域" },
  "period-people": { ja: "時代・人物", zh: "时代／人物" },
  "period-people-location": { ja: "時代・人物・地域", zh: "时代／人物／地域" },
  "form-space": { ja: "形式・空間", zh: "形式／空间" },
  "space-light": { ja: "空間・光", zh: "空间／光" },
  "structure-production": { ja: "構造・生産", zh: "结构／生产" },
};

function randomIndex(length: number, exclude = -1) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (next === exclude) next = (next + 1) % length;
  return next;
}

export default function RecallPractice({ profiles, lang }: { profiles: RecallProfile[]; lang: "ja" | "zh" }) {
  const [themeId, setThemeId] = useState("all");
  const [profileId, setProfileId] = useState(profiles[0]?.id ?? "");
  const [recallLevel, setRecallLevel] = useState<RecallLevel | null>(null);
  const [recallText, setRecallText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [marks, setMarks] = useState<Record<string, RecallMark>>({});
  const [relationMark, setRelationMark] = useState<RelationMark>("not-yet");
  const [showRelation, setShowRelation] = useState(false);

  const themes = useMemo(() => {
    const map = new Map<string, { id: string; name: Localized }>();
    profiles.forEach((profile) => profile.themes.forEach((theme) => map.set(theme.id, theme)));
    return [...map.values()];
  }, [profiles]);

  const eligibleProfiles = useMemo(
    () => profiles.filter((profile) => themeId === "all" || profile.themes.some((theme) => theme.id === themeId)),
    [profiles, themeId]
  );
  const profile = eligibleProfiles.find((item) => item.id === profileId) ?? eligibleProfiles[0];

  const resetAnswer = (nextId?: string) => {
    if (nextId) setProfileId(nextId);
    setRecallLevel(null);
    setRecallText("");
    setRevealed(false);
    setMarks({});
    setRelationMark("not-yet");
    setShowRelation(false);
  };

  const drawNext = () => {
    const current = eligibleProfiles.findIndex((item) => item.id === profile?.id);
    const next = eligibleProfiles[randomIndex(eligibleProfiles.length, current)];
    if (next) resetAnswer(next.id);
  };

  const selectTheme = (nextThemeId: string) => {
    const nextProfiles = profiles.filter((item) => nextThemeId === "all" || item.themes.some((theme) => theme.id === nextThemeId));
    setThemeId(nextThemeId);
    resetAnswer(nextProfiles[0]?.id);
  };

  if (!profile) return null;

  const requiredFacts = profile.standardFacts.filter((fact) => fact.required);
  const remembered = requiredFacts.filter((fact) => marks[fact.id] === "remembered").length;
  const marked = requiredFacts.filter((fact) => marks[fact.id]).length;
  const route = !revealed
    ? "pending"
    : recallLevel === "blank" || remembered === 0
      ? "R0"
      : remembered <= 1
        ? "R1"
        : relationMark === "not-yet"
          ? "R2"
          : relationMark === "fuzzy"
            ? "R3"
            : "R4";

  const routeCopy: Record<string, { title: Localized; action: Localized }> = {
    R0: { title: { ja: "R0｜まずカードへ戻る", zh: "R0｜先回到卡片学习" }, action: { ja: "60～90秒だけ確認し、閉じて同じ建築をもう一度想起する。", zh: "查看卡片60—90秒，然后关闭答案，立即重答同一建筑。" } },
    R1: { title: { ja: "R1｜断片を二つ補う", zh: "R1｜补两个事实缺口" }, action: { ja: "曖昧・未想起の欄から二つだけ選び、キーワードを追加する。", zh: "从模糊或没记住的维度中只选两个，补充关键词。" } },
    R2: { title: { ja: "R2｜事実を関係へ変える", zh: "R2｜把事实变成关系" }, action: { ja: "下の「なぜ／比較」問題を一つ選び、一文で答える。", zh: "选择下面一个“为什么／比较”微问题，用一句话回答。" } },
    R3: { title: { ja: "R3｜Track A / Bで整理する", zh: "R3｜进入 Track A / B 组织材料" }, action: { ja: "事実と関係はある。図面分析または主題論述の枠に入れて順序をつくる。", zh: "已经有事实和一条关系；进入单体分析或主题论述框架组织顺序。" } },
    R4: { title: { ja: "R4｜3～5文の短答へ", zh: "R4｜尝试3—5句短答" }, action: { ja: "背景→仕組み→空間→意義を3～5文で時間を計って書く。", zh: "按背景→机制→空间→意义，限时写3—5句。" } },
  };

  const t = (value: Localized | { ja: string; zh: string }) => value[lang];

  return (
    <section id="recall" data-testid="recall-practice" className="mb-10 overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-sm">
      <div className="bg-slate-950 px-5 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-amber-300">SPECIALIST 2-2 · ACTIVE RECALL</p>
            <h2 className="mt-2 text-2xl font-black">{lang === "ja" ? "建築事例を思い出してから、論述へ進む" : "先主动回忆建筑案例，再决定是否进入论述"}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{lang === "ja" ? "過去問から選んだ9件だけを、歴史テーマごとに抽出します。最初は完成答案でなく、混合言語のキーワードで十分です。" : "只从过去问筛选出的9个锚点中按历史主题抽取。第一步不要求完整答案，中日英混合关键词即可。"}</p>
          </div>
          <div className="min-w-64">
            <label className="text-xs font-bold text-slate-300" htmlFor="recall-theme">{lang === "ja" ? "テーマで抽出" : "按主题抽取"}</label>
            <select id="recall-theme" value={themeId} onChange={(event) => selectTheme(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-white">
              <option value="all">{lang === "ja" ? `全テーマ（${profiles.length}件）` : `全部主题（${profiles.length}个）`}</option>
              {themes.map((theme) => <option key={theme.id} value={theme.id}>{t(theme.name)}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-slate-200 bg-stone-50 p-5 lg:border-b-0 lg:border-r sm:p-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200 bg-white">
            {profile.imageFile ? <Image src={`/architecture-images/${profile.imageFile}`} alt={t(profile.names)} fill unoptimized loading="eager" sizes="(max-width: 1024px) 100vw, 42vw" className="object-contain p-2" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">NO IMAGE</div>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{profile.themes.map((theme) => <span key={theme.id} className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-bold text-violet-800">{t(theme.name)}</span>)}</div>
          <h3 className="mt-3 text-xl font-black text-slate-950">{t(profile.names)}</h3>
          <p className="mt-1 text-sm text-slate-500">{profile.names.en} · {profile.names.original}</p>
          <p className="mt-3 text-xs text-slate-500">{lang === "ja" ? "過去問" : "过去问"}：{profile.examRefs.map((ref) => `${ref.year} ${ref.question}`).join(" · ")}</p>
          <button data-testid="recall-next" type="button" onClick={drawNext} className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-violet-400 hover:text-violet-700">{lang === "ja" ? "別の建築を抽出 ↻" : "抽取另一座建筑 ↻"}</button>
        </div>

        <div className="p-5 sm:p-7">
          <p className="text-xs font-black text-violet-700">01 · SELF CHECK</p>
          <h4 className="mt-1 text-lg font-black text-slate-950">{lang === "ja" ? "今の感覚を先に選ぶ" : "先选择当前回忆强度"}</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">{LEVELS.map((level) => <button key={level.id} type="button" onClick={() => setRecallLevel(level.id)} className={`rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition ${recallLevel === level.id ? "border-violet-600 bg-violet-50 text-violet-800" : "border-slate-200 text-slate-600 hover:border-violet-300"}`}>{level[lang]}</button>)}</div>

          <label htmlFor="recall-text" className="mt-6 block text-xs font-black text-violet-700">02 · {lang === "ja" ? "自由想起｜言語を混ぜてよい" : "自由回忆｜允许混合语言"}</label>
          <textarea id="recall-text" value={recallText} onChange={(event) => setRecallText(event.target.value)} rows={5} placeholder={lang === "ja" ? "時代、人物、様式、構造、空間、なぜ重要か… 思い出せる語だけを書く" : "时代、人物、样式、结构、空间、为什么重要……只写想得起来的词"} className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
          {!revealed ? <button data-testid="recall-reveal" type="button" disabled={!recallLevel} onClick={() => setRevealed(true)} className="mt-4 w-full rounded-2xl bg-violet-700 px-5 py-3 font-black text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40">{lang === "ja" ? "カードを開いて照合する" : "揭晓卡片并对照"}</button> : <button data-testid="recall-retry" type="button" onClick={() => resetAnswer(profile.id)} className="mt-4 w-full rounded-2xl border border-violet-300 px-5 py-3 font-black text-violet-800 hover:bg-violet-50">{lang === "ja" ? "同じ建築を閉じて再回答" : "关闭答案，重答同一建筑"}</button>}
        </div>
      </div>

      {revealed && <div className="border-t border-slate-200 bg-slate-50 px-5 py-7 sm:px-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <div>
            <p className="text-xs font-black text-emerald-700">03 · CARD SUPPLEMENT</p>
            <h4 className="mt-1 text-lg font-black text-slate-950">{lang === "ja" ? "標準カードと事実を照合する" : "对照标准卡片中的事实"}</h4>
            <p className="mt-1 text-xs text-slate-500">{lang === "ja" ? "下はカードが補った内容です。自分で思い出した内容とは別に記録します。" : "以下是卡片补充内容；请与自己主动回忆出的内容分开判断。"}</p>
            <div className="mt-4 space-y-3">{profile.standardFacts.map((fact) => <article key={fact.id} data-testid={`recall-fact-${fact.id}`} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2"><h5 className="font-black text-slate-900">{t(dimensionLabels[fact.dimension] ?? { ja: fact.dimension, zh: fact.dimension })}{!fact.required && <span className="ml-2 text-[10px] font-bold text-slate-400">OPTIONAL</span>}</h5><div className="flex flex-wrap gap-1">{MARKS.map((mark) => <button key={mark.id} data-testid={`recall-mark-${fact.id}-${mark.id}`} type="button" onClick={() => setMarks((current) => ({ ...current, [fact.id]: mark.id }))} className={`rounded-full border px-2 py-1 text-[10px] font-bold ${marks[fact.id] === mark.id ? mark.color : "border-slate-200 bg-white text-slate-400"}`}>{mark[lang]}</button>)}</div></div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{t(fact.text)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{fact.keywords.slice(0, 5).map((keyword) => <span key={keyword} className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{keyword}</span>)}</div>
            </article>)}</div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
              <p className="text-xs font-black text-sky-800">LANGUAGE CONVERSION</p>
              <p className="mt-1 text-xs text-sky-700">{lang === "ja" ? "片仮名と原語を同時に確認" : "片假名与原语言同时显示"}</p>
              <dl className="mt-3 space-y-3">{profile.termSupport.map((term) => <div key={term.ja}><dt className="text-sm font-black text-slate-900">{lang === "ja" ? term.ja : term.zh}</dt><dd className="text-xs text-slate-600">{term.original} <span className="text-slate-400">({term.language})</span></dd></div>)}</dl>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-black text-amber-800">DIAGRAM LABELS</p>
              <p className="mt-2 text-xs leading-5 text-amber-900">{profile.diagram.labels.join(" · ")}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-xs font-black text-rose-800">CAUTION</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-5 text-rose-900">{profile.cautions.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          </aside>
        </div>

        <div className="mt-7 rounded-3xl border border-violet-200 bg-white p-5 sm:p-6">
          <p className="text-xs font-black text-violet-700">04 · RELATION CHECK</p>
          <h4 className="mt-1 text-lg font-black text-slate-950">{lang === "ja" ? "事実を一つの因果・比較へ変える" : "把事实转化成一条因果或比较关系"}</h4>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">{profile.relations.map((relation) => <article key={relation.id} className="rounded-2xl bg-violet-50 p-4"><span className="text-[10px] font-black uppercase tracking-wider text-violet-500">{relation.type}</span><p className="mt-1 font-bold text-violet-950">{t(relation.prompt)}</p>{showRelation && <p className="mt-3 border-t border-violet-200 pt-3 text-sm leading-6 text-violet-900">{t(relation.answerFrame)}</p>}</article>)}</div>
          <button data-testid="recall-relation-toggle" type="button" onClick={() => setShowRelation((value) => !value)} className="mt-3 text-sm font-black text-violet-700">{showRelation ? (lang === "ja" ? "関係例を隠す" : "隐藏关系示例") : (lang === "ja" ? "考えてから関係例を見る →" : "思考后查看关系示例 →")}</button>
          <div className="mt-5 flex flex-wrap gap-2">{(["not-yet", "fuzzy", "can-explain"] as RelationMark[]).map((mark) => <button key={mark} data-testid={`recall-relation-${mark}`} type="button" onClick={() => setRelationMark(mark)} className={`rounded-full border px-3 py-2 text-xs font-bold ${relationMark === mark ? "border-violet-600 bg-violet-700 text-white" : "border-slate-200 text-slate-500"}`}>{mark === "not-yet" ? (lang === "ja" ? "まだ説明できない" : "还不会解释") : mark === "fuzzy" ? (lang === "ja" ? "見れば分かる" : "看到后能理解") : (lang === "ja" ? "自分で説明できる" : "能够自己解释")}</button>)}</div>
        </div>

        {marked > 0 && routeCopy[route] && <div data-testid="recall-route" className="mt-6 rounded-3xl bg-slate-950 p-5 text-white sm:p-6">
          <p className="text-xs font-black tracking-wider text-amber-300">NEXT ROUTE · {remembered}/{requiredFacts.length}</p>
          <h4 className="mt-2 text-xl font-black">{t(routeCopy[route].title)}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">{t(routeCopy[route].action)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {route === "R3" || route === "R4" ? <><Link href="/history/essay-framework/building" className="rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-black text-slate-950">Track A · {lang === "ja" ? "単体分析" : "单体分析"}</Link><Link href="/history/essay-framework/thematic" className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-black text-white">Track B · {lang === "ja" ? "主題論述" : "主题论述"}</Link></> : <button type="button" onClick={() => resetAnswer(profile.id)} className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-950">{lang === "ja" ? "同じ建築を再回答" : "重答同一建筑"}</button>}
            <button type="button" onClick={drawNext} className="rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-bold text-white">{lang === "ja" ? "次の建築" : "下一座建筑"} →</button>
          </div>
        </div>}
      </div>}
    </section>
  );
}
