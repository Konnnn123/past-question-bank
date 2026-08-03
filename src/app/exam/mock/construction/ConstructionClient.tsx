"use client";
import { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";

export default function ConstructionClient({ data }: { data: Record<string, unknown> }) {
  const [revealed, setRevealed] = useState(false);
  const items = (data.items ?? []) as Array<{ sentence: string; answer: string }>;
  const bank = (data.wordBank ?? []) as string[];
  const answers = (data.correctAnswers ?? {}) as Record<string, string>;

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8">
    <div className="mx-auto max-w-3xl">
      <Link href="/exam/mock" className="text-sm text-slate-500 hover:text-indigo-700">← 返回模拟组卷</Link>
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold">建筑构法 · 語群填空</h1>
          <p className="text-sm text-slate-500">{items.length} 空 · {bank.length} 术语語群 · {String(data.surplusRatio ?? "?")} 过剩 · 2022 Q3 形式</p>
          {data.fixesFromV1 ? <p className="text-xs text-amber-600 mt-1">{(data.fixesFromV1 as string[]).join(" / ")}</p> : null}
        </div>
        <button onClick={() => setRevealed(!revealed)}
          className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white">
          {revealed ? "隐藏答案" : "查看答案"}
        </button>
      </div>

      {/* Word bank */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-500 mb-2">【用語群】</p>
        <div className="flex flex-wrap gap-1.5">
          {bank.map((t, i) => (
            <span key={i} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-700">{t}</span>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-800 leading-relaxed">{item.sentence}</p>
            {revealed && (
              <p className="mt-2 text-sm font-bold text-emerald-700">
                答: {answers[`(${i + 1})`] ?? item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  </main></SidebarLayout>;
}
