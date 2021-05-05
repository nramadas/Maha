import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { FormProvider, FormValues } from '@/contexts/Form';
import { useForm } from '@/hooks/useForm';

interface Props<V> {
  children: React.ReactNode;
  onChange?(values: V): void;
  onSubmit?(values: V): void;
}

function FormInner<V extends FormValues>(props: Props<V>) {
  const { onChange, onSubmit } = props;
  const form = useForm();

  const change = useCallback(
    formValues => {
      onChange?.(formValues);
    },
    [form, onChange],
  );

  const submit = useCallback(() => {
    const values = form.getFormValues();
    onSubmit?.(values as V);
  }, [form, onSubmit]);

  useEffect(() => {
    form.onFormSubmit(submit);
    form.onFormChange(change);
    return () => {
      form.removeFormSubmit(submit);
      form.removeFormChange(change);
    };
  }, [form, change, submit]);

  return <View>{props.children}</View>;
}

export function Form<V extends FormValues>(props: Props<V>) {
  const { children, onSubmit } = props;

  return (
    <FormProvider>
      <FormInner onSubmit={onSubmit}>{children}</FormInner>
    </FormProvider>
  );
}
