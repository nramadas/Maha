import React, { useState } from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { ErrorText } from '@/components/controls/ErrorText';
import { Form as FormControl } from '@/components/controls/Form';
import { PersonName } from '@/components/controls/PersonName';
import { PhoneNumber } from '@/components/controls/PhoneNumber';
import { Body1 } from '@/components/typography/Body1';
import { H1 } from '@/components/typography/H1';
import { useTextToString } from '@/hooks/useTextToString';
import { getMessage } from '@/lib/errors/getMessage';
import { ErrorType } from '@/lib/errors/type';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface Props {
  error?: ErrorType;
  onSubmit(values: FormValues): void;
}

export function Form(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const textToString = useTextToString();

  const errorMessage = props.error && textToString(getMessage(props.error));

  return (
    <FormControl className={styles.container} onSubmit={props.onSubmit}>
      <header className={styles.header}>
        <H1>
          <i18n.Translate>Welcome to Maha!</i18n.Translate>
        </H1>
      </header>
      <article className={styles.body}>
        <Body1>
          <i18n.Translate>
            Before you can be added as a member of your company, you must
            provide a few details.
          </i18n.Translate>
        </Body1>
        <div className={styles.twoCol}>
          <PersonName
            required
            name="firstName"
            field="first"
            onInput={e => setFirstName(e.currentTarget.value)}
          />
          <PersonName
            required
            name="lastName"
            field="last"
            onInput={e => setLastName(e.currentTarget.value)}
          />
        </div>
        <PhoneNumber
          required
          name="phoneNumber"
          onInput={e => setPhoneNumber(e.currentTarget.value)}
        />
      </article>
      <footer className={styles.footer}>
        <Filled
          disabled={!firstName || !lastName || !phoneNumber}
          type="submit"
        >
          <i18n.Translate>Submit</i18n.Translate>
        </Filled>
      </footer>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </FormControl>
  );
}
