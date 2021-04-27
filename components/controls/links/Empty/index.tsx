import cx from 'classnames';
import React from 'react';

import styles from '@/components/controls/buttons/Empty/index.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Text-only link
 */
export const Empty = React.forwardRef<HTMLAnchorElement, Props>(
  (props: Props, ref) => (
    <a {...props} ref={ref} className={cx(styles.button, props.className)} />
  ),
);
