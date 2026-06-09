"use client";

import { createContext, useContext, type ReactNode } from "react";

// ============================================================
// SidebarSlotContext — 允许页面向全局 AppShell 注入侧边栏内容
//
// 使用方式（在页面组件中）:
//   <SidebarSlotProvider slot={<FilterSlot ... />}>
//     <div>页面内容</div>
//   </SidebarSlotProvider>
// ============================================================

const SidebarSlotContext = createContext<ReactNode>(null);

export function SidebarSlotProvider({
  slot,
  children,
}: {
  slot: ReactNode;
  children: ReactNode;
}) {
  return (
    <SidebarSlotContext.Provider value={slot}>
      {children}
    </SidebarSlotContext.Provider>
  );
}

export function useSidebarSlot(): ReactNode {
  return useContext(SidebarSlotContext);
}
