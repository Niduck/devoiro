export type SchoolLevel = "maternelle" | "cp" | "ce1";
export type ActivityLevel = "ps" | "ms" | "gs" | "cp" | "ce1";
export type SchoolPeriod = "debut" | "milieu" | "fin";
export type ReadingLevel = "facile" | "moyen" | "difficile";
export type ActivityMode = "ponctuel" | "quotidien";
export type DevoirosId = "devoiros-1" | "devoiros-2" | "devoiros-3" | "devoiros-4" | "devoiros-5";

export type Reward = {
  id: string;
  label: string;
  rarity: "commune" | "peu_commune" | "rare";
  enabled: boolean;
  custom?: boolean;
};

export type Profile = {
  id: string;
  name: string;
  devoiros?: DevoirosId;
  schoolLevel: SchoolLevel;
  period: SchoolPeriod;
  rewards: Reward[];
  completedDailySessions: number;
};

export type ReadingItem = {
  text: string;
  syllables?: string[];
  kind: "word" | "phrase";
};

export type ReadingAids = {
  syllables: boolean;
  complexSounds: boolean;
  font: "outfit" | "nunito" | "quicksand" | "marelle-baton" | "marelle";
};

export type DailyStep = {
  title: string;
  instruction: string;
  level: ReadingLevel;
  target: number;
  seconds: number;
};

export type DailyJourneyStep =
  | (DailyStep & { activity: "reading" })
  | { activity: "colors" | "shapes" | "letter-name" | "letter-sound" | "alphabet-song" | "decoding" | "encoding"; title: string; instruction: string };

export type AppData = {
  version: 1;
  profiles: Profile[];
  selectedProfileId: string | null;
};
