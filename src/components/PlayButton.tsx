import { Play, Square } from 'lucide-react';

interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayButton = ({ isPlaying, onToggle, size = 'md' }: PlayButtonProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <button
      onClick={onToggle}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
        isPlaying 
          ? 'bg-accent text-accent-foreground animate-pulse-glow' 
          : 'bg-primary text-primary-foreground hover:bg-accent hover:scale-105'
      }`}
    >
      {isPlaying ? (
        <Square size={iconSizes[size]} fill="currentColor" />
      ) : (
        <Play size={iconSizes[size]} fill="currentColor" className="ml-1" />
      )}
    </button>
  );
};
