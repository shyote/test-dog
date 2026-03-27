import React, { useState } from 'react';
import './App.css';
import { AppState, DogProfile, Walk, WalkFeedback, baseDailyNeed } from './types';
import HomeScreen from './HomeScreen';
import DogProfileScreen from './DogProfileScreen';
import WalkScreen from './WalkScreen';
import FeedbackScreen from './FeedbackScreen';

type Screen = 'home' | 'profile' | 'walk' | 'feedback';

interface PendingWalk {
  durationMin: number;
  distanceKm: number;
  batteryGain: number;
}

const STORAGE_KEY = 'dogwalk_state';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { dog: null, battery: 0, dailyNeed: 60, walks: [] };
}

function saveState(s: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// intensity factor: uses pace (min/km); slower = lower intensity
function intensityFactor(durationMin: number, distanceKm: number): number {
  if (distanceKm < 0.01) return 0.7; // no GPS data — default moderate
  const pace = durationMin / distanceKm; // min/km
  if (pace < 6) return 1.2;  // fast
  if (pace < 10) return 1.0; // normal
  return 0.8;                // slow / lots of sniffing
}

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [screen, setScreen] = useState<Screen>('home');
  const [pending, setPending] = useState<PendingWalk | null>(null);

  const update = (next: AppState) => { setState(next); saveState(next); };

  const handleSaveProfile = (profile: DogProfile) => {
    const dailyNeed = baseDailyNeed(profile);
    update({ ...state, dog: profile, dailyNeed });
    setScreen('home');
  };

  const handleWalkFinish = (durationMin: number, distanceKm: number) => {
    const factor = intensityFactor(durationMin, distanceKm);
    const effort = durationMin * factor;
    const gain = (effort / state.dailyNeed) * 100;
    const newBattery = state.battery + gain;

    const walk: Walk = {
      id: String(Date.now()),
      startTime: Date.now() - durationMin * 60_000,
      endTime: Date.now(),
      durationMin,
      distanceKm,
    };

    update({ ...state, battery: newBattery, walks: [...state.walks, walk] });
    setPending({ durationMin, distanceKm, batteryGain: gain });
    setScreen('feedback');
  };

  const handleFeedback = (feedback: WalkFeedback) => {
    // Adapt daily_need based on feedback
    let newNeed = state.dailyNeed;
    if (feedback === 'energetic') newNeed = Math.min(state.dailyNeed * 1.05, 180);
    if (feedback === 'tired')     newNeed = Math.max(state.dailyNeed * 0.95, 15);

    // Tag the most recent walk with feedback
    const walks = [...state.walks];
    if (walks.length > 0) walks[walks.length - 1] = { ...walks[walks.length - 1], feedback };

    update({ ...state, dailyNeed: Math.round(newNeed), walks });
    setPending(null);
    setScreen('home');
  };

  if (screen === 'profile') {
    return <DogProfileScreen initial={state.dog} onSave={handleSaveProfile} onBack={() => setScreen('home')} />;
  }
  if (screen === 'walk') {
    return <WalkScreen onFinish={handleWalkFinish} onCancel={() => setScreen('home')} />;
  }
  if (screen === 'feedback' && pending) {
    return (
      <FeedbackScreen
        durationMin={pending.durationMin}
        distanceKm={pending.distanceKm}
        batteryGain={pending.batteryGain}
        newBattery={state.battery}
        onFeedback={handleFeedback}
      />
    );
  }

  return (
    <HomeScreen
      state={state}
      onStartWalk={() => setScreen('walk')}
      onSetupDog={() => setScreen('profile')}
    />
  );
}
