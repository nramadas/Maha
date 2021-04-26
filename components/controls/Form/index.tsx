import React, { FormEvent, useCallback } from 'react';

import { FormProvider, FormValues } from '@/contexts/Form';
import { useForm } from '@/hooks/useForm';

interface Props<V> {
  className?: string;
  children?: React.ReactNode;
  onSubmit(values: V): void;
}

function FormInner<V extends FormValues>(props: Props<V>) {
  const { onSubmit, ...rest } = props;
  const form = useForm();

  const onSubmitForm = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formValues = form.getFormValues();
      onSubmit(formValues as V);
    },
    [onSubmit, form],
  );

  return (
    <form {...rest} onSubmit={onSubmitForm}>
      {props.children}
    </form>
  );
}

export function Form<V extends FormValues>(props: Props<V>) {
  const { children, className, onSubmit } = props;

  return (
    <FormProvider>
      <FormInner className={className} onSubmit={onSubmit}>
        {children}
      </FormInner>
    </FormProvider>
  );
}
