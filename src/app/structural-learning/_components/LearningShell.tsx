import type { ReactNode } from "react";
import { SidebarLayout } from "@/components/layout";
import MechanicsSidebar from "./MechanicsSidebar";

export default function LearningShell({ children, locale = "zh" }: { children: ReactNode; locale?: "zh" | "ja" }) {
  return <SidebarLayout slot={<MechanicsSidebar locale={locale} />}>{children}</SidebarLayout>;
}
