import isNil from 'lodash/isNil';
import React, { useState } from 'react';

import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { useForm } from '@/hooks/useForm';
import { toString, fromString } from '@/lib/number';
import { i18n } from '@/lib/translate';

interface Props
  extends Omit<
    React.ComponentProps<typeof InputWithValidation>,
    'type' | '__doNotWriteToForm'
  > {
  required?: boolean;
}

export function Number(props: Props) {
  const { required, ...rest } = props;
  const form = useForm();
  const [value, setValue] = useState('');

  const emptyError = i18n.translate`You must enter a number`;

  return (
    <InputWithValidation
      {...rest}
      __doNotWriteToForm
      type="text"
      value={value}
      onInput={e => {
        const val = e.currentTarget.value;
        const number = fromString(val);
        const prettyNumber = val
          ? number
            ? toString(number)
            : isNil(number)
            ? ''
            : '0'
          : '';
        form.setValue(rest.name, number);
        setValue(prettyNumber);
      }}
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
