import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

export function H5(props: Props) {
  return <h5 {...props} className={cx(styles.h5, props.className)} />;
}
