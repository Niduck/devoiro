import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import activityLetters from "../assets/illustrations/devoiros/activity-nom-des-lettres.svg";
import activityWriting from "../assets/illustrations/devoiros/activity-ecriture.svg";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { normalize } from "../lib/reading";
import type { ActivityLevel, Profile, SchoolPeriod } from "../types";
import { BackButton } from "./Shell";
import { DevoirosAvatar } from "./DevoirosAvatar";

type DecodingItem = { text: string; aliases: string[] };
type EncodingItem = { spoken: string; answer: string; choices: string[] };

const SYLLABLES: DecodingItem[] = ["ma", "mi", "mo", "la", "li", "lu", "sa", "si", "fa", "fi", "va", "ri"].map((text) => ({ text, aliases: [text] }));
const TRANSPARENT_WORDS: DecodingItem[] = ["moto", "lama", "vélo", "salade", "farine", "domino", "pirate", "lavabo"].map((text) => ({ text, aliases: [text] }));

const MS_ENCODING: EncodingItem[] = [
  { spoken: "a", answer: "A", choices: ["A", "I", "O"] },
  { spoken: "i", answer: "I", choices: ["I", "A", "U"] },
  { spoken: "o", answer: "O", choices: ["O", "U", "A"] },
  { spoken: "ma", answer: "MA", choices: ["MA", "MI", "LA"] },
  { spoken: "la", answer: "LA", choices: ["LA", "LI", "MA"] },
  { spoken: "si", answer: "SI", choices: ["SI", "SA", "FI"] },
];

const GS_ENCODING: EncodingItem[] = [
  ...MS_ENCODING.slice(3),
  { spoken: "moto", answer: "MOTO", choices: ["MOTO", "MOTA", "LOTO"] },
  { spoken: "lama", answer: "LAMA", choices: ["LAMA", "LAMI", "RAMA"] },
  { spoken: "vélo", answer: "VÉLO", choices: ["VÉLO", "VÉLA", "FÉLO"] },
  { spoken: "domino", answer: "DOMINO", choices: ["DOMINO", "DAMINO", "TOMINO"] },
];

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function completedScreen(profile: Profile, score: number, onBack: () => void, onComplete?: (score: number) => void) {
  return <section className="page kindergarten-finish"><DevoirosAvatar id={profile.devoiros} /><h1>Bravo !</h1><p>{score} réponse{score > 1 ? "s" : ""} réussie{score > 1 ? "s" : ""}.</p><button className="primary-button" onClick={() => onComplete ? onComplete(score) : onBack()}>{onComplete ? "Étape suivante →" : "Retour aux activités"}</button></section>;
}

export function DecodingActivity({ profile, level, period, onBack, onComplete }: { profile: Profile; level: ActivityLevel; period: SchoolPeriod; onBack(): void; onComplete?(score: number): void }) {
  const items = useMemo(() => shuffled(level === "gs" && period !== "debut" ? [...SYLLABLES, ...TRANSPARENT_WORDS] : SYLLABLES).slice(0, 8), [level, period]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const itemRef = useRef(items[0]);
  const advancing = useRef(false);
  const speechResetRef = useRef<() => void>(() => undefined);

  const next = useCallback(() => {
    if (advancing.current || finished) return;
    advancing.current = true;
    setScore((value) => value + 1);
    setCelebration(true);
    window.setTimeout(() => {
      if (index >= items.length - 1) { setFinished(true); setCelebration(false); return; }
      const nextIndex = index + 1;
      itemRef.current = items[nextIndex];
      setIndex(nextIndex);
      speechResetRef.current();
      setCelebration(false);
      advancing.current = false;
    }, 750);
  }, [finished, index, items]);

  const onSpeech = useCallback((transcript: string, context: string) => {
    const heard = normalize(`${context} ${transcript}`).split(" ");
    if (itemRef.current.aliases.some((alias) => heard.includes(normalize(alias)))) next();
  }, [next]);
  const speech = useSpeechRecognition(onSpeech);
  const { start: startSpeech, stop: stopSpeech, reset: resetSpeech } = speech;

  useEffect(() => { speechResetRef.current = resetSpeech; }, [resetSpeech]);

  useEffect(() => {
    if (finished) stopSpeech();
    return stopSpeech;
  }, [finished, stopSpeech]);

  if (!started) return <section className="page instruction-page"><BackButton onClick={onBack} /><div className="instruction-card"><img className="instruction-activity" src={activityLetters} alt="" /><span className="eyebrow">Consigne pour l’adulte</span><h1>Je décode</h1><div className="say-this"><small>Vous pouvez lire ceci à l’enfant :</small><p>« Regarde les lettres, assemble leurs sons et lis ce qui est écrit. Tu peux recommencer doucement. »</p></div><p className="sound-note">En fin de MS, cette activité reste une découverte à proposer seulement si l’enfant est prêt.</p><button className="primary-button wide" onClick={() => { startSpeech(); setStarted(true); }}>On commence</button></div></section>;
  if (finished) return completedScreen(profile, score, onBack, onComplete);

  const useScript = level === "gs" && period !== "debut";
  const displayedText = useScript ? items[index].text.toLocaleLowerCase("fr-FR") : items[index].text.toLocaleUpperCase("fr-FR");
  return <section className="kindergarten-session phonics-session"><header><button onClick={onBack}>✕</button><strong>Je décode</strong><span>Score {score}/{items.length}</span></header><main><span className="kindergarten-level">{level.toUpperCase()} · {period === "debut" ? "début" : period === "milieu" ? "milieu" : "fin"} d’année · {useScript ? "script" : "capitales"}</span><div className={`decoding-target ${useScript ? "script" : "capitales"}`}>{displayedText}</div><div className="listening-state"><span className="pulse-dot" />{speech.supported ? (speech.problem ? "Le micro a besoin d’être relancé" : "Je t’écoute…") : "Reconnaissance vocale indisponible"}</div>{speech.problem && <button className="secondary-button speech-retry" onClick={startSpeech}>Relancer le micro</button>}<button className="manual-button" onClick={next}>✓ Valider la réponse</button></main>{speech.heard && <div className="speech-toast"><small>J’ai entendu</small><strong>« {speech.heard} »</strong></div>}{celebration && <div className="celebration"><span>Bravo !</span><i>On continue</i></div>}</section>;
}

export function EncodingActivity({ profile, level, period, onBack, onComplete }: { profile: Profile; level: ActivityLevel; period: SchoolPeriod; onBack(): void; onComplete?(score: number): void }) {
  const items = useMemo(() => shuffled(level === "gs" && period !== "debut" ? GS_ENCODING : MS_ENCODING), [level, period]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [message, setMessage] = useState("");
  const [celebration, setCelebration] = useState(false);
  const item = items[index];
  const choices = useMemo(() => shuffled(item.choices), [item]);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const frenchVoices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("fr"));
    const preferredVoice = frenchVoices.find((voice) => /premium|enhanced|google|audrey|thomas|amélie/i.test(voice.name)) || frenchVoices.find((voice) => voice.localService) || frenchVoices[0];
    utterance.lang = "fr-FR";
    utterance.voice = preferredVoice || null;
    utterance.rate = 0.72;
    utterance.pitch = 1.04;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (started && !finished) speak(item.spoken);
  }, [finished, index, item.spoken, speak, started]);

  const choose = (choice: string) => {
    if (choice !== item.answer) { setMessage("Presque ! Écoute encore et réessaie."); speak(item.spoken); return; }
    setMessage("");
    setScore((value) => value + 1);
    setCelebration(true);
    window.setTimeout(() => {
      if (index >= items.length - 1) { setFinished(true); setCelebration(false); return; }
      setIndex((value) => value + 1);
      setCelebration(false);
    }, 750);
  };

  if (!started) return <section className="page instruction-page"><BackButton onClick={onBack} /><div className="instruction-card"><img className="instruction-activity" src={activityWriting} alt="" /><span className="eyebrow">Consigne pour l’adulte</span><h1>J’encode</h1><div className="say-this"><small>Vous pouvez lire ceci à l’enfant :</small><p>« Écoute le son, puis choisis les lettres qui permettent de l’écrire. Tu peux le réécouter autant de fois que tu veux. »</p></div><button className="primary-button wide" onClick={() => setStarted(true)}>On commence</button></div></section>;
  if (finished) return completedScreen(profile, score, onBack, onComplete);

  return <section className="kindergarten-session phonics-session"><header><button onClick={onBack}>✕</button><strong>J’encode</strong><span>Score {score}/{items.length}</span></header><main><span className="kindergarten-level">{level.toUpperCase()}</span><button className="listen-phonics-button" onClick={() => speak(item.spoken)}><span aria-hidden="true">▶</span><strong>Écouter</strong></button><div className="encoding-choices">{choices.map((choice) => <button key={choice} onClick={() => choose(choice)}>{choice}</button>)}</div>{message && <p className="encoding-message">{message}</p>}</main>{celebration && <div className="celebration"><span>Bravo !</span><i>On continue</i></div>}</section>;
}
