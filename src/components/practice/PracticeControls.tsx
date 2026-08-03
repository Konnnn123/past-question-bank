"use client";

import { useEffect, useRef, useState } from "react";
import { readStudyRecords, saveStudyStatus, STUDY_RECORDS_EVENT, type StudyRecordMap, type StudyStatus } from "@/lib/study-records";

type Props = {
  questionId: string;
  compact?: boolean;
  source?: Parameters<typeof saveStudyStatus>[2];
};
const choices: Array<{ status: Exclude<StudyStatus, "unseen">; label: string; active: string }> = [
  { status: "correct", label: "掌握", active: "border-emerald-300 bg-emerald-100 text-emerald-800" },
  { status: "wrong", label: "未掌握", active: "border-rose-300 bg-rose-100 text-rose-800" },
  { status: "uncertain", label: "不确定", active: "border-amber-300 bg-amber-100 text-amber-800" },
  { status: "later", label: "稍后再做", active: "border-violet-300 bg-violet-100 text-violet-800" },
];

export function PracticeControls({ questionId, compact = false, source }: Props) {
  const [status, setStatus] = useState<StudyStatus>("unseen");
  const rootRef = useRef<HTMLDivElement>(null);
  const [isLast, setIsLast] = useState(false);
  const [position, setPosition] = useState<{ current: number; total: number }>();
  useEffect(() => {
    const sync = () => setStatus(readStudyRecords()[questionId]?.status ?? "unseen");
    sync();
    window.addEventListener(STUDY_RECORDS_EVENT, sync);
    return () => window.removeEventListener(STUDY_RECORDS_EVENT, sync);
  }, [questionId]);
  useEffect(() => {
    const controls = [...document.querySelectorAll<HTMLElement>("[data-practice-control]")];
    const current = rootRef.current;
    const index = current ? controls.indexOf(current) : -1;
    if (index >= 0) setPosition({ current: index + 1, total: controls.length });
  }, []);
  const goNext = () => {
    const controls = [...document.querySelectorAll<HTMLElement>("[data-practice-control]")];
    const current = rootRef.current;
    const next = current ? controls[controls.indexOf(current) + 1] : undefined;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "center" });
    else setIsLast(true);
  };
  const goPrevious = () => {
    const controls = [...document.querySelectorAll<HTMLElement>("[data-practice-control]")];
    const current = rootRef.current;
    const previous = current ? controls[controls.indexOf(current) - 1] : undefined;
    if (previous) previous.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const goRandom = () => {
    const controls = [...document.querySelectorAll<HTMLElement>("[data-practice-control]")];
    const candidates = controls.filter((control) => control !== rootRef.current);
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return <div ref={rootRef} data-practice-control={questionId} className={compact ? "mt-3" : "mt-4 border-t border-slate-100 pt-4"}>
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-slate-500">{position ? `${position.current} / ${position.total} · ` : ""}作答后标记：</span>
      {choices.map((choice) => <button key={choice.status} type="button" aria-pressed={status === choice.status}
        onClick={() => { saveStudyStatus(questionId, choice.status, source); setStatus(choice.status); }}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${status === choice.status ? choice.active : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
        {choice.label}
      </button>)}
      <button type="button" onClick={goPrevious} disabled={position?.current === 1} className="ml-auto rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">上一题 ↑</button>
      <button type="button" onClick={goNext} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
        {isLast ? "本页完成" : "下一题 ↓"}
      </button>
      <button type="button" onClick={goRandom} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-800 hover:bg-cyan-100">随机一道</button>
    </div>
  </div>;
}

export function useStudyRecords() {
  const [records, setRecords] = useState<StudyRecordMap>({});
  useEffect(() => {
    const sync = () => setRecords(readStudyRecords());
    sync();
    window.addEventListener(STUDY_RECORDS_EVENT, sync);
    return () => window.removeEventListener(STUDY_RECORDS_EVENT, sync);
  }, []);
  return records;
}

export function PracticeFilterToggle({ active, onChange, count }: { active: boolean; onChange: (active: boolean) => void; count?: number }) {
  return <button type="button" aria-pressed={active} onClick={() => onChange(!active)}
    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-rose-300 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
    {active ? "正在只看未掌握" : "只看未掌握"}{typeof count === "number" ? ` · ${count}` : ""}
  </button>;
}

export function needsPractice(questionId: string, records: StudyRecordMap) {
  return records[questionId]?.status !== "correct";
}
