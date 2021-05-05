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
  onFormChange(fn: (values: FormValues) => void): void;
  onFormSubmit(fn: () => void): void;
  removeFormChange(fn: (values: FormValues) => void): void;
  removeFormSubmit(fn: () => void): void;
  triggerFormSubmit(): void;
}

export const FormContext = createContext<FormDetails>({
  getFormValues: () => ({}),
  getValue: () => {},
  setValue: () => {},
  onFormChange: () => {},
  onFormSubmit: () => {},
  removeFormChange: () => {},
  removeFormSubmit: () => {},
  triggerFormSubmit: () => {},
});

export function FormProvider(props: Props) {
  const [formValues, setFormValues] = useState<FormValues>({});
  const submitCallbackContainer = useRef<Set<() => void>>(new Set([]));
  const changeCallbackContainer = useRef<Set<(values: FormValues) => void>>(
    new Set([]),
  );

  const onFormSubmit = useCallback(
    (fn: () => void) => {
      submitCallbackContainer.current.add(fn);
    },
    [submitCallbackContainer],
  );

  const onFormChange = useCallback(
    (fn: (values: FormValues) => void) => {
      changeCallbackContainer.current.add(fn);
    },
    [changeCallbackContainer],
  );

  const removeFormSubmit = useCallback(
    (fn: () => void) => {
      submitCallbackContainer.current.delete(fn);
    },
    [submitCallbackContainer],
  );

  const removeFormChange = useCallback(
    (fn: (values: FormValues) => void) => {
      changeCallbackContainer.current.delete(fn);
    },
    [changeCallbackContainer],
  );

  return (
    <FormContext.Provider
      value={{
        onFormChange,
        onFormSubmit,
        removeFormChange,
        removeFormSubmit,
        getFormValues: () => formValues,
        getValue: name => formValues[name],
        setValue: (name, value) => {
          const newFormValues = { ...formValues, [name]: value };
          changeCallbackContainer.current.forEach(fn => fn(newFormValues));
          setFormValues(newFormValues);
        },
        triggerFormSubmit: () => {
          submitCallbackContainer.current.forEach(fn => fn());
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
