import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function H2(props: Props) {
  return <h2 {...props} className={cx(styles.h2, props.className)} />;
}
