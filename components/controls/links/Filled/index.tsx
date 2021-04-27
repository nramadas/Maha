import cx from 'classnames';
import React from 'react';

import styles from '@/components/controls/buttons/Filled/index.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Primary link component
 */
export const Filled = React.forwardRef<HTMLAnchorElement, Props>(
  (props: Props, ref) => (
    <a {...props} ref={ref} className={cx(styles.button, props.className)} />
  ),
);
