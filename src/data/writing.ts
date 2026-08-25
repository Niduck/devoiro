import type { Profile } from "../types";

const CP_WORDS = [
  "chat", "lune", "vélo", "maison", "lapin", "école", "jardin", "soleil", "bateau", "souris",
  "arbre", "avion", "ballon", "banane", "cahier", "camion", "canard", "carotte", "cerise", "chaise",
  "cheval", "citron", "crayon", "étoile", "fenêtre", "fleur", "forêt", "fourmi", "fraise", "gâteau",
  "girafe", "gomme", "lampe", "livre", "mouton", "nuage", "orange", "papillon", "pluie", "poisson",
  "pomme", "poule", "requin", "robot", "sapin", "table", "tigre", "tomate", "train", "tortue",
];
const CP_PHRASES = [
  "Le chat dort sur le tapis.",
  "Lina joue dans le jardin.",
  "Le lapin mange une carotte.",
  "Il fait beau ce matin.",
  "Mon vélo est bleu.",
  "La poule picore du grain.",
  "Le chien court après la balle.",
  "Papa prépare une soupe.",
  "Maman ouvre la fenêtre.",
  "Le soleil brille dans le ciel.",
  "Une étoile éclaire la nuit.",
  "Le poisson nage dans l'eau.",
  "La tortue avance doucement.",
  "Le train arrive à la gare.",
  "Nous dessinons un grand arbre.",
  "Le canard plonge dans la mare.",
  "Ma sœur lit un petit livre.",
  "Un papillon vole sur la fleur.",
  "Le camion roule sur la route.",
  "Je range mes crayons dans la trousse.",
  "Le bébé joue avec son ballon.",
  "La souris se cache sous la table.",
  "Il pleut sur le toit de la maison.",
  "Nous mangeons une pomme rouge.",
  "Le bateau quitte le port.",
  "Le renard traverse le chemin.",
  "La girafe regarde les nuages.",
  "Mon ami apporte un gâteau.",
  "Le cheval galope dans le pré.",
  "La grenouille saute dans l'herbe.",
];
const CE1_WORDS = [
  "aventure", "coccinelle", "bibliothèque", "dinosaure", "merveilleux", "montagne", "écureuil", "papillon",
  "aquarium", "balançoire", "calendrier", "carnaval", "cascade", "chocolat", "crocodile", "dauphin",
  "découverte", "délicieux", "équilibre", "explorateur", "fantastique", "girouette", "gourmandise", "hélicoptère",
  "hippocampe", "imagination", "instrument", "labyrinthe", "locomotive", "magicien", "marionnette", "météorite",
  "mystérieux", "navigateur", "orchestre", "ordinateur", "parapluie", "personnage", "photographie", "planète",
  "pyramide", "restaurant", "rhinocéros", "souterrain", "téléphone", "tournesol", "trampoline", "vétérinaire",
];
const CE1_PHRASES = [
  "Le petit renard traverse la forêt.",
  "Nous préparons un gâteau au chocolat.",
  "Les oiseaux chantent dans le grand arbre.",
  "Demain, nous irons visiter le musée.",
  "La lumière du soleil entre par la fenêtre.",
  "Le jeune explorateur observe une étrange planète.",
  "Une coccinelle se pose doucement sur ma manche.",
  "La locomotive rouge traverse le vieux pont.",
  "Nous cherchons la sortie de ce grand labyrinthe.",
  "Le dauphin bondit au-dessus des vagues bleues.",
  "Mon frère construit une cabane derrière la maison.",
  "Les feuilles tourbillonnent dans le vent d'automne.",
  "La bibliothécaire range les nouveaux albums.",
  "Un écureuil grimpe rapidement le long du tronc.",
  "Le magicien fait disparaître son chapeau noir.",
  "Notre classe prépare un spectacle pour les familles.",
  "La pluie frappe doucement les vitres de la cuisine.",
  "Cette mystérieuse boîte contient une vieille carte.",
  "Le jardinier arrose les fleurs avant le coucher du soleil.",
  "Nous observons les étoiles avec un petit télescope.",
  "Le vétérinaire soigne un jeune hérisson blessé.",
  "Une montgolfière colorée avance au-dessus des champs.",
  "Les enfants inventent une histoire pleine de surprises.",
  "Le cuisinier mélange soigneusement tous les ingrédients.",
  "Une rivière tranquille serpente entre les montagnes.",
  "Le chevalier découvre une porte derrière le rideau.",
  "Chaque matin, le boulanger prépare du pain croustillant.",
  "Le papillon déploie ses ailes aux couleurs éclatantes.",
  "Nous installons les décorations avant le début de la fête.",
  "Le petit robot transporte les outils jusqu'à l'atelier.",
];

const lastGenerated = new Map<string, string>();

function pick(values: string[], key: string) {
  const previous = lastGenerated.get(key);
  const available = values.length > 1 ? values.filter((value) => value !== previous) : values;
  const selected = available[Math.floor(Math.random() * available.length)];
  lastGenerated.set(key, selected);
  return selected;
}

export function generatedWriting(profile: Profile, kind: "word" | "phrase") {
  const advanced = profile.schoolLevel === "ce1";
  const level = advanced ? "ce1" : "cp";
  if (kind === "word") return pick(advanced ? CE1_WORDS : CP_WORDS, `${level}-word`);
  return pick(advanced ? CE1_PHRASES : CP_PHRASES, `${level}-phrase`);
}
