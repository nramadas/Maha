import isEqual from 'lodash/isEqual';

interface Option {
  text: string;
}

export function sortOptions<O extends Option>(
  options: O[],
  selected?: O | null,
) {
  return options
    .filter(option => !isEqual(option, selected))
    .sort((a, b) => {
      return a.text
        .toLocaleLowerCase()
        .localeCompare(b.text.toLocaleLowerCase());
    });
}
