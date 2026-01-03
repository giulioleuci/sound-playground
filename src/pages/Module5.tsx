import { useState, useCallback, useRef, useEffect } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { TermTooltip } from '@/components/TermTooltip';
import { PlayButton } from '@/components/PlayButton';
import { Plus, Minus } from 'lucide-react';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';
import { Spectrogram } from '@/components/Spectrogram';

interface Harmonic {
  n: number;
  ratio: string;
  active: boolean;
  amplitude: number;
}

const createInitialHarmonics = (count: number): Harmonic[] => {
  return Array.from({ length: count }, (_, i) => ({
    n: i + 1,
    ratio: String(i + 1),
    active: i === 0, // Only first harmonic active initially
    amplitude: Math.round(100 / (i + 1)),
  }));
};

const Module5 = () => {
  const [harmonics, setHarmonics] = useState<Harmonic[]>(createInitialHarmonics(5));
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingHarmonic, setPlayingHarmonic] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const baseFrequency = 220;

  const stopAll = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
    masterGainRef.current = null;
    setIsPlaying(false);
    setPlayingHarmonic(null);
  }, []);

  const playAll = useCallback(() => {
    if (isPlaying) {
      stopAll();
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Create master gain for spectrum analysis
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    const activeHarmonics = harmonics.filter(h => h.active);

    activeHarmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFrequency * h.n, ctx.currentTime);
      gain.gain.setValueAtTime((h.amplitude / 100) * 0.15 / h.n, ctx.currentTime);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscillatorsRef.current.push(osc);
      gainNodesRef.current.push(gain);
    });

    setIsPlaying(true);
  }, [isPlaying, harmonics, stopAll]);

  const playSingleHarmonic = useCallback((n: number) => {
    stopAll();
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFrequency * n, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    
    oscillatorsRef.current.push(osc);
    setPlayingHarmonic(n);
    
    // Stop after 0.5s
    setTimeout(() => {
      try { osc.stop(); } catch {}
      setPlayingHarmonic(null);
    }, 500);
  }, [stopAll]);

  const toggleHarmonic = (n: number) => {
    setHarmonics(prev => prev.map(h => 
      h.n === n ? { ...h, active: !h.active } : h
    ));
  };

  const addMoreHarmonics = () => {
    setHarmonics(prev => {
      const currentMax = prev.length;
      const newHarmonics: Harmonic[] = [];
      for (let i = 1; i <= 5; i++) {
        const n = currentMax + i;
        newHarmonics.push({
          n,
          ratio: String(n),
          active: true, // Activate new harmonics by default
          amplitude: Math.round(100 / n),
        });
      }
      return [...prev, ...newHarmonics];
    });
  };

  const removeHarmonics = () => {
    setHarmonics(prev => {
      if (prev.length <= 5) return prev;
      return prev.slice(0, -5);
    });
  };

  // Draw combined wave
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid
      ctx.strokeStyle = 'hsl(220 40% 13% / 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw combined wave
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const activeHarmonics = harmonics.filter(h => h.active);
      
      for (let x = 0; x <= width; x++) {
        let y = centerY;
        const t = (x / width) * Math.PI * 4;
        
        activeHarmonics.forEach(h => {
          y += Math.sin(t * h.n) * (h.amplitude / 100) * 40 / h.n;
        });

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    // Resize canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [harmonics, isPlaying]);

  return (
    <ModuleLayout
      moduleNumber={5}
      title="Armonici e scomposizione di Fourier"
      description="Ogni suono complesso è in realtà una somma di suoni semplici! Scopri come funziona questa magia matematica."
      prevModule={{ path: '/modulo-4', title: 'Timbro' }}
      nextModule={{ path: '/modulo-6', title: 'Ottava' }}
    >
      <div className="space-y-8">
        {/* Harmonic toggles */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-2">
            Costruisci il suono con gli armonici
          </h3>
          <p className="text-muted-foreground mb-6">
            Attiva gli armonici uno alla volta e ascolta come cambia il suono. 
            Ogni armonico vibra 2, 3, 4... volte più veloce della fondamentale.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3 mb-6">
            {harmonics.map((h) => (
              <div
                key={h.n}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  h.active
                    ? 'border-accent bg-accent/10'
                    : 'border-transparent bg-muted/50 hover:bg-muted'
                } ${playingHarmonic === h.n ? 'ring-2 ring-accent ring-offset-2' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {h.n === 1 ? <TermTooltip term="fondamentale">Fond.</TermTooltip> : `${h.n}°`}
                  </span>
                  <button
                    onClick={() => toggleHarmonic(h.n)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      h.active ? 'bg-accent text-white' : 'bg-muted'
                    }`}
                  >
                    {h.active ? <Minus size={14} /> : <Plus size={14} />}
                  </button>
                </div>
                
                <div className="text-sm font-bold mb-1">
                  {(baseFrequency * h.n).toFixed(0)} Hz
                </div>
                
                <button
                  onClick={() => playSingleHarmonic(h.n)}
                  className="text-xs text-accent hover:underline"
                >
                  Ascolta
                </button>
              </div>
            ))}
          </div>

          {/* Add/Remove harmonics buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={removeHarmonics}
              disabled={harmonics.length <= 5}
              className="px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Minus size={16} />
              Rimuovi 5 armonici
            </button>
            <button
              onClick={addMoreHarmonics}
              disabled={harmonics.length >= 30}
              className="px-4 py-2 rounded-full bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={16} />
              Aggiungi 5 armonici
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-4">
            Armonici attivi: {harmonics.filter(h => h.active).length} / {harmonics.length}
          </p>

          {/* Combined wave display */}
          <canvas
            ref={canvasRef}
            className="w-full h-32 rounded-xl wave-canvas mb-4"
          />

          <div className="flex justify-center">
            <PlayButton
              isPlaying={isPlaying}
              onToggle={playAll}
              size="lg"
            />
          </div>
        </div>

        {/* Spectrum Analysis */}
        {isPlaying && masterGainRef.current && (
          <div className="module-card animate-fade-in">
            <h4 className="font-semibold mb-4">
              Analisi spettrale degli armonici
            </h4>
            <Spectrogram
              audioSource={masterGainRef.current}
              fftSize={4096}
              colorScheme="rainbow"
              showFrequencyLabels={true}
              minDecibels={-100}
              maxDecibels={-20}
            />
            <p className="text-sm text-muted-foreground mt-4">
              Ogni picco nello spettro corrisponde a un armonico attivo. Nota come gli
              armonici sono esattamente multipli della fondamentale (220 Hz, 440 Hz, 660 Hz, ecc.).
            </p>
          </div>
        )}

        <InfoBox type="tip" title="Questo è il teorema di Fourier!">
          Nel 1822 il matematico Jean-Baptiste Fourier dimostrò che <strong>qualsiasi</strong> suono
          può essere scomposto in una somma di <TermTooltip term="armonico">armonici</TermTooltip> (onde semplici). È come dire che ogni
          colore si può ottenere mescolando rosso, verde e blu!
        </InfoBox>

        {/* Visual explanation */}
        <div className="module-card bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <h4 className="font-display text-lg font-semibold mb-4">
            🎼 Come funziona?
          </h4>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong>La <TermTooltip term="fondamentale">fondamentale</TermTooltip> (1°)</strong> è la frequenza base: determina quale nota sentiamo.
            </p>
            <p>
              <strong>Gli <TermTooltip term="armonico">armonici</TermTooltip> (2°, 3°, 4°...)</strong> sono multipli esatti della fondamentale:
              se la fondamentale è 220 Hz, il secondo armonico è 440 Hz, il terzo 660 Hz, e così via.
            </p>
            <p>
              <strong>Il <TermTooltip term="timbro">timbro</TermTooltip></strong> dipende da quali armonici sono presenti e quanto sono forti.
              Ecco perché un flauto (pochi armonici) suona diverso da un violino (molti armonici)!
            </p>
          </div>
        </div>

        {/* Frequency ratios */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-accent mb-2">2:1</div>
            <div className="text-sm font-medium">2° armonico</div>
            <div className="text-xs text-muted-foreground">Un'ottava sopra</div>
          </div>
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-violet-500 mb-2">3:1</div>
            <div className="text-sm font-medium">3° armonico</div>
            <div className="text-xs text-muted-foreground">Ottava + quinta</div>
          </div>
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">4:1</div>
            <div className="text-sm font-medium">4° armonico</div>
            <div className="text-xs text-muted-foreground">Due ottave sopra</div>
          </div>
        </div>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={5} questions={getQuizForModule(5)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module5;