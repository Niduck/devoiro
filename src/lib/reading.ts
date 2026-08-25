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
  if ([...candidates].some((candidate) => candidate === target || candidate.includes(target))) return true;
  const tolerance = target.length >= 9 ? 2 : target.length >= 5 ? 1 : 0;
  return tolerance > 0 && [...candidates].some((candidate) => Math.abs(candidate.length - target.length) <= tolerance && distance(candidate, target) <= tolerance);
}

export function readPrefixCount(phrase: string, spoken: string) {
  const heardWords = normalize(spoken).split(" ").filter(Boolean);
  const phraseWords = normalize(phrase).split(" ").filter(Boolean);
  let best = 0;
  for (let start = 0; start < heardWords.length; start += 1) {
    let matched = 0;
    let noise = 0;
    for (let heardIndex = start; heardIndex < heardWords.length && matched < phraseWords.length; heardIndex += 1) {
      const heard = heardWords[heardIndex];
      const expected = phraseWords[matched];
      const tolerance = expected.length >= 6 ? 1 : 0;
      const sameWord = heard === expected || (tolerance > 0 && Math.abs(heard.length - expected.length) <= tolerance && distance(heard, expected) <= tolerance);
      if (sameWord) { matched += 1; noise = 0; }
      else if (matched > 0) { noise += 1; if (noise > 2) break; }
      else break;
    }
    best = Math.max(best, matched);
  }
  return best;
}

export function fastThresholdMs(profile: Profile, item: ReadingItem) {
  const base = profile.schoolLevel === "maternelle" ? 4400 : profile.schoolLevel === "cp" ? 3300 : 2600;
  const periodFactor = profile.period === "debut" ? 1.2 : profile.period === "fin" ? .85 : 1;
  const words = normalize(item.text).split(" ").length;
  return item.kind === "phrase" ? Math.max(5000, words * base * .58 * periodFactor) : base * periodFactor;
}
