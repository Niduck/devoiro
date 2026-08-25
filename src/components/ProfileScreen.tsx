import { useState } from "react";
import { DEFAULT_REWARDS } from "../data/rewards";
import type { DevoirosId, Profile, Reward, SchoolLevel, SchoolPeriod } from "../types";
import { RewardPicker } from "./RewardPicker";
import { DEVOIROS_OPTIONS, DevoirosAvatar } from "./DevoirosAvatar";

const LEVELS: Array<{ id: SchoolLevel; title: string; subtitle: string }> = [
  { id: "maternelle", title: "Maternelle", subtitle: "Découvertes, lettres et graphisme" },
  { id: "cp", title: "CP", subtitle: "Apprentissage de la lecture" },
  { id: "ce1", title: "CE1", subtitle: "Fluidité et compréhension" },
];
const PERIODS: Array<{ id: SchoolPeriod; title: string }> = [{ id: "debut", title: "Début d’année" }, { id: "milieu", title: "Milieu d’année" }, { id: "fin", title: "Fin d’année" }];

export function ProfileScreen({ profiles, onSelect, onSave }: { profiles: Profile[]; onSelect(profile: Profile): void; onSave(profile: Profile): void }) {
  const [creating, setCreating] = useState(profiles.length === 0);
  const [name, setName] = useState("");
  const [devoiros, setDevoiros] = useState<DevoirosId>("devoiros-1");
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>("cp");
  const [period, setPeriod] = useState<SchoolPeriod>("debut");
  const [rewards, setRewards] = useState<Reward[]>(() => DEFAULT_REWARDS.map((reward) => ({ ...reward })));
  const [showRewards, setShowRewards] = useState(false);

  if (!creating) return <section className="page profile-page">
    <div className="page-heading"><span className="eyebrow">Qui va lire aujourd’hui ?</span><h1>Choisis un profil</h1><p>Chaque enfant retrouve son niveau et sa progression.</p></div>
    <div className="profile-grid">{profiles.map((profile) => <button key={profile.id} className="profile-card" onClick={() => onSelect(profile)}><DevoirosAvatar id={profile.devoiros} /><strong>{profile.name}</strong><small>{profile.schoolLevel.toUpperCase()} · {profile.completedDailySessions} séance{profile.completedDailySessions > 1 ? "s" : ""}</small></button>)}</div>
    <button className="primary-button" onClick={() => setCreating(true)}>+ Nouveau profil</button>
  </section>;

  const submit = () => {
    onSave({ id: globalThis.crypto?.randomUUID?.() || `profile-${Date.now()}`, name: name.trim() || "Mon lecteur", devoiros, schoolLevel, period, rewards, completedDailySessions: 0 });
  };

  return <section className="page profile-form-page">
    {profiles.length > 0 && <button className="back-button" onClick={() => setCreating(false)}>← Profils</button>}
    <div className="page-heading compact"><span className="eyebrow">Nouveau lecteur</span><h1>Créons son profil</h1><p>Ces informations adaptent les exercices et les encouragements.</p></div>
    <div className="form-card">
      <label className="field"><span>Son prénom</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Léo" maxLength={22} /></label>
      <div className="field"><span>Son Devoiros</span><div className="devoiros-picker">{DEVOIROS_OPTIONS.map((option) => <button className={devoiros === option.id ? "selected" : ""} key={option.id} onClick={() => setDevoiros(option.id)} aria-label={`Choisir ${option.label}`}><DevoirosAvatar id={option.id} /></button>)}</div></div>
      <div className="field"><span>Sa classe</span><div className="choice-grid three">{LEVELS.map((level) => <button className={schoolLevel === level.id ? "selected" : ""} key={level.id} onClick={() => setSchoolLevel(level.id)}><strong>{level.title}</strong><small>{level.subtitle}</small></button>)}</div></div>
      {schoolLevel !== "maternelle" && <div className="field"><span>La période</span><div className="segmented">{PERIODS.map((item) => <button className={period === item.id ? "active" : ""} key={item.id} onClick={() => setPeriod(item.id)}>{item.title}</button>)}</div></div>}
      <button className="reward-toggle" onClick={() => setShowRewards((value) => !value)}>Récompenses de fin de séance <b>{showRewards ? "−" : "+"}</b></button>
      {showRewards && <RewardPicker rewards={rewards} onChange={setRewards} />}
      <button className="primary-button wide" onClick={submit}>Créer le profil <span>→</span></button>
    </div>
  </section>;
}

export function ProfileSettings({ profile, onBack, onSave }: { profile: Profile; onBack(): void; onSave(profile: Profile): void }) {
  const [rewards, setRewards] = useState<Reward[]>(() => profile.rewards.map((reward) => ({ ...reward })));
  return <section className="page profile-settings"><button className="back-button" onClick={onBack}>← Retour</button>
    <div className="page-heading compact"><span className="eyebrow">Profil de {profile.name}</span><h1>Choisir les récompenses</h1><p>Elles ne seront proposées qu’à la fin d’un travail quotidien complet.</p></div>
    <div className="form-card"><RewardPicker rewards={rewards} onChange={setRewards} /><button className="primary-button wide" onClick={() => onSave({ ...profile, rewards })}>Enregistrer les récompenses</button></div>
  </section>;
}
