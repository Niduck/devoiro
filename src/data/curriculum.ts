import type { DailyStep, Profile, ReadingItem, ReadingLevel } from "../types";

const word = (text: string, syllables: string): ReadingItem => ({ text, syllables: syllables.split("-"), kind: "word" });
const phrase = (text: string): ReadingItem => ({ text, kind: "phrase" });

export const READING_LEVELS: Array<{ id: ReadingLevel; title: string; detail: string; example: string; icon: string }> = [
  { id: "facile", title: "Mots familiers", detail: "Des mots courts du quotidien", example: "chat · souris · lapin", icon: "01" },
  { id: "moyen", title: "Mots plus longs", detail: "Plusieurs syllabes et sons complexes", example: "aventure · lumineux", icon: "02" },
  { id: "difficile", title: "Petites phrases", detail: "Des phrases complètes à lire", example: "Le chat dort sur le canapé.", icon: "03" },
];

export const CONTENT: Record<ReadingLevel, ReadingItem[]> = {
  facile: [
    word("chat", "chat"), word("chien", "chien"), word("lion", "lion"), word("tigre", "ti-gre"), word("lapin", "la-pin"),
    word("souris", "sou-ris"), word("cheval", "che-val"), word("vache", "va-che"), word("mouton", "mou-ton"), word("chèvre", "chè-vre"),
    word("cochon", "co-chon"), word("poule", "poule"), word("canard", "ca-nard"), word("oie", "oie"), word("dinde", "din-de"),
    word("âne", "âne"), word("zèbre", "zè-bre"), word("girafe", "gi-ra-fe"), word("singe", "sin-ge"), word("panda", "pan-da"),
    word("koala", "ko-a-la"), word("ours", "ours"), word("loup", "loup"), word("renard", "re-nard"), word("cerf", "cerf"),
    word("biche", "bi-che"), word("hérisson", "hé-ris-son"), word("écureuil", "é-cu-reuil"), word("castor", "cas-tor"), word("loutre", "lou-tre"),
    word("phoque", "pho-que"), word("dauphin", "dau-phin"), word("baleine", "ba-lei-ne"), word("requin", "re-quin"), word("pieuvre", "pieu-vre"),
    word("crabe", "cra-be"), word("tortue", "tor-tue"), word("grenouille", "gre-nou-ille"), word("lézard", "lé-zard"), word("serpent", "ser-pent"),
    word("aigle", "ai-gle"), word("hibou", "hi-bou"), word("pigeon", "pi-geon"), word("perroquet", "per-ro-quet"), word("flamant", "fla-mant"),
    word("papillon", "pa-pi-llon"), word("abeille", "a-beille"), word("fourmi", "four-mi"), word("coccinelle", "coc-ci-nelle"), word("escargot", "es-car-got"),
  ],
  moyen: [
    word("aventure", "a-ven-tu-re"), word("bibliothèque", "bi-blio-thè-que"), word("chocolat", "cho-co-lat"), word("dinosaure", "di-no-sau-re"),
    word("équilibre", "é-qui-li-bre"), word("formidable", "for-mi-da-ble"), word("imagination", "i-ma-gi-na-tion"), word("labyrinthe", "la-by-rin-the"),
    word("montgolfière", "mont-gol-fiè-re"), word("nénuphar", "né-nu-phar"), word("orchestre", "or-ches-tre"), word("parapluie", "pa-ra-pluie"),
    word("silencieux", "si-len-cieux"), word("trampoline", "tram-po-li-ne"), word("xylophone", "xy-lo-pho-ne"), word("bricolage", "bri-co-la-ge"),
    word("calendrier", "ca-len-drier"), word("délicieux", "dé-li-cieux"), word("fantastique", "fan-tas-ti-que"), word("hélicoptère", "hé-li-cop-tè-re"),
    word("lumineux", "lu-mi-neux"), word("mystérieux", "mys-té-rieux"), word("ordinateur", "or-di-na-teur"), word("restaurant", "res-tau-rant"),
    word("tournesol", "tour-ne-sol"),
  ],
  difficile: [
    phrase("Le petit chat dort sur le canapé."), phrase("Demain, nous irons jouer dans le jardin."),
    phrase("La girafe mange les feuilles de l'arbre."), phrase("Mon cartable bleu est rempli de livres."),
    phrase("Un papillon jaune vole près des fleurs."), phrase("Le train traverse rapidement la montagne."),
    phrase("Ma sœur prépare un délicieux gâteau."), phrase("Les étoiles brillent dans le ciel noir."),
    phrase("Nous construisons une cabane en bois."), phrase("Le dauphin saute au-dessus des vagues."),
    phrase("Le cheval blanc galope dans le pré."), phrase("Une grenouille se cache sous le nénuphar."),
    phrase("Les enfants dessinent un immense château."), phrase("La pluie tambourine doucement sur les fenêtres."),
    phrase("Le boulanger prépare du pain bien chaud."),
  ],
};

export function dailySteps(profile: Profile): DailyStep[] {
  const count = profile.schoolLevel === "maternelle" ? 3 : profile.schoolLevel === "cp" && profile.period !== "fin" ? 4 : 5;
  const wordSteps: DailyStep[] = [
    { title: "Échauffement", instruction: "Lis quelques mots familiers.", level: "facile", target: 3, seconds: 50 },
    { title: "Exploration", instruction: "Lis les mots sans te presser.", level: "facile", target: 4, seconds: 60 },
    { title: "Sons malins", instruction: "Repère les sons complexes.", level: "moyen", target: 4, seconds: 70 },
  ];
  const wordChallenge: DailyStep = { title: "Défi des mots", instruction: "Lis ces derniers mots avec assurance !", level: "moyen", target: 3, seconds: 70 };
  const phrases: DailyStep = { title: "Petites phrases", instruction: "Termine le parcours avec des phrases complètes.", level: "difficile", target: 2, seconds: 80 };

  if (count === 3) return wordSteps;
  if (count === 4) return [...wordSteps, phrases];
  return [...wordSteps, wordChallenge, phrases];
}

export function shuffleItems(items: ReadingItem[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
