import isEqual from 'lodash/isEqual';

import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

interface Option<V> {
  disabled?: boolean;
  text: Text;
  value: V;
}

export function sortOptions<V>(
  options: Option<V>[],
  textToString: ReturnType<typeof useTextToString>,
  selected?: Option<V> | null,
) {
  return options
    .filter(option => !isEqual(option.value, selected?.value))
    .sort((a, b) => {
      if (a.disabled && !b.disabled) {
        return 1;
      } else if (!a.disabled && b.disabled) {
        return -1;
      } else {
        return textToString(a.text)
          .toLocaleLowerCase()
          .localeCompare(textToString(b.text).toLocaleLowerCase());
      }
    });
}
