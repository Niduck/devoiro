import type { AppData, Profile } from "../types";

// Clé historique conservée pour ne pas perdre les profils existants lors du renommage.
const KEY = "lecturo-data-v1";
const EMPTY: AppData = { version: 1, profiles: [], selectedProfileId: null };

export function loadData(): AppData {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    if (parsed?.version === 1 && Array.isArray(parsed.profiles)) return parsed;
  } catch {
    // Une nouvelle sauvegarde sera créée.
  }
  return EMPTY;
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateProfile(data: AppData, profile: Profile): AppData {
  const exists = data.profiles.some((item) => item.id === profile.id);
  const profiles = exists ? data.profiles.map((item) => item.id === profile.id ? profile : item) : [...data.profiles, profile];
  const next = { ...data, profiles, selectedProfileId: profile.id };
  saveData(next);
  return next;
}
