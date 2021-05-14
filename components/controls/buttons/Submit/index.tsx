import cx from 'classnames';
import React from 'react';

import { Shimmer } from '@/components/loading/Shimmer';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  pending?: boolean;
  style?: React.ButtonHTMLAttributes<HTMLButtonElement>['style'];
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onClick?(e: any): void;
}
/**
 * Submission button component
 */
export function Submit(props: Props) {
  const { className, children, pending, ...rest } = props;

  return (
    <button
      {...rest}
      className={cx(styles.button, className, {
        [styles.pending]: pending,
      })}
    >
      {pending && <Shimmer className={styles.shimmer} />}
      {pending ? (
        <div className={styles.submissionText}>
          <i18n.Translate>Submitting</i18n.Translate>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
