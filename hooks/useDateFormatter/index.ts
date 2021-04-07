import { useRef } from 'react';

/**
 * Placeholder for an i18n friendly date formatter
 */
export function useDateFormatter(format: Intl.DateTimeFormatOptions) {
  const formatter = useRef(new Intl.DateTimeFormat('default', format));
  return [(date: Date) => formatter.current.format(date)];
}
