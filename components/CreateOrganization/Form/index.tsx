import React, { useState } from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { Form as FormControl } from '@/components/controls/Form';
import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { Body1 } from '@/components/typography/Body1';
import { H1 } from '@/components/typography/H1';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { getMessage } from '@/lib/errors/getMessage';
import { ErrorType } from '@/lib/errors/type';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface FormValues {
  name: string;
}

interface Props {
  error?: ErrorType;
  onSubmit(values: FormValues): void;
}

export function Form(props: Props) {
  const [name, setName] = useState('');
  const languagePack = useLanguagePack();
  const errorMessage = props.error && getMessage(props.error)(languagePack);

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
            Before you can get started, please take a moment to register your
            company with us. Once you register, you'll be able to add
            properties, employees, and much more.
          </i18n.Translate>
        </Body1>
        <InputWithValidation
          className={styles.input}
          error={errorMessage}
          name="name"
          label="Your Company's Name"
          onInput={e => setName(e.currentTarget.value)}
          onValidate={text =>
            !text.length
              ? i18n.translate`You must enter your company's name`(languagePack)
              : ''
          }
        />
      </article>
      <footer className={styles.footer}>
        <Filled disabled={!name} type="submit">
          <i18n.Translate>Submit</i18n.Translate>
        </Filled>
      </footer>
    </FormControl>
  );
}
