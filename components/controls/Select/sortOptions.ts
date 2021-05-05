import isEqual from 'lodash/isEqual';

import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

interface Option {
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
      return textToString(a.text)
        .toLocaleLowerCase()
        .localeCompare(textToString(b.text).toLocaleLowerCase());
    });
}
