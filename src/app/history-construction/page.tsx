import HistoryConstructionClient from "./HistoryConstructionClient";
import { HISTORY_CONSTRUCTION_THEMES } from "@/lib/history-construction-data";

export default function HistoryConstructionPage() {
  return <HistoryConstructionClient themes={HISTORY_CONSTRUCTION_THEMES} />;
}
