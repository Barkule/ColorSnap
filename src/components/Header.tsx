import React from 'react';
import { Pipette, Image, Sun, Moon, ShieldCheck, Monitor, Smartphone } from 'lucide-react';

interface HeaderProps {
  activeTab: 'screen' | 'image';
  setActiveTab: (tab: 'screen' | 'image') => void;
  onScrollToSection?: (sectionId: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isEyeDropperSupported: boolean;
  isMobile: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onScrollToSection,
  isDarkMode,
  setIsDarkMode,
  isEyeDropperSupported,
  isMobile,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 glass-panel transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onScrollToSection ? onScrollToSection('hero-section') : window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Pipette className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                ColorSnap
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Screen & Image Pixel Extractor
            </p>
          </div>
        </button>

        {/* Tab Navigation */}
        <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium">
          <button
            onClick={() => setActiveTab('screen')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'screen'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Pipette className="w-4 h-4" />
            <span className="hidden sm:inline">Screen Picker</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Image Picker</span>
          </button>
        </nav>

        {/* Status Badge & Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* Device / Browser Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800">
            {isMobile ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                <span>Mobile (Image Picker ready)</span>
              </>
            ) : isEyeDropperSupported ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">EyeDropper Active</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>Image Picker Fallback</span>
              </>
            )}
          </div>

          {/* Privacy Badge Link */}
          <button
            onClick={() => onScrollToSection?.('privacy-section')}
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>100% Client-Side</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
