export const ROUTE_PATTERNS = {
  landing: "/",
  workspace: "/espace",
  activities: "/activites",
  worksheets: "/fiches",
  reading: "/activites/lecture",
  colors: "/activites/maternelle/couleurs",
  shapes: "/activites/maternelle/formes",
  letterNames: "/activites/maternelle/nom-des-lettres",
  alphabetSong: "/activites/maternelle/alphabet-chante",
  letterSounds: "/activites/maternelle/son-des-lettres",
  composer: "/fiches/composer",
  alphabetWorksheet: "/fiches/alphabet",
  punctualSetup: "/activites/lecture/ponctuelle",
  dailyOverview: "/activites/lecture/quotidienne",
  instruction: "/activites/lecture/consigne",
  session: "/activites/lecture/session",
  stepResult: "/activites/lecture/resultat",
  reward: "/activites/lecture/recompense",
} as const;

export const routes = {
  ...ROUTE_PATTERNS,
} as const;
