import React from 'react';

import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { Phone } from '@/components/icons/Phone';
import { useForm } from '@/hooks/useForm';
import { i18n } from '@/lib/translate';

function _formatPhoneNumber(phoneNumber: string) {
  return phoneNumber;
}

interface Props
  extends Omit<
    React.ComponentProps<typeof InputWithValidation>,
    'icon' | 'label' | 'type' | '__doNotWriteToForm'
  > {
  required?: boolean;
}

export function PhoneNumber(props: Props) {
  const { required, ...rest } = props;
  const form = useForm();
  const value = rest.value || form.getValue(rest.name) || '';

  const label = i18n.translate`phone number`;
  const emptyError = i18n.translate`You must provide a phone number`;

  return (
    <InputWithValidation
      {...rest}
      __doNotWriteToForm
      icon={<Phone />}
      label={label}
      type="tel"
      value={_formatPhoneNumber(value)}
      onInput={e => {
        const value = e.currentTarget.value;
        form.setValue(props.name, value);
        rest.onInput?.(e);
      }}
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
