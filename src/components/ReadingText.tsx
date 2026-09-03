import { graphemeUnitsForItem, guidedUnitsForItem, readingUnits, type ReadingUnit } from "../lib/phonics";
import type { ReadingAids, ReadingItem } from "../types";

const VOWEL_PATTERN = /[aeiouyàâäéèêëîïôöùûüÿœ]/i;

function WithSounds({ text, enabled }: { text: string; enabled: boolean }) {
  if (!enabled) return <>{text}</>;
  return <>{readingUnits(text, null).map((unit, index) => unit.kind === "complex" ? <mark key={`${unit.text}-${index}`}>{unit.text}</mark> : unit.text)}</>;
}

function UnitList({ units, aids, separated = false }: { units: ReadingUnit[]; aids: ReadingAids; separated?: boolean }) {
  return <>{units.map((unit, index) => {
    const nextUnit = units[index + 1];
    const attachSilentEnding = nextUnit?.kind === "silent" && unit.kind === "simple" && !VOWEL_PATTERN.test(unit.text);
    return <span className={`reading-unit ${unit.kind === "complex" && aids.complexSounds ? "complex" : ""} ${unit.kind === "silent" && aids.silentLetters ? "silent" : ""}`} key={`${unit.text}-${index}`}>{unit.text}{separated && nextUnit && !attachSilentEnding && <i>·</i>}</span>;
  })}</>;
}

function ReadingUnits({ text, aids, silentEnding }: { text: string; aids: ReadingAids; silentEnding?: string | null }) {
  return <UnitList units={readingUnits(text, silentEnding)} aids={aids} />;
}

export function AssistedWord({ item, aids, className = "" }: { item: ReadingItem; aids: ReadingAids; className?: string }) {
  const fontClass = `reading-font-${aids.font || "nunito"}`;

  if (aids.segmentation === "graphemes") {
    return <div className={`reading-word segmented-view grapheme-view ${fontClass} ${className}`}><div><UnitList units={graphemeUnitsForItem(item)} aids={aids} separated /></div><small><UnitList units={graphemeUnitsForItem(item)} aids={aids} /></small></div>;
  }

  if (aids.segmentation === "guided") {
    return <div className={`reading-word segmented-view guided-view ${fontClass} ${className}`}><div><UnitList units={guidedUnitsForItem(item)} aids={aids} separated /></div><small><UnitList units={graphemeUnitsForItem(item)} aids={aids} /></small></div>;
  }

  if (aids.segmentation === "syllables" && item.syllables) {
    return <div className={`reading-word syllable-view ${fontClass} ${className}`}><div>{item.syllables.map((syllable, index) => <span key={`${syllable}-${index}`}><ReadingUnits text={syllable} silentEnding={index === item.syllables!.length - 1 ? item.silentEnding : null} aids={aids} />{index < item.syllables!.length - 1 && <i>·</i>}</span>)}</div><small><ReadingUnits text={item.text} silentEnding={item.silentEnding} aids={aids} /></small></div>;
  }

  return <div className={`reading-word ${fontClass} ${className}`}><UnitList units={graphemeUnitsForItem(item)} aids={aids} /></div>;
}

export function ReadingText({ item, aids, readWords }: { item: ReadingItem; aids: ReadingAids; readWords: number }) {
  if (item.kind === "word") return <AssistedWord item={item} aids={aids} />;

  const fontClass = `reading-font-${aids.font || "nunito"}`;
  const parts = item.text.split(/(\s+)/);
  return <div className={`reading-phrase ${fontClass}`}>{parts.map((part, index) => {
    if (/\s+/.test(part)) return part;
    const current = parts.slice(0, index).filter((candidate) => candidate && !/\s+/.test(candidate)).length;
    return <span className={current < readWords ? "read" : ""} key={`${part}-${index}`}><WithSounds text={part} enabled={aids.complexSounds} /></span>;
  })}</div>;
}
