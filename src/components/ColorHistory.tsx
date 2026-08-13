import React from 'react';
import type { ColorHistoryItem, SelectedColor } from '../types/color';
import { buildSelectedColor } from '../utils/colorUtils';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

interface ColorHistoryProps {
  history: ColorHistoryItem[];
  onSelectHistoryColor: (color: SelectedColor) => void;
  onClearHistory: () => void;
}

export const ColorHistory: React.FC<ColorHistoryProps> = ({
  history,
  onSelectHistoryColor,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Colors</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {history.length} / 10
          </span>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectHistoryColor(buildSelectedColor(item.hex))}
            className="group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200 text-left flex items-center gap-3 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Color Swatch Circle */}
            <div
              style={{ backgroundColor: item.hex }}
              className="w-10 h-10 rounded-xl shadow-xs border border-black/10 shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {item.hex}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {item.name}
              </p>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};
