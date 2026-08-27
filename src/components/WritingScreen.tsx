import { useState } from "react";
import type { Profile } from "../types";
import { BackButton } from "./Shell";
import { WorksheetComposer } from "./WorksheetComposer";

type WritingStyle = "capitales" | "script";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "……………………";

function HandwritingText({ children, style, className = "" }: { children: string; style: WritingStyle; className?: string }) {
  return <span className={`handwriting ${style} ${className}`}>{style === "capitales" ? children.toLocaleUpperCase("fr-FR") : children}</span>;
}

function KindergartenWritingScreen({ profile, onBack }: { profile: Profile; onBack(): void }) {
  const [date, setDate] = useState(today);
  const [style, setStyle] = useState<WritingStyle>("capitales");

  return <section className="writing-page">
    <div className="writing-toolbar"><BackButton onClick={onBack} /><br /><div><span className="eyebrow">Écriture · Maternelle</span><h1>Ma fiche alphabet</h1><p>De grandes lettres grisées à repasser dans un quadrillage.</p></div>
      <div className="writing-options"><label><span>Date de la fiche</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><div className="field"><span>Type d’exemple</span><div className="segmented"><button className={style === "capitales" ? "active" : ""} onClick={() => setStyle("capitales")}>CAPITALES</button><button className={style === "script" ? "active script-option" : "script-option"} onClick={() => setStyle("script")}>Cursive Marelle</button></div></div></div>
      <button className="primary-button print-button" onClick={() => window.print()}>Imprimer la fiche</button><small className="print-tip">Dans la fenêtre d’impression, choisissez A4 et une échelle de 100 %.</small>
    </div>
    <div className="worksheet-preview"><div className="preview-label">Aperçu A4</div><article className="a4-sheet kindergarten-worksheet"><header className="worksheet-header"><div><small>DEVOIRO · ÉCRITURE</small><strong>Travail d’écriture de {profile.name}</strong></div><span>du {formatDate(date)}</span></header><div className="alphabet-intro"><strong>Je repasse sur chaque lettre.</strong><span>Une lettre à la fois.</span></div><div className="alphabet-grid">{ALPHABET.map((letter) => <div className="letter-cell" key={letter}><HandwritingText style={style} className="trace">{style === "script" ? letter.toLocaleLowerCase("fr-FR") : letter}</HandwritingText></div>)}</div></article></div>
  </section>;
}

export function WritingScreen({ profile, onBack }: { profile: Profile; onBack(): void }) {
  if (profile.schoolLevel === "maternelle") return <KindergartenWritingScreen profile={profile} onBack={onBack} />;
  return <WorksheetComposer profile={profile} onBack={onBack} mode="writing" />;
}
