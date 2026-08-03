import HistoryMWBClient from "./HistoryMWBClient";
import { getEligibleHistoryImageWordBankFacts } from "@/lib/history-image-wordbank-eligibility";

export default function Page() {
  return <HistoryMWBClient facts={getEligibleHistoryImageWordBankFacts()} />;
}
