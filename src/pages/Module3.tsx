import { useState, useCallback } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { WaveVisualizer } from '@/components/WaveVisualizer';
import { PlayButton } from '@/components/PlayButton';
import { Slider } from '@/components/Slider';
import { InfoBox } from '@/components/InfoBox';
import { useAudioContext } from '@/hooks/useAudioContext';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';

const Module3 = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [amplitude, setAmplitudeValue] = useState(50);
  const { startOscillator, stopOscillator, setAmplitude } = useAudioContext();
  
  const frequency = 440; // Fixed frequency for this module

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopOscillator();
      setIsPlaying(false);
    } else {
      startOscillator(frequency, amplitude / 100 * 0.5);
      setIsPlaying(true);
    }
  }, [isPlaying, amplitude, startOscillator, stopOscillator]);

  const handleAmplitudeChange = useCallback((newAmp: number) => {
    setAmplitudeValue(newAmp);
    if (isPlaying) {
      setAmplitude(newAmp / 100 * 0.5);
    }
  }, [isPlaying, setAmplitude]);

  const getVolumeLabel = () => {
    if (amplitude < 25) return 'Pianissimo';
    if (amplitude < 50) return 'Piano';
    if (amplitude < 75) return 'Forte';
    return 'Fortissimo';
  };

  return (
    <ModuleLayout
      moduleNumber={3}
      title="Ampiezza e intensità"
      description="Perché un suono è forte o debole? Dipende da quanto è grande la vibrazione, non da quanto è veloce!"
      prevModule={{ path: '/modulo-2', title: 'Frequenza' }}
      nextModule={{ path: '/modulo-4', title: 'Timbro' }}
    >
      <div className="space-y-8">
        {/* Main interactive area */}
        <div className="module-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold">
              Controlla il volume
            </h3>
            <span className="info-badge" style={{ 
              backgroundColor: `hsl(330 80% ${60 - amplitude * 0.2}% / 0.15)`,
              color: `hsl(330 80% ${50 - amplitude * 0.2}%)`
            }}>
              {getVolumeLabel()}
            </span>
          </div>
          
          <WaveVisualizer
            frequency={frequency}
            amplitude={amplitude}
            isAnimating={isPlaying}
            waveColor="#ec4899"
          />

          <div className="mt-6 space-y-6">
            <Slider
              value={amplitude}
              onChange={handleAmplitudeChange}
              min={10}
              max={100}
              step={1}
              label="Ampiezza (volume)"
              unit="%"
              color="#ec4899"
            />

            <div className="flex justify-center">
              <PlayButton 
                isPlaying={isPlaying} 
                onToggle={handleTogglePlay}
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Key distinction */}
        <InfoBox type="warning" title="Attenzione alla differenza!">
          La <strong>frequenza</strong> cambia quale nota senti (grave o acuta). 
          L'<strong>ampiezza</strong> cambia quanto forte la senti. Sono due cose completamente diverse!
        </InfoBox>

        {/* Visual comparison */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="module-card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🔈</span> 
              Suono debole
            </h4>
            <WaveVisualizer
              frequency={440}
              amplitude={25}
              isAnimating={true}
              waveColor="#ec4899"
              showGrid={false}
            />
            <p className="text-sm text-muted-foreground mt-3">
              L'onda è bassa: la vibrazione è piccola e il suono è piano.
            </p>
          </div>
          
          <div className="module-card">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-2xl">🔊</span> 
              Suono forte
            </h4>
            <WaveVisualizer
              frequency={440}
              amplitude={80}
              isAnimating={true}
              waveColor="#ec4899"
              showGrid={false}
            />
            <p className="text-sm text-muted-foreground mt-3">
              L'onda è alta: la vibrazione è grande e il suono è forte.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="module-card bg-gradient-to-br from-pink-500/5 to-purple-500/5">
          <h4 className="font-display text-lg font-semibold mb-4">
            📊 Riepilogo: cosa cambia cosa?
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="font-medium">Frequenza</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>→ Velocità della vibrazione</li>
                <li>→ Cambia la nota (grave/acuta)</li>
                <li>→ Si misura in Hz</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-background">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="font-medium">Ampiezza</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>→ Dimensione della vibrazione</li>
                <li>→ Cambia il volume (piano/forte)</li>
                <li>→ Si misura in decibel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={3} questions={getQuizForModule(3)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module3;
