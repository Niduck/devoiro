import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { generatedWriting } from "../data/writing";
import type { ActivityLevel, Profile } from "../types";
import { BackButton } from "./Shell";

export type SectionLevel = "PS" | "MS" | "GS";
export type PatternId = "verticals" | "horizontals" | "zigzags" | "circles" | "arches" | "cups" | "waves" | "bridges" | "loops" | "squares" | "triangles" | "spirals" | "crosses";
type WritingStyle = "capitales" | "script";
type GraphismSize = "large" | "medium" | "small";
type DiscoveryKind = "shapes" | "smallest" | "largest";
type BasicShape = "circle" | "square" | "triangle";
type Pattern = { id: PatternId; title: string; levels: SectionLevel[]; icon: string };
type WorksheetBlock =
  | { id: string; type: "writing"; text: string; style: WritingStyle; level: ActivityLevel }
  | { id: string; type: "graphism"; patternId: PatternId; size: GraphismSize; level: ActivityLevel }
  | { id: string; type: "discovery"; kind: DiscoveryKind; targetShape?: BasicShape; level: ActivityLevel };
type WorksheetPreset = { id: string; level: ActivityLevel; title: string; description: string; create(profile: Profile): WorksheetBlock[] };

const PAGE_CAPACITY = 240;
const WRITING_COST = 60;
const DISCOVERY_COST = 48;
const GRAPHISM_COST: Record<GraphismSize, number> = { large: 44, medium: 36, small: 30 };

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

const CATALOG_LEVELS: { id: ActivityLevel; label: string }[] = [
  { id: "ps", label: "PS" },
  { id: "ms", label: "MS" },
  { id: "gs", label: "GS" },
  { id: "cp", label: "CP" },
  { id: "ce1", label: "CE1" },
];

function patternsForLevel(level: ActivityLevel) {
  if (level === "cp" || level === "ce1") return PATTERNS;
  const section = level.toUpperCase() as SectionLevel;
  return PATTERNS.filter((pattern) => pattern.levels.includes(section));
}

function profileForLevel(profile: Profile, level: ActivityLevel): Profile {
  return {
    ...profile,
    schoolLevel: level === "cp" || level === "ce1" ? level : "maternelle",
    period: level === "ps" ? "debut" : level === "gs" ? "fin" : "milieu",
  };
}

const repeat = (count: number, render: (index: number) => ReactNode) => Array.from({ length: count }, (_, index) => render(index));
const makeId = () => globalThis.crypto?.randomUUID?.() || `exercise-${Date.now()}-${Math.random()}`;
const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "……………………";

function graphismSizeForLevel(level: ActivityLevel): GraphismSize {
  if (level === "ps") return "large";
  if (level === "ms") return "medium";
  return "small";
}

function graphismBlock(level: ActivityLevel, patternId: PatternId, size = graphismSizeForLevel(level)): WorksheetBlock {
  return { id: makeId(), type: "graphism", patternId, size, level };
}

function discoveryBlock(level: ActivityLevel, kind: DiscoveryKind, targetShape?: BasicShape): WorksheetBlock {
  return { id: makeId(), type: "discovery", kind, targetShape, level };
}

function writingBlock(profile: Profile, level: ActivityLevel, style: WritingStyle, kind: "word" | "phrase"): WorksheetBlock {
  return { id: makeId(), type: "writing", text: generatedWriting(profileForLevel(profile, level), kind), style, level };
}

const WORKSHEET_PRESETS: WorksheetPreset[] = [
  { id: "ps-lines", level: "ps", title: "Graphisme · traits", description: "Grands traits verticaux et horizontaux.", create: () => [graphismBlock("ps", "verticals"), graphismBlock("ps", "horizontals"), graphismBlock("ps", "verticals"), graphismBlock("ps", "horizontals")] },
  { id: "ps-curves", level: "ps", title: "Graphisme · courbes", description: "Grands ronds et vagues à repasser.", create: () => [graphismBlock("ps", "circles"), graphismBlock("ps", "waves"), graphismBlock("ps", "circles"), graphismBlock("ps", "waves")] },
  { id: "ps-shapes", level: "ps", title: "Découverte des formes", description: "Reconnaître le rond, le carré et le triangle.", create: () => [discoveryBlock("ps", "shapes", "circle"), discoveryBlock("ps", "shapes", "square"), discoveryBlock("ps", "shapes", "triangle")] },
  { id: "ps-sizes", level: "ps", title: "Plus petit · plus grand", description: "Comparer visuellement des objets de tailles différentes.", create: () => [discoveryBlock("ps", "smallest"), discoveryBlock("ps", "largest"), discoveryBlock("ps", "smallest"), discoveryBlock("ps", "largest")] },
  { id: "ms-rounded", level: "ms", title: "Gestes arrondis", description: "Ponts, coupes, ronds et vagues.", create: () => [graphismBlock("ms", "arches"), graphismBlock("ms", "cups"), graphismBlock("ms", "circles"), graphismBlock("ms", "waves")] },
  { id: "ms-shapes", level: "ms", title: "Reconnaître les formes", description: "Ronds, carrés et triangles parmi d’autres formes.", create: () => [discoveryBlock("ms", "shapes", "circle"), discoveryBlock("ms", "shapes", "square"), discoveryBlock("ms", "shapes", "triangle")] },
  { id: "ms-lines", level: "ms", title: "Lignes et changements de direction", description: "Zigzags, créneaux et ponts.", create: () => [graphismBlock("ms", "zigzags"), graphismBlock("ms", "bridges"), graphismBlock("ms", "arches"), graphismBlock("ms", "cups")] },
  { id: "gs-cursive", level: "gs", title: "Préparation à la cursive", description: "Boucles et gestes continus préparant les liaisons.", create: () => [graphismBlock("gs", "loops"), graphismBlock("gs", "bridges"), graphismBlock("gs", "loops"), graphismBlock("gs", "waves")] },
  { id: "gs-shapes", level: "gs", title: "Formes et tracés", description: "Carrés, triangles, spirales et croix.", create: () => [graphismBlock("gs", "squares"), graphismBlock("gs", "triangles"), graphismBlock("gs", "spirals"), graphismBlock("gs", "crosses")] },
  { id: "cp-writing", level: "cp", title: "Écriture · mots", description: "Trois mots à copier en cursive sur lignage Seyès.", create: (profile) => [writingBlock(profile, "cp", "script", "word"), writingBlock(profile, "cp", "script", "word"), writingBlock(profile, "cp", "script", "word")] },
  { id: "cp-sentences", level: "cp", title: "Écriture · phrases", description: "Trois phrases courtes à copier.", create: (profile) => [writingBlock(profile, "cp", "script", "phrase"), writingBlock(profile, "cp", "script", "phrase")] },
  { id: "ce1-writing", level: "ce1", title: "Copie · CE1", description: "Des mots puis des phrases à copier avec soin.", create: (profile) => [writingBlock(profile, "ce1", "script", "word"), writingBlock(profile, "ce1", "script", "phrase"), writingBlock(profile, "ce1", "script", "phrase")] },
];

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

function patternViewBox(patternId: PatternId, size: GraphismSize = "small") {
  const fullWidth = patternId === "loops" ? 900 : 720;
  const height = patternId === "loops" ? 190 : 80;
  const widthFactor: Record<GraphismSize, number> = { large: 0.58, medium: 0.78, small: 1 };
  return `0 0 ${Math.round(fullWidth * widthFactor[size])} ${height}`;
}

function ShapeSymbol({ shape, size = 42 }: { shape: BasicShape; size?: number }) {
  const common = { fill: "none", stroke: "#737d8c", strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg className="shape-symbol" width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
    {shape === "circle" && <circle cx="30" cy="30" r="22" {...common} />}
    {shape === "square" && <rect x="9" y="9" width="42" height="42" rx="2" {...common} />}
    {shape === "triangle" && <path d="M 30 7 L 54 51 L 6 51 Z" {...common} />}
  </svg>;
}

function DiscoveryBlock({ block, number }: { block: Extract<WorksheetBlock, { type: "discovery" }>; number: number }) {
  if (block.kind === "shapes") {
    const target = block.targetShape || "circle";
    const labels: Record<BasicShape, string> = { circle: "ronds", square: "carrés", triangle: "triangles" };
    const shapes: BasicShape[] = target === "circle" ? ["circle", "triangle", "circle", "square", "triangle", "circle"] : target === "square" ? ["triangle", "square", "circle", "square", "triangle", "square"] : ["square", "triangle", "circle", "triangle", "square", "triangle"];
    return <section className="composed-block composed-discovery-block"><div className="exercise-label">Exercice {number}</div><strong>Entoure les {labels[target]}.</strong><div className="shape-choice-row">{shapes.map((shape, index) => <ShapeSymbol shape={shape} size={48} key={`${shape}-${index}`} />)}</div></section>;
  }

  const selectSmallest = block.kind === "smallest";
  const sizes = selectSmallest ? [54, 30, 43, 65] : [35, 56, 28, 44];
  return <section className="composed-block composed-discovery-block"><div className="exercise-label">Exercice {number}</div><strong>Entoure le {selectSmallest ? "plus petit" : "plus grand"}.</strong><div className="shape-choice-row size-comparison-row">{sizes.map((size, index) => <ShapeSymbol shape="circle" size={size} key={`${size}-${index}`} />)}</div></section>;
}

function paginate(blocks: WorksheetBlock[]) {
  const pages: WorksheetBlock[][] = [];
  let page: WorksheetBlock[] = [];
  let used = 0;
  blocks.forEach((block) => {
    const cost = block.type === "writing" ? WRITING_COST : block.type === "discovery" ? DISCOVERY_COST : GRAPHISM_COST[block.size];
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

function SheetHeader({ studentName, date, label }: { studentName: string; date: string; label: string }) {
  return <header className="worksheet-header"><div><small>DEVOIRO · {label}</small><strong>Travail de {studentName.trim() || "……………………"}</strong></div><span>du {formatDate(date)}</span></header>;
}

function WritingBlock({ block, number }: { block: Extract<WorksheetBlock, { type: "writing" }>; number: number }) {
  const text = block.text.trim() || "Mon modèle";
  return <section className="composed-block composed-writing-block"><div className="exercise-label">Exercice {number}</div><div className="single-example"><HandwritingText style={block.style}>{text}</HandwritingText></div><div className="seyes-row trace-row"><TraceText style={block.style}>{text}</TraceText></div><div className="seyes-row blank-row" /></section>;
}

function GraphismBlock({ block, number }: { block: Extract<WorksheetBlock, { type: "graphism" }>; number: number }) {
  const pattern = PATTERNS.find((item) => item.id === block.patternId) || PATTERNS[0];
  const heights: Record<GraphismSize, number> = { large: 42, medium: 34, small: 28 };
  return <section className={`composed-block composed-graphism-block graphism-${block.size}`} style={{ "--graphism-height": `${heights[block.size]}mm` } as CSSProperties}><div className="exercise-label">Exercice {number}</div><small>{pattern.title}</small><svg viewBox={patternViewBox(pattern.id, block.size)} role="img" aria-label={pattern.title}><PatternDrawing id={pattern.id} /></svg></section>;
}

function blockTitle(block: WorksheetBlock) {
  if (block.type === "writing") return "Écriture";
  if (block.type === "graphism") return PATTERNS.find((pattern) => pattern.id === block.patternId)?.title || "Graphisme";
  if (block.kind === "shapes") return "Découverte des formes";
  return block.kind === "smallest" ? "Trouver le plus petit" : "Trouver le plus grand";
}

type WorksheetComposerProps = {
  profile: Profile;
  onBack(): void;
  mode: "writing" | "graphism";
};

export function WorksheetComposer({ profile, onBack, mode }: WorksheetComposerProps) {
  const graphismOnly = mode === "graphism";
  const [date, setDate] = useState(today);
  const [studentName, setStudentName] = useState("");
  const [level, setLevel] = useState<SectionLevel>("MS");
  const [catalogLevel, setCatalogLevel] = useState<ActivityLevel>("cp");
  const [presetLevel, setPresetLevel] = useState<ActivityLevel>("ps");
  const [addingExercise, setAddingExercise] = useState(false);
  const [choosingPreset, setChoosingPreset] = useState(false);
  const [blocks, setBlocks] = useState<WorksheetBlock[]>(() => graphismOnly
    ? PATTERNS.filter((pattern) => pattern.levels.includes("MS")).slice(0, 6).map((pattern) => graphismBlock("ms", pattern.id))
    : [{ id: makeId(), type: "writing", text: generatedWriting(profileForLevel(profile, "cp"), "phrase"), style: "script", level: "cp" }]);
  const pages = useMemo(() => paginate(blocks), [blocks]);
  const availablePatterns = graphismOnly ? PATTERNS.filter((pattern) => pattern.levels.includes(level)) : patternsForLevel(catalogLevel);

  useEffect(() => {
    if (!addingExercise && !choosingPreset) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAddingExercise(false);
        setChoosingPreset(false);
      }
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [addingExercise, choosingPreset]);

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
    setBlocks((current) => [...current, { id: makeId(), type: "writing", text: generatedWriting(profileForLevel(profile, catalogLevel), "phrase"), style, level: catalogLevel }]);
    setAddingExercise(false);
  };
  const addGraphism = (patternId: PatternId) => {
    const blockLevel = graphismOnly ? level.toLowerCase() as ActivityLevel : catalogLevel;
    setBlocks((current) => [...current, graphismBlock(blockLevel, patternId)]);
    setAddingExercise(false);
  };
  const addDiscovery = (kind: DiscoveryKind) => {
    const targetShape = kind === "shapes" ? "circle" : undefined;
    setBlocks((current) => [...current, discoveryBlock(catalogLevel, kind, targetShape)]);
    setAddingExercise(false);
  };
  const applyPreset = (preset: WorksheetPreset) => {
    setBlocks(preset.create(profile));
    setChoosingPreset(false);
  };
  const chooseLevel = (next: SectionLevel) => {
    const patterns = PATTERNS.filter((pattern) => pattern.levels.includes(next));
    setLevel(next);
    setBlocks((current) => current.map((block) => block.type === "graphism" ? { ...block, level: next.toLowerCase() as ActivityLevel, size: graphismSizeForLevel(next.toLowerCase() as ActivityLevel), ...(!patterns.some((pattern) => pattern.id === block.patternId) ? { patternId: patterns[0].id } : {}) } : block));
  };

  return <section className="writing-page composer-page">
    <div className="writing-toolbar"><BackButton onClick={onBack} /><br /><span className="eyebrow">{graphismOnly ? "Maternelle · Graphisme" : "Fiche à composer"}</span><h1>Composer une fiche</h1><p>Ajoutez et ordonnez les exercices. Une nouvelle page est créée automatiquement si nécessaire.</p>
      <div className="writing-options"><label><span>Prénom sur la fiche</span><input type="text" value={studentName} maxLength={30} placeholder="Prénom de l’enfant" onChange={(event) => setStudentName(event.target.value)} /></label><label><span>Date de la fiche</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        {graphismOnly && <div className="field"><span>Niveau indicatif</span><div className="segmented">{(["PS", "MS", "GS"] as SectionLevel[]).map((item) => <button className={level === item ? "active" : ""} key={item} onClick={() => chooseLevel(item)}>{item}</button>)}</div></div>}
      </div>
      <button className="open-preset-catalog" onClick={() => setChoosingPreset(true)}><span>Fiches prêtes à l’emploi</span><strong>Choisir un modèle par niveau →</strong></button>
      <div className="exercise-block-list">{blocks.map((block, index) => <article className={`exercise-block-editor ${block.type}`} key={block.id}><header><div><small>Exercice {index + 1} · {block.level.toUpperCase()}</small><strong>{blockTitle(block)}</strong></div><div><button disabled={index === 0} onClick={() => moveBlock(index, -1)} aria-label="Monter l’exercice">↑</button><button disabled={index === blocks.length - 1} onClick={() => moveBlock(index, 1)} aria-label="Descendre l’exercice">↓</button><button onClick={() => removeBlock(block.id)} aria-label="Retirer l’exercice">✕</button></div></header>
        {block.type === "writing" && <><div className="block-style-picker"><button className={block.style === "capitales" ? "active" : ""} onClick={() => updateBlock(block.id, { style: "capitales" })}>CAPITALES</button><button className={block.style === "script" ? "active script-option" : "script-option"} onClick={() => updateBlock(block.id, { style: "script" })}>Cursive</button></div><textarea value={block.text} onChange={(event) => updateBlock(block.id, { text: event.target.value })} maxLength={70} rows={2} placeholder="Saisir un mot ou une phrase" /><div className="generator-buttons"><button onClick={() => updateBlock(block.id, { text: generatedWriting(profileForLevel(profile, block.level), "word") })}>Générer un mot</button><button onClick={() => updateBlock(block.id, { text: generatedWriting(profileForLevel(profile, block.level), "phrase") })}>Générer une phrase</button></div></>}
        {block.type === "graphism" && <><select value={block.patternId} onChange={(event) => updateBlock(block.id, { patternId: event.target.value as PatternId })}>{patternsForLevel(block.level).map((pattern) => <option key={pattern.id} value={pattern.id}>{pattern.title}</option>)}</select><div className="graphism-size-picker"><span>Taille du tracé</span><div className="block-style-picker">{(["large", "medium", "small"] as GraphismSize[]).map((size) => <button className={block.size === size ? "active" : ""} onClick={() => updateBlock(block.id, { size })} key={size}>{size === "large" ? "Grande" : size === "medium" ? "Moyenne" : "Petite"}</button>)}</div></div></>}
        {block.type === "discovery" && <select value={block.kind === "shapes" ? block.targetShape || "circle" : block.kind} onChange={(event) => { const value = event.target.value; updateBlock(block.id, value === "circle" || value === "square" || value === "triangle" ? { kind: "shapes", targetShape: value as BasicShape } : { kind: value as DiscoveryKind }); }}><option value="circle">Entourer les ronds</option><option value="square">Entourer les carrés</option><option value="triangle">Entourer les triangles</option><option value="smallest">Trouver le plus petit</option><option value="largest">Trouver le plus grand</option></select>}
      </article>)}</div><button className="open-exercise-catalog" onClick={() => setAddingExercise(true)}>+ Ajouter un exercice</button>
      <div className="page-count">{pages.length} page{pages.length > 1 ? "s" : ""} A4</div><button className="primary-button print-button" disabled={blocks.length === 0} onClick={() => window.print()}>Imprimer la fiche</button><small className="print-tip">A4 · échelle 100 % · arrière-plans activés</small>
    </div>
    <div className="worksheet-preview composed-preview">{pages.map((page, pageIndex) => <div className="preview-page" key={pageIndex}><div className="preview-label">Aperçu A4 · page {pageIndex + 1}/{pages.length}</div><article className="a4-sheet composed-sheet"><SheetHeader studentName={studentName} date={date} label={graphismOnly ? `GRAPHISME · ${level}` : "FICHE D’ACTIVITÉS"} /><div className="composed-exercises">{page.map((block) => {
        const number = blocks.findIndex((item) => item.id === block.id) + 1;
        if (block.type === "writing") return <WritingBlock block={block} number={number} key={block.id} />;
        if (block.type === "graphism") return <GraphismBlock block={block} number={number} key={block.id} />;
        return <DiscoveryBlock block={block} number={number} key={block.id} />;
      })}</div>{page.length === 0 && <div className="empty-sheet">Ajoutez un premier exercice.</div>}<footer>Je prends mon temps et je m’applique.</footer></article></div>)}</div>
    {choosingPreset && <div className="exercise-catalog-backdrop" onMouseDown={() => setChoosingPreset(false)}>
      <div className="exercise-catalog preset-catalog" role="dialog" aria-modal="true" aria-labelledby="preset-catalog-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><small>Fiches prêtes à l’emploi</small><strong id="preset-catalog-title">Choisir un modèle</strong></div><button onClick={() => setChoosingPreset(false)} aria-label="Fermer">✕</button></header>
        <div className="catalog-level-picker"><small>Niveau de la fiche</small><div className="activity-level-tabs" role="tablist" aria-label="Niveau du modèle">{CATALOG_LEVELS.map((item) => <button role="tab" aria-selected={presetLevel === item.id} className={presetLevel === item.id ? "active" : ""} key={item.id} onClick={() => setPresetLevel(item.id)}>{item.label}</button>)}</div></div>
        <div className="preset-card-grid">{WORKSHEET_PRESETS.filter((preset) => preset.level === presetLevel).map((preset) => <button key={preset.id} onClick={() => applyPreset(preset)}><span>{preset.level.toUpperCase()}</span><strong>{preset.title}</strong><small>{preset.description}</small><b>Utiliser ce modèle →</b></button>)}</div>
      </div>
    </div>}
    {addingExercise && <div className="exercise-catalog-backdrop" onMouseDown={() => setAddingExercise(false)}>
      <div className="exercise-catalog" role="dialog" aria-modal="true" aria-labelledby="exercise-catalog-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><small>Nouvel exercice</small><strong id="exercise-catalog-title">Que voulez-vous ajouter ?</strong></div><button onClick={() => setAddingExercise(false)} aria-label="Fermer">✕</button></header>
        {!graphismOnly && <div className="catalog-level-picker"><small>Niveau de l’exercice</small><div className="activity-level-tabs" role="tablist" aria-label="Niveau du nouvel exercice">{CATALOG_LEVELS.map((item) => <button role="tab" aria-selected={catalogLevel === item.id} className={catalogLevel === item.id ? "active" : ""} key={item.id} onClick={() => setCatalogLevel(item.id)}>{item.label}</button>)}</div></div>}
        {!graphismOnly && ["gs", "cp", "ce1"].includes(catalogLevel) && <section><h2>Écriture</h2><div className="writing-catalog-grid"><button onClick={() => addWriting("capitales")}><div className="catalog-writing-preview capitales"><span>ABC</span><i /></div><strong>Écriture en capitales</strong><small>Un modèle et une ligne libre</small></button><button onClick={() => addWriting("script")}><div className="catalog-writing-preview script"><span>bonjour</span><i /></div><strong>Écriture cursive</strong><small>Police scolaire Marelle</small></button></div></section>}
        {!graphismOnly && (catalogLevel === "ps" || catalogLevel === "ms") && <section><h2>Découverte</h2><div className="discovery-catalog-grid"><button onClick={() => addDiscovery("shapes")}><div className="catalog-shape-preview"><ShapeSymbol shape="circle" /><ShapeSymbol shape="square" /><ShapeSymbol shape="triangle" /></div><strong>Découverte des formes</strong><small>Entourer une forme donnée</small></button><button onClick={() => addDiscovery("smallest")}><div className="catalog-shape-preview"><ShapeSymbol shape="circle" size={24} /><ShapeSymbol shape="circle" size={48} /><ShapeSymbol shape="circle" size={34} /></div><strong>Plus petit · plus grand</strong><small>Comparer des tailles</small></button></div></section>}
        <section><h2>Graphisme</h2><div className="graphism-catalog-grid">{availablePatterns.map((pattern) => <button key={pattern.id} onClick={() => addGraphism(pattern.id)}><svg viewBox={patternViewBox(pattern.id)} aria-hidden="true"><PatternDrawing id={pattern.id} /></svg><strong>{pattern.title}</strong><small>{pattern.levels.join(" · ")}</small></button>)}</div></section>
      </div>
    </div>}
  </section>;
}
