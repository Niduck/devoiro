import { useMemo, useState } from "react";
import { dailySteps } from "./data/curriculum";
import { drawReward } from "./data/rewards";
import { ActivityScreen, ReadingMenu } from "./components/HomeScreens";
import { ProfileScreen, ProfileSettings } from "./components/ProfileScreen";
import { DailyOverview, PunctualSetup } from "./components/ReadingSetup";
import { DailyStepResult, FinalReward, ParentInstruction, ReadingSession, type SessionDefinition, type SessionResult } from "./components/ReadingFlow";
import { WritingScreen } from "./components/WritingScreen";
import { KindergartenOralActivity } from "./components/KindergartenActivities";
import { GraphismScreen } from "./components/GraphismScreen";
import { Shell } from "./components/Shell";
import { loadData, saveData, updateProfile } from "./lib/storage";
import type { AppData, Profile, ReadingAids, ReadingLevel, Reward } from "./types";

type Screen = "profiles" | "activity" | "settings" | "reading" | "writing" | "kindergarten-colors" | "kindergarten-letter-names" | "kindergarten-letter-sounds" | "graphism" | "punctual-setup" | "daily-overview" | "instruction" | "session" | "step-result" | "reward";

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [screen, setScreen] = useState<Screen>(() => data.selectedProfileId ? "activity" : "profiles");
  const [aids, setAids] = useState<ReadingAids>({ syllables: false, complexSounds: false, font: "nunito" });
  const [session, setSession] = useState<SessionDefinition | null>(null);
  const [dailyIndex, setDailyIndex] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const profile = data.profiles.find((item) => item.id === data.selectedProfileId) || null;
  const steps = useMemo(() => profile ? dailySteps(profile) : [], [profile]);

  const persist = (next: AppData) => { setData(next); saveData(next); };
  const selectProfile = (selected: Profile) => { persist({ ...data, selectedProfileId: selected.id }); setScreen("activity"); };
  const saveProfile = (created: Profile) => { persist({ ...data, profiles: [...data.profiles, created], selectedProfileId: created.id }); setScreen("activity"); };

  const punctual = (level: ReadingLevel, timed: boolean) => {
    setSession({ kind: "ponctuel", level, timed, seconds: timed ? 60 : undefined });
    setScreen("instruction");
  };

  const prepareDailyStep = (index: number) => {
    const step = steps[index];
    setDailyIndex(index);
    setSession({ kind: "quotidien", level: step.level, timed: true, seconds: step.seconds, target: step.target, step, stepIndex: index, stepCount: steps.length });
    setScreen("instruction");
  };

  const startDaily = () => { setTotalScore(0); setReward(null); prepareDailyStep(0); };
  const handleComplete = (result: SessionResult) => {
    if (!session) return;
    setLastResult(result);
    if (session.kind === "ponctuel") { setTotalScore(result.score); setScreen("reward"); return; }
    setTotalScore((value) => value + result.score);
    setScreen("step-result");
  };

  const nextDaily = () => {
    if (!profile) return;
    if (dailyIndex < steps.length - 1) { prepareDailyStep(dailyIndex + 1); return; }
    const chosen = drawReward(profile.rewards);
    setReward(chosen);
    const updated = { ...profile, completedDailySessions: profile.completedDailySessions + 1 };
    persist(updateProfile(data, updated));
    setScreen("reward");
  };

  const retryDaily = () => setScreen("instruction");
  const goHome = () => { setSession(null); setLastResult(null); setScreen("activity"); };

  if (screen === "profiles") return <Shell><ProfileScreen profiles={data.profiles} onSelect={selectProfile} onSave={saveProfile} /></Shell>;
  if (!profile) return <Shell><ProfileScreen profiles={data.profiles} onSelect={selectProfile} onSave={saveProfile} /></Shell>;
  if (screen === "activity") return <Shell><ActivityScreen profile={profile} onBack={() => setScreen("profiles")} onReading={() => setScreen("reading")} onWriting={() => setScreen("writing")} onColors={() => setScreen("kindergarten-colors")} onLetterNames={() => setScreen("kindergarten-letter-names")} onLetterSounds={() => setScreen("kindergarten-letter-sounds")} onGraphism={() => setScreen("graphism")} onSettings={() => setScreen("settings")} /></Shell>;
  if (screen === "settings") return <Shell><ProfileSettings profile={profile} onBack={() => setScreen("activity")} onSave={(updated) => { persist(updateProfile(data, updated)); setScreen("activity"); }} /></Shell>;
  if (screen === "reading") return <Shell><ReadingMenu profile={profile} onBack={() => setScreen("activity")} onPunctual={() => setScreen("punctual-setup")} onDaily={() => setScreen("daily-overview")} /></Shell>;
  if (screen === "writing") return <WritingScreen profile={profile} onBack={() => setScreen("activity")} />;
  if (screen === "kindergarten-colors") return <KindergartenOralActivity profile={profile} kind="colors" onBack={() => setScreen("activity")} />;
  if (screen === "kindergarten-letter-names") return <KindergartenOralActivity profile={profile} kind="letter-name" onBack={() => setScreen("activity")} />;
  if (screen === "kindergarten-letter-sounds") return <KindergartenOralActivity profile={profile} kind="letter-sound" onBack={() => setScreen("activity")} />;
  if (screen === "graphism") return <GraphismScreen profile={profile} onBack={() => setScreen("activity")} />;
  if (screen === "punctual-setup") return <Shell><PunctualSetup aids={aids} onAidsChange={setAids} onBack={() => setScreen("reading")} onStart={punctual} /></Shell>;
  if (screen === "daily-overview") return <Shell><DailyOverview profile={profile} onBack={() => setScreen("reading")} onStart={startDaily} /></Shell>;
  if (screen === "instruction" && session) return <Shell><ParentInstruction profile={profile} session={session} onBack={() => setScreen(session.kind === "quotidien" ? "daily-overview" : "punctual-setup")} onBegin={() => setScreen("session")} /></Shell>;
  if (screen === "session" && session) return <ReadingSession profile={profile} session={session} aids={aids} onAidsChange={setAids} onExit={() => setScreen(session.kind === "quotidien" ? "daily-overview" : "reading")} onComplete={handleComplete} />;
  if (screen === "step-result" && session && lastResult) return <Shell><DailyStepResult profile={profile} session={session} result={lastResult} aids={aids} onAidsChange={setAids} onRetry={retryDaily} onNext={nextDaily} onStop={() => setScreen("reading")} /></Shell>;
  if (screen === "reward") return <Shell><FinalReward profile={profile} reward={session?.kind === "quotidien" ? reward : null} totalScore={totalScore} showGift={session?.kind === "quotidien"} onDone={goHome} /></Shell>;
  return null;
}
