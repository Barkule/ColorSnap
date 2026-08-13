import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, RefreshCw, ZoomIn } from 'lucide-react';
import { validateImageFile, readImageFile, sampleCanvasPixel, getMagnifierPixelGrid } from '../utils/imageUtils';
import { buildSelectedColor } from '../utils/colorUtils';
import type { SelectedColor } from '../types/color';

interface ImagePickerProps {
  onColorSelect: (color: SelectedColor) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ onColorSelect }) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [hoverColor, setHoverColor] = useState<{ hex: string; r: number; g: number; b: number } | null>(null);
  
  // Magnifier Loupe state
  const [loupePos, setLoupePos] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [magnifierGrid, setMagnifierGrid] = useState<{ r: number; g: number; b: number; hex: string }[][] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Load image onto offscreen canvas when imageElement changes
  useEffect(() => {
    if (!imageElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(imageElement, 0, 0);
    }
  }, [imageElement]);

  const handleFile = async (file: File) => {
    setValidationError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file format.');
      return;
    }

    try {
      const img = await readImageFile(file);
      setImageElement(img);
    } catch (err) {
      setValidationError('Failed to load image. Please try another image file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // RAF-throttled canvas mouse move handler for 60fps loupe rendering
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current || !imageElement) return;

      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const displayedWidth = rect.width;
      const displayedHeight = rect.height;
      const originalWidth = imageElement.naturalWidth;
      const originalHeight = imageElement.naturalHeight;

      if (displayedWidth <= 0 || displayedHeight <= 0) return;

      // Throttle with requestAnimationFrame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const sampled = sampleCanvasPixel(
          ctx,
          displayedWidth,
          displayedHeight,
          originalWidth,
          originalHeight,
          clickX,
          clickY
        );

        setHoverColor(sampled);

        // Magnifier Loupe calculation
        const scaleX = originalWidth / displayedWidth;
        const scaleY = originalHeight / displayedHeight;
        const actualX = Math.min(originalWidth - 1, Math.max(0, Math.floor(clickX * scaleX)));
        const actualY = Math.min(originalHeight - 1, Math.max(0, Math.floor(clickY * scaleY)));

        const grid = getMagnifierPixelGrid(ctx, actualX, actualY, 9);
        setMagnifierGrid(grid);
        setLoupePos({ x: clickX, y: clickY, visible: true });
      });
    },
    [imageElement]
  );

  const handleMouseLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setLoupePos((prev) => ({ ...prev, visible: false }));
    setHoverColor(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !imageElement) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const sampled = sampleCanvasPixel(
      ctx,
      rect.width,
      rect.height,
      imageElement.naturalWidth,
      imageElement.naturalHeight,
      clickX,
      clickY
    );

    const fullColor = buildSelectedColor(sampled.hex);
    onColorSelect(fullColor);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" />
            <span>Image Color Extractor</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload any image (PNG, JPG, WebP) and click any pixel for precision color sampling.
          </p>
        </div>

        {imageElement && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change Image</span>
          </button>
        )}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Offscreen Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Upload Dropzone or Canvas Display */}
      {!imageElement ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-10 sm:p-16 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Drag & Drop your image here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports PNG, JPG, WebP, SVG up to 25MB
            </p>
          </div>
          <button
            type="button"
            className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Browse Image File
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interactive Image Container */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
            className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 flex items-center justify-center cursor-crosshair group max-h-[550px]"
          >
            <img
              src={imageElement.src}
              alt="Uploaded workspace"
              className="max-w-full max-h-[550px] object-contain select-none pointer-events-none"
            />

            {/* RAF Magnifier Loupe Overlay */}
            {loupePos.visible && magnifierGrid && (
              <div
                style={{
                  left: `${loupePos.x}px`,
                  top: `${loupePos.y}px`,
                  transform: 'translate(-50%, -120%)',
                }}
                className="absolute pointer-events-none z-30 flex flex-col items-center"
              >
                {/* 9x9 Pixel Loupe Window */}
                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-950 grid grid-cols-9 grid-rows-9">
                  {magnifierGrid.map((row, y) =>
                    row.map((cell, x) => {
                      const isCenter = x === 4 && y === 4;
                      return (
                        <div
                          key={`${x}-${y}`}
                          style={{ backgroundColor: cell.hex }}
                          className={`w-full h-full ${
                            isCenter ? 'ring-2 ring-indigo-500 z-10 scale-110 shadow-xs' : ''
                          }`}
                        />
                      );
                    })
                  )}
                </div>

                {/* Reticle pointer */}
                <div className="w-3 h-3 bg-white dark:bg-slate-800 rotate-45 -mt-1.5 shadow-md" />

                {/* Hover HEX Badge */}
                {hoverColor && (
                  <div className="mt-1 px-2.5 py-1 rounded-md bg-slate-900/90 text-white font-mono text-[11px] font-bold shadow-lg border border-slate-700/80 tracking-wider">
                    {hoverColor.hex}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-indigo-500" />
            <span>Click anywhere on the image to select that exact pixel color</span>
          </p>
        </div>
      )}
    </div>
  );
};
