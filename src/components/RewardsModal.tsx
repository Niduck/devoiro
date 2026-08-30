import { useEffect, useState } from "react";
import type { Reward } from "../types";
import { RewardPicker } from "./RewardPicker";

type RewardsModalProps = {
  rewards: Reward[];
  onClose(): void;
  onSave(rewards: Reward[]): void;
};

export function RewardsModal({ rewards, onClose, onSave }: RewardsModalProps) {
  const [draft, setDraft] = useState(() => rewards.map((reward) => ({ ...reward })));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return <div className="rewards-modal-backdrop" onMouseDown={onClose}>
    <section className="rewards-modal" role="dialog" aria-modal="true" aria-labelledby="rewards-modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <header>
        <div><span>Pour les familles</span><h2 id="rewards-modal-title">Les récompenses de Devoiro</h2></div>
        <button type="button" onClick={onClose} aria-label="Fermer">✕</button>
      </header>

      <div className="rewards-explanation">
        <div className="gift-illustration" aria-hidden="true"><span className="gift-symbol" /></div>
        <div><h3>Quand sont-elles données ?</h3><p>Pour le moment, une récompense est tirée uniquement quand l’enfant termine toutes les étapes d’un travail quotidien de lecture. Elle n’est pas donnée après une activité ponctuelle ni après l’impression d’une fiche.</p></div>
      </div>

      <div className="rarity-explanation" aria-label="Fonctionnement des raretés">
        <article><i className="reward-rarity-dot commune" /><div><strong>Commune</strong><small>Revient souvent · poids 6</small></div></article>
        <article><i className="reward-rarity-dot peu_commune" /><div><strong>Peu commune</strong><small>Revient parfois · poids 3</small></div></article>
        <article><i className="reward-rarity-dot rare" /><div><strong>Rare</strong><small>Reste exceptionnelle · poids 1</small></div></article>
      </div>

      <p className="reward-parent-note">Vous choisissez ce qui convient à votre famille. Si aucune récompense n’est active, l’enfant reçoit simplement les encouragements de fin de séance.</p>
      <RewardPicker rewards={draft} onChange={setDraft} />

      <footer><button className="secondary-button" type="button" onClick={onClose}>Annuler</button><button className="primary-button" type="button" onClick={() => onSave(draft)}>Enregistrer les récompenses</button></footer>
    </section>
  </div>;
}
