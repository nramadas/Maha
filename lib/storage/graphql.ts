import { storage } from '@/lib/storage';

const DATA_KEY = 'graphqlData';
const METADATA_KEY = 'graphqlMetadata';

export const createGraphqlStore = <D, M>() => {
  const cache = {} as D;

  return {
    readData: () =>
      storage
        .get<D>(DATA_KEY)
        .then(existingData => ({ ...cache, ...existingData })),
    readMetadata: () => storage.get<M>(METADATA_KEY).then(m => m || null),
    writeData: (delta: Partial<D>) => {
      const newData = { ...cache, ...delta };
      return storage.set(DATA_KEY, newData);
    },
    writeMetadata: (data: M) => storage.set(METADATA_KEY, data),
    onOnline(cb: () => void) {
      if (typeof window === 'undefined') {
        cb();
      } else {
        window.addEventListener('online', () => {
          cb();
        });
      }
    },
  };
};
