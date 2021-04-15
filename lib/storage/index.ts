import type localforage from 'localforage';

interface Storage {
  get<T>(key: string): Promise<T | null | undefined>;
  set<T>(key: string, value: T): Promise<T>;
}

export const storage: Storage = (() => {
  if (typeof window === 'undefined') {
    return {
      get: () => Promise.resolve(undefined),
      set: <T>(key: string, value: T) => Promise.resolve(value),
    };
  } else {
    const lf: typeof localforage = require('localforage');
    lf.config({
      name: 'Maha',
      storeName: 'maha',
      description: 'general storage',
    });

    return {
      get: <T>(key: string) => lf.getItem<T>(key),
      set: <T>(key: string, value: T) => lf.setItem<T>(key, value),
    };
  }
})();
