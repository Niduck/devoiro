import type { Profile } from "../types";

const CP_WORDS = ["chat", "lune", "vélo", "maison", "lapin", "école", "jardin", "soleil", "bateau", "souris"];
const CP_PHRASES = [
  "Le chat dort sur le tapis.",
  "Lina joue dans le jardin.",
  "Le lapin mange une carotte.",
  "Il fait beau ce matin.",
  "Mon vélo est bleu.",
];
const CE1_WORDS = ["aventure", "coccinelle", "bibliothèque", "dinosaure", "merveilleux", "montagne", "écureuil", "papillon"];
const CE1_PHRASES = [
  "Le petit renard traverse la forêt.",
  "Nous préparons un gâteau au chocolat.",
  "Les oiseaux chantent dans le grand arbre.",
  "Demain, nous irons visiter le musée.",
  "La lumière du soleil entre par la fenêtre.",
];

function pick(values: string[]) {
  return values[Math.floor(Math.random() * values.length)];
}

export function generatedWriting(profile: Profile, kind: "word" | "phrase") {
  const advanced = profile.schoolLevel === "ce1";
  if (kind === "word") return pick(advanced ? CE1_WORDS : CP_WORDS);
  return pick(advanced ? CE1_PHRASES : CP_PHRASES);
}
