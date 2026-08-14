"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { SidebarLayout } from "@/components/layout";
import {
  DEFAULT_API_SETTINGS,
  TERM_CARD_SYSTEM_PROMPT,
  TERM_SUBJECTS,
  generateTermCard,
  makeTermCard,
  normalizeTermDraft,
  readApiSettings,
  readTermCards,
  writeApiSettings,
  writeTermCards,
  type TermApiSettings,
  type TermCard,
  type TermCardDraft,
  type TermSubject,
} from "@/lib/term-card-library";

type IconName = "add" | "search" | "settings" | "spark" | "close" | "edit" | "trash" | "check" | "download" | "upload" | "arrow" | "book";

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    add: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.13.38.35.72.64.99.3.27.69.42 1.09.42H21v4h-.1A1.7 1.7 0 0 0 19.4 15Z" /></>,
    spark: <><path d="m12 3 1.3 4.2a5 5 0 0 0 3.4 3.4L21 12l-4.3 1.4a5 5 0 0 0-3.4 3.4L12 21l-1.3-4.2a5 5 0 0 0-3.4-3.4L3 12l4.3-1.4a5 5 0 0 0 3.4-3.4L12 3Z" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></>,
    upload: <><path d="M12 16V4m0 0 4 4m-4-4L8 8M5 20h14" /></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
}

function SubjectMark({ subject, small = false }: { subject: TermSubject; small?: boolean }) {
  return <span className={`${small ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"} flex shrink-0 items-center justify-center rounded-xl font-bold`} style={{ color: subject.color, backgroundColor: subject.softColor }}>{subject.short}</span>;
}

function FieldLabel({ children, optional = false }: { children: ReactNode; optional?: boolean }) {
  return <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">{children}{optional && <span className="ml-1 font-normal normal-case tracking-normal text-stone-400">（任意）</span>}</label>;
}

const inputClass = "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-100";

function SettingsDialog({ value, onSave, onClose }: { value: TermApiSettings; onSave: (settings: TermApiSettings) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(value);
  const [showKey, setShowKey] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="api-settings-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-[#fcfbf8] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">OpenAI互換API</p><h2 id="api-settings-title" className="mt-2 text-2xl font-bold text-stone-950">生成APIを接続</h2></div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-800" aria-label="閉じる"><Icon name="close" /></button>
        </div>
        <div className="mt-7 space-y-5">
          <div><FieldLabel>APIエンドポイント</FieldLabel><input className={inputClass} value={draft.endpoint} onChange={(event) => setDraft({ ...draft, endpoint: event.target.value })} placeholder="https://api.deepseek.com/chat/completions" /></div>
          <div><FieldLabel>モデル</FieldLabel><input className={inputClass} value={draft.model} onChange={(event) => setDraft({ ...draft, model: event.target.value })} placeholder="deepseek-chat" /></div>
          <div>
            <FieldLabel>APIキー</FieldLabel>
            <div className="relative"><input type={showKey ? "text" : "password"} autoComplete="off" className={`${inputClass} pr-16 font-mono`} value={draft.apiKey} onChange={(event) => setDraft({ ...draft, apiKey: event.target.value })} placeholder="sk-••••••••" /><button type="button" onClick={() => setShowKey((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">{showKey ? "隠す" : "表示"}</button></div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4"><input type="checkbox" checked={draft.rememberKey} onChange={(event) => setDraft({ ...draft, rememberKey: event.target.checked })} className="mt-0.5 h-4 w-4 accent-stone-900" /><span><span className="block text-sm font-semibold text-stone-800">このブラウザにAPIキーを保存</span><span className="mt-1 block text-xs leading-5 text-stone-500">オフの場合は現在のブラウザセッションだけに保持します。オンの場合はこの端末のlocalStorageに保存します。</span></span></label>
          <div className="rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-900"><b>静的サイトについて：</b>リクエストはブラウザから入力したAPIへ直接送信され、このサイトのサーバーは経由しません。個人用の利用上限付きキーを使用してください。CORSが許可されていない場合は、対応する中継エンドポイントが必要です。</div>
          <button type="button" onClick={() => setShowPrompt((current) => !current)} className="flex w-full items-center justify-between border-t border-stone-200 pt-4 text-left text-sm font-semibold text-stone-700"><span>プリセットPromptを表示</span><span className="text-stone-400">{showPrompt ? "−" : "+"}</span></button>
          {showPrompt && <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl bg-stone-900 p-4 text-[11px] leading-5 text-stone-200">{TERM_CARD_SYSTEM_PROMPT}</pre>}
        </div>
        <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100">キャンセル</button><button type="button" onClick={() => onSave(draft)} className="rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">設定を保存</button></div>
      </section>
    </div>
  );
}

function DraftEditor({ draft, setDraft }: { draft: TermCardDraft; setDraft: (draft: TermCardDraft) => void }) {
  const set = (key: keyof TermCardDraft, value: string | string[]) => setDraft({ ...draft, [key]: value });
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel>日本語の用語</FieldLabel><input lang="ja" className={inputClass} value={draft.termJa} onChange={(event) => set("termJa", event.target.value)} /></div>
        <div><FieldLabel optional>読み方</FieldLabel><input lang="ja" className={inputClass} value={draft.readingJa} onChange={(event) => set("readingJa", event.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel optional>英語表記</FieldLabel><input className={inputClass} value={draft.termEn} onChange={(event) => set("termEn", event.target.value)} /></div>
        <div><FieldLabel>分類</FieldLabel><input lang="ja" className={inputClass} value={draft.category} onChange={(event) => set("category", event.target.value)} /></div>
      </div>
      <div><FieldLabel>一言定義</FieldLabel><textarea lang="ja" rows={2} className={`${inputClass} resize-y leading-6`} value={draft.definitionJa} onChange={(event) => set("definitionJa", event.target.value)} /></div>
      <div><FieldLabel>理解の中心</FieldLabel><textarea lang="ja" rows={2} className={`${inputClass} resize-y leading-6`} value={draft.corePointJa} onChange={(event) => set("corePointJa", event.target.value)} /></div>
      <div><FieldLabel>見分ける手掛かり</FieldLabel><textarea lang="ja" rows={3} className={`${inputClass} resize-y leading-6`} value={draft.visualCluesJa.join("\n")} onChange={(event) => set("visualCluesJa", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} placeholder="手掛かりを1行に1つ入力" /></div>
      <div><FieldLabel>混同しやすい用語</FieldLabel><textarea lang="ja" rows={2} className={`${inputClass} resize-y leading-6`} value={draft.confusionJa} onChange={(event) => set("confusionJa", event.target.value)} /></div>
      <div><FieldLabel>代表例</FieldLabel><textarea lang="ja" rows={2} className={`${inputClass} resize-y leading-6`} value={draft.exampleJa} onChange={(event) => set("exampleJa", event.target.value)} /></div>
      <div><FieldLabel>答案用の短文</FieldLabel><textarea lang="ja" rows={2} className={`${inputClass} resize-y border-teal-200 bg-teal-50/40 leading-6 focus:border-teal-500 focus:ring-teal-100`} value={draft.examSentenceJa} onChange={(event) => set("examSentenceJa", event.target.value)} /></div>
      <div><FieldLabel optional>中国語の理解メモ</FieldLabel><input lang="zh-CN" className={inputClass} value={draft.memoZh} onChange={(event) => set("memoZh", event.target.value)} /></div>
      <div><FieldLabel optional>出典・要確認事項</FieldLabel><input lang="ja" className={inputClass} value={draft.sourceNote} onChange={(event) => set("sourceNote", event.target.value)} /></div>
    </div>
  );
}

function Composer({ subject, apiSettings, editing, onSettings, onClose, onSave }: { subject: TermSubject; apiSettings: TermApiSettings; editing: TermCard | null; onSettings: () => void; onClose: () => void; onSave: (draft: TermCardDraft, previous?: TermCard) => void }) {
  const [term, setTerm] = useState(editing?.termJa ?? "");
  const [category, setCategory] = useState(editing?.category ?? subject.categories[0]);
  const [context, setContext] = useState("");
  const [draft, setDraft] = useState<TermCardDraft | null>(editing ? normalizeTermDraft(editing, editing.category) : null);
  const [loading, setLoading] = useState(false);
  const [generationSlow, setGenerationSlow] = useState(false);
  const [error, setError] = useState("");

  const runGeneration = async () => {
    if (!term.trim()) { setError("先に用語を入力してください。"); return; }
    if (!apiSettings.apiKey) { onSettings(); return; }
    setLoading(true); setGenerationSlow(false); setError("");
    const slowTimer = window.setTimeout(() => setGenerationSlow(true), 45_000);
    try { setDraft(await generateTermCard(apiSettings, { term: term.trim(), subject, category, context })); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "生成に失敗しました。もう一度お試しください。"); }
    finally { window.clearTimeout(slowTimer); setLoading(false); setGenerationSlow(false); }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-stone-950/25 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="composer-title" className="flex h-full w-full max-w-2xl flex-col bg-[#fcfbf8] shadow-2xl">
        <header className="flex shrink-0 items-start justify-between border-b border-stone-200 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3"><SubjectMark subject={subject} /><div><p className="text-xs font-semibold" style={{ color: subject.color }}>{subject.labelJa}</p><h2 id="composer-title" className="mt-0.5 text-xl font-bold text-stone-950">{editing ? "カードを編集" : draft ? "生成結果を確認" : "新しい用語カード"}</h2></div></div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800" aria-label="閉じる"><Icon name="close" /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          {!editing && (
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div><FieldLabel>今日出会った用語</FieldLabel><input autoFocus lang="ja" className={`${inputClass} text-base font-medium`} value={term} onChange={(event) => setTerm(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing) void runGeneration(); }} placeholder="例：柱廊式門廊、カーテンウォール…" /></div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><FieldLabel>分類</FieldLabel><select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}>{subject.categories.map((item) => <option key={item}>{item}</option>)}</select></div>
                <div><FieldLabel optional>出会った文脈</FieldLabel><input lang="ja" className={inputClass} value={context} onChange={(event) => setContext(event.target.value)} placeholder="問題文、写真、元の文章など" /></div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={onSettings} className="text-xs text-stone-500 underline decoration-stone-300 underline-offset-4">{apiSettings.apiKey ? `${apiSettings.model} · 接続済み` : "API未設定"}</button><button type="button" disabled={loading} onClick={() => void runGeneration()} className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-wait disabled:opacity-60"><Icon name="spark" className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />{loading ? "知識を整理中…" : draft ? "再生成" : "カードを生成"}</button></div>
              {generationSlow && <p role="status" className="mt-3 text-xs leading-5 text-amber-700">APIからの応答を待っています。混雑時は1〜3分かかることがあります。この画面を開いたままお待ちください。</p>}
              {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-xs leading-5 text-rose-700">{error}</p>}
            </div>
          )}
          {draft ? <div className={`${editing ? "" : "mt-7"}`}><div className="mb-5 flex items-center gap-3"><span className="h-px flex-1 bg-stone-200" /><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">保存前に各項目を編集できます</span><span className="h-px flex-1 bg-stone-200" /></div><DraftEditor draft={draft} setDraft={setDraft} /></div> : !loading && !editing && <div className="px-4 py-14 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400"><Icon name="book" className="h-6 w-6" /></div><p className="mt-5 text-sm font-semibold text-stone-700">まず用語を一つ入力</p><p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-stone-400">AIが日本語の定義、英語表記、識別点、混同しやすい概念、実例、答案用短文を整理します。</p></div>}
        </div>
        {draft && <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-stone-200 bg-white px-5 py-4 sm:px-8"><p className="hidden text-xs text-stone-400 sm:block">AIの内容を確認してから保存してください。</p><div className="ml-auto flex gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-medium text-stone-500 hover:bg-stone-100">キャンセル</button><button type="button" onClick={() => onSave(draft, editing ?? undefined)} disabled={!draft.termJa || !draft.definitionJa || !draft.examSentenceJa} className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-40"><Icon name="check" className="h-4 w-4" />{subject.labelJa}に保存</button></div></footer>}
      </section>
    </div>
  );
}

function TermCardView({ card, subject, onEdit, onDelete, onToggle }: { card: TermCard; subject: TermSubject; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  return (
    <article className={`group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-[0_1px_2px_rgba(28,25,23,.03)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(28,25,23,.08)] sm:p-6 ${card.status === "remembered" ? "border-emerald-200/80" : "border-stone-200"}`}>
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: subject.color }} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ color: subject.color, backgroundColor: subject.softColor }}>{card.category || subject.labelJa}</span>{card.status === "remembered" && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">記憶済み</span>}</div><h3 lang="ja" className="mt-4 text-2xl font-bold tracking-tight text-stone-950">{card.termJa}</h3>{(card.readingJa || card.termEn) && <p className="mt-1.5 truncate text-xs text-stone-400">{card.readingJa}{card.readingJa && card.termEn && <span className="mx-2 text-stone-250">/</span>}<span className="font-medium text-stone-500">{card.termEn}</span></p>}</div>
        <div className="flex shrink-0 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"><button type="button" onClick={onEdit} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-800" aria-label={`${card.termJa}を編集`}><Icon name="edit" className="h-4 w-4" /></button><button type="button" onClick={onDelete} className="rounded-lg p-2 text-stone-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`${card.termJa}を削除`}><Icon name="trash" className="h-4 w-4" /></button></div>
      </div>
      <p lang="ja" className="mt-5 text-sm leading-7 text-stone-700">{card.definitionJa}</p>
      {card.corePointJa && <div className="mt-5 border-l-2 pl-4" style={{ borderColor: subject.color }}><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">理解の中心</p><p lang="ja" className="mt-1.5 text-sm font-medium leading-6 text-stone-800">{card.corePointJa}</p></div>}
      {card.visualCluesJa.length > 0 && <div className="mt-5"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">見分ける手掛かり</p><ul lang="ja" className="mt-2 space-y-1.5">{card.visualCluesJa.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2 text-xs leading-5 text-stone-600"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} />{item}</li>)}</ul></div>}
      {(card.confusionJa || card.exampleJa) && <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-2">{card.confusionJa && <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">混同しやすい用語</p><p lang="ja" className="mt-1.5 text-xs leading-5 text-stone-600">{card.confusionJa}</p></div>}{card.exampleJa && <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">代表例</p><p lang="ja" className="mt-1.5 text-xs leading-5 text-stone-600">{card.exampleJa}</p></div>}</div>}
      <div className="mt-5 rounded-2xl bg-stone-950 px-4 py-3.5 text-white"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-400">答案用の短文</p><p lang="ja" className="mt-1.5 text-sm leading-6">{card.examSentenceJa}</p></div>
      {card.memoZh && <p className="mt-3 text-xs leading-5 text-stone-400"><span lang="ja">中国語の理解メモ</span> · <span lang="zh-CN">{card.memoZh}</span></p>}
      <button type="button" onClick={onToggle} className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${card.status === "remembered" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}><Icon name="check" className="h-3.5 w-3.5" />{card.status === "remembered" ? "記憶済みを解除" : "記憶済みにする"}</button>
    </article>
  );
}

export default function TermCardsClient() {
  const [cards, setCards] = useState<TermCard[]>([]);
  const [apiSettings, setApiSettings] = useState<TermApiSettings>(DEFAULT_API_SETTINGS);
  const [activeSubjectId, setActiveSubjectId] = useState(TERM_SUBJECTS[0].id);
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "learning" | "remembered">("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<TermCard | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => { queueMicrotask(() => { setCards(readTermCards()); setApiSettings(readApiSettings()); setReady(true); }); }, []);

  const subject = TERM_SUBJECTS.find((item) => item.id === activeSubjectId) ?? TERM_SUBJECTS[0];
  const subjectCards = useMemo(() => cards.filter((card) => card.subjectId === activeSubjectId), [cards, activeSubjectId]);
  const categories = useMemo(() => Array.from(new Set([...subject.categories, ...subjectCards.map((card) => card.category).filter(Boolean)])), [subject, subjectCards]);
  const visibleCards = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return subjectCards.filter((card) => {
      if (activeCategory !== "all" && card.category !== activeCategory) return false;
      if (statusFilter !== "all" && card.status !== statusFilter) return false;
      if (!needle) return true;
      return [card.termJa, card.readingJa, card.termEn, card.definitionJa, card.corePointJa, card.memoZh, card.category].some((value) => value.toLocaleLowerCase().includes(needle));
    }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [subjectCards, activeCategory, statusFilter, query]);

  const persist = (next: TermCard[]) => { setCards(next); writeTermCards(next); };
  const saveCard = (draft: TermCardDraft, previous?: TermCard) => {
    const card = makeTermCard(draft, activeSubjectId, previous);
    persist(previous ? cards.map((item) => item.id === previous.id ? card : item) : [card, ...cards]);
    setComposerOpen(false); setEditing(null); setActiveCategory("all");
  };
  const openEdit = (card: TermCard) => { setEditing(card); setComposerOpen(true); };
  const removeCard = (card: TermCard) => { if (window.confirm(`「${card.termJa}」を削除しますか？この操作は取り消せません。`)) persist(cards.filter((item) => item.id !== card.id)); };
  const toggleCard = (card: TermCard) => persist(cards.map((item) => item.id === card.id ? { ...item, status: item.status === "remembered" ? "learning" : "remembered", updatedAt: new Date().toISOString() } : item));
  const saveSettings = (settings: TermApiSettings) => { const clean = { ...settings, endpoint: settings.endpoint.trim(), model: settings.model.trim(), apiKey: settings.apiKey.trim() }; setApiSettings(clean); writeApiSettings(clean); setSettingsOpen(false); };

  const exportCards = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `term-cards-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
  };
  const importCards = async (file: File) => {
    try {
      const value: unknown = JSON.parse(await file.text());
      if (!Array.isArray(value)) throw new Error("ファイルの内容がカード配列ではありません。");
      const imported = value.map((item, index) => {
        if (typeof item !== "object" || item === null) throw new Error(`${index + 1}件目が有効なカードではありません。`);
        const record = item as Partial<TermCard>;
        const draft = normalizeTermDraft(record, record.category ?? "未分類");
        return makeTermCard(draft, TERM_SUBJECTS.some((entry) => entry.id === record.subjectId) ? record.subjectId! : activeSubjectId, record.id ? { ...makeTermCard(draft, activeSubjectId), ...record, visualCluesJa: draft.visualCluesJa } as TermCard : undefined);
      });
      const ids = new Set(imported.map((item) => item.id)); persist([...imported, ...cards.filter((item) => !ids.has(item.id))]);
    } catch (error) { window.alert(error instanceof Error ? error.message : "インポートに失敗しました。"); }
    finally { if (importRef.current) importRef.current.value = ""; }
  };

  const sidebarSlot = (
    <div className="space-y-5">
      <div><p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">用語カードツール</p><button type="button" onClick={() => setSettingsOpen(true)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-100"><Icon name="settings" className="h-4 w-4" /><span className="min-w-0 flex-1 truncate">API設定</span><span className={`h-2 w-2 rounded-full ${apiSettings.apiKey ? "bg-emerald-500" : "bg-stone-300"}`} /></button><button type="button" onClick={exportCards} disabled={!cards.length} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-100 disabled:opacity-40"><Icon name="download" className="h-4 w-4" />カードを書き出す</button><button type="button" onClick={() => importRef.current?.click()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-100"><Icon name="upload" className="h-4 w-4" />バックアップを読み込む</button><input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCards(file); }} /></div>
      <div className="rounded-2xl bg-white p-4 text-xs leading-5 text-stone-500 shadow-sm"><p className="font-semibold text-stone-800">データはこの端末だけに保存</p><p className="mt-1">カードは現在のブラウザに保存されます。端末を変える前にJSONバックアップを書き出してください。</p></div>
    </div>
  );

  return (
    <SidebarLayout slot={sidebarSlot} language="ja">
      <div className="min-h-full overflow-x-hidden bg-[#f6f4ef] text-stone-900">
        <header className="border-b border-stone-200/80 bg-[#fbfaf7]/95 px-5 py-5 backdrop-blur sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-teal-700" /><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">専門用語 · 私の用語集</p></div><h1 className="mt-1.5 text-2xl font-bold tracking-tight text-stone-950">用語カード</h1></div><div className="flex items-center gap-2"><button type="button" onClick={() => setSettingsOpen(true)} className="rounded-xl border border-stone-200 bg-white p-3 text-stone-500 transition hover:border-stone-300 hover:text-stone-900" aria-label="API設定"><Icon name="settings" className="h-4 w-4" /></button><button type="button" onClick={() => { setEditing(null); setComposerOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-800"><Icon name="add" className="h-4 w-4" />今日の用語を追加</button></div></div>
        </header>
        <div className="mx-auto flex max-w-[1500px] flex-col lg:flex-row">
          <aside className="border-b border-stone-200 bg-[#fbfaf7] p-4 lg:min-h-[calc(100vh-93px)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-6">
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">学科別ボックス</p>
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">{TERM_SUBJECTS.map((item) => { const count = cards.filter((card) => card.subjectId === item.id).length; const active = item.id === activeSubjectId; return <button type="button" key={item.id} onClick={() => { setActiveSubjectId(item.id); setActiveCategory("all"); }} className={`flex min-w-0 items-center gap-2 rounded-2xl border px-2.5 py-3 text-left transition sm:gap-3 sm:px-3 ${active ? "border-stone-200 bg-white shadow-sm" : "border-transparent hover:bg-stone-100"}`}><SubjectMark subject={item} small /><span lang="ja" className={`min-w-0 flex-1 truncate text-sm font-semibold ${active ? "text-stone-950" : "text-stone-600"}`}>{item.labelJa}</span><span className="shrink-0 text-xs tabular-nums text-stone-400">{count}</span></button>; })}</div>
            <div className="mt-7 hidden rounded-2xl border border-dashed border-stone-300 p-4 lg:block"><p className="text-xs font-semibold text-stone-700">集め方の原則</p><p className="mt-2 text-[11px] leading-5 text-stone-400">用語集を先に暗記するのではなく、分からない言葉に出会ったとき、自分の知識体系へ加えていきます。</p></div>
          </aside>
          <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            <div className="mx-auto max-w-6xl">
              <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div><div className="flex items-center gap-3"><SubjectMark subject={subject} /><h2 lang="ja" className="text-3xl font-bold tracking-tight text-stone-950">{subject.labelJa}</h2></div><p lang="ja" className="mt-4 max-w-2xl text-sm leading-6 text-stone-500">分からない言葉に出会ったときに追加します。一枚のカードで名称、図像の識別、概念の違い、答案に使える日本語を結びます。</p></div>
                <div className="flex items-center gap-5 text-sm"><div><span className="text-2xl font-bold tabular-nums text-stone-900">{subjectCards.length}</span><span className="ml-1.5 text-xs text-stone-400">枚</span></div><div className="h-8 w-px bg-stone-200" /><div><span className="text-2xl font-bold tabular-nums text-emerald-700">{subjectCards.filter((card) => card.status === "remembered").length}</span><span className="ml-1.5 text-xs text-stone-400">記憶済み</span></div></div>
              </section>
              <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center"><div className="relative flex-1"><Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl bg-stone-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-stone-200 placeholder:text-stone-300 focus:ring-2" placeholder="日本語、英語、定義、メモを検索…" /></div><div className="flex gap-1 rounded-xl bg-stone-100 p-1">{([['all','すべて'],['learning','学習中'],['remembered','記憶済み']] as const).map(([value, label]) => <button type="button" key={value} onClick={() => setStatusFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-medium transition ${statusFilter === value ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"}`}>{label}</button>)}</div></div>
                <div className="mt-3 flex gap-2 overflow-x-auto border-t border-stone-100 pt-3">{["all", ...categories].map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${activeCategory === category ? "text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`} style={activeCategory === category ? { backgroundColor: subject.color } : undefined}>{category === "all" ? "すべて" : category}</button>)}</div>
              </section>
              {!ready ? <div className="py-24 text-center text-sm text-stone-400">用語カードを読み込み中…</div> : visibleCards.length > 0 ? <section className="mt-6 grid items-start gap-5 xl:grid-cols-2">{visibleCards.map((card) => <TermCardView key={card.id} card={card} subject={subject} onEdit={() => openEdit(card)} onDelete={() => removeCard(card)} onToggle={() => toggleCard(card)} />)}</section> : subjectCards.length === 0 ? <section className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white"><div className="grid lg:grid-cols-[1.1fr_.9fr]"><div className="p-8 sm:p-12"><span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold" style={{ color: subject.color, backgroundColor: subject.softColor }}><Icon name="spark" className="h-3.5 w-3.5" />空のボックス · 一語から始める</span><h3 lang="ja" className="mt-6 max-w-md text-3xl font-bold leading-tight text-stone-950">用語集を先に用意する必要はありません。<br />今日出会った一語から始めましょう。</h3><p lang="ja" className="mt-4 max-w-lg text-sm leading-7 text-stone-500">用語と出会った文脈を入力すると、プリセットPromptが日本語中心の知識カードを生成します。内容を確認してから、この科目ボックスへ保存します。</p><button type="button" onClick={() => { setEditing(null); setComposerOpen(true); }} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800">最初のカードを作る<Icon name="arrow" className="h-4 w-4" /></button></div><div className="relative min-h-72 overflow-hidden bg-stone-950 p-8 text-white sm:p-10"><div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: subject.color }} /><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">カードで結ぶもの</p><div className="mt-8 space-y-4">{[["01","名称と読み"],["02","図像・問題文の識別"],["03","混同語との差"],["04","答案に使える一文"]].map(([number, text]) => <div key={number} className="flex items-center gap-4 border-b border-white/10 pb-4"><span className="font-mono text-xs text-stone-500">{number}</span><span lang="ja" className="text-sm font-medium">{text}</span></div>)}</div><p className="mt-8 text-xs leading-5 text-stone-500">名前 → イメージ → 役割 → アウトプット</p></div></div></section> : <div className="py-24 text-center"><p className="text-sm font-semibold text-stone-600">条件に合うカードがありません</p><button type="button" onClick={() => { setQuery(""); setActiveCategory("all"); setStatusFilter("all"); }} className="mt-3 text-xs font-medium text-teal-700">絞り込みを解除</button></div>}
            </div>
          </main>
        </div>
      </div>
      {composerOpen && <Composer key={`${editing?.id ?? "new"}-${activeSubjectId}`} subject={subject} apiSettings={apiSettings} editing={editing} onSettings={() => setSettingsOpen(true)} onClose={() => { setComposerOpen(false); setEditing(null); }} onSave={saveCard} />}
      {settingsOpen && <SettingsDialog value={apiSettings} onSave={saveSettings} onClose={() => setSettingsOpen(false)} />}
    </SidebarLayout>
  );
}
