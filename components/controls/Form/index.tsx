import React, { FormEvent, useCallback, useEffect } from 'react';

import { FormProvider, FormValues } from '@/contexts/Form';
import { useForm } from '@/hooks/useForm';

interface Props<V> {
  className?: string;
  children?: React.ReactNode;
  defaultValues?: V;
  onChange?(values: V): void;
  onSubmit?(values: V): void;
}

function FormInner<V extends FormValues>(props: Props<V>) {
  const { onChange, onSubmit, className, children, defaultValues } = props;
  const form = useForm();

  const change = useCallback(
    formValues => {
      onChange?.(formValues);
    },
    [form, onChange],
  );

  useEffect(() => {
    form.onFormChange(change);
    return () => {
      form.removeFormChange(change);
    };
  }, [form, change]);

  useEffect(() => {
    if (defaultValues) {
      form.setFormValues(defaultValues);
    }
  }, []);

  const onSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formValues = form.getFormValues();
      onSubmit?.(formValues as V);
    },
    [onSubmit, form],
  );

  return (
    <form className={className} onSubmit={onSubmitForm}>
      {children}
    </form>
  );
}

export function Form<V extends FormValues>(props: Props<V>) {
  const { children, className, defaultValues, onChange, onSubmit } = props;

  return (
    <FormProvider>
      <FormInner
        className={className}
        defaultValues={defaultValues}
        onChange={onChange}
        onSubmit={onSubmit}
      >
        {children}
      </FormInner>
    </FormProvider>
  );
}
