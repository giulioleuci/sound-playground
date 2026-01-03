/**
 * Audio Utilities - Funzioni centralizzate per Web Audio API
 * Elimina duplicazione di codice audio nei moduli
 */

/**
 * Singleton AudioContext condiviso per tutta l'applicazione
 * Evita di creare multipli context e memory leaks
 */
let sharedAudioContext: AudioContext | null = null;

/**
 * Ottieni o crea l'AudioContext condiviso
 * @returns AudioContext singleton
 * @throws Error se AudioContext non è supportato
 */
export function getAudioContext(): AudioContext {
  try {
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API non supportata in questo browser');
      }
      sharedAudioContext = new AudioContextClass();
    }

    // Resume context se sospeso (browser auto-suspend policy)
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(err => {
        console.warn('Impossibile riprendere AudioContext:', err);
      });
    }

    return sharedAudioContext;
  } catch (error) {
    console.error('Errore creazione AudioContext:', error);
    throw new Error('Impossibile inizializzare il sistema audio');
  }
}

/**
 * Interfaccia per risultato creazione oscillatore
 */
export interface OscillatorNodes {
  oscillator: OscillatorNode;
  gainNode: GainNode;
}

/**
 * Crea e avvia un oscillatore con gain node
 * @param frequency - Frequenza in Hz
 * @param amplitude - Ampiezza (volume) 0-1
 * @param waveType - Tipo di onda ('sine', 'square', 'triangle', 'sawtooth')
 * @param duration - Durata opzionale in secondi (se specificata, oscillatore si ferma automaticamente)
 * @returns Oggetto con oscillator e gainNode
 */
export function createOscillator(
  frequency: number,
  amplitude: number = 0.3,
  waveType: OscillatorType = 'sine',
  duration?: number
): OscillatorNodes {
  try {
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);

    if (duration) {
      oscillator.stop(ctx.currentTime + duration);
    }

    return { oscillator, gainNode };
  } catch (error) {
    console.error('Errore creazione oscillatore:', error);
    throw error;
  }
}

/**
 * Suona una nota singola con fade out
 * @param frequency - Frequenza in Hz
 * @param duration - Durata in secondi
 * @param amplitude - Ampiezza iniziale 0-1
 * @param waveType - Tipo di onda
 */
export function playNote(
  frequency: number,
  duration: number = 0.5,
  amplitude: number = 0.3,
  waveType: OscillatorType = 'sine'
): void {
  try {
    const ctx = getAudioContext();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Fade out esponenziale
    gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error('Errore riproduzione nota:', error);
  }
}

/**
 * Ferma e disconnette in modo sicuro un oscillatore
 * @param nodes - Oggetto con oscillator e gainNode
 */
export function stopOscillator(nodes: OscillatorNodes | null): void {
  if (!nodes) return;

  try {
    if (nodes.oscillator) {
      try {
        nodes.oscillator.stop();
      } catch (e) {
        // Oscillatore già fermato, ignora errore
      }
      nodes.oscillator.disconnect();
    }

    if (nodes.gainNode) {
      nodes.gainNode.disconnect();
    }
  } catch (error) {
    console.error('Errore stop oscillatore:', error);
  }
}

/**
 * Ferma e disconnette multipli oscillatori
 * @param nodesList - Array di OscillatorNodes
 */
export function stopMultipleOscillators(nodesList: (OscillatorNodes | null)[]): void {
  nodesList.forEach(nodes => stopOscillator(nodes));
}

/**
 * Suona un accordo (multiple frequenze simultanee)
 * @param frequencies - Array di frequenze in Hz
 * @param duration - Durata in secondi
 * @param amplitude - Ampiezza per ogni oscillatore
 * @param waveType - Tipo di onda
 * @returns Array di nodi creati
 */
export function playChord(
  frequencies: number[],
  duration: number = 1.0,
  amplitude: number = 0.2,
  waveType: OscillatorType = 'sine'
): OscillatorNodes[] {
  try {
    // Amplitude divisa per numero di note per evitare clipping
    const adjustedAmplitude = amplitude / Math.sqrt(frequencies.length);

    return frequencies.map(freq =>
      createOscillator(freq, adjustedAmplitude, waveType, duration)
    );
  } catch (error) {
    console.error('Errore riproduzione accordo:', error);
    return [];
  }
}

/**
 * Crea un effetto di fade in/out su un gain node
 * @param gainNode - Il GainNode da modulare
 * @param startValue - Valore iniziale
 * @param endValue - Valore finale
 * @param duration - Durata in secondi
 */
export function fadeGain(
  gainNode: GainNode,
  startValue: number,
  endValue: number,
  duration: number
): void {
  try {
    const ctx = getAudioContext();
    gainNode.gain.setValueAtTime(startValue, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(endValue, ctx.currentTime + duration);
  } catch (error) {
    console.error('Errore fade gain:', error);
  }
}

/**
 * Crea un delay node (eco/ritardo)
 * @param delayTime - Tempo di delay in secondi
 * @param feedback - Quantità di feedback (0-1)
 * @returns Delay node configurato
 */
export function createDelay(delayTime: number = 0.3, feedback: number = 0.5): DelayNode {
  const ctx = getAudioContext();
  const delay = ctx.createDelay();
  const feedbackGain = ctx.createGain();

  delay.delayTime.value = delayTime;
  feedbackGain.gain.value = feedback;

  delay.connect(feedbackGain);
  feedbackGain.connect(delay);

  return delay;
}

/**
 * Crea un filtro passa-basso (low-pass filter)
 * @param frequency - Frequenza di taglio in Hz
 * @param q - Qualità del filtro (resonance)
 * @returns BiquadFilterNode configurato
 */
export function createLowPassFilter(frequency: number = 1000, q: number = 1): BiquadFilterNode {
  const ctx = getAudioContext();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.value = frequency;
  filter.Q.value = q;

  return filter;
}

/**
 * Crea un semplice riverbero usando ConvolverNode
 * (Usa impulse response sintetico)
 * @param duration - Durata del riverbero in secondi
 * @param decay - Velocità di decadimento
 * @returns ConvolverNode con impulse response
 */
export function createReverb(duration: number = 2, decay: number = 2): ConvolverNode {
  const ctx = getAudioContext();
  const convolver = ctx.createConvolver();

  // Crea impulse response buffer
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }

  convolver.buffer = impulse;
  return convolver;
}

/**
 * Costanti musicali utili
 */
export const MUSICAL_CONSTANTS = {
  A4: 440, // La standard (440 Hz)
  C4: 261.63, // Do centrale
  SEMITONE_RATIO: Math.pow(2, 1/12), // Rapporto tra semitoni in equal temperament
  OCTAVE_RATIO: 2, // Rapporto tra ottave
  FIFTH_RATIO_PYTHAGOREAN: 3/2, // Quinta giusta Pitagorica
  THIRD_MAJOR_RATIO: 5/4, // Terza maggiore pura
  THIRD_MINOR_RATIO: 6/5, // Terza minore pura
};

/**
 * Converte numero di nota MIDI in frequenza
 * @param midiNote - Numero nota MIDI (0-127, A4 = 69)
 * @returns Frequenza in Hz
 */
export function midiToFrequency(midiNote: number): number {
  return MUSICAL_CONSTANTS.A4 * Math.pow(2, (midiNote - 69) / 12);
}

/**
 * Converte frequenza in numero di nota MIDI
 * @param frequency - Frequenza in Hz
 * @returns Numero nota MIDI
 */
export function frequencyToMidi(frequency: number): number {
  return Math.round(69 + 12 * Math.log2(frequency / MUSICAL_CONSTANTS.A4));
}

/**
 * Calcola frequenza di una nota nella scala Pitagorica
 * @param baseFrequency - Frequenza base
 * @param fifths - Numero di quinte (positivo o negativo)
 * @returns Frequenza calcolata
 */
export function pythagoreanTuning(baseFrequency: number, fifths: number): number {
  let frequency = baseFrequency;
  const ratio = MUSICAL_CONSTANTS.FIFTH_RATIO_PYTHAGOREAN;

  for (let i = 0; i < Math.abs(fifths); i++) {
    frequency *= fifths > 0 ? ratio : 1 / ratio;
  }

  // Riporta nell'ottava base
  while (frequency > baseFrequency * 2) frequency /= 2;
  while (frequency < baseFrequency) frequency *= 2;

  return frequency;
}

/**
 * Calcola la frequenza di battimento tra due frequenze
 * @param freq1 - Prima frequenza
 * @param freq2 - Seconda frequenza
 * @returns Frequenza di battimento (differenza assoluta)
 */
export function calculateBeatFrequency(freq1: number, freq2: number): number {
  return Math.abs(freq1 - freq2);
}
