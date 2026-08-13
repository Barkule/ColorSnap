import React from 'react';
import type { SelectedColor } from '../types/color';
import { getContrastMetrics } from '../utils/colorUtils';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';

interface AccessibilityCheckProps {
  color: SelectedColor;
}

export const AccessibilityCheck: React.FC<AccessibilityCheckProps> = ({ color }) => {
  const metrics = getContrastMetrics(color.hex);

  const getBadgeStyle = (verdict: 'AAA' | 'AA' | 'Fail') => {
    switch (verdict) {
      case 'AAA':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'AA':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'Fail':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-500" />
            <span>WCAG Accessibility & Contrast</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluated against standard WCAG 2.1 contrast guidelines (AA ≥ 4.5:1, AAA ≥ 7.0:1)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contrast Against White Text */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Against White Text</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(metrics.verdictAgainstWhite)}`}>
              WCAG {metrics.verdictAgainstWhite}
            </span>
          </div>

          {/* Live Text Sample Card */}
          <div
            style={{ backgroundColor: color.hex }}
            className="p-4 rounded-xl text-white font-bold text-sm shadow-xs flex items-center justify-between border border-black/10"
          >
            <span>Sample White Text</span>
            <span className="text-xs font-mono opacity-90">{metrics.ratioAgainstWhite}:1</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-center gap-1.5">
            {metrics.verdictAgainstWhite !== 'Fail' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>
              {metrics.verdictAgainstWhite !== 'Fail'
                ? `Good for white text overlays (${metrics.ratioAgainstWhite}:1 contrast).`
                : `Poor contrast for white text (${metrics.ratioAgainstWhite}:1 ratio).`}
            </span>
          </p>
        </div>

        {/* Contrast Against Black Text */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Against Black Text</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(metrics.verdictAgainstBlack)}`}>
              WCAG {metrics.verdictAgainstBlack}
            </span>
          </div>

          {/* Live Text Sample Card */}
          <div
            style={{ backgroundColor: color.hex }}
            className="p-4 rounded-xl text-slate-950 font-bold text-sm shadow-xs flex items-center justify-between border border-black/10"
          >
            <span>Sample Black Text</span>
            <span className="text-xs font-mono opacity-90">{metrics.ratioAgainstBlack}:1</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-center gap-1.5">
            {metrics.verdictAgainstBlack !== 'Fail' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>
              {metrics.verdictAgainstBlack !== 'Fail'
                ? `Good for dark text overlays (${metrics.ratioAgainstBlack}:1 contrast).`
                : `Poor contrast for dark text (${metrics.ratioAgainstBlack}:1 ratio).`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
