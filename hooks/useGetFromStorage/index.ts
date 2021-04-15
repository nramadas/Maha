import { useEffect, useState } from 'react';

import { storage } from '@/lib/storage';

export function useGetFromStorage<T>(key: string): T | null {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    storage.get<T>(key).then(value => {
      setValue(value || null);
    });
  }, [key]);

  return value;
}
