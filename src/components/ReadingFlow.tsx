import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTENT, shuffleItems } from "../data/curriculum";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { fastThresholdMs, readPrefixCount, readingMatches } from "../lib/reading";
import type { DailyStep, Profile, ReadingAids, ReadingItem, ReadingLevel, Reward } from "../types";
import { AidControls } from "./ReadingSetup";
import { ReadingText } from "./ReadingText";
import { BackButton } from "./Shell";
import { DevoirosAvatar } from "./DevoirosAvatar";

export type SessionDefinition = {
  kind: "ponctuel" | "quotidien";
  level: ReadingLevel;
  timed: boolean;
  seconds?: number;
  target?: number;
  step?: DailyStep;
  stepIndex?: number;
  stepCount?: number;
};

export type SessionResult = { score: number; success: boolean; superCount: number };

export function ParentInstruction({ profile, session, onBack, onBegin }: { profile: Profile; session: SessionDefinition; onBack(): void; onBegin(): void }) {
  const daily = session.kind === "quotidien";
  return <section className="page instruction-page"><BackButton onClick={onBack} />
    {daily && <JourneyProgress profile={profile} current={session.stepIndex || 0} count={session.stepCount || 1} />}
    <div className="instruction-card"><DevoirosAvatar id={profile.devoiros} className="instruction-devoiros" /><span className="eyebrow">Consigne pour l’adulte</span><h1>{daily ? session.step?.title : "Une petite partie de lecture"}</h1>
      <div className="say-this"><small>Vous pouvez lire ceci à l’enfant :</small><p>« Un mot va apparaître. Lis-le à voix haute, tranquillement. Tu peux le découper puis le redire en entier. Si le micro ne comprend pas, je pourrai valider pour toi. »</p></div>
      <ul><li>Installez-vous dans un endroit assez calme.</li><li>Le micro et le chrono ne démarreront qu’après le bouton.</li>{daily && <li>Objectif : {session.target} réussite{(session.target || 0) > 1 ? "s" : ""} pour avancer.</li>}</ul>
      <button className="primary-button wide" onClick={onBegin}>On commence</button>
    </div>
  </section>;
}

export function JourneyProgress({ profile, current, count }: { profile: Profile; current: number; count: number }) {
  const progress = Math.min(100, Math.max(0, (current / count) * 100));
  return <div className="journey-progress"><div className="journey-track"><div style={{ width: `${progress}%` }} /><DevoirosAvatar id={profile.devoiros} className="moving-devoiros" style={{ left: `${progress}%` }} /><span className="finish-gift" aria-hidden="true" /></div><small>Étape {Math.min(current + 1, count)} sur {count}</small></div>;
}

export function ReadingSession({ profile, session, aids, onAidsChange, onExit, onComplete }: { profile: Profile; session: SessionDefinition; aids: ReadingAids; onAidsChange(aids: ReadingAids): void; onExit(): void; onComplete(result: SessionResult): void }) {
  const items = useMemo(() => shuffleItems(CONTENT[session.level]), [session.level]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [superCount, setSuperCount] = useState(0);
  const [remaining, setRemaining] = useState(session.seconds || 60);
  const [readWords, setReadWords] = useState(0);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const itemRef = useRef<ReadingItem>(items[0]);
  const startedAt = useRef(Date.now());
  const advancing = useRef(false);
  const finished = useRef(false);
  const scoreRef = useRef(0);
  const superRef = useRef(0);

  const finish = useCallback((nextScore = scoreRef.current, success = !session.target || nextScore >= session.target) => {
    if (finished.current) return;
    finished.current = true;
    stopRef.current?.();
    onComplete({ score: nextScore, success, superCount: superRef.current });
  }, [onComplete, session.target]);

  const next = useCallback((manual: boolean) => {
    if (advancing.current || finished.current) return;
    advancing.current = true;
    const elapsed = Date.now() - startedAt.current;
    const isSuper = !manual && elapsed <= fastThresholdMs(profile, itemRef.current);
    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);
    if (isSuper) { superRef.current += 1; setSuperCount(superRef.current); setCelebration("Super bravo !"); }
    else setCelebration(manual ? "Bravo, on continue !" : "Bravo !");
    window.setTimeout(() => {
      if (session.target && nextScore >= session.target) { finish(nextScore, true); return; }
      const nextIndex = (indexRef.current + 1) % items.length;
      indexRef.current = nextIndex;
      itemRef.current = items[nextIndex];
      setIndex(nextIndex); setReadWords(0); resetRef.current?.(); startedAt.current = Date.now(); advancing.current = false; setCelebration(null);
    }, isSuper ? 1100 : 800);
  }, [finish, items, profile, session.target]);

  const onSpeech = useCallback((transcript: string, context: string) => {
    const item = itemRef.current;
    if (item.kind === "phrase") {
      const recognized = readPrefixCount(item.text, context);
      setReadWords((current) => Math.max(current, recognized));
    }
    if (readingMatches(item.text, transcript, context)) next(false);
  }, [next]);

  const speech = useSpeechRecognition(onSpeech);
  const { start: startSpeech, stop: stopSpeech, reset: resetSpeech } = speech;
  const stopRef = useRef(speech.stop);
  const resetRef = useRef(speech.reset);
  const indexRef = useRef(0);
  stopRef.current = stopSpeech; resetRef.current = resetSpeech;

  useEffect(() => { startedAt.current = Date.now(); startSpeech(); return stopSpeech; }, [startSpeech, stopSpeech]);
  useEffect(() => {
    if (!session.timed) return;
    const timer = window.setInterval(() => setRemaining((value) => {
      if (value <= 1) { window.clearInterval(timer); window.setTimeout(() => finish(), 0); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [finish, session.timed]);

  const item = items[index];
  return <section className="session-page">
    <header className="session-header"><button onClick={onExit}>✕</button>{session.kind === "quotidien" ? <JourneyProgress profile={profile} current={session.stepIndex || 0} count={session.stepCount || 1} /> : <strong>Lecture libre</strong>}<div className="session-stats"><span>Score {score}</span>{session.timed && <span className={remaining <= 10 ? "urgent" : ""}>{remaining}s</span>}</div></header>
    <main className="reading-stage"><div className="level-chip">{session.level === "difficile" ? "Petite phrase" : "Lis à voix haute"}</div><ReadingText item={item} aids={aids} readWords={readWords} />
      {aids.syllables && item.kind === "phrase" && <small className="auto-aid-note">Le découpage en syllabes se désactive pour les phrases.</small>}
      <div className="listening-state"><span className="pulse-dot" />{speech.supported ? (speech.problem ? "Le micro a besoin d’être relancé" : "Je t’écoute…") : "Reconnaissance vocale indisponible"}</div>
      <button className="manual-button" onClick={() => next(true)}>✓ Valider ce mot</button>
      {!session.timed && <button className="finish-button" onClick={() => finish(scoreRef.current, true)}>Terminer la partie</button>}
    </main>
    <div className="session-help">
      {helpOpen && <aside className="session-help-menu"><button className="close-help" onClick={() => setHelpOpen(false)} aria-label="Fermer les aides">✕</button><AidControls aids={aids} onChange={onAidsChange} /></aside>}
      <button className="help-fab" aria-expanded={helpOpen} onClick={() => setHelpOpen((open) => !open)}>Aides{(aids.syllables || aids.complexSounds) && <i>•</i>}</button>
    </div>
    {speech.heard && <div className="speech-toast"><small>J’ai entendu</small><strong>« {speech.heard} »</strong></div>}
    {celebration && <div className={celebration.includes("Super") ? "celebration super" : "celebration"}><span>{celebration}</span><i>+1 étoile</i></div>}
    {superCount > 0 && <div className="super-counter">{superCount} super bravo</div>}
  </section>;
}

export function DailyStepResult({ profile, session, result, aids, onAidsChange, onRetry, onNext, onStop }: { profile: Profile; session: SessionDefinition; result: SessionResult; aids: ReadingAids; onAidsChange(aids: ReadingAids): void; onRetry(): void; onNext(): void; onStop(): void }) {
  return <section className="page result-page"><JourneyProgress profile={profile} current={(session.stepIndex || 0) + (result.success ? 1 : 0)} count={session.stepCount || 1} />
    <div className="result-card"><DevoirosAvatar id={profile.devoiros} className="result-devoiros" /><h1>{result.success ? "Étape réussie !" : "On réessaie tranquillement"}</h1><p>{result.score} lecture{result.score > 1 ? "s" : ""} validée{result.score > 1 ? "s" : ""}{result.superCount ? ` · ${result.superCount} super bravo` : ""}</p>
      {!result.success && <div className="parent-help"><strong>Conseil pour l’adulte</strong><p>Après une étape difficile, les aides à la lecture peuvent débloquer l’enfant sans donner la réponse.</p><AidControls aids={aids} onChange={onAidsChange} /></div>}
      <div className="result-actions">{!result.success && <button className="secondary-button" onClick={onRetry}>Réessayer avec ces aides</button>}<button className="primary-button" onClick={onNext}>{result.success ? "Étape suivante →" : "Continuer quand même →"}</button><button className="text-button" onClick={onStop}>Arrêter pour aujourd’hui</button></div>
    </div>
  </section>;
}

export function FinalReward({ profile, reward, totalScore, showGift, onDone }: { profile: Profile; reward: Reward | null; totalScore: number; showGift: boolean; onDone(): void }) {
  const [open, setOpen] = useState(false);
  return <section className="page final-page"><div className="confetti" aria-hidden="true"><i /><i /><i /></div><DevoirosAvatar id={profile.devoiros} className="final-devoiros" /><h1>{showGift ? "Parcours terminé !" : "Belle lecture !"}</h1><p>{profile.name} a validé {totalScore} lecture{totalScore > 1 ? "s" : ""} aujourd’hui.</p>
    {showGift && (!open ? <button className="gift-box" onClick={() => setOpen(true)}><span className="gift-symbol" aria-hidden="true"><i /></span><strong>Ouvrir mon cadeau</strong></button> : <div className="reward-reveal"><small>La récompense du jour</small><strong>{reward?.label || "Un grand bravo !"}</strong></div>)}
    {(!showGift || open) && <button className="primary-button" onClick={onDone}>Retour à l’accueil</button>}
  </section>;
}
