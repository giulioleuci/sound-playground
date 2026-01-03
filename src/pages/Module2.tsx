import { useState, useCallback } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { WaveVisualizer } from '@/components/WaveVisualizer';
import { PlayButton } from '@/components/PlayButton';
import { Slider } from '@/components/Slider';
import { InfoBox } from '@/components/InfoBox';
import { useAudioContext } from '@/hooks/useAudioContext';

const Module2 = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequencyValue] = useState(440);
  const [compareMode, setCompareMode] = useState(false);
  const { startOscillator, stopOscillator, setFrequency, playNote } = useAudioContext();

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopOscillator();
      setIsPlaying(false);
    } else {
      startOscillator(frequency, 0.25);
      setIsPlaying(true);
    }
  }, [isPlaying, frequency, startOscillator, stopOscillator]);

  const handleFrequencyChange = useCallback((newFreq: number) => {
    setFrequencyValue(newFreq);
    if (isPlaying) {
      setFrequency(newFreq);
    }
  }, [isPlaying, setFrequency]);

  const playComparison = useCallback(() => {
    setCompareMode(true);
    // Play low note
    playNote(220, 0.6, 0.25);
    // Play high note after delay
    setTimeout(() => {
      playNote(440, 0.6, 0.25);
      setTimeout(() => setCompareMode(false), 700);
    }, 700);
  }, [playNote]);

  const getFrequencyLabel = () => {
    if (frequency < 200) return 'Molto grave';
    if (frequency < 350) return 'Grave';
    if (frequency < 500) return 'Medio';
    if (frequency < 700) return 'Acuto';
    return 'Molto acuto';
  };

  return (
    <ModuleLayout
      moduleNumber={2}
      title="Frequenza e altezza"
      description="Quante volte vibra in un secondo? Questo numero si chiama frequenza e determina quanto è acuto o grave un suono."
      prevModule={{ path: '/modulo-1', title: 'Vibrazione' }}
      nextModule={{ path: '/modulo-3', title: 'Ampiezza' }}
    >
      <div className="space-y-8">
        {/* Main interactive area */}
        <div className="module-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold">
              Controlla la frequenza
            </h3>
            <span className="info-badge">
              {getFrequencyLabel()}
            </span>
          </div>
          
          <WaveVisualizer
            frequency={frequency}
            amplitude={60}
            isAnimating={isPlaying}
            waveColor={frequency > 500 ? '#8b5cf6' : '#3b82f6'}
          />

          <div className="mt-6 space-y-6">
            <Slider
              value={frequency}
              onChange={handleFrequencyChange}
              min={100}
              max={880}
              step={1}
              label="Frequenza"
              unit=" Hz"
              color={frequency > 500 ? '#8b5cf6' : '#3b82f6'}
            />

            <div className="flex items-center justify-center gap-4">
              <PlayButton 
                isPlaying={isPlaying} 
                onToggle={handleTogglePlay}
              />
              
              <button
                onClick={playComparison}
                disabled={compareMode}
                className="btn-play disabled:opacity-50"
              >
                {compareMode ? 'Ascolta...' : 'Confronta grave/acuto'}
              </button>
            </div>
          </div>
        </div>

        {/* Visual frequency comparison */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="module-card">
            <h4 className="font-semibold mb-3 text-blue-600">Suono grave (220 Hz)</h4>
            <WaveVisualizer
              frequency={220}
              amplitude={50}
              isAnimating={isPlaying && frequency < 300}
              waveColor="#3b82f6"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Vibra 220 volte al secondo. L'onda è più "distesa".
            </p>
          </div>
          
          <div className="module-card">
            <h4 className="font-semibold mb-3 text-violet-600">Suono acuto (440 Hz)</h4>
            <WaveVisualizer
              frequency={440}
              amplitude={50}
              isAnimating={isPlaying && frequency >= 300}
              waveColor="#8b5cf6"
            />
            <p className="text-sm text-muted-foreground mt-3">
              Vibra 440 volte al secondo – il doppio! L'onda è più "compressa".
            </p>
          </div>
        </div>

        <InfoBox type="tip" title="Il rapporto è la chiave!">
          440 Hz è esattamente il doppio di 220 Hz. Questo rapporto 2:1 è speciale nella musica: 
          si chiama <strong>ottava</strong> e le due note suonano "uguali ma diverse". 
          Esploreremo meglio questo concetto nel Modulo 6!
        </InfoBox>

        {/* Key insight */}
        <div className="module-card bg-gradient-to-br from-primary/5 to-accent/5">
          <h4 className="font-display text-lg font-semibold mb-3">
            🎵 Cosa significa Hz?
          </h4>
          <p className="text-muted-foreground">
            <strong>Hz</strong> sta per Hertz, l'unità di misura della frequenza. 
            Un suono a 440 Hz vibra 440 volte in un secondo! È la nota "La" che 
            gli strumenti usano per accordarsi.
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module2;
