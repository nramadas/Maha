import isNil from 'lodash/isNil';
import React from 'react';

import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { useForm } from '@/hooks/useForm';
import { toString, fromString } from '@/lib/number';
import { i18n } from '@/lib/translate';

interface Props
  extends Omit<
    React.ComponentProps<typeof InputWithValidation>,
    'type' | '__doNotWriteToForm' | 'value'
  > {
  required?: boolean;
  value?: number;
}

export function Number(props: Props) {
  const { required, ...rest } = props;
  const form = useForm();
  const _value = rest.value || form.getValue(rest.name);
  const value = _value ? toString(_value) : isNil(_value) ? '' : '0';

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
        form.setValue(rest.name, number);
      }}
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
