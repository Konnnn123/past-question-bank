"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import {
  ENVIRONMENT_MEMORY_CARDS,
  JAPANESE_MEMORY_COPY,
  MEMORY_TOPICS,
  type EnvironmentMemoryTopic,
} from "@/lib/environment-memory";

const colors: Record<string, string> = {
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  orange: "border-orange-200 bg-orange-50 text-orange-900",
  violet: "border-violet-200 bg-violet-50 text-violet-900",
  sky: "border-sky-200 bg-sky-50 text-sky-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  teal: "border-teal-200 bg-teal-50 text-teal-900",
  fuchsia: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900",
  slate: "border-slate-200 bg-slate-50 text-slate-900",
};

const topicDescriptions: Record<EnvironmentMemoryTopic, string> = {
  日照: "太陽位置・日射・日影",
  温熱: "人体の温冷感と指標",
  照明: "測光量・採光・色彩",
  換気: "室内空気質・自然換気・流体",
  伝熱: "熱抵抗・熱流・放射",
  湿気: "湿り空気・露点・結露",
  音響: "dB・残響・遮音",
  設備: "空調・給排水・省エネ",
};

export default function EnvironmentMemoryClient() {
  const [topic, setTopic] = useState<EnvironmentMemoryTopic | "all">("all");
  const [hidden, setHidden] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [chineseHelp, setChineseHelp] = useState<Set<string>>(() => new Set());
  const cards = useMemo(
    () =>
      topic === "all"
        ? ENVIRONMENT_MEMORY_CARDS
        : ENVIRONMENT_MEMORY_CARDS.filter((card) => card.topic === topic),
    [topic],
  );
  const reveal = (id: string) =>
    setRevealed((current) => new Set(current).add(id));
  const toggleChinese = (id: string) =>
    setChineseHelp((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  const hideAll = () => {
    setRevealed(new Set());
    setHidden(true);
  };

  const sidebar = (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-xs font-semibold tracking-wide text-cyan-700">
          建築環境工学 · 記憶マップ
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          問題を先に読み、自分で答えてから要点と誤答ポイントを開く。
        </p>
      </div>
      <div className="space-y-1 text-xs">
        <a href="#memory" className="block text-slate-600 hover:text-cyan-700">
          想起カード
        </a>
        <a href="#route" className="block text-slate-600 hover:text-cyan-700">
          15分ルート
        </a>
        <Link
          href="/environment-knowledge"
          className="block font-medium text-violet-700 hover:text-violet-900"
        >
          重要公式 →
        </Link>
        <Link
          href="/environment-knowledge-map"
          className="block font-medium text-emerald-700 hover:text-emerald-900"
        >
          過去問トレーニング →
        </Link>
      </div>
    </div>
  );

  return (
    <SidebarLayout slot={sidebar}>
      <div className="min-h-full bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
          <Link
            href="/explore"
            className="text-sm text-slate-500 hover:text-cyan-800"
          >
            ← 探索に戻る
          </Link>
        </header>
        <main className="mx-auto max-w-6xl space-y-9 px-5 py-8 sm:px-8">
          <section>
            <p className="text-sm font-semibold tracking-wide text-cyan-700">
              ARCHITECTURAL ENVIRONMENT · MEMORY
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              建築環境工学：記憶マップ
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              総合知識ファイルを、何度も自力で答え直せる短いカードにした。各カードは「問い・記憶のフック・最も多い誤り」に絞り、年度は関連する過去問の範囲を示す。
            </p>
          </section>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {MEMORY_TOPICS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTopic(item.id)}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${colors[item.color]} ${topic === item.id ? "ring-2 ring-cyan-500" : ""}`}
              >
                <p className="font-bold">{item.id}</p>
                <p className="mt-1 text-xs leading-5 opacity-75">
                  {topicDescriptions[item.id]}
                </p>
              </button>
            ))}
          </section>
          <section id="memory" className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">想起カード</h2>
                <p className="mt-1 text-sm text-slate-500">
                  答えを見ずに先に言う。1枚20〜40秒で十分。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTopic("all")}
                  className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
                >
                  全モジュール
                </button>
                <button
                  onClick={() => (hidden ? setHidden(false) : hideAll())}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${hidden ? "bg-cyan-700 text-white" : "bg-cyan-100 text-cyan-900"}`}
                >
                  {hidden ? "すべての答えを表示" : "すべての答えを隠す"}
                </button>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {cards.map((card) => {
                const shown = !hidden || revealed.has(card.id);
                const ja = JAPANESE_MEMORY_COPY[card.id] ?? card;
                return (
                  <article
                    key={card.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800">
                        {card.topic}
                      </span>
                      <span className="text-xs text-slate-400">
                        過去問：{card.years}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">
                      {ja.title}
                    </h3>
                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-800">
                      Q. {ja.prompt}
                    </p>
                    {shown ? (
                      <div className="mt-3 space-y-3">
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                          <p className="font-semibold">答え</p>
                          <p className="mt-1">{ja.answer}</p>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                            <span className="font-bold">記憶フック：</span>
                            {ja.hook}
                          </p>
                          <p className="rounded-lg bg-rose-50 p-3 text-xs leading-5 text-rose-900">
                            <span className="font-bold">よくある誤り：</span>
                            {ja.trap}
                          </p>
                        </div>
                        {!!JAPANESE_MEMORY_COPY[card.id] && (
                          <button
                            onClick={() => toggleChinese(card.id)}
                            className="text-xs font-medium text-slate-500 underline decoration-dotted underline-offset-4 hover:text-cyan-800"
                          >
                            {chineseHelp.has(card.id)
                              ? "中文辅助を閉じる"
                              : "中文辅助"}
                          </button>
                        )}
                        {!!JAPANESE_MEMORY_COPY[card.id] &&
                          chineseHelp.has(card.id) && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                              <p>
                                <b>问题：</b>
                                {card.prompt}
                              </p>
                              <p className="mt-2">
                                <b>答案：</b>
                                {card.answer}
                              </p>
                              <p className="mt-2">
                                <b>记忆：</b>
                                {card.hook}
                              </p>
                              <p className="mt-2">
                                <b>易错：</b>
                                {card.trap}
                              </p>
                            </div>
                          )}
                      </div>
                    ) : (
                      <button
                        onClick={() => reveal(card.id)}
                        className="mt-3 w-full rounded-xl border border-dashed border-cyan-300 bg-cyan-50 px-3 py-3 text-sm font-medium text-cyan-800 hover:bg-cyan-100"
                      >
                        考えてから、答えを表示
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
          <section
            id="route"
            className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-xl font-bold text-slate-900">
              15分の記憶ルート
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6">
                <b>1 · 5分</b>
                <br />
                1モジュールを選び、4枚連続で答える。
              </p>
              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6">
                <b>2 · 5分</b>
                <br />
                「よくある誤り」だけを記録し、公式ページで母式を補う。
              </p>
              <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6">
                <b>3 · 5分</b>
                <br />
                過去問トレーニングで同年の問題を解き、記憶を検証する。
              </p>
            </div>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
}
