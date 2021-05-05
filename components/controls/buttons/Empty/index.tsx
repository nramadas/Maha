import cx from 'classnames';
import React from 'react';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: React.ButtonHTMLAttributes<HTMLButtonElement>['style'];
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?(e: any): void;
}
/**
 * Text-only button
 */
export function Empty(props: Props) {
  return <button {...props} className={cx(styles.button, props.className)} />;
}
