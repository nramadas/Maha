import React, { useEffect } from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import { Input } from '@/components/controls/Input/index.native';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

interface Props extends React.ComponentProps<typeof Input> {
  /**
   * Function to validate the input. First validation is performed on blur,
   * after which the input value will be validated with each change in input
   * value. The validation can be asynchronous, in which case the validator
   * should return a Promise. Signature: `(text: string) => string | Promise<string>`
   */
  onValidate?: (text: string) => string | Promise<Text>;
}

/**
 * Custom input with either synchronous or asynchronous validation
 */
export function InputWithValidation(props: Props) {
  const { label, name, onValidate, ...rest } = props;
  const textToString = useTextToString();

  const [validationCallback, error] = useEventCallback<string, string>(
    event =>
      event.pipe(
        debounceTime(150),
        mergeMap(event => {
          const result = onValidate ? onValidate(event) : '';
          return result instanceof Promise
            ? result.then(text => ({ text: textToString(text) }))
            : Promise.resolve({ text: textToString(result) });
        }),
        map(({ text }) => text),
      ),
    '',
  );

  const firstBlur = React.useRef(false);

  useEffect(() => {
    if (firstBlur.current && rest.value) {
      validationCallback(rest.value);
    }
  }, [rest.value, firstBlur]);

  return (
    <Input
      {...rest}
      error={error}
      label={label}
      name={name}
      onBlur={e => {
        if (!firstBlur.current && rest.value) {
          firstBlur.current = true;
          validationCallback(rest.value);
        }

        rest.onBlur?.(e);
      }}
    />
  );
}
