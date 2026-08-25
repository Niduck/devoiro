import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { normalize } from "../lib/reading";
import type { Profile } from "../types";
import { BackButton } from "./Shell";
import { DevoirosAvatar } from "./DevoirosAvatar";
import activityColors from "../assets/illustrations/devoiros/activity-couleurs.svg";
import activityReading from "../assets/illustrations/devoiros/activity-lecture.svg";

type OralItem = { id: string; label: string; aliases: string[]; color?: string };
type OralKind = "colors" | "letter-name" | "letter-sound";

const COLORS: OralItem[] = [
  { id: "rouge", label: "rouge", aliases: ["rouge"], color: "#e64949" },
  { id: "bleu", label: "bleu", aliases: ["bleu", "bleue"], color: "#3478e5" },
  { id: "jaune", label: "jaune", aliases: ["jaune"], color: "#f3c62e" },
  { id: "vert", label: "vert", aliases: ["vert", "verte"], color: "#43a66f" },
  { id: "orange", label: "orange", aliases: ["orange"], color: "#ee8b35" },
  { id: "violet", label: "violet", aliases: ["violet", "violette", "mauve"], color: "#8b62c6" },
  { id: "rose", label: "rose", aliases: ["rose"], color: "#ef77a5" },
  { id: "marron", label: "marron", aliases: ["marron", "brun"], color: "#94603f" },
  { id: "noir", label: "noir", aliases: ["noir", "noire"], color: "#30343b" },
  { id: "blanc", label: "blanc", aliases: ["blanc", "blanche"], color: "#ffffff" },
];

const LETTER_NAMES: Record<string, string[]> = {
  A: ["a"], B: ["b", "bé"], C: ["c", "cé"], D: ["d", "dé"], E: ["e", "eu"], F: ["f", "effe"],
  G: ["g", "gé", "j'ai"], H: ["h", "ache"], I: ["i"], J: ["j", "ji", "gie"], K: ["k", "ka"],
  L: ["l", "elle"], M: ["m", "aime", "emme"], N: ["n", "haine", "enne"], O: ["o"], P: ["p", "pé"],
  Q: ["q", "cul", "ku"], R: ["r", "air", "erre"], S: ["s", "esse"], T: ["t", "té"], U: ["u"],
  V: ["v", "vé"], W: ["w", "double vé", "double v"], X: ["x", "ix"], Y: ["y", "i grec"], Z: ["z", "zède", "zed"],
};

const LETTERS: OralItem[] = Object.entries(LETTER_NAMES).map(([letter, aliases]) => ({ id: letter, label: letter, aliases }));

const LETTER_SOUNDS: OralItem[] = [
  { id: "A", label: "A", aliases: ["a"] },
  { id: "B", label: "B", aliases: ["beu", "be"] },
  { id: "C", label: "C", aliases: ["keu", "que", "seu"] },
  { id: "D", label: "D", aliases: ["deu", "de"] },
  { id: "E", label: "E", aliases: ["eu", "euh"] },
  { id: "F", label: "F", aliases: ["feu", "fe"] },
  { id: "G", label: "G", aliases: ["gueu", "gue", "jeu", "je"] },
  { id: "I", label: "I", aliases: ["i"] },
  { id: "J", label: "J", aliases: ["jeu", "je"] },
  { id: "K", label: "K", aliases: ["keu", "que"] },
  { id: "L", label: "L", aliases: ["leu", "le"] },
  { id: "M", label: "M", aliases: ["meu", "me"] },
  { id: "N", label: "N", aliases: ["neu", "ne"] },
  { id: "O", label: "O", aliases: ["o"] },
  { id: "P", label: "P", aliases: ["peu", "pe"] },
  { id: "Q", label: "Q", aliases: ["keu", "que"] },
  { id: "R", label: "R", aliases: ["reu", "re"] },
  { id: "S", label: "S", aliases: ["seu", "se"] },
  { id: "T", label: "T", aliases: ["teu", "te"] },
  { id: "U", label: "U", aliases: ["u"] },
  { id: "V", label: "V", aliases: ["veu", "ve"] },
  { id: "Z", label: "Z", aliases: ["zeu", "ze"] },
];

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function matches(item: OralItem, transcript: string, context: string) {
  const heard = normalize(`${context} ${transcript}`);
  return item.aliases.some((alias) => {
    const expected = normalize(alias);
    return heard === expected || heard.split(" ").includes(expected) || (expected.includes(" ") && heard.includes(expected));
  });
}

export function KindergartenOralActivity({ profile, kind, onBack }: { profile: Profile; kind: OralKind; onBack(): void }) {
  const isColors = kind === "colors";
  const isSound = kind === "letter-sound";
  const items = useMemo(() => shuffled(kind === "colors" ? COLORS : kind === "letter-sound" ? LETTER_SOUNDS : LETTERS).slice(0, kind === "colors" ? 8 : 10), [kind]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const [finished, setFinished] = useState(false);
  const itemRef = useRef(items[0]);
  const advancing = useRef(false);
  const resetRef = useRef<() => void>(() => undefined);

  const next = useCallback(() => {
    if (advancing.current || finished) return;
    advancing.current = true;
    setScore((value) => value + 1);
    setCelebration(true);
    window.setTimeout(() => {
      if (index + 1 >= items.length) { setFinished(true); setCelebration(false); return; }
      const nextIndex = index + 1;
      itemRef.current = items[nextIndex];
      setIndex(nextIndex);
      resetRef.current();
      setCelebration(false);
      advancing.current = false;
    }, 750);
  }, [finished, index, items]);

  const onSpeech = useCallback((transcript: string, context: string) => {
    if (matches(itemRef.current, transcript, context)) next();
  }, [next]);
  const speech = useSpeechRecognition(onSpeech);
  const { start: startSpeech, stop: stopSpeech, reset: resetSpeech } = speech;

  useEffect(() => { resetRef.current = resetSpeech; }, [resetSpeech]);

  useEffect(() => {
    if (!started || finished) { stopSpeech(); return; }
    startSpeech();
    return stopSpeech;
  }, [finished, startSpeech, stopSpeech, started]);

  const item = items[index];
  if (!started) return <section className="page instruction-page"><BackButton onClick={onBack} /><div className="instruction-card"><img className="instruction-activity" src={isColors ? activityColors : activityReading} alt="" /><span className="eyebrow">Consigne pour l’adulte</span><h1>{isColors ? "Le jeu des couleurs" : isSound ? "Le son des lettres" : "Le nom des lettres"}</h1><div className="say-this"><small>Vous pouvez lire ceci à l’enfant :</small><p>« {isColors ? "Une couleur va apparaître. Dis son nom à voix haute." : isSound ? "Une lettre va apparaître. Dis le son qu’elle fait, par exemple N fait neu." : "Une lettre va apparaître. Dis son nom à voix haute."} Si le micro ne comprend pas, je pourrai valider pour toi. »</p></div>{isSound && <p className="sound-note">Certaines lettres peuvent produire plusieurs sons. Dans ce jeu, on commence par leur son le plus courant.</p>}<button className="primary-button wide" onClick={() => setStarted(true)}>On commence</button></div></section>;

  if (finished) return <section className="page kindergarten-finish"><DevoirosAvatar id={profile.devoiros} /><h1>Bravo {profile.name} !</h1><p>{score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}.</p><button className="primary-button" onClick={onBack}>Retour aux activités</button></section>;

  return <section className="kindergarten-session"><header><button onClick={onBack}>✕</button><strong>{isColors ? "Les couleurs" : isSound ? "Le son des lettres" : "Le nom des lettres"}</strong><span>Score {score}/{items.length}</span></header><main><span className="kindergarten-level">{isColors ? "Dès la PS" : isSound ? "GS" : "MS · GS"}</span>{isColors ? <div className="color-target" style={{ background: item.color }} aria-label="Couleur à reconnaître" /> : <div className="letter-target">{item.label}</div>}<div className="listening-state"><span className="pulse-dot" />{speech.supported ? "Je t’écoute…" : "Reconnaissance vocale indisponible"}</div><button className="manual-button" onClick={next}>✓ Valider la réponse</button></main>{speech.heard && <div className="speech-toast"><small>J’ai entendu</small><strong>« {speech.heard} »</strong></div>}{celebration && <div className="celebration"><span>Bravo !</span><i>On continue</i></div>}</section>;
}
