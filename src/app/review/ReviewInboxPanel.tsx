"use client";

import { useEffect, useRef, useState } from "react";
import {
  importReviewInbox,
  readReviewInbox,
  REVIEW_INBOX_EVENT,
  REVIEW_INBOX_KEY,
  REVIEW_INBOX_NOTION_URL,
  saveReviewInboxCandidate,
  updateReviewInboxCandidate,
  type ReviewInboxCandidate,
} from "@/lib/review-inbox";
import {
  REVIEW_SUBJECT_META,
  type ReviewItemSubject,
  type ReviewLocale,
} from "@/lib/review-items";

const copy = {
  zh: {
    eyebrow: "REVIEW INBOX · 待整理",
    title: "把新錯題先放進候選箱",
    description: "做題時只捕捉缺口；每週再把反覆出錯、需要圖片或能連到多年份的項目升級成正式復盤卡。",
    add: "新增候選",
    subject: "科目",
    titleField: "錯點標題",
    topic: "主題",
    year: "年份",
    prompt: "最小問題",
    answer: "最低答案（可以之後補）",
    reason: "為什麼會錯／容易混淆",
    source: "Notion 或題目來源網址",
    visual: "這條需要圖片幫助記憶",
    visualNote: "需要什麼圖？例如：剖面、作品照片、比較圖",
    save: "放入候選箱",
    empty: "候選箱是空的。普通粗心題可以留在錯題隊列，不必全部升級。",
    ready: "待同步",
    draft: "待整理",
    synced: "已同步",
    archived: "已封存",
    markReady: "整理完成",
    markDraft: "退回整理",
    markSynced: "標記已同步",
    archive: "封存",
    export: "匯出備份",
    import: "匯入備份",
    notion: "打開 Notion 候選箱",
    count: (count: number) => `${count} 條未封存候選`,
    saved: "已加入候選箱",
    imported: (count: number) => `已匯入 ${count} 條`,
    steps: ["網站快速捕捉錯點", "到 Notion 補圖片與最低答案", "標記待同步後交給 Codex 批量更新"],
  },
  ja: {
    eyebrow: "REVIEW INBOX · 整理待ち",
    title: "新しい誤答を候補箱に入れる",
    description: "解答中は弱点だけを捕捉し、週1回、反復誤答・画像が必要・複数年に関係する項目だけを正式な復習カードへ昇格します。",
    add: "候補を追加",
    subject: "科目",
    titleField: "誤答ポイント",
    topic: "テーマ",
    year: "年度",
    prompt: "最小の問い",
    answer: "最低限の解答（後で追記可）",
    reason: "誤答・混同の理由",
    source: "Notion または問題のURL",
    visual: "画像を使って覚える必要がある",
    visualNote: "必要な図：断面、作品写真、比較図など",
    save: "候補箱に入れる",
    empty: "候補はありません。単発のケアレスミスは誤答キューのままで構いません。",
    ready: "同期待ち",
    draft: "整理待ち",
    synced: "同期済み",
    archived: "保管済み",
    markReady: "整理完了",
    markDraft: "整理へ戻す",
    markSynced: "同期済みにする",
    archive: "保管",
    export: "バックアップを書き出す",
    import: "バックアップを読み込む",
    notion: "Notion候補箱を開く",
    count: (count: number) => `未保管の候補 ${count} 件`,
    saved: "候補箱に追加しました",
    imported: (count: number) => `${count} 件を読み込みました`,
    steps: ["サイトで弱点を素早く記録", "Notionで画像と最低限の解答を補う", "同期待ちにして Codex が一括更新"],
  },
};

const emptyForm = {
  title: "",
  subject: "environment" as ReviewItemSubject,
  topic: "",
  year: "",
  prompt: "",
  minimumAnswer: "",
  errorReason: "",
  sourceUrl: "",
  visualRequired: true,
  visualNote: "",
};

export default function ReviewInboxPanel({ locale }: { locale: ReviewLocale }) {
  const t = copy[locale];
  const [items, setItems] = useState<ReviewInboxCandidate[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setItems(readReviewInbox());
    sync();
    window.addEventListener(REVIEW_INBOX_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(REVIEW_INBOX_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const activeItems = items.filter((item) => item.status !== "archived");
  const submit = () => {
    if (!form.title.trim() || !form.prompt.trim()) return;
    saveReviewInboxCandidate({
      title: form.title.trim(),
      subject: form.subject,
      topic: form.topic.trim(),
      year: form.year ? Number(form.year) : undefined,
      prompt: form.prompt.trim(),
      minimumAnswer: form.minimumAnswer.trim(),
      errorReason: form.errorReason.trim(),
      sourceUrl: form.sourceUrl.trim() || undefined,
      visualRequired: form.visualRequired,
      visualNote: form.visualNote.trim(),
    });
    setForm(emptyForm);
    setMessage(t.saved);
  };

  const exportBackup = () => {
    const blob = new Blob(
      [JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), items }, null, 2)],
      { type: "application/json" },
    );
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `review-inbox-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(href);
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const count = importReviewInbox(Array.isArray(parsed) ? parsed : parsed.items);
      setMessage(t.imported(count));
    } catch {
      setMessage("JSON error");
    }
  };

  return (
    <section id="review-inbox" className="mt-10 rounded-3xl border border-fuchsia-200 bg-fuchsia-50/70 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-fuchsia-700">{t.eyebrow}</p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">{t.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t.description}</p>
          <p className="mt-2 text-xs font-semibold text-fuchsia-700">{t.count(activeItems.length)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={REVIEW_INBOX_NOTION_URL} target="_blank" rel="noreferrer" className="rounded-full bg-fuchsia-700 px-3 py-2 text-xs font-semibold text-white">{t.notion} ↗</a>
          <button onClick={exportBackup} className="rounded-full border border-fuchsia-200 bg-white px-3 py-2 text-xs font-semibold text-fuchsia-800">{t.export}</button>
          <button onClick={() => importRef.current?.click()} className="rounded-full border border-fuchsia-200 bg-white px-3 py-2 text-xs font-semibold text-fuchsia-800">{t.import}</button>
          <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={(event) => void importBackup(event.target.files?.[0])} />
        </div>
      </div>

      <ol className="mt-4 grid gap-2 text-xs text-fuchsia-900 sm:grid-cols-3">
        {t.steps.map((step, index) => (
          <li key={step} className="rounded-xl border border-fuchsia-100 bg-white/80 px-3 py-2">
            <b className="mr-1 text-fuchsia-700">{index + 1}.</b>{step}
          </li>
        ))}
      </ol>

      <details className="mt-5 rounded-2xl border border-fuchsia-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-bold text-fuchsia-900">{t.add}</summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value as ReviewItemSubject })} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
            {(Object.keys(REVIEW_SUBJECT_META) as ReviewItemSubject[]).map((subject) => <option key={subject} value={subject}>{locale === "ja" ? REVIEW_SUBJECT_META[subject].labelJa : REVIEW_SUBJECT_META[subject].label}</option>)}
          </select>
          <input value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} inputMode="numeric" placeholder={t.year} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder={t.titleField} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} placeholder={t.topic} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <textarea value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} placeholder={t.prompt} className="min-h-24 rounded-xl border border-slate-200 px-3 py-2.5 text-sm sm:col-span-2" />
          <textarea value={form.minimumAnswer} onChange={(event) => setForm({ ...form, minimumAnswer: event.target.value })} placeholder={t.answer} className="min-h-20 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <textarea value={form.errorReason} onChange={(event) => setForm({ ...form, errorReason: event.target.value })} placeholder={t.reason} className="min-h-20 rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={form.sourceUrl} onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })} placeholder={t.source} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.visualRequired} onChange={(event) => setForm({ ...form, visualRequired: event.target.checked })} />
            {t.visual}
          </label>
          <input value={form.visualNote} onChange={(event) => setForm({ ...form, visualNote: event.target.value })} placeholder={t.visualNote} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
        </div>
        <button onClick={submit} disabled={!form.title.trim() || !form.prompt.trim()} className="mt-4 rounded-xl bg-fuchsia-700 px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{t.save}</button>
        {message && <span className="ml-3 text-xs text-fuchsia-700">{message}</span>}
      </details>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {activeItems.map((item) => (
          <article key={item.id} className="rounded-2xl border border-fuchsia-100 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{locale === "ja" ? REVIEW_SUBJECT_META[item.subject].labelJa : REVIEW_SUBJECT_META[item.subject].label}</span>
              {item.year && <span>· {item.year}</span>}
              <span className="ml-auto rounded-full bg-fuchsia-100 px-2 py-0.5 font-semibold text-fuchsia-800">{t[item.status]}</span>
            </div>
            <h3 className="mt-2 font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Q. {item.prompt}</p>
            {item.visualRequired && <p className="mt-2 text-xs text-violet-700">🖼 {item.visualNote || t.visual}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {item.status === "draft" ? (
                <button onClick={() => updateReviewInboxCandidate(item.id, { status: "ready" })} className="rounded-full bg-fuchsia-700 px-3 py-1 text-xs font-semibold text-white">{t.markReady}</button>
              ) : (
                <button onClick={() => updateReviewInboxCandidate(item.id, { status: "draft" })} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{t.markDraft}</button>
              )}
              <button onClick={() => updateReviewInboxCandidate(item.id, { status: "synced" })} className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">{t.markSynced}</button>
              <button onClick={() => updateReviewInboxCandidate(item.id, { status: "archived" })} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">{t.archive}</button>
            </div>
          </article>
        ))}
      </div>
      {activeItems.length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-fuchsia-200 bg-white/70 px-5 py-8 text-center text-sm text-slate-500">{t.empty}</p>}
      <p className="mt-3 text-[11px] text-slate-400">localStorage · {REVIEW_INBOX_KEY}</p>
    </section>
  );
}
