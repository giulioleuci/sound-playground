import { useState, useCallback, useRef, useEffect } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { TermTooltip } from '@/components/TermTooltip';
import { Slider } from '@/components/Slider';
import { PlayButton } from '@/components/PlayButton';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';
import { Spectrogram, Oscilloscope } from '@/components/Spectrogram';

const Module10 = () => {
  const [freq1, setFreq1] = useState(440);
  const [freq2, setFreq2] = useState(442);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseRef = useRef(0);

  const beatFrequency = Math.abs(freq2 - freq1);

  const stopAll = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
    setIsPlaying(false);
  }, []);

  const playBoth = useCallback(() => {
    if (isPlaying) {
      stopAll();
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Create master gain for visualization
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // Oscillator 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start();

    // Oscillator 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq2, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start();

    oscillatorsRef.current = [osc1, osc2];
    gainNodesRef.current = [gain1, gain2];
    setIsPlaying(true);
  }, [isPlaying, freq1, freq2, stopAll]);

  // Update frequencies while playing
  useEffect(() => {
    if (isPlaying && oscillatorsRef.current.length === 2 && audioContextRef.current) {
      oscillatorsRef.current[0].frequency.setValueAtTime(freq1, audioContextRef.current.currentTime);
      oscillatorsRef.current[1].frequency.setValueAtTime(freq2, audioContextRef.current.currentTime);
    }
  }, [freq1, freq2, isPlaying]);

  // Draw beat visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid line
      ctx.strokeStyle = 'hsl(220 40% 13% / 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw combined wave with beats
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const normalizedFreq1 = freq1 / 440;
      const normalizedFreq2 = freq2 / 440;
      const amplitude = height / 4;

      for (let x = 0; x <= width; x++) {
        const t = (x / width) * Math.PI * 8 + phaseRef.current;
        // Sum of two waves
        const y1 = Math.sin(t * normalizedFreq1) * amplitude;
        const y2 = Math.sin(t * normalizedFreq2) * amplitude;
        const y = centerY + (y1 + y2) / 2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isPlaying) {
        phaseRef.current += 0.05;
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [freq1, freq2, isPlaying]);

  return (
    <ModuleLayout
      moduleNumber={10}
      title="I battimenti"
      description="Quando due suoni simili si incontrano, creano un effetto speciale: i battimenti. Scopri come funziona!"
      prevModule={{ path: '/modulo-9', title: 'Corde' }}
      nextModule={{ path: '/modulo-11', title: 'Temperamenti' }}
    >
      <div className="space-y-8">
        {/* Main explanation */}
        <div className="module-card bg-gradient-to-br from-orange-500/5 to-amber-500/5">
          <h3 className="font-display text-xl font-semibold mb-4">
            🔊 Cosa sono i battimenti?
          </h3>
          <p className="text-muted-foreground mb-4">
            Quando due suoni hanno <TermTooltip term="frequenza">frequenze</TermTooltip> molto vicine, le loro onde si sommano e si cancellano
            alternativamente, creando un effetto di "pulsazione" chiamato <TermTooltip term="battimento"><strong>battimento</strong></TermTooltip>.
          </p>
          <p className="text-muted-foreground">
            Il numero di pulsazioni al secondo è uguale alla differenza tra le due frequenze!
          </p>
        </div>

        {/* Interactive beat explorer */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Sperimenta i battimenti
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <Slider
                value={freq1}
                onChange={setFreq1}
                min={420}
                max={460}
                step={1}
                label="Prima frequenza"
                unit=" Hz"
                color="#3b82f6"
              />
            </div>
            <div>
              <Slider
                value={freq2}
                onChange={setFreq2}
                min={420}
                max={460}
                step={1}
                label="Seconda frequenza"
                unit=" Hz"
                color="#8b5cf6"
              />
            </div>
          </div>

          {/* Beat frequency display */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-xl bg-muted">
              <div className="text-sm text-muted-foreground mb-1">Frequenza di battimento</div>
              <div className="text-3xl font-bold text-accent">
                {beatFrequency} Hz
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                = |{freq1} - {freq2}| pulsazioni al secondo
              </div>
            </div>
          </div>

          {/* Wave visualization */}
          <canvas
            ref={canvasRef}
            className="w-full h-32 rounded-xl wave-canvas mb-6"
          />

          <div className="flex justify-center">
            <PlayButton
              isPlaying={isPlaying}
              onToggle={playBoth}
              size="lg"
            />
          </div>
        </div>

        {/* Spectrogram and Oscilloscope visualizations */}
        {isPlaying && masterGainRef.current && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="module-card">
              <h3 className="font-display text-xl font-semibold mb-4">
                Spettro delle frequenze
              </h3>
              <Spectrogram
                audioSource={masterGainRef.current as any}
                fftSize={2048}
                colorScheme="purple"
              />
              <p className="text-sm text-muted-foreground mt-3">
                Lo spettrogramma mostra le due frequenze vicine ({freq1} Hz e {freq2} Hz)
                che generano il battimento.
              </p>
            </div>
            <div className="module-card">
              <h3 className="font-display text-xl font-semibold mb-4">
                Ampiezza modulata
              </h3>
              <Oscilloscope
                audioSource={masterGainRef.current as any}
                fftSize={2048}
              />
              <p className="text-sm text-muted-foreground mt-3">
                L'oscilloscopio mostra l'ampiezza che "pulsa" a {beatFrequency} Hz,
                creando l'effetto di battimento.
              </p>
            </div>
          </div>
        )}

        <InfoBox type="tip" title="I musicisti usano i battimenti!">
          Quando accordi una chitarra o un pianoforte, ascolti i battimenti tra due corde. 
          Se i battimenti rallentano e poi scompaiono, le corde sono accordate! 
          Questo metodo è usato da secoli.
        </InfoBox>

        {/* Examples */}
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => { setFreq1(440); setFreq2(441); }}
            className="module-card text-center hover:border-accent/30 transition-colors cursor-pointer"
          >
            <div className="text-3xl font-bold text-accent mb-2">1 Hz</div>
            <div className="text-sm font-medium">Battimento lento</div>
            <div className="text-xs text-muted-foreground">440 + 441 Hz</div>
          </button>
          
          <button
            onClick={() => { setFreq1(440); setFreq2(444); }}
            className="module-card text-center hover:border-accent/30 transition-colors cursor-pointer"
          >
            <div className="text-3xl font-bold text-violet-500 mb-2">4 Hz</div>
            <div className="text-sm font-medium">Battimento medio</div>
            <div className="text-xs text-muted-foreground">440 + 444 Hz</div>
          </button>
          
          <button
            onClick={() => { setFreq1(440); setFreq2(450); }}
            className="module-card text-center hover:border-accent/30 transition-colors cursor-pointer"
          >
            <div className="text-3xl font-bold text-blue-500 mb-2">10 Hz</div>
            <div className="text-sm font-medium">Battimento veloce</div>
            <div className="text-xs text-muted-foreground">440 + 450 Hz</div>
          </button>
        </div>

        {/* Math explanation */}
        <div className="module-card bg-gradient-to-br from-blue-500/5 to-violet-500/5">
          <h4 className="font-display text-lg font-semibold mb-4">
            📐 La matematica dei battimenti
          </h4>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Quando due onde con frequenze f₁ e f₂ si sommano, il risultato è un'onda che 
              oscilla alla frequenza media (f₁+f₂)/2, ma la cui ampiezza varia con frequenza |f₁-f₂|.
            </p>
            <p>
              Ecco perché senti il volume che "pulsa" — è l'ampiezza che cresce e diminuisce!
            </p>
          </div>
        </div>

        <InfoBox type="warning" title="Nel prossimo modulo...">
          Scoprirai che i battimenti sono fondamentali per capire la differenza tra
          la scala pitagorica e quella moderna. Quando due note "dovrebbero" essere
          uguali ma non lo sono, senti i battimenti!
        </InfoBox>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={10} questions={getQuizForModule(10)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module10;