import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  getContrastRatio,
  getContrastMetrics,
  getColorName,
  buildSelectedColor,
} from './colorUtils';

describe('colorUtils', () => {
  describe('hexToRgb', () => {
    it('converts standard 6-character hex correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#E8E1D7')).toEqual({ r: 232, g: 225, b: 215 });
    });

    it('converts shorthand 3-character hex correctly', () => {
      expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('handles hex strings without # and case insensitivity', () => {
      expect(hexToRgb('e8e1d7')).toEqual({ r: 232, g: 225, b: 215 });
    });

    it('returns 0,0,0 for invalid hex values', () => {
      expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB numbers to uppercase hex string', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
      expect(rgbToHex(232, 225, 215)).toBe('#E8E1D7');
    });

    it('clamps out of bound values', () => {
      expect(rgbToHex(300, -20, 128)).toBe('#FF0080');
    });
  });

  describe('rgbToHsl', () => {
    it('converts primary colors correctly', () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
      expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
      expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
    });

    it('converts achromatic grays correctly', () => {
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
      expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
    });

    it('converts sample warm color #E8E1D7', () => {
      const hsl = rgbToHsl(232, 225, 215);
      expect(hsl.h).toBe(35);
      expect(hsl.s).toBe(27);
      expect(hsl.l).toBe(88);
    });
  });

  describe('rgbToHsv', () => {
    it('converts primary colors correctly', () => {
      expect(rgbToHsv(255, 0, 0)).toEqual({ h: 0, s: 100, v: 100 });
      expect(rgbToHsv(0, 255, 0)).toEqual({ h: 120, s: 100, v: 100 });
      expect(rgbToHsv(0, 0, 255)).toEqual({ h: 240, s: 100, v: 100 });
    });

    it('converts achromatic colors', () => {
      expect(rgbToHsv(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
      expect(rgbToHsv(255, 255, 255)).toEqual({ h: 0, s: 0, v: 100 });
    });
  });

  describe('contrast & WCAG calculation', () => {
    it('calculates max contrast between black and white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(Number(ratio.toFixed(1))).toBe(21.0);
    });

    it('calculates min contrast for identical colors', () => {
      const ratio = getContrastRatio('#E8E1D7', '#E8E1D7');
      expect(Number(ratio.toFixed(1))).toBe(1.0);
    });

    it('provides correct WCAG metrics for dark and light text recommendations', () => {
      const darkMetrics = getContrastMetrics('#000000');
      expect(darkMetrics.recommendedText).toBe('white');
      expect(darkMetrics.verdictAgainstWhite).toBe('AAA');

      const lightMetrics = getContrastMetrics('#FFFFFF');
      expect(lightMetrics.recommendedText).toBe('black');
      expect(lightMetrics.verdictAgainstBlack).toBe('AAA');
    });
  });

  describe('getColorName local dataset lookup', () => {
    it('returns exact match for pure black and white', () => {
      expect(getColorName('#000000')).toBe('Black');
      expect(getColorName('#FFFFFF')).toBe('White');
      expect(getColorName('#FF0000')).toBe('Red');
    });

    it('finds closest matching name for custom hex values', () => {
      const name = getColorName('#E8E1D7');
      expect(['Warm Cream', 'Almond', 'Linen', 'Ivory']).toContain(name);
    });
  });

  describe('buildSelectedColor', () => {
    it('returns complete color structure', () => {
      const result = buildSelectedColor('#3A86FF');
      expect(result.hex).toBe('#3A86FF');
      expect(result.rgb.r).toBe(58);
      expect(result.rgb.g).toBe(134);
      expect(result.rgb.b).toBe(255);
      expect(result.name).toBeDefined();
    });
  });
});
