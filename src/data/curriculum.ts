import type { ActivityLevel, DailyJourneyStep, Profile, ReadingItem, ReadingLevel } from "../types";

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
    word("pomme", "pom-me"), word("poire", "poi-re"), word("banane", "ba-na-ne"), word("fraise", "frai-se"), word("cerise", "ce-ri-se"),
    word("melon", "me-lon"), word("citron", "ci-tron"), word("orange", "o-ran-ge"), word("tomate", "to-ma-te"), word("salade", "sa-la-de"),
    word("table", "ta-ble"), word("chaise", "chai-se"), word("porte", "por-te"), word("fenêtre", "fe-nê-tre"), word("lampe", "lam-pe"),
    word("livre", "li-vre"), word("cahier", "ca-hier"), word("crayon", "cra-yon"), word("gomme", "gom-me"), word("règle", "rè-gle"),
    word("trousse", "trous-se"), word("cartable", "car-ta-ble"), word("école", "é-co-le"), word("ballon", "bal-lon"), word("poupée", "pou-pée"),
    word("robot", "ro-bot"), word("voiture", "voi-tu-re"), word("camion", "ca-mion"), word("vélo", "vé-lo"), word("train", "train"),
    word("bateau", "ba-teau"), word("avion", "a-vion"), word("fusée", "fu-sée"), word("maison", "mai-son"), word("jardin", "jar-din"),
    word("arbre", "ar-bre"), word("fleur", "fleur"), word("feuille", "feuille"), word("rivière", "ri-viè-re"), word("nuage", "nua-ge"),
    word("pluie", "pluie"), word("neige", "nei-ge"), word("vent", "vent"), word("matin", "ma-tin"), word("soir", "soir"),
    word("maman", "ma-man"), word("papa", "pa-pa"), word("bébé", "bé-bé"), word("ami", "a-mi"), word("frère", "frè-re"), word("sœur", "sœur"),
  ],
  moyen: [
    word("aventure", "a-ven-tu-re"), word("bibliothèque", "bi-blio-thè-que"), word("chocolat", "cho-co-lat"), word("dinosaure", "di-no-sau-re"),
    word("équilibre", "é-qui-li-bre"), word("formidable", "for-mi-da-ble"), word("imagination", "i-ma-gi-na-tion"), word("labyrinthe", "la-by-rin-the"),
    word("montgolfière", "mont-gol-fiè-re"), word("nénuphar", "né-nu-phar"), word("orchestre", "or-ches-tre"), word("parapluie", "pa-ra-pluie"),
    word("silencieux", "si-len-cieux"), word("trampoline", "tram-po-li-ne"), word("xylophone", "xy-lo-pho-ne"), word("bricolage", "bri-co-la-ge"),
    word("calendrier", "ca-len-drier"), word("délicieux", "dé-li-cieux"), word("fantastique", "fan-tas-ti-que"), word("hélicoptère", "hé-li-cop-tè-re"),
    word("lumineux", "lu-mi-neux"), word("mystérieux", "mys-té-rieux"), word("ordinateur", "or-di-na-teur"), word("restaurant", "res-tau-rant"),
    word("tournesol", "tour-ne-sol"),
    word("aquarium", "a-qua-rium"), word("balançoire", "ba-lan-çoi-re"), word("casserole", "cas-se-ro-le"), word("cheminée", "che-mi-née"),
    word("couverture", "cou-ver-tu-re"), word("crocodile", "cro-co-di-le"), word("décoration", "dé-co-ra-tion"), word("électricité", "é-lec-tri-ci-té"),
    word("enveloppe", "en-ve-lop-pe"), word("épouvantail", "é-pou-van-tail"), word("escabeau", "es-ca-beau"), word("éventail", "é-ven-tail"),
    word("explorateur", "ex-plo-ra-teur"), word("félicitation", "fé-li-ci-ta-tion"), word("funambule", "fu-nam-bu-le"), word("gourmandise", "gour-man-di-se"),
    word("hippocampe", "hip-po-cam-pe"), word("instrument", "ins-tru-ment"), word("jongleur", "jon-gleur"), word("locomotive", "lo-co-mo-ti-ve"),
    word("magicien", "ma-gi-cien"), word("marionnette", "ma-ri-on-net-te"), word("médicament", "mé-di-ca-ment"), word("météorite", "mé-té-o-ri-te"),
    word("moustiquaire", "mous-ti-quai-re"), word("navigateur", "na-vi-ga-teur"), word("observatoire", "ob-ser-va-toi-re"), word("pâtisserie", "pâ-tis-se-rie"),
    word("personnage", "per-son-na-ge"), word("photographie", "pho-to-gra-phie"), word("planète", "pla-nè-te"), word("poussette", "pous-set-te"),
    word("pyramide", "py-ra-mi-de"), word("radiateur", "ra-dia-teur"), word("récréation", "ré-cré-a-tion"), word("rhinocéros", "rhi-no-cé-ros"),
    word("souterrain", "sou-ter-rain"), word("téléphone", "té-lé-pho-ne"), word("télévision", "té-lé-vi-sion"), word("vétérinaire", "vé-té-ri-nai-re"),
    word("volcanique", "vol-ca-ni-que"),
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
    phrase("Le chien rapporte la balle à son maître."), phrase("Une petite tortue traverse lentement le chemin."),
    phrase("Papa range les courses dans la cuisine."), phrase("Le canard nage au milieu des roseaux."),
    phrase("Léa choisit un livre plein d'images."), phrase("Un écureuil cache une noisette sous les feuilles."),
    phrase("Le vent pousse les nuages vers la montagne."), phrase("Nous plantons des graines dans un petit pot."),
    phrase("Le camion rouge s'arrête devant la maison."), phrase("La maîtresse écrit la date au tableau."),
    phrase("Mon frère cherche ses chaussures sous le lit."), phrase("Une étoile filante traverse le ciel."),
    phrase("Les poissons colorés nagent dans l'aquarium."), phrase("Le jardinier arrose les jeunes tomates."),
    phrase("La souris grignote un morceau de fromage."), phrase("Nous écoutons une histoire avant de dormir."),
    phrase("Le facteur dépose une lettre dans la boîte."), phrase("Une coccinelle marche sur une feuille verte."),
    phrase("Le bateau rentre au port avant la nuit."), phrase("Les élèves préparent leurs cahiers et leurs crayons."),
    phrase("Le petit robot avance au milieu du laboratoire."), phrase("Mamie fabrique une écharpe douce et colorée."),
    phrase("Le cuisinier coupe les légumes pour la soupe."), phrase("La lune éclaire le sentier dans la forêt."),
    phrase("Un arc-en-ciel apparaît après la pluie."), phrase("Le singe attrape une banane avec sa main."),
    phrase("Notre équipe construit une grande tour en bois."), phrase("Le réveil sonne lorsque le soleil se lève."),
    phrase("Une montgolfière survole les champs jaunes."), phrase("Les enfants observent les fourmis dans le jardin."),
    phrase("Le chevalier ouvre doucement la porte du château."), phrase("Nous préparons nos valises pour partir en vacances."),
    phrase("La bibliothécaire conseille un roman amusant."), phrase("Le vétérinaire examine la patte du jeune chien."),
    phrase("Les vagues effacent nos traces sur le sable."),
  ],
};

export function dailyJourney(profile: Profile, activityLevel?: ActivityLevel): DailyJourneyStep[] {
  if (activityLevel === "ps") {
    return shuffleJourneySteps([
      { activity: "colors", title: "Le jeu des couleurs", instruction: "Reconnaître et nommer des couleurs." },
      { activity: "shapes", title: "Le jeu des formes", instruction: "Reconnaître et nommer des formes simples." },
      { activity: "alphabet-song", title: "L’alphabet en chanson", instruction: "Découvrir les lettres en chantant, sans objectif de mémorisation." },
    ]).slice(0, 2);
  }

  if (activityLevel === "ms") {
    const steps: DailyJourneyStep[] = [
      { activity: "colors", title: "Le jeu des couleurs", instruction: "Réviser les couleurs à voix haute." },
      { activity: "shapes", title: "Le jeu des formes", instruction: "Nommer les formes qui apparaissent." },
      { activity: "alphabet-song", title: "L’alphabet en chanson", instruction: "Suivre les lettres dans l’ordre." },
    ];
    if (profile.period !== "debut") steps.push({ activity: "letter-name", title: "Le nom des lettres", instruction: "Reconnaître quelques lettres dans le désordre." });
    if (profile.period !== "debut") steps.push({ activity: "encoding", title: "J’encode", instruction: "Écouter puis retrouver l’écriture d’un son simple." });
    if (profile.period === "fin") steps.push({ activity: "decoding", title: "Je décode", instruction: "Découvrir la fusion de quelques sons simples." });
    return shuffleJourneySteps(steps).slice(0, 3);
  }

  if (activityLevel === "gs") {
    const steps: DailyJourneyStep[] = [
      { activity: "letter-name", title: "Le nom des lettres", instruction: "Reconnaître les lettres dans le désordre." },
      { activity: "alphabet-song", title: "L’alphabet en chanson", instruction: "Suivre les lettres dans l’ordre." },
    ];
    if (profile.period !== "debut") steps.push({ activity: "letter-sound", title: "Le son des lettres", instruction: "Dire le son le plus courant de chaque lettre." });
    steps.push({ activity: "encoding", title: "J’encode", instruction: "Écouter puis retrouver l’écriture d’une syllabe ou d’un mot transparent." });
    steps.push({ activity: "decoding", title: "Je décode", instruction: "Lire des syllabes puis des mots transparents." });
    return shuffleJourneySteps(steps).slice(0, 3);
  }

  return [
    { activity: "reading", title: "Mots familiers", instruction: "Commencer par des mots courts et connus.", level: "facile", target: 4, seconds: 60 },
    { activity: "reading", title: "Mots plus longs", instruction: "Continuer avec plusieurs syllabes et des sons complexes.", level: "moyen", target: 4, seconds: 70 },
    { activity: "reading", title: "Petites phrases", instruction: "Terminer avec des phrases complètes.", level: "difficile", target: 2, seconds: 80 },
  ];
}

function shuffleJourneySteps(steps: DailyJourneyStep[]) {
  const result = [...steps];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function shuffleItems(items: ReadingItem[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}
