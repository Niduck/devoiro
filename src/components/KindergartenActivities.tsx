import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { normalize } from "../lib/reading";
import type { Profile } from "../types";
import { BackButton } from "./Shell";
import { DevoirosAvatar } from "./DevoirosAvatar";
import activityColors from "../assets/illustrations/devoiros/activity-couleurs.svg";
import activityShapes from "../assets/illustrations/devoiros/activity-formes.svg";
import activityLetterNames from "../assets/illustrations/devoiros/activity-nom-des-lettres.svg";
import activityAlphabetSong from "../assets/illustrations/devoiros/activity-chante-alphabet.svg";
import activityLetterSounds from "../assets/illustrations/devoiros/lettre-f.svg";

type ShapeName = "circle" | "square" | "triangle" | "rectangle" | "star" | "heart" | "oval" | "diamond";
type OralItem = { id: string; label: string; aliases: string[]; color?: string; shape?: ShapeName };
type OralKind = "colors" | "shapes" | "letter-name" | "letter-sound";

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

const SHAPES: OralItem[] = [
  { id: "rond", label: "rond", aliases: ["rond", "cercle"], shape: "circle" },
  { id: "carre", label: "carré", aliases: ["carré", "carre"], shape: "square" },
  { id: "triangle", label: "triangle", aliases: ["triangle"], shape: "triangle" },
  { id: "rectangle", label: "rectangle", aliases: ["rectangle"], shape: "rectangle" },
  { id: "etoile", label: "étoile", aliases: ["étoile", "etoile"], shape: "star" },
  { id: "coeur", label: "cœur", aliases: ["cœur", "coeur"], shape: "heart" },
  { id: "ovale", label: "ovale", aliases: ["ovale"], shape: "oval" },
  { id: "losange", label: "losange", aliases: ["losange"], shape: "diamond" },
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

function ShapeTarget({ shape }: { shape: ShapeName }) {
  const common = { fill: "#facc15", stroke: "#172554", strokeWidth: 6, strokeLinejoin: "round" as const };
  return <svg className="shape-target" viewBox="0 0 240 220" role="img" aria-label="Forme à reconnaître">
    {shape === "circle" && <circle cx="120" cy="110" r="76" {...common} />}
    {shape === "square" && <rect x="45" y="35" width="150" height="150" rx="5" {...common} />}
    {shape === "triangle" && <polygon points="120,25 210,190 30,190" {...common} />}
    {shape === "rectangle" && <rect x="25" y="60" width="190" height="110" rx="5" {...common} />}
    {shape === "star" && <polygon points="120,20 142,79 205,82 155,121 171,183 120,148 69,183 85,121 35,82 98,79" {...common} />}
    {shape === "heart" && <path d="M120 190C88 160 37 129 37 79C37 48 58 29 85 29C102 29 115 39 120 53C125 39 138 29 155 29C182 29 203 48 203 79C203 129 152 160 120 190Z" {...common} />}
    {shape === "oval" && <ellipse cx="120" cy="110" rx="92" ry="62" {...common} />}
    {shape === "diamond" && <polygon points="120,20 210,110 120,200 30,110" {...common} />}
  </svg>;
}

export function KindergartenOralActivity({ profile, kind, onBack }: { profile: Profile; kind: OralKind; onBack(): void }) {
  const isColors = kind === "colors";
  const isShapes = kind === "shapes";
  const isSound = kind === "letter-sound";
  const items = useMemo(() => shuffled(isColors ? COLORS : isShapes ? SHAPES : isSound ? LETTER_SOUNDS : LETTERS).slice(0, isColors || isShapes ? 8 : 10), [isColors, isShapes, isSound]);
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

  // Le navigateur autorise plus sûrement le micro lorsque son démarrage est
  // directement lié au clic de l’adulte sur le bouton de lancement.
  const beginActivity = () => {
    startSpeech();
    setStarted(true);
  };

  useEffect(() => {
    if (finished) stopSpeech();
    return stopSpeech;
  }, [finished, stopSpeech]);

  const item = items[index];
  const title = isColors ? "Le jeu des couleurs" : isShapes ? "Le jeu des formes" : isSound ? "Le son des lettres" : "Le nom des lettres · Aléatoire";
  const instruction = isColors ? "Une couleur va apparaître. Dis son nom à voix haute." : isShapes ? "Une forme va apparaître. Dis son nom à voix haute." : isSound ? "Une lettre va apparaître. Dis le son qu’elle fait, par exemple N fait neu." : "Une lettre va apparaître. Dis son nom à voix haute.";
  const activityIllustration = isColors ? activityColors : isShapes ? activityShapes : isSound ? activityLetterSounds : activityLetterNames;

  if (!started) return <section className="page instruction-page"><BackButton onClick={onBack} /><div className="instruction-card"><img className="instruction-activity" src={activityIllustration} alt="" /><span className="eyebrow">Consigne pour l’adulte</span><h1>{title}</h1><div className="say-this"><small>Vous pouvez lire ceci à l’enfant :</small><p>« {instruction} Si le micro ne comprend pas, je pourrai valider pour toi. »</p></div>{isSound && <p className="sound-note">Certaines lettres peuvent produire plusieurs sons. Dans ce jeu, on commence par leur son le plus courant.</p>}<button className="primary-button wide" onClick={beginActivity}>On commence</button></div></section>;

  if (finished) return <section className="page kindergarten-finish"><DevoirosAvatar id={profile.devoiros} /><h1>Bravo {profile.name} !</h1><p>{score} bonne{score > 1 ? "s" : ""} réponse{score > 1 ? "s" : ""}.</p><button className="primary-button" onClick={onBack}>Retour aux activités</button></section>;

  return <section className="kindergarten-session"><header><button onClick={onBack}>✕</button><strong>{title}</strong><span>Score {score}/{items.length}</span></header><main><span className="kindergarten-level">{isColors ? "Dès la PS" : isShapes ? "PS · MS" : isSound ? "GS" : "MS · GS"}</span>{isColors ? <div className="color-target" style={{ background: item.color }} aria-label="Couleur à reconnaître" /> : isShapes && item.shape ? <ShapeTarget shape={item.shape} /> : <div className="letter-target">{item.label}</div>}<div className="listening-state"><span className="pulse-dot" />{speech.supported ? (speech.problem ? "Le micro a besoin d’être relancé" : "Je t’écoute…") : "Reconnaissance vocale indisponible"}</div>{speech.problem && <button className="secondary-button speech-retry" onClick={startSpeech}>Relancer le micro</button>}<button className="manual-button" onClick={next}>✓ Valider la réponse</button></main>{speech.heard && <div className="speech-toast"><small>J’ai entendu</small><strong>« {speech.heard} »</strong></div>}{celebration && <div className="celebration"><span>Bravo !</span><i>On continue</i></div>}</section>;
}

const ALPHABET_GROUPS = ["ABCDEFG", "HIJKLMNOP", "QRS", "TUV", "W", "X", "Y", "Z"];
const ALPHABET = ALPHABET_GROUPS.join("").split("");
const GROUP_ENDS = new Set([6, 15, 18, 21, 22, 23, 24]);
const SONG_SPEEDS = [
  { label: "Doucement", delay: 950 },
  { label: "Normal", delay: 700 },
  { label: "Rapide", delay: 520 },
];

export function AlphabetSongActivity({ profile, onBack }: { profile: Profile; onBack(): void }) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!playing) return;
    const pause = GROUP_ENDS.has(index) ? 1.55 : 1;
    const timer = window.setTimeout(() => {
      if (index >= ALPHABET.length - 1) {
        setPlaying(false);
        setCompleted(true);
        return;
      }
      setIndex((value) => value + 1);
    }, SONG_SPEEDS[speed].delay * pause);
    return () => window.clearTimeout(timer);
  }, [index, playing, speed]);

  const begin = () => {
    setIndex(0);
    setCompleted(false);
    setStarted(true);
    setPlaying(true);
  };

  if (!started) return <section className="page instruction-page"><BackButton onClick={onBack} /><div className="instruction-card"><img className="instruction-activity" src={activityAlphabetSong} alt="" /><span className="eyebrow">Consigne pour l’adulte</span><h1>L’alphabet en chanson</h1><div className="say-this"><small>Vous pouvez lire ceci à l’enfant :</small><p>« Chante l’alphabet. Regarde bien : Devoiro va te montrer chaque lettre au bon moment. »</p></div><div className="song-speed-picker" aria-label="Vitesse de l’alphabet">{SONG_SPEEDS.map((item, itemIndex) => <button className={speed === itemIndex ? "active" : ""} key={item.label} onClick={() => setSpeed(itemIndex)}>{item.label}</button>)}</div><button className="primary-button wide" onClick={begin}>On chante !</button></div></section>;

  return <section className="alphabet-song-session"><header><button onClick={onBack}>✕</button><strong>L’alphabet en chanson</strong><span>{index + 1}/26</span></header><main><span className="kindergarten-level">MS · GS</span><div className="song-current-letter" aria-live="polite">{ALPHABET[index]}</div><div className="alphabet-song-track">{ALPHABET_GROUPS.map((group, groupIndex) => <div className="alphabet-song-part" key={group}>{groupIndex > 0 && <span className="song-separator">{groupIndex === ALPHABET_GROUPS.length - 1 ? "et" : "—"}</span>}<div className="alphabet-song-group">{group.split("").map((letter) => {
    const letterIndex = ALPHABET.indexOf(letter);
    return <span className={letterIndex === index ? "current" : letterIndex < index ? "passed" : ""} key={letter}>{letter}</span>;
  })}</div></div>)}</div><div className="song-controls">{!completed && <button className="manual-button" onClick={() => setPlaying((value) => !value)}>{playing ? "❚❚ Pause" : "▶ Continuer"}</button>}<button className="secondary-button" onClick={begin}>↻ Recommencer</button></div>{completed && <div className="song-finish"><DevoirosAvatar id={profile.devoiros} /><div><strong>Bravo {profile.name} !</strong><span>Tu as chanté tout l’alphabet.</span></div></div>}</main></section>;
}
