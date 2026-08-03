import type { ExploreLanguage } from "@/components/ExploreLanguageProvider";

export type PlanningCopy = Record<ExploreLanguage, string>;
export type PlanningPracticeMode = "image" | "match" | "numeric" | "daily";

export interface PlanningLibraryItem {
  id: string;
  prompt: string;
  answer: string;
  images: string[];
  category: PlanningCopy;
  categoryKey: string;
  importance: string;
  numeric: boolean;
  tags: string[];
}
