"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import type { ConstructionAnswerRecord } from "@/lib/construction-review";
import { PracticeControls, PracticeFilterToggle, needsPractice, useStudyRecords } from "@/components/practice/PracticeControls";
import { OriginalChoiceAnswer, type OriginalChoiceOption } from "@/components/practice/OriginalChoiceAnswer";
import type { OriginalQuestionLink } from "@/components/practice/TrueFalseOriginalAnswer";
import { isReliableOriginalAnswerAllowed } from "@/lib/reliable-original-answer-allowlist";

type Props = {
  questions: Question[];
  answerRecords: ConstructionAnswerRecord[];
  approvedChoiceSlots: ApprovedChoiceSlot[];
};
type ExamType = "all" | "専門1" | "専門2-2";

export type ApprovedChoiceSlot = {
  slot: string;
  expectedAnswer: string;
  answerType: string;
  allowedVariants: string[];
  sourceLocation: string;
};

const TOPICS = [
  [
    "材料・数値",
    "比重・密度、ヤング係数、線膨張係数、基準強度、長期／短期許容応力度",
  ],
  [
    "木造・木質材料",
    "軸組、和小屋／洋小屋、継手・仕口、合板・集成材・CLT・LVL",
  ],
  ["RC・鉄骨", "鉄筋の役割、型枠、かぶり、ボルト・溶接、H形鋼、CFT"],
  [
    "外壁・屋根・基礎",
    "カーテンウォール、通気構法、瓦、地盤調査、山留め、免震改修",
  ],
  [
    "図解・事例",
    "部材の位置と機能、施工手順、著名建築の構造・材料・空間の説明",
  ],
] as const;

function statusLabel(
  status: ConstructionAnswerRecord["items"][number]["reviewStatus"],
) {
  if (status === "image-source-unresolved") return "原图不可读，待图像核验";
  if (status === "partial-image-draft") return "文字答案已整理，图中标签待核验";
  return "卡片与知识地图支持的草案";
}

function normalizeChoice(value: string) {
  const superscripts: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
  return value.normalize("NFKC")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (character) => superscripts[character])
    .replace(/[${}\\\s]/g, "")
    .replace(/\^-/g, "-")
    .replace(/[−–]/g, "-")
    .toLowerCase();
}

function localOptions(questionText: string, slot: ApprovedChoiceSlot): OriginalChoiceOption[] | null {
  const match = questionText.match(new RegExp(`【${slot.slot}\\.\\s*([^】]+)】`));
  const texts = match?.[1].split(",").map((value) => value.trim()).filter(Boolean) ?? [];
  if (texts.length !== 4) return null;
  const options = texts.map((text, index) => ({ label: String.fromCharCode(65 + index), text }));
  const expected = [slot.expectedAnswer, ...slot.allowedVariants].map(normalizeChoice);
  return options.some((option) => expected.includes(normalizeChoice(option.text))) ? options : null;
}

function AnswerItem({
  item,
  number,
}: {
  item: ConstructionAnswerRecord["items"][number];
  number: number;
}) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-slate-900 px-1.5 text-xs font-bold text-white">
          {number}
        </span>
        <span className="text-xs font-medium text-slate-500">答案分组</span>
      </div>
      <p className="text-sm leading-6 text-slate-700">{item.prompt}</p>
      <p className="mt-2 text-xs font-medium text-amber-800">自评题 · 当前答案不可用于自动判分。</p>
      <details className="group mt-3 rounded border border-emerald-100 bg-emerald-50/30">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-emerald-800">
          <span>展开答案与图解要点</span>
          <span className="text-emerald-500 transition group-open:rotate-90">
            ›
          </span>
        </summary>
        <div className="border-t border-emerald-100 px-3 py-3">
          <strong className="whitespace-pre-line text-sm leading-6 text-slate-900">
            {item.answer}
          </strong>
          <p className="mt-2 text-[11px] text-amber-700">
            {statusLabel(item.reviewStatus)}
          </p>
          {item.drawingPoints?.length ? (
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-5 text-slate-600">
              {item.drawingPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </details>
    </article>
  );
}

function ExamRecord({
  question,
  record,
  approvedChoiceSlots,
}: {
  question: Question;
  record?: ConstructionAnswerRecord;
  approvedChoiceSlots: ApprovedChoiceSlot[];
}) {
  const approvedCards = question.fileName === "2024_専門1_建筑构法_Q3.md"
    ? approvedChoiceSlots
        // Slot m's approved index conflicts with the wording of the original question.
        // It stays self-evaluation only until a corrected primary index is available.
        .filter((slot) => isReliableOriginalAnswerAllowed(
          "building_construction",
          question.fileName,
          slot.slot,
        ))
        .flatMap((slot) => {
          const options = localOptions(question.content, slot);
          return options ? [{ slot, options }] : [];
        })
    : [];
  const sourceHref = (slot: string) => `/construction-methods-knowledge-map#construction-${question.id}-${slot}`;
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald-700">
              {question.year} · {question.category} · {question.question_number}
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {record ? "过去问与答案" : "过去问"}
            </h2>
          </div>
          <Link
            href={`/question/${question.id}`}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
          >
            查看独立原题页 →
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          先显示完整原题；答案按空栏或小问分组并默认折叠。
        </p>
      </div>
      <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-5">
        <p className="mb-3 text-xs font-bold tracking-wide text-slate-500">
          原题
        </p>
        <div className="prose prose-sm max-w-none break-words [overflow-wrap:anywhere] prose-img:max-h-[720px] prose-img:w-auto prose-img:max-w-full prose-img:rounded prose-img:border prose-img:border-slate-200 text-slate-800">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {question.content}
          </ReactMarkdown>
        </div>
      </div>
      {approvedCards.length ? (
        <div className="space-y-4 p-5">
          <p className="text-xs font-bold tracking-wide text-emerald-700">经批准的原题 slot 作答</p>
          <p className="text-xs leading-5 text-slate-500">原题全文与每个局部四选项均保留；只接入有批准 slot 答案索引且能与原题选项逐一匹配的空栏。</p>
          {approvedCards.map(({ slot, options }) => {
            const accepted = [slot.expectedAnswer, ...slot.allowedVariants].map(normalizeChoice);
            const correct = options.find((option) => accepted.includes(normalizeChoice(option.text)));
            if (!correct) return null;
            const related: OriginalQuestionLink[] = approvedCards
              .filter((candidate) => candidate.slot.slot !== slot.slot)
              .slice(0, 3)
              .map((candidate) => ({ href: sourceHref(candidate.slot.slot), label: `2024 · 3 · ${candidate.slot.slot}` }));
            return <article id={`construction-${question.id}-${slot.slot}`} key={slot.slot} className="scroll-mt-24 rounded-lg border border-emerald-100 bg-emerald-50/20 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">【{slot.slot}】</p>
              <OriginalChoiceAnswer
                questionId={`construction:${question.id}:${slot.slot}`}
                questionBlockId={question.id}
                subquestionId={slot.slot}
                subject="建筑构法"
                subjectCode="construction"
                year={question.year}
                questionNumber={question.question_number}
                options={options}
                correctOptionLabel={correct.label}
                approvedAnswer={slot.expectedAnswer}
                topicTags={question.tags}
                sourceHref={sourceHref(slot.slot)}
                answerBasis={`data/construction-2024-q3-slot-review.json · BC-002 · ${slot.sourceLocation}`}
                related={related}
              />
            </article>;
          })}
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">【m】在批准索引与原题语义之间存在冲突，因此没有接入自动判分；请仅通过原题答案材料自评。</p>
        </div>
      ) : record ? (
        <div className="space-y-4 p-5">
          <p className="text-xs font-bold tracking-wide text-slate-500">答案</p>
          {record.items.map((item, itemIndex) => (
            <AnswerItem key={item.itemId} item={item} number={itemIndex + 1} />
          ))}
        </div>
      ) : (
        <div className="p-5 text-sm text-slate-500">
          这题已纳入年度与类型索引，但还没有经过核验的答案草案。
        </div>
      )}
      {!approvedCards.length && <div className="px-5 pb-5"><PracticeControls questionId={question.id} compact /></div>}
    </section>
  );
}

export default function ConstructionMethodsKnowledgeMapClient({
  questions,
  answerRecords,
  approvedChoiceSlots,
}: Props) {
  const [year, setYear] = useState<number | "all">("all");
  const [examType, setExamType] = useState<ExamType>("all");
  const [onlyNeedsPractice, setOnlyNeedsPractice] = useState(false);
  const studyRecords = useStudyRecords();
  const constructionQuestions = useMemo(
    () => questions.filter((question) => question.subject === "建筑构法"),
    [questions],
  );
  const years = useMemo(
    () =>
      [...new Set(constructionQuestions.map((question) => question.year))].sort(
        (a, b) => b - a,
      ),
    [constructionQuestions],
  );
  const answersByFile = useMemo(
    () => new Map(answerRecords.map((record) => [record.fileName, record])),
    [answerRecords],
  );
  const fullyDraftedCount = useMemo(
    () =>
      answerRecords.filter((record) =>
        record.items.every(
          (item) => item.reviewStatus === "card-supported-draft",
        ),
      ).length,
    [answerRecords],
  );
  const imageReviewCount = answerRecords.length - fullyDraftedCount;
  const visible = constructionQuestions.filter(
    (question) =>
      (year === "all" || question.year === year) &&
      (examType === "all" || question.category === examType) &&
      (!onlyNeedsPractice || needsPractice(question.id, studyRecords)),
  );
  const choice = (active: boolean, palette: "emerald" | "violet") =>
    active
      ? "bg-slate-900 text-white"
      : palette === "emerald"
        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        : "bg-violet-50 text-violet-700 hover:bg-violet-100";
  const filters = (
    <>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setYear("all")}
          className={`rounded px-2 py-1 text-xs ${choice(year === "all", "emerald")}`}
        >
          全部
        </button>
        {years.map((value) => (
          <button
            key={value}
            onClick={() => setYear(value)}
            className={`rounded px-2 py-1 text-xs ${choice(year === value, "emerald")}`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setExamType("all")}
          className={`rounded px-2 py-1 text-xs ${choice(examType === "all", "violet")}`}
        >
          全部类型
        </button>
        {(["専門1", "専門2-2"] as const).map((value) => (
          <button
            key={value}
            onClick={() => setExamType(value)}
            className={`rounded px-2 py-1 text-xs ${choice(examType === value, "violet")}`}
          >
            {value}
          </button>
        ))}
      </div>
    </>
  );
  const sidebar = (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          建筑构法复习总览
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          先看知识板块，再按年度与试验区分练习。
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">年份与类型</p>
        {filters}
      </div>
      <div className="text-xs leading-5 text-slate-500">
        当前 {visible.length} / {constructionQuestions.length} 题<br />
        文字答案完成 {fullyDraftedCount} 题<br />
        待图像核验 {imageReviewCount} 题
      </div>
      <div className="space-y-1 text-xs">
        <a
          href="#overview"
          className="block text-slate-600 hover:text-emerald-700"
        >
          知识框架
        </a>
        <a
          href="#past-exams"
          className="block text-slate-600 hover:text-emerald-700"
        >
          历年过去问
        </a>
      </div>
    </div>
  );

  return (
    <SidebarLayout slot={sidebar}>
      <div className="min-h-full min-w-0 overflow-x-hidden bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
          <Link
            href="/construction-distinctions"
            className="float-right rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            构法辨析词典 →
          </Link>
          <Link
            href="/practice"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← 返回练习
          </Link>
        </header>
        <main className="mx-auto min-w-0 max-w-5xl space-y-8 px-5 py-8 sm:px-8">
          <section id="overview" className="scroll-mt-24">
            <p className="text-sm font-semibold text-emerald-700">
              建筑构法 · 复习大纲
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              知识地图与过去问答案
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              按“造一座房子”的顺序组织：材料与数值、木造、RC／铁骨、外墙与基础，再落到图解和案例。答案只显示已整理的草案。
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900">高频知识框架</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {TOPICS.map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <h3 className="font-semibold text-slate-800">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section id="past-exams" className="scroll-mt-24">
            <div className="mb-3">
              <h2 className="text-xl font-bold text-slate-900">历年过去问</h2>
              <p className="mt-1 text-sm text-slate-500">
                先选年度与类型，再读题干。已整理题目会分小问显示答案；其余保留为待整理。
              </p>
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-2 text-xs font-semibold text-slate-500">
                  快速切分
                </p>
                {filters}
                <div className="mt-3"><PracticeFilterToggle active={onlyNeedsPractice} onChange={setOnlyNeedsPractice} count={visible.length} /></div>
              </div>
            </div>
            <div className="space-y-5">
              {visible.map((question) => (
                <ExamRecord
                  key={question.fileName}
                  question={question}
                  record={answersByFile.get(question.fileName)}
                  approvedChoiceSlots={approvedChoiceSlots}
                />
              ))}
              {visible.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                  这个筛选组合没有构法过去问。
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </SidebarLayout>
  );
}
