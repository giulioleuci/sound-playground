import { useState, useCallback, useRef, useEffect } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Slider } from '@/components/Slider';
import { PlayButton } from '@/components/PlayButton';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';

// Pan flute notes with their ratios
const panFluteNotes = [
  { name: 'Do', ratio: 1, lengthPercent: 100 },
  { name: 'Re', ratio: 9/8, lengthPercent: 100 / (9/8) },
  { name: 'Mi', ratio: 81/64, lengthPercent: 100 / (81/64) },
  { name: 'Fa', ratio: 4/3, lengthPercent: 100 / (4/3) },
  { name: 'Sol', ratio: 3/2, lengthPercent: 100 / (3/2) },
  { name: 'La', ratio: 27/16, lengthPercent: 100 / (27/16) },
  { name: 'Si', ratio: 243/128, lengthPercent: 100 / (243/128) },
  { name: 'Do₂', ratio: 2, lengthPercent: 50 },
];

const Module9 = () => {
  const [stringLength, setStringLength] = useState(100);
  const [selectedPipe, setSelectedPipe] = useState<number | null>(null);
  const [isPlayingString, setIsPlayingString] = useState(false);
  const [isPlayingPipe, setIsPlayingPipe] = useState(false);
  const [playingPipeIndex, setPlayingPipeIndex] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const baseFreq = 220; // Base frequency at 100% length

  const stopSound = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    setIsPlayingString(false);
    setIsPlayingPipe(false);
  }, []);

  const playString = useCallback(() => {
    if (isPlayingString) {
      stopSound();
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
    setIsPlayingPipe(false);
  }, [isPlayingString, stringLength, stopSound]);

  const playPipe = useCallback((pipeIndex: number) => {
    stopSound();
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const note = panFluteNotes[pipeIndex];
    const freq = baseFreq * note.ratio;

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
    setPlayingPipeIndex(pipeIndex);
    setSelectedPipe(pipeIndex);

    // Stop after 1 second
    setTimeout(() => {
      try { osc.stop(); } catch {}
      setIsPlayingPipe(false);
      setPlayingPipeIndex(null);
    }, 1000);
  }, [stopSound]);

  const playPanFluteScale = useCallback(() => {
    panFluteNotes.forEach((_, i) => {
      setTimeout(() => playPipe(i), i * 400);
    });
  }, [playPipe]);

  // Update frequency while playing string
  useEffect(() => {
    if (isPlayingString && oscillatorRef.current && audioContextRef.current) {
      const freq = baseFreq * (100 / stringLength);
      oscillatorRef.current.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    }
  }, [stringLength, isPlayingString]);

  // Calculate ratios for display
  const stringRatio = (100 / stringLength).toFixed(2);
  const stringFreq = (baseFreq * (100 / stringLength)).toFixed(0);

  return (
    <ModuleLayout
      moduleNumber={9}
      title="Corde e colonne d'aria"
      description="Dalle corde della chitarra alle canne del flauto di Pan: la stessa matematica governa strumenti completamente diversi!"
      prevModule={{ path: '/modulo-8', title: 'Dominante' }}
      nextModule={{ path: '/modulo-10', title: 'Battimenti' }}
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

        {/* Pan Flute simulation */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            🎵 Il flauto di Pan
          </h3>
          
          <div className="mb-6">
            {/* Pan flute visualization */}
            <div className="flex items-end gap-2 h-40 justify-center">
              {panFluteNotes.map((note, i) => (
                <button
                  key={i}
                  onClick={() => playPipe(i)}
                  className={`relative rounded-t-lg transition-all duration-200 hover:opacity-90 ${
                    playingPipeIndex === i 
                      ? 'ring-2 ring-accent ring-offset-2' 
                      : ''
                  }`}
                  style={{ 
                    width: '36px',
                    height: `${note.lengthPercent}%`,
                    backgroundColor: selectedPipe === i ? 'hsl(var(--accent))' : 'hsl(var(--primary) / 0.7)',
                  }}
                >
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                    {note.name}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              Clicca su una canna per ascoltarla
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={playPanFluteScale}
              className="btn-play"
            >
              Suona la scala
            </button>
          </div>

          {selectedPipe !== null && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <strong>{panFluteNotes[selectedPipe].name}</strong>: 
              lunghezza {panFluteNotes[selectedPipe].lengthPercent.toFixed(1)}%, 
              rapporto frequenza {panFluteNotes[selectedPipe].ratio.toFixed(3)}
            </div>
          )}
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

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={9} questions={getQuizForModule(9)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module9;