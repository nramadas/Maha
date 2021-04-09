import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function H4(props: Props) {
  return <h4 {...props} className={cx(styles.h4, props.className)} />;
}
