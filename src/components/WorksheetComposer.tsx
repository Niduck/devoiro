import { useEffect, useMemo, useState, type ReactNode } from "react";
import { generatedWriting } from "../data/writing";
import type { Profile } from "../types";
import { BackButton } from "./Shell";

export type SectionLevel = "PS" | "MS" | "GS";
export type PatternId = "verticals" | "horizontals" | "zigzags" | "circles" | "arches" | "cups" | "waves" | "bridges" | "loops" | "squares" | "triangles" | "spirals" | "crosses";
type WritingStyle = "capitales" | "script";
type Pattern = { id: PatternId; title: string; levels: SectionLevel[]; icon: string };
type WorksheetBlock = { id: string; type: "writing"; text: string; style: WritingStyle } | { id: string; type: "graphism"; patternId: PatternId };

const PAGE_CAPACITY = 240;
const WRITING_COST = 60;
const GRAPHISM_COST = 30;

export const PATTERNS: Pattern[] = [
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
const makeId = () => globalThis.crypto?.randomUUID?.() || `exercise-${Date.now()}-${Math.random()}`;
const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "……………………";

function spiralPath(cx: number, cy: number) {
  const points = Array.from({ length: 82 }, (_, index) => {
    const progress = index / 81;
    const angle = progress * Math.PI * 4.5;
    const radius = 29 * (1 - progress) + 1.5;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
  return points.map(([x, y], index) => `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function loopRowPath() {
  const count = 6;
  const startX = 30;
  const baselineY = 154;
  const height = 128;
  const loopWidth = 98;
  const step = 140;
  const topY = baselineY - height;
  const offsetX = (ratio: number) => Math.round(loopWidth * ratio);
  const offsetY = (ratio: number) => Math.round(height * ratio);
  let path = `M ${startX} ${baselineY}`;
  for (let index = 0; index < count; index += 1) {
    const x = startX + index * step;
    path += ` C ${x + offsetX(.08)} ${baselineY}, ${x + offsetX(.17)} ${baselineY + 2}, ${x + offsetX(.26)} ${baselineY + 1}
      C ${x + offsetX(.46)} ${baselineY - offsetY(.14)}, ${x + offsetX(.84)} ${baselineY - offsetY(.55)}, ${x + offsetX(.88)} ${topY + offsetY(.22)}
      C ${x + offsetX(.90)} ${topY + offsetY(.07)}, ${x + offsetX(.77)} ${topY - 2}, ${x + offsetX(.61)} ${topY}
      C ${x + offsetX(.36)} ${topY + 2}, ${x + offsetX(.16)} ${topY + offsetY(.27)}, ${x + offsetX(.17)} ${topY + offsetY(.56)}
      C ${x + offsetX(.18)} ${baselineY - offsetY(.28)}, ${x + offsetX(.36)} ${baselineY - offsetY(.06)}, ${x + offsetX(.57)} ${baselineY + 2}
      C ${x + offsetX(.72)} ${baselineY + 3}, ${x + Math.round(step * .72)} ${baselineY}, ${x + step} ${baselineY}`;
  }
  return path;
}

export function PatternDrawing({ id }: { id: PatternId }) {
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
  if (id === "loops") return <path d={loopRowPath()} fill="none" stroke="#7d8591" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 9" />;
  return <path d="M 8 42 C 38 5 68 5 98 42 S 158 79 188 42 S 248 5 278 42 S 338 79 368 42 S 428 5 458 42 S 518 79 548 42 S 608 5 638 42 S 698 79 712 48" {...common} />;
}

function HandwritingText({ children, style, className = "" }: { children: string; style: WritingStyle; className?: string }) {
  return <span className={`handwriting ${style} ${className}`}>{style === "capitales" ? children.toLocaleUpperCase("fr-FR") : children}</span>;
}

function TraceText({ children, style }: { children: string; style: WritingStyle }) {
  const text = style === "capitales" ? children.toLocaleUpperCase("fr-FR") : children;
  return <svg className={`trace-text ${style}`} width="100%" height="16mm" aria-label={text}><text x="9mm" y="7.7mm">{text}</text></svg>;
}

function paginate(blocks: WorksheetBlock[]) {
  const pages: WorksheetBlock[][] = [];
  let page: WorksheetBlock[] = [];
  let used = 0;
  blocks.forEach((block) => {
    const cost = block.type === "writing" ? WRITING_COST : GRAPHISM_COST;
    if (page.length && used + cost > PAGE_CAPACITY) {
      pages.push(page);
      page = [];
      used = 0;
    }
    page.push(block);
    used += cost;
  });
  if (page.length) pages.push(page);
  return pages.length ? pages : [[]];
}

function SheetHeader({ profile, date, label }: { profile: Profile; date: string; label: string }) {
  return <header className="worksheet-header"><div><small>DEVOIRO · {label}</small><strong>Travail de {profile.name}</strong></div><span>du {formatDate(date)}</span></header>;
}

function WritingBlock({ block, number }: { block: Extract<WorksheetBlock, { type: "writing" }>; number: number }) {
  const text = block.text.trim() || "Mon modèle";
  return <section className="composed-block composed-writing-block"><div className="exercise-label">Exercice {number}</div><div className="single-example"><HandwritingText style={block.style}>{text}</HandwritingText></div><div className="seyes-row trace-row"><TraceText style={block.style}>{text}</TraceText></div><div className="seyes-row blank-row" /></section>;
}

function GraphismBlock({ block, number }: { block: Extract<WorksheetBlock, { type: "graphism" }>; number: number }) {
  const pattern = PATTERNS.find((item) => item.id === block.patternId) || PATTERNS[0];
  return <section className="composed-block composed-graphism-block"><div className="exercise-label">Exercice {number}</div><small>{pattern.title}</small><svg viewBox={pattern.id === "loops" ? "0 0 900 190" : "0 0 720 80"} role="img" aria-label={pattern.title}><PatternDrawing id={pattern.id} /></svg></section>;
}

type WorksheetComposerProps = {
  profile: Profile;
  onBack(): void;
  mode: "writing" | "graphism";
};

export function WorksheetComposer({ profile, onBack, mode }: WorksheetComposerProps) {
  const graphismOnly = mode === "graphism";
  const [date, setDate] = useState(today);
  const [level, setLevel] = useState<SectionLevel>("MS");
  const [addingExercise, setAddingExercise] = useState(false);
  const [blocks, setBlocks] = useState<WorksheetBlock[]>(() => graphismOnly
    ? PATTERNS.filter((pattern) => pattern.levels.includes("MS")).slice(0, 6).map((pattern) => ({ id: makeId(), type: "graphism", patternId: pattern.id }))
    : [{ id: makeId(), type: "writing", text: generatedWriting(profile, "phrase"), style: "script" }]);
  const pages = useMemo(() => paginate(blocks), [blocks]);
  const availablePatterns = graphismOnly ? PATTERNS.filter((pattern) => pattern.levels.includes(level)) : PATTERNS;

  useEffect(() => {
    if (!addingExercise) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAddingExercise(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [addingExercise]);

  const updateBlock = (id: string, update: Partial<WorksheetBlock>) => setBlocks((current) => current.map((block) => block.id === id ? { ...block, ...update } as WorksheetBlock : block));
  const removeBlock = (id: string) => setBlocks((current) => current.filter((block) => block.id !== id));
  const moveBlock = (index: number, direction: -1 | 1) => setBlocks((current) => {
    const destination = index + direction;
    if (destination < 0 || destination >= current.length) return current;
    const next = [...current];
    [next[index], next[destination]] = [next[destination], next[index]];
    return next;
  });
  const addWriting = (style: WritingStyle) => {
    setBlocks((current) => [...current, { id: makeId(), type: "writing", text: generatedWriting(profile, "phrase"), style }]);
    setAddingExercise(false);
  };
  const addGraphism = (patternId: PatternId) => {
    setBlocks((current) => [...current, { id: makeId(), type: "graphism", patternId }]);
    setAddingExercise(false);
  };
  const chooseLevel = (next: SectionLevel) => {
    const patterns = PATTERNS.filter((pattern) => pattern.levels.includes(next));
    setLevel(next);
    setBlocks((current) => current.map((block) => block.type === "graphism" && !patterns.some((pattern) => pattern.id === block.patternId) ? { ...block, patternId: patterns[0].id } : block));
  };

  return <section className="writing-page composer-page">
    <div className="writing-toolbar"><BackButton onClick={onBack} /><br /><span className="eyebrow">{graphismOnly ? "Maternelle · Graphisme" : `Écriture · ${profile.schoolLevel.toUpperCase()}`}</span><h1>Composer une fiche</h1><p>Ajoutez et ordonnez les exercices. Une nouvelle page est créée automatiquement si nécessaire.</p>
      <div className="writing-options"><label><span>Date de la fiche</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        {graphismOnly && <div className="field"><span>Niveau indicatif</span><div className="segmented">{(["PS", "MS", "GS"] as SectionLevel[]).map((item) => <button className={level === item ? "active" : ""} key={item} onClick={() => chooseLevel(item)}>{item}</button>)}</div></div>}
      </div>
      <div className="exercise-block-list">{blocks.map((block, index) => <article className={`exercise-block-editor ${block.type}`} key={block.id}><header><div><small>Exercice {index + 1}</small><strong>{block.type === "writing" ? "Écriture" : PATTERNS.find((pattern) => pattern.id === block.patternId)?.title}</strong></div><div><button disabled={index === 0} onClick={() => moveBlock(index, -1)} aria-label="Monter l’exercice">↑</button><button disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)} aria-label="Descendre l’exercice">↓</button><button onClick={() => removeBlock(block.id)} aria-label="Retirer l’exercice">✕</button></div></header>
        {block.type === "writing" ? <><div className="block-style-picker"><button className={block.style === "capitales" ? "active" : ""} onClick={() => updateBlock(block.id, { style: "capitales" })}>CAPITALES</button><button className={block.style === "script" ? "active script-option" : "script-option"} onClick={() => updateBlock(block.id, { style: "script" })}>Cursive</button></div><textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} maxLength={70} rows={2} placeholder="Saisir un mot ou une phrase" /><div className="generator-buttons"><button onClick={() => updateBlock(block.id, { text: generatedWriting(profile, "word") })}>Générer un mot</button><button onClick={() => updateBlock(block.id, { text: generatedWriting(profile, "phrase") })}>Générer une phrase</button></div></> : <select value={block.patternId} onChange={(event) => updateBlock(block.id, { patternId: event.target.value as PatternId })}>{availablePatterns.map((pattern) => <option key={pattern.id} value={pattern.id}>{pattern.title}</option>)}</select>}
      </article>)}</div><button className="open-exercise-catalog" onClick={() => setAddingExercise(true)}>+ Ajouter un exercice</button>
      <div className="page-count">{pages.length} page{pages.length > 1 ? "s" : ""} A4</div><button className="primary-button print-button" disabled={blocks.length === 0} onClick={() => window.print()}>Imprimer la fiche</button><small className="print-tip">A4 · échelle 100 % · arrière-plans activés</small>
    </div>
    <div className="worksheet-preview composed-preview">{pages.map((page, pageIndex) => <div className="preview-page" key={pageIndex}><div className="preview-label">Aperçu A4 · page {pageIndex + 1}/{pages.length}</div><article className="a4-sheet composed-sheet"><SheetHeader profile={profile} date={date} label={graphismOnly ? `GRAPHISME · ${level}` : `EXERCICES · ${profile.schoolLevel.toUpperCase()}`} /><div className="composed-exercises">{page.map((block) => {
        const number = blocks.findIndex((item) => item.id === block.id) + 1;
        return block.type === "writing" ? <WritingBlock block={block} number={number} key={block.id} /> : <GraphismBlock block={block} number={number} key={block.id} />;
      })}</div>{page.length === 0 && <div className="empty-sheet">Ajoutez un premier exercice.</div>}<footer>Je prends mon temps et je m’applique.</footer></article></div>)}</div>
    {addingExercise && <div className="exercise-catalog-backdrop" onMouseDown={() => setAddingExercise(false)}>
      <div className="exercise-catalog" role="dialog" aria-modal="true" aria-labelledby="exercise-catalog-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><small>Nouvel exercice</small><strong id="exercise-catalog-title">Que voulez-vous ajouter ?</strong></div><button onClick={() => setAddingExercise(false)} aria-label="Fermer">✕</button></header>
        {!graphismOnly && <section><h2>Écriture</h2><div className="writing-catalog-grid"><button onClick={() => addWriting("capitales")}><div className="catalog-writing-preview capitales"><span>ABC</span><i /></div><strong>Écriture en capitales</strong><small>Un modèle et une ligne libre</small></button><button onClick={() => addWriting("script")}><div className="catalog-writing-preview script"><span>bonjour</span><i /></div><strong>Écriture cursive</strong><small>Police scolaire Marelle</small></button></div></section>}
        <section><h2>Graphisme</h2><div className="graphism-catalog-grid">{availablePatterns.map((pattern) => <button key={pattern.id} onClick={() => addGraphism(pattern.id)}><svg viewBox={pattern.id === "loops" ? "0 0 900 190" : "0 0 720 80"} aria-hidden="true"><PatternDrawing id={pattern.id} /></svg><strong>{pattern.title}</strong><small>{pattern.levels.join(" · ")}</small></button>)}</div></section>
      </div>
    </div>}
  </section>;
}
