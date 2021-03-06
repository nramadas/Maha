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
  > {
  noIcon?: boolean;
}

export function Price(props: Props) {
  const { noIcon, required, ...rest } = props;
  const form = useForm();
  const [fractional, setFractional] = useState(false);
  const _value = rest.value || form.getValue(rest.name);
  const value = _value ? toString(_value) : isNil(_value) ? '' : '0';

  const emptyError = i18n.translate`You must enter a rupee amount`;

  return (
    <InputWithValidation
      {...rest}
      __doNotWriteToForm
      icon={noIcon ? undefined : <DollarRupee />}
      type="text"
      value={value ? `₹${value}${fractional ? '.' : ''}` : ''}
      onInput={e => {
        const val = e.currentTarget.value;
        const hasDot = val.includes('.');
        const [, decimal] = val.split('.');
        const withoutSymbol = val.replaceAll('₹', '');
        const number = fromString(withoutSymbol, true);
        setFractional(hasDot && !decimal);
        form.setValue(rest.name, number);
      }}
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
