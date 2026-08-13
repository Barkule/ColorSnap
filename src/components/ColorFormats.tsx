import React from 'react';
import type { SelectedColor } from '../types/color';
import { getCssVariableString, getTailwindConfigString } from '../utils/colorUtils';
import { CopyButton } from './CopyButton';
import { Code2, Hash, Layers, Sliders, Palette } from 'lucide-react';

interface ColorFormatsProps {
  color: SelectedColor;
}

export const ColorFormats: React.FC<ColorFormatsProps> = ({ color }) => {
  const hexVal = color.hex;
  const rgbVal = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
  const rgbCss = `rgb(${rgbVal})`;
  const hslCss = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
  const hsvVal = `${color.hsv.h}°, ${color.hsv.s}%, ${color.hsv.v}%`;
  const cssVar = getCssVariableString(color);
  const tailwindSnippet = getTailwindConfigString(color);

  const formats = [
    { label: 'HEX', value: hexVal, rawCopy: hexVal, icon: Hash },
    { label: 'RGB', value: rgbCss, rawCopy: rgbCss, icon: Sliders },
    { label: 'HSL', value: hslCss, rawCopy: hslCss, icon: Layers },
    { label: 'HSV / HSB', value: hsvVal, rawCopy: hsvVal, icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Code2 className="w-5 h-5 text-indigo-500" />
        <span>Color Code Formats</span>
      </h3>

      {/* Grid of standard color codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map((fmt) => {
          const Icon = fmt.icon;
          return (
            <div
              key={fmt.label}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 group hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {fmt.label}
                  </span>
                  <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {fmt.value}
                  </p>
                </div>
              </div>
              <CopyButton textToCopy={fmt.rawCopy} label="Copy" />
            </div>
          );
        })}
      </div>

      {/* Developer Snippets: CSS Var & Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* CSS Variable */}
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800 relative group">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans font-semibold">
            <span>CSS Variables</span>
            <CopyButton textToCopy={cssVar} label="Copy CSS" />
          </div>
          <pre className="overflow-x-auto p-2 bg-slate-950 rounded-xl text-indigo-300">
            <code>{cssVar}</code>
          </pre>
        </div>

        {/* Tailwind Config */}
        <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800 relative group">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans font-semibold">
            <span>Tailwind Config</span>
            <CopyButton textToCopy={tailwindSnippet} label="Copy Tailwind" />
          </div>
          <pre className="overflow-x-auto p-2 bg-slate-950 rounded-xl text-purple-300">
            <code>{tailwindSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
