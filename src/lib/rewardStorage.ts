import { DEFAULT_REWARDS } from "../data/rewards";
import type { Reward } from "../types";

const REWARDS_KEY = "devoiro-rewards-v1";
const LEGACY_DATA_KEY = "lecturo-data-v1";
const RARITIES: Reward["rarity"][] = ["commune", "peu_commune", "rare"];

function isReward(value: unknown): value is Reward {
  if (!value || typeof value !== "object") return false;
  const reward = value as Partial<Reward>;
  return typeof reward.id === "string"
    && typeof reward.label === "string"
    && typeof reward.enabled === "boolean"
    && RARITIES.includes(reward.rarity as Reward["rarity"]);
}

function defaultRewards() {
  return DEFAULT_REWARDS.map((reward) => ({ ...reward }));
}

function mergeWithDefaults(saved: unknown): Reward[] | null {
  if (!Array.isArray(saved)) return null;
  const validRewards = saved.filter(isReward);
  const savedById = new Map(validRewards.map((reward) => [reward.id, reward]));
  const builtInRewards = DEFAULT_REWARDS.map((reward) => ({ ...reward, enabled: savedById.get(reward.id)?.enabled ?? reward.enabled }));
  const customRewards = validRewards.filter((reward) => reward.custom && !DEFAULT_REWARDS.some((item) => item.id === reward.id));
  return [...builtInRewards, ...customRewards];
}

export function loadRewards(): Reward[] {
  try {
    const currentRewards = mergeWithDefaults(JSON.parse(localStorage.getItem(REWARDS_KEY) || "null"));
    if (currentRewards) return currentRewards;

    // Récupère une éventuelle configuration créée avant la suppression des profils.
    const legacyData = JSON.parse(localStorage.getItem(LEGACY_DATA_KEY) || "null");
    const legacyProfile = legacyData?.profiles?.find((profile: { id?: string }) => profile.id === legacyData.selectedProfileId) || legacyData?.profiles?.[0];
    return mergeWithDefaults(legacyProfile?.rewards) || defaultRewards();
  } catch {
    return defaultRewards();
  }
}

export function saveRewards(rewards: Reward[]) {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}
