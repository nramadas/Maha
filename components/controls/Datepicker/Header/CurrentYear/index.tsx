import cx from 'classnames';
import React from 'react';

import { Caption } from '@/components/typography';
import { useDateFormatter } from '@/hooks/useDateFormatter';

import styles from './index.module.scss';

interface Props {
  expanded?: boolean;
  view: Date;
  onExpand(): void;
}

export function CurrentYear(props: Props) {
  const [formatYear] = useDateFormatter({ year: 'numeric' });
  const [formatMonth] = useDateFormatter({ month: 'long' });

  return (
    <div
      className={cx(styles.year, {
        [styles.yearExpanded]: !!props.expanded,
      })}
      onClick={() => props.onExpand()}
    >
      <Caption>
        {`${formatMonth(props.view)} ${formatYear(props.view)}`}
      </Caption>
    </div>
  );
}
