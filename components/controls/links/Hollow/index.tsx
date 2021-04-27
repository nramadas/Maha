import cx from 'classnames';
import React from 'react';

import styles from '@/components/controls/buttons/Hollow/index.module.scss';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/**
 * Secondary link component
 */
export const Hollow = React.forwardRef<HTMLAnchorElement, Props>(
  (props: Props, ref) => (
    <a {...props} ref={ref} className={cx(styles.button, props.className)} />
  ),
);
