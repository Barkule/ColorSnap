import type { ImageValidationResult } from '../types/color';
import { rgbToHex } from './colorUtils';

const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Validates uploaded image file type and size limits
 */
export function validateImageFile(file: File): ImageValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const isValidType = ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase()) ||
    /\.(png|jpe?g|webp|svg)$/i.test(file.name);

  if (!isValidType) {
    return {
      valid: false,
      error: 'Please upload a valid image file (PNG, JPG, WebP, or SVG).',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds 25MB limit. Please upload a smaller image.',
    };
  }

  return { valid: true };
}

/**
 * Reads a File into an HTMLImageElement asynchronously
 */
export function readImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image element.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Maps display coordinate clicks to original full-resolution image pixel values
 */
export function sampleCanvasPixel(
  ctx: CanvasRenderingContext2D,
  displayedWidth: number,
  displayedHeight: number,
  originalWidth: number,
  originalHeight: number,
  clickX: number,
  clickY: number
): { r: number; g: number; b: number; hex: string } {
  if (displayedWidth <= 0 || displayedHeight <= 0) {
    return { r: 0, g: 0, b: 0, hex: '#000000' };
  }

  const scaleX = originalWidth / displayedWidth;
  const scaleY = originalHeight / displayedHeight;

  const actualX = Math.min(originalWidth - 1, Math.max(0, Math.floor(clickX * scaleX)));
  const actualY = Math.min(originalHeight - 1, Math.max(0, Math.floor(clickY * scaleY)));

  const pixelData = ctx.getImageData(actualX, actualY, 1, 1).data;
  const r = pixelData[0];
  const g = pixelData[1];
  const b = pixelData[2];

  return {
    r,
    g,
    b,
    hex: rgbToHex(r, g, b),
  };
}

/**
 * Extracts a grid of pixels (e.g., 9x9) around actual coordinate for loupe magnifier rendering
 */
export function getMagnifierPixelGrid(
  ctx: CanvasRenderingContext2D,
  actualX: number,
  actualY: number,
  gridSize: number = 9
): { r: number; g: number; b: number; hex: string }[][] {
  const half = Math.floor(gridSize / 2);
  const startX = actualX - half;
  const startY = actualY - half;

  const grid: { r: number; g: number; b: number; hex: string }[][] = [];

  for (let y = 0; y < gridSize; y++) {
    const row: { r: number; g: number; b: number; hex: string }[] = [];
    for (let x = 0; x < gridSize; x++) {
      const targetX = startX + x;
      const targetY = startY + y;

      if (targetX < 0 || targetY < 0 || targetX >= ctx.canvas.width || targetY >= ctx.canvas.height) {
        row.push({ r: 255, g: 255, b: 255, hex: '#FFFFFF' });
      } else {
        const p = ctx.getImageData(targetX, targetY, 1, 1).data;
        row.push({
          r: p[0],
          g: p[1],
          b: p[2],
          hex: rgbToHex(p[0], p[1], p[2]),
        });
      }
    }
    grid.push(row);
  }

  return grid;
}
