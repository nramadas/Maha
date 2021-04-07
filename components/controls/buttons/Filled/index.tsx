import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Primary button component
 */
export function Filled(props: Props) {
  return <button {...props} className={cx(styles.button, props.className)} />;
}
