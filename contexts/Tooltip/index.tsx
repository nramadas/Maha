import React, { createContext, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { findParent } from '@/lib/dom/findParent';

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

interface TooltipDetails {
  current: symbol | undefined;
  getContainer: Props['getContainer'];
  target: HTMLElement | undefined;
  set(data: Pick<TooltipDetails, 'current' | 'target'>): void;
}

export const TooltipContext = createContext<TooltipDetails>({
  current: undefined,
  getContainer: () => null,
  target: undefined,
  set: () => {},
});

export function TooltipProvider(props: Props) {
  const [current, setCurrent] = useState<
    Pick<TooltipDetails, 'current' | 'target'>
  >({
    current: undefined,
    target: undefined,
  });

  useIsomorphicLayoutEffect(() => {
    const closeTooltip = (e: MouseEvent | FocusEvent) => {
      const isCurrentTarget =
        !!e.target &&
        !!findParent(e.target as HTMLElement, el => el === current.target);

      if (!isCurrentTarget) {
        setCurrent({
          current: undefined,
          target: undefined,
        });
      }
    };

    document.addEventListener('click', closeTooltip);

    return () => {
      document.removeEventListener('click', closeTooltip);
    };
  });

  return (
    <TooltipContext.Provider
      value={{
        current: current.current,
        getContainer: props.getContainer,
        target: current.target,
        set: data => setCurrent(data),
      }}
    >
      {props.children}
    </TooltipContext.Provider>
  );
}
