import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Secondary button component
 */
export function Hollow(props: Props) {
  return <button {...props} className={cx(styles.button, props.className)} />;
}
