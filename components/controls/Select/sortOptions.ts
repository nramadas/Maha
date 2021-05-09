import isEqual from 'lodash/isEqual';

import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

interface Option {
  disabled?: boolean;
  text: Text;
}

export function sortOptions<O extends Option>(
  options: O[],
  textToString: ReturnType<typeof useTextToString>,
  selected?: O | null,
) {
  return options
    .filter(
      option =>
        !isEqual(
          textToString(option.text),
          selected ? textToString(selected.text) : null,
        ),
    )
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
