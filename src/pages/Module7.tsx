import { useState, useCallback, useRef } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { TermTooltip } from '@/components/TermTooltip';
import { Play, RotateCcw, Plus } from 'lucide-react';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';

interface ScaleNote {
  name: string;
  ratio: number;
  frequency: number;
  fifthsFromC: number;
  calculation: string; // Shows the calculation steps
}

interface CalculationStep {
  from: string;
  to: string;
  step1: string;
  step1Result: string;
  step2?: string;
  step2Result?: string;
  finalRatio: string;
}

// Order of notes in C major scale built by fifths
// DO → SOL → RE → LA → MI → SI, then DO → FA (descending fifth)
const noteNames = ['Do', 'Sol', 'Re', 'La', 'Mi', 'Si', 'Fa'];

const Module7 = () => {
  const [notes, setNotes] = useState<ScaleNote[]>([
    { name: 'Do', ratio: 1, frequency: 261.63, fifthsFromC: 0, calculation: 'Nota di partenza' }
  ]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const baseFrequency = 261.63; // C4

  const addFifth = useCallback(() => {
    if (notes.length >= 7) return; // Only 7 notes in major scale

    // Find the note with the highest fifthsFromC to continue the chain
    const lastInChain = notes.reduce((max, note) =>
      note.fifthsFromC > max.fifthsFromC ? note : max
    , notes[0]);

    const fifthsCount = lastInChain.fifthsFromC + 1;

    // Special case for FA: descending fifth from DO
    let newRatio: number;
    let calculation: string;
    let step: CalculationStep;

    if (fifthsCount === 6) {
      // FA: descend a fifth from DO (multiply by 2/3, then bring into octave)
      newRatio = 2/3 * 2; // 4/3
      calculation = 'Do ÷ 3/2 × 2 = 2/3 × 2 = 4/3';
      step = {
        from: 'Do',
        to: 'Fa',
        step1: 'Scendere di quinta: Do × 2/3',
        step1Result: '2/3 (sotto l\'ottava)',
        step2: 'Salire di un\'ottava: 2/3 × 2',
        step2Result: '4/3',
        finalRatio: '4/3'
      };
    } else {
      // Ascending fifths: DO → SOL → RE → LA → MI → SI
      // Calculate ratio from original DO
      let ratio = Math.pow(3/2, fifthsCount);
      const originalRatio = ratio;
      let octaveShifts = 0;

      // Bring back into octave [1, 2)
      while (ratio >= 2) {
        ratio /= 2;
        octaveShifts++;
      }

      newRatio = ratio;

      // Create calculation string
      const previousNote = lastInChain.name;
      const fractionBefore = originalRatio;

      if (octaveShifts > 0) {
        calculation = `${previousNote} × 3/2 = ${fractionBefore.toFixed(4)} → ÷2${octaveShifts > 1 ? `^${octaveShifts}` : ''} = ${newRatio.toFixed(4)}`;
        step = {
          from: previousNote,
          to: noteNames[fifthsCount],
          step1: `${previousNote} × 3/2`,
          step1Result: `${formatCalculationRatio(fractionBefore)} (oltre l'ottava)`,
          step2: `Scendere di ${octaveShifts} ottava${octaveShifts > 1 ? 've' : ''}: ${formatCalculationRatio(fractionBefore)} ÷ ${Math.pow(2, octaveShifts)}`,
          step2Result: formatCalculationRatio(newRatio),
          finalRatio: formatCalculationRatio(newRatio)
        };
      } else {
        calculation = `${previousNote} × 3/2 = ${newRatio.toFixed(4)}`;
        step = {
          from: previousNote,
          to: noteNames[fifthsCount],
          step1: `${previousNote} × 3/2`,
          step1Result: formatCalculationRatio(newRatio),
          finalRatio: formatCalculationRatio(newRatio)
        };
      }
    }

    const newName = noteNames[fifthsCount];

    const newNote: ScaleNote = {
      name: newName,
      ratio: newRatio,
      frequency: baseFrequency * newRatio,
      fifthsFromC: fifthsCount,
      calculation
    };

    setNotes(prev => [...prev, newNote].sort((a, b) => a.ratio - b.ratio));
    setCalculationSteps(prev => [...prev, step]);
  }, [notes]);

  const formatCalculationRatio = (ratio: number): string => {
    // Common Pythagorean ratios for major scale
    const knownRatios: { value: number; label: string }[] = [
      { value: 3/2, label: '3/2' },
      { value: 9/4, label: '9/4' },
      { value: 9/8, label: '9/8' },
      { value: 27/16, label: '27/16' },
      { value: 81/32, label: '81/32' },
      { value: 81/64, label: '81/64' },
      { value: 243/128, label: '243/128' },
      { value: 4/3, label: '4/3' },
      { value: 2/3, label: '2/3' },
    ];

    for (const known of knownRatios) {
      if (Math.abs(ratio - known.value) < 0.0001) {
        return known.label;
      }
    }
    return ratio.toFixed(4);
  };

  const reset = () => {
    setNotes([{ name: 'Do', ratio: 1, frequency: 261.63, fifthsFromC: 0, calculation: 'Nota di partenza' }]);
    setCalculationSteps([]);
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
    // Common Pythagorean ratios
    const knownRatios: { value: number; label: string }[] = [
      { value: 1, label: '1' },
      { value: 3/2, label: '3/2' },
      { value: 9/8, label: '9/8' },
      { value: 27/16, label: '27/16' },
      { value: 81/64, label: '81/64' },
      { value: 243/128, label: '243/128' },
      { value: 729/512, label: '729/512' },
      { value: 4/3, label: '4/3' }, // Fa (from bringing 2187/2048 down, but simpler is 4/3)
      { value: 2187/2048, label: '2187/2048' },
      { value: 6561/4096, label: '6561/4096' },
      { value: 19683/16384, label: '19683/16384' },
      { value: 59049/32768, label: '59049/32768' },
    ];
    
    for (const known of knownRatios) {
      if (Math.abs(ratio - known.value) < 0.0001) {
        return known.label;
      }
    }
    return ratio.toFixed(4);
  };

  // Calculate position based on ratio (logarithmic scale for better visualization)
  const getPosition = (ratio: number): number => {
    // Use log scale: position = log2(ratio) / log2(2) * 100 = log2(ratio) * 100
    return (Math.log2(ratio) / Math.log2(2)) * 90 + 2; // 2-92% range
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
              Costruisci la scala di Do maggiore
            </h3>
            <span className="info-badge">
              {notes.length}/7 note
            </span>
          </div>

          <p className="text-muted-foreground mb-6">
            Procedi per quinte: <strong>Do → Sol → Re → La → Mi → Si</strong>. Per il Fa, scendi di una quinta da Do. Moltiplica per 3/2 (salire di quinta) e dividi per 2 se superi l'ottava.
          </p>

          {/* Notes visualization */}
          <div className="relative mb-6">
            {/* Frequency line with labels */}
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Do (1)</span>
              <span>Do₂ (2)</span>
            </div>
            <div className="h-2 bg-muted rounded-full mb-4" />
            
            {/* Note markers */}
            <div className="relative h-28">
              {notes.map((note, i) => {
                const position = getPosition(note.ratio);
                return (
                  <button
                    key={`${note.name}-${i}`}
                    onClick={() => playNote(note.frequency, i)}
                    className={`absolute transform -translate-x-1/2 transition-all ${
                      activeNote === i ? 'scale-125 z-10' : 'hover:scale-110'
                    }`}
                    style={{ left: `${position}%` }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                      activeNote === i 
                        ? 'bg-accent text-white shadow-glow' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {note.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-center whitespace-nowrap">
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
              disabled={notes.length >= 7}
              className="btn-play disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              {notes.length < 6 ? 'Aggiungi quinta' : 'Aggiungi Fa'}
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

        {/* Calculation steps */}
        {calculationSteps.length > 0 && (
          <div className="module-card animate-fade-in">
            <h3 className="font-display text-xl font-semibold mb-4">
              Passaggi di costruzione
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Ecco come ogni nota è stata generata moltiplicando per 3/2 (salire di quinta) e dividendo per 2 (scendere di ottava)
            </p>
            <div className="space-y-4">
              {calculationSteps.map((step, index) => (
                <div
                  key={index}
                  className="border-l-4 border-accent pl-4 py-2 bg-muted/30 rounded-r"
                >
                  <div className="font-semibold text-lg mb-2">
                    {step.from} → {step.to}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">1.</span>
                      <span className="font-mono">{step.step1}</span>
                      <span className="text-accent">→</span>
                      <span className="font-mono font-semibold">{step.step1Result}</span>
                    </div>
                    {step.step2 && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">2.</span>
                        <span className="font-mono">{step.step2}</span>
                        <span className="text-accent">→</span>
                        <span className="font-mono font-semibold">{step.step2Result}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-muted">
                      <span className="text-muted-foreground font-semibold">Rapporto finale:</span>
                      <span className="font-mono text-lg font-bold text-accent">{step.finalRatio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        <InfoBox type="tip" title="La scala pitagorica">
          Questo metodo di costruzione si basa sul <strong>ciclo delle quinte</strong>.
          Partendo da Do e procedendo per <TermTooltip term="quinta">quinte</TermTooltip> (moltiplicando per 3/2)
          otteniamo le 7 note della scala maggiore: Do, Re, Mi, Fa, Sol, La, Si.
          È la base della <strong>accordatura pitagorica</strong> usata nell'antichità!
        </InfoBox>

        {/* Visual explanation */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="module-card text-center">
            <div className="text-3xl font-bold text-accent mb-2">3/2</div>
            <div className="text-sm font-medium">Salire di <TermTooltip term="quinta">quinta</TermTooltip></div>
            <div className="text-xs text-muted-foreground">
              Do → Sol → Re → La → Mi → Si
            </div>
          </div>

          <div className="module-card text-center">
            <div className="text-3xl font-bold text-violet-500 mb-2">2/3</div>
            <div className="text-sm font-medium">Scendere di quinta</div>
            <div className="text-xs text-muted-foreground">
              Do → Fa (poi ×2 per l'ottava)
            </div>
          </div>

          <div className="module-card text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">7</div>
            <div className="text-sm font-medium">Note nella scala maggiore</div>
            <div className="text-xs text-muted-foreground">
              Do Re Mi Fa Sol La Si
            </div>
          </div>
        </div>

        <InfoBox type="info" title="L'ordine delle quinte">
          <p className="mb-2">Le note non vengono generate nell'ordine della scala! Ecco la sequenza:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>Do</strong> - Nota di partenza (1/1)</li>
            <li><strong>Sol</strong> - Prima quinta: Do × 3/2 = 3/2</li>
            <li><strong>Re</strong> - Seconda quinta: Sol × 3/2 = 9/4 → ÷2 = 9/8</li>
            <li><strong>La</strong> - Terza quinta: Re × 3/2 = 27/16</li>
            <li><strong>Mi</strong> - Quarta quinta: La × 3/2 = 81/32 → ÷2 = 81/64</li>
            <li><strong>Si</strong> - Quinta quinta: Mi × 3/2 = 243/128</li>
            <li><strong>Fa</strong> - Quinta discendente: Do × 2/3 × 2 = 4/3</li>
          </ol>
          <p className="mt-2 text-sm">Solo dopo averle riordinate per frequenza otteniamo: Do, Re, Mi, Fa, Sol, La, Si!</p>
        </InfoBox>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={7} questions={getQuizForModule(7)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module7;