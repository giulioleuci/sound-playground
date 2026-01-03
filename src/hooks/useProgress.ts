/**
 * Custom Hooks per Progress Tracking e Storage
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getModuleProgress,
  markModuleCompleted,
  markModuleVisited,
  isModuleCompleted,
  getCompletionPercentage,
  getPreferences,
  setPreference,
  getPresets,
  savePreset,
  deletePreset,
  getPresetsByModule,
  type ModuleProgress,
  type UserPreferences,
  type AudioPreset,
} from '@/lib/storage';

/**
 * Hook per tracciare progresso moduli
 */
export function useModuleProgress() {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const loadProgress = () => {
      setProgress(getModuleProgress());
      setCompletionPercentage(getCompletionPercentage());
    };

    loadProgress();

    // Listen per storage events (sync tra tabs)
    window.addEventListener('storage', loadProgress);
    return () => window.removeEventListener('storage', loadProgress);
  }, []);

  const markCompleted = useCallback((moduleNumber: number, quizScore?: number) => {
    markModuleCompleted(moduleNumber, quizScore);
    setProgress(getModuleProgress());
    setCompletionPercentage(getCompletionPercentage());
  }, []);

  const markVisited = useCallback((moduleNumber: number) => {
    markModuleVisited(moduleNumber);
    setProgress(getModuleProgress());
  }, []);

  const isCompleted = useCallback((moduleNumber: number) => {
    return isModuleCompleted(moduleNumber);
  }, []);

  return {
    progress,
    completionPercentage,
    markCompleted,
    markVisited,
    isCompleted,
  };
}

/**
 * Hook per singolo modulo
 */
export function useModuleStatus(moduleNumber: number) {
  const { progress, markCompleted, markVisited, isCompleted } = useModuleProgress();

  const moduleProgress = progress.find(p => p.moduleNumber === moduleNumber);

  useEffect(() => {
    // Auto-mark come visitato quando il modulo viene montato
    markVisited(moduleNumber);
  }, [moduleNumber, markVisited]);

  return {
    isCompleted: isCompleted(moduleNumber),
    lastVisited: moduleProgress?.lastVisited,
    quizScore: moduleProgress?.quizScore,
    markCompleted: (score?: number) => markCompleted(moduleNumber, score),
  };
}

/**
 * Hook per preferenze utente
 */
export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(getPreferences());

  useEffect(() => {
    const loadPreferences = () => {
      setPreferencesState(getPreferences());
    };

    window.addEventListener('storage', loadPreferences);
    return () => window.removeEventListener('storage', loadPreferences);
  }, []);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreference(key, value);
    setPreferencesState(getPreferences());
  }, []);

  return {
    preferences,
    updatePreference,
  };
}

/**
 * Hook per gestione preset
 */
export function usePresets(moduleNumber?: number) {
  const [presets, setPresetsState] = useState<AudioPreset[]>([]);

  const loadPresets = useCallback(() => {
    const allPresets = moduleNumber ? getPresetsByModule(moduleNumber) : getPresets();
    setPresetsState(allPresets);
  }, [moduleNumber]);

  useEffect(() => {
    loadPresets();

    window.addEventListener('storage', loadPresets);
    return () => window.removeEventListener('storage', loadPresets);
  }, [loadPresets]);

  const save = useCallback((preset: Omit<AudioPreset, 'id' | 'createdAt'>) => {
    const newPreset = savePreset(preset);
    loadPresets();
    return newPreset;
  }, [loadPresets]);

  const remove = useCallback((presetId: string) => {
    const success = deletePreset(presetId);
    if (success) {
      loadPresets();
    }
    return success;
  }, [loadPresets]);

  return {
    presets,
    savePreset: save,
    deletePreset: remove,
    refreshPresets: loadPresets,
  };
}

/**
 * Hook per gestione tema (dark/light mode)
 */
export function useTheme() {
  const { preferences, updatePreference } = usePreferences();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (preferences.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(isDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(preferences.theme);
      }
    };

    updateResolvedTheme();

    // Listen per system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [preferences.theme]);

  useEffect(() => {
    // Applica theme al document
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    updatePreference('theme', theme);
  }, [updatePreference]);

  return {
    theme: preferences.theme,
    resolvedTheme,
    setTheme,
  };
}

/**
 * Hook per haptic feedback (vibrazione mobile)
 */
export function useHaptic() {
  const { preferences } = usePreferences();

  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (!preferences.enableHapticFeedback) return;
    if (!('vibrate' in navigator)) return;

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Vibrazione non supportata:', error);
    }
  }, [preferences.enableHapticFeedback]);

  const vibrateClick = useCallback(() => vibrate(10), [vibrate]);
  const vibrateSuccess = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const vibrateError = useCallback(() => vibrate([10, 100, 10, 100, 10]), [vibrate]);

  return {
    vibrate,
    vibrateClick,
    vibrateSuccess,
    vibrateError,
    isEnabled: preferences.enableHapticFeedback,
  };
}
