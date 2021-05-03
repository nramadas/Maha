import React, { createContext, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { DialogContext } from '@/contexts/Dialog';

interface ConfirmationDetails {
  open(el: JSX.Element): void;
  close(): void;
}

export const ConfirmationContext = createContext<ConfirmationDetails>({
  open: () => {},
  close: () => {},
});

interface InnerProps {
  container: HTMLElement;
  el: JSX.Element;
}

function Dialog(props: InnerProps) {
  return createPortal(props.el, props.container);
}

interface Props {
  children?: React.ReactNode;
}

export function ConfirmationProvider(props: Props) {
  const { current, getContainer, set } = useContext(DialogContext);
  const id = useRef(Symbol());
  const [el, setEl] = useState<JSX.Element>(<div />);
  const container = getContainer();

  return (
    <>
      <ConfirmationContext.Provider
        value={{
          open: el => {
            setEl(el);
            set(id.current);
          },
          close: () => {
            set(null);
            setEl(<div />);
          },
        }}
      >
        {props.children}
      </ConfirmationContext.Provider>
      {current === id.current && container && (
        <Dialog container={container} el={el} />
      )}
    </>
  );
}
