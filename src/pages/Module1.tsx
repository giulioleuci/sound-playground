import { useState, useCallback } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { WaveVisualizer } from '@/components/WaveVisualizer';
import { PlayButton } from '@/components/PlayButton';
import { Slider } from '@/components/Slider';
import { InfoBox } from '@/components/InfoBox';
import { useAudioContext } from '@/hooks/useAudioContext';

const Module1 = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const { startOscillator, stopOscillator, setFrequency } = useAudioContext();
  
  const baseFrequency = 220; // A3
  const currentFrequency = baseFrequency * speed;

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopOscillator();
      setIsPlaying(false);
    } else {
      startOscillator(currentFrequency, 0.25);
      setIsPlaying(true);
    }
  }, [isPlaying, currentFrequency, startOscillator, stopOscillator]);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      setFrequency(baseFrequency * newSpeed);
    }
  }, [isPlaying, setFrequency]);

  return (
    <ModuleLayout
      moduleNumber={1}
      title="Il suono come vibrazione"
      description="Ogni suono che senti nasce da qualcosa che vibra. Scopri la connessione tra movimento e suono."
      nextModule={{ path: '/modulo-2', title: 'Frequenza' }}
    >
      <div className="space-y-8">
        {/* Main interactive area */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            Osserva l'onda sonora
          </h3>
          
          <WaveVisualizer
            frequency={currentFrequency}
            amplitude={60}
            isAnimating={isPlaying}
            speed={speed}
          />

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <PlayButton 
              isPlaying={isPlaying} 
              onToggle={handleTogglePlay}
              size="lg"
            />
            
            <div className="flex-1 w-full">
              <Slider
                value={speed}
                onChange={handleSpeedChange}
                min={0.5}
                max={2}
                step={0.1}
                label="Velocità della vibrazione"
                unit="x"
              />
            </div>
          </div>
        </div>

        {/* Explanation */}
        <InfoBox type="tip" title="Cosa sta succedendo?">
          Quando premi play, stai facendo vibrare l'aria attraverso gli altoparlanti. 
          L'onda che vedi rappresenta questa vibrazione: quando è veloce il suono è acuto, 
          quando è lenta il suono è grave.
        </InfoBox>

        {/* Key concepts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="module-card">
            <div className="w-10 h-10 rounded-xl bg-wave-primary/20 flex items-center justify-center mb-3">
              <span className="text-lg">🔊</span>
            </div>
            <h4 className="font-semibold mb-2">Il suono è movimento</h4>
            <p className="text-sm text-muted-foreground">
              Ogni suono è creato da qualcosa che si muove avanti e indietro molto velocemente: 
              una corda, la membrana di un tamburo, le tue corde vocali.
            </p>
          </div>
          
          <div className="module-card">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
              <span className="text-lg">👂</span>
            </div>
            <h4 className="font-semibold mb-2">Le orecchie "vedono" le vibrazioni</h4>
            <p className="text-sm text-muted-foreground">
              Le vibrazioni viaggiano nell'aria come onde nell'acqua. 
              Quando raggiungono le tue orecchie, le trasformi in suoni.
            </p>
          </div>
        </div>

        {/* Experiment suggestion */}
        <InfoBox type="info" title="Prova tu!">
          Muovi il cursore mentre ascolti: nota come il suono cambia insieme all'onda. 
          Vibrazioni più veloci = suoni più acuti. Vibrazioni più lente = suoni più gravi.
        </InfoBox>
      </div>
    </ModuleLayout>
  );
};

export default Module1;
