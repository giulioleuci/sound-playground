/**
 * Unit Tests per calcoli musicali
 */

import { describe, it, expect } from 'vitest';
import {
  midiToFrequency,
  frequencyToMidi,
  pythagoreanTuning,
  calculateBeatFrequency,
  MUSICAL_CONSTANTS,
} from './audioUtils';

describe('audioUtils - Musical Calculations', () => {
  describe('midiToFrequency', () => {
    it('should convert A4 (MIDI 69) to 440 Hz', () => {
      expect(midiToFrequency(69)).toBeCloseTo(440, 1);
    });

    it('should convert C4 (MIDI 60) to 261.63 Hz', () => {
      expect(midiToFrequency(60)).toBeCloseTo(261.63, 1);
    });

    it('should have octave ratio of 2:1', () => {
      const c4 = midiToFrequency(60);
      const c5 = midiToFrequency(72);
      expect(c5 / c4).toBeCloseTo(2, 2);
    });

    it('should have semitone ratio of 2^(1/12)', () => {
      const c4 = midiToFrequency(60);
      const cSharp4 = midiToFrequency(61);
      expect(cSharp4 / c4).toBeCloseTo(Math.pow(2, 1 / 12), 4);
    });
  });

  describe('frequencyToMidi', () => {
    it('should convert 440 Hz to MIDI 69 (A4)', () => {
      expect(frequencyToMidi(440)).toBe(69);
    });

    it('should convert 261.63 Hz to MIDI 60 (C4)', () => {
      expect(frequencyToMidi(261.63)).toBe(60);
    });

    it('should be inverse of midiToFrequency', () => {
      for (let midi = 21; midi <= 108; midi++) {
        const freq = midiToFrequency(midi);
        expect(frequencyToMidi(freq)).toBe(midi);
      }
    });
  });

  describe('pythagoreanTuning', () => {
    it('should calculate perfect fifth (3:2 ratio)', () => {
      const baseFreq = 100;
      const fifth = pythagoreanTuning(baseFreq, 1);
      // After octave normalization, should be 150 Hz
      expect(fifth).toBeCloseTo(150, 1);
    });

    it('should calculate fifth down (2:3 ratio)', () => {
      const baseFreq = 150;
      const fifthDown = pythagoreanTuning(baseFreq, -1);
      expect(fifthDown).toBeCloseTo(100, 1);
    });

    it('should accumulate 12 fifths to create Pythagorean comma', () => {
      const baseFreq = 261.63; // C4
      let freq = baseFreq;

      // 12 fifths up, reducing by octaves
      for (let i = 0; i < 12; i++) {
        freq = pythagoreanTuning(freq, 1);
      }

      // Should be slightly higher than 7 octaves (Pythagorean comma)
      const sevenOctaves = baseFreq * Math.pow(2, 7);
      expect(freq).toBeGreaterThan(sevenOctaves);

      // Comma should be about 23.5 cents
      const ratio = freq / sevenOctaves;
      const cents = 1200 * Math.log2(ratio);
      expect(cents).toBeCloseTo(23.5, 0);
    });
  });

  describe('calculateBeatFrequency', () => {
    it('should calculate beat frequency as absolute difference', () => {
      expect(calculateBeatFrequency(440, 442)).toBe(2);
      expect(calculateBeatFrequency(442, 440)).toBe(2);
    });

    it('should return 0 for identical frequencies', () => {
      expect(calculateBeatFrequency(440, 440)).toBe(0);
    });

    it('should work with decimal frequencies', () => {
      expect(calculateBeatFrequency(440.5, 438.3)).toBeCloseTo(2.2, 1);
    });
  });

  describe('MUSICAL_CONSTANTS', () => {
    it('should have A4 = 440 Hz', () => {
      expect(MUSICAL_CONSTANTS.A4).toBe(440);
    });

    it('should have correct octave ratio', () => {
      expect(MUSICAL_CONSTANTS.OCTAVE_RATIO).toBe(2);
    });

    it('should have correct fifth ratio (Pythagorean)', () => {
      expect(MUSICAL_CONSTANTS.FIFTH_RATIO_PYTHAGOREAN).toBe(3 / 2);
      expect(MUSICAL_CONSTANTS.FIFTH_RATIO_PYTHAGOREAN).toBeCloseTo(1.5, 10);
    });

    it('should have correct semitone ratio (equal temperament)', () => {
      expect(MUSICAL_CONSTANTS.SEMITONE_RATIO).toBeCloseTo(Math.pow(2, 1 / 12), 10);
      expect(MUSICAL_CONSTANTS.SEMITONE_RATIO).toBeCloseTo(1.059463, 5);
    });

    it('should have 12 semitones equal an octave', () => {
      const octaveFromSemitones = Math.pow(MUSICAL_CONSTANTS.SEMITONE_RATIO, 12);
      expect(octaveFromSemitones).toBeCloseTo(2, 10);
    });

    it('should have correct major third ratio (just intonation)', () => {
      expect(MUSICAL_CONSTANTS.THIRD_MAJOR_RATIO).toBe(5 / 4);
      expect(MUSICAL_CONSTANTS.THIRD_MAJOR_RATIO).toBe(1.25);
    });

    it('should have correct minor third ratio (just intonation)', () => {
      expect(MUSICAL_CONSTANTS.THIRD_MINOR_RATIO).toBe(6 / 5);
      expect(MUSICAL_CONSTANTS.THIRD_MINOR_RATIO).toBe(1.2);
    });
  });

  describe('Equal Temperament vs Just Intonation', () => {
    it('equal temperament fifth should differ from just fifth', () => {
      const equalFifth = Math.pow(MUSICAL_CONSTANTS.SEMITONE_RATIO, 7); // 7 semitoni
      const justFifth = MUSICAL_CONSTANTS.FIFTH_RATIO_PYTHAGOREAN;

      // Differenza ~2 cents
      const cents = 1200 * Math.log2(equalFifth / justFifth);
      expect(Math.abs(cents)).toBeLessThan(3);
      expect(equalFifth).not.toBe(justFifth);
    });

    it('equal temperament major third should differ from just third', () => {
      const equalThird = Math.pow(MUSICAL_CONSTANTS.SEMITONE_RATIO, 4); // 4 semitoni
      const justThird = MUSICAL_CONSTANTS.THIRD_MAJOR_RATIO;

      // Differenza ~14 cents (ben percepibile!)
      const cents = 1200 * Math.log2(equalThird / justThird);
      expect(Math.abs(cents)).toBeGreaterThan(10);
      expect(Math.abs(cents)).toBeLessThan(15);
    });
  });
});
