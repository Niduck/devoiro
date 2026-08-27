import type { ActivityLevel, Profile } from "../types";
import { BackButton } from "./Shell";
import activityColors from "../assets/illustrations/devoiros/activity-couleurs.svg";
import activityWriting from "../assets/illustrations/devoiros/activity-ecriture.svg";
import activityGraphism from "../assets/illustrations/devoiros/activity-graphisme.svg";
import activityReading from "../assets/illustrations/devoiros/activity-lecture.svg";
import activityShapes from "../assets/illustrations/devoiros/activity-formes.svg";
import activityLetterNames from "../assets/illustrations/devoiros/activity-nom-des-lettres.svg";
import activityAlphabetSong from "../assets/illustrations/devoiros/activity-chante-alphabet.svg";
import activityLetterSounds from "../assets/illustrations/devoiros/lettre-f.svg";
import { DevoirosAvatar } from "./DevoirosAvatar";

const LEVELS: { id: ActivityLevel; label: string }[] = [
  { id: "ps", label: "PS" },
  { id: "ms", label: "MS" },
  { id: "gs", label: "GS" },
  { id: "cp", label: "CP" },
  { id: "ce1", label: "CE1" },
];

type ActivityId = "colors" | "shapes" | "letterNames" | "alphabetSong" | "letterSounds" | "reading";

const ONLINE_ACTIVITIES: Array<{
  id: ActivityId;
  className: string;
  title: string;
  description: string;
  levels: ActivityLevel[];
  image: string;
}> = [
  { id: "colors", className: "colors", title: "Découverte des couleurs", description: "Voir une couleur et dire son nom.", levels: ["ps", "ms"], image: activityColors },
  { id: "shapes", className: "shapes", title: "Découverte des formes", description: "Voir une forme simple et dire son nom.", levels: ["ps", "ms"], image: activityShapes },
  { id: "letterNames", className: "alphabet", title: "Nom des lettres · Aléatoire", description: "Reconnaître les lettres dans le désordre.", levels: ["ms", "gs"], image: activityLetterNames },
  { id: "alphabetSong", className: "alphabet-song", title: "Alphabet en chanson", description: "Suivre les lettres dans l’ordre en chantant.", levels: ["ms", "gs"], image: activityAlphabetSong },
  { id: "letterSounds", className: "sounds", title: "Son des lettres", description: "Dire le son produit par chaque lettre.", levels: ["gs"], image: activityLetterSounds },
  { id: "reading", className: "reading", title: "Lecture à voix haute", description: "Lire des mots et des phrases avec le micro.", levels: ["cp", "ce1"], image: activityReading },
];

function LevelTabs({ value, onChange }: { value: ActivityLevel; onChange(level: ActivityLevel): void }) {
  return <div className="activity-level-tabs" role="tablist" aria-label="Filtrer par niveau">
    {LEVELS.map((level) => <button role="tab" aria-selected={value === level.id} className={value === level.id ? "active" : ""} key={level.id} onClick={() => onChange(level.id)}>{level.label}</button>)}
  </div>;
}

export function WorkspaceHome({ onActivities, onWorksheets }: { onActivities(): void; onWorksheets(): void }) {
  return <section className="page workspace-home">
    <div className="page-heading"><span className="eyebrow">Que voulez-vous préparer ?</span><h1>Bienvenue dans Devoiro</h1><p>Choisissez une activité à faire à l’écran ou composez une fiche à imprimer.</p></div>
    <div className="workspace-mode-grid">
      <button className="workspace-mode-card online" onClick={onActivities}><img src={activityReading} alt="" /><div><small>Jouer et apprendre</small><strong>Activités en ligne</strong><p>Lecture, lettres, couleurs et formes, directement dans le navigateur.</p><b>Voir les activités →</b></div></button>
      <button className="workspace-mode-card print" onClick={onWorksheets}><img src={activityWriting} alt="" /><div><small>Composer et imprimer</small><strong>Créer une fiche d’activité</strong><p>Mélangez écriture et graphisme sur une ou plusieurs pages A4.</p><b>Créer une fiche →</b></div></button>
    </div>
  </section>;
}

export function ActivityScreen({ level, onLevelChange, onBack, onReading, onColors, onShapes, onLetterNames, onAlphabetSong, onLetterSounds }: {
  level: ActivityLevel;
  onLevelChange(level: ActivityLevel): void;
  onBack(): void;
  onReading(): void;
  onColors(): void;
  onShapes(): void;
  onLetterNames(): void;
  onAlphabetSong(): void;
  onLetterSounds(): void;
}) {
  const actions: Record<ActivityId, () => void> = { reading: onReading, colors: onColors, shapes: onShapes, letterNames: onLetterNames, alphabetSong: onAlphabetSong, letterSounds: onLetterSounds };
  const activities = ONLINE_ACTIVITIES.filter((activity) => activity.levels.includes(level));
  return <section className="page activity-page"><BackButton onClick={onBack} />
    <div className="page-heading compact"><span className="eyebrow">Activités en ligne</span><h1>Choisissez une activité</h1><p>Le niveau sert à afficher uniquement les activités adaptées.</p></div>
    <LevelTabs value={level} onChange={onLevelChange} />
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

export function ReadingMenu({ profile, onBack, onPunctual, onDaily }: { profile: Profile; onBack(): void; onPunctual(): void; onDaily(): void }) {
  return <section className="page reading-menu"><BackButton onClick={onBack} />
    <div className="page-heading"><span className="eyebrow">Lecture</span><h1>Comment veut-on travailler ?</h1><p>Une petite partie libre ou une séance complète adaptée au niveau choisi.</p></div>
    <div className="mode-grid"><button className="mode-card" onClick={onPunctual}><span className="mode-symbol">01</span><div><strong>Travail ponctuel</strong><small>Chronométré ou sans chrono, c’est vous qui choisissez.</small></div><b>Configurer →</b></button><button className="mode-card featured" onClick={onDaily}><DevoirosAvatar id={profile.devoiros} className="mode-devoiros" /><div><strong>Travail quotidien</strong><small>Un parcours de plusieurs exercices et un cadeau à la fin.</small></div><b>Commencer →</b></button></div>
  </section>;
}
