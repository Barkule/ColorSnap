export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-100 %
  l: number; // 0-100 %
}

export interface HsvColor {
  h: number; // 0-360
  s: number; // 0-100 %
  v: number; // 0-100 %
}

export interface ContrastMetrics {
  ratioAgainstWhite: number;
  ratioAgainstBlack: number;
  verdictAgainstWhite: 'AAA' | 'AA' | 'Fail';
  verdictAgainstBlack: 'AAA' | 'AA' | 'Fail';
  recommendedText: 'white' | 'black';
}

export interface SelectedColor {
  hex: string; // e.g. "#E8E1D7"
  rgb: RgbColor;
  hsl: HslColor;
  hsv: HsvColor;
  name: string;
  timestamp?: number;
}

export interface ColorHistoryItem {
  id: string;
  hex: string;
  name: string;
  timestamp: number;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}
