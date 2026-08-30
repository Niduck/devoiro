import { useState } from "react";
import type { ActivityLevel, Reward, SchoolPeriod } from "../types";
import { BackButton } from "./Shell";
import activityColors from "../assets/illustrations/devoiros/activity-couleurs.svg";
import activityWriting from "../assets/illustrations/devoiros/activity-ecriture.svg";
import activityGraphism from "../assets/illustrations/devoiros/activity-graphisme.svg";
import activityReading from "../assets/illustrations/devoiros/activity-lecture.svg";
import activityShapes from "../assets/illustrations/devoiros/activity-formes.svg";
import activityLetterNames from "../assets/illustrations/devoiros/activity-nom-des-lettres.svg";
import activityAlphabetSong from "../assets/illustrations/devoiros/activity-chante-alphabet.svg";
import activityLetterSounds from "../assets/illustrations/devoiros/lettre-f.svg";
import { RewardsModal } from "./RewardsModal";

const LEVELS: { id: ActivityLevel; label: string }[] = [
  { id: "ps", label: "PS" },
  { id: "ms", label: "MS" },
  { id: "gs", label: "GS" },
  { id: "cp", label: "CP" },
  { id: "ce1", label: "CE1" },
];

type ActivityId = "colors" | "shapes" | "letterNames" | "alphabetSong" | "letterSounds" | "decoding" | "encoding" | "reading";
type PeriodMode = "auto" | SchoolPeriod;

const PERIOD_LABELS: Record<SchoolPeriod, string> = { debut: "Début", milieu: "Milieu", fin: "Fin" };
const PERIOD_ORDER: Record<SchoolPeriod, number> = { debut: 0, milieu: 1, fin: 2 };

const ONLINE_ACTIVITIES: Array<{
  id: ActivityId;
  className: string;
  title: string;
  description: string;
  levels: ActivityLevel[];
  availableFrom?: Partial<Record<ActivityLevel, SchoolPeriod>>;
  image: string;
}> = [
  { id: "colors", className: "colors", title: "Découverte des couleurs", description: "Voir une couleur et dire son nom.", levels: ["ps", "ms"], image: activityColors },
  { id: "shapes", className: "shapes", title: "Découverte des formes", description: "Voir une forme simple et dire son nom.", levels: ["ps", "ms"], image: activityShapes },
  { id: "letterNames", className: "alphabet", title: "Nom des lettres · Aléatoire", description: "Reconnaître les lettres dans le désordre.", levels: ["ms", "gs"], availableFrom: { ms: "milieu", gs: "debut" }, image: activityLetterNames },
  { id: "alphabetSong", className: "alphabet-song", title: "Alphabet en chanson", description: "Découvrir et suivre les lettres dans l’ordre en chantant.", levels: ["ps", "ms", "gs"], image: activityAlphabetSong },
  { id: "letterSounds", className: "sounds", title: "Son des lettres", description: "Dire le son produit par chaque lettre.", levels: ["gs"], availableFrom: { gs: "milieu" }, image: activityLetterSounds },
  { id: "encoding", className: "encoding", title: "J’encode", description: "Écouter un son et retrouver comment il s’écrit.", levels: ["ms", "gs"], availableFrom: { ms: "milieu", gs: "debut" }, image: activityWriting },
  { id: "decoding", className: "decoding", title: "Je décode", description: "Assembler les sons pour lire des syllabes et des mots simples.", levels: ["ms", "gs"], availableFrom: { ms: "fin", gs: "debut" }, image: activityLetterSounds },
  { id: "reading", className: "reading", title: "Lecture à voix haute", description: "Lire des mots et des phrases avec le micro.", levels: ["cp", "ce1"], image: activityReading },
];

function LevelTabs({ value, onChange }: { value: ActivityLevel; onChange(level: ActivityLevel): void }) {
  return <div className="activity-level-tabs" role="tablist" aria-label="Filtrer par niveau">
    {LEVELS.map((level) => <button role="tab" aria-selected={value === level.id} className={value === level.id ? "active" : ""} key={level.id} onClick={() => onChange(level.id)}>{level.label}</button>)}
  </div>;
}

function PeriodTabs({ value, automaticPeriod, onChange }: { value: PeriodMode; automaticPeriod: SchoolPeriod; onChange(period: PeriodMode): void }) {
  const periods: Array<{ id: PeriodMode; label: string }> = [
    { id: "auto", label: `Auto · ${PERIOD_LABELS[automaticPeriod]}` },
    { id: "debut", label: "Début" },
    { id: "milieu", label: "Milieu" },
    { id: "fin", label: "Fin" },
  ];
  return <div className="period-selector"><span>Période de l’année</span><div className="activity-period-tabs" role="tablist" aria-label="Choisir la période de l’année">{periods.map((item) => <button role="tab" aria-selected={value === item.id} className={value === item.id ? "active" : ""} key={item.id} onClick={() => onChange(item.id)}>{item.label}</button>)}</div></div>;
}

export function WorkspaceHome({ rewards, onRewardsChange, onActivities, onWorksheets }: { rewards: Reward[]; onRewardsChange(rewards: Reward[]): void; onActivities(): void; onWorksheets(): void }) {
  const [showRewards, setShowRewards] = useState(false);
  const enabledRewards = rewards.filter((reward) => reward.enabled).length;

  return <section className="page workspace-home">
    <div className="page-heading"><span className="eyebrow">Que voulez-vous préparer ?</span><h1>Bienvenue dans Devoiro</h1><p>Choisissez une activité à faire à l’écran ou composez une fiche à imprimer.</p></div>
    <button className="workspace-rewards-button" type="button" onClick={() => setShowRewards(true)}><span className="gift-mark" aria-hidden="true" /><div><strong>Gérer les récompenses</strong><small>{enabledRewards ? `${enabledRewards} récompense${enabledRewards > 1 ? "s" : ""} active${enabledRewards > 1 ? "s" : ""}` : "Aucune récompense active"}</small></div><b>Configurer →</b></button>
    <div className="workspace-mode-grid">
      <button className="workspace-mode-card online" onClick={onActivities}><img src={activityReading} alt="" /><div><small>Jouer et apprendre</small><strong>Activités en ligne</strong><p>Lecture, lettres, couleurs et formes, directement dans le navigateur.</p><b>Voir les activités →</b></div></button>
      <button className="workspace-mode-card print" onClick={onWorksheets}><img src={activityWriting} alt="" /><div><small>Composer et imprimer</small><strong>Créer une fiche d’activité</strong><p>Mélangez écriture et graphisme sur une ou plusieurs pages A4.</p><b>Créer une fiche →</b></div></button>
    </div>
    {showRewards && <RewardsModal rewards={rewards} onClose={() => setShowRewards(false)} onSave={(nextRewards) => { onRewardsChange(nextRewards); setShowRewards(false); }} />}
  </section>;
}

export function ActivityScreen({ level, period, periodMode, automaticPeriod, dailyStepCount, onLevelChange, onPeriodModeChange, onBack, onDaily, onReading, onColors, onShapes, onLetterNames, onAlphabetSong, onLetterSounds, onDecoding, onEncoding }: {
  level: ActivityLevel;
  period: SchoolPeriod;
  periodMode: PeriodMode;
  automaticPeriod: SchoolPeriod;
  dailyStepCount: number;
  onLevelChange(level: ActivityLevel): void;
  onPeriodModeChange(period: PeriodMode): void;
  onBack(): void;
  onDaily(): void;
  onReading(): void;
  onColors(): void;
  onShapes(): void;
  onLetterNames(): void;
  onAlphabetSong(): void;
  onLetterSounds(): void;
  onDecoding(): void;
  onEncoding(): void;
}) {
  const actions: Record<ActivityId, () => void> = { reading: onReading, colors: onColors, shapes: onShapes, letterNames: onLetterNames, alphabetSong: onAlphabetSong, letterSounds: onLetterSounds, decoding: onDecoding, encoding: onEncoding };
  const activities = ONLINE_ACTIVITIES.filter((activity) => {
    if (!activity.levels.includes(level)) return false;
    const availableFrom = activity.availableFrom?.[level] || "debut";
    return PERIOD_ORDER[period] >= PERIOD_ORDER[availableFrom];
  });
  return <section className="page activity-page"><BackButton onClick={onBack} />
    <div className="page-heading compact"><span className="eyebrow">Activités en ligne</span><h1>Choisissez une activité</h1><p>Le niveau sert à afficher uniquement les activités adaptées.</p></div>
    <PeriodTabs value={periodMode} automaticPeriod={automaticPeriod} onChange={onPeriodModeChange} />
    <LevelTabs value={level} onChange={onLevelChange} />
    <button className="daily-activity-button" onClick={onDaily}><span className="gift-mark" aria-hidden="true" /><div><small>{level.toUpperCase()} · Parcours guidé</small><strong>Faire le travail quotidien</strong><p>{dailyStepCount} étape{dailyStepCount > 1 ? "s" : ""} adaptée{dailyStepCount > 1 ? "s" : ""}, puis une récompense à ouvrir.</p></div><b>Commencer →</b></button>
    <div className="activity-grid kindergarten-activity-grid">{activities.map((activity) => <button className={`activity-card ${activity.className}`} onClick={actions[activity.id]} key={activity.id}><img className="activity-illustration" src={activity.image} alt="" loading="lazy" decoding="async" /><div><em>{activity.levels.map((item) => item.toUpperCase()).join(" · ")}</em><strong>{activity.title}</strong><small>{activity.description}</small></div><b>→</b></button>)}</div>
  </section>;
}

export function WorksheetCatalog({ onBack, onComposer, onAlphabet }: { onBack(): void; onComposer(): void; onAlphabet(): void }) {
  return <section className="page activity-page"><BackButton onClick={onBack} />
    <div className="page-heading compact"><span className="eyebrow">Fiches à imprimer</span><h1>Créer une fiche d’activité</h1><p>Composez librement une page ou préparez une fiche alphabet.</p></div>
    <div className="activity-grid worksheet-catalog-grid">
      <button className="activity-card graphism" onClick={onComposer}><img className="activity-illustration" src={activityGraphism} alt="" /><div><em>PS → CE1</em><strong>Fiche à composer</strong><small>Ajouter et mélanger des exercices d’écriture et de graphisme.</small></div><b>→</b></button>
      <button className="activity-card writing" onClick={onAlphabet}><img className="activity-illustration" src={activityWriting} alt="" /><div><em>GS</em><strong>Fiche alphabet</strong><small>Créer un grand quadrillage de lettres à repasser.</small></div><b>→</b></button>
    </div>
  </section>;
}

export function ReadingMenu({ onBack, onPunctual }: { onBack(): void; onPunctual(): void }) {
  return <section className="page reading-menu"><BackButton onClick={onBack} />
    <div className="page-heading"><span className="eyebrow">Lecture</span><h1>Préparer une petite partie</h1><p>Choisissez le niveau de lecture et décidez si vous voulez utiliser le chronomètre.</p></div>
    <div className="mode-grid single"><button className="mode-card" onClick={onPunctual}><span className="mode-symbol">01</span><div><strong>Travail ponctuel</strong><small>Chronométré ou sans chrono, c’est vous qui choisissez.</small></div><b>Configurer →</b></button></div>
  </section>;
}
