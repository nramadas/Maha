import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

type Props = React.HTMLProps<HTMLDivElement>;

export function Shimmer(props: Props) {
  return <div {...props} className={cx(styles.container, props.className)} />;
}
