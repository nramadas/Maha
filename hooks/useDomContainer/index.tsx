import { useContext } from 'react';

import { DomContainerContext } from '@/contexts/DomContainer';

export function useDomContainer() {
  const { getContainer } = useContext(DomContainerContext);
  return getContainer;
}
