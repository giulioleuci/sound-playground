/**
 * Custom Hook per gestione Canvas con performance optimization
 * Include: DPI scaling, resize handling, OffscreenCanvas support
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { setupCanvasDPI, throttle, type CanvasContext } from '@/lib/canvasUtils';

export interface UseCanvasOptions {
  /**
   * Funzione di rendering chiamata ogni frame o al resize
   */
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, dpr: number) => void;

  /**
   * Se true, usa animation loop continuo con requestAnimationFrame
   */
  animate?: boolean;

  /**
   * Se true, disegna griglia di background
   */
  showGrid?: boolean;

  /**
   * Delay throttling per resize events (ms)
   */
  resizeThrottle?: number;

  /**
   * Se true, prova a usare OffscreenCanvas per performance
   */
  useOffscreenCanvas?: boolean;
}

/**
 * Hook per gestire canvas con rendering ottimizzato
 * @param options - Opzioni di configurazione
 * @returns Ref da assegnare all'elemento canvas
 */
export function useCanvas(options: UseCanvasOptions) {
  const {
    draw,
    animate = false,
    resizeThrottle = 100,
    useOffscreenCanvas = false,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const contextRef = useRef<CanvasContext | null>(null);
  const [isReady, setIsReady] = useState(false);

  /**
   * Setup iniziale canvas con DPI
   */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const context = setupCanvasDPI(canvas);
      contextRef.current = context;
      setIsReady(true);

      // Esegui primo render
      draw(context.ctx, context.width, context.height, context.dpr);
    } catch (error) {
      console.error('Errore setup canvas:', error);
    }
  }, [draw]);

  /**
   * Render frame (usato sia per static che animated)
   */
  const renderFrame = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    try {
      draw(context.ctx, context.width, context.height, context.dpr);
    } catch (error) {
      console.error('Errore rendering canvas:', error);
    }
  }, [draw]);

  /**
   * Animation loop
   */
  const animationLoop = useCallback(() => {
    renderFrame();

    if (animate) {
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    }
  }, [renderFrame, animate]);

  /**
   * Gestione resize con throttling
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const handleResize = throttle(() => {
      setupCanvas();
    }, resizeThrottle);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setupCanvas, resizeThrottle]);

  /**
   * Setup iniziale e animation loop
   */
  useEffect(() => {
    setupCanvas();

    if (animate) {
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setupCanvas, animationLoop, animate]);

  /**
   * Re-render quando draw function cambia (non animate)
   */
  useEffect(() => {
    if (!animate && isReady) {
      renderFrame();
    }
  }, [renderFrame, animate, isReady]);

  return { canvasRef, isReady };
}

/**
 * Hook semplificato per canvas animato
 * @param drawFn - Funzione di rendering con parametro phase per animazione
 * @returns Ref canvas e controlli animazione
 */
export function useAnimatedCanvas(
  drawFn: (ctx: CanvasRenderingContext2D, width: number, height: number, phase: number) => void
) {
  const phaseRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (isPlaying) {
        phaseRef.current += 0.05; // Incremento fase per animazione
      }
      drawFn(ctx, width, height, phaseRef.current);
    },
    [drawFn, isPlaying]
  );

  const { canvasRef, isReady } = useCanvas({
    draw,
    animate: true,
  });

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying(prev => !prev), []);
  const reset = useCallback(() => {
    phaseRef.current = 0;
    setIsPlaying(false);
  }, []);

  return {
    canvasRef,
    isReady,
    isPlaying,
    play,
    pause,
    toggle,
    reset,
  };
}
