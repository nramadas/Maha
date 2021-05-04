import React, { createContext, useRef } from 'react';

interface DomContainerDetails {
  getContainer: () => HTMLDivElement | null;
}

export const DomContainerContext = createContext<DomContainerDetails>({
  getContainer: () => null,
});

interface Props {
  body?: boolean;
  children?: React.ReactNode;
}

export function DomContainerProvider(props: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <DomContainerContext.Provider value={{ getContainer: () => ref.current }}>
      <div ref={ref} style={{ position: props.body ? undefined : 'relative' }}>
        {props.children}
      </div>
    </DomContainerContext.Provider>
  );
}
