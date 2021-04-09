import cx from 'classnames';
import React from 'react';

import { Caption } from '@/components/typography';

import { newYear, invalidYear, Props } from './_common';
import styles from './index.module.scss';

export function Year(props: Props) {
  const { max, min, view, year, onClick } = props;

  return (
    <div
      className={cx(styles.year, {
        [styles.yearDisabled]: invalidYear(year, min, max),
      })}
      onMouseDown={() => onClick(newYear(year, min, view))}
    >
      <Caption>{year}</Caption>
    </div>
  );
}
