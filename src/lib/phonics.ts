import type { ReadingAnnotatedUnit, ReadingItem } from "../types";

export type ReadingUnit = {
  text: string;
  kind: "simple" | "complex" | "silent";
};

/** Les graphèmes vocaliques mis en couleur lorsqu'ils codent un seul son. */
const COMPLEX_VOWEL_GRAPHEMES = ["eaux", "eau", "ain", "ein", "oin", "ien", "oeu", "œu", "ou", "ai", "ei", "eu", "oi", "au", "on", "om", "an", "am", "en", "em", "in", "im", "un"];

/** Ces graphèmes restent groupés, mais ne sont pas colorés pour ne pas surcharger le mot. */
const COMPLEX_CONSONANT_GRAPHEMES = ["ill", "ch", "ph", "gn", "qu"];
const ALL_MULTILETTER_GRAPHEMES = [...COMPLEX_VOWEL_GRAPHEMES, ...COMPLEX_CONSONANT_GRAPHEMES]
  .sort((first, second) => second.length - first.length);
const VOWEL_PATTERN = /[aeiouyàâäéèêëîïôöùûüÿœ]/i;
const NASAL_GRAPHEMES = new Set(["ain", "ein", "oin", "on", "om", "an", "am", "en", "em", "in", "im", "un"]);
const COMPLEX_CONSONANTS = new Set(COMPLEX_CONSONANT_GRAPHEMES);

function lower(value: string) {
  return value.toLocaleLowerCase("fr-FR");
}

/**
 * Une voyelle suivie d'une autre voyelle empêche généralement la lecture nasale.
 * Cela évite notamment de transformer le milieu de `canard` ou `camion` en `an`/`am`.
 * Les mots du corpus peuvent surcharger ce secours grâce à leurs annotations explicites.
 */
function isContextualGrapheme(text: string, index: number, grapheme: string) {
  if (!NASAL_GRAPHEMES.has(grapheme)) return true;
  const nextLetter = text[index + grapheme.length];
  if (!nextLetter) return true;
  return !VOWEL_PATTERN.test(nextLetter) && lower(nextLetter) !== grapheme.at(-1);
}

function graphemeAt(text: string, index: number) {
  const remaining = lower(text.slice(index));
  return ALL_MULTILETTER_GRAPHEMES.find((candidate) => remaining.startsWith(candidate) && isContextualGrapheme(text, index, candidate));
}

function splitSilentEnding(text: string, silentEnding?: string | null) {
  if (!silentEnding) return { spoken: text, silent: "" };
  if (lower(text).endsWith(lower(silentEnding))) {
    return { spoken: text.slice(0, -silentEnding.length), silent: text.slice(-silentEnding.length) };
  }
  return { spoken: text, silent: "" };
}

function fromAnnotations(units: ReadingAnnotatedUnit[]): ReadingUnit[] {
  return units.map((unit) => ({
    text: unit.text,
    kind: unit.silent ? "silent" : unit.complex ? "complex" : "simple",
  }));
}

/** Découpe de secours en graphèmes, utilisée lorsqu'un mot n'est pas encore annoté. */
export function graphemeUnits(text: string, silentEnding?: string | null): ReadingUnit[] {
  const { spoken, silent } = splitSilentEnding(text, silentEnding);
  const units: ReadingUnit[] = [];
  let cursor = 0;

  while (cursor < spoken.length) {
    const grapheme = graphemeAt(spoken, cursor);
    if (grapheme) {
      const value = spoken.slice(cursor, cursor + grapheme.length);
      units.push({ text: value, kind: COMPLEX_VOWEL_GRAPHEMES.includes(grapheme) ? "complex" : "simple" });
      cursor += grapheme.length;
      continue;
    }

    const current = spoken[cursor];
    const next = spoken[cursor + 1];
    if (next && lower(current) === lower(next) && /[bcdfgjklmnpqrstvwxyz]/i.test(current)) {
      units.push({ text: `${current}${next}`, kind: "simple" });
      cursor += 2;
      continue;
    }

    units.push({ text: current, kind: "simple" });
    cursor += 1;
  }

  if (silent) units.push({ text: silent, kind: "silent" });
  return units;
}

/**
 * Respecte les frontières syllabiques pour empêcher un graphème de traverser deux syllabes.
 * Une annotation lexicale explicite reste toujours prioritaire.
 */
export function graphemeUnitsForItem(item: ReadingItem): ReadingUnit[] {
  if (item.graphemes?.length) return fromAnnotations(item.graphemes);
  if (!item.syllables?.length) return graphemeUnits(item.text, item.silentEnding);

  return item.syllables.flatMap((syllable, index) => graphemeUnits(
    syllable,
    index === item.syllables!.length - 1 ? item.silentEnding : null,
  ));
}

function isVowelUnit(unit: ReadingUnit) {
  return VOWEL_PATTERN.test(unit.text);
}

/**
 * Construit des unités de fusion adaptées à la lecture : les attaques simples rejoignent
 * leur voyelle (`c` + `a` devient `ca`), tandis que les graphèmes complexes restent isolés.
 */
function guidedUnitsForSyllable(text: string, silentEnding?: string | null): ReadingUnit[] {
  const { spoken, silent } = splitSilentEnding(text, silentEnding);
  const graphemes = graphemeUnits(spoken, null);
  const units: ReadingUnit[] = [];
  let cursor = 0;

  while (cursor < graphemes.length) {
    const vowelIndex = graphemes.findIndex((unit, index) => index >= cursor && isVowelUnit(unit));
    if (vowelIndex < 0) {
      units.push({ text: graphemes.slice(cursor).map((unit) => unit.text).join(""), kind: "simple" });
      break;
    }

    const onset = graphemes.slice(cursor, vowelIndex);
    const vowel = graphemes[vowelIndex];
    const onsetText = onset.map((unit) => unit.text).join("");
    const hasComplexConsonant = onset.some((unit) => COMPLEX_CONSONANTS.has(lower(unit.text)));

    if (onsetText && (vowel.kind === "complex" || hasComplexConsonant)) {
      units.push({ text: onsetText, kind: "simple" });
      units.push(vowel);
    } else {
      units.push({ text: `${onsetText}${vowel.text}`, kind: vowel.kind });
    }

    cursor = vowelIndex + 1;
  }

  if (silent) units.push({ text: silent, kind: "silent" });
  return units.filter((unit) => unit.text.length > 0);
}

/** Retourne les unités d'assemblage relues ou, à défaut, leur meilleur secours calculé. */
export function guidedUnitsForItem(item: ReadingItem): ReadingUnit[] {
  if (item.guidedUnits?.length) return fromAnnotations(item.guidedUnits);
  if (!item.syllables?.length) return guidedUnitsForSyllable(item.text, item.silentEnding);

  return item.syllables.flatMap((syllable, index) => guidedUnitsForSyllable(
    syllable,
    index === item.syllables!.length - 1 ? item.silentEnding : null,
  ));
}

/** Alias sémantique pour la coloration d'un mot non séparé. */
export const readingUnits = graphemeUnits;
