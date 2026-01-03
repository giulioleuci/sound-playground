/**
 * Modalità Sfida - Ear Training Games
 * Mini-giochi per allenare l'orecchio musicale
 */

import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Home, Volume2, Star } from 'lucide-react';
import { Quiz, type QuizQuestion } from '@/components/Quiz';
import { playNote, midiToFrequency } from '@/lib/audioUtils';

const CHALLENGES = {
  intervals: {
    title: 'Riconosci gli Intervalli',
    description: 'Identifica l\'intervallo tra due note',
    icon: <Volume2 className="w-6 h-6" />,
    generateQuestions: (): QuizQuestion[] => {
      const intervals = [
        { name: 'Unisono', semitones: 0 },
        { name: 'Seconda minore', semitones: 1 },
        { name: 'Seconda maggiore', semitones: 2 },
        { name: 'Terza minore', semitones: 3 },
        { name: 'Terza maggiore', semitones: 4 },
        { name: 'Quarta giusta', semitones: 5 },
        { name: 'Quinta giusta', semitones: 7 },
        { name: 'Ottava', semitones: 12 },
      ];

      return Array.from({ length: 10 }, (_, i) => {
        const correctInterval = intervals[Math.floor(Math.random() * intervals.length)];
        const baseNote = 60; // C4
        const secondNote = baseNote + correctInterval.semitones;

        const options = intervals
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map(i => i.name);

        if (!options.includes(correctInterval.name)) {
          options[0] = correctInterval.name;
        }

        const correctAnswer = options.indexOf(correctInterval.name);

        return {
          question: `Quale intervallo viene suonato?`,
          options,
          correctAnswer,
          explanation: `L'intervallo è ${correctInterval.name} (${correctInterval.semitones} semitoni)`,
        };
      });
    },
  },
  frequencies: {
    title: 'Indovina la Frequenza',
    description: 'Stima la frequenza di una nota',
    icon: <Star className="w-6 h-6" />,
    generateQuestions: (): QuizQuestion[] => {
      const frequencies = [220, 261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25];
      const noteNames = ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

      return Array.from({ length: 8 }, () => {
        const correctIndex = Math.floor(Math.random() * frequencies.length);
        const correctFreq = frequencies[correctIndex];
        const correctNote = noteNames[correctIndex];

        const options = frequencies
          .map((f, i) => `${noteNames[i]} (${f.toFixed(0)} Hz)`)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        const correctOption = `${correctNote} (${correctFreq.toFixed(0)} Hz)`;
        if (!options.includes(correctOption)) {
          options[0] = correctOption;
        }

        const correctAnswer = options.indexOf(correctOption);

        // Play note when question loads
        setTimeout(() => playNote(correctFreq, 1), 300);

        return {
          question: 'Quale nota viene suonata?',
          options,
          correctAnswer,
          explanation: `La nota è ${correctNote} con frequenza ${correctFreq.toFixed(2)} Hz`,
        };
      });
    },
  },
  harmonics: {
    title: 'Conta gli Armonici',
    description: 'Identifica quanti armonici sono presenti',
    icon: <Trophy className="w-6 h-6" />,
    generateQuestions: (): QuizQuestion[] => {
      return Array.from({ length: 6 }, () => {
        const numHarmonics = Math.floor(Math.random() * 5) + 2; // 2-6 armonici

        return {
          question: `Quanti armonici (inclusa la fondamentale) senti in questo suono?`,
          options: ['2', '3', '4', '5', '6'],
          correctAnswer: numHarmonics - 2,
          explanation: `Il suono contiene ${numHarmonics} armonici`,
        };
      });
    },
  },
};

export default function Sfida() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const handleStartChallenge = useCallback((challengeKey: string) => {
    const challenge = CHALLENGES[challengeKey as keyof typeof CHALLENGES];
    const generatedQuestions = challenge.generateQuestions();
    setQuestions(generatedQuestions);
    setSelectedChallenge(challengeKey);
  }, []);

  const handleChallengeComplete = useCallback((score: number) => {
    console.log('Challenge completed with score:', score);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setSelectedChallenge(null);
    setQuestions([]);
  }, []);

  if (selectedChallenge && questions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {CHALLENGES[selectedChallenge as keyof typeof CHALLENGES].title}
            </h1>
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Torna al Menu
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <Quiz
            moduleNumber={0} // Special module for challenges
            questions={questions}
            onComplete={handleChallengeComplete}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Modalità Sfida
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
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Allena il Tuo Orecchio Musicale
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Metti alla prova le tue abilità di ascolto con quiz interattivi.
            Migliora la tua percezione di intervalli, frequenze e timbri!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(CHALLENGES).map(([key, challenge]) => (
            <button
              key={key}
              onClick={() => handleStartChallenge(key)}
              className="group p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-purple-600 dark:text-purple-400">
                    {challenge.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {challenge.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {challenge.description}
                </p>
                <div className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold group-hover:bg-purple-700 transition-colors">
                  Inizia Sfida
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Suggerimenti per l'Ear Training
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Usa cuffie di buona qualità per distinguere meglio le sfumature</li>
            <li>• Fai pratica regolarmente, anche solo 5-10 minuti al giorno</li>
            <li>• Inizia dalle sfide più semplici e progredisci gradualmente</li>
            <li>• Canta o fischia gli intervalli che senti per interiorizzarli</li>
            <li>• Collega intervalli a canzoni famose (es. quinta = Star Wars)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
