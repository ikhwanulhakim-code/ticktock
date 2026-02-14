"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * A single-interval ticker that broadcasts `Date.now()` once per second.
 * All `useTimer` consumers read from this context instead of running
 * their own `setInterval`, reducing N intervals → 1.
 */
const TickerContext = createContext<number>(Date.now());

export function TickerProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<number>(() => Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Tick once immediately, then every second
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <TickerContext.Provider value={now}>{children}</TickerContext.Provider>
  );
}

/**
 * Returns the current `Date.now()` value updated once per second.
 * Must be used inside a `<TickerProvider>`.
 */
export function useTick(): number {
  return useContext(TickerContext);
}
