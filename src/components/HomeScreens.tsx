import type { Profile } from "../types";
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

export function ActivityScreen({ profile, onBack, onReading, onWriting, onColors, onShapes, onLetterNames, onAlphabetSong, onLetterSounds, onGraphism, onSettings }: { profile: Profile; onBack(): void; onReading(): void; onWriting(): void; onColors(): void; onShapes(): void; onLetterNames(): void; onAlphabetSong(): void; onLetterSounds(): void; onGraphism(): void; onSettings(): void }) {
  const kindergarten = profile.schoolLevel === "maternelle";
  return <section className="page activity-page"><BackButton onClick={onBack} label="Changer de profil" />
    <div className="welcome-bar"><div className="welcome-line"><DevoirosAvatar id={profile.devoiros} /><div><small>Bonjour</small><strong>{profile.name}</strong></div></div><button className="profile-settings-button" onClick={onSettings}>Récompenses</button></div>
    <div className="page-heading"><span className="eyebrow">Que fait-on aujourd’hui ?</span><h1>Choisis une activité</h1></div>
    {kindergarten ? <div className="activity-grid kindergarten-activity-grid">
      <button className="activity-card colors" onClick={onColors}><img className="activity-illustration" src={activityColors} alt="" loading="lazy" decoding="async" /><div><em>Dès la PS</em><strong>Découverte des couleurs</strong><small>Voir une couleur et dire son nom.</small></div><b>→</b></button>
      <button className="activity-card shapes" onClick={onShapes}><img className="activity-illustration" src={activityShapes} alt="" loading="lazy" decoding="async" /><div><em>PS · MS</em><strong>Découverte des formes</strong><small>Voir une forme simple et dire son nom.</small></div><b>→</b></button>
      <button className="activity-card alphabet" onClick={onLetterNames}><img className="activity-illustration" src={activityLetterNames} alt="" loading="lazy" decoding="async" /><div><em>MS · GS</em><strong>Nom des lettres · Aléatoire</strong><small>Reconnaître les lettres dans le désordre.</small></div><b>→</b></button>
      <button className="activity-card alphabet-song" onClick={onAlphabetSong}><img className="activity-illustration" src={activityAlphabetSong} alt="" loading="lazy" decoding="async" /><div><em>MS · GS</em><strong>Alphabet en chanson</strong><small>Suivre les lettres dans l’ordre en chantant.</small></div><b>→</b></button>
      <button className="activity-card sounds" onClick={onLetterSounds}><img className="activity-illustration" src={activityLetterSounds} alt="" loading="lazy" decoding="async" /><div><em>GS</em><strong>Son des lettres</strong><small>Dire le son produit par chaque lettre.</small></div><b>→</b></button>
      <button className="activity-card writing" onClick={onWriting}><img className="activity-illustration" src={activityWriting} alt="" loading="lazy" decoding="async" /><div><em>GS</em><strong>Alphabet · Écriture</strong><small>Repasser les lettres dans un grand quadrillage.</small></div><b>→</b></button>
      <button className="activity-card graphism" onClick={onGraphism}><img className="activity-illustration" src={activityGraphism} alt="" loading="lazy" decoding="async" /><div><em>PS · MS · GS</em><strong>Graphisme</strong><small>Créer une fiche de gestes en pointillés.</small></div><b>→</b></button>
    </div> : <div className="activity-grid"><button className="activity-card reading" onClick={onReading}><img className="activity-illustration" src={activityReading} alt="" loading="lazy" decoding="async" /><div><strong>Lecture</strong><small>Lire, parler et progresser</small></div><b>→</b></button><button className="activity-card writing" onClick={onWriting}><img className="activity-illustration" src={activityWriting} alt="" loading="lazy" decoding="async" /><div><strong>Écriture</strong><small>Créer une fiche Seyès personnalisée</small></div><b>→</b></button></div>}
  </section>;
}

export function ReadingMenu({ profile, onBack, onPunctual, onDaily }: { profile: Profile; onBack(): void; onPunctual(): void; onDaily(): void }) {
  return <section className="page reading-menu"><BackButton onClick={onBack} />
    <div className="page-heading"><span className="eyebrow">Lecture</span><h1>Comment veut-on travailler ?</h1><p>Une petite partie libre ou une séance complète adaptée à {profile.name}.</p></div>
    <div className="mode-grid"><button className="mode-card" onClick={onPunctual}><span className="mode-symbol">01</span><div><strong>Travail ponctuel</strong><small>Chronométré ou sans chrono, c’est vous qui choisissez.</small></div><b>Configurer →</b></button><button className="mode-card featured" onClick={onDaily}><DevoirosAvatar id={profile.devoiros} className="mode-devoiros" /><div><strong>Travail quotidien</strong><small>Un parcours de plusieurs exercices et un cadeau à la fin.</small></div><b>Commencer →</b></button></div>
  </section>;
}
