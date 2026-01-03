/**
 * Modulo 12: Sintesi Additiva
 * Creare timbri complessi sommando armonici (drawbars tipo organo Hammond)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { PlayButton } from '@/components/PlayButton';
import { Slider } from '@/components/Slider';
import { getAudioContext, stopOscillator, type OscillatorNodes } from '@/lib/audioUtils';
import { useModuleStatus } from '@/hooks/useProgress';
import { useCanvas } from '@/hooks/useCanvas';
import { clearCanvas, drawSineWave } from '@/lib/canvasUtils';
import { PresetManager } from '@/components/PresetManager';
import { TermTooltip } from '@/components/TermTooltip';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';
import { Spectrogram } from '@/components/Spectrogram';

interface Harmonic {
  number: number;
  label: string;
  level: number;
}

const HAMMOND_DRAWBARS: Harmonic[] = [
  { number: 0.5, label: 'Sub (16\')', level: 0 },
  { number: 1, label: 'Fond. (8\')', level: 8 },
  { number: 2, label: '2° (4\')', level: 0 },
  { number: 3, label: '3° (2 2/3\')', level: 0 },
  { number: 4, label: '4° (2\')', level: 0 },
  { number: 5, label: '5° (1 3/5\')', level: 0 },
  { number: 6, label: '6° (1 1/3\')', level: 0 },
  { number: 8, label: '8° (1\')', level: 0 },
];

export default function Module12() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFrequency, setBaseFrequency] = useState(261.63); // C4
  const [harmonics, setHarmonics] = useState<Harmonic[]>(HAMMOND_DRAWBARS);
  const oscillatorsRef = useRef<OscillatorNodes[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const { markCompleted } = useModuleStatus(12);

  // Visualizzazione forma d'onda composita
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      clearCanvas(ctx, width, height);

      const centerY = height / 2;

      // Draw center line
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw composite waveform
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5cf6';

      ctx.beginPath();

      for (let x = 0; x <= width; x++) {
        let y = centerY;

        // Sum all harmonics
        harmonics.forEach(harmonic => {
          if (harmonic.level > 0) {
            const amplitude = (harmonic.level / 8) * 0.15 * height;
            const frequency = harmonic.number;
            const phase = (x / width) * Math.PI * 8 * frequency;
            y += Math.sin(phase) * amplitude;
          }
        });

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    },
    [harmonics]
  );

  const { canvasRef } = useCanvas({ draw, animate: false });

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      // Stop all oscillators
      oscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      oscillatorsRef.current = [];
      masterGainRef.current = null;
      setIsPlaying(false);
    } else {
      // Start oscillators for each active harmonic
      try {
        const ctx = getAudioContext();
        const newOscillators: OscillatorNodes[] = [];

        // Create master gain for visualization
        const masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        harmonics.forEach(harmonic => {
          if (harmonic.level > 0) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = baseFrequency * harmonic.number;
            gain.gain.value = (harmonic.level / 8) * 0.2; // Max 0.2 per armonico

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();

            newOscillators.push({ oscillator: osc, gainNode: gain });
          }
        });

        oscillatorsRef.current = newOscillators;
        setIsPlaying(true);
      } catch (error) {
        console.error('Errore avvio sintesi:', error);
      }
    }
  }, [isPlaying, harmonics, baseFrequency]);

  const handleHarmonicChange = useCallback((index: number, newLevel: number) => {
    setHarmonics(prev => {
      const updated = [...prev];
      updated[index].level = newLevel;
      return updated;
    });
  }, []);

  // Update oscillators in real-time when playing
  useEffect(() => {
    if (!isPlaying) return;

    // Stop and restart with new settings
    oscillatorsRef.current.forEach(nodes => stopOscillator(nodes));

    try {
      const ctx = getAudioContext();
      const newOscillators: OscillatorNodes[] = [];

      // Create/reuse master gain
      if (!masterGainRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;
      }

      harmonics.forEach(harmonic => {
        if (harmonic.level > 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.value = baseFrequency * harmonic.number;
          gain.gain.value = (harmonic.level / 8) * 0.2;

          osc.connect(gain);
          gain.connect(masterGainRef.current!);
          osc.start();

          newOscillators.push({ oscillator: osc, gainNode: gain });
        }
      });

      oscillatorsRef.current = newOscillators;
    } catch (error) {
      console.error('Errore aggiornamento sintesi:', error);
    }
  }, [harmonics, baseFrequency, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
    };
  }, []);

  const handleLoadPreset = useCallback((parameters: Record<string, any>) => {
    if (parameters.baseFrequency) setBaseFrequency(parameters.baseFrequency);
    if (parameters.harmonics) setHarmonics(parameters.harmonics);
  }, []);

  return (
    <ModuleLayout
      moduleNumber={12}
      title="Sintesi Additiva"
      description="Crea timbri complessi sommando armonici puri"
      nextModule={{ path: '/modulo-13', title: 'Inviluppo ADSR' }}
      prevModule={{ path: '/modulo-11', title: 'Temperamenti' }}
    >
      <div className="space-y-8">
        <InfoBox type="info">
          <p>
            La <TermTooltip term="sintesi">sintesi additiva</TermTooltip> crea suoni complessi
            sommando onde sinusoidali pure. Ogni <TermTooltip term="armonici">armonico</TermTooltip>{' '}
            contribuisce al <TermTooltip term="timbro">timbro</TermTooltip> finale.
            Questo è il principio alla base degli organi Hammond e della serie di Fourier.
          </p>
        </InfoBox>

        {/* Waveform Visualization */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Forma d'onda composita
          </h3>
          <canvas
            ref={canvasRef}
            className="w-full h-48 rounded-lg bg-gray-900"
          />
        </div>

        {/* Base Frequency Control */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Frequenza Base
          </h3>
          <Slider
            value={baseFrequency}
            onChange={setBaseFrequency}
            min={130.81} // C3
            max={523.25} // C5
            step={0.01}
            unit="Hz"
            label={`${baseFrequency.toFixed(2)} Hz`}
          />
        </div>

        {/* Hammond Drawbars */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Drawbars (stile Organo Hammond)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Regola l'intensità di ciascun armonico per creare timbri unici
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {harmonics.map((harmonic, index) => (
              <div key={index} className="space-y-2">
                <div className="text-center">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {harmonic.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {harmonic.number}×
                  </p>
                </div>

                {/* Vertical slider */}
                <div className="flex flex-col items-center">
                  <input
                    type="range"
                    min={0}
                    max={8}
                    step={1}
                    value={harmonic.level}
                    onChange={e => handleHarmonicChange(index, parseInt(e.target.value))}
                    className="h-32 slider-vertical"
                    style={{
                      writingMode: 'bt-lr',
                      WebkitAppearance: 'slider-vertical',
                      width: '8px',
                    }}
                  />
                  <span className="mt-2 text-lg font-bold text-purple-600 dark:text-purple-400">
                    {harmonic.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Play Control */}
        <div className="flex justify-center">
          <PlayButton isPlaying={isPlaying} onToggle={handleTogglePlay} size="lg" />
        </div>

        {/* Spectrogram visualization */}
        {isPlaying && masterGainRef.current && (
          <div className="module-card">
            <h3 className="font-display text-xl font-semibold mb-4">
              Spettro degli armonici
            </h3>
            <Spectrogram
              audioSource={masterGainRef.current as any}
              fftSize={2048}
              colorScheme="purple"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Lo spettrogramma visualizza lo spettro degli armonici attivi.
              Ogni picco corrisponde a un drawbar attivo, mostrando come i diversi
              armonici si combinano per creare il timbro finale.
            </p>
          </div>
        )}

        {/* Preset Manager */}
        <PresetManager
          moduleNumber={12}
          currentParameters={{ baseFrequency, harmonics }}
          onLoadPreset={handleLoadPreset}
        />

        {/* Educational Notes */}
        <InfoBox type="tip">
          <p className="mb-2"><strong>Esperimenti da provare:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Attiva solo la fondamentale (8') e il 2° armonico per un suono simile al flauto</li>
            <li>Aumenta gli armonici dispari (3°, 5°, 7°) per un suono simile al clarinetto</li>
            <li>Bilancia armonici pari e dispari per timbri di archi</li>
            <li>Aggiungi la sub-ottava (16') per un suono più corposo</li>
          </ul>
        </InfoBox>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={12} questions={getQuizForModule(12)} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => markCompleted(100)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Segna Modulo Come Completato
          </button>
        </div>
      </div>
    </ModuleLayout>
  );
}
