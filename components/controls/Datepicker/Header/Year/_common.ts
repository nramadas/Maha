import { fromParts, toParts } from '@/lib/date';

/**
 * In the case where the year selected results in a date that is earlier than
 * the minimum, adjust the month to accomodate.
 */
export function newYear(year: number, min: Date, view: Date) {
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

export function invalidYear(year: number, min: Date, max: Date) {
  return year < toParts(min).year || year > toParts(max).year;
}

export interface Props {
  max: Date;
  min: Date;
  view: Date;
  year: number;
  onClick(date: Date): void;
}
