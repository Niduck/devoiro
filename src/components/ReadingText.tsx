import type { ReadingAids, ReadingItem } from "../types";

const SOUND_PATTERN = /(eaux|eau|ain|ein|oin|ien|œu|oeu|ou|ai|ei|eu|oi|au|on|om|an|am|en|em|in|im|un)/gi;
const EXACT_SOUND_PATTERN = /^(eaux|eau|ain|ein|oin|ien|œu|oeu|ou|ai|ei|eu|oi|au|on|om|an|am|en|em|in|im|un)$/i;

function WithSounds({ text, enabled }: { text: string; enabled: boolean }) {
  if (!enabled) return <>{text}</>;
  return <>{text.split(SOUND_PATTERN).map((part, index) => EXACT_SOUND_PATTERN.test(part) ? <mark key={`${part}-${index}`}>{part}</mark> : part)}</>;
}

export function ReadingText({ item, aids, readWords }: { item: ReadingItem; aids: ReadingAids; readWords: number }) {
  const fontClass = `reading-font-${aids.font || "nunito"}`;
  if (item.kind === "word") {
    if (aids.syllables && item.syllables) return <div className={`reading-word syllable-view ${fontClass}`}><div>{item.syllables.map((syllable, index) => <span key={`${syllable}-${index}`}><WithSounds text={syllable} enabled={aids.complexSounds} />{index < item.syllables!.length - 1 && <i>·</i>}</span>)}</div><small><WithSounds text={item.text} enabled={aids.complexSounds} /></small></div>;
    return <div className={`reading-word ${fontClass}`}><WithSounds text={item.text} enabled={aids.complexSounds} /></div>;
  }

  const parts = item.text.split(/(\s+)/);
  return <div className={`reading-phrase ${fontClass}`}>{parts.map((part, index) => {
    if (/\s+/.test(part)) return part;
    const current = parts.slice(0, index).filter((candidate) => candidate && !/\s+/.test(candidate)).length;
    return <span className={current < readWords ? "read" : ""} key={`${part}-${index}`}><WithSounds text={part} enabled={aids.complexSounds} /></span>;
  })}</div>;
}
