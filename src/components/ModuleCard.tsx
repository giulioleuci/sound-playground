import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
}

export const ModuleCard = ({ number, title, description, icon: Icon, to, color }: ModuleCardProps) => {
  return (
    <Link to={to} className="block">
      <div className="module-card card-interactive group h-full">
        {/* Module number badge */}
        <div 
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ 
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {number}
        </div>

        {/* Icon */}
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ 
            backgroundColor: `${color}15`,
          }}
        >
          <Icon 
            className="w-7 h-7 transition-colors duration-300" 
            style={{ color }} 
          />
        </div>

        {/* Content */}
        <h3 className="font-display text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Hover indicator */}
        <div 
          className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl"
          style={{ backgroundColor: color }}
        />
      </div>
    </Link>
  );
};
