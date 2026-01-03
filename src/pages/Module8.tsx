import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Play, Pause } from 'lucide-react';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';

const Module8 = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const baseFreq = 261.63; // C4
  const dominantFreq = baseFreq * 1.5; // G4 (perfect fifth)

  const playTension = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Play tonic
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Sequence: Do - Sol - Do
    playNote(baseFreq, 0, 0.6);
    playNote(dominantFreq, 0.7, 0.6);
    playNote(baseFreq, 1.4, 0.8);
  }, []);

  const playDominantAlone = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(dominantFreq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  }, []);

  const playTonicAlone = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  }, []);

  const playTogether = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    [baseFreq, dominantFreq].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  }, []);

  return (
    <ModuleLayout
      moduleNumber={8}
      title="La dominante"
      description="La quinta nota della scala crea tensione e voglia di tornare a casa. Scopri perché è così importante in tutta la musica!"
      prevModule={{ path: '/modulo-7', title: 'Scale' }}
      nextModule={{ path: '/modulo-9', title: 'Corde' }}
    >
      <div className="space-y-8">
        {/* Main demonstration */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            Tonica e Dominante
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Tonic */}
            <div className="text-center">
              <button
                onClick={playTonicAlone}
                className="w-32 h-32 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform"
              >
                <span className="text-3xl font-bold">Do</span>
                <span className="text-sm opacity-70">Tonica</span>
              </button>
              <p className="text-sm text-muted-foreground">
                La "casa", il punto di riposo
              </p>
            </div>
            
            {/* Dominant */}
            <div className="text-center">
              <button
                onClick={playDominantAlone}
                className="w-32 h-32 rounded-full bg-accent text-accent-foreground flex flex-col items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform animate-pulse-glow"
              >
                <span className="text-3xl font-bold">Sol</span>
                <span className="text-sm opacity-70">Dominante</span>
              </button>
              <p className="text-sm text-muted-foreground">
                Crea tensione, vuole "risolvere"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={playTension} className="btn-play">
              <Play size={20} />
              Do → Sol → Do
            </button>
            <button 
              onClick={playTogether}
              className="px-6 py-3 rounded-full border-2 border-accent text-accent font-semibold hover:bg-accent/10 transition-colors"
            >
              Insieme ♫
            </button>
          </div>
        </div>

        <InfoBox type="tip" title="Senti la tensione?">
          Quando ascolti Sol dopo Do, senti che "manca qualcosa"? Quella 
          sensazione di incompletezza è ciò che i musicisti chiamano "tensione". 
          Tornare al Do dà una sensazione di "risoluzione" e riposo.
        </InfoBox>

        {/* Why it works */}
        <div className="module-card bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <h4 className="font-display text-lg font-semibold mb-4">
            🎵 Perché funziona?
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold text-accent">1</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">È il rapporto più semplice</h5>
                <p className="text-sm text-muted-foreground">
                  3/2 è il rapporto più semplice dopo 2/1 (l'ottava). 
                  Le onde si "incastrano" quasi perfettamente.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold text-accent">2</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">È il primo armonico diverso</h5>
                <p className="text-sm text-muted-foreground">
                  Ricordi gli armonici? Il terzo armonico (3×f) diviso per 2 
                  dà esattamente la dominante (3/2×f)!
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="font-bold text-accent">3</span>
              </div>
              <div>
                <h5 className="font-medium mb-1">Il nostro cervello la riconosce</h5>
                <p className="text-sm text-muted-foreground">
                  Millenni di evoluzione hanno reso il nostro orecchio 
                  particolarmente sensibile a questo rapporto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Harmonic connection */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="module-card">
            <h4 className="font-semibold mb-3">Il collegamento con gli armonici</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                <span>Fondamentale (1°)</span>
                <span className="font-mono">262 Hz</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                <span>2° armonico</span>
                <span className="font-mono">524 Hz</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-accent/20 border border-accent/30">
                <span className="font-medium">3° armonico ÷ 2</span>
                <span className="font-mono font-bold">393 Hz = Sol!</span>
              </div>
            </div>
          </div>
          
          <div className="module-card">
            <h4 className="font-semibold mb-3">Nella musica reale</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Quasi ogni canzone usa il movimento Dominante → Tonica:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-accent">♪</span>
                Il finale di "Tanti auguri a te"
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">♪</span>
                L'accordo finale di una sinfonia
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">♪</span>
                Il ritornello di quasi ogni canzone pop
              </li>
            </ul>
          </div>
        </div>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={8} questions={getQuizForModule(8)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module8;
