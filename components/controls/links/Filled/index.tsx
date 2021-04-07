import cx from 'classnames';
import React from 'react';

import styles from '@/components/controls/buttons/Filled/index.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Primary link component
 */
export function Filled(props: Props) {
  return <a {...props} className={cx(styles.button, props.className)} />;
}
