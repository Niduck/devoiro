import { useMemo, useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ActivityScreen, ReadingMenu, WorkspaceHome, WorksheetCatalog } from "../components/HomeScreens";
import { DailyStepResult, FinalReward, ParentInstruction, ReadingSession, type SessionDefinition, type SessionResult } from "../components/ReadingFlow";
import { DailyOverview, PunctualSetup } from "../components/ReadingSetup";
import { AlphabetSongActivity, KindergartenOralActivity } from "../components/KindergartenActivities";
import { LandingPage } from "../components/LandingPage";
import { Shell } from "../components/Shell";
import { WorksheetComposer } from "../components/WorksheetComposer";
import { AlphabetWorksheetScreen } from "../components/WritingScreen";
import { dailySteps } from "../data/curriculum";
import { DEFAULT_REWARDS, drawReward } from "../data/rewards";
import type { ActivityLevel, Profile, ReadingAids, ReadingLevel, Reward } from "../types";
import { ROUTE_PATTERNS, routes } from "./routes";

function WithShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return <Shell onHome={() => navigate(routes.landing)}>{children}</Shell>;
}

function activityProfile(level: ActivityLevel): Profile {
  const schoolLevel = level === "cp" || level === "ce1" ? level : "maternelle";
  const period = level === "ps" ? "debut" : level === "gs" ? "fin" : "milieu";
  return {
    id: "local-activity",
    name: "",
    devoiros: "devoiros-1",
    schoolLevel,
    period,
    rewards: DEFAULT_REWARDS.map((reward) => ({ ...reward })),
    completedDailySessions: 0,
  };
}

export function AppRouter() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<ActivityLevel>("cp");
  const profile = useMemo(() => activityProfile(level), [level]);
  const [aids, setAids] = useState<ReadingAids>({ syllables: false, complexSounds: false, font: "nunito" });
  const [session, setSession] = useState<SessionDefinition | null>(null);
  const [dailyIndex, setDailyIndex] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);

  const startPunctual = (readingLevel: ReadingLevel, timed: boolean) => {
    setSession({ kind: "ponctuel", level: readingLevel, timed, seconds: timed ? 60 : undefined });
    navigate(routes.instruction);
  };

  const prepareDailyStep = (index: number) => {
    const steps = dailySteps(profile);
    const step = steps[index];
    setDailyIndex(index);
    setSession({ kind: "quotidien", level: step.level, timed: true, seconds: step.seconds, target: step.target, step, stepIndex: index, stepCount: steps.length });
    navigate(routes.instruction);
  };

  const startDaily = () => {
    setTotalScore(0);
    setReward(null);
    prepareDailyStep(0);
  };

  const completeSession = (result: SessionResult) => {
    if (!session) return;
    setLastResult(result);
    if (session.kind === "ponctuel") {
      setTotalScore(result.score);
      navigate(routes.reward);
      return;
    }
    setTotalScore((value) => value + result.score);
    navigate(routes.stepResult);
  };

  const nextDailyStep = () => {
    const steps = dailySteps(profile);
    if (dailyIndex < steps.length - 1) {
      prepareDailyStep(dailyIndex + 1);
      return;
    }
    setReward(drawReward(profile.rewards));
    navigate(routes.reward);
  };

  const finishFlow = () => {
    setSession(null);
    setLastResult(null);
    navigate(routes.reading);
  };

  const sessionFallback = <Navigate to={routes.reading} replace />;

  return <Routes>
    <Route path={ROUTE_PATTERNS.landing} element={<LandingPage />} />
    <Route path={ROUTE_PATTERNS.workspace} element={<WithShell><WorkspaceHome onActivities={() => navigate(routes.activities)} onWorksheets={() => navigate(routes.worksheets)} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.activities} element={<WithShell><ActivityScreen
      level={level}
      onLevelChange={setLevel}
      onBack={() => navigate(routes.workspace)}
      onReading={() => navigate(routes.reading)}
      onColors={() => navigate(routes.colors)}
      onShapes={() => navigate(routes.shapes)}
      onLetterNames={() => navigate(routes.letterNames)}
      onAlphabetSong={() => navigate(routes.alphabetSong)}
      onLetterSounds={() => navigate(routes.letterSounds)}
    /></WithShell>} />
    <Route path={ROUTE_PATTERNS.worksheets} element={<WithShell><WorksheetCatalog onBack={() => navigate(routes.workspace)} onComposer={() => navigate(routes.composer)} onAlphabet={() => navigate(routes.alphabetWorksheet)} /></WithShell>} />

    <Route path={ROUTE_PATTERNS.reading} element={<WithShell><ReadingMenu profile={profile} onBack={() => navigate(routes.activities)} onPunctual={() => navigate(routes.punctualSetup)} onDaily={() => navigate(routes.dailyOverview)} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.colors} element={<KindergartenOralActivity profile={profile} kind="colors" onBack={() => navigate(routes.activities)} />} />
    <Route path={ROUTE_PATTERNS.shapes} element={<KindergartenOralActivity profile={profile} kind="shapes" onBack={() => navigate(routes.activities)} />} />
    <Route path={ROUTE_PATTERNS.letterNames} element={<KindergartenOralActivity profile={profile} kind="letter-name" onBack={() => navigate(routes.activities)} />} />
    <Route path={ROUTE_PATTERNS.alphabetSong} element={<AlphabetSongActivity profile={profile} onBack={() => navigate(routes.activities)} />} />
    <Route path={ROUTE_PATTERNS.letterSounds} element={<KindergartenOralActivity profile={profile} kind="letter-sound" onBack={() => navigate(routes.activities)} />} />

    <Route path={ROUTE_PATTERNS.composer} element={<WorksheetComposer profile={profile} onBack={() => navigate(routes.worksheets)} mode="writing" />} />
    <Route path={ROUTE_PATTERNS.alphabetWorksheet} element={<AlphabetWorksheetScreen onBack={() => navigate(routes.worksheets)} />} />

    <Route path={ROUTE_PATTERNS.punctualSetup} element={<WithShell><PunctualSetup aids={aids} onAidsChange={setAids} onBack={() => navigate(routes.reading)} onStart={startPunctual} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.dailyOverview} element={<WithShell><DailyOverview profile={profile} onBack={() => navigate(routes.reading)} onStart={startDaily} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.instruction} element={session ? <WithShell><ParentInstruction profile={profile} session={session} onBack={() => navigate(session.kind === "quotidien" ? routes.dailyOverview : routes.punctualSetup)} onBegin={() => navigate(routes.session)} /></WithShell> : sessionFallback} />
    <Route path={ROUTE_PATTERNS.session} element={session ? <ReadingSession profile={profile} session={session} aids={aids} onAidsChange={setAids} onExit={() => navigate(session.kind === "quotidien" ? routes.dailyOverview : routes.reading)} onComplete={completeSession} /> : sessionFallback} />
    <Route path={ROUTE_PATTERNS.stepResult} element={session && lastResult ? <WithShell><DailyStepResult profile={profile} session={session} result={lastResult} aids={aids} onAidsChange={setAids} onRetry={() => navigate(routes.instruction)} onNext={nextDailyStep} onStop={() => navigate(routes.reading)} /></WithShell> : sessionFallback} />
    <Route path={ROUTE_PATTERNS.reward} element={session ? <WithShell><FinalReward profile={profile} reward={session.kind === "quotidien" ? reward : null} totalScore={totalScore} showGift={session.kind === "quotidien"} onDone={finishFlow} /></WithShell> : sessionFallback} />

    <Route path="*" element={<Navigate to={routes.landing} replace />} />
  </Routes>;
}
