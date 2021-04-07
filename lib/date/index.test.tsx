import * as fns from './index';

test('firstOfTheMonth', () => {
  const testDate = new Date(0);
  testDate.setDate(22);
  testDate.setMonth(2);
  testDate.setFullYear(2020);

  const first = fns.firstOfTheMonth(testDate);

  expect(first.getDate()).not.toEqual(testDate.getDate());
  expect(first.getDate()).toEqual(1);
  expect(first.getMonth()).toEqual(testDate.getMonth());
  expect(first.getFullYear()).toEqual(testDate.getFullYear());
});

test('fromParts', () => {
  const day = 2;
  const month = 2;
  const year = 2020;

  const date = fns.fromParts({ day, month, year });

  expect(date instanceof Date).toBeTruthy();
  expect(date.getDate()).toEqual(day);
  expect(date.getMonth()).toEqual(month);
  expect(date.getFullYear()).toEqual(year);
});

test('monthIsBefore', () => {
  const date1 = new Date();
  const date2 = new Date();
  date2.setMonth(date1.getMonth() - 1);

  expect(fns.monthIsBefore(date1, date2)).toBeFalsy();
  expect(fns.monthIsBefore(date2, date1)).toBeTruthy();
  expect(fns.monthIsBefore(date1, date1)).toBeFalsy();
  expect(fns.monthIsBefore(date2, date2)).toBeFalsy();
});

test('patch', () => {
  // TODO
});

test('today', () => {
  const date1 = fns.today();
  const date2 = new Date();

  expect(date1.getFullYear()).toEqual(date2.getFullYear());
  expect(date1.getMonth()).toEqual(date2.getMonth());
  expect(date1.getDate()).toEqual(date2.getDate());
  expect(date1.getTime()).not.toEqual(date2.getTime());
});

test('toParts', () => {
  const date = new Date();
  const parts = fns.toParts(date);

  expect(parts instanceof Date).not.toBeTruthy();
  expect(date.getDate()).toEqual(parts.day);
  expect(date.getMonth()).toEqual(parts.month);
  expect(date.getFullYear()).toEqual(parts.year);
});
