/**
 * Modulo 13: Inviluppo ADSR
 * Attack, Decay, Sustain, Release - Controllo dinamica temporale del suono
 */

import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Slider } from '@/components/Slider';
import { getAudioContext } from '@/lib/audioUtils';
import { useModuleStatus } from '@/hooks/useProgress';
import { useCanvas } from '@/hooks/useCanvas';
import { clearCanvas } from '@/lib/canvasUtils';
import { PresetManager } from '@/components/PresetManager';
import { TermTooltip } from '@/components/TermTooltip';
import { Music, Piano, Guitar, Drum } from 'lucide-react';

interface ADSRParams {
  attack: number; // seconds
  decay: number; // seconds
  sustain: number; // 0-1
  release: number; // seconds
}

const PRESETS: Record<string, ADSRParams> = {
  piano: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
  organ: { attack: 0.1, decay: 0.0, sustain: 1.0, release: 0.1 },
  strings: { attack: 0.4, decay: 0.2, sustain: 0.7, release: 0.8 },
  pluck: { attack: 0.001, decay: 0.3, sustain: 0.0, release: 0.1 },
  pad: { attack: 1.0, decay: 0.5, sustain: 0.8, release: 2.0 },
  brass: { attack: 0.1, decay: 0.1, sustain: 0.9, release: 0.3 },
};

export default function Module13() {
  const [attack, setAttack] = useState(0.01);
  const [decay, setDecay] = useState(0.3);
  const [sustain, setSustain] = useState(0.7);
  const [release, setRelease] = useState(0.5);
  const [frequency, setFrequency] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const noteStartTimeRef = useRef<number>(0);
  const { markCompleted } = useModuleStatus(13);

  // Visualizza ADSR envelope
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      clearCanvas(ctx, width, height);

      const padding = 40;
      const graphWidth = width - 2 * padding;
      const graphHeight = height - 2 * padding;

      // Draw axes
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#666';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tempo', width / 2, height - 10);
      ctx.save();
      ctx.translate(15, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Ampiezza', 0, 0);
      ctx.restore();

      // Calculate time points
      const totalTime = attack + decay + 0.5 + release; // 0.5s for sustain display
      const attackEnd = padding + (attack / totalTime) * graphWidth;
      const decayEnd = attackEnd + (decay / totalTime) * graphWidth;
      const sustainEnd = decayEnd + (0.5 / totalTime) * graphWidth;
      const releaseEnd = sustainEnd + (release / totalTime) * graphWidth;

      const baseline = height - padding;
      const peak = padding;
      const sustainLevel = baseline - sustain * (baseline - peak);

      // Draw ADSR curve
      ctx.strokeStyle = '#8b5cf6';
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5cf6';

      ctx.beginPath();
      ctx.moveTo(padding, baseline);

      // Attack
      ctx.lineTo(attackEnd, peak);

      // Decay
      ctx.lineTo(decayEnd, sustainLevel);

      // Sustain
      ctx.lineTo(sustainEnd, sustainLevel);

      // Release
      ctx.lineTo(releaseEnd, baseline);

      ctx.stroke();

      // Fill area
      ctx.shadowBlur = 0;
      ctx.lineTo(releaseEnd, baseline);
      ctx.lineTo(padding, baseline);
      ctx.closePath();
      ctx.fill();

      // Draw phase labels
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';

      const labelY = peak - 15;
      if (attack > 0.05) {
        ctx.fillText('A', (padding + attackEnd) / 2, labelY);
      }
      if (decay > 0.05) {
        ctx.fillText('D', (attackEnd + decayEnd) / 2, labelY);
      }
      ctx.fillText('S', (decayEnd + sustainEnd) / 2, labelY);
      if (release > 0.05) {
        ctx.fillText('R', (sustainEnd + releaseEnd) / 2, labelY);
      }

      // Draw vertical phase separators
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      [attackEnd, decayEnd, sustainEnd].forEach(x => {
        ctx.beginPath();
        ctx.moveTo(x, peak);
        ctx.lineTo(x, baseline);
        ctx.stroke();
      });

      ctx.setLineDash([]);
    },
    [attack, decay, sustain, release]
  );

  const { canvasRef } = useCanvas({ draw, animate: false });

  const handlePlayNote = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.value = frequency;
      osc.type = 'sine';

      // ADSR envelope
      gain.gain.setValueAtTime(0, now);
      // Attack
      gain.gain.linearRampToValueAtTime(1, now + attack);
      // Decay
      gain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
      // Sustain (hold for 1 second)
      gain.gain.setValueAtTime(sustain, now + attack + decay + 1);
      // Release
      gain.gain.linearRampToValueAtTime(0, now + attack + decay + 1 + release);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + attack + decay + 1 + release);

      setIsPlaying(true);
      noteStartTimeRef.current = now;

      setTimeout(() => {
        setIsPlaying(false);
      }, (attack + decay + 1 + release) * 1000);
    } catch (error) {
      console.error('Errore riproduzione nota:', error);
    }
  }, [attack, decay, sustain, release, frequency]);

  const loadPreset = useCallback((presetName: string) => {
    const preset = PRESETS[presetName];
    if (preset) {
      setAttack(preset.attack);
      setDecay(preset.decay);
      setSustain(preset.sustain);
      setRelease(preset.release);
    }
  }, []);

  const handleLoadCustomPreset = useCallback((parameters: Record<string, any>) => {
    if (parameters.attack !== undefined) setAttack(parameters.attack);
    if (parameters.decay !== undefined) setDecay(parameters.decay);
    if (parameters.sustain !== undefined) setSustain(parameters.sustain);
    if (parameters.release !== undefined) setRelease(parameters.release);
    if (parameters.frequency !== undefined) setFrequency(parameters.frequency);
  }, []);

  return (
    <ModuleLayout
      moduleNumber={13}
      title="Inviluppo ADSR"
      description="Controlla la dinamica temporale del suono"
      nextModule={{ path: '/modulo-14', title: 'Psicoacustica' }}
      prevModule={{ path: '/modulo-12', title: 'Sintesi Additiva' }}
    >
      <div className="space-y-8">
        <InfoBox type="info">
          <p>
            L'<TermTooltip term="ADSR">inviluppo ADSR</TermTooltip> controlla come l'
            <TermTooltip term="ampiezza">ampiezza</TermTooltip> di un suono varia nel tempo:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Attack (A):</strong> tempo per raggiungere il volume massimo</li>
            <li><strong>Decay (D):</strong> tempo per scendere al livello di sustain</li>
            <li><strong>Sustain (S):</strong> livello mantenuto mentre la nota è premuta</li>
            <li><strong>Release (R):</strong> tempo per tornare a silenzio dopo il rilascio</li>
          </ul>
        </InfoBox>

        {/* ADSR Visualization */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Grafico Inviluppo ADSR
          </h3>
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg bg-gray-50 dark:bg-gray-900"
          />
        </div>

        {/* Preset Buttons */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Preset Strumenti
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(PRESETS).map(([name, preset]) => (
              <button
                key={name}
                onClick={() => loadPreset(name)}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-800 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  {name === 'piano' && <Piano className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  {name === 'organ' && <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  {name === 'strings' && <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  {name === 'pluck' && <Guitar className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  {name === 'pad' && <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  {name === 'brass' && <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ADSR Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Attack
            </h3>
            <Slider
              value={attack}
              onChange={setAttack}
              min={0.001}
              max={2}
              step={0.001}
              unit="s"
              label={`${attack.toFixed(3)} s`}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tempo per raggiungere il volume massimo
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Decay
            </h3>
            <Slider
              value={decay}
              onChange={setDecay}
              min={0}
              max={2}
              step={0.01}
              unit="s"
              label={`${decay.toFixed(2)} s`}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tempo per scendere al livello di sustain
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Sustain
            </h3>
            <Slider
              value={sustain}
              onChange={setSustain}
              min={0}
              max={1}
              step={0.01}
              unit=""
              label={`${(sustain * 100).toFixed(0)}%`}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Livello mantenuto (0-100%)
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Release
            </h3>
            <Slider
              value={release}
              onChange={setRelease}
              min={0.01}
              max={3}
              step={0.01}
              unit="s"
              label={`${release.toFixed(2)} s`}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tempo per tornare a silenzio
            </p>
          </div>
        </div>

        {/* Frequency Control */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Frequenza Nota
          </h3>
          <Slider
            value={frequency}
            onChange={setFrequency}
            min={130.81}
            max={1046.5}
            step={0.01}
            unit="Hz"
            label={`${frequency.toFixed(2)} Hz`}
          />
        </div>

        {/* Play Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePlayNote}
            disabled={isPlaying}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {isPlaying ? 'Riproduzione...' : 'Riproduci Nota'}
          </button>
        </div>

        {/* Preset Manager */}
        <PresetManager
          moduleNumber={13}
          currentParameters={{ attack, decay, sustain, release, frequency }}
          onLoadPreset={handleLoadCustomPreset}
        />

        {/* Educational Tips */}
        <InfoBox type="tip">
          <p className="mb-2"><strong>Caratteristiche tipiche degli strumenti:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Piano:</strong> Attack veloce, decay medio, sustain basso, release breve</li>
            <li><strong>Organo:</strong> Attack medio, no decay, sustain pieno, release breve</li>
            <li><strong>Archi:</strong> Attack lento, decay breve, sustain alto, release lungo</li>
            <li><strong>Percussioni:</strong> Attack istantaneo, decay veloce, no sustain</li>
            <li><strong>Pad:</strong> Attack molto lento, sustain alto, release molto lungo</li>
          </ul>
        </InfoBox>

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
