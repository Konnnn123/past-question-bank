import fs from "fs";
import path from "path";
import { getFactsByEntity } from "@/lib/atomic-fact-store";

export type HistoryImageWordBankFact = {
  id: string;
  subject: "history";
  reviewStatus: "approved";
  templateId: "history_image_multi_wordbank_matching";
  domain: "history_image";
  image: { assetId: string; webPath: string; exists: boolean };
  building: { term: string; factId: string };
  architect: { term: string; factId: string };
  style: { term: string; factId: string };
  source: { reviewRecord: string; assetSourceId: string };
};

type ImageAsset = {
  id: string;
  webPath: string | null;
  entityNames: string[];
  people: string;
  style: string;
  sourceId: string;
};

type HistoryReviewRecord = { nameJa: string; status: string };

const APPROVED_HISTORY_REVIEW_STATUSES = new Set(["corrected", "screened-no-hard-error-found"]);

export function getEligibleHistoryImageWordBankFacts(): HistoryImageWordBankFact[] {
  const root = process.cwd();
  const assets = JSON.parse(fs.readFileSync(path.join(root, "data", "image-assets.json"), "utf-8")).assets as ImageAsset[];
  const reviews = JSON.parse(fs.readFileSync(path.join(root, "data", "history-text-review-status.json"), "utf-8")).records as HistoryReviewRecord[];
  const reviewByName = new Map(reviews.map((record) => [record.nameJa, record]));

  return assets.flatMap((asset) => {
    const building = asset.entityNames?.[0];
    const review = building ? reviewByName.get(building) : undefined;
    if (!building || !asset.webPath || !asset.people || !asset.style || !review || !APPROVED_HISTORY_REVIEW_STATUSES.has(review.status)) return [];

    const sourceFacts = getFactsByEntity(building, "history");
    const architectFact = sourceFacts.find((fact) =>
      (fact.relation === "designed_by_architect" || fact.relation === "designed_by_office") && fact.value === asset.people,
    );
    const styleFact = sourceFacts.find((fact) => fact.relation === "has_architectural_style" && fact.value === asset.style);
    if (!architectFact || !styleFact) return [];

    return [{
      id: `history-image:${asset.id}`,
      subject: "history" as const,
      // Atomic-fact records remain unreviewed in their legacy field. The existing
      // History review registry is the approval authority for this image template.
      reviewStatus: "approved" as const,
      templateId: "history_image_multi_wordbank_matching" as const,
      domain: "history_image" as const,
      image: { assetId: asset.id, webPath: asset.webPath, exists: fs.existsSync(path.join(root, "public", asset.webPath)) },
      building: { term: building, factId: `entity:${building}` },
      architect: { term: architectFact.value, factId: architectFact.id },
      style: { term: styleFact.value, factId: styleFact.id },
      source: { reviewRecord: review.status, assetSourceId: asset.sourceId },
    }];
  });
}
