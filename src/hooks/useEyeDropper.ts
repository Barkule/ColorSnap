import { useState, useCallback, useEffect } from 'react';

// EyeDropper API type declaration for TypeScript
interface EyeDropperOpenOptions {
  signal?: AbortSignal;
}

interface EyeDropperOpenResult {
  sRGBHex: string;
}

interface EyeDropperConstructor {
  new (): {
    open(options?: EyeDropperOpenOptions): Promise<EyeDropperOpenResult>;
  };
}

declare global {
  interface Window {
    EyeDropper?: EyeDropperConstructor;
  }
}

export function useEyeDropper() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isPicking, setIsPicking] = useState<boolean>(false);

  useEffect(() => {
    const hasEyeDropper = 'EyeDropper' in window;
    const isTouchDevice = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    
    setIsMobile(Boolean(isTouchDevice));
    // EyeDropper API is supported in Chrome/Edge desktop environments
    setIsSupported(hasEyeDropper && !isTouchDevice);
  }, []);

  const openEyeDropper = useCallback(async (): Promise<string | null> => {
    if (!('EyeDropper' in window) || !window.EyeDropper) {
      console.warn('EyeDropper API is not available in this browser.');
      return null;
    }

    try {
      setIsPicking(true);
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      return result.sRGBHex;
    } catch (error) {
      // Silently swallow user cancellation (Escape / cancel)
      // DOMException: The user canceled the selection.
      return null;
    } finally {
      setIsPicking(false);
    }
  }, []);

  return {
    isSupported,
    isMobile,
    isPicking,
    openEyeDropper,
  };
}
