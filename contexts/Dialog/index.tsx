import React, { createContext, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

interface Props {
  /**
   * Standard React children
   */
  children?: React.ReactNode;
  /**
   * Function that returns the container the Tooltip should be rendered into.
   */
  getContainer: () => HTMLElement | null;
}

interface DialogDetails {
  current: symbol | null;
  getContainer: Props['getContainer'];
  set(current: DialogDetails['current']): void;
}

export const DialogContext = createContext<DialogDetails>({
  current: null,
  getContainer: () => null,
  set: () => {},
});

export function DialogProvider(props: Props) {
  const [current, setCurrent] = useState<DialogDetails['current']>(null);
  const { children, getContainer } = props;

  useIsomorphicLayoutEffect(() => {
    let previousOverflowValue: string = '';

    function preventScroll() {
      const container = getContainer();

      if (container) {
        previousOverflowValue = container.style.overflow;
        container.style.overflow = 'hidden';
      }
    }

    function enableScroll() {
      const container = getContainer();

      if (container) {
        if (previousOverflowValue) {
          container.style.overflow = previousOverflowValue;
        } else {
          // @ts-ignore
          container.style.overflow = null;
        }
      }
    }

    if (current) {
      preventScroll();
    } else {
      enableScroll();
    }
  }, [current, getContainer]);

  return (
    <DialogContext.Provider
      value={{
        current,
        getContainer,
        set: setCurrent,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}
