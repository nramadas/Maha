import React, { useEffect } from 'react';
import { TextInput } from 'react-native';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, mergeMap } from 'rxjs/operators';

import { Input } from '@/components/controls/Input/index.native';

interface Props extends React.ComponentProps<typeof TextInput> {
  /**
   * Placeholder text to show inside the input
   */
  label: string;
  /**
   * Function to validate the input. First validation is performed on blur,
   * after which the input value will be validated with each change in input
   * value. The validation can be asynchronous, in which case the validator
   * should return a Promise. Signature: `(text: string) => string | Promise<string>`
   */
  onValidate?: (text: string) => string | Promise<string>;
}

/**
 * Custom input with either synchronous or asynchronous validation
 */
export function InputWithValidation(props: Props) {
  const { label, onValidate, ...rest } = props;

  const [validationCallback, error] = useEventCallback<string, string>(
    event =>
      event.pipe(
        debounceTime(150),
        mergeMap(event => {
          const result = onValidate ? onValidate(event) : '';
          return result instanceof Promise ? result : Promise.resolve(result);
        }),
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
