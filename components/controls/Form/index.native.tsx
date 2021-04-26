import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { FormProvider } from '@/contexts/Form';
import { useForm } from '@/hooks/useForm';

interface FormValues {
  [name: string]: string | string[] | boolean;
}

interface Props {
  children: React.ReactNode;
  onSubmit(values: FormValues): void;
}

function FormInner(props: Props) {
  const { onSubmit } = props;
  const form = useForm();

  const submit = useCallback(() => {
    const values = form.getFormValues();
    onSubmit(values);
  }, [form, onSubmit]);

  useEffect(() => {
    form.onFormSubmit(submit);
    return () => form.removeFormSubmit(submit);
  }, [form, submit]);

  return <View>{props.children}</View>;
}

export function Form(props: Props) {
  const { children, onSubmit } = props;

  return (
    <FormProvider>
      <FormInner onSubmit={onSubmit}>{children}</FormInner>
    </FormProvider>
  );
}
