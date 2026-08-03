import fs from "fs";
import path from "path";
import ImageConfirmationClient from "./ImageConfirmationClient";

interface ImageAsset {
  id: string; fileName: string; webPath: string | null;
  entityNames: string[]; period: string; style: string; people: string;
  originalName: string; imageRole: string; humanConfirmed: boolean;
}

export default function ImageConfirmationPage() {
  const assetsPath = path.join(process.cwd(), "data/image-assets.json");
  let assets: ImageAsset[] = [];
  if (fs.existsSync(assetsPath)) {
    const raw = JSON.parse(fs.readFileSync(assetsPath, "utf-8"));
    assets = (raw.assets ?? []).filter((a: ImageAsset) =>
      a.webPath && a.entityNames?.length && a.period && a.style && a.people
    );
  }

  const confirmed = assets.filter((a) => a.humanConfirmed).length;

  return <ImageConfirmationClient assets={assets} confirmed={confirmed} />;
}
