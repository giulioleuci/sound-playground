import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Play } from 'lucide-react';

const notes = [
  { name: 'Do₃', frequency: 261.63, ratio: '1' },
  { name: 'Do₄', frequency: 523.25, ratio: '2' },
  { name: 'Do₅', frequency: 1046.50, ratio: '4' },
];

const Module6 = () => {
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const playNote = useCallback((frequency: number, index: number) => {
    // Stop previous
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
    
    oscillatorRef.current = osc;
    setActiveNote(index);
    
    setTimeout(() => setActiveNote(null), 1000);
  }, []);

  const playOctaveSequence = useCallback(() => {
    notes.forEach((note, i) => {
      setTimeout(() => playNote(note.frequency, i), i * 600);
    });
  }, [playNote]);

  const playSimultaneous = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    [261.63, 523.25].forEach((freq, i) => {
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
      moduleNumber={6}
      title="Ottava e rapporti"
      description="Il rapporto 2:1 è il più speciale nella musica. Quando raddoppi la frequenza, ottieni la stessa nota... ma più acuta!"
      prevModule={{ path: '/modulo-5', title: 'Armonici' }}
      nextModule={{ path: '/modulo-7', title: 'Scale' }}
    >
      <div className="space-y-8">
        {/* Main demonstration */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            Il salto di ottava
          </h3>
          
          <div className="flex justify-center gap-4 mb-8">
            {notes.map((note, i) => (
              <button
                key={note.name}
                onClick={() => playNote(note.frequency, i)}
                className={`relative p-6 rounded-2xl transition-all ${
                  activeNote === i 
                    ? 'bg-accent text-white scale-110 shadow-glow' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                style={{
                  width: 100 - i * 15,
                  height: 120 - i * 10,
                }}
              >
                <div className="absolute top-2 right-2 text-xs opacity-70">
                  ×{note.ratio}
                </div>
                <div className="font-display font-bold text-lg mb-1">
                  {note.name}
                </div>
                <div className="text-xs opacity-70">
                  {note.frequency.toFixed(0)} Hz
                </div>
                <Play 
                  className="absolute bottom-2 right-2 opacity-50" 
                  size={16} 
                />
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={playOctaveSequence} className="btn-play">
              Scala di ottave ▶
            </button>
            <button 
              onClick={playSimultaneous}
              className="px-6 py-3 rounded-full border-2 border-accent text-accent font-semibold hover:bg-accent/10 transition-colors"
            >
              Insieme ♫
            </button>
          </div>
        </div>

        <InfoBox type="tip" title="Perché suonano 'uguali'?">
          Quando senti Do₃ e Do₄ insieme, non stridono mai! Questo perché il Do₄ 
          vibra esattamente il doppio del Do₃. Le loro onde si "incastrano" perfettamente. 
          Per questo le chiamiamo con lo stesso nome.
        </InfoBox>

        {/* Visual ratio explanation */}
        <div className="module-card">
          <h4 className="font-semibold mb-4">Il rapporto 2:1 in azione</h4>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-sm font-medium">Do₃</div>
              <div className="flex-1 h-8 rounded-full bg-blue-500/20 relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-blue-500 rounded-full animate-pulse"
                  style={{ width: '50%' }}
                />
              </div>
              <div className="w-16 text-sm text-muted-foreground">262 Hz</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-24 text-right text-sm font-medium">Do₄</div>
              <div className="flex-1 h-8 rounded-full bg-violet-500/20 relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-violet-500 rounded-full animate-pulse"
                  style={{ width: '100%', animationDuration: '0.5s' }}
                />
              </div>
              <div className="w-16 text-sm text-muted-foreground">524 Hz</div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Il Do₄ completa due vibrazioni nel tempo in cui il Do₃ ne completa una
          </p>
        </div>

        {/* Key concept */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="module-card">
            <div className="text-4xl mb-3">🔁</div>
            <h4 className="font-semibold mb-2">L'ottava "chiude" la scala</h4>
            <p className="text-sm text-muted-foreground">
              Dopo sette note (Do Re Mi Fa Sol La Si) si torna al Do, 
              ma un'ottava sopra. La musica si ripete!
            </p>
          </div>
          
          <div className="module-card">
            <div className="text-4xl mb-3">📐</div>
            <h4 className="font-semibold mb-2">Tutto è un rapporto</h4>
            <p className="text-sm text-muted-foreground">
              Non serve sapere la frequenza esatta: basta sapere che 
              il rapporto è 2:1. Funziona per qualsiasi nota!
            </p>
          </div>
        </div>

        <InfoBox type="info" title="La matematica dietro l'ottava">
          Se parti da una frequenza f, l'ottava sopra è sempre 2×f. 
          Due ottave sopra? 2×2×f = 4×f. Tre ottave? 8×f. 
          Ogni ottava moltiplica per 2!
        </InfoBox>
      </div>
    </ModuleLayout>
  );
};

export default Module6;
