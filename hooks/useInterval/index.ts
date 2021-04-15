import { useEffect } from 'react';

export function useInterval(interval: number, cb: Function) {
  useEffect(() => {
    const id = setInterval(cb, interval);
    return () => clearInterval(id);
  }, [interval, cb]);
}
