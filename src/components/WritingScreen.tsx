import {useState, type CSSProperties} from "react";
import {generatedWriting} from "../data/writing";
import type {Profile} from "../types";
import {BackButton} from "./Shell";

type WritingStyle = "capitales" | "script";
type WritingDay = { id: string; text: string };

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
}).format(new Date(`${value}T12:00:00`)) : "……………………";
const makeId = () => globalThis.crypto?.randomUUID?.() || `day-${Date.now()}-${Math.random()}`;

function HandwritingText({children, style, className = ""}: {
    children: string;
    style: WritingStyle;
    className?: string
}) {
    return <span
        className={`handwriting ${style} ${className}`}>{style === "capitales" ? children.toLocaleUpperCase("fr-FR") : children}</span>;
}

function TraceText({children, style}: { children: string; style: WritingStyle }) {
    const text = style === "capitales" ? children.toLocaleUpperCase("fr-FR") : children;
    return <svg className={`trace-text ${style}`} width="100%" height="16mm" aria-label={text}>
        <text x="9mm" y="7.7mm">{text}</text>
    </svg>;
}

function SheetHeader({profile, date}: { profile: Profile; date: string }) {
    return <header className="worksheet-header">
        <div><small>DEVOIRO · ÉCRITURE</small><strong>Travail d’écriture de {profile.name}</strong></div>
        <span>du {formatDate(date)}</span></header>;
}

function WritingExercise({day, index, style}: { day: WritingDay; index: number; style: WritingStyle }) {
    const text = day.text.trim() || "Mon modèle";
    return <section className="writing-exercise">
        <div className="exercise-label">Jour {index + 1}</div>
        <div className="single-example"><HandwritingText style={style}>{text}</HandwritingText></div>
        <div className="seyes-row trace-row"><TraceText style={style}>{text}</TraceText></div>
        <div className="seyes-row blank-row"/>
    </section>;
}

function PrimaryWorksheet({profile, date, style, days}: {
    profile: Profile;
    date: string;
    style: WritingStyle;
    days: WritingDay[]
}) {
    return <article className="a4-sheet primary-worksheet"><SheetHeader profile={profile} date={date}/>
        <div className="writing-exercises"
             style={{"--day-count": days.length} as CSSProperties}>{days.map((day, index) => <WritingExercise
            key={day.id} day={day} index={index} style={style}/>)}</div>
        <footer>Je soigne mon écriture et je prends mon temps.</footer>
    </article>;
}

function KindergartenWorksheet({profile, date, style}: { profile: Profile; date: string; style: WritingStyle }) {
    return <article className="a4-sheet kindergarten-worksheet"><SheetHeader profile={profile} date={date}/>
        <div className="alphabet-intro"><strong>Je repasse sur chaque lettre.</strong><span>Une lettre à la fois.</span>
        </div>
        <div className="alphabet-grid">{ALPHABET.map((letter) => <div className="letter-cell" key={letter}>
            <HandwritingText style={style}
                             className="trace">{style === "script" ? letter.toLocaleLowerCase("fr-FR") : letter}</HandwritingText>
        </div>)}</div>
    </article>;
}

export function WritingScreen({profile, onBack}: { profile: Profile; onBack(): void }) {
    const isKindergarten = profile.schoolLevel === "maternelle";
    const [date, setDate] = useState(today);
    const [style, setStyle] = useState<WritingStyle>(isKindergarten ? "capitales" : "script");
    const [days, setDays] = useState<WritingDay[]>(() => [{id: makeId(), text: generatedWriting(profile, "phrase")}]);
    const updateDay = (id: string, text: string) => setDays((current) => current.map((day) => day.id === id ? {
        ...day,
        text
    } : day));
    const generate = (id: string, kind: "word" | "phrase") => updateDay(id, generatedWriting(profile, kind));
    const addDay = () => setDays((current) => current.length >= 4 ? current : [...current, {
        id: makeId(),
        text: generatedWriting(profile, "phrase")
    }]);
    const removeDay = (id: string) => setDays((current) => current.length === 1 ? current : current.filter((day) => day.id !== id));

    return <section className="writing-page">
        <div className="writing-toolbar">
            <BackButton onClick={onBack}/>
            <br/>
            <div><span className="eyebrow">Écriture · {profile.schoolLevel.toUpperCase()}</span>
                <h1>{isKindergarten ? "Ma fiche alphabet" : "Créer une fiche d’écriture"}</h1>
                <p>{isKindergarten ? "De grandes lettres grisées à repasser dans un quadrillage." : "Composez jusqu’à quatre exercices sur une seule page A4."}</p>
            </div>
            <div className="writing-options"><label><span>Date de la fiche</span><input type="date" value={date}
                                                                                        onChange={(event) => setDate(event.target.value)}/></label>
                <div className="field"><span>Type d’exemple</span>
                    <div className="segmented">
                        <button className={style === "capitales" ? "active" : ""}
                                onClick={() => setStyle("capitales")}>CAPITALES
                        </button>
                        <button className={style === "script" ? "active script-option" : "script-option"}
                                onClick={() => setStyle("script")}>Cursive Marelle
                        </button>
                    </div>
                </div>
            </div>
            {!isKindergarten &&
                <div className="day-configurator">{days.map((day, index) => <div className="day-editor" key={day.id}>
                    <div className="day-editor-heading"><strong>Jour {index + 1}</strong>{days.length > 1 &&
                        <button onClick={() => removeDay(day.id)}
                                aria-label={`Retirer le jour ${index + 1}`}>✕</button>}</div>
                    <textarea value={day.text} onChange={(event) => updateDay(day.id, event.target.value)}
                              maxLength={70} rows={2} placeholder="Saisir un mot ou une phrase"/>
                    <div>
                        <button onClick={() => generate(day.id, "word")}>Générer un mot</button>
                        <button onClick={() => generate(day.id, "phrase")}>Générer une phrase</button>
                    </div>
                </div>)}{days.length < 4 &&
                    <button className="add-day-button" onClick={addDay}>+ Ajouter un jour sur cette
                        page</button>}</div>}
            <button className="primary-button print-button" onClick={() => window.print()}>Imprimer la fiche</button>
            <small className="print-tip">Dans la fenêtre d’impression, choisissez A4 et une échelle de 100 %.</small>
        </div>
        <div className="worksheet-preview">
            <div className="preview-label">Aperçu A4</div>
            {isKindergarten ? <KindergartenWorksheet profile={profile} date={date} style={style}/> :
                <PrimaryWorksheet profile={profile} date={date} style={style} days={days}/>}</div>
    </section>;
}
