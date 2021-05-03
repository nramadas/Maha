import React from 'react';

import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { Person } from '@/components/icons/Person';
import { i18n } from '@/lib/translate';

interface Props
  extends Omit<
    React.ComponentProps<typeof InputWithValidation>,
    'icon' | 'label' | 'type' | '__doNotWriteToForm'
  > {
  required?: boolean;
  field: 'first' | 'middle' | 'last';
}

export function PersonName(props: Props) {
  const { field, required, ...rest } = props;

  const label =
    field === 'first'
      ? i18n.translate`first name`
      : field === 'middle'
      ? i18n.translate`middle name`
      : i18n.translate`last name`;

  const emptyError =
    field === 'first'
      ? i18n.translate`You must provide your first name`
      : field === 'middle'
      ? i18n.translate`You must provide your middle name`
      : i18n.translate`You must provide your last name`;

  return (
    <InputWithValidation
      {...rest}
      icon={<Person />}
      label={label}
      type="text"
      onValidate={required ? text => (text ? '' : emptyError) : undefined}
    />
  );
}
