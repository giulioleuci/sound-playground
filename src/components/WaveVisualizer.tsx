import { useRef, useEffect, useCallback } from 'react';

interface WaveVisualizerProps {
  frequency: number;
  amplitude: number;
  isAnimating: boolean;
  waveColor?: string;
  showGrid?: boolean;
  speed?: number;
}

export const WaveVisualizer = ({
  frequency,
  amplitude,
  isAnimating,
  waveColor = '#f97316',
  showGrid = true,
  speed = 1,
}: WaveVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'hsl(220 40% 13% / 0.08)';
      ctx.lineWidth = 1;
      
      // Horizontal lines
      for (let y = 0; y <= height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical lines
      for (let x = 0; x <= width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Center line
      ctx.strokeStyle = 'hsl(220 40% 13% / 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
    }

    // Draw wave
    const normalizedFrequency = frequency / 440; // Normalize around A4
    const waveLength = width / (2 + normalizedFrequency * 3);
    const waveAmplitude = (amplitude / 100) * (height / 3);

    ctx.strokeStyle = waveColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Add glow effect
    ctx.shadowColor = waveColor;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const y = centerY + Math.sin((x / waveLength) * Math.PI * 2 + phaseRef.current) * waveAmplitude;
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    if (isAnimating) {
      phaseRef.current += 0.05 * speed * (frequency / 440);
      animationRef.current = requestAnimationFrame(draw);
    }
  }, [frequency, amplitude, isAnimating, waveColor, showGrid, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    draw();
  }, [draw, isAnimating]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-48 rounded-xl wave-canvas"
      style={{ display: 'block' }}
    />
  );
};
