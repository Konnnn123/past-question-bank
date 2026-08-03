"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = { label: string; href: string; icon: string; external?: boolean };

const ITEMS: NavigationItem[] = [
  { label: "首页", href: "/", icon: "⌂" },
  { label: "一个月计划", href: "/self-assessment", icon: "◎" },
  { label: "探索", href: "/explore", icon: "🧭" },
  { label: "试题库", href: "/exam/past", icon: "📚" },
  { label: "练习 / 練習", href: "/practice", icon: "✍️" },
  { label: "复习 / 復習", href: "/review", icon: "↺" },
  { label: "日语表达", href: "/expression-library", icon: "文" },
  { label: "Notion 原始知识库", href: "https://app.notion.com/p/db656659f52547f4b703e14e976a9c16", icon: "N", external: true },
];

export default function GlobalNav() {
  const pathname = usePathname();
  const isActive = (item: NavigationItem) => {
    if (item.external) return false;
    if (item.href === "/") return pathname === "/";
    if (item.href === "/exam/past") return pathname.startsWith("/exam") || pathname.startsWith("/question");
    if (item.href === "/practice") return pathname.startsWith("/practice");
    if (item.href === "/review") return pathname.startsWith("/review");
    if (item.href === "/explore") return pathname.startsWith("/explore") || pathname.startsWith("/structural-learning");
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <nav className="w-full space-y-1">
      {ITEMS.map((item) => {
        const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive(item) ? "bg-slate-950 font-medium text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`;
        const content = <><span className="flex h-6 w-6 shrink-0 items-center justify-center text-sm">{item.icon}</span><span className="min-w-0 truncate">{item.label}</span>{item.external && <span className="ml-auto text-xs text-slate-400">↗</span>}</>;
        return item.external
          ? <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={className}>{content}</a>
          : <Link key={item.href} href={item.href} className={className}>{content}</Link>;
      })}
    </nav>
  );
}
