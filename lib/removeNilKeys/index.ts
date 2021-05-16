import isNil from 'lodash/isNil';

interface Input {
  [key: string]: any;
}

export function removeNilKeys<O extends Input>(obj: O): Partial<O> {
  return Object.keys(obj).reduce((acc, key: keyof O) => {
    const value = obj[key];

    if (!isNil(value)) {
      acc[key] = value;
    }

    return acc;
  }, {} as Partial<O>);
}
