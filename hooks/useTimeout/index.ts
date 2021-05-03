import { useEffect, useRef } from 'react';

export function useTimeout(fn: Function, time?: number) {
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    timer.current = setTimeout(fn, time);
    return () => clearTimeout(timer.current);
  }, [fn, time]);
}
