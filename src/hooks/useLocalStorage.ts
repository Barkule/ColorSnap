import { useState, useEffect } from 'react';

const PREFIX = 'colorsnap:';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const prefixedKey = `${PREFIX}${key}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, error);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setStoredValue];
}
