import React from 'react';
import type { SelectedColor } from '../types/color';
import { getContrastMetrics } from '../utils/colorUtils';
import { CopyButton } from './CopyButton';
import { Tag } from 'lucide-react';

interface ColorResultProps {
  color: SelectedColor;
}

export const ColorResult: React.FC<ColorResultProps> = ({ color }) => {
  const contrast = getContrastMetrics(color.hex);
  const textColor = contrast.recommendedText === 'white' ? 'text-white' : 'text-slate-950';
  const textMuted = contrast.recommendedText === 'white' ? 'text-white/80' : 'text-slate-950/70';

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      {/* Primary Swatch Hero Banner */}
      <div
        style={{ backgroundColor: color.hex }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 shadow-2xl transition-all duration-500 border border-black/10 dark:border-white/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Color Name Tag */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-black/10 dark:bg-white/15 ${textColor}`}>
              <Tag className="w-3.5 h-3.5" />
              <span>{color.name}</span>
            </div>

            {/* HEX Code */}
            <div className="space-y-1">
              <h2 className={`text-4xl sm:text-6xl font-black font-mono tracking-tight ${textColor}`}>
                {color.hex}
              </h2>
              <p className={`text-sm font-medium ${textMuted}`}>
                RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b}) · HSL({color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%)
              </p>
            </div>
          </div>

          {/* Quick Copy HEX */}
          <div className="shrink-0">
            <CopyButton
              textToCopy={color.hex}
              label="Copy HEX Code"
              className="px-5 py-3 text-sm rounded-2xl shadow-xl font-bold backdrop-blur-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
