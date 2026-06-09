"use client";

import { useState } from "react";
import type { FilterState } from "@/types/question";

// ============================================================
// Filter Slot — 首页的题目筛选器（嵌入侧边栏下半部分）
// ============================================================

interface FilterSlotProps {
  years: number[];
  subjects: string[];
  categories: string[];
  tagFrequency: Record<string, Record<string, number>>;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

/** 可折叠区块 */
function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-3 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-xs font-semibold text-gray-700">{title}</span>
        <span className="text-[10px] text-gray-400 transition-transform">
          {open ? "▼" : "▶"}
        </span>
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

/** 药丸按钮 */
function Pill({
  label,
  active,
  onClick,
  color = "gray",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: "gray" | "indigo" | "blue";
}) {
  const colorMap = {
    gray: active
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
    indigo: active
      ? "bg-indigo-600 text-white"
      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    blue: active
      ? "bg-blue-600 text-white"
      : "bg-blue-50 text-blue-700 hover:bg-blue-100",
  };
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${colorMap[color]}`}
    >
      {label}
    </button>
  );
}

export default function FilterSlot({
  years,
  subjects,
  categories,
  tagFrequency,
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}: FilterSlotProps) {
  const toggle = (key: keyof FilterState, value: string | number) => {
    const arr = filters[key] as (string | number)[];
    const next = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
    onFilterChange({ ...filters, [key]: next });
  };

  const clearAll = () =>
    onFilterChange({ years: [], subjects: [], categories: [], tags: [] });

  const hasActiveFilters =
    filters.years.length > 0 ||
    filters.subjects.length > 0 ||
    filters.categories.length > 0 ||
    filters.tags.length > 0;

  // 按科目分组的标签（保持分组结构）
  const activeSubjects =
    filters.subjects.length > 0 ? filters.subjects : Object.keys(tagFrequency);
  const tagsBySubject = Object.entries(tagFrequency)
    .filter(([sub]) => activeSubjects.includes(sub))
    .map(([sub, tags]) => ({
      subject: sub,
      tags: Object.entries(tags)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count),
    }));

  return (
    <div className="space-y-0">
      {/* 计数器 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">
          <span className="font-semibold text-gray-900">{filteredCount}</span>
          {" / "}
          {totalCount} 問
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] text-red-500 hover:text-red-700 transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      {/* 年度 */}
      <CollapsibleSection title="年度">
        <div className="flex flex-wrap gap-1.5">
          {years.map((y) => (
            <Pill
              key={y}
              label={String(y)}
              active={filters.years.includes(y)}
              onClick={() => toggle("years", y)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* 試験区分 */}
      <CollapsibleSection title="試験区分">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <Pill
              key={c}
              label={c}
              active={filters.categories.includes(c)}
              onClick={() => toggle("categories", c)}
              color="indigo"
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* 科目 */}
      <CollapsibleSection title="科目">
        <div className="flex flex-wrap gap-1.5">
          {subjects.map((s) => (
            <Pill
              key={s}
              label={s}
              active={filters.subjects.includes(s)}
              onClick={() => toggle("subjects", s)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* タグ — 按科目分组 */}
      {tagsBySubject.map(({ subject, tags }) => (
        <CollapsibleSection
          key={subject}
          title={subject}
          defaultOpen={false}
        >
          <div className="flex flex-wrap gap-1.5">
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => toggle("tags", tag)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                  filters.tags.includes(tag)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {tag}
                <span className="ml-0.5 opacity-60">({count})</span>
              </button>
            ))}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  );
}
