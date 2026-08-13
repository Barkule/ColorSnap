import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <span>100% Local & Private — Guaranteed</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Your images and picked screen colors never leave your computer.
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed pl-13">
        ColorSnap runs completely client-side in your Web Browser. Screen pixel extraction utilizes the browser's native single-point EyeDropper API — without asking for full screen recording permissions or transmitting any screenshot data.
      </p>
    </div>
  );
};
