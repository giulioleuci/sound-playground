/**
 * DarkModeToggle Component
 */

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

export function DarkModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'bg-gray-200 dark:bg-gray-700',
        'hover:bg-gray-300 dark:hover:bg-gray-600',
        'text-gray-800 dark:text-gray-200',
        className
      )}
      title={`Passa a tema ${resolvedTheme === 'dark' ? 'chiaro' : 'scuro'}`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
