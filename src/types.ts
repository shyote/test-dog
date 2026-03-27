export type DogSize = 'small' | 'medium' | 'large';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type AgeGroup = 'puppy' | 'adult' | 'senior';
export type WalkFeedback = 'tired' | 'satisfied' | 'energetic';

export interface DogProfile {
  name: string;
  size: DogSize;
  energyLevel: EnergyLevel;
  age: AgeGroup;
}

export interface Walk {
  id: string;
  startTime: number;
  endTime: number;
  durationMin: number;
  distanceKm: number;
  feedback?: WalkFeedback;
}

export interface AppState {
  dog: DogProfile | null;
  battery: number; // 0–150
  dailyNeed: number; // minutes
  walks: Walk[];
}

// base daily need in minutes
export function baseDailyNeed(profile: DogProfile): number {
  const table: Record<DogSize, Record<EnergyLevel, number>> = {
    small:  { low: 30, medium: 45, high: 60 },
    medium: { low: 45, medium: 60, high: 75 },
    large:  { low: 60, medium: 75, high: 90 },
  };
  let need = table[profile.size][profile.energyLevel];
  if (profile.age === 'puppy') need *= 0.8;
  if (profile.age === 'senior') need *= 0.7;
  return Math.round(need);
}
