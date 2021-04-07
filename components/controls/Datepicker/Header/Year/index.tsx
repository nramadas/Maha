import cx from 'classnames';
import React from 'react';

import { Caption } from '@/components/typography';
import { fromParts, toParts } from '@/lib/date';

import styles from './index.module.scss';

/**
 * In the case where the year selected results in a date that is earlier than
 * the minimum, adjust the month to accomodate.
 */
function newYear(year: number, min: Date, view: Date) {
  const viewParts = toParts(view);
  const minParts = toParts(min);

  return fromParts({
    ...viewParts,
    year,
    month:
      year === minParts.year
        ? Math.max(minParts.month, viewParts.month)
        : viewParts.month,
  });
}

function invalidYear(year: number, min: Date, max: Date) {
  return year < toParts(min).year || year > toParts(max).year;
}

interface Props {
  max: Date;
  min: Date;
  view: Date;
  year: number;
  onClick(date: Date): void;
}

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
