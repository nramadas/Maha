import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Text-only button
 */
export function Empty(props: Props) {
  return <button {...props} className={cx(styles.button, props.className)} />;
}
