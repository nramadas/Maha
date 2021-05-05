import React from 'react';
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime, map, mergeMap } from 'rxjs/operators';

import { Input } from '@/components/controls/Input';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

interface Props extends React.ComponentProps<typeof Input> {
  /**
   * Function to validate the input. First validation is performed on blur,
   * after which the input value will be validated with each change in input
   * value. The validation can be asynchronous, in which case the validator
   * should return a Promise. Signature: `(text: string) => string | Promise<string>`
   */
  onValidate?: (text: string) => Text | Promise<Text>;
}

/**
 * Custom input with either synchronous or asynchronous validation
 */
export function InputWithValidation(props: Props) {
  const {
    className,
    disabled,
    error,
    icon,
    label,
    name,
    style,
    type,
    onValidate,
    ...rest
  } = props;
  const textToString = useTextToString();

  const [validationCallback, validationError] = useEventCallback<
    string,
    string
  >(
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

  return (
    <Input
      {...rest}
      className={className}
      disabled={disabled}
      error={error || validationError}
      icon={icon}
      label={label}
      name={name}
      style={style}
      type={type}
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
