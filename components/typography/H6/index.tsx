import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function H6(props: Props) {
  return <h6 {...props} className={cx(styles.h6, props.className)} />;
}
