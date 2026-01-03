import { ReactNode } from 'react';
import { Lightbulb, Info, AlertCircle } from 'lucide-react';

interface InfoBoxProps {
  type?: 'tip' | 'info' | 'warning';
  title?: string;
  children: ReactNode;
}

export const InfoBox = ({ type = 'info', title, children }: InfoBoxProps) => {
  const styles = {
    tip: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      icon: Lightbulb,
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-700 dark:text-amber-400',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      icon: Info,
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-700 dark:text-blue-400',
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      border: 'border-orange-200 dark:border-orange-800',
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      titleColor: 'text-orange-700 dark:text-orange-400',
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  return (
    <div className={`rounded-xl p-4 border ${style.bg} ${style.border}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
        <div>
          {title && (
            <h4 className={`font-semibold mb-1 ${style.titleColor}`}>{title}</h4>
          )}
          <div className="text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
