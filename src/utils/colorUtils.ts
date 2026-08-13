import type { RgbColor, HslColor, HsvColor, ContrastMetrics, SelectedColor } from '../types/color';
import { LOCAL_COLOR_DATASET } from './colorDataset';

/**
 * Normalizes and converts HEX string to RGB object
 */
export function hexToRgb(hex: string): RgbColor {
  let cleanHex = hex.replace(/^#/, '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return { r: 0, g: 0, b: 0 };
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB numbers to uppercase 6-character HEX string (#RRGGBB)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const cr = clamp(r);
  const cg = clamp(g);
  const cb = clamp(b);
  return `#${((1 << 24) + (cr << 16) + (cg << 8) + cb).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Converts RGB to HSL (Hue: 0-360, Saturation: 0-100%, Lightness: 0-100%)
 */
export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rNorm = Math.max(0, Math.min(255, r)) / 255;
  const gNorm = Math.max(0, Math.min(255, g)) / 255;
  const bNorm = Math.max(0, Math.min(255, b)) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts RGB to HSV/HSB (Hue: 0-360, Saturation: 0-100%, Value: 0-100%)
 */
export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  const rNorm = Math.max(0, Math.min(255, r)) / 255;
  const gNorm = Math.max(0, Math.min(255, g)) / 255;
  const bNorm = Math.max(0, Math.min(255, b)) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  const s = max === 0 ? 0 : delta / max;
  const v = max;

  if (delta !== 0) {
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

/**
 * Calculates WCAG 2.1 relative luminance for an RGB color
 */
export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    const val = v / 255;
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates WCAG contrast ratio between two HEX colors
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Evaluates contrast ratios and WCAG AA/AAA verdicts against black and white
 */
export function getContrastMetrics(hex: string): ContrastMetrics {
  const ratioWhite = getContrastRatio(hex, '#FFFFFF');
  const ratioBlack = getContrastRatio(hex, '#000000');

  const getVerdict = (ratio: number): 'AAA' | 'AA' | 'Fail' => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  };

  return {
    ratioAgainstWhite: Number(ratioWhite.toFixed(2)),
    ratioAgainstBlack: Number(ratioBlack.toFixed(2)),
    verdictAgainstWhite: getVerdict(ratioWhite),
    verdictAgainstBlack: getVerdict(ratioBlack),
    recommendedText: ratioWhite > ratioBlack ? 'white' : 'black',
  };
}

/**
 * Finds the closest color name 100% locally from dataset using Euclidean distance
 */
export function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  let minDistance = Infinity;
  let closestName = 'Unknown Color';

  for (const item of LOCAL_COLOR_DATASET) {
    const dR = rgb.r - item.r;
    const dG = rgb.g - item.g;
    const dB = rgb.b - item.b;
    const distance = Math.sqrt(dR * dR + dG * dG + dB * dB);

    if (distance < minDistance) {
      minDistance = distance;
      closestName = item.name;
    }
  }

  return closestName;
}

/**
 * Creates full SelectedColor object from a HEX string
 */
export function buildSelectedColor(hex: string): SelectedColor {
  const cleanHex = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  const rgb = hexToRgb(cleanHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const name = getColorName(cleanHex);

  return {
    hex: cleanHex,
    rgb,
    hsl,
    hsv,
    name,
    timestamp: Date.now(),
  };
}

/**
 * Generates CSS Variables representation
 */
export function getCssVariableString(color: SelectedColor): string {
  return `:root {\n  --color-hex: ${color.hex};\n  --color-rgb: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b};\n  --color-hsl: ${color.hsl.h}deg ${color.hsl.s}% ${color.hsl.l}%;\n}`;
}

/**
 * Generates Tailwind CSS config representation
 */
export function getTailwindConfigString(color: SelectedColor): string {
  const safeName = color.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${safeName}': '${color.hex}',\n      }\n    }\n  }\n}`;
}
