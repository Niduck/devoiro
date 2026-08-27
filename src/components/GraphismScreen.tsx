import type { Profile } from "../types";
import { WorksheetComposer } from "./WorksheetComposer";

export function GraphismScreen({ profile, onBack }: { profile: Profile; onBack(): void }) {
  return <WorksheetComposer profile={profile} onBack={onBack} mode="graphism" />;
}
