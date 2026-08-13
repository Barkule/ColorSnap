import React from 'react';
import { Pipette, Upload, AlertTriangle, Sparkles } from 'lucide-react';

interface HeroProps {
  onPickScreenColor: () => void;
  onSelectImageTab: () => void;
  isEyeDropperSupported: boolean;
  isMobile: boolean;
  isPicking: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onPickScreenColor,
  onSelectImageTab,
  isEyeDropperSupported,
  isMobile,
  isPicking,
}) => {
  return (
    <section className="relative overflow-hidden py-10 md:py-14 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Zero Server Uploads · 100% Instant Client-Side Extraction</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Pick Any Color From Your{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Screen & Images
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Sample exact pixel colors from WhatsApp Desktop, websites, or design files in under 5 seconds. Get instant HEX, RGB, HSL, HSV, and WCAG contrast ratings.
        </p>

        {/* Active Picking Mode Banner */}
        {isPicking && (
          <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 animate-active-pulse max-w-lg mx-auto flex items-center justify-between gap-3 border border-indigo-400">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Pipette className="w-5 h-5 animate-spin text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">EyeDropper Active!</h4>
                <p className="text-xs text-indigo-100">
                  Move cursor anywhere on screen to pick a pixel. Press <kbd className="px-1.5 py-0.5 bg-indigo-800 rounded font-mono text-[10px]">ESC</kbd> to cancel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {isEyeDropperSupported ? (
            <button
              onClick={onPickScreenColor}
              disabled={isPicking}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer transform active:scale-98 text-base"
            >
              <Pipette className="w-5 h-5" />
              <span>🎨 Pick Color From Screen</span>
            </button>
          ) : (
            <button
              onClick={onSelectImageTab}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 cursor-not-allowed flex items-center justify-center gap-3 text-base"
              title="Screen picking is unsupported on this device"
            >
              <Pipette className="w-5 h-5" />
              <span>Screen Picker Unsupported</span>
            </button>
          )}

          <button
            onClick={onSelectImageTab}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <Upload className="w-5 h-5 text-indigo-500" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Device / Browser Notification */}
        {!isEyeDropperSupported && (
          <div className="max-w-md mx-auto p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 text-left shadow-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>
              {isMobile
                ? "Screen color picking isn't available on mobile devices. Upload an image to extract colors."
                : "Screen color picking isn't supported in this browser (best in Chrome or Edge). Upload an image instead."}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
