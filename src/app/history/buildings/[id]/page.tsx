import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import BuildingDetailClient from "./BuildingDetailClient";

interface BuildingData {
  id: string;
  name: { ja: string; zh: string };
  aliases: string[];
  period: { ja: string; zh: string };
  location: { ja: string; zh: string };
  regions: string[];
  typeIds: string[];
  styleIds: string[];
  movementIds: string[];
  architectIds: string[];
  structure: { ja: string; zh: string };
  space: { ja: string; zh: string };
  history: { ja: string; zh: string };
  imageIds: string[];
  examEvidence: {
    year: number;
    category: string;
    questionNumber: string;
    fileName: string;
    relation: string;
    confidence?: "confirmed" | "candidate";
  }[];
  reviewStatus: string;
  rawAnki?: { style?: string; people?: string };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/architecture-normalized-candidates.json"),
    "utf-8"
  );
  const data = JSON.parse(raw);
  return (data.buildings as BuildingData[]).map((b: BuildingData) => ({ id: b.id }));
}

export default async function BuildingDetailPage({ params }: PageProps) {
  const { id } = await params;

  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/architecture-normalized-candidates.json"),
    "utf-8"
  );
  const data = JSON.parse(raw);
  const building = (data.buildings as BuildingData[]).find((b) => b.id === id);

  if (!building) notFound();

  const linksRaw = fs.readFileSync(
    path.join(process.cwd(), "data/building-learning-card-links.json"),
    "utf-8"
  );
  const linksData = JSON.parse(linksRaw);
  const buildingLink = (linksData.buildings as { buildingId: string; learningCardIds: string[] }[]).find(
    (l) => l.buildingId === id
  );

  // Load image map
  const imgRaw = fs.readFileSync(
    path.join(process.cwd(), "data/building-image-map.json"),
    "utf-8"
  );
  const imgData = JSON.parse(imgRaw);
  const imageFiles: string[] = imgData[id]?.imageFiles ?? [];

  return (
    <BuildingDetailClient
      building={building}
      learningCardIds={buildingLink?.learningCardIds ?? []}
      imageFiles={imageFiles}
    />
  );
}
