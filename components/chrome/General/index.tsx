import cx from 'classnames';
import throttle from 'lodash/throttle';
import React, { useCallback, useState } from 'react';

import { DomContainerProvider } from '@/contexts/DomContainer';

import { Header } from './Header';
import styles from './index.module.scss';

function calcOpacity(scrollTop: number) {
  if (scrollTop < 100) {
    return scrollTop / 100;
  }

  return 1;
}

interface Props {
  children?: React.ReactNode;
  className?: string;
  transparentHeader?: boolean;
}

export function General(props: Props) {
  const [opacity, setOpacity] = useState(props.transparentHeader ? 0 : 1);

  const onScroll = useCallback(
    throttle((scrollTop: number) => {
      if (props.transparentHeader) {
        setOpacity(calcOpacity(scrollTop));
      }
    }, 16),
    [setOpacity],
  );

  return (
    <div
      className={styles.container}
      onScroll={e => {
        const scrollTop = e.currentTarget.scrollTop;
        onScroll(scrollTop);
      }}
    >
      <div className={styles.headerBG} style={{ opacity }} />
      <Header
        className={cx(styles.header, {
          [styles.scrolled1]: opacity > 0.5,
          [styles.scrolled2]: opacity > 0.6,
          [styles.scrolled3]: opacity > 0.7,
          [styles.scrolled4]: opacity > 0.8,
          [styles.scrolled5]: opacity > 0.9,
        })}
      />
      <div className={styles.content}>
        <DomContainerProvider>{props.children}</DomContainerProvider>
      </div>
    </div>
  );
}
