import type { Profile, ReadingItem } from "../types";

export const COMPLEX_SOUNDS = /(eaux|eau|ain|ein|oin|ien|œu|oeu|ou|ai|ei|eu|oi|au|on|om|an|am|en|em|in|im|un)/gi;

export function normalize(text: string) {
  return text.toLocaleLowerCase("fr-FR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, " ").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function distance(first: string, second: string) {
  const row = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let i = 1; i <= first.length; i += 1) {
    let previous = row[0]; row[0] = i;
    for (let j = 1; j <= second.length; j += 1) {
      const saved = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (first[i - 1] === second[j - 1] ? 0 : 1));
      previous = saved;
    }
  }
  return row[second.length];
}

const OPTIONAL_SPOKEN_WORDS = new Set(["un", "une", "le", "la", "les", "l", "de", "des", "du", "d", "au", "aux", "et", "en"]);
const FLEXIBLE_ENDINGS = new Set(["e", "s", "x", "t", "d"]);

function wordMatches(expected: string, heard: string) {
  if (expected === heard) return true;

  // La reconnaissance vocale écrit souvent une forme voisine qui se prononce
  // pareil : « vol » pour « vole », « un » pour « une » ou « le » pour « les ».
  const shortest = expected.length <= heard.length ? expected : heard;
  const longest = expected.length > heard.length ? expected : heard;
  if (shortest.length >= 2 && longest.length === shortest.length + 1 && longest.startsWith(shortest) && FLEXIBLE_ENDINGS.has(longest.at(-1) || "")) return true;

  const tolerance = expected.length >= 9 ? 2 : expected.length >= 5 ? 1 : 0;
  return tolerance > 0 && Math.abs(heard.length - expected.length) <= tolerance && distance(heard, expected) <= tolerance;
}

export function readingMatches(expected: string, transcript: string, context = transcript) {
  const heard = normalize(`${context} ${transcript}`);
  const target = normalize(expected);
  if (!heard || !target) return false;
  if (target.includes(" ")) return heard.includes(target) || readPrefixCount(target, heard) >= target.split(" ").length;
  const tokens = heard.split(" ");
  const candidates = new Set(tokens);
  for (let start = 0; start < tokens.length; start += 1) {
    let assembled = "";
    for (let end = start; end < Math.min(tokens.length, start + 3); end += 1) {
      assembled += tokens[end]; candidates.add(assembled);
    }
  }
  return [...candidates].some((candidate) => wordMatches(target, candidate));
}

export function readPrefixCount(phrase: string, spoken: string) {
  const heardWords = normalize(spoken).split(" ").filter(Boolean);
  const phraseWords = normalize(phrase).split(" ").filter(Boolean);
  let best = 0;
  for (let start = 0; start < heardWords.length; start += 1) {
    let phraseIndex = 0;
    let matchedAnything = false;
    let noise = 0;
    for (let heardIndex = start; heardIndex < heardWords.length && phraseIndex < phraseWords.length;) {
      const heard = heardWords[heardIndex];
      const expected = phraseWords[phraseIndex];
      if (wordMatches(expected, heard)) {
        phraseIndex += 1;
        heardIndex += 1;
        matchedAnything = true;
        noise = 0;
        best = Math.max(best, phraseIndex);
        continue;
      }

      // Les déterminants très courts disparaissent régulièrement des résultats
      // du micro. On ne les colore qu’une fois le mot suivant reconnu.
      if (OPTIONAL_SPOKEN_WORDS.has(expected)) {
        phraseIndex += 1;
        continue;
      }

      if (phraseIndex > 0 && noise < 2) {
        noise += 1;
        heardIndex += 1;
        continue;
      }
      break;
    }

    if (matchedAnything) {
      while (phraseIndex < phraseWords.length && OPTIONAL_SPOKEN_WORDS.has(phraseWords[phraseIndex])) phraseIndex += 1;
      best = Math.max(best, phraseIndex);
    }
  }
  return best;
}

export function fastThresholdMs(profile: Profile, item: ReadingItem) {
  const base = profile.schoolLevel === "maternelle" ? 4400 : profile.schoolLevel === "cp" ? 3300 : 2600;
  const periodFactor = profile.period === "debut" ? 1.2 : profile.period === "fin" ? .85 : 1;
  const words = normalize(item.text).split(" ").length;
  return item.kind === "phrase" ? Math.max(5000, words * base * .58 * periodFactor) : base * periodFactor;
}
