/**
 * ProgressBar Component
 * Mostra progresso completamento moduli con dettagli
 */

import { useModuleProgress } from '@/hooks/useProgress';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

/**
 * Barra di progresso con dettagli moduli completati
 */
export function ProgressBar({ className, showDetails = false, compact = false }: ProgressBarProps) {
  const { completionPercentage, progress } = useModuleProgress();

  const totalModules = 14; // 11 originali + 3 nuovi
  const completedCount = progress.filter(p => p.completed).length;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Progress value={completionPercentage} className="flex-1 h-2" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[60px]">
          {completedCount}/{totalModules}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Il Tuo Progresso
          </h3>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {completedCount} di {totalModules} moduli completati
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={completionPercentage} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {completionPercentage}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-2">
          {Array.from({ length: totalModules }, (_, i) => i + 1).map(moduleNum => {
            const moduleProgress = progress.find(p => p.moduleNumber === moduleNum);
            const isCompleted = moduleProgress?.completed ?? false;
            const isVisited = !!moduleProgress;

            return (
              <div
                key={moduleNum}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  isCompleted && 'bg-green-50 dark:bg-green-900/20',
                  isVisited && !isCompleted && 'bg-purple-50 dark:bg-purple-900/20',
                  !isVisited && 'bg-gray-50 dark:bg-gray-800'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                )}
                <span
                  className={cn(
                    'font-medium',
                    isCompleted && 'text-green-700 dark:text-green-300',
                    isVisited && !isCompleted && 'text-purple-700 dark:text-purple-300',
                    !isVisited && 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  Modulo {moduleNum}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Milestone Messages */}
      {completionPercentage === 100 && (
        <div className="mt-3 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-bold text-purple-900 dark:text-purple-100">
                🎉 Congratulazioni!
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Hai completato tutti i moduli di Sound Playground!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Badge progresso compatto per header
 */
export function ProgressBadge() {
  const { completionPercentage } = useModuleProgress();

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
      <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
      <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
        {completionPercentage}%
      </span>
    </div>
  );
}
