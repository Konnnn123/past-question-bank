"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { SidebarLayout } from "@/components/layout";
import type { Question } from "@/types/question";
import { PracticeControls, PracticeFilterToggle, needsPractice, useStudyRecords } from "@/components/practice/PracticeControls";
import { TrueFalseOriginalAnswer, type OriginalQuestionLink } from "@/components/practice/TrueFalseOriginalAnswer";
import { isReliableOriginalAnswerAllowed } from "@/lib/reliable-original-answer-allowlist";
import {
  ENVIRONMENT_REVIEW_RECORDS,
  ENVIRONMENT_TOPICS,
  type EnvironmentAnswerItem,
} from "@/lib/environment-review";

type Props = { questions: Question[] };
type Topic = (typeof ENVIRONMENT_TOPICS)[number] | "all";
type ViewMode = "year" | "topic";

type QuestionSegment = { key: string; text: string };

function questionSegments(content: string): QuestionSegment[] {
  const parenthesizedMatches = [
    ...content.matchAll(/^\s*[（(](\d{1,2})[）)]/gm),
  ];
  const bareNumericMatches = [...content.matchAll(/^\s*\d{1,2}[)）]/gm)];
  const letterMatches = [...content.matchAll(/^\s*[（(]([a-p])[）)]/gim)];
  const matches =
    letterMatches.length > 1
      ? letterMatches
      : bareNumericMatches.length > 1
        ? bareNumericMatches
        : parenthesizedMatches;
  if (matches.length < 2) return [{ key: "whole", text: content.trim() }];
  return matches.map((match, index) => ({
    key: `s${String(index + 1).padStart(2, "0")}`,
    text: content
      .slice(match.index, matches[index + 1]?.index ?? content.length)
      .trim(),
  }));
}

function segmentTopics(text: string): (typeof ENVIRONMENT_TOPICS)[number][] {
  const topics = new Set<(typeof ENVIRONMENT_TOPICS)[number]>();
  if (/(熱|断熱|放射|熱伝導|結露|防湿|U値|熱貫流)/.test(text))
    topics.add("伝熱・放射");
  if (/(換気|CO₂|CO2|空気|濃度|開口|風量|煙突|気流)/.test(text))
    topics.add("換気・空気質");
  if (/(照度|光|採光|輝度|昼光|色|マンセル|視感度)/.test(text))
    topics.add("採光・照明・色彩");
  if (/(音|騒音|残響|dB|遮音|周波数|オクターブ)/.test(text)) topics.add("音響");
  if (/(温熱|湿度|湿気|露点|PMV|met|clo|エンタルピー)/.test(text))
    topics.add("温熱・湿気");
  if (/(日照|日射|日影|太陽|遮蔽|SC値)/.test(text)) topics.add("日照・日射");
  if (/(設備|空調|給排水|冷凍|COP|APF|省エネ|換気方式|ダクト|配管)/.test(text))
    topics.add("設備・省エネ");
  return [...topics];
}

function explicitTrueFalseAnswer(answers: EnvironmentAnswerItem[]) {
  if (answers.length !== 1) return null;
  return /^[○×]/.test(answers[0].answer.trim()) ? answers[0] : null;
}

function AnswerCard({
  item,
  index,
}: {
  item: EnvironmentAnswerItem;
  index: number;
}) {
  return (
    <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-slate-900 px-1.5 text-xs font-bold text-white">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-slate-800">
          {item.label}
        </span>
        <div className="flex flex-wrap gap-1">
          {item.topics.map((value) => (
            <span
              key={value}
              className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
      <details className="group mt-3 rounded-lg border border-emerald-100 bg-emerald-50/40">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-emerald-800">
          <span>展开答案与解题要点</span>
          <span className="text-emerald-500 transition group-open:rotate-90">
            ›
          </span>
        </summary>
        <div className="border-t border-emerald-100 px-3 py-3 text-sm leading-6 text-slate-700">
          {item.answer}
        </div>
      </details>
    </article>
  );
}

function FullExamAnswer({ items }: { items: EnvironmentAnswerItem[] }) {
  return (
    <details className="group rounded-xl border border-emerald-100 bg-emerald-50/40">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-emerald-800">
        <span>展开本年度完整答案</span>
        <span className="text-emerald-500 transition group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className="border-t border-emerald-100 px-5 py-4">
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className="text-sm leading-6 text-slate-700"
            >
              <span className="mr-2 font-semibold text-slate-900">
                {item.label}
              </span>
              {item.answer}
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}

function QuestionText({ children }: { children: string }) {
  return (
    <div className="prose prose-sm max-w-none break-words [overflow-wrap:anywhere] text-slate-700 [&_p]:my-2 [&_p]:whitespace-pre-wrap [&_.katex-display]:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default function EnvironmentKnowledgeMapClient({ questions }: Props) {
  const [mode, setMode] = useState<ViewMode>("year");
  const [year, setYear] = useState<number | "all">(2026);
  const [topic, setTopic] = useState<Topic>("all");
  const [onlyNeedsPractice, setOnlyNeedsPractice] = useState(false);
  const studyRecords = useStudyRecords();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "topic") setMode("topic");
    const requestedYear = Number(params.get("year"));
    if (Number.isInteger(requestedYear) && requestedYear >= 2000) setYear(requestedYear);
  }, []);
  const questionsByFile = useMemo(
    () =>
      new Map(
        questions.map((question, index) => [
          question.fileName,
          { question, index },
        ]),
      ),
    [questions],
  );
  const years = useMemo(
    () =>
      [
        ...new Set(
          ENVIRONMENT_REVIEW_RECORDS.map(
            (record) => questionsByFile.get(record.fileName)?.question.year,
          ).filter((value): value is number => Boolean(value)),
        ),
      ].sort((a, b) => b - a),
    [questionsByFile],
  );
  const records = useMemo(
    () =>
      ENVIRONMENT_REVIEW_RECORDS.flatMap((record) => {
        const current = questionsByFile.get(record.fileName);
        return current ? [{ record, ...current }] : [];
      }).filter(({ question }) =>
        (year === "all" || question.year === year) &&
        (!onlyNeedsPractice || mode === "topic" || needsPractice(question.id, studyRecords))
      ),
    [questionsByFile, year, onlyNeedsPractice, mode, studyRecords],
  );
  const topicItems = useMemo(
    () =>
      records.flatMap(({ record, question, index }) =>
        questionSegments(question.content).flatMap((segment) => {
          const detected = segmentTopics(segment.text);
          if (topic !== "all" && !detected.includes(topic)) return [];
          const answers = (record.subAnswers ?? []).filter((answer) =>
            answer.segmentKeys?.includes(segment.key),
          );
          const slotId = `environment:${question.id}:${segment.key}`;
          if (onlyNeedsPractice) {
            const status = studyRecords[slotId]?.status;
            // "未掌握" is a review queue, not a list of unanswered questions.
            if (!status || status === "correct") return [];
          }
          return [{ record, question, index, segment, detected, answers }];
        }),
      ),
    [records, topic, onlyNeedsPractice, studyRecords],
  );

  const yearFilters = (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => setYear("all")}
        className={`rounded px-2 py-1 text-xs ${year === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
      >
        全部
      </button>
      {years.map((value) => (
        <button
          key={value}
          onClick={() => setYear(value)}
          className={`rounded px-2 py-1 text-xs ${year === value ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
  const topicFilters = (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => setTopic("all")}
        className={`rounded px-2 py-1 text-xs ${topic === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
      >
        全部
      </button>
      {ENVIRONMENT_TOPICS.map((value) => (
        <button
          key={value}
          onClick={() => setTopic(value)}
          className={`rounded px-2 py-1 text-xs ${topic === value ? "bg-violet-700 text-white" : "bg-violet-50 text-violet-700 hover:bg-violet-100"}`}
        >
          {value}
        </button>
      ))}
    </div>
  );
  const modeTabs = (
    <div className="flex rounded-lg bg-slate-100 p-1">
      <button
        onClick={() => setMode("year")}
        className={`rounded-md px-3 py-2 text-sm font-medium ${mode === "year" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600"}`}
      >
        按年份：完整题目
      </button>
      <button
        onClick={() => setMode("topic")}
        className={`rounded-md px-3 py-2 text-sm font-medium ${mode === "topic" ? "bg-white text-violet-800 shadow-sm" : "text-slate-600"}`}
      >
        按板块：逐小题
      </button>
    </div>
  );
  const sidebar = (
    <div className="space-y-5 pt-1">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500">
          建筑环境工学 · 训练
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          题目始终显示；只有答案可展开。
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">练习方式</p>
        {modeTabs}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold text-slate-500">年份</p>
        {yearFilters}
      </div>
      {mode === "topic" && (
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">板块</p>
          {topicFilters}
        </div>
      )}
      <Link
        href="/environment-knowledge"
        className="block text-xs font-medium text-violet-700 hover:text-violet-900"
      >
        重点知识与公式 →
      </Link>
    </div>
  );

  return (
    <SidebarLayout slot={sidebar}>
      <div className="min-h-full min-w-0 overflow-x-hidden bg-slate-50">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
          <Link
            href="/practice"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← 返回练习
          </Link>
        </header>
        <main className="mx-auto min-w-0 max-w-5xl space-y-8 px-5 py-8 sm:px-8">
          <section>
            <p className="text-sm font-semibold text-emerald-700">
              建筑环境工学 · 过去问训练
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              完整套题与逐小题训练
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              “按年份”保留一整年原题；“按板块”从同一批原题中拆出编号小题。无论哪种方式，题目都不折叠，答案才按需展开。
            </p>
            <div className="mt-4 max-w-md">{modeTabs}</div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              选择年份
            </p>
            {yearFilters}
            <div className="mt-3"><PracticeFilterToggle active={onlyNeedsPractice} onChange={setOnlyNeedsPractice} count={mode === "year" ? records.length : topicItems.length} /></div>
            {mode === "topic" && (
              <>
                <p className="mb-2 mt-3 text-xs font-semibold text-slate-500">
                  选择板块
                </p>
                {topicFilters}
              </>
            )}
          </section>
          {mode === "year" ? (
            <section className="space-y-5">
              {records.map(({ record, question }) => (
                <article
                  key={record.fileName}
                  className="rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-emerald-700">
                          {question.year} · {question.category} ·{" "}
                          {question.question_number}
                        </p>
                        <h2 className="mt-1 text-lg font-bold text-slate-900">
                          {record.focus}
                        </h2>
                      </div>
                      <Link
                        href={`/question/${question.id}`}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                      >
                        查看原题页 →
                      </Link>
                    </div>
                  </div>
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      完整题目（请先自行作答）
                    </p>
                    <QuestionText>{question.content}</QuestionText>
                  </div>
                  <div className="p-5">
                    <FullExamAnswer
                      items={record.subAnswers ?? record.answers}
                    />
                    <PracticeControls questionId={question.id} />
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="space-y-4">
              {topicItems.map(
                ({ record, question, segment, detected, answers }) => {
                  const automaticAnswer = isReliableOriginalAnswerAllowed(
                    "environment",
                    record.fileName,
                    segment.key,
                  ) ? explicitTrueFalseAnswer(answers) : null;
                  const sourceHref = `/environment-knowledge-map?mode=topic&year=${question.year}#environment-${question.id}-${segment.key}`;
                  const compatibleTrueFalse = topicItems.filter((candidate) =>
                    (candidate.question.id !== question.id || candidate.segment.key !== segment.key) &&
                    Boolean(explicitTrueFalseAnswer(candidate.answers)),
                  );
                  const relatedCandidates = compatibleTrueFalse.filter((candidate) =>
                    candidate.detected.some((value) => detected.includes(value)),
                  );
                  const related: OriginalQuestionLink[] = automaticAnswer
                    ? (relatedCandidates.length ? relatedCandidates : compatibleTrueFalse)
                        .slice(0, 3)
                        .map((candidate) => ({
                          href: `/environment-knowledge-map?mode=topic&year=${candidate.question.year}#environment-${candidate.question.id}-${candidate.segment.key}`,
                          label: `${candidate.question.year} · ${candidate.question.question_number} · ${candidate.segment.key.replace("s", "")}`,
                        }))
                    : [];
                  return <article
                    key={`${question.fileName}-${segment.key}`}
                    id={`environment-${question.id}-${segment.key}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-violet-700">
                          {question.year} · {question.question_number} · 小题{" "}
                          {segment.key.replace("s", "")}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {detected.map((value) => (
                            <span
                              key={value}
                              className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href={`/question/${question.id}`}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-900"
                      >
                        查看整套题 →
                      </Link>
                    </div>
                    <div className="border-y border-slate-100 bg-slate-50/70 px-4 py-4">
                      <QuestionText>{segment.text}</QuestionText>
                    </div>
                    <div className="mt-4 space-y-3">
                      {!automaticAnswer && (
                        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                          自评题 · 当前小问未列入可靠自动判分清单。
                        </p>
                      )}
                      {automaticAnswer ? (
                        <TrueFalseOriginalAnswer
                          questionId={`environment:${question.id}:${segment.key}`}
                          questionBlockId={question.id}
                          subquestionId={segment.key}
                          subject="环境工学"
                          subjectCode="environment"
                          year={question.year}
                          questionNumber={question.question_number}
                          correctAnswerText={automaticAnswer.answer}
                          topicTags={detected}
                          sourceHref={sourceHref}
                          answerBasis={`src/lib/environment-review.ts · ${record.fileName} · ${segment.key}`}
                          related={related}
                        />
                      ) : answers.length ? (
                        answers.map((item, answerIndex) => (
                          <AnswerCard
                            key={`${question.fileName}-${segment.key}-${item.label}`}
                            item={item}
                            index={answerIndex}
                          />
                        ))
                      ) : (
                        <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-500">
                          此小题尚未建立独立答案要点；请先作答，再从完整套题的答案核对。
                        </p>
                      )}
                    </div>
                    {!automaticAnswer && <PracticeControls
                      questionId={`environment:${question.id}:${segment.key}`}
                      source={{
                        sourceQuestionId: question.id,
                        sourceHref,
                        sourceLabel: `${question.year} · 専門1 · ${question.question_number} · ${segment.key.replace("s", "")}`,
                        subject: "环境工学",
                        year: question.year,
                        topicTags: detected,
                        cognitiveTask: "依据原题给出的环境条件、公式、现象或判断条件作答。",
                        answerBasis: `src/lib/environment-review.ts · ${record.fileName} · ${segment.key}`,
                      }}
                    />}
                  </article>;
                },
              )}
              {topicItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  此筛选条件下没有可识别的小题。
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </SidebarLayout>
  );
}
