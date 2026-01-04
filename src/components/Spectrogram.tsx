/**
 * Spectrogram Component
 * Visualizzazione spettrogramma real-time con FFT analysis
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { getAudioContext } from '@/lib/audioUtils';
import { setupCanvasDPI, clearCanvas } from '@/lib/canvasUtils';
import { cn } from '@/lib/utils';

interface SpectrogramProps {
  audioSource?: MediaStreamAudioSourceNode | OscillatorNode | GainNode | AudioNode;
  fftSize?: number; // 256, 512, 1024, 2048, 4096, 8192
  smoothing?: number; // 0-1
  minDecibels?: number; // -100 to 0
  maxDecibels?: number; // -100 to 0
  showFrequencyLabels?: boolean;
  colorScheme?: 'purple' | 'blue' | 'green' | 'rainbow';
  className?: string;
}

/**
 * Spettrogramma con analisi FFT
 */
export function Spectrogram({
  audioSource,
  fftSize = 2048,
  smoothing = 0.8,
  minDecibels = -90,
  maxDecibels = -10,
  showFrequencyLabels = true,
  colorScheme = 'purple',
  className,
}: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Setup analyser
  useEffect(() => {
    if (!audioSource) return;

    try {
      const ctx = getAudioContext();
      const analyser = ctx.createAnalyser();

      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothing;
      analyser.minDecibels = minDecibels;
      analyser.maxDecibels = maxDecibels;

      // Connect audio source to analyser (but don't connect to destination - solo analisi)
      if ('connect' in audioSource) {
        audioSource.connect(analyser);
      }

      analyserRef.current = analyser;
      setIsActive(true);

      return () => {
        if (analyserRef.current && 'disconnect' in audioSource) {
          try {
            audioSource.disconnect(analyser);
          } catch (e) {
            // Already disconnected
          }
        }
        analyserRef.current = null;
        setIsActive(false);
      };
    } catch (error) {
      console.error('Errore setup analyser:', error);
    }
  }, [audioSource, fftSize, smoothing, minDecibels, maxDecibels]);

  // Get color based on frequency value
  const getColor = useCallback(
    (value: number): string => {
      // value is 0-255
      const intensity = value / 255;

      switch (colorScheme) {
        case 'purple':
          return `rgba(139, 92, 246, ${intensity})`;
        case 'blue':
          return `rgba(59, 130, 246, ${intensity})`;
        case 'green':
          return `rgba(34, 197, 94, ${intensity})`;
        case 'rainbow': {
          const hue = (1 - intensity) * 240; // 240 (blue) to 0 (red)
          return `hsla(${hue}, 100%, 50%, ${intensity})`;
        }
        default:
          return `rgba(139, 92, 246, ${intensity})`;
      }
    },
    [colorScheme]
  );

  // Draw spectrum
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

    const { ctx, width, height } = setupCanvasDPI(canvas);
    clearCanvas(ctx, width, height);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const barWidth = width / bufferLength;

    // Draw bars
    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];
      const barHeight = (value / 255) * height;

      const x = i * barWidth;
      const y = height - barHeight;

      ctx.fillStyle = getColor(value);
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }

    // Draw frequency labels
    if (showFrequencyLabels) {
      const sampleRate = getAudioContext().sampleRate;
      const nyquist = sampleRate / 2;

      ctx.fillStyle = '#666';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';

      // Label importanti
      const labels = [
        { freq: 100, label: '100 Hz' },
        { freq: 440, label: '440 Hz (A4)' },
        { freq: 1000, label: '1 kHz' },
        { freq: 5000, label: '5 kHz' },
        { freq: 10000, label: '10 kHz' },
      ];

      labels.forEach(({ freq, label }) => {
        if (freq > nyquist) return;

        const binIndex = Math.round((freq / nyquist) * bufferLength);
        const x = binIndex * barWidth;

        ctx.fillText(label, x, 12);

        // Vertical line
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x, 15);
        ctx.lineTo(x, height);
        ctx.stroke();
      });
    }

    // Continue animation
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }
  }, [getColor, showFrequencyLabels, isActive]);

  // Start/stop animation
  useEffect(() => {
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, draw]);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg bg-gray-900"
        style={{ minHeight: '200px' }}
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <p className="text-white text-sm">
            Riproduci un suono per vedere lo spettro
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Oscilloscopio (forma d'onda nel tempo)
 */
export function Oscilloscope({
  audioSource,
  fftSize = 2048,
  className,
}: {
  audioSource?: MediaStreamAudioSourceNode | OscillatorNode | GainNode | AudioNode;
  fftSize?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Setup analyser
  useEffect(() => {
    if (!audioSource) return;

    try {
      const ctx = getAudioContext();
      const analyser = ctx.createAnalyser();

      analyser.fftSize = fftSize;

      if ('connect' in audioSource) {
        audioSource.connect(analyser);
      }

      analyserRef.current = analyser;
      setIsActive(true);

      return () => {
        if (analyserRef.current && 'disconnect' in audioSource) {
          try {
            audioSource.disconnect(analyser);
          } catch (e) {
            // Already disconnected
          }
        }
        analyserRef.current = null;
        setIsActive(false);
      };
    } catch (error) {
      console.error('Errore setup analyser:', error);
    }
  }, [audioSource, fftSize]);

  // Draw waveform
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

    const { ctx, width, height } = setupCanvasDPI(canvas);
    clearCanvas(ctx, width, height);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // Draw waveform
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#8b5cf6';

    ctx.beginPath();

    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0; // Convert to 0-2
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Center line
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Continue animation
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }
  }, [isActive]);

  // Start/stop animation
  useEffect(() => {
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, draw]);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg bg-gray-900"
        style={{ minHeight: '150px' }}
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
          <p className="text-white text-sm">
            Riproduci un suono per vedere la forma d'onda
          </p>
        </div>
      )}
    </div>
  );
}
