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
import { Brain, Volume2, VolumeX, TrendingUp } from 'lucide-react';

export default function Module14() {
  const [shepardPlaying, setShepardPlaying] = useState(false);
  const [missingFundPlaying, setMissingFundPlaying] = useState(false);
  const shepardOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const missingFundOscillatorsRef = useRef<OscillatorNodes[]>([]);
  const shepardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { markCompleted } = useModuleStatus(14);

  // Shepard Tone - scala infinita che sale
  const handleShepardTone = useCallback(() => {
    if (shepardPlaying) {
      // Stop
      shepardOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      shepardOscillatorsRef.current = [];
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
            gain.connect(ctx.destination);
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
      setMissingFundPlaying(false);
    } else {
      // Start - play harmonics WITHOUT fundamental
      try {
        const ctx = getAudioContext();
        const fundamental = 200; // Hz
        const harmonics = [2, 3, 4, 5, 6]; // Armonici senza la fondamentale!

        const newOscillators: OscillatorNodes[] = [];

        harmonics.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.value = fundamental * n;
          gain.gain.value = 0.15;

          osc.connect(gain);
          gain.connect(ctx.destination);
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

  // Cleanup
  useEffect(() => {
    return () => {
      shepardOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      missingFundOscillatorsRef.current.forEach(nodes => stopOscillator(nodes));
      if (shepardIntervalRef.current) {
        clearInterval(shepardIntervalRef.current);
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
                  onClick={handleShepardTone}
                  size="lg"
                />
              </div>
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
                  onClick={handleMissingFundamental}
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* McGurk Effect - Text Only */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-600 dark:bg-green-700 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Altri Fenomeni Psicoacustici
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Effetto McGurk:</strong>{' '}
                  Vedere labiale "ga" mentre senti "ba" fa percepire "da" - vista e udito si integrano!
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Mascheramento:</strong>{' '}
                  Un suono forte nasconde suoni più deboli a frequenze vicine. Usato nella
                  compressione MP3.
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Ottava phantom:</strong>{' '}
                  Due frequenze (es. 400 Hz orecchio sinistro, 800 Hz destro) creano percezione
                  di una terza frequenza (600 Hz) al centro!
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-gray-100">Paradosso del tritono:</strong>{' '}
                  Stesso intervallo musicale percepito come ascendente o discendente a seconda
                  del contesto culturale.
                </li>
              </ul>
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
