export type ConstructionCardKind = "concept" | "method" | "component" | "material" | "assembly" | "value" | "other";

export interface ConstructionLibraryItem {
  id: string;
  title: string;
  explanation: string;
  images: string[];
  system: string;
  kind: ConstructionCardKind;
  kindLabel: string;
  examForms: string[];
  pastQuestion: string;
  sourceUrl: string;
  tags: string[];
}
