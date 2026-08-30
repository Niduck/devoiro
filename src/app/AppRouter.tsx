import { useMemo, useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ActivityScreen, ReadingMenu, WorkspaceHome, WorksheetCatalog } from "../components/HomeScreens";
import { DailyStepResult, FinalReward, ParentInstruction, ReadingSession, type SessionDefinition, type SessionResult } from "../components/ReadingFlow";
import { DailyOverview, PunctualSetup } from "../components/ReadingSetup";
import { AlphabetSongActivity, KindergartenOralActivity } from "../components/KindergartenActivities";
import { DecodingActivity, EncodingActivity } from "../components/PhonicsActivities";
import { LandingPage } from "../components/LandingPage";
import { Shell } from "../components/Shell";
import { WorksheetComposer } from "../components/WorksheetComposer";
import { AlphabetWorksheetScreen } from "../components/WritingScreen";
import { dailyJourney } from "../data/curriculum";
import { drawReward } from "../data/rewards";
import { loadRewards, saveRewards } from "../lib/rewardStorage";
import type { ActivityLevel, DailyJourneyStep, Profile, ReadingAids, ReadingLevel, Reward, SchoolPeriod } from "../types";
import { ROUTE_PATTERNS, routes } from "./routes";

function WithShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return <Shell onHome={() => navigate(routes.landing)}>{children}</Shell>;
}

type PeriodMode = "auto" | SchoolPeriod;

function currentSchoolPeriod(date = new Date()): SchoolPeriod {
  const month = date.getMonth();
  if (month >= 8 && month <= 10) return "debut";
  if (month === 11 || month <= 2) return "milieu";
  return "fin";
}

function activityProfile(level: ActivityLevel, period: SchoolPeriod, rewards: Reward[]): Profile {
  const schoolLevel = level === "cp" || level === "ce1" ? level : "maternelle";
  return {
    id: "local-activity",
    name: "",
    devoiros: "devoiros-1",
    schoolLevel,
    period,
    rewards,
    completedDailySessions: 0,
  };
}

export function AppRouter() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<ActivityLevel>("cp");
  const [periodMode, setPeriodMode] = useState<PeriodMode>("auto");
  const [rewards, setRewards] = useState<Reward[]>(loadRewards);
  const automaticPeriod = currentSchoolPeriod();
  const period = periodMode === "auto" ? automaticPeriod : periodMode;
  const profile = useMemo(() => activityProfile(level, period, rewards), [level, period, rewards]);
  const dailyPlan = useMemo(() => dailyJourney(profile, level), [level, profile]);
  const [aids, setAids] = useState<ReadingAids>({ syllables: false, complexSounds: false, font: "nunito" });
  const [session, setSession] = useState<SessionDefinition | null>(null);
  const [dailyIndex, setDailyIndex] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [totalSuperBravo, setTotalSuperBravo] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const [dailyRunning, setDailyRunning] = useState(false);
  const [activeDailyStep, setActiveDailyStep] = useState<DailyJourneyStep | null>(null);

  const updateRewards = (nextRewards: Reward[]) => {
    setRewards(nextRewards);
    saveRewards(nextRewards);
  };

  const startPunctual = (readingLevel: ReadingLevel, timed: boolean) => {
    setDailyRunning(false);
    setActiveDailyStep(null);
    setTotalSuperBravo(0);
    setSession({ kind: "ponctuel", level: readingLevel, timed, seconds: timed ? 60 : undefined });
    navigate(routes.instruction);
  };

  const prepareDailyStep = (index: number) => {
    const step = dailyPlan[index];
    setDailyIndex(index);
    setActiveDailyStep(step);

    if (step.activity === "reading") {
      setSession({ kind: "quotidien", level: step.level, timed: true, seconds: step.seconds, target: step.target, step, stepIndex: index, stepCount: dailyPlan.length });
      navigate(routes.instruction);
      return;
    }

    setSession(null);
    const activityRoutes = {
      colors: routes.colors,
      shapes: routes.shapes,
      "letter-name": routes.letterNames,
      "letter-sound": routes.letterSounds,
      "alphabet-song": routes.alphabetSong,
      decoding: routes.decoding,
      encoding: routes.encoding,
    } as const;
    navigate(activityRoutes[step.activity]);
  };

  const startDaily = () => {
    setTotalScore(0);
    setTotalSuperBravo(0);
    setReward(null);
    setDailyRunning(true);
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
    setTotalSuperBravo((value) => value + result.superCount);
    navigate(routes.stepResult);
  };

  const nextDailyStep = () => {
    if (dailyIndex < dailyPlan.length - 1) {
      prepareDailyStep(dailyIndex + 1);
      return;
    }
    setReward(drawReward(profile.rewards, Math.random(), totalSuperBravo));
    navigate(routes.reward);
  };

  const completeDailyActivity = (score = 1) => {
    setTotalScore((value) => value + score);
    nextDailyStep();
  };

  const leaveDaily = () => {
    setDailyRunning(false);
    setActiveDailyStep(null);
    setSession(null);
    navigate(routes.activities);
  };

  const finishFlow = () => {
    const wasDaily = dailyRunning || session?.kind === "quotidien";
    setSession(null);
    setLastResult(null);
    setDailyRunning(false);
    setActiveDailyStep(null);
    navigate(wasDaily ? routes.activities : routes.reading);
  };

  const sessionFallback = <Navigate to={routes.reading} replace />;

  return <Routes>
    <Route path={ROUTE_PATTERNS.landing} element={<LandingPage />} />
    <Route path={ROUTE_PATTERNS.workspace} element={<WithShell><WorkspaceHome rewards={rewards} onRewardsChange={updateRewards} onActivities={() => navigate(routes.activities)} onWorksheets={() => navigate(routes.worksheets)} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.activities} element={<WithShell><ActivityScreen
      level={level}
      period={period}
      periodMode={periodMode}
      automaticPeriod={automaticPeriod}
      dailyStepCount={dailyPlan.length}
      onLevelChange={setLevel}
      onPeriodModeChange={setPeriodMode}
      onBack={() => navigate(routes.workspace)}
      onDaily={() => navigate(routes.dailyOverview)}
      onReading={() => navigate(routes.reading)}
      onColors={() => navigate(routes.colors)}
      onShapes={() => navigate(routes.shapes)}
      onLetterNames={() => navigate(routes.letterNames)}
      onAlphabetSong={() => navigate(routes.alphabetSong)}
      onLetterSounds={() => navigate(routes.letterSounds)}
      onDecoding={() => navigate(routes.decoding)}
      onEncoding={() => navigate(routes.encoding)}
    /></WithShell>} />
    <Route path={ROUTE_PATTERNS.worksheets} element={<WithShell><WorksheetCatalog onBack={() => navigate(routes.workspace)} onComposer={() => navigate(routes.composer)} onAlphabet={() => navigate(routes.alphabetWorksheet)} /></WithShell>} />

    <Route path={ROUTE_PATTERNS.reading} element={<WithShell><ReadingMenu onBack={() => navigate(routes.activities)} onPunctual={() => navigate(routes.punctualSetup)} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.colors} element={<KindergartenOralActivity key={`colors-${dailyIndex}-${dailyRunning}`} profile={profile} kind="colors" onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "colors" ? completeDailyActivity : undefined} />} />
    <Route path={ROUTE_PATTERNS.shapes} element={<KindergartenOralActivity key={`shapes-${dailyIndex}-${dailyRunning}`} profile={profile} kind="shapes" onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "shapes" ? completeDailyActivity : undefined} />} />
    <Route path={ROUTE_PATTERNS.letterNames} element={<KindergartenOralActivity key={`letters-${dailyIndex}-${dailyRunning}`} profile={profile} kind="letter-name" onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "letter-name" ? completeDailyActivity : undefined} />} />
    <Route path={ROUTE_PATTERNS.alphabetSong} element={<AlphabetSongActivity key={`song-${dailyIndex}-${dailyRunning}`} profile={profile} onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "alphabet-song" ? completeDailyActivity : undefined} />} />
    <Route path={ROUTE_PATTERNS.letterSounds} element={<KindergartenOralActivity key={`sounds-${dailyIndex}-${dailyRunning}`} profile={profile} kind="letter-sound" onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "letter-sound" ? completeDailyActivity : undefined} />} />
    <Route path={ROUTE_PATTERNS.decoding} element={<DecodingActivity key={`decoding-${dailyIndex}-${dailyRunning}`} profile={profile} level={level} period={period} onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "decoding" ? completeDailyActivity : undefined} />} />
    <Route path={ROUTE_PATTERNS.encoding} element={<EncodingActivity key={`encoding-${dailyIndex}-${dailyRunning}`} profile={profile} level={level} period={period} onBack={dailyRunning ? leaveDaily : () => navigate(routes.activities)} onComplete={dailyRunning && activeDailyStep?.activity === "encoding" ? completeDailyActivity : undefined} />} />

    <Route path={ROUTE_PATTERNS.composer} element={<WorksheetComposer profile={profile} onBack={() => navigate(routes.worksheets)} mode="writing" />} />
    <Route path={ROUTE_PATTERNS.alphabetWorksheet} element={<AlphabetWorksheetScreen profile={profile} onBack={() => navigate(routes.worksheets)} />} />

    <Route path={ROUTE_PATTERNS.punctualSetup} element={<WithShell><PunctualSetup aids={aids} onAidsChange={setAids} onBack={() => navigate(routes.reading)} onStart={startPunctual} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.dailyOverview} element={<WithShell><DailyOverview profile={profile} steps={dailyPlan} onBack={leaveDaily} onStart={startDaily} /></WithShell>} />
    <Route path={ROUTE_PATTERNS.instruction} element={session ? <WithShell><ParentInstruction profile={profile} session={session} onBack={() => navigate(session.kind === "quotidien" ? routes.dailyOverview : routes.punctualSetup)} onBegin={() => navigate(routes.session)} /></WithShell> : sessionFallback} />
    <Route path={ROUTE_PATTERNS.session} element={session ? <ReadingSession profile={profile} session={session} aids={aids} onAidsChange={setAids} onExit={() => navigate(session.kind === "quotidien" ? routes.dailyOverview : routes.reading)} onComplete={completeSession} /> : sessionFallback} />
    <Route path={ROUTE_PATTERNS.stepResult} element={session && lastResult ? <WithShell><DailyStepResult profile={profile} session={session} result={lastResult} aids={aids} onAidsChange={setAids} onRetry={() => navigate(routes.instruction)} onNext={nextDailyStep} onStop={leaveDaily} /></WithShell> : sessionFallback} />
    <Route path={ROUTE_PATTERNS.reward} element={session || dailyRunning ? <WithShell><FinalReward profile={profile} reward={dailyRunning || session?.kind === "quotidien" ? reward : null} totalScore={totalScore} superBravoCount={totalSuperBravo} showGift={dailyRunning || session?.kind === "quotidien"} onDone={finishFlow} /></WithShell> : sessionFallback} />

    <Route path="*" element={<Navigate to={routes.landing} replace />} />
  </Routes>;
}
