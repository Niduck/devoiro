import { useState, type ReactNode } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ActivityScreen, ReadingMenu } from "../components/HomeScreens";
import { DailyStepResult, FinalReward, ParentInstruction, ReadingSession, type SessionDefinition, type SessionResult } from "../components/ReadingFlow";
import { DailyOverview, PunctualSetup } from "../components/ReadingSetup";
import { GraphismScreen } from "../components/GraphismScreen";
import { KindergartenOralActivity } from "../components/KindergartenActivities";
import { LandingPage } from "../components/LandingPage";
import { ProfileScreen, ProfileSettings } from "../components/ProfileScreen";
import { Shell } from "../components/Shell";
import { WritingScreen } from "../components/WritingScreen";
import { dailySteps } from "../data/curriculum";
import { drawReward } from "../data/rewards";
import { loadData, saveData, updateProfile } from "../lib/storage";
import type { AppData, Profile, ReadingAids, ReadingLevel, Reward } from "../types";
import { ROUTE_PATTERNS, routes } from "./routes";

type ProfileRouteProps = {
  data: AppData;
  children(profile: Profile): ReactNode;
};

function ProfileRoute({ data, children }: ProfileRouteProps) {
  const { profileId = "" } = useParams();
  const profile = data.profiles.find((item) => item.id === decodeURIComponent(profileId));
  return profile ? children(profile) : <Navigate to={routes.profiles} replace />;
}

function WithShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return <Shell onHome={() => navigate(routes.landing)}>{children}</Shell>;
}

export function AppRouter() {
  const navigate = useNavigate();
  const [data, setData] = useState<AppData>(() => loadData());
  const [aids, setAids] = useState<ReadingAids>({ syllables: false, complexSounds: false, font: "nunito" });
  const [session, setSession] = useState<SessionDefinition | null>(null);
  const [dailyIndex, setDailyIndex] = useState(0);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);

  const persist = (next: AppData) => {
    setData(next);
    saveData(next);
  };

  const selectProfile = (profile: Profile) => {
    persist({ ...data, selectedProfileId: profile.id });
    navigate(routes.profile(profile.id));
  };

  const saveProfile = (profile: Profile) => {
    persist({ ...data, profiles: [...data.profiles, profile], selectedProfileId: profile.id });
    navigate(routes.profile(profile.id));
  };

  const startPunctual = (profile: Profile, level: ReadingLevel, timed: boolean) => {
    setSession({ kind: "ponctuel", level, timed, seconds: timed ? 60 : undefined });
    navigate(routes.instruction(profile.id));
  };

  const prepareDailyStep = (profile: Profile, index: number) => {
    const steps = dailySteps(profile);
    const step = steps[index];
    setDailyIndex(index);
    setSession({ kind: "quotidien", level: step.level, timed: true, seconds: step.seconds, target: step.target, step, stepIndex: index, stepCount: steps.length });
    navigate(routes.instruction(profile.id));
  };

  const startDaily = (profile: Profile) => {
    setTotalScore(0);
    setReward(null);
    prepareDailyStep(profile, 0);
  };

  const completeSession = (profile: Profile, result: SessionResult) => {
    if (!session) return;
    setLastResult(result);
    if (session.kind === "ponctuel") {
      setTotalScore(result.score);
      navigate(routes.reward(profile.id));
      return;
    }
    setTotalScore((value) => value + result.score);
    navigate(routes.stepResult(profile.id));
  };

  const nextDailyStep = (profile: Profile) => {
    const steps = dailySteps(profile);
    if (dailyIndex < steps.length - 1) {
      prepareDailyStep(profile, dailyIndex + 1);
      return;
    }

    setReward(drawReward(profile.rewards));
    persist(updateProfile(data, { ...profile, completedDailySessions: profile.completedDailySessions + 1 }));
    navigate(routes.reward(profile.id));
  };

  const finishFlow = (profile: Profile) => {
    setSession(null);
    setLastResult(null);
    navigate(routes.profile(profile.id));
  };

  const profileRoute = (render: (profile: Profile) => ReactNode) => <ProfileRoute data={data}>{render}</ProfileRoute>;
  const sessionFallback = (profile: Profile) => <Navigate to={routes.reading(profile.id)} replace />;

  return <Routes>
    <Route path={ROUTE_PATTERNS.landing} element={<LandingPage />} />
    <Route path={ROUTE_PATTERNS.profiles} element={<WithShell><ProfileScreen profiles={data.profiles} onSelect={selectProfile} onSave={saveProfile} /></WithShell>} />

    <Route path={ROUTE_PATTERNS.profile} element={profileRoute((profile) => <WithShell><ActivityScreen
      profile={profile}
      onBack={() => navigate(routes.profiles)}
      onReading={() => navigate(routes.reading(profile.id))}
      onWriting={() => navigate(routes.writing(profile.id))}
      onColors={() => navigate(routes.colors(profile.id))}
      onLetterNames={() => navigate(routes.letterNames(profile.id))}
      onLetterSounds={() => navigate(routes.letterSounds(profile.id))}
      onGraphism={() => navigate(routes.graphism(profile.id))}
      onSettings={() => navigate(routes.settings(profile.id))}
    /></WithShell>)} />

    <Route path={ROUTE_PATTERNS.settings} element={profileRoute((profile) => <WithShell><ProfileSettings
      profile={profile}
      onBack={() => navigate(routes.profile(profile.id))}
      onSave={(updated) => {
        persist(updateProfile(data, updated));
        navigate(routes.profile(profile.id));
      }}
    /></WithShell>)} />

    <Route path={ROUTE_PATTERNS.reading} element={profileRoute((profile) => <WithShell><ReadingMenu
      profile={profile}
      onBack={() => navigate(routes.profile(profile.id))}
      onPunctual={() => navigate(routes.punctualSetup(profile.id))}
      onDaily={() => navigate(routes.dailyOverview(profile.id))}
    /></WithShell>)} />

    <Route path={ROUTE_PATTERNS.writing} element={profileRoute((profile) => <WritingScreen profile={profile} onBack={() => navigate(routes.profile(profile.id))} />)} />
    <Route path={ROUTE_PATTERNS.colors} element={profileRoute((profile) => <KindergartenOralActivity profile={profile} kind="colors" onBack={() => navigate(routes.profile(profile.id))} />)} />
    <Route path={ROUTE_PATTERNS.letterNames} element={profileRoute((profile) => <KindergartenOralActivity profile={profile} kind="letter-name" onBack={() => navigate(routes.profile(profile.id))} />)} />
    <Route path={ROUTE_PATTERNS.letterSounds} element={profileRoute((profile) => <KindergartenOralActivity profile={profile} kind="letter-sound" onBack={() => navigate(routes.profile(profile.id))} />)} />
    <Route path={ROUTE_PATTERNS.graphism} element={profileRoute((profile) => <GraphismScreen profile={profile} onBack={() => navigate(routes.profile(profile.id))} />)} />

    <Route path={ROUTE_PATTERNS.punctualSetup} element={profileRoute((profile) => <WithShell><PunctualSetup
      aids={aids}
      onAidsChange={setAids}
      onBack={() => navigate(routes.reading(profile.id))}
      onStart={(level, timed) => startPunctual(profile, level, timed)}
    /></WithShell>)} />

    <Route path={ROUTE_PATTERNS.dailyOverview} element={profileRoute((profile) => <WithShell><DailyOverview
      profile={profile}
      onBack={() => navigate(routes.reading(profile.id))}
      onStart={() => startDaily(profile)}
    /></WithShell>)} />

    <Route path={ROUTE_PATTERNS.instruction} element={profileRoute((profile) => session ? <WithShell><ParentInstruction
      profile={profile}
      session={session}
      onBack={() => navigate(session.kind === "quotidien" ? routes.dailyOverview(profile.id) : routes.punctualSetup(profile.id))}
      onBegin={() => navigate(routes.session(profile.id))}
    /></WithShell> : sessionFallback(profile))} />

    <Route path={ROUTE_PATTERNS.session} element={profileRoute((profile) => session ? <ReadingSession
      profile={profile}
      session={session}
      aids={aids}
      onAidsChange={setAids}
      onExit={() => navigate(session.kind === "quotidien" ? routes.dailyOverview(profile.id) : routes.reading(profile.id))}
      onComplete={(result) => completeSession(profile, result)}
    /> : sessionFallback(profile))} />

    <Route path={ROUTE_PATTERNS.stepResult} element={profileRoute((profile) => session && lastResult ? <WithShell><DailyStepResult
      profile={profile}
      session={session}
      result={lastResult}
      aids={aids}
      onAidsChange={setAids}
      onRetry={() => navigate(routes.instruction(profile.id))}
      onNext={() => nextDailyStep(profile)}
      onStop={() => navigate(routes.reading(profile.id))}
    /></WithShell> : sessionFallback(profile))} />

    <Route path={ROUTE_PATTERNS.reward} element={profileRoute((profile) => session ? <WithShell><FinalReward
      profile={profile}
      reward={session.kind === "quotidien" ? reward : null}
      totalScore={totalScore}
      showGift={session.kind === "quotidien"}
      onDone={() => finishFlow(profile)}
    /></WithShell> : sessionFallback(profile))} />

    <Route path="*" element={<Navigate to={routes.landing} replace />} />
  </Routes>;
}
