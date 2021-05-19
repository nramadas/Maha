import { useContext } from 'react';

import { BottomSheetContext } from '@/contexts/BottomSheet';

export function useBottomSheet(id: string) {
  const { set } = useContext(BottomSheetContext);

  function open() {
    set(id);
  }

  function close() {
    set(null);
  }

  return [open, close];
}
