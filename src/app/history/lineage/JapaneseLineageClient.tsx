"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SidebarLayout } from "@/components/layout";
import type {
  JapanesePersonLineage,
  LineagePerson,
  LineagePersonRole,
  LineageRelation,
} from "@/lib/japanese-person-lineages";
import type {
  JapaneseLineageCaseStudy,
  KnowledgeConfidence,
} from "@/lib/japanese-lineage-case-studies";

type Language = "ja" | "zh";

const CARD_WIDTH = 250;
const CARD_HEIGHT = 260;
const HISTORY_LANGUAGE_STORAGE_KEY = "history-language";

const ROLE_META: Record<LineagePersonRole, { ja: string; zh: string; dot: string; badge: string; border: string }> = {
  royal: { ja: "皇族", zh: "皇族", dot: "#7c3aed", badge: "bg-violet-50 text-violet-700", border: "border-violet-200" },
  warrior: { ja: "武家", zh: "武家", dot: "#dc2626", badge: "bg-red-50 text-red-700", border: "border-red-200" },
  patron: { ja: "施主・後援者", zh: "施主／后援者", dot: "#d97706", badge: "bg-amber-50 text-amber-700", border: "border-amber-200" },
  monk: { ja: "僧侶", zh: "僧侣", dot: "#059669", badge: "bg-emerald-50 text-emerald-700", border: "border-emerald-200" },
  builder: { ja: "造営・技術者", zh: "营造／技术者", dot: "#0284c7", badge: "bg-sky-50 text-sky-700", border: "border-sky-200" },
};

const RELATION_META = {
  "parent-child": { stroke: "#334155", dash: undefined, ja: "血縁（父子）", zh: "血缘（父子）" },
  "family-succession": { stroke: "#7c3aed", dash: "8 6", ja: "家系内の文化的継承", zh: "家系内的文化传承" },
  "project-succession": { stroke: "#0369a1", dash: "10 5", ja: "事業・造営の継承", zh: "事业／营造继承" },
  collaboration: { stroke: "#0f766e", dash: "3 6", ja: "共同事業", zh: "共同事业" },
} as const;

function personCardHeight(person: LineagePerson) {
  return CARD_HEIGHT + Math.max(0, person.buildings.length - 1) * 64;
}

const CONFIDENCE_META: Record<KnowledgeConfidence, { ja: string; zh: string; className: string }> = {
  confirmed: { ja: "確認済み", zh: "资料确认", className: "bg-emerald-50 text-emerald-700" },
  approximate: { ja: "概略", zh: "约略", className: "bg-sky-50 text-sky-700" },
  traditional: { ja: "伝承", zh: "传承说法", className: "bg-amber-50 text-amber-700" },
  disputed: { ja: "異説あり", zh: "存在争议", className: "bg-rose-50 text-rose-700" },
  research_required: { ja: "要再確認", zh: "需继续核对", className: "bg-slate-100 text-slate-600" },
};

const ENTITY_META = {
  person: { ja: "人物", zh: "人物" },
  building: { ja: "建築", zh: "建筑" },
  term: { ja: "用語", zh: "术语" },
  event: { ja: "事件", zh: "事件" },
} as const;

function relationPath(relation: LineageRelation, people: Map<string, LineagePerson>) {
  const source = people.get(relation.source);
  const target = people.get(relation.target);
  if (!source || !target) return null;
  const sourceHeight = personCardHeight(source);
  const targetHeight = personCardHeight(target);

  if (relation.kind === "family-succession") {
    const startX = source.x + CARD_WIDTH / 2;
    const endX = target.x + CARD_WIDTH / 2;
    const startY = source.y;
    const endY = target.y;
    const topY = Math.max(28, Math.min(startY, endY) - 44);
    return {
      d: `M ${startX} ${startY} C ${startX} ${topY}, ${endX} ${topY}, ${endX} ${endY}`,
      labelX: (startX + endX) / 2,
      labelY: topY,
    };
  }

  const horizontal = Math.abs(target.x - source.x) >= Math.abs(target.y - source.y);
  if (horizontal) {
    const forward = target.x >= source.x;
    const startX = forward ? source.x + CARD_WIDTH : source.x;
    const endX = forward ? target.x : target.x + CARD_WIDTH;
    const startY = source.y + sourceHeight / 2;
    const endY = target.y + targetHeight / 2;
    const middleX = (startX + endX) / 2;
    return {
      d: `M ${startX} ${startY} C ${middleX} ${startY}, ${middleX} ${endY}, ${endX} ${endY}`,
      labelX: middleX,
      labelY: (startY + endY) / 2 - 10,
    };
  }

  const downward = target.y >= source.y;
  const startX = source.x + CARD_WIDTH / 2;
  const startY = downward ? source.y + sourceHeight : source.y;
  const endX = target.x + CARD_WIDTH / 2;
  const endY = downward ? target.y : target.y + targetHeight;
  const middleY = (startY + endY) / 2;
  return {
    d: `M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`,
    labelX: startX + 68,
    labelY: middleY - 8,
  };
}

function PersonCard({ person, lang, active, subdued, onSelect }: {
  person: LineagePerson;
  lang: Language;
  active: boolean;
  subdued: boolean;
  onSelect: () => void;
}) {
  const role = ROLE_META[person.role];
  const t = (ja: string, zh: string) => lang === "ja" ? ja : zh;

  return (
    <article
      className={`absolute flex w-[250px] flex-col rounded-2xl border bg-white p-4 shadow-sm transition-all ${role.border} ${active ? "z-20 -translate-y-1 shadow-xl ring-2 ring-indigo-400" : "z-10"} ${subdued ? "opacity-25 grayscale" : "opacity-100"}`}
      style={{ left: person.x, top: person.y, height: personCardHeight(person) }}
    >
      <button type="button" onClick={onSelect} className="text-left focus:outline-none" aria-pressed={active}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">{t(person.name.ja, person.name.zh)}</h3>
            <p className="mt-0.5 font-mono text-[11px] text-slate-400">{person.years}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${role.badge}`}>{t(role.ja, role.zh)}</span>
        </div>
        <p className="mt-2 text-[11px] font-semibold text-slate-600">{t(person.roleLabel.ja, person.roleLabel.zh)}</p>
        <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{t(person.summary.ja, person.summary.zh)}</p>
      </button>

      <div className="mt-auto space-y-1.5 border-t border-slate-100 pt-2">
        {person.buildings.length === 0 ? (
          <p className="rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] leading-4 text-slate-400">
            {t("系譜をつなぐ人物。建物を無理に割り当てない。", "用于连接谱系，不强行附会建筑。")}
          </p>
        ) : person.buildings.map((building) => (
          <Link key={`${person.id}-${building.id}`} href={`/history/buildings/${building.id}`} className="group block rounded-lg bg-slate-50 px-2.5 py-1.5 hover:bg-indigo-50">
            <span className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800 group-hover:text-indigo-700">
              {t(building.name.ja, building.name.zh)} <span aria-hidden="true">↗</span>
            </span>
            <span className="mt-0.5 block text-[10px] leading-4 text-slate-500">
              {t(building.relation.ja, building.relation.zh)}
              {building.certainty === "traditional" && <span className="ml-1 rounded bg-amber-100 px-1 text-amber-700">{t("伝承", "传承说法")}</span>}
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}

function MobilePersonList({ people, relations, lang, selectedPersonId, relatedIds, onSelect }: {
  people: LineagePerson[];
  relations: LineageRelation[];
  lang: Language;
  selectedPersonId: string | null;
  relatedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  const t = (ja: string, zh: string) => lang === "ja" ? ja : zh;
  const peopleById = new Map(people.map((person) => [person.id, person]));

  return (
    <div className="space-y-3 p-4 sm:hidden">
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-5 text-slate-500">
        {t("関係ラベルから相手の人物を開けます。伝承関係は別に表示します。", "点击关系标签可以查看对方人物；传承关系会单独标明。")}
      </p>
      {people.map((person) => {
        const role = ROLE_META[person.role];
        const subdued = Boolean(selectedPersonId && person.id !== selectedPersonId && !relatedIds.has(person.id));
        const connectedRelations = relations.filter((relation) => relation.source === person.id || relation.target === person.id);
        return (
          <article key={person.id} className={`rounded-2xl border bg-white p-4 shadow-sm transition ${role.border} ${selectedPersonId === person.id ? "ring-2 ring-indigo-400" : ""} ${subdued ? "opacity-40" : ""}`}>
            <button type="button" onClick={() => onSelect(person.id)} className="w-full text-left" aria-pressed={selectedPersonId === person.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{t(person.name.ja, person.name.zh)}</h3>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400">{person.years}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${role.badge}`}>{t(role.ja, role.zh)}</span>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-600">{t(person.roleLabel.ja, person.roleLabel.zh)}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{t(person.summary.ja, person.summary.zh)}</p>
            </button>
            {connectedRelations.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                <p className="text-[10px] font-bold tracking-wider text-slate-400">{t("直接関係", "直接关系")}</p>
                {connectedRelations.map((relation) => {
                  const outgoing = relation.source === person.id;
                  const otherId = outgoing ? relation.target : relation.source;
                  const otherPerson = peopleById.get(otherId);
                  const meta = RELATION_META[relation.kind];
                  return (
                    <button key={relation.id} type="button" onClick={() => onSelect(otherId)} className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-left text-[11px] hover:bg-indigo-50">
                      <i className="h-6 w-1 shrink-0 rounded-full" style={{ background: meta.stroke }} />
                      <span className="min-w-0 flex-1 font-semibold text-slate-700">
                        {t(relation.label.ja, relation.label.zh)} {outgoing ? "→" : "←"} {otherPerson && t(otherPerson.name.ja, otherPerson.name.zh)}
                      </span>
                      {relation.certainty === "traditional" && <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">{t("伝承", "传承")}</span>}
                    </button>
                  );
                })}
              </div>
            )}
            {person.buildings.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                {person.buildings.map((building) => (
                  <Link key={`${person.id}-${building.id}`} href={`/history/buildings/${building.id}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700">
                    {t(building.name.ja, building.name.zh)} ↗
                  </Link>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function ConfidenceBadge({ value, lang }: { value: KnowledgeConfidence; lang: Language }) {
  const meta = CONFIDENCE_META[value];
  return <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${meta.className}`}>{lang === "ja" ? meta.ja : meta.zh}</span>;
}

function CaseDrawer({ caseStudy, selectedEntityId, lang, onSelectEntity, onClose }: {
  caseStudy: JapaneseLineageCaseStudy;
  selectedEntityId: string;
  lang: Language;
  onSelectEntity: (id: string) => void;
  onClose: () => void;
}) {
  const t = (ja: string, zh: string) => lang === "ja" ? ja : zh;
  const entitiesById = new Map(caseStudy.entities.map((entity) => [entity.id, entity]));
  const selectedEntity = entitiesById.get(selectedEntityId) ?? entitiesById.get(caseStudy.primaryEntityId)!;
  const connectedRelations = caseStudy.relations.filter((relation) => relation.sourceId === selectedEntity.id || relation.targetId === selectedEntity.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t(caseStudy.title.ja, caseStudy.title.zh)}
        className="ml-auto h-full w-full max-w-xl overflow-y-auto bg-[#fbfaf7] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-[#fbfaf7]/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-indigo-600">{t("重点ケース", "重点案例")}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{t(caseStudy.title.ja, caseStudy.title.zh)}</h2>
          </div>
          <button type="button" onClick={onClose} autoFocus className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:border-slate-400">
            {t("閉じる", "关闭")} ×
          </button>
        </div>

        <div className="space-y-7 px-5 py-6 sm:px-7">
          <section>
            <p className="text-xs font-bold text-amber-700">{t("なぜ重要か", "为什么重要")}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{t(caseStudy.whyImportant.ja, caseStudy.whyImportant.zh)}</p>
            <p className="mt-3 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600 shadow-sm">{t(caseStudy.background.ja, caseStudy.background.zh)}</p>
          </section>

          <section>
            <h3 className="text-sm font-black text-slate-900">{t("人物・建築・用語・事件", "人物、建筑、术语与事件")}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {caseStudy.entities.map((entity) => (
                <button key={entity.id} type="button" onClick={() => onSelectEntity(entity.id)} className={`rounded-full border px-3 py-2 text-xs font-semibold ${entity.id === selectedEntity.id ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>
                  {t(ENTITY_META[entity.type].ja, ENTITY_META[entity.type].zh)} · {t(entity.name.ja, entity.name.zh)}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-indigo-500">{t(ENTITY_META[selectedEntity.type].ja, ENTITY_META[selectedEntity.type].zh)}</p>
                  <h4 className="mt-1 text-lg font-bold text-slate-950">{t(selectedEntity.name.ja, selectedEntity.name.zh)}</h4>
                  {(selectedEntity.date || selectedEntity.location) && <p className="mt-1 text-xs text-slate-400">{selectedEntity.date && t(selectedEntity.date.ja, selectedEntity.date.zh)}{selectedEntity.date && selectedEntity.location ? " · " : ""}{selectedEntity.location && t(selectedEntity.location.ja, selectedEntity.location.zh)}</p>}
                </div>
                <ConfidenceBadge value={selectedEntity.confidence} lang={lang} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t(selectedEntity.summary.ja, selectedEntity.summary.zh)}</p>
              {selectedEntity.buildingId && <Link href={`/history/buildings/${selectedEntity.buildingId}`} className="mt-3 inline-flex rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white">{t("建築データを見る", "查看建筑资料")} ↗</Link>}

              {connectedRelations.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  {connectedRelations.map((relation) => {
                    const otherId = relation.sourceId === selectedEntity.id ? relation.targetId : relation.sourceId;
                    const other = entitiesById.get(otherId);
                    return (
                      <button key={relation.id} type="button" onClick={() => onSelectEntity(otherId)} className="block w-full rounded-xl bg-slate-50 px-3 py-2.5 text-left hover:bg-indigo-50">
                        <span className="flex items-center justify-between gap-2 text-xs font-bold text-slate-800"><span>{t(relation.label.ja, relation.label.zh)} → {other && t(other.name.ja, other.name.zh)}</span><ConfidenceBadge value={relation.confidence} lang={lang} /></span>
                        <span className="mt-1 block text-[11px] leading-5 text-slate-500">{t(relation.description.ja, relation.description.zh)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black text-slate-900">{t("建築段階を分ける", "分开看建筑阶段")}</h3>
            <div className="mt-3 space-y-0">
              {caseStudy.phases.map((phase, index) => (
                <div key={phase.id} className="grid grid-cols-[18px_1fr] gap-3">
                  <div className="flex flex-col items-center"><i className="mt-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />{index < caseStudy.phases.length - 1 && <i className="w-px flex-1 bg-indigo-200" />}</div>
                  <div className="pb-5">
                    <div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black text-slate-900">{t(phase.displayDate.ja, phase.displayDate.zh)}</p><ConfidenceBadge value={phase.confidence} lang={lang} /></div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{t(phase.description.ja, phase.description.zh)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-amber-50 p-4">
            <h3 className="text-sm font-black text-amber-950">{t("試験で混同しやすい点", "考试中容易混淆")}</h3>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-900">
              {caseStudy.examFocus.map((item, index) => <li key={index}>• {t(item.ja, item.zh)}</li>)}
            </ul>
            <div className="mt-4 space-y-2 border-t border-amber-200 pt-4">
              {caseStudy.examTraps.map((trap, index) => <div key={index} className="rounded-xl bg-white/70 p-3"><p className="text-xs font-black text-rose-700">× {t(trap.label.ja, trap.label.zh)}</p><p className="mt-1 text-xs leading-5 text-slate-600">{t(trap.explanation.ja, trap.explanation.zh)}</p></div>)}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-700">{t("根拠資料", "资料来源")}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {caseStudy.sources.map((source) => source.href ? <a key={source.id} href={source.href} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-indigo-700">{t(source.label.ja, source.label.zh)} ↗</a> : <span key={source.id} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500">{t(source.label.ja, source.label.zh)}</span>)}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function PersonDrawer({ person, lang, onClose }: { person: LineagePerson; lang: Language; onClose: () => void }) {
  const t = (ja: string, zh: string) => lang === "ja" ? ja : zh;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30" onMouseDown={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={t(person.name.ja, person.name.zh)} onMouseDown={(event) => event.stopPropagation()} className="ml-auto h-full w-full max-w-md overflow-y-auto bg-[#fbfaf7] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold text-indigo-500">{t("選択した人物", "当前人物")}</p><h2 className="mt-1 text-2xl font-black text-slate-950">{t(person.name.ja, person.name.zh)}</h2><p className="mt-1 text-xs text-slate-400">{person.years} · {t(person.roleLabel.ja, person.roleLabel.zh)}</p></div>
          <button type="button" onClick={onClose} autoFocus className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">{t("閉じる", "关闭")} ×</button>
        </div>
        <p className="mt-6 text-sm leading-7 text-slate-700">{t(person.summary.ja, person.summary.zh)}</p>
        <div className="mt-6 space-y-3">
          {person.buildings.length === 0 ? <p className="rounded-2xl bg-white p-4 text-xs leading-5 text-slate-500">{t("系譜をつなぐ人物。建物を無理に割り当てない。", "用于连接谱系，不强行附会建筑。")}</p> : person.buildings.map((building) => (
            <Link key={building.id} href={`/history/buildings/${building.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300">
              <span className="font-bold text-slate-900">{t(building.name.ja, building.name.zh)} ↗</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">{t(building.relation.ja, building.relation.zh)}</span>
              {building.note && <span className="mt-2 block text-xs leading-5 text-amber-700">※ {t(building.note.ja, building.note.zh)}</span>}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function JapaneseLineageClient({ lineages, caseStudies }: { lineages: JapanesePersonLineage[]; caseStudies: JapaneseLineageCaseStudy[] }) {
  const [lang, setLang] = useState<Language>("zh");
  const [activeId, setActiveId] = useState(lineages[0]?.id ?? "");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [personDrawerOpen, setPersonDrawerOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const active = lineages.find((lineage) => lineage.id === activeId) ?? lineages[0];
  const t = (ja: string, zh: string) => lang === "ja" ? ja : zh;

  const peopleById = useMemo(() => new Map(active.people.map((item) => [item.id, item])), [active]);
  const relatedIds = useMemo(() => {
    if (!selectedPersonId) return new Set<string>();
    return new Set(active.relations
      .filter((relation) => relation.source === selectedPersonId || relation.target === selectedPersonId)
      .flatMap((relation) => [relation.source, relation.target]));
  }, [active, selectedPersonId]);
  const selectedPerson = selectedPersonId ? peopleById.get(selectedPersonId) : undefined;
  const activeCases = caseStudies.filter((caseStudy) => caseStudy.lineageId === active.id);
  const selectedCase = selectedCaseId ? caseStudies.find((caseStudy) => caseStudy.id === selectedCaseId) : undefined;
  const canvasHeight = Math.max(...active.people.map((person) => person.y + personCardHeight(person) + 32), 360);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(HISTORY_LANGUAGE_STORAGE_KEY);
    if (storedLanguage !== "ja" && storedLanguage !== "zh") return;
    const frame = window.requestAnimationFrame(() => setLang(storedLanguage));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPersonDrawerOpen(false);
        setSelectedCaseId(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const changeLineage = (id: string) => {
    setActiveId(id);
    setSelectedPersonId(null);
    setPersonDrawerOpen(false);
    setSelectedCaseId(null);
  };

  const selectPerson = (id: string) => {
    setSelectedCaseId(null);
    setSelectedPersonId(id);
    setPersonDrawerOpen(true);
  };

  const openCase = (caseStudy: JapaneseLineageCaseStudy) => {
    setPersonDrawerOpen(false);
    setSelectedCaseId(caseStudy.id);
    setSelectedEntityId(caseStudy.primaryEntityId);
  };

  if (!active) return null;

  return (
    <SidebarLayout>
      <main className="min-h-full bg-[#f7f6f2] px-4 py-6 text-slate-900 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1500px]">
          <header className="flex flex-col gap-5 border-b border-slate-300 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link href="/explore" className="text-sm text-slate-500 hover:text-indigo-700">← {t("探索に戻る", "返回探索")}</Link>
              <p className="mt-5 text-xs font-bold tracking-[0.22em] text-indigo-600">JAPANESE ARCHITECTURAL HISTORY</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t("人物谱系で読む日本建築史", "用人物谱系读日本建筑史")}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {t("年代だけでなく、血縁・家系内の継承・造営上の役割を分けて読む。建物カードは人物の下に置き、誰が何をしたかを明示する。", "不只看年代，还要区分血缘、家系传承与营造角色。建筑放在人物名下，明确显示“谁对它做了什么”。")}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href="/history/network" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-700">{t("関係ネットワーク", "关系网络")}</Link>
              <button onClick={() => { const next = lang === "ja" ? "zh" : "ja"; setLang(next); window.localStorage.setItem(HISTORY_LANGUAGE_STORAGE_KEY, next); }} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                {lang === "ja" ? "中文" : "日本語"}
              </button>
            </div>
          </header>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label={t("谱系を選ぶ", "选择谱系")}>
            {lineages.map((lineage, index) => (
              <button key={lineage.id} onClick={() => changeLineage(lineage.id)} className={`min-w-[210px] rounded-2xl border px-4 py-3 text-left transition ${lineage.id === active.id ? "border-indigo-500 bg-indigo-600 text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>
                <span className={`text-[10px] font-bold tracking-widest ${lineage.id === active.id ? "text-indigo-100" : "text-slate-400"}`}>0{index + 1} · {t(lineage.period.ja, lineage.period.zh)}</span>
                <span className="mt-1 block text-sm font-bold leading-5">{t(lineage.title.ja, lineage.title.zh)}</span>
              </button>
            ))}
          </nav>

          <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="grid gap-4 border-b border-slate-200 bg-slate-950 px-5 py-5 text-white lg:grid-cols-[1fr_auto] lg:px-7">
              <div>
                <p className="text-xs font-semibold text-indigo-300">{t(active.period.ja, active.period.zh)}</p>
                <h2 className="mt-1 text-xl font-bold">{t(active.title.ja, active.title.zh)}</h2>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300">{t(active.description.ja, active.description.zh)}</p>
              </div>
              <div className="max-w-sm rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-xs leading-5 text-amber-100">
                <b>{t("記憶フック", "记忆钩子")}</b><br />{t(active.memoryHook.ja, active.memoryHook.zh)}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-slate-100 px-5 py-3 text-[11px] text-slate-500 lg:px-7">
              {Object.entries(ROLE_META).map(([key, meta]) => <span key={key} className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: meta.dot }} />{t(meta.ja, meta.zh)}</span>)}
              <span className="mx-1 hidden h-4 border-l border-slate-200 sm:block" />
              {Object.entries(RELATION_META).map(([key, meta]) => <span key={key} className="inline-flex items-center gap-1.5"><i className="w-6 border-t-2" style={{ borderColor: meta.stroke, borderTopStyle: meta.dash ? "dashed" : "solid" }} />{t(meta.ja, meta.zh)}</span>)}
              <span className="inline-flex items-center rounded bg-amber-50 px-2 py-1 font-semibold text-amber-700">{t("伝承関係は明記", "传承关系单独标明")}</span>
              <span className="ml-auto text-slate-400">{t("人物を選ぶと直結関係だけを強調", "点击人物，只强调直接关系")}</span>
            </div>

            {activeCases.length > 0 && (
              <div className="border-b border-indigo-100 bg-indigo-50/70 px-5 py-4 lg:px-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-xs font-black text-indigo-900">{t("まずこのケースで整理する", "先用重点案例理清")}</p><p className="mt-1 text-[11px] text-indigo-700/70">{t("全体図とは分けて、年代・人物・用語の混同をほどく。", "与总谱系分开，集中处理年代、人物和术语混淆。")}</p></div>
                  <div className="flex flex-wrap gap-2">
                    {activeCases.map((caseStudy) => <button key={caseStudy.id} type="button" onClick={() => openCase(caseStudy)} className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700">{t(caseStudy.title.ja, caseStudy.title.zh)} · {t("詳しく見る", "查看案例")} →</button>)}
                  </div>
                </div>
              </div>
            )}

            <MobilePersonList people={active.people} relations={active.relations} lang={lang} selectedPersonId={selectedPersonId} relatedIds={relatedIds} onSelect={selectPerson} />

            <div className="hidden overflow-x-auto bg-[radial-gradient(circle_at_1px_1px,#d8dee9_1px,transparent_0)] bg-[size:28px_28px] p-4 sm:block lg:p-6">
              <div className="relative mx-auto" style={{ width: active.width, height: canvasHeight }}>
                <svg className="pointer-events-none absolute inset-0 z-0" width={active.width} height={canvasHeight} aria-hidden="true">
                  <defs>
                    {Object.entries(RELATION_META).map(([key, meta]) => (
                      <marker key={key} id={`lineage-arrow-${key}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill={meta.stroke} />
                      </marker>
                    ))}
                  </defs>
                  {active.relations.map((relation) => {
                    const path = relationPath(relation, peopleById);
                    if (!path) return null;
                    const meta = RELATION_META[relation.kind];
                    const traditional = relation.certainty === "traditional";
                    const labelWidth = traditional ? 168 : 124;
                    const highlighted = !selectedPersonId || relation.source === selectedPersonId || relation.target === selectedPersonId;
                    return <g key={relation.id} opacity={highlighted ? 1 : 0.08}>
                      <path d={path.d} fill="none" stroke="white" strokeWidth="8" />
                      <path d={path.d} fill="none" stroke={meta.stroke} strokeWidth="2.5" strokeDasharray={meta.dash} markerEnd={`url(#lineage-arrow-${relation.kind})`} />
                      <rect x={path.labelX - labelWidth / 2} y={path.labelY - 12} width={labelWidth} height="24" rx="12" fill={traditional ? "#fffbeb" : "white"} stroke={traditional ? "#d97706" : meta.stroke} strokeOpacity={traditional ? 0.7 : 0.25} />
                      <text x={path.labelX} y={path.labelY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={traditional ? "#b45309" : meta.stroke}>
                        {t(relation.label.ja, relation.label.zh)}{traditional ? t(" · 伝承", " · 传承") : ""}
                      </text>
                    </g>;
                  })}
                </svg>
                {active.people.map((item) => (
                  <PersonCard key={item.id} person={item} lang={lang} active={selectedPersonId === item.id} subdued={Boolean(selectedPersonId && item.id !== selectedPersonId && !relatedIds.has(item.id))} onSelect={() => selectPerson(item.id)} />
                ))}
              </div>
            </div>
          </section>

          <footer className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{t("関係は役割を区別して手動整理。伝承は確定的史実と分けて表示しています。", "关系按人物角色人工整理；传承说法会与确定史实分开标示。")}</p>
            <div className="flex flex-wrap gap-3">
              {active.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">{t(source.label.ja, source.label.zh)} ↗</a>)}
            </div>
          </footer>
        </div>

        {personDrawerOpen && selectedPerson && <PersonDrawer person={selectedPerson} lang={lang} onClose={() => setPersonDrawerOpen(false)} />}
        {selectedCase && <CaseDrawer caseStudy={selectedCase} selectedEntityId={selectedEntityId ?? selectedCase.primaryEntityId} lang={lang} onSelectEntity={setSelectedEntityId} onClose={() => setSelectedCaseId(null)} />}
      </main>
    </SidebarLayout>
  );
}
