import cx from 'classnames';
import React from 'react';

import { patch, Parts } from '@/lib/date';

import { Props } from './_common';
import styles from './index.module.scss';

export function makeArrow(
  Icon: (props: React.SVGAttributes<SVGElement>) => JSX.Element,
  delta: Partial<Parts>,
) {
  return function Arrow(props: Props) {
    return (
      <Icon
        className={cx(styles.arrow, {
          [styles.arrowDisabled]: !!props.disabled,
        })}
        onClick={() => props.onChange(patch(props.view, delta))}
      />
    );
  };
}
