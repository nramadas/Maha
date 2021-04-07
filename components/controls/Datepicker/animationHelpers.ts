import { TransitionPlainStyle, TransitionStyle, spring } from 'react-motion';

import { monthIsBefore, toParts } from '@/lib/date';

function key(date: Date) {
  const { month, year } = toParts(date);
  return `${year}-${month}`;
}

function data(date: Date, prevItems?: TransitionPlainStyle[] | undefined) {
  return {
    date,
    prev:
      prevItems && prevItems.length
        ? prevItems[prevItems.length - 1].data.date
        : undefined,
  };
}

export const anim = {
  css: (item: any) => ({ left: `${item.style.left}%` }),
  default: (cur: Date) => [
    {
      key: key(cur),
      data: data(cur),
      style: { left: 0 },
    },
  ],
  styles: (cur: Date) => (prevItems: TransitionPlainStyle[] | undefined) => [
    {
      key: key(cur),
      data: data(cur, prevItems),
      style: { left: spring(0) },
    },
  ],
  willEnter: () => (item: TransitionStyle) => {
    const { date, prev } = item.data;
    return prev && monthIsBefore(date, prev) ? { left: -100 } : { left: 100 };
  },
  willLeave: (cur: Date) => (item: TransitionStyle) => {
    const { date } = item.data;
    return monthIsBefore(date, cur)
      ? { left: spring(-100) }
      : { left: spring(100) };
  },
};
