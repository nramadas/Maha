import cx from 'classnames';
import React from 'react';

import styles from '@/components/controls/buttons/Empty/index.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Text-only link
 */
export function Empty(props: Props) {
  return <a {...props} className={cx(styles.button, props.className)} />;
}
