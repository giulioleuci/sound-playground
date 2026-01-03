/**
 * Modulo 14: Psicoacustica
 * Illusioni audio e percezione del suono
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { ModuleLayout } from '@/components/ModuleLayout';
import { InfoBox } from '@/components/InfoBox';
import { PlayButton } from '@/components/PlayButton';
import { getAudioContext, stopOscillator, type OscillatorNodes } from '@/lib/audioUtils';
import { useModuleStatus } from '@/hooks/useProgress';
import { TermTooltip } from '@/components/TermTooltip';
import { Brain, Volume2, VolumeX, TrendingUp, Headphones, Layers, Music } from 'lucide-react';
import { Quiz } from '@/components/Quiz';
import { getQuizForModule } from '@/data/quizzes';
import { Spectrogram } from '@/components/Spectrogram';

export default function Module14() {
  const [shepardPlaying, setShepardPlaying] = useState(false);
  const [missingFundPlaying, setMissingFundPlaying] = useState(false);
  const [maskingPlaying, setMaskingPlaying] = useState(false);
  const [phantomPlaying, setPhantomPlaying] = useState(false);
  const [tritonePlaying, setTritonePlaying] = useState(false);
  const shepardOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const missingFundOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const maskingOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const phantomOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const tritoneOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const shepardMasterGainRef = useRef<GainNode | null>(null);
  const missingFundMasterGainRef = useRef<GainNode | null>(null);
  const shepardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tritoneIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { markCompleted } = useModuleStatus(14);

  // Shepard Tone - scala infinita che sale
  const handleShepardTone = useCallback(() => {
    if (shepardPlaying) {
      // Stop
      shepardOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      shepardOscillatorsRef.current = [];
      shepardMasterGainRef.current = null;
      if (shepardIntervalRef.current) {
        clearInterval(shepardIntervalRef.current);
        shepardIntervalRef.current = null;
      }
      setShepardPlaying(false);
    } else {
      // Start
      try {
        const ctx = getAudioContext();
        let baseFreq = 220; // A3

        // Create master gain for visualization
        const masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);
        shepardMasterGainRef.current = masterGain;

        const playShepardStep = () => {
          // Stop previous
          shepardOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
          shepardOscillatorsRef.current = [];

          // Play 5 ottave simultaneamente con ampiezza gaussiana
          const octaves = [0, 1, 2, 3, 4];
          const newOscillators: OscillatorNodes[] = [];

          octaves.forEach(octave => {
            const freq = baseFreq * Math.pow(2, octave);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            // Gaussian envelope - ottave centrali più forti
            const center = 2; // ottava centrale
            const sigma = 1.2;
            const amplitude = Math.exp(-Math.pow(octave - center, 2) / (2 * sigma * sigma)) * 0.15;

            gain.gain.value = amplitude;

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();

            newOscillators.push({ oscillator: osc, gainNode: gain });
          });

          shepardOscillatorsRef.current = newOscillators;

          // Increase base frequency (salendo la scala)
          baseFreq *= Math.pow(2, 1 / 12); // semitono

          // Reset quando troppo alto (crea l'illusione di continuità)
          if (baseFreq > 440) {
            baseFreq = 220;
          }
        };

        // Start loop
        playShepardStep();
        shepardIntervalRef.current = setInterval(playShepardStep, 500);
        setShepardPlaying(true);
      } catch (error) {
        console.error('Errore Shepard Tone:', error);
      }
    }
  }, [shepardPlaying]);

  // Missing Fundamental - percezione della fondamentale assente
  const handleMissingFundamental = useCallback(() => {
    if (missingFundPlaying) {
      // Stop
      missingFundOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      missingFundOscillatorsRef.current = [];
      missingFundMasterGainRef.current = null;
      setMissingFundPlaying(false);
    } else {
      // Start - play harmonics WITHOUT fundamental
      try {
        const ctx = getAudioContext();
        const fundamental = 200; // Hz
        const harmonics = [2, 3, 4, 5, 6]; // Armonici senza la fondamentale!

        // Create master gain for visualization
        const masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);
        missingFundMasterGainRef.current = masterGain;

        const newOscillators: OscillatorNodes[] = [];

        harmonics.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.value = fundamental * n;
          gain.gain.value = 0.15;

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();

          newOscillators.push({ oscillator: osc, gainNode: gain });
        });

        missingFundOscillatorsRef.current = newOscillators;
        setMissingFundPlaying(true);
      } catch (error) {
        console.error('Errore Missing Fundamental:', error);
      }
    }
  }, [missingFundPlaying]);

  // Mascheramento (Masking) - un suono forte nasconde suoni deboli
  const handleMasking = useCallback(() => {
    if (maskingPlaying) {
      maskingOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      maskingOscillatorsRef.current = [];
      setMaskingPlaying(false);
    } else {
      try {
        const ctx = getAudioContext();
        const newOscillators: OscillatorNodes[] = [];

        // Suono mascherante forte a 1000 Hz
        const maskOsc = ctx.createOscillator();
        const maskGain = ctx.createGain();
        maskOsc.type = 'sine';
        maskOsc.frequency.value = 1000;
        maskGain.gain.value = 0.3;
        maskOsc.connect(maskGain);
        maskGain.connect(ctx.destination);
        maskOsc.start();
        newOscillators.push({ oscillator: maskOsc, gainNode: maskGain });

        // Suono debole a 1050 Hz (mascherato)
        const weakOsc = ctx.createOscillator();
        const weakGain = ctx.createGain();
        weakOsc.type = 'sine';
        weakOsc.frequency.value = 1050;
        weakGain.gain.value = 0.05; // Molto più debole
        weakOsc.connect(weakGain);
        weakGain.connect(ctx.destination);
        weakOsc.start();
        newOscillators.push({ oscillator: weakOsc, gainNode: weakGain });

        // Suono a 1500 Hz (non mascherato - udibile)
        const audibleOsc = ctx.createOscillator();
        const audibleGain = ctx.createGain();
        audibleOsc.type = 'sine';
        audibleOsc.frequency.value = 1500;
        audibleGain.gain.value = 0.05;
        audibleOsc.connect(audibleGain);
        audibleGain.connect(ctx.destination);
        audibleOsc.start();
        newOscillators.push({ oscillator: audibleOsc, gainNode: audibleGain });

        maskingOscillatorsRef.current = newOscillators;
        setMaskingPlaying(true);
      } catch (error) {
        console.error('Errore Mascheramento:', error);
      }
    }
  }, [maskingPlaying]);

  // Ottava Phantom (Dichotic pitch) - audio stereo con frequenze diverse
  const handlePhantomOctave = useCallback(() => {
    if (phantomPlaying) {
      phantomOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      phantomOscillatorsRef.current = [];
      setPhantomPlaying(false);
    } else {
      try {
        const ctx = getAudioContext();
        const newOscillators: OscillatorNodes[] = [];

        // Frequenza bassa nell'orecchio sinistro (400 Hz)
        const leftOsc = ctx.createOscillator();
        const leftGain = ctx.createGain();
        const leftPanner = ctx.createStereoPanner();
        leftOsc.type = 'sine';
        leftOsc.frequency.value = 400;
        leftGain.gain.value = 0.25;
        leftPanner.pan.value = -1; // Tutto a sinistra
        leftOsc.connect(leftGain);
        leftGain.connect(leftPanner);
        leftPanner.connect(ctx.destination);
        leftOsc.start();
        newOscillators.push({ oscillator: leftOsc, gainNode: leftGain });

        // Frequenza alta nell'orecchio destro (800 Hz)
        const rightOsc = ctx.createOscillator();
        const rightGain = ctx.createGain();
        const rightPanner = ctx.createStereoPanner();
        rightOsc.type = 'sine';
        rightOsc.frequency.value = 800;
        rightGain.gain.value = 0.25;
        rightPanner.pan.value = 1; // Tutto a destra
        rightOsc.connect(rightGain);
        rightGain.connect(rightPanner);
        rightPanner.connect(ctx.destination);
        rightOsc.start();
        newOscillators.push({ oscillator: rightOsc, gainNode: rightGain });

        phantomOscillatorsRef.current = newOscillators;
        setPhantomPlaying(true);
      } catch (error) {
        console.error('Errore Ottava Phantom:', error);
      }
    }
  }, [phantomPlaying]);

  // Paradosso del Tritono (Deutsch's Tritone Paradox)
  const handleTritoneParadox = useCallback(() => {
    if (tritonePlaying) {
      tritoneOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      tritoneOscillatorsRef.current = [];
      if (tritoneIntervalRef.current) {
        clearInterval(tritoneIntervalRef.current);
        tritoneIntervalRef.current = null;
      }
      setTritonePlaying(false);
    } else {
      try {
        const ctx = getAudioContext();

        // Shepard tones separati da un tritono (6 semitoni)
        let phase = 0;
        const playTritonePair = () => {
          // Stop previous
          tritoneOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
          tritoneOscillatorsRef.current = [];

          const baseFreqs = [261.63, 293.66, 329.63, 369.99, 415.30, 466.16]; // C, D, E, F#, G#, A#
          const baseFreq = baseFreqs[phase % 6];
          const tritoneFreq = baseFreq * Math.pow(2, 6/12); // +6 semitoni

          const newOscillators: OscillatorNodes[] = [];
          const octaves = [0, 1, 2, 3];

          // Prima nota (Shepard tone)
          octaves.forEach(octave => {
            const freq = baseFreq * Math.pow(2, octave);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const center = 1.5;
            const sigma = 1.2;
            const amplitude = Math.exp(-Math.pow(octave - center, 2) / (2 * sigma * sigma)) * 0.1;
            gain.gain.value = amplitude;

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);

            newOscillators.push({ oscillator: osc, gainNode: gain });
          });

          // Seconda nota dopo 0.5s (Shepard tone con tritono)
          setTimeout(() => {
            octaves.forEach(octave => {
              const freq = tritoneFreq * Math.pow(2, octave);
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'sine';
              osc.frequency.value = freq;

              const center = 1.5;
              const sigma = 1.2;
              const amplitude = Math.exp(-Math.pow(octave - center, 2) / (2 * sigma * sigma)) * 0.1;
              gain.gain.value = amplitude;

              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.4);

              newOscillators.push({ oscillator: osc, gainNode: gain });
            });
          }, 500);

          tritoneOscillatorsRef.current = newOscillators;
          phase++;
        };

        playTritonePair();
        tritoneIntervalRef.current = setInterval(playTritonePair, 1500);
        setTritonePlaying(true);
      } catch (error) {
        console.error('Errore Tritone Paradox:', error);
      }
    }
  }, [tritonePlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      shepardOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      missingFundOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      maskingOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      phantomOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      tritoneOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      if (shepardIntervalRef.current) {
        clearInterval(shepardIntervalRef.current);
      }
      if (tritoneIntervalRef.current) {
        clearInterval(tritoneIntervalRef.current);
      }
    };
  }, []);

  return (
    <ModuleLayout
      moduleNumber={14}
      title="Psicoacustica"
      description="Illusioni audio e percezione del suono"
      prevModule={{ path: '/modulo-13', title: 'Inviluppo ADSR' }}
    >
      <div className="space-y-8">
        <InfoBox type="info">
          <p>
            La <TermTooltip term="psicoacustica" definition="Studio di come il cervello percepisce e interpreta i suoni">
              psicoacustica
            </TermTooltip>{' '}
            studia come percepiamo i suoni. Il nostro cervello non sente "oggettivamente" - interpreta,
            ricostruisce e a volte crea suoni che fisicamente non esistono!
          </p>
        </InfoBox>

        {/* Shepard Tone */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-purple-600 dark:bg-purple-700 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Shepard Tone - La Scala Infinita
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Un'illusione auditiva che sembra salire (o scendere) all'infinito senza mai
                fermarsi. Usata in film come "Dunkirk" e "The Dark Knight" per creare tensione.
              </p>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Come funziona:</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Suonano simultaneamente 5 ottave della stessa nota. Mentre le frequenze salgono,
                  le ottave più basse svaniscono gradualmente (fade out) e quelle più alte emergono
                  (fade in). Il cervello percepisce solo la direzione del movimento, non il "ciclo"!
                </p>
              </div>

              <div className="flex justify-center">
                <PlayButton
                  isPlaying={shepardPlaying}
                  onToggle={handleShepardTone}
                  size="lg"
                />
              </div>

              {/* Spectrogram for Shepard Tone */}
              {shepardPlaying && shepardMasterGainRef.current && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Spettro delle ottave sovrapposte
                  </h4>
                  <Spectrogram
                    audioSource={shepardMasterGainRef.current as any}
                    fftSize={2048}
                    colorScheme="blue"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Lo spettrogramma mostra le 5 ottave che suonano simultaneamente.
                    Osserva come le frequenze si spostano verso l'alto mentre
                    l'ampiezza si distribuisce con una curva gaussiana.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Missing Fundamental */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-700 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Fondamentale Mancante
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Il cervello "sente" una nota anche se la sua{' '}
                <TermTooltip term="fondamentale">frequenza fondamentale</TermTooltip>{' '}
                non è fisicamente presente! Questo permette agli altoparlanti piccoli di
                riprodurre bassi che non possono fisicamente generare.
              </p>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>L'esperimento:</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Suoniamo solo gli <TermTooltip term="armonici">armonici</TermTooltip> 2°, 3°, 4°, 5° e 6°
                  di una nota a 200 Hz (cioè: 400, 600, 800, 1000, 1200 Hz).
                  La fondamentale di 200 Hz <strong>non viene suonata</strong>, eppure il cervello
                  la percepisce chiaramente!
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <VolumeX className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-red-700 dark:text-red-300 font-semibold">
                    200 Hz (fondamentale) - ASSENTE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Volume2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300">
                    400, 600, 800, 1000, 1200 Hz - PRESENTI
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <PlayButton
                  isPlaying={missingFundPlaying}
                  onToggle={handleMissingFundamental}
                  size="lg"
                />
              </div>

              {/* Spectrogram for Missing Fundamental */}
              {missingFundPlaying && missingFundMasterGainRef.current && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Spettro degli armonici senza fondamentale
                  </h4>
                  <Spectrogram
                    audioSource={missingFundMasterGainRef.current as any}
                    fftSize={2048}
                    colorScheme="green"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Lo spettrogramma mostra solo gli armonici 2°, 3°, 4°, 5° e 6° (400, 600, 800, 1000, 1200 Hz).
                    La fondamentale a 200 Hz è completamente assente, ma il cervello la percepisce comunque!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mascheramento (Masking) */}
        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-orange-600 dark:bg-orange-700 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Mascheramento Uditivo
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Un suono forte "nasconde" suoni più deboli a frequenze vicine.
                Questo fenomeno è sfruttato nella compressione audio (MP3, AAC) per
                rimuovere frequenze che non percepiremmo comunque!
              </p>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>L'esperimento:</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Suoniamo tre frequenze: un tono forte a 1000 Hz, uno debole a 1050 Hz (mascherato),
                  e uno debole a 1500 Hz (non mascherato). Riesci a sentire tutti e tre?
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>1000 Hz - <strong>Forte</strong> (mascherante)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-300" />
                    <span>1050 Hz - <em>Debole</em> (mascherato - difficile da sentire!)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>1500 Hz - <em>Debole</em> (udibile - non mascherato)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <PlayButton
                  isPlaying={maskingPlaying}
                  onToggle={handleMasking}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ottava Phantom (Dichotic) */}
        <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-pink-600 dark:bg-pink-700 rounded-lg">
              <Headphones className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Ottava Phantom (Ascolto Dicotico)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Quando frequenze diverse arrivano ai due orecchi separatamente, il cervello
                può percepire una terza frequenza "fantasma" nel mezzo!
              </p>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>⚠️ Usa le cuffie stereo!</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Inviamo 400 Hz all'orecchio sinistro e 800 Hz al destro. Alcuni percepiscono
                  una frequenza intermedia (~600 Hz) che sembra provenire dal centro della testa!
                </p>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600 dark:text-pink-400">◀ Sinistra</span>
                    <span>400 Hz</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>800 Hz</span>
                    <span className="text-purple-600 dark:text-purple-400">Destra ▶</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <PlayButton
                  isPlaying={phantomPlaying}
                  onToggle={handlePhantomOctave}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Paradosso del Tritono */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-teal-600 dark:bg-teal-700 rounded-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Paradosso del Tritono (Deutsch)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Due note separate da un tritono (6 semitoni) usando Shepard tones:
                alcune persone le percepiscono come ascendenti, altre come discendenti!
                La percezione dipende dalla lingua madre e dal contesto culturale.
              </p>

              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>L'esperimento:</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ascolterai coppie di note (Shepard tones) separate da un tritono.
                  Senti la seconda nota come più alta o più bassa della prima?
                  Non c'è risposta "giusta" - è un'illusione auditiva!
                </p>
              </div>

              <div className="flex justify-center">
                <PlayButton
                  isPlaying={tritonePlaying}
                  onToggle={handleTritoneParadox}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* McGurk Effect - Text Only (requires video) */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-xl border-2 border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-600 dark:bg-gray-700 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Effetto McGurk
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Vedere il movimento labiale "ga" mentre si ascolta "ba" fa percepire "da".
                La vista e l'udito si integrano nel cervello! Questo effetto richiede video,
                cerca "McGurk effect" su YouTube per sperimentarlo.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <InfoBox type="tip">
          <p className="mb-2"><strong>Perché è importante:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Compressione audio:</strong> MP3/AAC rimuovono frequenze che il cervello
              non percepirebbe (mascheramento)
            </li>
            <li>
              <strong>Sound design:</strong> Creare effetti impossibili fisicamente ma percettivamente
              reali
            </li>
            <li>
              <strong>Acustica architettonica:</strong> Progettare spazi considerando come
              percepiamo i suoni
            </li>
            <li>
              <strong>Sintesi audio:</strong> Speaker piccoli possono "simulare" bassi che non
              producono (fondamentale mancante)
            </li>
          </ul>
        </InfoBox>

        {/* Quiz */}
        <div className="module-card">
          <h3 className="font-display text-xl font-semibold mb-6">
            Verifica la tua comprensione
          </h3>
          <Quiz moduleNumber={14} questions={getQuizForModule(14)} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => markCompleted(100)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Segna Modulo Come Completato
          </button>
        </div>
      </div>
    </ModuleLayout>
  );
}
