import { useState } from "react";
import type { Reward } from "../types";

const RARITY_LABELS = { commune: "Commune", peu_commune: "Peu commune", rare: "Rare" };

export function RewardPicker({ rewards, onChange }: { rewards: Reward[]; onChange(rewards: Reward[]): void }) {
  const [label, setLabel] = useState("");
  const [rarity, setRarity] = useState<Reward["rarity"]>("commune");
  const toggle = (id: string) => onChange(rewards.map((reward) => reward.id === id ? { ...reward, enabled: !reward.enabled } : reward));
  const add = () => {
    if (!label.trim()) return;
    onChange([...rewards, { id: `custom-${Date.now()}`, label: label.trim(), rarity, enabled: true, custom: true }]);
    setLabel("");
  };

  return <div className="reward-picker">
    <div className="section-heading"><div><strong>Récompenses possibles</strong><small>Activez les surprises qui vous conviennent.</small></div><span>{rewards.filter((reward) => reward.enabled).length} actives</span></div>
    <div className="reward-grid">
      {rewards.map((reward) => <button key={reward.id} className={reward.enabled ? "enabled" : ""} aria-pressed={reward.enabled} onClick={() => toggle(reward.id)} type="button">
        <span className={`reward-rarity-dot ${reward.rarity}`} aria-hidden="true" /><strong>{reward.label}</strong><small>{RARITY_LABELS[reward.rarity]}{reward.enabled ? " · Activée" : ""}</small>
      </button>)}
    </div>
    <div className="custom-reward">
      <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Ajouter une récompense…" maxLength={55} />
      <select value={rarity} onChange={(event) => setRarity(event.target.value as Reward["rarity"])}><option value="commune">Commune</option><option value="peu_commune">Peu commune</option><option value="rare">Rare</option></select>
      <button type="button" onClick={add}>Ajouter</button>
    </div>
  </div>;
}
