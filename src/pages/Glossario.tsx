/**
 * Glossario Page
 * Dizionario interattivo di termini musicali e acustici
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Home, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { playNote } from '@/lib/audioUtils';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'fisica' | 'musicale' | 'tecnico' | 'matematico';
  relatedTerms?: string[];
  example?: string;
  audioDemo?: () => void;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Frequenza',
    definition:
      'Numero di oscillazioni complete al secondo di un\'onda sonora, misurata in Hertz (Hz). Determina l\'altezza percepita del suono: frequenze più alte producono suoni più acuti, frequenze più basse producono suoni più gravi.',
    category: 'fisica',
    relatedTerms: ['Hz', 'Altezza', 'Periodo'],
    example: 'Il La centrale (A4) ha una frequenza di 440 Hz',
    audioDemo: () => playNote(440, 1),
  },
  {
    term: 'Ampiezza',
    definition:
      'Grandezza massima dello spostamento di un\'onda dalla sua posizione di equilibrio. Nell\'audio, determina l\'intensità o volume del suono. Maggiore ampiezza significa suono più forte.',
    category: 'fisica',
    relatedTerms: ['Volume', 'Intensità', 'Decibel'],
    example: 'Un sussurro ha bassa ampiezza, un grido ha alta ampiezza',
  },
  {
    term: 'Timbro',
    definition:
      'Qualità o "colore" del suono che permette di distinguere strumenti diversi anche quando suonano la stessa nota. È determinato dalla combinazione unica di armonici presenti nel suono.',
    category: 'musicale',
    relatedTerms: ['Armonici', 'Spettro', 'Forma d\'onda'],
    example: 'Il timbro di un violino è diverso da quello di un flauto',
  },
  {
    term: 'Armonici',
    definition:
      'Frequenze multiple intere della frequenza fondamentale. Gli armonici determinano il timbro di un suono. Il primo armonico è la fondamentale, il secondo ha frequenza doppia, il terzo tripla, ecc.',
    category: 'fisica',
    relatedTerms: ['Fondamentale', 'Timbro', 'Serie armonica'],
    example: 'Se la fondamentale è 100 Hz, gli armonici sono 200, 300, 400 Hz...',
  },
  {
    term: 'Fondamentale',
    definition:
      'La frequenza più bassa in un suono complesso, quella che percepiamo come "altezza" della nota. Anche se gli armonici sono presenti, il nostro orecchio identifica principalmente la fondamentale.',
    category: 'fisica',
    relatedTerms: ['Armonici', 'Frequenza'],
  },
  {
    term: 'Ottava',
    definition:
      'Intervallo musicale tra una nota e un\'altra con frequenza doppia o metà. Due note distanti un\'ottava hanno un rapporto di frequenze di 2:1 e suonano molto simili.',
    category: 'musicale',
    relatedTerms: ['Intervallo', 'Rapporto di frequenze'],
    example: 'A4 (440 Hz) e A5 (880 Hz) sono distanti un\'ottava',
    audioDemo: () => {
      playNote(440, 0.5);
      setTimeout(() => playNote(880, 0.5), 600);
    },
  },
  {
    term: 'Quinta',
    definition:
      'Intervallo musicale di cinque note nella scala diatonica. Nella scala pitagorica, il rapporto di frequenze è 3:2. È considerato un intervallo consonante.',
    category: 'musicale',
    relatedTerms: ['Intervallo', 'Consonanza', 'Pitagorico'],
    example: 'Do-Sol è una quinta giusta (rapporto 3:2)',
    audioDemo: () => {
      playNote(261.63, 0.5);
      setTimeout(() => playNote(392, 0.5), 600);
    },
  },
  {
    term: 'Temperamento Equabile',
    definition:
      'Sistema di accordatura che divide l\'ottava in 12 semitoni esattamente uguali. Ogni semitono ha rapporto di frequenze di 2^(1/12) ≈ 1.0595. È lo standard moderno per pianoforti e strumenti a tastiera.',
    category: 'tecnico',
    relatedTerms: ['Temperamento', 'Semitono', 'Accordatura'],
    example: 'Nel temperamento equabile, tutte le tonalità suonano ugualmente "stonate"',
  },
  {
    term: 'Temperamento Pitagorico',
    definition:
      'Sistema di accordatura basato su quinte pure (rapporto 3:2). Genera scale matematicamente perfette ma con il "comma pitagorico" - una piccola discrepanza dopo 12 quinte.',
    category: 'tecnico',
    relatedTerms: ['Temperamento', 'Quinta', 'Comma pitagorico'],
    example: 'Usato nella musica medievale e rinascimentale',
  },
  {
    term: 'Battimento',
    definition:
      'Oscillazione periodica del volume percepita quando due frequenze leggermente diverse suonano insieme. La frequenza del battimento è uguale alla differenza tra le due frequenze.',
    category: 'fisica',
    relatedTerms: ['Interferenza', 'Frequenza'],
    example: 'Due note a 440 Hz e 442 Hz creano un battimento di 2 Hz',
    audioDemo: () => {
      const ctx = new AudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 442;
      gain.gain.value = 0.2;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
      }, 2000);
    },
  },
  {
    term: 'Hz (Hertz)',
    definition:
      'Unità di misura della frequenza nel Sistema Internazionale. 1 Hz = 1 ciclo al secondo. Prende il nome dal fisico Heinrich Hertz.',
    category: 'fisica',
    relatedTerms: ['Frequenza'],
    example: 'Il La standard dell\'orchestra è 440 Hz',
  },
  {
    term: 'Sintesi Additiva',
    definition:
      'Tecnica di sintesi sonora che crea suoni complessi sommando onde sinusoidali semplici (armonici). Basata sul principio di Fourier che ogni suono può essere scomposto in sinusoidi.',
    category: 'tecnico',
    relatedTerms: ['Armonici', 'Fourier', 'Sintesi'],
  },
  {
    term: 'ADSR',
    definition:
      'Attack, Decay, Sustain, Release - I quattro parametri che descrivono l\'inviluppo di ampiezza di un suono nel tempo. Fondamentali nella sintesi sonora per creare suoni realistici.',
    category: 'tecnico',
    relatedTerms: ['Inviluppo', 'Sintesi'],
    example: 'Piano: attacco veloce, decay rapido. Organo: attacco lento, sustain lungo',
  },
  {
    term: 'Spettro',
    definition:
      'Rappresentazione grafica delle frequenze presenti in un suono e della loro intensità relativa. Lo spettro è come "l\'impronta digitale" di un suono.',
    category: 'tecnico',
    relatedTerms: ['FFT', 'Armonici', 'Timbro'],
  },
  {
    term: 'Fase',
    definition:
      'Punto specifico del ciclo di un\'onda in un dato momento, misurata in gradi (0-360°) o radianti. Due onde identiche ma sfasate di 180° si annullano completamente.',
    category: 'fisica',
    relatedTerms: ['Onda', 'Interferenza'],
  },
  {
    term: 'Consonanza',
    definition:
      'Combinazione di suoni percepita come stabile, piacevole e "in riposo". Generalmente basata su rapporti semplici di frequenze (ottava 2:1, quinta 3:2, quarta 4:3).',
    category: 'musicale',
    relatedTerms: ['Dissonanza', 'Intervallo', 'Rapporto di frequenze'],
  },
  {
    term: 'Dissonanza',
    definition:
      'Combinazione di suoni percepita come instabile o tesa, che "richiede risoluzione". Basata su rapporti complessi di frequenze.',
    category: 'musicale',
    relatedTerms: ['Consonanza', 'Intervallo'],
  },
  {
    term: 'Semitono',
    definition:
      'Intervallo più piccolo tra due note nella musica occidentale. Nel temperamento equabile, il rapporto di frequenze è 2^(1/12) ≈ 1.0595.',
    category: 'musicale',
    relatedTerms: ['Temperamento Equabile', 'Intervallo'],
    example: 'Do-Do# è un semitono',
  },
  {
    term: 'Intervallo',
    definition:
      'Distanza tra due note musicali. Può essere misurata in semitoni (temperamento equabile) o come rapporto di frequenze.',
    category: 'musicale',
    relatedTerms: ['Semitono', 'Rapporto di frequenze'],
  },
  {
    term: 'Risonanza',
    definition:
      'Fenomeno per cui un sistema vibra con ampiezza maggiore a certe frequenze specifiche (frequenze di risonanza). Fondamentale negli strumenti musicali.',
    category: 'fisica',
    relatedTerms: ['Frequenza', 'Vibrazione'],
    example: 'La cassa di risonanza di una chitarra amplifica certe frequenze',
  },
  {
    term: 'FFT',
    definition:
      'Fast Fourier Transform - Algoritmo matematico che scompone un segnale audio nelle sue componenti frequenziali. Usato per analisi spettrale in tempo reale.',
    category: 'tecnico',
    relatedTerms: ['Spettro', 'Fourier'],
  },
  {
    term: 'Decibel (dB)',
    definition:
      'Unità logaritmica per misurare l\'intensità del suono. 0 dB è la soglia dell\'udibile, 120 dB è la soglia del dolore. Ogni +10 dB raddoppia la loudness percepita.',
    category: 'fisica',
    relatedTerms: ['Ampiezza', 'Intensità'],
  },
];

const CATEGORIES = {
  fisica: { label: 'Fisica', color: 'blue' },
  musicale: { label: 'Musicale', color: 'purple' },
  tecnico: { label: 'Tecnico', color: 'green' },
  matematico: { label: 'Matematico', color: 'orange' },
} as const;

export default function Glossario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTerms = useMemo(() => {
    let filtered = GLOSSARY_TERMS;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        term =>
          term.term.toLowerCase().includes(search) ||
          term.definition.toLowerCase().includes(search) ||
          term.example?.toLowerCase().includes(search)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    return filtered.sort((a, b) => a.term.localeCompare(b.term, 'it'));
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Glossario Musicale
              </h1>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cerca termini..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  selectedCategory === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                )}
              >
                Tutti
              </button>
              {Object.entries(CATEGORIES).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedCategory === key
                      ? `bg-${color}-600 text-white`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {filteredTerms.length} {filteredTerms.length === 1 ? 'termine trovato' : 'termini trovati'}
        </p>

        <div className="grid gap-4">
          {filteredTerms.map(term => (
            <div
              key={term.term}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {term.term}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      term.category === 'fisica' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                      term.category === 'musicale' &&
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                      term.category === 'tecnico' &&
                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                      term.category === 'matematico' &&
                        'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    )}
                  >
                    {CATEGORIES[term.category].label}
                  </span>
                  {term.audioDemo && (
                    <button
                      onClick={term.audioDemo}
                      className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      title="Ascolta esempio"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {term.definition}
              </p>

              {term.example && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <span className="font-semibold">Esempio:</span> {term.example}
                  </p>
                </div>
              )}

              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Termini correlati:
                  </span>
                  {term.relatedTerms.map(relatedTerm => (
                    <button
                      key={relatedTerm}
                      onClick={() => setSearchTerm(relatedTerm)}
                      className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {relatedTerm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Nessun termine trovato per "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:underline"
            >
              Cancella ricerca
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
