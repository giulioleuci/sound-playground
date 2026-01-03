/**
 * Canvas Utilities - Funzioni centralizzate per gestione Canvas
 * Elimina duplicazione setup DPI e rendering
 */

/**
 * Risultato del setup canvas con DPI scaling
 */
export interface CanvasContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
}

/**
 * Setup canvas con DPI scaling per display Retina
 * @param canvas - Elemento HTMLCanvasElement
 * @returns Oggetto con context, dimensioni e DPR
 */
export function setupCanvasDPI(canvas: HTMLCanvasElement): CanvasContext {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Impossibile ottenere context 2D dal canvas');
  }

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // Set dimensioni canvas con DPI scaling
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  // Scale context per DPI
  ctx.scale(dpr, dpr);

  return {
    ctx,
    width: rect.width,
    height: rect.height,
    dpr,
  };
}

/**
 * Pulisce completamente un canvas
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza logica
 * @param height - Altezza logica
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Disegna una griglia sul canvas
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param gridSize - Dimensione celle griglia
 * @param color - Colore linee
 * @param opacity - Opacità linee (0-1)
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number = 20,
  color: string = '#ddd',
  opacity: number = 0.3
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;
  ctx.lineWidth = 1;

  // Linee verticali
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Linee orizzontali
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Disegna assi cartesiani (X e Y)
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param color - Colore assi
 * @param lineWidth - Spessore linee
 */
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string = '#666',
  lineWidth: number = 2
): void {
  const centerY = height / 2;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // Asse X
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();

  // Asse Y (opzionale, al centro)
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  ctx.restore();
}

/**
 * Disegna onda sinusoidale
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param frequency - Frequenza (numero di cicli visibili)
 * @param amplitude - Ampiezza (0-1, frazione dell'altezza)
 * @param phase - Fase iniziale (per animazione)
 * @param color - Colore linea
 * @param lineWidth - Spessore linea
 */
export function drawSineWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frequency: number = 2,
  amplitude: number = 0.3,
  phase: number = 0,
  color: string = '#8b5cf6',
  lineWidth: number = 3
): void {
  const centerY = height / 2;
  const waveAmplitude = amplitude * (height / 2);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;

  ctx.beginPath();

  for (let x = 0; x <= width; x++) {
    const y = centerY + Math.sin((x / width) * Math.PI * 2 * frequency + phase) * waveAmplitude;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Disegna onda quadra
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param frequency - Frequenza (numero di cicli)
 * @param amplitude - Ampiezza (0-1)
 * @param phase - Fase iniziale
 * @param color - Colore
 * @param lineWidth - Spessore
 */
export function drawSquareWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frequency: number = 2,
  amplitude: number = 0.3,
  phase: number = 0,
  color: string = '#8b5cf6',
  lineWidth: number = 3
): void {
  const centerY = height / 2;
  const waveAmplitude = amplitude * (height / 2);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();

  for (let x = 0; x <= width; x++) {
    const sineValue = Math.sin((x / width) * Math.PI * 2 * frequency + phase);
    const y = centerY + (sineValue >= 0 ? waveAmplitude : -waveAmplitude);

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Disegna onda a dente di sega (sawtooth)
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param frequency - Frequenza
 * @param amplitude - Ampiezza (0-1)
 * @param phase - Fase
 * @param color - Colore
 * @param lineWidth - Spessore
 */
export function drawSawtoothWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frequency: number = 2,
  amplitude: number = 0.3,
  phase: number = 0,
  color: string = '#8b5cf6',
  lineWidth: number = 3
): void {
  const centerY = height / 2;
  const waveAmplitude = amplitude * (height / 2);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();

  for (let x = 0; x <= width; x++) {
    const t = ((x / width) * frequency + phase / (Math.PI * 2)) % 1;
    const y = centerY + (2 * t - 1) * waveAmplitude;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Disegna onda triangolare
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param frequency - Frequenza
 * @param amplitude - Ampiezza (0-1)
 * @param phase - Fase
 * @param color - Colore
 * @param lineWidth - Spessore
 */
export function drawTriangleWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frequency: number = 2,
  amplitude: number = 0.3,
  phase: number = 0,
  color: string = '#8b5cf6',
  lineWidth: number = 3
): void {
  const centerY = height / 2;
  const waveAmplitude = amplitude * (height / 2);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  ctx.beginPath();

  for (let x = 0; x <= width; x++) {
    const t = ((x / width) * frequency + phase / (Math.PI * 2)) % 1;
    const y = centerY + (2 * Math.abs(2 * t - 1) - 1) * waveAmplitude;

    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Disegna onda generica (dispatcher per tipo)
 * @param ctx - CanvasRenderingContext2D
 * @param width - Larghezza
 * @param height - Altezza
 * @param waveType - Tipo di onda
 * @param frequency - Frequenza
 * @param amplitude - Ampiezza (0-1)
 * @param phase - Fase
 * @param color - Colore
 * @param lineWidth - Spessore
 */
export function drawWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  waveType: OscillatorType = 'sine',
  frequency: number = 2,
  amplitude: number = 0.3,
  phase: number = 0,
  color: string = '#8b5cf6',
  lineWidth: number = 3
): void {
  switch (waveType) {
    case 'sine':
      drawSineWave(ctx, width, height, frequency, amplitude, phase, color, lineWidth);
      break;
    case 'square':
      drawSquareWave(ctx, width, height, frequency, amplitude, phase, color, lineWidth);
      break;
    case 'sawtooth':
      drawSawtoothWave(ctx, width, height, frequency, amplitude, phase, color, lineWidth);
      break;
    case 'triangle':
      drawTriangleWave(ctx, width, height, frequency, amplitude, phase, color, lineWidth);
      break;
    default:
      drawSineWave(ctx, width, height, frequency, amplitude, phase, color, lineWidth);
  }
}

/**
 * Utility per throttling di funzioni (utile per resize events)
 * @param func - Funzione da eseguire
 * @param delay - Delay in millisecondi
 * @returns Funzione throttled
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExec = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    const execute = () => {
      lastExec = now;
      func.apply(this, args);
    };

    if (now - lastExec > delay) {
      execute();
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(execute, delay);
    }
  };
}

/**
 * Utility per debouncing di funzioni
 * @param func - Funzione da eseguire
 * @param delay - Delay in millisecondi
 * @returns Funzione debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
