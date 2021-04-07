const DAY_MS = 1000 * 60 * 60 * 24;

export interface Parts {
  day: number;
  month: number;
  year: number;
}

/**
 * Returns a new `Date`. The month and year will match the input date's, but
 * the day will be the first..
 */
export function firstOfTheMonth(date: Date) {
  return fromParts({ ...toParts(date), day: 1 });
}

/**
 * Converts date parts to a `Date` object
 */
export function fromParts(date: Parts) {
  const newDate = new Date(0);
  newDate.setDate(date.day);
  newDate.setFullYear(date.year);
  newDate.setMonth(date.month);
  return newDate;
}

/**
 * Given two dates, determines if the first's month is before the second's
 * month.
 */
export function monthIsBefore(date: Date, compare: Date) {
  const _date = toParts(date);
  const _compare = toParts(compare);

  if (_date.year < _compare.year) {
    return true;
  }

  if (_date.year === _compare.year) {
    return _date.month < _compare.month;
  }

  return false;
}

/**
 * Returns a new date by applying a delta to it
 */
export function patch(date: Date, delta: Partial<Parts>) {
  const {
    day: dayDelta = 0,
    month: monthDelta = 0,
    year: yearDelta = 0,
  } = delta;
  // since months can have different days, we're going to account for changes
  // by converting to ms
  let time = date.getTime();
  time += dayDelta * DAY_MS;

  // convert back to a date, and adjust the months and years
  const p = toParts(new Date(time));
  const day = p.day;
  let month = p.month;
  let year = p.year;

  month += monthDelta;
  const adjustYear = Math.ceil(Math.abs(month) / 12);

  if (month < 0) {
    year -= adjustYear;
    month += adjustYear * 12;
  }

  if (month > 11) {
    year += adjustYear;
    month -= adjustYear * 12;
  }

  year += yearDelta;

  return fromParts({ day, month, year });
}

/**
 * Returns today, but rounds down to the first hour of the day
 */
export function today() {
  return fromParts(toParts(new Date()));
}

/**
 * Splits a date into day, month, and year values
 */
export function toParts(date: Date): Parts {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return { day, month, year };
}
