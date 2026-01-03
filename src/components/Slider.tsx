import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  showValue?: boolean;
  color?: string;
}

export const Slider = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = '',
  showValue = true,
  color = 'hsl(var(--accent))',
}: SliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {showValue && (
          <span className="text-sm font-semibold text-accent">
            {value.toFixed(step < 1 ? 1 : 0)}{unit}
          </span>
        )}
      </div>
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      >
        <SliderPrimitive.Track className="bg-muted relative grow rounded-full h-3 overflow-hidden">
          <SliderPrimitive.Range 
            className="absolute h-full rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "block w-6 h-6 rounded-full shadow-lg transition-transform",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent",
            "hover:scale-110 active:scale-95"
          )}
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}50`,
          }}
        />
      </SliderPrimitive.Root>
    </div>
  );
};
