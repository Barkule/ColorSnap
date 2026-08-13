import React from 'react';
import { Pipette, Monitor, Smartphone } from 'lucide-react';

interface ScreenPickerProps {
  onPickScreenColor: () => void;
  isSupported: boolean;
  isMobile: boolean;
  isPicking: boolean;
}

export const ScreenPicker: React.FC<ScreenPickerProps> = ({
  onPickScreenColor,
  isSupported,
  isMobile,
  isPicking,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-500" />
            <span>Screen Color Extractor</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick any pixel visible on your monitor using the browser's native EyeDropper API.
          </p>
        </div>

        {isSupported && (
          <button
            onClick={onPickScreenColor}
            disabled={isPicking}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shrink-0"
          >
            <Pipette className="w-4 h-4" />
            <span>Pick Color Now</span>
          </button>
        )}
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold flex items-center justify-center text-sm">
            1
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Click "Pick Color"</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Launches the OS-level native pixel eyedropper loupe directly in your browser.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-extrabold flex items-center justify-center text-sm">
            2
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Hover Outside Browser</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Move your cursor over WhatsApp Desktop, YouTube, Slack, or any desktop app.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 font-extrabold flex items-center justify-center text-sm">
            3
          </div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Click to Sample</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The target pixel color is captured immediately with full HEX, RGB, HSL & HSV values.
          </p>
        </div>
      </div>

      {/* Unsupported or Mobile Notice */}
      {!isSupported && (
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
            {isMobile ? <Smartphone className="w-4 h-4 text-amber-500" /> : <Monitor className="w-4 h-4 text-amber-500" />}
            <span>{isMobile ? 'Mobile Device Detected' : 'EyeDropper API Unsupported'}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {isMobile
              ? 'Screen color picking is a desktop-only capability. Switch to the Image Picker tab above to upload an image and extract exact pixel colors on touch screens.'
              : 'Your current browser (e.g. Firefox or Safari) does not support the EyeDropper API. For native screen picking, open ColorSnap in Google Chrome or Microsoft Edge.'}
          </p>
        </div>
      )}
    </div>
  );
};
