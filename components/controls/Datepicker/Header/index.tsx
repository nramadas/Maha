import React, { useState } from 'react';

import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { monthIsBefore, patch, today, toParts } from '@/lib/date';

import { CurrentYear } from './CurrentYear';
import styles from './index.module.scss';
import { makeArrow } from './makeArrow';
import { Year } from './Year';

const LeftArrow = makeArrow(ChevronLeft, { month: -1 });
const RightArrow = makeArrow(ChevronRight, { month: 1 });

export interface Props {
  /**
   * The latest year the calendar will allow the user to select. If not
   * provided, it defaults to 50 years after the current year.
   */
  max?: Date;
  /**
   * The earliest year the calendar will allow the user to select. If not
   * provided, defaults to the current year.
   */
  min?: Date;
  /**
   * The selected year
   */
  view: Date;
  /**
   * Callback when a different year is selected
   */
  onChange: (newDate: Date) => void;
}

export function Header(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const now = today();
  const min = props.min || now;
  const max = props.max || patch(now, { year: 50 });

  // normalize the minimum and maximum years to a multiple of 4 so that the
  // year selector looks nice when expanded
  const minYear = toParts(min).year - (toParts(min).year % 4);
  const maxYear = toParts(max).year + (4 - (toParts(max).year % 4));

  const years = Array.from({ length: maxYear - minYear }).map(
    (_, i) => minYear + i,
  );

  return (
    // the mouseDown handler on the container prevent the tooltip from closing
    // if the user interacts with the header
    <div onMouseDown={e => e.preventDefault()}>
      <div className={styles.top}>
        <LeftArrow
          disabled={!monthIsBefore(min, props.view)}
          view={props.view}
          onChange={props.onChange}
        />
        <CurrentYear
          expanded={!!expanded}
          view={props.view}
          onExpand={() => setExpanded(!expanded)}
        />
        <RightArrow
          disabled={!monthIsBefore(props.view, max)}
          view={props.view}
          onChange={props.onChange}
        />
      </div>
      <div
        className={styles.bottom}
        style={{
          // don't show more than 6 rows of years (the rest will scroll). Each
          // row contains 4 years
          height: expanded ? 32 * Math.min(Math.ceil(years.length / 4), 6) : 0,
        }}
      >
        <div className={styles.bottomGrid}>
          {years.map(year => (
            <Year
              key={year}
              max={max}
              min={min}
              view={props.view}
              year={year}
              onClick={year => {
                props.onChange(year);
                setExpanded(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
