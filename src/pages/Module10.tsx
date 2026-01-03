import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Play } from 'lucide-react';

// Pythagorean tuning - built from perfect fifths
const pythagoreanScale = [
  { name: 'Do', ratio: 1, cents: 0 },
  { name: 'Re', ratio: 9/8, cents: 203.91 },
  { name: 'Mi', ratio: 81/64, cents: 407.82 },
  { name: 'Fa', ratio: 4/3, cents: 498.04 },
  { name: 'Sol', ratio: 3/2, cents: 701.96 },
  { name: 'La', ratio: 27/16, cents: 905.87 },
  { name: 'Si', ratio: 243/128, cents: 1109.78 },
  { name: 'Do₂', ratio: 2, cents: 1200 },
];

// Equal temperament - 12 equal semitones
const equalScale = [
  { name: 'Do', ratio: 1, cents: 0 },
  { name: 'Re', ratio: Math.pow(2, 2/12), cents: 200 },
  { name: 'Mi', ratio: Math.pow(2, 4/12), cents: 400 },
  { name: 'Fa', ratio: Math.pow(2, 5/12), cents: 500 },
  { name: 'Sol', ratio: Math.pow(2, 7/12), cents: 700 },
  { name: 'La', ratio: Math.pow(2, 9/12), cents: 900 },
  { name: 'Si', ratio: Math.pow(2, 11/12), cents: 1100 },
  { name: 'Do₂', ratio: 2, cents: 1200 },
];

const Module10 = () => {
  const [activeScale, setActiveScale] = useState<'pythagorean' | 'equal' | null>(null);
  const [playingNote, setPlayingNote] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const baseFreq = 261.63; // C4

  const playNote = useCallback((ratio: number, index: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * ratio, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);

    setPlayingNote(index);
    setTimeout(() => setPlayingNote(null), 600);
  }, []);

  const playScale = useCallback((scale: typeof pythagoreanScale, type: 'pythagorean' | 'equal') => {
    setActiveScale(type);
    scale.forEach((note, i) => {
      setTimeout(() => playNote(note.ratio, i), i * 350);
    });
    setTimeout(() => setActiveScale(null), scale.length * 350 + 600);
  }, [playNote]);

  const playComparison = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Play pythagorean Mi
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq * 81/64, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // Play equal Mi
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * Math.pow(2, 4/12), ctx.currentTime);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start();
    
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    
    osc1.stop(ctx.currentTime + 2);
    osc2.stop(ctx.currentTime + 2);
  }, []);

  // Calculate the Pythagorean comma
  const pythagoreanComma = Math.pow(3/2, 12) / Math.pow(2, 7);
  const commaCents = 1200 * Math.log2(pythagoreanComma);

  return (
    <ModuleLayout
      moduleNumber={10}
      title="Temperamenti e virgola pitagorica"
      description="Quando la matematica non torna: scopri il problema che ha tormentato i musicisti per secoli!"
      prevModule={{ path: '/modulo-9', title: 'Corde' }}
    >
      <div className="space-y-8">
        {/* The problem */}
        <div className="module-card bg-gradient-to-br from-red-500/5 to-orange-500/5">
          <h3 className="font-display text-xl font-semibold mb-4">
            ⚠️ Il problema
          </h3>
          <p className="text-muted-foreground mb-4">
            Se moltiplichi 12 volte per 3/2 (le quinte), dovresti tornare alla nota 
            iniziale dopo 7 ottave. Ma...
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-background text-center">
              <div className="text-sm text-muted-foreground mb-1">12 quinte</div>
              <div className="text-2xl font-mono font-bold">(3/2)¹² = 129.75</div>
            </div>
            <div className="p-4 rounded-xl bg-background text-center">
              <div className="text-sm text-muted-foreground mb-1">7 ottave</div>
              <div className="text-2xl font-mono font-bold">2⁷ = 128.00</div>
            </div>
          </div>
          <p className="text-center font-medium text-accent">
            Non sono uguali! La differenza si chiama "virgola pitagorica" ({commaCents.toFixed(1)} centesimi)
          </p>
        </div>

        {/* Scale comparison */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pythagorean */}
          <div className="module-card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Scala Pitagorica</h4>
              <button
                onClick={() => playScale(pythagoreanScale, 'pythagorean')}
                className={`btn-play text-sm px-4 py-2 ${activeScale === 'pythagorean' ? 'animate-pulse' : ''}`}
              >
                <Play size={16} /> Ascolta
              </button>
            </div>
            
            <div className="space-y-2">
              {pythagoreanScale.map((note, i) => (
                <div
                  key={note.name}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-muted/50 ${
                    playingNote === i && activeScale === 'pythagorean' ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => playNote(note.ratio, i)}
                >
                  <div className="w-12 text-sm font-medium">{note.name}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${(note.cents / 1200) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-muted-foreground text-right">
                    {note.cents.toFixed(0)}¢
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Costruita con quinte pure (3/2). Intervalli "perfetti" ma non chiude.
            </p>
          </div>

          {/* Equal temperament */}
          <div className="module-card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Scala Equabile</h4>
              <button
                onClick={() => playScale(equalScale, 'equal')}
                className={`btn-play text-sm px-4 py-2 ${activeScale === 'equal' ? 'animate-pulse' : ''}`}
              >
                <Play size={16} /> Ascolta
              </button>
            </div>
            
            <div className="space-y-2">
              {equalScale.map((note, i) => (
                <div
                  key={note.name}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-muted/50 ${
                    playingNote === i && activeScale === 'equal' ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => playNote(note.ratio, i)}
                >
                  <div className="w-12 text-sm font-medium">{note.name}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(note.cents / 1200) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs text-muted-foreground text-right">
                    {note.cents.toFixed(0)}¢
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Divide l'ottava in 12 parti uguali. Meno pura ma chiude perfettamente.
            </p>
          </div>
        </div>

        <div className="module-card text-center">
          <h4 className="font-semibold mb-3">Senti la differenza?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Ascolta il Mi delle due scale insieme. Noterai un leggero "battimento".
          </p>
          <button onClick={playComparison} className="btn-play">
            Confronta i due Mi
          </button>
        </div>

        <InfoBox type="tip" title="La soluzione moderna">
          Oggi usiamo il <strong>temperamento equabile</strong>: ogni semitono è 
          esattamente 1/12 dell'ottava. Gli intervalli non sono "puri", ma possiamo 
          suonare in tutte le tonalità senza stonare!
        </InfoBox>

        {/* Summary */}
        <div className="module-card bg-gradient-to-br from-primary/5 to-accent/5">
          <h4 className="font-display text-lg font-semibold mb-4 text-center">
            🎓 Cosa hai imparato
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center text-sm">
            <div className="p-3 rounded-xl bg-background">
              <div className="text-2xl mb-1">🔊</div>
              <div className="font-medium">Suono = Vibrazione</div>
            </div>
            <div className="p-3 rounded-xl bg-background">
              <div className="text-2xl mb-1">📐</div>
              <div className="font-medium">Note = Rapporti</div>
            </div>
            <div className="p-3 rounded-xl bg-background">
              <div className="text-2xl mb-1">🎵</div>
              <div className="font-medium">Armonici = Fourier</div>
            </div>
            <div className="p-3 rounded-xl bg-background">
              <div className="text-2xl mb-1">⚖️</div>
              <div className="font-medium">Compromesso = Musica</div>
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module10;
