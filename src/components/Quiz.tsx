/**
 * Quiz Component
 * Sistema di quiz interattivi per ogni modulo
 */

import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveQuizResult, type QuizResult } from '@/lib/storage';
import { useModuleProgress } from '@/hooks/useProgress';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index della risposta corretta
  explanation?: string; // Spiegazione dopo la risposta
}

interface QuizProps {
  moduleNumber: number;
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
  className?: string;
}

/**
 * Componente Quiz interattivo
 */
export function Quiz({ moduleNumber, questions, onComplete, className }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { markCompleted } = useModuleProgress();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (hasAnswered) return; // Previene multiple risposte

      const newAnswers = [...selectedAnswers, answerIndex];
      setSelectedAnswers(newAnswers);
      setHasAnswered(true);

      // Aspetta un momento prima di mostrare la spiegazione
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          // Non è l'ultima domanda
        } else {
          // Ultima domanda - calcola risultati
          const correctCount = newAnswers.filter(
            (answer, index) => answer === questions[index].correctAnswer
          ).length;
          const score = Math.round((correctCount / totalQuestions) * 100);

          // Salva risultati
          const result: QuizResult = {
            moduleNumber,
            score,
            totalQuestions,
            completedAt: new Date(),
            answers: questions.map((q, index) => ({
              questionIndex: index,
              correct: newAnswers[index] === q.correctAnswer,
              userAnswer: newAnswers[index],
              correctAnswer: q.correctAnswer,
            })),
          };

          saveQuizResult(result);
          markCompleted(moduleNumber, score);

          if (onComplete) {
            onComplete(score);
          }
        }
      }, 500);
    },
    [
      hasAnswered,
      selectedAnswers,
      currentQuestionIndex,
      totalQuestions,
      questions,
      moduleNumber,
      markCompleted,
      onComplete,
    ]
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setHasAnswered(false);
    } else {
      setShowResults(true);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setHasAnswered(false);
  }, []);

  const calculateScore = useCallback(() => {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    return Math.round((correctCount / totalQuestions) * 100);
  }, [selectedAnswers, questions, totalQuestions]);

  if (showResults) {
    const score = calculateScore();
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;

    return (
      <div className={cn('space-y-6', className)}>
        {/* Results Header */}
        <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Quiz Completato!
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Punteggio: <span className="font-bold text-purple-600 dark:text-purple-400">{score}%</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hai risposto correttamente a {correctCount} domande su {totalQuestions}
          </p>
        </div>

        {/* Review Answers */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Rivedi le tue risposte:</h4>
          {questions.map((question, qIndex) => {
            const userAnswer = selectedAnswers[qIndex];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={qIndex}
                className={cn(
                  'p-4 rounded-lg border-2',
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium text-gray-900 dark:text-gray-100">{question.question}</p>
                </div>

                <div className="ml-8 space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">La tua risposta:</span> {question.options[userAnswer]}
                  </p>
                  {!isCorrect && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Risposta corretta:</span>{' '}
                      {question.options[question.correctAnswer]}
                    </p>
                  )}
                  {question.explanation && (
                    <p className="text-gray-600 dark:text-gray-400 italic">{question.explanation}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Rifai il Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Domanda {currentQuestionIndex + 1} di {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showFeedback = hasAnswered;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={hasAnswered}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
                  'hover:border-purple-400 dark:hover:border-purple-500',
                  !hasAnswered && 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
                  isSelected &&
                    !showFeedback &&
                    'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20',
                  showFeedback &&
                    isSelected &&
                    isCorrect &&
                    'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20',
                  showFeedback &&
                    isSelected &&
                    !isCorrect &&
                    'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20',
                  showFeedback &&
                    !isSelected &&
                    isCorrect &&
                    'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20',
                  !isSelected && !showFeedback && 'border-gray-200 dark:border-gray-700'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      isSelected && !showFeedback && 'border-purple-500 dark:border-purple-400',
                      showFeedback && isSelected && isCorrect && 'border-green-500 dark:border-green-400',
                      showFeedback && isSelected && !isCorrect && 'border-red-500 dark:border-red-400',
                      showFeedback && !isSelected && isCorrect && 'border-green-500 dark:border-green-400',
                      !isSelected && !showFeedback && 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-gray-100">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {hasAnswered && currentQuestion.explanation && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-semibold">💡 Spiegazione:</span> {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {hasAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Prossima Domanda' : 'Vedi Risultati'}
          </button>
        </div>
      )}
    </div>
  );
}
