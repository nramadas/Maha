import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function H1(props: Props) {
  return <h1 {...props} className={cx(styles.h1, props.className)} />;
}
