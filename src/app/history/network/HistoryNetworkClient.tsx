"use client";

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/layout";
import OriginalLanguage from "@/components/OriginalLanguage";

export type NetworkKind = "building" | "style" | "movement" | "architect" | "building-type" | "theory" | "institution";
export type NetworkNode = {
  id: string; kind: NetworkKind; labelJa: string; labelZh: string; summaryJa: string; summaryZh: string;
  regions: string[]; period: string; periodZh: string; examCount: number; priority?: "S" | "A" | "B" | "normal"; href: string;
};
export type NetworkEdge = {
  id: string; source: string; target: string; relation: "belongs" | "related" | "evolves" | "influences";
  labelJa: string; labelZh: string;
  detailJa?: string; detailZh?: string;
};

type PositionedNode = NetworkNode & { x: number; y: number };
const WIDTH = 1800;
const HEIGHT = 1080;
const KIND_META: Record<NetworkKind, { ja: string; zh: string; color: string; soft: string }> = {
  building: { ja: "建築", zh: "建筑", color: "#0f766e", soft: "#ccfbf1" },
  style: { ja: "様式", zh: "样式", color: "#4f46e5", soft: "#e0e7ff" },
  movement: { ja: "運動", zh: "运动", color: "#db2777", soft: "#fce7f3" },
  architect: { ja: "建築家", zh: "建筑家", color: "#d97706", soft: "#fef3c7" },
  "building-type": { ja: "類型", zh: "类型", color: "#0284c7", soft: "#e0f2fe" },
  theory: { ja: "思想・理論", zh: "思想／理论", color: "#7c3aed", soft: "#ede9fe" },
  institution: { ja: "保存・制度", zh: "保护／制度", color: "#059669", soft: "#d1fae5" },
};
const RELATION_STYLE: Record<NetworkEdge["relation"], { stroke: string; dash?: string }> = {
  belongs: { stroke: "#94a3b8" },
  related: { stroke: "#a78bfa", dash: "4 6" },
  evolves: { stroke: "#6366f1" },
  influences: { stroke: "#ec4899", dash: "7 5" },
};
const hash = (value: string) => [...value].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);

function layout(nodes: NetworkNode[], edges: NetworkEdge[]): PositionedNode[] {
  // A deterministic force layout gives the graph an Obsidian-like loose shape
  // without making the page jump whenever React rerenders it.
  const points = nodes.map((node) => {
    const seed = hash(node.id);
    return { ...node, x: 130 + (seed % 1500), y: 100 + (Math.floor(seed / 97) % 850) };
  });
  const byId = new Map(points.map((point) => [point.id, point]));
  const graphEdges = edges.filter((edge) => byId.has(edge.source) && byId.has(edge.target));

  for (let step = 0; step < 150; step += 1) {
    const movement = new Map(points.map((point) => [point.id, { x: 0, y: 0 }]));
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i]; const b = points[j];
        let dx = a.x - b.x; let dy = a.y - b.y;
        const distanceSquared = Math.max(360, dx * dx + dy * dy);
        const distance = Math.sqrt(distanceSquared);
        if (distance < 1) { dx = 1; dy = 0; }
        const force = 4200 / distanceSquared;
        const ax = movement.get(a.id)!; const bx = movement.get(b.id)!;
        ax.x += dx / distance * force; ax.y += dy / distance * force;
        bx.x -= dx / distance * force; bx.y -= dy / distance * force;
      }
    }
    for (const edge of graphEdges) {
      const source = byId.get(edge.source)!; const target = byId.get(edge.target)!;
      const dx = target.x - source.x; const dy = target.y - source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const desired = edge.relation === "belongs" ? 96 : 235;
      const force = (distance - desired) * 0.008;
      const sourceMove = movement.get(source.id)!; const targetMove = movement.get(target.id)!;
      sourceMove.x += dx / distance * force; sourceMove.y += dy / distance * force;
      targetMove.x -= dx / distance * force; targetMove.y -= dy / distance * force;
    }
    for (const point of points) {
      const delta = movement.get(point.id)!;
      // A very light pull toward the canvas keeps isolated topics in view.
      delta.x += (WIDTH / 2 - point.x) * 0.0015;
      delta.y += (HEIGHT / 2 - point.y) * 0.0015;
      point.x = Math.max(70, Math.min(WIDTH - 70, point.x + Math.max(-12, Math.min(12, delta.x))));
      point.y = Math.max(70, Math.min(HEIGHT - 70, point.y + Math.max(-12, Math.min(12, delta.y))));
    }

    // Labels extend to the right of every dot.  Treat them as small rectangles
    // in the layout, so the readable graph stays loose rather than only the
    // invisible centre-points avoiding each other.
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i]; const b = points[j];
        const labelWidthA = Math.min(190, 24 + a.labelJa.length * 13);
        const labelWidthB = Math.min(190, 24 + b.labelJa.length * 13);
        const horizontalGap = Math.abs(a.x - b.x);
        const verticalGap = Math.abs(a.y - b.y);
        const requiredHorizontal = (labelWidthA + labelWidthB) / 2 + 16;
        if (horizontalGap < requiredHorizontal && verticalGap < 30) {
          const push = (30 - verticalGap) * 0.55 + 2;
          if ((hash(a.id) + step) % 2 === 0) { a.y -= push; b.y += push; }
          else { a.y += push; b.y -= push; }
          a.y = Math.max(55, Math.min(HEIGHT - 55, a.y));
          b.y = Math.max(55, Math.min(HEIGHT - 55, b.y));
        }
      }
    }
  }
  return points;
}

export default function HistoryNetworkClient({ nodes, edges }: { nodes: NetworkNode[]; edges: NetworkEdge[] }) {
  const [lang, setLang] = useState<"ja" | "zh">("ja");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"all" | "japan" | "western" | "global" | "east-asian">("all");
  const [enabledKinds, setEnabledKinds] = useState<Set<NetworkKind>>(new Set(["style", "movement", "architect", "building-type", "theory", "institution"]));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedOnly, setFocusedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, scale: 0.72 });
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const t = (ja: string, zh: string) => lang === "ja" ? ja : zh;

  const allPositioned = useMemo(() => layout(nodes, edges), [nodes, edges]);
  const selectedNeighbors = useMemo(() => !selectedId ? new Set<string>() : new Set(edges
    .filter((edge) => edge.source === selectedId || edge.target === selectedId)
    .flatMap((edge) => [edge.source, edge.target])), [selectedId, edges]);
  const queryMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return new Set<string>();
    return new Set(allPositioned
      .filter((node) => `${node.labelJa} ${node.labelZh}`.toLowerCase().includes(normalized))
      .map((node) => node.id));
  }, [allPositioned, query]);
  const visibleNodes = useMemo(() => allPositioned.filter((node) => {
    if (!enabledKinds.has(node.kind)) return false;
    if (region !== "all" && !node.regions.includes(region)) return false;
    if (query && selectedId && queryMatches.has(selectedId)) {
      if (node.id !== selectedId && !selectedNeighbors.has(node.id)) return false;
    } else if (query && !queryMatches.has(node.id)) return false;
    if (focusedOnly && selectedId && node.id !== selectedId && !selectedNeighbors.has(node.id)) return false;
    return true;
  }), [allPositioned, enabledKinds, region, query, queryMatches, focusedOnly, selectedId, selectedNeighbors]);
  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(() => edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)), [edges, visibleIds]);
  const nodeById = useMemo(() => new Map(visibleNodes.map((node) => [node.id, node])), [visibleNodes]);
  const allNodeById = useMemo(() => new Map(allPositioned.map((node) => [node.id, node])), [allPositioned]);
  const selected = selectedId ? allPositioned.find((node) => node.id === selectedId) ?? null : null;
  const selectedRelations = useMemo(() => !selectedId ? [] : edges
    .filter((edge) => edge.source === selectedId || edge.target === selectedId)
    .map((edge) => ({ edge, outgoing: edge.source === selectedId, other: allNodeById.get(edge.source === selectedId ? edge.target : edge.source) }))
    .filter((item): item is { edge: NetworkEdge; outgoing: boolean; other: PositionedNode } => Boolean(item.other)), [selectedId, edges, allNodeById]);
  const hasSelection = Boolean(selectedId);

  const focusNode = (node: PositionedNode, scale = 0.96) => {
    setSelectedId(node.id);
    setView({ x: WIDTH / 2 - node.x * scale, y: HEIGHT / 2 - node.y * scale, scale });
  };

  const selectNode = (node: PositionedNode) => {
    setQuery("");
    setFocusedOnly(false);
    focusNode(node, Math.max(0.86, view.scale));
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setFocusedOnly(false);
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      setSelectedId(null);
      setView({ x: 0, y: 0, scale: 0.72 });
      return;
    }
    const matches = allPositioned.filter((node) => `${node.labelJa} ${node.labelZh}`.toLowerCase().includes(normalized));
    if (matches.length === 1) {
      const match = matches[0];
      setEnabledKinds((current) => {
        if (current.has(match.kind)) return current;
        const next = new Set(current);
        next.add(match.kind);
        return next;
      });
      if (region !== "all" && !match.regions.includes(region)) setRegion("all");
      focusNode(match, 1.3);
    }
  };

  const relationExplanation = (edge: NetworkEdge, outgoing: boolean, other: PositionedNode) => {
    if (edge.detailJa && edge.detailZh) return t(edge.detailJa, edge.detailZh);
    const otherName = t(other.labelJa, other.labelZh || other.labelJa);
    if (edge.relation === "belongs") return outgoing
      ? t(`「${otherName}」の代表・所属建築として結びます。`, `作为“${otherName}”的代表／所属建筑相连。`)
      : t(`「${otherName}」が、この知識点の代表・所属建築です。`, `“${otherName}”是该知识点的代表／所属建筑。`);
    if (edge.relation === "evolves") return outgoing
      ? t(`ここから「${otherName}」へ、継承・変化の流れを追います。`, `从此节点到“${otherName}”，表示继承或变化的脉络。`)
      : t(`「${otherName}」からここへ、継承・変化の流れを追います。`, `从“${otherName}”到此节点，表示继承或变化的脉络。`);
    if (edge.relation === "influences") return outgoing
      ? t(`ここが「${otherName}」の成立・表現に影響します。`, `此节点影响“${otherName}”的形成或表达。`)
      : t(`「${otherName}」が、ここでの成立・表現に影響します。`, `“${otherName}”影响此节点的形成或表达。`);
    return t(`「${otherName}」とは、比較して確認する直接の関連です。`, `与“${otherName}”是需要对照理解的直接关联。`);
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest("[data-node]")) return;
    drag.current = { x: event.clientX, y: event.clientY, startX: view.x, startY: view.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    // React may process the state updater after pointerup/leave has already
    // cleared the ref. Snapshot the drag data before scheduling the update.
    const currentDrag = drag.current;
    if (!currentDrag) return;
    setView((current) => ({ ...current, x: currentDrag.startX + event.clientX - currentDrag.x, y: currentDrag.startY + event.clientY - currentDrag.y }));
  };
  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    setView((current) => ({ ...current, scale: Math.max(0.42, Math.min(1.45, current.scale * (event.deltaY > 0 ? 0.9 : 1.1))) }));
  };
  const toggleKind = (kind: NetworkKind) => setEnabledKinds((current) => {
    const next = new Set(current);
    if (next.has(kind)) next.delete(kind);
    else next.add(kind);
    return next;
  });
  const zoomBy = (factor: number) => setView((current) => {
    const scale = Math.max(0.42, Math.min(1.45, current.scale * factor));
    const centerX = (WIDTH / 2 - current.x) / current.scale;
    const centerY = (HEIGHT / 2 - current.y) / current.scale;
    return { x: WIDTH / 2 - centerX * scale, y: HEIGHT / 2 - centerY * scale, scale };
  });

  return <SidebarLayout>
    <div className="min-h-full bg-[#fbfcff] p-4 lg:p-6">
      <header className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link href="/explore" className="mb-3 inline-flex text-sm text-slate-500 hover:text-indigo-700">← {t("探索に戻る", "返回探索")}</Link>
          <p className="text-xs font-semibold tracking-[0.16em] text-indigo-500">ARCHITECTURE HISTORY</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{t("建築史 知識ネットワーク", "建筑史知识网络")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("点は知識点、線は直接の関係。選択した時だけ周辺を強調します。", "圆点是知识点，细线是直接关系；选择后才强调周边。")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(lang === "ja" ? "zh" : "ja")} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">{lang === "ja" ? "中文" : "日本語"}</button>
          <button onClick={() => setView({ x: 0, y: 0, scale: 0.72 })} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">{t("表示を戻す", "重置视图")}</button>
        </div>
      </header>

      <section className="relative h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[640px] xl:h-[min(760px,calc(100vh-12rem))] xl:min-h-[560px]">
        <button onClick={() => setFiltersOpen((value) => !value)} className="absolute left-4 top-4 z-20 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm sm:hidden" aria-expanded={filtersOpen}>
          {filtersOpen ? t("絞り込みを閉じる", "收起筛选") : t("検索・絞り込み", "搜索与筛选")}
        </button>
        <div className={`absolute left-4 top-16 z-10 max-w-[calc(100%-2rem)] flex-wrap items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-sm backdrop-blur sm:top-4 sm:flex ${filtersOpen ? "flex" : "hidden"}`}>
          <div className="flex min-w-0 items-center gap-1 rounded-xl bg-slate-50 pr-1">
            <input value={query} onChange={(event) => changeQuery(event.target.value)} placeholder={t("知識点を検索", "搜索知识点")} className="w-36 min-w-0 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200 sm:w-44" />
            {query && <button onClick={() => changeQuery("")} className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-white hover:text-slate-700" aria-label={t("検索を消去", "清除搜索")}>×</button>}
          </div>
          {(["all", "japan", "western", "global", "east-asian"] as const).map((value) => <button key={value} onClick={() => setRegion(value)} className={`rounded-xl px-3 py-2 text-xs font-medium ${region === value ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{value === "all" ? t("すべて", "全部") : value === "japan" ? t("日本", "日本") : value === "western" ? t("西洋", "西方") : value === "global" ? t("世界", "全球") : t("東アジア", "东亚")}</button>)}
          <span className="mx-1 hidden h-5 border-l border-slate-200 sm:block" />
          {(Object.keys(KIND_META) as NetworkKind[]).map((kind) => <button key={kind} onClick={() => toggleKind(kind)} className="rounded-xl px-3 py-2 text-xs font-medium" style={{ background: enabledKinds.has(kind) ? KIND_META[kind].soft : "transparent", color: enabledKinds.has(kind) ? KIND_META[kind].color : "#94a3b8" }}>{t(KIND_META[kind].ja, KIND_META[kind].zh)}</button>)}
        </div>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full touch-none select-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }} onWheel={onWheel}>
          <defs>
            <pattern id="network-grid" width="74" height="74" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.8" fill="#dbe4f0" /></pattern>
            {(["belongs", "evolves", "influences"] as const).map((relation) => <marker key={relation} id={`arrow-${relation}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={RELATION_STYLE[relation].stroke} /></marker>)}
          </defs>
          <rect width={WIDTH} height={HEIGHT} fill="url(#network-grid)" />
          <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
            {visibleEdges.map((edge) => {
              const a = nodeById.get(edge.source); const b = nodeById.get(edge.target);
              if (!a || !b) return null;
              const relation = RELATION_STYLE[edge.relation];
              const highlighted = edge.source === selectedId || edge.target === selectedId;
              const directional = edge.relation !== "related";
              return <line key={edge.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={highlighted ? "#334155" : relation.stroke} strokeWidth={highlighted ? 2.4 : 1.05} strokeDasharray={relation.dash} markerEnd={directional ? `url(#arrow-${edge.relation})` : undefined} opacity={hasSelection && !highlighted ? 0.08 : hasSelection ? 0.88 : 0.18} />;
            })}
            {visibleNodes.map((node) => {
              const meta = KIND_META[node.kind];
              const active = selectedId === node.id;
              const neighbor = selectedNeighbors.has(node.id);
              const subdued = hasSelection && !active && !neighbor;
              const label = t(node.labelJa, node.labelZh || node.labelJa);
              const showLabel = view.scale >= 0.86 || active || neighbor || node.examCount >= 2 || node.priority === "S" || node.priority === "A";
              return <g key={node.id} data-node transform={`translate(${node.x} ${node.y})`} className="cursor-pointer outline-none focus-visible:[&>circle]:stroke-slate-900" role="button" tabIndex={0} aria-label={`${t(KIND_META[node.kind].ja, KIND_META[node.kind].zh)}: ${label}`} onClick={() => selectNode(node)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectNode(node); } }}>
                <title>{label}</title>
                {active && <circle r="17" fill={meta.soft} opacity="0.95" />}
                <circle r={active ? 8 : node.kind === "building" ? 4.5 : 6} fill={meta.color} stroke="white" strokeWidth={active ? 3 : 1.8} opacity={subdued ? 0.18 : 1} />
                {showLabel && <text x="11" y="4" fontSize="12" fontWeight={active ? "700" : "500"} fill={subdued ? "#cbd5e1" : active ? "#0f172a" : "#475569"}>{label.length > 22 ? `${label.slice(0, 21)}…` : label}</text>}
              </g>;
            })}
          </g>
        </svg>
        <div className="absolute bottom-4 left-4 rounded-xl border border-slate-100 bg-white/90 px-3 py-2 text-xs text-slate-500 shadow-sm">{visibleNodes.length} {t("知識点", "知识点")} · {visibleEdges.length} {t("直接関係", "直接关系")} · {t("クリックで周辺を表示", "点击查看周边")}</div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="hidden rounded-xl border border-slate-100 bg-white/90 px-3 py-2 text-xs text-slate-500 shadow-sm lg:block"><span className="text-slate-400">→</span> {t("代表・所属", "代表／归属")}　<span className="text-indigo-500">→</span> {t("継承・変化", "演变")}　<span className="text-pink-500">┄→</span> {t("影響", "影响")}　<span className="text-violet-400">┄┄</span> {t("関連", "相关")}</div>
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button onClick={() => zoomBy(0.82)} className="px-3 py-2 text-lg leading-none text-slate-600 hover:bg-slate-100" aria-label={t("縮小", "缩小")}>−</button>
            <span className="min-w-14 border-x border-slate-200 px-2 py-2 text-center text-xs font-medium text-slate-600">{Math.round(view.scale * 100)}%</span>
            <button onClick={() => zoomBy(1.22)} className="px-3 py-2 text-lg leading-none text-slate-600 hover:bg-slate-100" aria-label={t("拡大", "放大")}>＋</button>
            <button onClick={() => setView({ x: 0, y: 0, scale: 0.72 })} className="border-l border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100">{t("全体", "适配")}</button>
          </div>
        </div>
      </section>

      {selected && <section className="relative mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg xl:fixed xl:right-6 xl:top-24 xl:z-30 xl:mt-0 xl:max-h-[calc(100vh-7rem)] xl:w-[440px] xl:overflow-y-auto">
        <button onClick={() => { setSelectedId(null); setFocusedOnly(false); }} className="absolute right-3 top-3 rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={t("詳細を閉じる", "关闭详情")}>×</button>
        <div className="min-w-0 pr-8">
          <div className="mb-1 flex flex-wrap items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: KIND_META[selected.kind].color }} /><span className="text-xs font-semibold" style={{ color: KIND_META[selected.kind].color }}>{t(KIND_META[selected.kind].ja, KIND_META[selected.kind].zh)}</span><span className="text-xs text-slate-400">{t(selected.period, selected.periodZh || selected.period)}</span>{selected.examCount > 0 && <span className="text-xs text-rose-600">{t("過去問", "真题")} {selected.examCount}</span>}</div>
          <h2 className="text-xl font-bold leading-snug text-slate-900">{t(selected.labelJa, selected.labelZh || selected.labelJa)}</h2>
          {lang === "ja" && <OriginalLanguage term={selected.labelJa} />}
          <p className="mt-2 text-sm leading-6 text-slate-500">{t(selected.summaryJa, selected.summaryZh || selected.summaryJa)}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setFocusedOnly((value) => !value)} className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white">{focusedOnly ? t("全体に戻る", "返回全图") : t("周辺だけを見る", "只看周边")}</button><Link href={`${selected.href}?from=network`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600">{t("詳細", "详情")}</Link></div>
        {selectedRelations.length > 0 && <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">{t("つながりの説明", "连接说明")}</h3><span className="text-xs text-slate-400">{selectedRelations.length} {t("件", "条")}</span></div>
          <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-1">
            {selectedRelations.map(({ edge, outgoing, other }) => {
              const relation = RELATION_STYLE[edge.relation];
              const meta = KIND_META[other.kind];
              const source = allNodeById.get(edge.source);
              const target = allNodeById.get(edge.target);
              const directional = edge.relation === "evolves" || edge.relation === "influences" || edge.relation === "belongs";
              return <button key={edge.id} onClick={() => selectNode(other)} className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40">
                <div className="flex items-center gap-2 text-xs"><span className="font-mono text-slate-400">{outgoing ? "→" : "←"}</span><span className="rounded px-1.5 py-0.5 font-medium" style={{ background: meta.soft, color: meta.color }}>{t(KIND_META[other.kind].ja, KIND_META[other.kind].zh)}</span><span className="font-semibold" style={{ color: relation.stroke }}>{t(edge.labelJa, edge.labelZh)}</span></div>
                {directional && source && target ? <p className="mt-1 text-sm font-medium text-slate-800">{t(source.labelJa, source.labelZh || source.labelJa)} <span className="mx-1 text-slate-400">→</span> {t(target.labelJa, target.labelZh || target.labelJa)}</p> : <p className="mt-1 text-sm font-medium text-slate-800">{t(other.labelJa, other.labelZh || other.labelJa)}</p>}
                <p className="mt-1 text-xs leading-5 text-slate-500">{relationExplanation(edge, outgoing, other)}</p>
              </button>;
            })}
          </div>
        </div>}
      </section>}
    </div>
  </SidebarLayout>;
}
