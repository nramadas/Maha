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
  const [value, setValue] = useState('');

  const emptyError = i18n.translate`You must enter a rupee amount`;

  return (
    <InputWithValidation
      {...rest}
      __doNotWriteToForm
      icon={<DollarRupee />}
      type="text"
      value={value}
      onInput={e => {
        const val = e.currentTarget.value;
        const withoutSymbol = val.replaceAll('₹', '');
        const number = fromString(withoutSymbol);
        const prettyNumber = withoutSymbol
          ? number
            ? `₹${toString(number)}`
            : isNil(number)
            ? ''
            : '₹0'
          : '';
        form.setValue(rest.name, number);
        setValue(prettyNumber);
      }}
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
