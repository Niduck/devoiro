import { useState } from "react";
import { READING_LEVELS } from "../data/curriculum";
import type { DailyJourneyStep, Profile, ReadingAids, ReadingLevel } from "../types";
import { BackButton } from "./Shell";
import { DevoirosAvatar } from "./DevoirosAvatar";

export function AidControls({ aids, onChange }: { aids: ReadingAids; onChange(aids: ReadingAids): void }) {
  return <div className="aid-controls">
    <div><strong>Aides à la lecture</strong><small>À activer si l’enfant en a besoin.</small></div>
    <label className="switch-row"><span><b>Découper les syllabes</b><small>Le mot entier reste affiché dessous.</small></span><input type="checkbox" checked={aids.syllables} onChange={(event) => onChange({ ...aids, syllables: event.target.checked })} /></label>
    <label className="switch-row"><span><b>Colorer les sons complexes</b><small>ou, ai, eu, eau, ch…</small></span><input type="checkbox" checked={aids.complexSounds} onChange={(event) => onChange({ ...aids, complexSounds: event.target.checked })} /></label>
    <label className="font-row"><span><b>Police de lecture</b><small>Choisir la forme la plus familière.</small></span><select value={aids.font} onChange={(event) => onChange({ ...aids, font: event.target.value as ReadingAids["font"] })}><option value="nunito">Nunito</option><option value="outfit">Outfit</option><option value="quicksand">Quicksand</option><option value="marelle-baton">Marelle Bâton · officielle</option><option value="marelle">Marelle cursive · officielle</option></select></label>
  </div>;
}

export function PunctualSetup({ aids, onAidsChange, onBack, onStart }: { aids: ReadingAids; onAidsChange(aids: ReadingAids): void; onBack(): void; onStart(level: ReadingLevel, timed: boolean): void }) {
  return <PunctualSetupForm aids={aids} onAidsChange={onAidsChange} onBack={onBack} onStart={onStart} />;
}

function PunctualSetupForm({ aids, onAidsChange, onBack, onStart }: { aids: ReadingAids; onAidsChange(aids: ReadingAids): void; onBack(): void; onStart(level: ReadingLevel, timed: boolean): void }) {
  const [level, setLevel] = useState<ReadingLevel>("facile");
  const [timed, setTimed] = useState(true);
  return <section className="page setup-page"><BackButton onClick={onBack} />
    <div className="page-heading compact"><span className="eyebrow">Travail ponctuel</span><h1>Préparer la partie</h1><p>Choisissez librement le contenu et le rythme.</p></div>
    <div className="setup-layout"><div className="setup-main">
      <div className="form-card"><div className="field"><span>Niveau de lecture</span><div className="level-list">{READING_LEVELS.map((item) => <button key={item.id} className={level === item.id ? "level-choice selected" : "level-choice"} onClick={() => setLevel(item.id)}><span>{item.icon}</span><div><strong>{item.title}</strong><small>{item.detail}</small><em>Exemple : {item.example}</em></div><b>✓</b></button>)}</div></div></div>
      <div className="form-card"><div className="field"><span>Durée</span><div className="choice-grid two"><button className={timed ? "selected" : ""} onClick={() => setTimed(true)}><strong>1 minute</strong><small>Un défi court et dynamique</small></button><button className={!timed ? "selected" : ""} onClick={() => setTimed(false)}><strong>Sans chronomètre</strong><small>On s’arrête quand on veut</small></button></div></div></div>
    </div><aside><AidControls aids={aids} onChange={onAidsChange} /><button className="primary-button wide" onClick={() => onStart(level, timed)}>Voir la consigne →</button></aside></div>
  </section>;
}

export function DailyOverview({ profile, steps, onBack, onStart }: { profile: Profile; steps: DailyJourneyStep[]; onBack(): void; onStart(): void }) {
  const enabledRewards = profile.rewards.filter((reward) => reward.enabled).length;
  return <section className="page daily-overview"><BackButton onClick={onBack} />
    <div className="daily-hero"><div><span className="eyebrow">Travail quotidien</span><h1>La grande promenade</h1><p>{steps.length} petites étapes, une progression visible et un cadeau à ouvrir au bout du chemin.</p></div><DevoirosAvatar id={profile.devoiros} className="hero-devoiros" /></div>
    <div className="journey-preview"><div className="journey-line" />{steps.map((step, index) => <div className="journey-stop" key={step.title}><span>{index + 1}</span><strong>{step.title}</strong><small>{step.instruction}</small></div>)}<div className="journey-stop gift"><span className="gift-mark" aria-hidden="true" /><strong>Cadeau</strong><small>Une surprise aléatoire</small></div></div>
    <div className="daily-note"><span className="gift-mark" aria-hidden="true" /><p><strong>{enabledRewards} récompenses sont prêtes.</strong><br />Le cadeau sera choisi selon leur rareté après toutes les étapes.</p></div>
    <button className="primary-button daily-start" onClick={onStart}>Commencer le parcours →</button>
  </section>;
}
