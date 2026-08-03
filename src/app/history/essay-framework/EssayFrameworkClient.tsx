"use client";

import FrameworkLearningClient from "./FrameworkLearningClient";
import type { RecallProfile } from "../../architecture-cards/RecallPractice";

export default function EssayFrameworkClient({ recallProfiles }: { recallProfiles: RecallProfile[] }) {
  return <FrameworkLearningClient mode="home" recallProfiles={recallProfiles} />;
}
