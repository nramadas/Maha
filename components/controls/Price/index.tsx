import isNil from 'lodash/isNil';
import React, { useState } from 'react';

import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { DollarRupee } from '@/components/icons/DollarRupee';
import { useForm } from '@/hooks/useForm';
import { toString, fromString } from '@/lib/number';
import { i18n } from '@/lib/translate';

interface Props
  extends Omit<
    React.ComponentProps<typeof InputWithValidation>,
    'icon' | 'type' | '__doNotWriteForm'
  > {}

export function Price(props: Props) {
  const { required, ...rest } = props;
  const form = useForm();
  const _value = rest.value || form.getValue(rest.name);
  const value = _value ? toString(_value) : isNil(_value) ? '' : '0';

  const emptyError = i18n.translate`You must enter a rupee amount`;

  return (
    <InputWithValidation
      {...rest}
      __doNotWriteToForm
      icon={<DollarRupee />}
      type="text"
      value={value ? `₹${value}` : ''}
      onInput={e => {
        const val = e.currentTarget.value;
        const withoutSymbol = val.replaceAll('₹', '');
        const number = fromString(withoutSymbol, true);
        form.setValue(rest.name, number);
      }}
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
