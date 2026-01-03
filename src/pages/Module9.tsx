import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Slider } from '@/components/Slider';
import { PlayButton } from '@/components/PlayButton';

const Module9 = () => {
  const [stringLength, setStringLength] = useState(100);
  const [pipeLength, setPipeLength] = useState(100);
  const [isPlayingString, setIsPlayingString] = useState(false);
  const [isPlayingPipe, setIsPlayingPipe] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const baseFreq = 220; // Base frequency at 100% length

  const playString = useCallback(() => {
    if (isPlayingString) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlayingString(false);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Frequency is inversely proportional to length
    const freq = baseFreq * (100 / stringLength);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle'; // Sounds more like a string
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscillatorRef.current = osc;
    setIsPlayingString(true);
  }, [isPlayingString, stringLength]);

  const playPipe = useCallback(() => {
    if (isPlayingPipe) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlayingPipe(false);
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const freq = baseFreq * (100 / pipeLength);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine'; // Pure tone like a flute
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    oscillatorRef.current = osc;
    setIsPlayingPipe(true);
  }, [isPlayingPipe, pipeLength]);

  // Calculate ratios for display
  const stringRatio = (100 / stringLength).toFixed(2);
  const pipeRatio = (100 / pipeLength).toFixed(2);
  const stringFreq = (baseFreq * (100 / stringLength)).toFixed(0);
  const pipeFreq = (baseFreq * (100 / pipeLength)).toFixed(0);

  return (
    <ModuleLayout
      moduleNumber={9}
      title="Corde e colonne d'aria"
      description="Dalle corde della chitarra alle canne del flauto di Pan: la stessa matematica governa strumenti completamente diversi!"
      prevModule={{ path: '/modulo-8', title: 'Dominante' }}
      nextModule={{ path: '/modulo-10', title: 'Temperamenti' }}
    >
      <div className="space-y-8">
        {/* String simulation */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            🎸 La corda vibrante
          </h3>
          
          <div className="mb-6">
            {/* String visualization */}
            <div className="relative h-24 flex items-center">
              <div className="absolute left-0 w-4 h-16 bg-primary rounded" />
              <div 
                className="h-1 bg-accent transition-all duration-300"
                style={{ 
                  width: `${stringLength}%`,
                  marginLeft: '16px',
                  boxShadow: isPlayingString ? '0 0 10px hsl(var(--accent))' : 'none',
                }}
              />
              <div 
                className="absolute w-4 h-16 bg-primary rounded transition-all duration-300"
                style={{ left: `calc(${stringLength}% + 8px)` }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Slider
                value={stringLength}
                onChange={setStringLength}
                min={50}
                max={100}
                step={1}
                label="Lunghezza della corda"
                unit="%"
                color="#22c55e"
              />
            </div>
            <div className="flex items-center gap-4">
              <PlayButton isPlaying={isPlayingString} onToggle={playString} />
              <div className="text-sm">
                <div>Rapporto: <span className="font-bold text-accent">{stringRatio}</span></div>
                <div>Frequenza: <span className="font-mono">{stringFreq} Hz</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipe simulation */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            🎵 Il flauto di Pan
          </h3>
          
          <div className="mb-6">
            {/* Pipe visualization */}
            <div className="flex items-end gap-2 h-32 justify-center">
              {[100, 89, 80, 75, 67, 60, 53, 50].map((height, i) => (
                <div
                  key={i}
                  className={`w-8 rounded-t-lg transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    Math.abs(height - pipeLength) < 5 
                      ? 'bg-accent shadow-glow' 
                      : 'bg-primary/70'
                  }`}
                  style={{ height: `${height}%` }}
                  onClick={() => setPipeLength(height)}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Clicca su una canna per selezionarla
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Slider
                value={pipeLength}
                onChange={setPipeLength}
                min={50}
                max={100}
                step={1}
                label="Lunghezza della canna"
                unit="%"
                color="#0ea5e9"
              />
            </div>
            <div className="flex items-center gap-4">
              <PlayButton isPlaying={isPlayingPipe} onToggle={playPipe} />
              <div className="text-sm">
                <div>Rapporto: <span className="font-bold text-wave-primary">{pipeRatio}</span></div>
                <div>Frequenza: <span className="font-mono">{pipeFreq} Hz</span></div>
              </div>
            </div>
          </div>
        </div>

        <InfoBox type="tip" title="La stessa legge!">
          Sia per le corde che per le colonne d'aria vale la stessa regola: 
          <strong> la frequenza è inversamente proporzionale alla lunghezza</strong>. 
          Metà lunghezza = doppia frequenza (un'ottava sopra).
        </InfoBox>

        {/* Comparison */}
        <div className="module-card bg-gradient-to-br from-green-500/5 to-blue-500/5">
          <h4 className="font-display text-lg font-semibold mb-4">
            📐 Le frazioni della musica
          </h4>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-background">
              <div className="text-2xl font-bold text-accent mb-1">1/2</div>
              <div className="text-sm font-medium">Metà lunghezza</div>
              <div className="text-xs text-muted-foreground">= Ottava (×2)</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-background">
              <div className="text-2xl font-bold text-violet-500 mb-1">2/3</div>
              <div className="text-sm font-medium">Due terzi</div>
              <div className="text-xs text-muted-foreground">= Quinta (×3/2)</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-background">
              <div className="text-2xl font-bold text-blue-500 mb-1">3/4</div>
              <div className="text-sm font-medium">Tre quarti</div>
              <div className="text-xs text-muted-foreground">= Quarta (×4/3)</div>
            </div>
          </div>
        </div>

        {/* Historical note */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="module-card">
            <div className="text-3xl mb-3">🎻</div>
            <h4 className="font-semibold mb-2">Il monocordo di Pitagora</h4>
            <p className="text-sm text-muted-foreground">
              2500 anni fa, Pitagora scoprì queste relazioni usando una sola 
              corda tesa. Premendo a metà, 2/3, 3/4... ottenne tutte le note!
            </p>
          </div>
          
          <div className="module-card">
            <div className="text-3xl mb-3">🎶</div>
            <h4 className="font-semibold mb-2">Il flauto di Pan</h4>
            <p className="text-sm text-muted-foreground">
              Tagliando canne di bambù con le giuste proporzioni, puoi costruire 
              una scala musicale completa. Le stesse frazioni funzionano!
            </p>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module9;
