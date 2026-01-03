/**
 * LocalStorage Utilities
 * Gestione persistenza dati: progress tracking, preset, preferenze
 */

/**
 * Interfaccia per progresso moduli
 */
export interface ModuleProgress {
  moduleNumber: number;
  completed: boolean;
  lastVisited?: Date;
  quizScore?: number;
}

/**
 * Interfaccia per preset audio personalizzati
 */
export interface AudioPreset {
  id: string;
  name: string;
  description?: string;
  moduleNumber: number;
  parameters: Record<string, any>;
  createdAt: Date;
}

/**
 * Interfaccia per preferenze utente
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  enableHapticFeedback: boolean;
  enableKeyboardShortcuts: boolean;
  enableAnimations: boolean;
  volume: number; // 0-1
  lastModuleVisited?: number;
}

/**
 * Chiavi localStorage
 */
const STORAGE_KEYS = {
  PROGRESS: 'soundplayground_progress',
  PRESETS: 'soundplayground_presets',
  PREFERENCES: 'soundplayground_preferences',
  QUIZ_RESULTS: 'soundplayground_quiz_results',
} as const;

/**
 * Preferenze default
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  enableHapticFeedback: true,
  enableKeyboardShortcuts: true,
  enableAnimations: true,
  volume: 0.5,
};

/**
 * Wrapper sicuro per localStorage con error handling
 */
class Storage {
  private static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      console.warn('localStorage non disponibile');
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Errore lettura localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage non disponibile');
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Errore scrittura localStorage key "${key}":`, error);
      return false;
    }
  }

  static remove(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Errore rimozione localStorage key "${key}":`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Errore clear localStorage:', error);
      return false;
    }
  }
}

/**
 * === PROGRESS TRACKING ===
 */

export function getModuleProgress(): ModuleProgress[] {
  return Storage.get<ModuleProgress[]>(STORAGE_KEYS.PROGRESS, []);
}

export function setModuleProgress(progress: ModuleProgress[]): void {
  Storage.set(STORAGE_KEYS.PROGRESS, progress);
}

export function markModuleCompleted(moduleNumber: number, quizScore?: number): void {
  const progress = getModuleProgress();
  const existingIndex = progress.findIndex(p => p.moduleNumber === moduleNumber);

  const moduleProgress: ModuleProgress = {
    moduleNumber,
    completed: true,
    lastVisited: new Date(),
    quizScore,
  };

  if (existingIndex >= 0) {
    progress[existingIndex] = moduleProgress;
  } else {
    progress.push(moduleProgress);
  }

  setModuleProgress(progress);
}

export function markModuleVisited(moduleNumber: number): void {
  const progress = getModuleProgress();
  const existingIndex = progress.findIndex(p => p.moduleNumber === moduleNumber);

  if (existingIndex >= 0) {
    progress[existingIndex].lastVisited = new Date();
  } else {
    progress.push({
      moduleNumber,
      completed: false,
      lastVisited: new Date(),
    });
  }

  setModuleProgress(progress);
}

export function isModuleCompleted(moduleNumber: number): boolean {
  const progress = getModuleProgress();
  const moduleProgress = progress.find(p => p.moduleNumber === moduleNumber);
  return moduleProgress?.completed ?? false;
}

export function getCompletionPercentage(): number {
  const progress = getModuleProgress();
  const totalModules = 14; // 11 originali + 3 nuovi
  const completedModules = progress.filter(p => p.completed).length;
  return Math.round((completedModules / totalModules) * 100);
}

/**
 * === PRESET MANAGEMENT ===
 */

export function getPresets(): AudioPreset[] {
  return Storage.get<AudioPreset[]>(STORAGE_KEYS.PRESETS, []);
}

export function savePreset(preset: Omit<AudioPreset, 'id' | 'createdAt'>): AudioPreset {
  const presets = getPresets();

  const newPreset: AudioPreset = {
    ...preset,
    id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  };

  presets.push(newPreset);
  Storage.set(STORAGE_KEYS.PRESETS, presets);

  return newPreset;
}

export function deletePreset(presetId: string): boolean {
  const presets = getPresets();
  const filteredPresets = presets.filter(p => p.id !== presetId);

  if (filteredPresets.length === presets.length) {
    return false; // Preset non trovato
  }

  Storage.set(STORAGE_KEYS.PRESETS, filteredPresets);
  return true;
}

export function getPresetsByModule(moduleNumber: number): AudioPreset[] {
  return getPresets().filter(p => p.moduleNumber === moduleNumber);
}

export function updatePreset(presetId: string, updates: Partial<AudioPreset>): boolean {
  const presets = getPresets();
  const presetIndex = presets.findIndex(p => p.id === presetId);

  if (presetIndex < 0) {
    return false;
  }

  presets[presetIndex] = {
    ...presets[presetIndex],
    ...updates,
  };

  Storage.set(STORAGE_KEYS.PRESETS, presets);
  return true;
}

/**
 * === USER PREFERENCES ===
 */

export function getPreferences(): UserPreferences {
  return Storage.get<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
}

export function setPreferences(preferences: Partial<UserPreferences>): void {
  const current = getPreferences();
  const updated = { ...current, ...preferences };
  Storage.set(STORAGE_KEYS.PREFERENCES, updated);
}

export function getPreference<K extends keyof UserPreferences>(
  key: K
): UserPreferences[K] {
  const preferences = getPreferences();
  return preferences[key];
}

export function setPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  const preferences = getPreferences();
  preferences[key] = value;
  Storage.set(STORAGE_KEYS.PREFERENCES, preferences);
}

/**
 * === QUIZ RESULTS ===
 */

export interface QuizResult {
  moduleNumber: number;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  answers: {
    questionIndex: number;
    correct: boolean;
    userAnswer: number;
    correctAnswer: number;
  }[];
}

export function getQuizResults(): QuizResult[] {
  return Storage.get<QuizResult[]>(STORAGE_KEYS.QUIZ_RESULTS, []);
}

export function saveQuizResult(result: QuizResult): void {
  const results = getQuizResults();
  results.push(result);
  Storage.set(STORAGE_KEYS.QUIZ_RESULTS, results);

  // Aggiorna anche il progress
  markModuleCompleted(result.moduleNumber, result.score);
}

export function getQuizResultsByModule(moduleNumber: number): QuizResult[] {
  return getQuizResults().filter(r => r.moduleNumber === moduleNumber);
}

export function getBestQuizScore(moduleNumber: number): number | null {
  const results = getQuizResultsByModule(moduleNumber);
  if (results.length === 0) return null;

  return Math.max(...results.map(r => r.score));
}

/**
 * === UTILITIES ===
 */

export function exportUserData(): string {
  const data = {
    progress: getModuleProgress(),
    presets: getPresets(),
    preferences: getPreferences(),
    quizResults: getQuizResults(),
    exportedAt: new Date(),
  };

  return JSON.stringify(data, null, 2);
}

export function importUserData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);

    if (data.progress) Storage.set(STORAGE_KEYS.PROGRESS, data.progress);
    if (data.presets) Storage.set(STORAGE_KEYS.PRESETS, data.presets);
    if (data.preferences) Storage.set(STORAGE_KEYS.PREFERENCES, data.preferences);
    if (data.quizResults) Storage.set(STORAGE_KEYS.QUIZ_RESULTS, data.quizResults);

    return true;
  } catch (error) {
    console.error('Errore importazione dati:', error);
    return false;
  }
}

export function clearAllData(): boolean {
  return Storage.clear();
}
