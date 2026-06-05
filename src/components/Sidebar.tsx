"use client";

import { useState, useMemo } from "react";
import type { FilterState } from "@/types/question";

interface SidebarProps {
  years: number[];
  subjects: string[];
  categories: string[];
  tagFrequency: Record<string, Record<string, number>>;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function Sidebar({
  years,
  subjects,
  categories,
  tagFrequency,
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}: SidebarProps) {
  // 主折叠状态
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    year: true,
    subject: true,
    category: true,
    tag: true, // 默认展开标签区域
  });

  // 各学科的折叠状态（手风琴）
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubjectAccordion = (subject: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [subject]: !prev[subject] }));
  };

  const toggleYear = (year: number) => {
    const next = filters.years.includes(year)
      ? filters.years.filter((y) => y !== year)
      : [...filters.years, year];
    onFilterChange({ ...filters, years: next });
  };

  const toggleSubject = (subject: string) => {
    const next = filters.subjects.includes(subject)
      ? filters.subjects.filter((s) => s !== subject)
      : [...filters.subjects, subject];
    onFilterChange({ ...filters, subjects: next });
  };

  const toggleCategory = (category: string) => {
    const next = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: next });
  };

  const toggleTag = (tag: string) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFilterChange({ ...filters, tags: next });
  };

  const clearAll = () => {
    onFilterChange({ years: [], subjects: [], categories: [], tags: [] });
  };

  const hasActiveFilters =
    filters.years.length > 0 ||
    filters.subjects.length > 0 ||
    filters.categories.length > 0 ||
    filters.tags.length > 0;

  // 根据选中的科目过滤标签
  const filteredTagFrequency = useMemo(() => {
    if (filters.subjects.length === 0) {
      return tagFrequency;
    }
    const filtered: Record<string, Record<string, number>> = {};
    for (const subject of filters.subjects) {
      if (tagFrequency[subject]) {
        filtered[subject] = tagFrequency[subject];
      }
    }
    return filtered;
  }, [tagFrequency, filters.subjects]);

  return (
    <aside className="w-72 shrink-0 border-r border-gray-200 bg-gray-50/50 h-screen overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-900 tracking-tight">
          過去問数据库
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          東京大学大学院 建築学専攻
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {filteredCount} / {totalCount} 题
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/* Year Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("year")}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          年度 (Year)
          <span className="text-gray-400">{expandedSections.year ? "▼" : "▶"}</span>
        </button>
        {expandedSections.year && (
          <div className="px-3 pb-3 flex flex-wrap gap-1.5">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => toggleYear(year)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  filters.years.includes(year)
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          考试类别 (Category)
          <span className="text-gray-400">{expandedSections.category ? "▼" : "▶"}</span>
        </button>
        {expandedSections.category && (
          <div className="px-3 pb-3 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  filters.categories.includes(category)
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subject Filter */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("subject")}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          学科 (Subject)
          <span className="text-gray-400">{expandedSections.subject ? "▼" : "▶"}</span>
        </button>
        {expandedSections.subject && (
          <div className="px-3 pb-3 flex flex-wrap gap-1.5">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                  filters.subjects.includes(subject)
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tag Frequency by Subject - Accordion */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection("tag")}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          标签 (Tags)
          <span className="text-gray-400">{expandedSections.tag ? "▼" : "▶"}</span>
        </button>
        {expandedSections.tag && (
          <div className="pb-2">
            {Object.entries(filteredTagFrequency).map(([subject, tags]) => {
              const isExpanded = expandedSubjects[subject] || false;
              const tagCount = Object.keys(tags).length;
              const activeTagCount = Object.keys(tags).filter((tag) =>
                filters.tags.includes(tag)
              ).length;

              return (
                <div key={subject} className="border-t border-gray-100">
                  {/* 学科标题 - 可折叠 */}
                  <button
                    onClick={() => toggleSubjectAccordion(subject)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`transition-transform duration-200 text-gray-400 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      >
                        ▶
                      </span>
                      <span className="font-medium text-gray-700">{subject}</span>
                      {activeTagCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[10px]">
                          {activeTagCount}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400 text-[10px]">
                      {tagCount} tags
                    </span>
                  </button>

                  {/* 标签列表 - 可折叠内容 */}
                  {isExpanded && (
                    <div className="px-3 pb-2 flex flex-wrap gap-1.5 animate-in slide-in-from-top-1 duration-150">
                      {Object.entries(tags).map(([tag, count]) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-1 rounded-md text-xs transition-all ${
                            filters.tags.includes(tag)
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          {tag} ({count})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
