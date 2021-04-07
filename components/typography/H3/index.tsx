import React from 'react';

import styles from './index.module.scss';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function H3(props: Props) {
  return <span {...props} className={styles.h3} />;
}
