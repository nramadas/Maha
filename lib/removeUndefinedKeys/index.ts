import isUndefined from 'lodash/isUndefined';

interface Input {
  [key: string]: any;
}

export function removeUndefinedKeys<O extends Input>(obj: O): Partial<O> {
  return Object.keys(obj).reduce((acc, key: keyof O) => {
    const value = obj[key];

    if (!isUndefined(value)) {
      acc[key] = value;
    }

    return acc;
  }, {} as Partial<O>);
}
