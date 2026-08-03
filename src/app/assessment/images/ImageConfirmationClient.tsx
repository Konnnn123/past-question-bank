"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";

interface ImageAsset {
  id: string; fileName: string; webPath: string | null;
  entityNames: string[]; period: string; style: string; people: string;
  originalName: string; imageRole: string; humanConfirmed: boolean;
}

const STORAGE_KEY = "image-confirmation-v1";

export default function ImageConfirmationClient({
  assets, confirmed: initialConfirmed,
}: { assets: ImageAsset[]; confirmed: number }) {
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "unconfirmed" | "confirmed">("unconfirmed");

  // Load saved progress
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      setConfirmed(new Set(saved));
    } catch { /* ignore */ }
  }, []);

  const save = (ids: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  };

  const confirm = (id: string) => {
    const next = new Set(confirmed);
    next.add(id);
    setConfirmed(next);
    save(next);
  };

  const unconfirm = (id: string) => {
    const next = new Set(confirmed);
    next.delete(id);
    setConfirmed(next);
    save(next);
  };

  const filtered = assets.filter((a) =>
    filter === "all" ? true :
    filter === "confirmed" ? confirmed.has(a.id) :
    !confirmed.has(a.id)
  );
  const current = filtered[index];
  const totalConfirmed = confirmed.size;

  const goTo = (delta: number) => {
    setIndex(Math.max(0, Math.min(filtered.length - 1, index + delta)));
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "y" || e.key === "Y") { if (current) confirm(current.id); goTo(1); }
      if (e.key === "n" || e.key === "N") { goTo(1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, current, confirmed]);

  if (!current) {
    return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/assessment" className="text-sm text-slate-500 hover:text-indigo-700">← 返回评估</Link>
        <h1 className="mt-4 text-2xl font-bold">图片确认</h1>
        <p className="mt-4 text-slate-500">
          已确认 <strong>{totalConfirmed}</strong> / {assets.length} 张
          {totalConfirmed >= 4
            ? " ✅ 已足够生成第一道图像匹配题"
            : ` （至少需要 4 张，还需 ${4 - totalConfirmed} 张）`}
        </p>
        {filtered.length === 0 && filter === "unconfirmed" && (
          <p className="mt-8 text-emerald-600 font-medium">全部图片已确认！</p>
        )}
        {filtered.length === 0 && filter !== "unconfirmed" && (
          <button onClick={() => { setFilter("unconfirmed"); setIndex(0); }}
            className="mt-4 rounded-full bg-indigo-700 px-4 py-2 text-sm text-white">
            查看未确认
          </button>
        )}
      </div>
    </main></SidebarLayout>;
  }

  return <SidebarLayout><main className="min-h-full bg-white px-5 py-8 sm:px-8">
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/assessment" className="text-sm text-slate-500 hover:text-indigo-700">← 返回评估</Link>
          <h1 className="mt-2 text-2xl font-bold">图片确认</h1>
        </div>
        <div className="text-right text-sm text-slate-500">
          已确认 <strong className="text-emerald-600">{totalConfirmed}</strong>/{assets.length}
          {totalConfirmed >= 4 && <span className="ml-2 text-emerald-500">✅</span>}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
        <div className="h-1.5 rounded-full bg-indigo-600 transition-all"
          style={{ width: `${((index + 1) / filtered.length) * 100}%` }} />
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex gap-2">
        {(["unconfirmed", "confirmed", "all"] as const).map((f) => (
          <button key={f} onClick={() => { setFilter(f); setIndex(0); }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === f ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
            {f === "unconfirmed" ? "未确认" : f === "confirmed" ? "已确认" : "全部"}
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {index + 1}/{filtered.length} · 快捷键: Y=确认 N=跳过 ← → 导航
      </p>

      {/* Image card */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6">
        {/* Image */}
        <div className="flex justify-center bg-slate-100 rounded-xl p-4">
          {current.webPath ? (
            <img src={current.webPath} alt={current.entityNames[0] ?? current.fileName}
              className="max-h-96 max-w-full rounded-lg object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <p className="text-slate-400 py-16">图片不可用</p>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-slate-400">建筑:</span>
            <span className="ml-2 font-bold text-slate-900">{current.entityNames[0] || "—"}</span>
          </div>
          <div>
            <span className="text-slate-400">原语:</span>
            <span className="ml-2 text-slate-600">{current.originalName || "—"}</span>
          </div>
          <div>
            <span className="text-slate-400">时代:</span>
            <span className="ml-2 text-slate-700">{current.period || "—"}</span>
          </div>
          <div>
            <span className="text-slate-400">样式:</span>
            <span className="ml-2 text-slate-700">{current.style || "—"}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400">建筑师:</span>
            <span className="ml-2 text-slate-700">{current.people || "—"}</span>
          </div>
        </div>

        <div className="mt-2 flex gap-2 text-xs text-slate-400">
          <span>类型: {current.imageRole}</span>
          <span>·</span>
          <span>文件: {current.fileName}</span>
        </div>

        {/* Status */}
        {confirmed.has(current.id) ? (
          <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
            ✅ 已确认
            <button onClick={() => unconfirm(current.id)}
              className="ml-3 text-xs text-rose-500 hover:underline">撤销</button>
          </div>
        ) : (
          <div className="mt-4 flex gap-3">
            <button onClick={() => { confirm(current.id); }}
              className="flex-1 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              ✅ 确认 — 图片正确
            </button>
            <button onClick={() => goTo(1)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
              跳过 →
            </button>
          </div>
        )}
      </section>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button onClick={() => goTo(-1)} disabled={index === 0}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-30">← 上一张</button>
        <span className="text-sm text-slate-400">{index + 1} / {filtered.length}</span>
        <button onClick={() => goTo(1)} disabled={index === filtered.length - 1}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm disabled:opacity-30">下一张 →</button>
      </div>

      {/* Quick hint */}
      {totalConfirmed >= 4 && (
        <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-200 p-3 text-sm text-indigo-700">
          ✅ 已满足最小图片数（4张）。可生成第一道 multi-wordbank matching 原型题。
        </div>
      )}
    </div>
  </main></SidebarLayout>;
}
