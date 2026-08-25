import type { Reward } from "../types";

export const DEFAULT_REWARDS: Reward[] = [
  { id: "bisou", label: "Un gros bisou", rarity: "commune", enabled: true },
  { id: "calin", label: "Un gros câlin", rarity: "commune", enabled: true },
  { id: "histoire", label: "Choisir l’histoire du soir", rarity: "commune", enabled: true },
  { id: "chanson", label: "Choisir une chanson", rarity: "commune", enabled: false },
  { id: "jeu", label: "Choisir le jeu en famille", rarity: "commune", enabled: true },
  { id: "dessin", label: "Faire un dessin ensemble", rarity: "commune", enabled: false },
  { id: "dessert", label: "Choisir le dessert", rarity: "peu_commune", enabled: true },
  { id: "dessin-anime", label: "5 minutes de dessin animé", rarity: "peu_commune", enabled: true },
  { id: "bonbon", label: "Un petit bonbon", rarity: "peu_commune", enabled: false },
  { id: "parc", label: "Choisir le jeu au parc", rarity: "peu_commune", enabled: false },
  { id: "veille", label: "Se coucher 10 minutes plus tard", rarity: "rare", enabled: false },
  { id: "console-5", label: "5 minutes de console", rarity: "rare", enabled: true },
  { id: "activite", label: "Choisir l’activité du week-end", rarity: "rare", enabled: true },
  { id: "console-10", label: "10 minutes de console", rarity: "rare", enabled: false },
  { id: "surprise", label: "Une petite surprise", rarity: "rare", enabled: false },
];

const WEIGHTS = { commune: 6, peu_commune: 3, rare: 1 } as const;

export function drawReward(rewards: Reward[]) {
  const enabled = rewards.filter((reward) => reward.enabled);
  if (!enabled.length) return null;
  const weighted = enabled.flatMap((reward) => Array.from({ length: WEIGHTS[reward.rarity] }, () => reward));
  return weighted[Math.floor(Math.random() * weighted.length)];
}
