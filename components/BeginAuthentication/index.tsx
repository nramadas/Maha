import { gql } from '@urql/core';
import cx from 'classnames';
import React, { useState } from 'react';
import { useMutation } from 'urql';

import { Filled } from '@/components/controls/buttons/Filled';
import { Form } from '@/components/controls/Form';
import { InputWithValidation } from '@/components/controls/InputWithValidation';
import { Body1 } from '@/components/typography/Body1';
import { H4 } from '@/components/typography/H4';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

const beginAuthenticationMutation = gql`
  mutation($email: String!) {
    beginAuthentication(email: $email) {
      ok
    }
  }
`;

interface Props {
  className?: string;
  onComplete?(): void;
}

export function BeginAuthentication(props: Props) {
  const [enabled, setEnabled] = useState(false);
  const [result, beginAuthentication] = useMutation(
    beginAuthenticationMutation,
  );

  return (
    <div className={cx(styles.container, props.className)}>
      <H4 className={styles.title}>
        {!result.data ? (
          <i18n.Translate>Log in / Sign up</i18n.Translate>
        ) : (
          <i18n.Translate>Success!</i18n.Translate>
        )}
      </H4>
      {!result.data ? (
        <Form
          className={styles.content}
          onSubmit={({ email }) => beginAuthentication({ email })}
        >
          <InputWithValidation
            className={styles.input}
            name="email"
            label="email"
            onInput={e => setEnabled(!!e.currentTarget.value)}
            onValidate={text =>
              !text ? i18n.translate`You must provide an email` : ''
            }
          />
          <Filled className={styles.button} disabled={!enabled} type="submit">
            Submit
          </Filled>
        </Form>
      ) : (
        <div className={styles.content}>
          <Body1 className={styles.success}>
            <i18n.Translate>
              Please check your email to complete the log in process
            </i18n.Translate>
          </Body1>
        </div>
      )}
    </div>
  );
}
