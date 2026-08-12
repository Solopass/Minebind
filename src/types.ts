export type InputPlatform = 'pc' | 'xbox' | 'playstation' | 'switch';

export type GameGenre = 'FPS' | 'Action RPG' | 'Fighting' | 'Battle Royale' | 'Sports' | 'Sandbox' | 'MOBA' | 'Co-op Shooter' | 'Racing' | 'Strategy' | 'General';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro Master';

export interface ControlItem {
  id: string;
  description: string;
  keys: string; // e.g., "`W+Shift` Sprint", "`A` Light Attack"
  platformKeys?: {
    pc?: string;
    xbox?: string;
    playstation?: string;
    switch?: string;
  };
  notes?: string;
  isCombo?: boolean;
}

export interface ControlCategory {
  name: string;
  items: ControlItem[];
}

export interface ComboItem {
  id?: string;
  name: string;
  sequence: string; // e.g., "Down, Down-Right, Right, Punch"
  description: string;
  difficulty?: DifficultyLevel;
  timingNote?: string;
  platformSequences?: {
    pc?: string;
    xbox?: string;
    playstation?: string;
    switch?: string;
  };
  steps?: {
    stepIndex: number;
    action: string;
    key: string;
    timing: string;
  }[];
}

export interface GameProfile {
  id: string;
  name: string;
  genre: GameGenre;
  developer?: string;
  coverImage?: string;
  platformSupport: InputPlatform[];
  defaultPlatform: InputPlatform;
  md: string; // Raw markdown representation for compatibility
  categories: ControlCategory[];
  combos?: ComboItem[];
}

export interface TechGuideStep {
  stepNumber: number;
  instruction: string;
  keyInput: string;
  timing: string;
  visualTip?: string;
}

export interface TechGuide {
  id: string;
  title: string;
  gameId: string;
  gameName: string;
  category: string;
  difficulty: DifficultyLevel;
  summary: string;
  prerequisites?: string[];
  steps: TechGuideStep[];
  commonMistakes: string[];
  proTip: string;
}

export interface ProfileCompletionStatus {
  percentage: number; // 0 to 100
  is100Percent: boolean;
  totalControlsCount: number;
  totalCombosCount: number;
  supportedPlatformsCount: number;
  missingItemsList: string[];
}

export interface SrsCardData {
  repetition: number;
  interval: number;
  easeFactor: number;
  nextReviewDate: number; // timestamp
}

export interface ThemeConfig {
  id: string;
  name: string;
  appBg: string;
  navBg: string;
  textMain: string;
  textMuted: string;
  accent: string;
  cardBg: string;
  cardHeaderBg: string;
  keycap: string;
  colorKey: 'indigo' | 'fuchsia' | 'blue' | 'green' | 'amber' | 'rose' | 'emerald';
}

export interface UserStreak {
  count: number;
  lastDate: string | null;
}

export interface ProPreset {
  id: string;
  gameId: string;
  gameName: string;
  proName: string;
  team?: string;
  role?: string;
  description: string;
  platform: InputPlatform;
  bindings: Record<string, string>; // item id -> custom key bind string
  settingsNote?: string; // e.g. "Sensitivity: 800 DPI 0.35, FOV: 110"
}

export interface CustomVariant {
  id: string;
  gameId: string;
  name: string;
  createdAt: number;
  platform: InputPlatform;
  customBindings: Record<string, string>; // item id -> custom key bind string
  notes?: string;
}

