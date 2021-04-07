import React from 'react';
import { createPortal } from 'react-dom';

import { DialogContext } from '@/contexts/Dialog';

import styles from './index.module.scss';

interface Props {
  children: React.ReactElement;
}

interface InnerProps extends Props {
  id: symbol;
}

function Target(props: InnerProps) {
  const { current, set } = React.useContext(DialogContext);
  const { id, children: child } = props;

  return React.cloneElement(React.Children.only(child), {
    'data-dialogopen': current === id,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      set(id);
      child.props.onClick && child.props.onClick(e);
    },
  });
}

function Dialog(props: InnerProps) {
  const { current } = React.useContext(DialogContext);
  const { getContainer } = React.useContext(DialogContext);
  const { id, children: child } = props;
  const container = getContainer();

  if (container && id === current) {
    return createPortal(
      <div className={styles.cover}>
        <div className={styles.dialog}>{child}</div>
      </div>,
      container,
    );
  }

  return null;
}

export function useDialog() {
  const id = React.useRef(Symbol());
  const { set } = React.useContext(DialogContext);

  const target = React.useRef((props: Props) => (
    <Target id={id.current} {...props} />
  ));

  const dialog = React.useRef((props: Props) => (
    <Dialog id={id.current} {...props} />
  ));

  const close = () => set(null);

  return [target.current, dialog.current, close] as [
    typeof target.current,
    typeof dialog.current,
    typeof close,
  ];
}
