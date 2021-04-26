import React, { createContext, useCallback, useRef, useState } from 'react';

interface Props {
  children?: React.ReactNode;
}

export interface FormValues {
  [name: string]: any;
}

export interface FormDetails {
  getFormValues(): FormValues;
  getValue(name: string): any;
  setValue(name: string, value: any): void;
  onFormSubmit(fn: () => void): void;
  removeFormSubmit(fn: () => void): void;
  triggerFormSubmit(): void;
}

export const FormContext = createContext<FormDetails>({
  getFormValues: () => ({}),
  getValue: () => {},
  setValue: () => {},
  onFormSubmit: () => {},
  removeFormSubmit: () => {},
  triggerFormSubmit: () => {},
});

export function FormProvider(props: Props) {
  const [formValues, setFormValues] = useState<FormValues>({});
  const callbackContainer = useRef<Set<() => void>>(new Set([]));
  const onFormSubmit = useCallback(
    (fn: () => void) => {
      callbackContainer.current.add(fn);
    },
    [callbackContainer],
  );

  const removeFormSubmit = useCallback(
    (fn: () => void) => {
      callbackContainer.current.delete(fn);
    },
    [callbackContainer],
  );

  return (
    <FormContext.Provider
      value={{
        onFormSubmit,
        removeFormSubmit,
        getFormValues: () => formValues,
        getValue: name => formValues[name],
        setValue: (name, value) =>
          setFormValues(state => ({ ...state, [name]: value })),
        triggerFormSubmit: () => {
          callbackContainer.current.forEach(fn => fn());
        },
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
}

export function NoopFormProvider(props: Props) {
  return (
    <FormContext.Provider
      value={{
        getFormValues: () => ({}),
        getValue: name => {},
        setValue: (name, value) => {},
        onFormSubmit: () => {},
        removeFormSubmit: () => {},
        triggerFormSubmit: () => {},
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
}
