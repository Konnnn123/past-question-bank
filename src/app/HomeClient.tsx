"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import QuestionCard from "@/components/QuestionCard";
import type { Question, FilterState } from "@/types/question";

interface HomeClientProps {
  questions: Question[];
  years: number[];
  subjects: string[];
  categories: string[];
  tagFrequency: Record<string, Record<string, number>>;
}

export default function HomeClient({
  questions,
  years,
  subjects,
  categories,
  tagFrequency,
}: HomeClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    years: [],
    subjects: [],
    categories: [],
    tags: [],
  });

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (filters.years.length > 0 && !filters.years.includes(q.year))
        return false;
      if (filters.subjects.length > 0 && !filters.subjects.includes(q.subject))
        return false;
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(q.category)
      )
        return false;
      if (
        filters.tags.length > 0 &&
        !filters.tags.some((t) => q.tags.includes(t))
      )
        return false;
      return true;
    });
  }, [questions, filters]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        years={years}
        subjects={subjects}
        categories={categories}
        tagFrequency={tagFrequency}
        filters={filters}
        onFilterChange={setFilters}
        totalCount={questions.length}
        filteredCount={filteredQuestions.length}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              问题列表
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              共 {filteredQuestions.length} 题
              {filters.years.length > 0 ||
              filters.subjects.length > 0 ||
              filters.categories.length > 0 ||
              filters.tags.length > 0
                ? " (已筛选)"
                : ""}
            </p>
          </div>

          {/* Question Grid */}
          {filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions.map((q, i) => {
                const originalIndex = questions.indexOf(q);
                return (
                  <QuestionCard
                    key={`${q.year}-${q.category}-${q.subject}-${q.question_number}-${i}`}
                    question={q}
                    index={originalIndex}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">没有匹配的题目</p>
              <button
                onClick={() =>
                  setFilters({ years: [], subjects: [], categories: [], tags: [] })
                }
                className="mt-3 text-sm text-blue-600 hover:text-blue-800"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
