/**
 * Error Boundary Component
 * Cattura errori React e mostra UI di fallback invece di crash completo
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary per catturare errori nei componenti figli
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log errore (in produzione, invia a servizio monitoring)
    console.error('ErrorBoundary caught error:', error, errorInfo);

    this.setState({
      errorInfo,
    });

    // Callback opzionale per logging personalizzato
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Usa fallback personalizzato se fornito
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI di fallback default
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Oops! Qualcosa è andato storto
                </h1>
                <p className="text-gray-600">
                  Si è verificato un errore inaspettato
                </p>
              </div>
            </div>

            {/* Dettagli errore (solo in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
                <p className="font-mono text-sm text-red-700 mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-700 font-semibold">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-64 p-2 bg-white rounded border border-gray-200">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Messaggio user-friendly */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed">
                L'applicazione ha incontrato un errore durante il rendering. Questo può
                accadere se:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Il browser non supporta Web Audio API</li>
                <li>Si è verificato un problema di connessione</li>
                <li>C'è un bug temporaneo nel codice</li>
              </ul>
            </div>

            {/* Azioni */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Riprova
              </button>

              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <Home className="w-5 h-5" />
                Torna alla Home
              </Link>
            </div>

            {/* Info supporto browser */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Se il problema persiste, prova ad aggiornare il browser o utilizzare
                un browser moderno come Chrome, Firefox, Safari o Edge.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error Boundary semplificato per moduli singoli
 */
export function ModuleErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Errore nel modulo
            </h2>
            <p className="text-gray-600 mb-4">
              Impossibile caricare questo modulo
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Torna alla Home
            </Link>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
