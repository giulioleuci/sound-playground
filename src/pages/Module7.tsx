import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { Play, RotateCcw, Plus } from 'lucide-react';

interface ScaleNote {
  name: string;
  ratio: number;
  frequency: number;
  fifthsFromC: number;
}

const Module7 = () => {
  const [notes, setNotes] = useState<ScaleNote[]>([
    { name: 'Do', ratio: 1, frequency: 261.63, fifthsFromC: 0 }
  ]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const baseFrequency = 261.63; // C4

  const addFifth = useCallback(() => {
    if (notes.length >= 12) return;

    const lastNote = notes[notes.length - 1];
    let newRatio = lastNote.ratio * 1.5; // multiply by 3/2
    
    // Bring back into octave if necessary
    while (newRatio >= 2) {
      newRatio /= 2;
    }

    const noteNames = ['Do', 'Sol', 'Re', 'La', 'Mi', 'Si', 'Fa#', 'Do#', 'Sol#', 'Re#', 'La#', 'Fa'];
    const newName = noteNames[notes.length] || `Nota ${notes.length + 1}`;

    const newNote: ScaleNote = {
      name: newName,
      ratio: newRatio,
      frequency: baseFrequency * newRatio,
      fifthsFromC: notes.length,
    };

    setNotes(prev => [...prev, newNote].sort((a, b) => a.ratio - b.ratio));
  }, [notes]);

  const reset = () => {
    setNotes([{ name: 'Do', ratio: 1, frequency: 261.63, fifthsFromC: 0 }]);
  };

  const playNote = useCallback((frequency: number, index: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    setActiveNote(index);
    setTimeout(() => setActiveNote(null), 500);
  }, []);

  const playScale = useCallback(() => {
    notes.forEach((note, i) => {
      setTimeout(() => playNote(note.frequency, i), i * 300);
    });
  }, [notes, playNote]);

  const formatRatio = (ratio: number): string => {
    if (ratio === 1) return '1';
    if (Math.abs(ratio - 1.5) < 0.001) return '3/2';
    if (Math.abs(ratio - 1.125) < 0.001) return '9/8';
    if (Math.abs(ratio - 1.265625) < 0.001) return '81/64';
    if (Math.abs(ratio - 1.333) < 0.01) return '4/3';
    if (Math.abs(ratio - 1.6875) < 0.001) return '27/16';
    if (Math.abs(ratio - 1.898) < 0.01) return '243/128';
    return ratio.toFixed(3);
  };

  return (
    <ModuleLayout
      moduleNumber={7}
      title="Costruire la scala con le quinte"
      description="Usa solo il rapporto 3/2 per costruire tutte le note della scala musicale. È matematica pura!"
      prevModule={{ path: '/modulo-6', title: 'Ottava' }}
      nextModule={{ path: '/modulo-8', title: 'Dominante' }}
    >
      <div className="space-y-8">
        {/* Building interface */}
        <div className="module-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold">
              Costruisci la scala
            </h3>
            <span className="info-badge">
              {notes.length}/12 note
            </span>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Parti dal Do e moltiplica per 3/2 (la quinta). Se superi l'ottava, dividi per 2 per tornare indietro.
          </p>

          {/* Notes visualization */}
          <div className="relative mb-6">
            {/* Frequency line */}
            <div className="h-2 bg-muted rounded-full mb-4" />
            
            {/* Note markers */}
            <div className="relative h-24">
              {notes.map((note, i) => {
                const position = ((note.ratio - 1) / 1) * 100;
                return (
                  <button
                    key={i}
                    onClick={() => playNote(note.frequency, i)}
                    className={`absolute transform -translate-x-1/2 transition-all ${
                      activeNote === i ? 'scale-125 z-10' : 'hover:scale-110'
                    }`}
                    style={{ left: `${Math.min(position, 95)}%` }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                      activeNote === i 
                        ? 'bg-accent text-white shadow-glow' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {note.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-center">
                      {formatRatio(note.ratio)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={addFifth}
              disabled={notes.length >= 12}
              className="btn-play disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Moltiplica per 3/2
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-3 rounded-full border-2 border-muted-foreground/30 text-muted-foreground hover:bg-muted transition-colors"
            >
              <RotateCcw size={20} className="inline mr-2" />
              Ricomincia
            </button>
          </div>
        </div>

        {/* Play scale */}
        {notes.length >= 3 && (
          <div className="module-card animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Ascolta la scala che hai costruito</h4>
                <p className="text-sm text-muted-foreground">
                  {notes.length} note ordinate per frequenza crescente
                </p>
              </div>
              <button onClick={playScale} className="btn-play">
                <Play size={20} />
                Ascolta
              </button>
            </div>
          </div>
        )}

        <InfoBox type="tip" title="Il ciclo delle quinte">
          Questo metodo si chiama "ciclo delle quinte". Partendo da una nota e 
          moltiplicando sempre per 3/2, puoi generare tutte e 12 le note della 
          scala cromatica! Ci sono voluti secoli per scoprirlo.
        </InfoBox>

        {/* Visual explanation */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-accent mb-2">3/2</div>
            <div className="text-sm font-medium">La quinta</div>
            <div className="text-xs text-muted-foreground">
              Il rapporto più consonante dopo l'ottava
            </div>
          </div>
          
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-violet-500 mb-2">÷2</div>
            <div className="text-sm font-medium">Rientro nell'ottava</div>
            <div className="text-xs text-muted-foreground">
              Se il rapporto supera 2, dividi per 2
            </div>
          </div>
          
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">12</div>
            <div className="text-sm font-medium">Note nella scala</div>
            <div className="text-xs text-muted-foreground">
              7 note + 5 alterazioni (# e ♭)
            </div>
          </div>
        </div>

        <InfoBox type="warning" title="Ma c'è un problema...">
          Se continui per 12 quinte, dovresti tornare esattamente al Do iniziale 
          (7 ottave sopra). Ma 3/2 elevato alla 12 non è uguale a 2 elevato alla 7! 
          Questo "errore" si chiama <strong>virgola pitagorica</strong> e lo 
          esploreremo nel Modulo 10.
        </InfoBox>
      </div>
    </ModuleLayout>
  );
};

export default Module7;
