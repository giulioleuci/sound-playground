/**
 * Keyboard Shortcuts Hook
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from './useProgress';

export function useKeyboardShortcuts(customHandlers?: Record<string, () => void>) {
  const navigate = useNavigate();
  const { preferences } = usePreferences();

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!preferences.enableKeyboardShortcuts) return;

      // Ignore if typing in input
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Default shortcuts
      if (event.key === 'h' && !event.ctrlKey && !event.metaKey) {
        navigate('/');
        event.preventDefault();
      } else if (event.key === 'g' && !event.ctrlKey && !event.metaKey) {
        navigate('/glossario');
        event.preventDefault();
      } else if (event.key === 's' && !event.ctrlKey && !event.metaKey) {
        navigate('/sfida');
        event.preventDefault();
      } else if (event.key >= '1' && event.key <= '9') {
        const moduleNum = parseInt(event.key);
        if (moduleNum <= 14) {
          navigate(`/modulo-${moduleNum}`);
          event.preventDefault();
        }
      }

      // Custom handlers
      if (customHandlers && customHandlers[event.key]) {
        customHandlers[event.key]();
        event.preventDefault();
      }
    },
    [navigate, preferences.enableKeyboardShortcuts, customHandlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}
