import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ScreenPicker } from './components/ScreenPicker';
import { ImagePicker } from './components/ImagePicker';
import { ColorResult } from './components/ColorResult';
import { ColorFormats } from './components/ColorFormats';
import { AccessibilityCheck } from './components/AccessibilityCheck';
import { ColorHistory } from './components/ColorHistory';
import { PrivacyBanner } from './components/PrivacyBanner';
import { useEyeDropper } from './hooks/useEyeDropper';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { SelectedColor, ColorHistoryItem } from './types/color';
import { buildSelectedColor } from './utils/colorUtils';

export function App() {
  // Theme state persisted in localStorage under "colorsnap:theme"
  const [themeMode, setThemeMode] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  
  // Tab state persisted under "colorsnap:activeTab"
  const [activeTab, setActiveTab] = useLocalStorage<'screen' | 'image'>('activeTab', 'screen');
  
  // History state persisted under "colorsnap:history"
  const [history, setHistory] = useLocalStorage<ColorHistoryItem[]>('history', []);

  // Selected Color state (Initial default warm cream color)
  const [selectedColor, setSelectedColor] = useState<SelectedColor>(() =>
    buildSelectedColor('#E8E1D7')
  );

  const { isSupported: isEyeDropperSupported, isMobile, isPicking, openEyeDropper } = useEyeDropper();

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // If mobile or EyeDropper unsupported, default activeTab to image
  useEffect(() => {
    if ((isMobile || !isEyeDropperSupported) && activeTab === 'screen') {
      setActiveTab('image');
    }
  }, [isMobile, isEyeDropperSupported, activeTab, setActiveTab]);

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 60);
  };

  const handleTabSwitch = (tab: 'screen' | 'image') => {
    setActiveTab(tab);
    scrollToSection('picker-section');
  };

  const handleColorSelection = (color: SelectedColor, shouldScrollToResult = true) => {
    setSelectedColor(color);

    // Add to history (cap at 10 items, deduplicate consecutive hexes)
    setHistory((prevHistory) => {
      const filtered = prevHistory.filter((item) => item.hex.toUpperCase() !== color.hex.toUpperCase());
      const newItem: ColorHistoryItem = {
        id: `${color.hex}-${Date.now()}`,
        hex: color.hex,
        name: color.name,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered].slice(0, 10);
    });

    if (shouldScrollToResult) {
      scrollToSection('result-section');
    }
  };

  const handlePickScreenColor = async () => {
    const hex = await openEyeDropper();
    if (hex) {
      const color = buildSelectedColor(hex);
      handleColorSelection(color, true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabSwitch}
        onScrollToSection={scrollToSection}
        isDarkMode={themeMode === 'dark'}
        setIsDarkMode={(dark) => setThemeMode(dark ? 'dark' : 'light')}
        isEyeDropperSupported={isEyeDropperSupported}
        isMobile={isMobile}
      />

      {/* Main Content Body */}
      <main className="flex-1 space-y-10 pb-16">
        {/* Hero Section */}
        <div id="hero-section">
          <Hero
            onPickScreenColor={handlePickScreenColor}
            onSelectImageTab={() => handleTabSwitch('image')}
            isEyeDropperSupported={isEyeDropperSupported}
            isMobile={isMobile}
            isPicking={isPicking}
          />
        </div>

        {/* Selected Color Result & Code Formats */}
        {selectedColor && (
          <div id="result-section" className="px-4 space-y-8 animate-fade-in scroll-mt-24">
            <ColorResult color={selectedColor} />
            <ColorFormats color={selectedColor} />
            <AccessibilityCheck color={selectedColor} />
          </div>
        )}

        {/* Interactive Tab Picker View: Screen vs Image */}
        <div id="picker-section" className="px-4 scroll-mt-24">
          {activeTab === 'screen' ? (
            <ScreenPicker
              onPickScreenColor={handlePickScreenColor}
              isSupported={isEyeDropperSupported}
              isMobile={isMobile}
              isPicking={isPicking}
            />
          ) : (
            <ImagePicker onColorSelect={(c) => handleColorSelection(c, true)} />
          )}
        </div>

        {/* Color History Swatches */}
        <div id="history-section" className="px-4 scroll-mt-24">
          <ColorHistory
            history={history}
            onSelectHistoryColor={(c) => {
              setSelectedColor(c);
              scrollToSection('result-section');
            }}
            onClearHistory={() => setHistory([])}
          />
        </div>

        {/* Privacy Assurance Banner */}
        <div id="privacy-section" className="px-4 scroll-mt-24">
          <PrivacyBanner />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ColorSnap — Instant Screen Color Extraction. 100% Client-Side.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('privacy-section')}
              className="hover:underline cursor-pointer"
            >
              Privacy Position
            </button>
            <span>·</span>
            <button
              onClick={() => handleTabSwitch('screen')}
              className="hover:underline cursor-pointer"
            >
              EyeDropper API Powered
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
