import cx from 'classnames';
import React from 'react';

import styles from '@/components/controls/buttons/Hollow/index.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Secondary link component
 */
export function Hollow(props: Props) {
  return <a {...props} className={cx(styles.button, props.className)} />;
}
