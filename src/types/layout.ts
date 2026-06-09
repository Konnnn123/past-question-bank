import type { ReactNode } from "react";

// ============================================================
// Layout Types
// ============================================================

/** 路由 → 侧边栏内容的映射键 */
export type SidebarSlotKey =
  | "home"
  | "knowledge-map"
  | "environment-knowledge-map"
  | "question-detail"
  | "empty";

/** 单个导航项 */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

/** 侧边栏插槽的 Props（传给动态内容） */
export interface SidebarSlotProps {
  children?: ReactNode;
}

/** TOC 节点（知识地图共用） */
export interface TocNode {
  id: string;
  text: string;
  level: number;
  children?: TocNode[];
}

/** TOC 面板 Props */
export interface TocPanelProps {
  tree: TocNode[];
  activeId?: string;
  onToggleAll?: (expand: boolean) => void;
}
