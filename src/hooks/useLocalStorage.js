import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;

      try {
        return JSON.parse(stored);
      } catch {
        return stored;
      }
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore =
        typeof value === "string" ? value : JSON.stringify(value);
      window.localStorage.setItem(key, valueToStore);
    } catch {
      // localStorage may be unavailable in private browsing.
    }
  }, [key, value]);

  return [value, setValue];
}