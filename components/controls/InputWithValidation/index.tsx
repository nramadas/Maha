import React from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, mergeMap } from 'rxjs/operators';

import { Input } from '@/components/controls/Input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Display an icon on the right hand side of the input field
   */
  icon?: React.ReactElement;
  /**
   * Placeholder text to show inside the input
   */
  label: string;
  /**
   * Reference name for input value
   */
  name: string;
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
  const { onValidate, ...rest } = props;

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

  return (
    <Input
      {...rest}
      error={error}
      onBlur={e => {
        if (!firstBlur.current) {
          firstBlur.current = true;
          validationCallback(e.currentTarget.value);
        }

        rest.onBlur && rest.onBlur(e);
      }}
      onInput={e => {
        if (firstBlur.current) {
          validationCallback(e.currentTarget.value);
        }

        rest.onInput && rest.onInput(e);
      }}
    />
  );
}
