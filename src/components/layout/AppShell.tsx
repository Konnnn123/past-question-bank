"use client";

import { useState, type ReactNode } from "react";
import GlobalNav from "./GlobalNav";
import { useSidebarSlot } from "./SidebarSlotContext";

// ============================================================
// AppShell — 全局统一布局容器
//
// 结构:
//   ┌──────────────┬──────────────────────────────┐
//   │   Sidebar    │         MainContent           │
//   │  ┌────────┐  │                                │
//   │  │GlobalNav│  │   {children}                   │
//   │  └────────┘  │                                │
//   │  ┌────────┐  │                                │
//   │  │ Slot   │  │                                │
//   │  └────────┘  │                                │
//   └──────────────┴──────────────────────────────┘
//
// 侧边栏下半部分通过 SidebarSlotContext 注入。
// 页面用 <SidebarSlotProvider slot={...}> 包裹内容即可。
// ============================================================

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const slot = useSidebarSlot();

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* ====== 左侧边栏 ====== */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } shrink-0 border-r border-gray-200 bg-gray-50/50 h-screen overflow-hidden transition-all duration-300 hidden lg:block`}
      >
        <div className="flex flex-col h-full w-72">
          {/* ---- 上半部：全局导航（固定在顶部，不滚动） ---- */}
          <div className="shrink-0 p-4 pb-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">建築学 過去問</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xs"
                aria-label="サイドバーを閉じる"
              >
                ✕
              </button>
            </div>
            <GlobalNav />
          </div>

          {/* ---- 分隔线 ---- */}
          <hr className="border-gray-200 mx-4 my-3 shrink-0" />

          {/* ---- 下半部：动态插槽（独立滚动） ---- */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
            {slot}
          </div>
        </div>
      </aside>

      {/* ====== 侧边栏折叠时的展开按钮 ====== */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 border border-gray-200 border-l-0 rounded-r-lg px-2 py-4 text-xs text-gray-500 transition-colors z-30 hidden lg:block"
          aria-label="サイドバーを開く"
        >
          ☰
        </button>
      )}

      {/* ====== 主内容区 ====== */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
