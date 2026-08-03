import fs from "fs";
import path from "path";
import HistoryNetworkClient, { type NetworkEdge, type NetworkNode } from "./HistoryNetworkClient";
import { HISTORY_LEARNING_CARDS } from "@/lib/history-learning-cards";
import { HISTORY_TOPICS } from "@/lib/history-topics";
import type { HistoryLearningCard } from "@/types/history-learning-card";

type BuildingRow = {
  id: string;
  name: { ja: string; zh: string };
  regions: string[];
  period: { ja: string; zh: string };
  importance: { examFrequency: number };
  priorityLevel?: "S" | "A" | "B" | "normal";
  isCoreBuilding?: boolean;
};

type BuildingLink = {
  buildingId: string;
  learningCardIds: string[];
};

const edgeKey = (source: string, target: string, relation: string) => `${source}|${target}|${relation}`;

type RelationDetail = { ja: string; zh: string };

// These are not generic graph labels: they expose the two concrete learning
// facts already stored on the cards.  A later manual note can replace them
// for a particularly nuanced historical relationship.
function keyFeature(card: HistoryLearningCard): RelationDetail {
  const value = card.kind === "style"
    ? card.structuralFeatures[0] ?? card.spatialFeatures[0] ?? card.visualClues[0] ?? card.summary
    : card.kind === "movement"
      ? card.principles[0] ?? card.results[0] ?? card.socialBackground[0] ?? card.summary
      : card.kind === "architect"
        ? card.designPrinciples[0] ?? card.recurringFeatures[0] ?? card.lifeSummary
        : card.structuralFeatures[0] ?? card.spatialFeatures[0] ?? card.evolution[0] ?? card.summary;
  return { ja: value.ja, zh: value.zh };
}

function relationDetail(source: HistoryLearningCard | undefined, target: HistoryLearningCard | undefined, relation: NetworkEdge["relation"]): RelationDetail | undefined {
  if (!source && !target) return undefined;
  const sourceFeature = source ? keyFeature(source) : undefined;
  const targetFeature = target ? keyFeature(target) : undefined;
  if (relation === "belongs" && target && targetFeature) return {
    ja: `代表建築として、このカードの確認点「${targetFeature.ja}」を建物で読む。`,
    zh: `作为代表建筑，用它来核对该卡片的要点：“${targetFeature.zh}”。`,
  };
  if (!source || !target || !sourceFeature || !targetFeature) return undefined;
  if (relation === "evolves") return {
    ja: `前段の要点は「${sourceFeature.ja}」。次段では「${targetFeature.ja}」へ重点が移る。`,
    zh: `前一阶段的要点是“${sourceFeature.zh}”；下一阶段的重点转为“${targetFeature.zh}”。`,
  };
  if (relation === "influences") return {
    ja: `影響源の考え方「${sourceFeature.ja}」を、影響先の「${targetFeature.ja}」と結んで読む。`,
    zh: `把影响源的要点“${sourceFeature.zh}”与影响对象的“${targetFeature.zh}”对应理解。`,
  };
  return {
    ja: `比較の軸：こちらの「${sourceFeature.ja}」と、相手の「${targetFeature.ja}」。`,
    zh: `比较轴：此处的“${sourceFeature.zh}”与对方的“${targetFeature.zh}”。`,
  };
}

export default function HistoryNetworkPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), "data/architecture-normalized-candidates.json"), "utf-8");
  const architecture = JSON.parse(raw) as { buildings: BuildingRow[] };
  const linkRaw = fs.readFileSync(path.join(process.cwd(), "data/building-learning-card-links.json"), "utf-8");
  const links = JSON.parse(linkRaw) as { buildings: BuildingLink[] };
  const linkByBuilding = new Map(links.buildings.map((row) => [row.buildingId, row.learningCardIds]));
  const cardById = new Map(HISTORY_LEARNING_CARDS.map((card) => [card.id, card]));

  const cardNodes: NetworkNode[] = HISTORY_LEARNING_CARDS.map((card) => ({
    id: card.id,
    kind: card.kind,
    labelJa: card.name.ja,
    labelZh: card.name.zh,
    summaryJa: card.summary.ja,
    summaryZh: card.summary.zh,
    regions: card.regions,
    period: card.period.ja,
    periodZh: card.period.zh,
    examCount: card.examEvidence.length,
    href: `/history#${card.id}`,
  }));
  // The learning-card page already carries styles, movements, architects and
  // types. The separate topic data adds the missing cross-cutting strands:
  // theory and preservation institutions.
  const topicNodes: NetworkNode[] = HISTORY_TOPICS
    .filter((topic) => topic.kind === "theory" || topic.kind === "institution")
    .map((topic) => ({
      id: topic.id,
      kind: topic.kind,
      labelJa: topic.name.ja,
      labelZh: topic.name.zh,
      summaryJa: topic.summary.ja,
      summaryZh: topic.summary.zh,
      regions: topic.regions,
      period: topic.period.label.ja,
      periodZh: topic.period.label.zh,
      examCount: topic.examEvidence.length,
      priority: topic.status === "core" ? "A" : "normal",
      href: "/architecture-history-knowledge-map",
    }));

  // The first screen intentionally shows only the buildings that carry exam or
  // core-learning weight; the client can expand to every linked building later.
  const buildingNodes: NetworkNode[] = architecture.buildings
    .filter((building) => building.importance.examFrequency > 0 || building.isCoreBuilding || building.priorityLevel === "S" || building.priorityLevel === "A")
    .map((building) => ({
      id: building.id,
      kind: "building",
      labelJa: building.name.ja,
      labelZh: building.name.zh,
      summaryJa: "過去問・重点建築",
      summaryZh: "真题或重点建筑",
      regions: building.regions,
      period: building.period.ja,
      periodZh: building.period.zh,
      examCount: building.importance.examFrequency,
      priority: building.priorityLevel ?? "normal",
      href: `/history/buildings/${building.id}`,
    }));
  const visibleBuildingIds = new Set(buildingNodes.map((node) => node.id));
  const knowledgeNodeIds = new Set([...cardNodes, ...topicNodes].map((node) => node.id));

  const edges = new Map<string, NetworkEdge>();
  const addEdge = (source: string, target: string, relation: NetworkEdge["relation"], labelJa: string, labelZh: string) => {
    if (source === target || !knowledgeNodeIds.has(source) && !visibleBuildingIds.has(source) || !knowledgeNodeIds.has(target) && !visibleBuildingIds.has(target)) return;
    const detail = relationDetail(cardById.get(source), cardById.get(target), relation);
    // `related` is undirected. Canonicalize both endpoints so reciprocal card
    // declarations produce one visual edge and one relation card.
    const [edgeSource, edgeTarget] = relation === "related" && source > target ? [target, source] : [source, target];
    const id = edgeKey(edgeSource, edgeTarget, relation);
    edges.set(id, { id, source: edgeSource, target: edgeTarget, relation, labelJa, labelZh, detailJa: detail?.ja, detailZh: detail?.zh });
  };

  for (const card of HISTORY_LEARNING_CARDS) {
    for (const related of card.relatedCardIds) addEdge(card.id, related, "related", "関連", "相关");
    if ("predecessorCardIds" in card) for (const previous of card.predecessorCardIds) addEdge(previous, card.id, "evolves", "継承・変化", "演变");
    if ("successorCardIds" in card) for (const next of card.successorCardIds) addEdge(card.id, next, "evolves", "継承・変化", "演变");
    if ("influencedByIds" in card) for (const source of card.influencedByIds) addEdge(source, card.id, "influences", "影響", "影响");
    if ("influencedIds" in card) for (const target of card.influencedIds) addEdge(card.id, target, "influences", "影響", "影响");
  }
  for (const topic of HISTORY_TOPICS) {
    if (topic.kind !== "theory" && topic.kind !== "institution") continue;
    for (const related of topic.relatedTopicIds) addEdge(topic.id, related, "related", "関連", "相关");
  }
  for (const building of buildingNodes) {
    for (const cardId of linkByBuilding.get(building.id) ?? []) addEdge(building.id, cardId, "belongs", "代表・所属", "代表／归属");
  }

  // "Related" is a weak comparison link.  When the same two nodes already
  // have a stronger, directional historical relation, showing both creates
  // duplicate cards and makes the map look less certain than the data is.
  const allEdges = [...edges.values()];
  const edgesWithoutRedundantRelated = allEdges.filter((edge) => {
    if (edge.relation !== "related") return true;
    return !allEdges.some((other) => other.relation !== "related"
      && ((other.source === edge.source && other.target === edge.target)
        || (other.source === edge.target && other.target === edge.source)));
  });

  return <HistoryNetworkClient nodes={[...cardNodes, ...topicNodes, ...buildingNodes]} edges={edgesWithoutRedundantRelated} />;
}
