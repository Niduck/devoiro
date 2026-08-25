import { useState, type CSSProperties, type ReactNode } from "react";
import type { Profile } from "../types";
import { BackButton } from "./Shell";

type SectionLevel = "PS" | "MS" | "GS";
type PatternId = "verticals" | "horizontals" | "zigzags" | "circles" | "arches" | "cups" | "waves" | "bridges" | "loops" | "squares" | "triangles" | "spirals" | "crosses";
type Pattern = { id: PatternId; title: string; levels: SectionLevel[]; icon: string };

const PATTERNS: Pattern[] = [
  { id: "verticals", title: "Traits verticaux", levels: ["PS"], icon: "||||" },
  { id: "horizontals", title: "Traits horizontaux", levels: ["PS"], icon: "— —" },
  { id: "circles", title: "Ronds", levels: ["PS", "MS"], icon: "○ ○" },
  { id: "waves", title: "Vagues", levels: ["PS", "MS"], icon: "〰" },
  { id: "arches", title: "Ponts", levels: ["MS"], icon: "∩∩" },
  { id: "cups", title: "Coupes", levels: ["MS"], icon: "∪∪" },
  { id: "zigzags", title: "Zigzags", levels: ["MS", "GS"], icon: "⌃⌄" },
  { id: "bridges", title: "Créneaux arrondis", levels: ["MS", "GS"], icon: "∩ ∩" },
  { id: "squares", title: "Carrés", levels: ["MS", "GS"], icon: "□ □" },
  { id: "triangles", title: "Triangles", levels: ["MS", "GS"], icon: "△ △" },
  { id: "loops", title: "Boucles", levels: ["GS"], icon: "ℓℓ" },
  { id: "spirals", title: "Spirales", levels: ["GS"], icon: "◎" },
  { id: "crosses", title: "Croix", levels: ["GS"], icon: "× ×" },
];

const repeat = (count: number, render: (index: number) => ReactNode) => Array.from({ length: count }, (_, index) => render(index));

function spiralPath(cx: number, cy: number) {
  const points = Array.from({ length: 82 }, (_, index) => {
    const progress = index / 81;
    const angle = progress * Math.PI * 4.5;
    const radius = 29 * (1 - progress) + 1.5;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  return points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function connectedLoopsPath() {
  let path = "M 8 66";
  for (let index = 0; index < 10; index += 1) {
    const x = 8 + index * 70;
    path += ` C ${x - 8} 47 ${x - 5} 12 ${x + 23} 8`;
    path += ` C ${x + 51} 4 ${x + 58} 42 ${x + 42} 59`;
    path += ` C ${x + 32} 71 ${x + 15} 72 ${x} 66`;
    path += ` C ${x + 18} 59 ${x + 42} 59 ${x + 70} 66`;
  }
  return path;
}

function PatternDrawing({ id }: { id: PatternId }) {
  const common = { fill: "none", stroke: "#7d8591", strokeWidth: 3, strokeDasharray: "2 7", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "verticals") return <>{repeat(14, (i) => <line key={i} x1={25 + i * 52} y1="12" x2={25 + i * 52} y2="68" {...common} />)}</>;
  if (id === "horizontals") return <>{repeat(7, (i) => <line key={i} x1={12 + i * 102} y1="40" x2={92 + i * 102} y2="40" {...common} />)}</>;
  if (id === "circles") return <>{repeat(10, (i) => <circle key={i} cx={42 + i * 72} cy="40" r="25" {...common} />)}</>;
  if (id === "squares") return <>{repeat(9, (i) => <rect key={i} x={12 + i * 80} y="12" width="56" height="56" rx="2" {...common} />)}</>;
  if (id === "triangles") return <>{repeat(9, (i) => <path key={i} d={`M ${12 + i * 80} 68 L ${40 + i * 80} 12 L ${68 + i * 80} 68 Z`} {...common} />)}</>;
  if (id === "crosses") return <>{repeat(9, (i) => <path key={i} d={`M ${15 + i * 80} 15 L ${65 + i * 80} 65 M ${65 + i * 80} 15 L ${15 + i * 80} 65`} {...common} />)}</>;
  if (id === "spirals") return <>{repeat(9, (i) => <path key={i} d={spiralPath(42 + i * 80, 40)} {...common} />)}</>;
  if (id === "zigzags") return <path d="M 8 66 L 48 14 L 88 66 L 128 14 L 168 66 L 208 14 L 248 66 L 288 14 L 328 66 L 368 14 L 408 66 L 448 14 L 488 66 L 528 14 L 568 66 L 608 14 L 648 66 L 688 14 L 712 48" {...common} />;
  if (id === "arches") return <path d="M 8 66 Q 38 10 68 66 Q 98 10 128 66 Q 158 10 188 66 Q 218 10 248 66 Q 278 10 308 66 Q 338 10 368 66 Q 398 10 428 66 Q 458 10 488 66 Q 518 10 548 66 Q 578 10 608 66 Q 638 10 668 66 Q 690 24 712 55" {...common} />;
  if (id === "cups") return <path d="M 8 14 Q 38 70 68 14 Q 98 70 128 14 Q 158 70 188 14 Q 218 70 248 14 Q 278 70 308 14 Q 338 70 368 14 Q 398 70 428 14 Q 458 70 488 14 Q 518 70 548 14 Q 578 70 608 14 Q 638 70 668 14 Q 690 56 712 24" {...common} />;
  if (id === "bridges") return <path d="M 8 68 L 8 42 Q 35 10 62 42 L 62 68 M 62 68 L 62 42 Q 89 10 116 42 L 116 68 M 116 68 L 116 42 Q 143 10 170 42 L 170 68 M 170 68 L 170 42 Q 197 10 224 42 L 224 68 M 224 68 L 224 42 Q 251 10 278 42 L 278 68 M 278 68 L 278 42 Q 305 10 332 42 L 332 68 M 332 68 L 332 42 Q 359 10 386 42 L 386 68 M 386 68 L 386 42 Q 413 10 440 42 L 440 68 M 440 68 L 440 42 Q 467 10 494 42 L 494 68 M 494 68 L 494 42 Q 521 10 548 42 L 548 68 M 548 68 L 548 42 Q 575 10 602 42 L 602 68 M 602 68 L 602 42 Q 629 10 656 42 L 656 68 M 656 68 L 656 42 Q 683 10 710 42 L 710 68" {...common} />;
  if (id === "loops") return <path d={connectedLoopsPath()} {...common} />;
  return <path d="M 8 42 C 38 5 68 5 98 42 S 158 79 188 42 S 248 5 278 42 S 338 79 368 42 S 428 5 458 42 S 518 79 548 42 S 608 5 638 42 S 698 79 712 48" {...common} />;
}

function today() { return new Date().toISOString().slice(0, 10); }
function formatDate(value: string) { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }

export function GraphismScreen({ profile, onBack }: { profile: Profile; onBack(): void }) {
  const [date, setDate] = useState(today);
  const [level, setLevel] = useState<SectionLevel>("MS");
  const [selected, setSelected] = useState<PatternId[]>(["circles", "waves", "arches", "cups", "zigzags", "squares"]);
  const visible = PATTERNS.filter((pattern) => pattern.levels.includes(level));
  const rows = selected.map((id) => PATTERNS.find((pattern) => pattern.id === id)).filter((pattern): pattern is Pattern => Boolean(pattern));
  const chooseLevel = (next: SectionLevel) => { setLevel(next); setSelected(PATTERNS.filter((pattern) => pattern.levels.includes(next)).slice(0, 6).map((pattern) => pattern.id)); };
  const toggle = (id: PatternId) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 8 ? current : [...current, id]);

  return <section className="writing-page graphism-page"><div className="writing-toolbar"><BackButton onClick={onBack} /><span className="eyebrow">Maternelle · Graphisme</span><h1>Créer une fiche de tracés</h1><p>Choisissez jusqu’à huit gestes graphiques à repasser.</p><div className="writing-options"><label><span>Date de la fiche</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><div className="field"><span>Niveau indicatif</span><div className="segmented">{(["PS", "MS", "GS"] as SectionLevel[]).map((item) => <button className={level === item ? "active" : ""} key={item} onClick={() => chooseLevel(item)}>{item}</button>)}</div></div></div><div className="pattern-picker">{visible.map((pattern) => <button key={pattern.id} className={selected.includes(pattern.id) ? "selected" : ""} onClick={() => toggle(pattern.id)}><span>{pattern.icon}</span><strong>{pattern.title}</strong><small>{pattern.levels.join(" · ")}</small></button>)}</div><button className="primary-button print-button" disabled={rows.length === 0} onClick={() => window.print()}>Imprimer la fiche</button><small className="print-tip">A4 · échelle 100 % · arrière-plans activés</small></div><div className="worksheet-preview"><div className="preview-label">Aperçu A4</div><article className="a4-sheet graphism-sheet"><header className="worksheet-header"><div><small>DEVOIRO · GRAPHISME · {level}</small><strong>Travail de graphisme de {profile.name}</strong></div><span>du {formatDate(date)}</span></header><p className="graphism-instruction">Je repasse doucement sur les pointillés, de gauche à droite.</p><div className="graphism-rows" style={{ "--pattern-count": Math.max(1, rows.length) } as CSSProperties}>{rows.map((pattern) => <section className="graphism-row" key={pattern.id}><small>{pattern.title}</small><svg viewBox="0 0 720 80" role="img" aria-label={pattern.title}><PatternDrawing id={pattern.id} /></svg></section>)}</div>{rows.length === 0 && <div className="empty-sheet">Choisissez au moins un tracé.</div>}</article></div></section>;
}
