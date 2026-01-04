import { useState, useCallback, useRef, useEffect } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { TermTooltip } from '@/components/TermTooltip';
import { Square } from 'lucide-react';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';
import { Spectrogram } from '@/components/Spectrogram';

type WaveType = 'sine' | 'square' | 'triangle' | 'sawtooth';

interface InstrumentType {
  id: WaveType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const instruments: InstrumentType[] = [
  {
    id: 'sine',
    name: 'Onda sinusoidale',
    icon: '〰️',
    color: '#3b82f6',
    description: 'Solo la fondamentale (1° armonico). Suono puro senza armonici superiori.'
  },
  {
    id: 'triangle',
    name: 'Onda triangolare',
    icon: '📐',
    color: '#8b5cf6',
    description: 'Armonici dispari (1°, 3°, 5°...) con decadimento quadratico (1, 1/9, 1/25...).'
  },
  {
    id: 'square',
    name: 'Onda quadra',
    icon: '⬜',
    color: '#f97316',
    description: 'Armonici dispari (1°, 3°, 5°...) con decadimento lineare (1, 1/3, 1/5...).'
  },
  {
    id: 'sawtooth',
    name: 'Onda a dente di sega',
    icon: '🪚',
    color: '#ef4444',
    description: 'Tutti gli armonici (1°, 2°, 3°, 4°...) con decadimento lineare (1, 1/2, 1/3...).'
  },
];

// Custom wave drawer for each instrument type
const drawInstrumentWave = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  waveType: WaveType,
  phase: number,
  color: string
) => {
  const centerY = height / 2;
  const amplitude = height / 3;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();

  for (let x = 0; x <= width; x++) {
    const t = (x / width) * Math.PI * 4 + phase;
    let y = centerY;

    if (waveType === 'sine') {
      // Pure sinusoid
      y = centerY + Math.sin(t) * amplitude;
    } else if (waveType === 'triangle') {
      // Triangle wave - using arcsin of sin to create triangle shape
      const period = Math.PI * 2;
      const normalized = ((t % period) + period) % period;
      if (normalized < period / 2) {
        y = centerY + (normalized / (period / 4) - 1) * amplitude;
      } else {
        y = centerY + (3 - normalized / (period / 4)) * amplitude;
      }
    } else if (waveType === 'square') {
      // Square wave
      const sinVal = Math.sin(t);
      y = centerY + (sinVal > 0 ? 1 : -1) * amplitude * 0.8;
    } else if (waveType === 'sawtooth') {
      // Sawtooth wave
      const period = Math.PI * 2;
      const normalized = ((t % period) + period) % period;
      y = centerY + ((normalized / period) * 2 - 1) * amplitude;
    }

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
};

const Module4 = () => {
  const [activeInstrument, setActiveInstrument] = useState<WaveType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseRef = useRef(0);
  
  const frequency = 440;

  const playInstrument = useCallback((waveType: WaveType) => {
    // Stop current if same instrument clicked
    if (activeInstrument === waveType && isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
      setActiveInstrument(null);
      return;
    }

    // Stop previous sound
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    setActiveInstrument(waveType);
    setIsPlaying(true);
  }, [activeInstrument, isPlaying]);

  const stopAll = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
    setActiveInstrument(null);
  }, []);

  // Draw wave animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeInstrument) return;

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'hsl(220 40% 13% / 0.08)';
      ctx.lineWidth = 1;
      const centerY = height / 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      const inst = instruments.find(i => i.id === activeInstrument);
      if (inst) {
        drawInstrumentWave(ctx, width, height, activeInstrument, phaseRef.current, inst.color);
      }

      if (isPlaying) {
        phaseRef.current += 0.08;
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeInstrument, isPlaying]);

  return (
    <ModuleLayout
      moduleNumber={4}
      title="Timbro e spettro"
      description="Perché un violino e un flauto suonano diversi anche quando suonano la stessa nota? La risposta sta nel 'colore' del suono."
      prevModule={{ path: '/modulo-3', title: 'Ampiezza' }}
      nextModule={{ path: '/modulo-5', title: 'Armonici' }}
    >
      <div className="space-y-8">
        {/* Waveform selector */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-4">
            Ascolta la stessa nota con timbri diversi
          </h3>
          <p className="text-muted-foreground mb-6">
            Tutte queste forme d'onda suonano la stessa nota (La - 440 Hz), ma hanno un timbro diverso a causa della loro diversa composizione armonica.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {instruments.map((inst) => (
              <button
                key={inst.id}
                onClick={() => playInstrument(inst.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  activeInstrument === inst.id 
                    ? 'border-current scale-105 shadow-lg' 
                    : 'border-transparent bg-muted/50 hover:bg-muted'
                }`}
                style={{
                  borderColor: activeInstrument === inst.id ? inst.color : undefined,
                  boxShadow: activeInstrument === inst.id ? `0 0 20px ${inst.color}40` : undefined,
                }}
              >
                <div className="text-3xl mb-2">{inst.icon}</div>
                <div className="font-medium text-sm">{inst.name}</div>
                {activeInstrument === inst.id && isPlaying && (
                  <div className="mt-2">
                    <Square size={16} className="mx-auto" style={{ color: inst.color }} fill={inst.color} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {isPlaying && (
            <button
              onClick={stopAll}
              className="mt-4 mx-auto block px-6 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Ferma il suono
            </button>
          )}
        </div>

        {/* Wave visualization */}
        {activeInstrument && (
          <div className="module-card animate-fade-in">
            <h4 className="font-semibold mb-4">
              <TermTooltip term="spettro">Forma d'onda</TermTooltip>: {instruments.find(i => i.id === activeInstrument)?.name}
            </h4>
            <canvas
              ref={canvasRef}
              className="w-full h-48 rounded-xl wave-canvas"
              style={{ display: 'block' }}
            />
            <p className="text-sm text-muted-foreground mt-4">
              {instruments.find(i => i.id === activeInstrument)?.description}
            </p>
          </div>
        )}

        {/* Real-time Spectrum Analysis */}
        {activeInstrument && oscillatorRef.current && (
          <div className="module-card animate-fade-in">
            <h4 className="font-semibold mb-4">
              Spettro in tempo reale
            </h4>
            <Spectrogram
              audioSource={oscillatorRef.current}
              fftSize={2048}
              colorScheme={
                instruments.find(i => i.id === activeInstrument)?.color === '#3b82f6' ? 'blue' :
                instruments.find(i => i.id === activeInstrument)?.color === '#8b5cf6' ? 'purple' :
                instruments.find(i => i.id === activeInstrument)?.color === '#ef4444' ? 'rainbow' :
                'purple'
              }
              showFrequencyLabels={true}
            />
            <p className="text-sm text-muted-foreground mt-4">
              Questo spettrogramma mostra l'analisi FFT in tempo reale. Le barre rappresentano
              l'intensità di ciascuna frequenza presente nel suono.
            </p>
          </div>
        )}

        {/* Spectrum explanation */}
        <div className="grid sm:grid-cols-2 gap-4">
          {instruments.map((inst) => (
            <div 
              key={inst.id}
              className="module-card cursor-pointer hover:border-accent/30 transition-colors"
              onClick={() => playInstrument(inst.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{inst.icon}</span>
                <h4 className="font-semibold">{inst.name}</h4>
              </div>
              
              {/* Simple spectrum visualization */}
              <div className="flex items-end gap-1 h-16 mb-3">
                {[1, 2, 3, 4, 5, 6].map((n) => {
                  let height = 0;
                  if (inst.id === 'sine') {
                    height = n === 1 ? 100 : 0;
                  } else if (inst.id === 'triangle') {
                    height = n % 2 === 1 ? 100 / (n * n) : 0;
                  } else if (inst.id === 'square') {
                    height = n % 2 === 1 ? 100 / n : 0;
                  } else {
                    height = 100 / n;
                  }
                  
                  return (
                    <div
                      key={n}
                      className="flex-1 rounded-t transition-all"
                      style={{ 
                        height: `${Math.max(height, 5)}%`,
                        backgroundColor: height > 0 ? inst.color : '#e5e7eb',
                        opacity: height > 0 ? 1 : 0.3,
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Spettro: le barre mostrano quali frequenze compongono il suono
              </p>
            </div>
          ))}
        </div>

        <InfoBox type="tip" title="Lo spettro è come una ricetta!">
          Ogni forma d'onda ha la sua "ricetta" di frequenze. L'onda sinusoidale usa solo
          la frequenza principale (<TermTooltip term="fondamentale">fondamentale</TermTooltip>). L'onda a dente di sega mescola tutti gli
          <TermTooltip term="armonico">armonici</TermTooltip> in proporzioni precise. Nel prossimo modulo vedremo come funziona la scomposizione di Fourier!
        </InfoBox>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={4} questions={getQuizForModule(4)} />
        </div>
      </div>
    </ModuleLayout>
  );
};

export default Module4;