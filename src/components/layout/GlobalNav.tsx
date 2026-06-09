"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/layout";

// ============================================================
// Global Navigation — 侧边栏上半部分，始终可见
// ============================================================

const NAV_ITEMS: NavItem[] = [
  { label: "過去問データベース", href: "/", icon: "📚" },
  { label: "建築環境工学 知識地図", href: "/environment-knowledge-map", icon: "🌤️" },
  { label: "構造力学 知識地図", href: "/knowledge-map", icon: "🏗️" },
];

export default function GlobalNav() {
  const pathname = usePathname();

  /** 判断当前路径是否激活 */
  const isActive = (href: string): boolean => {
    if (href === "/") {
      // 首页和题目详情页都高亮"過去問データベース"
      return pathname === "/" || pathname.startsWith("/question");
    }
    return pathname === href;
  };

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active
                ? "bg-gray-900 text-white font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
