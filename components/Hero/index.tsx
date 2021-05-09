import cx from 'classnames';
import Image from 'next/image';
import React from 'react';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export function Hero(props: Props) {
  return (
    <div className={cx(styles.container, props.className)}>
      <Image
        src={require('./hero.jpg')}
        layout="fill"
        objectFit="cover"
        objectPosition="center center"
      />
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
