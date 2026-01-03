import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Eager load Index for faster initial render
import Index from './pages/Index';

// Lazy load all modules for code splitting
const Module1 = lazy(() => import('./pages/Module1'));
const Module2 = lazy(() => import('./pages/Module2'));
const Module3 = lazy(() => import('./pages/Module3'));
const Module4 = lazy(() => import('./pages/Module4'));
const Module5 = lazy(() => import('./pages/Module5'));
const Module6 = lazy(() => import('./pages/Module6'));
const Module7 = lazy(() => import('./pages/Module7'));
const Module8 = lazy(() => import('./pages/Module8'));
const Module9 = lazy(() => import('./pages/Module9'));
const Module10 = lazy(() => import('./pages/Module10'));
const Module11 = lazy(() => import('./pages/Module11'));
const Module12 = lazy(() => import('./pages/Module12'));
const Module13 = lazy(() => import('./pages/Module13'));
const Module14 = lazy(() => import('./pages/Module14'));
const Glossario = lazy(() => import('./pages/Glossario'));
const Sfida = lazy(() => import('./pages/Sfida'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-700 dark:text-gray-300 font-semibold">Caricamento...</p>
      </div>
    </div>
  );
}

// Inner app with keyboard shortcuts
function AppContent() {
  useKeyboardShortcuts();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/modulo-1"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module1 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-2"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module2 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-3"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module3 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-4"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module4 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-5"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module5 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-6"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module6 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-7"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module7 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-8"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module8 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-9"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module9 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-10"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module10 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-11"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module11 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-12"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module12 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-13"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module13 />
            </Suspense>
          }
        />
        <Route
          path="/modulo-14"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module14 />
            </Suspense>
          }
        />
        <Route
          path="/glossario"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Glossario />
            </Suspense>
          }
        />
        <Route
          path="/sfida"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Sfida />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
}

const basename = import.meta.env.BASE_URL || '/';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
