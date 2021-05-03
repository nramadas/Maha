import React, { useContext } from 'react';

import { Filled, Hollow } from '@/components/controls/buttons';
import { Body1 } from '@/components/typography/Body1';
import { H6 } from '@/components/typography/H6';
import { ConfirmationContext } from '@/contexts/Confirmation';
import { useTextToString } from '@/hooks/useTextToString';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export function useConfirmation() {
  const { open, close } = useContext(ConfirmationContext);
  const textToString = useTextToString();

  return (prompt?: ReturnType<typeof i18n.translate> | string) =>
    new Promise(res => {
      const content = textToString(prompt || i18n.translate`Are you sure?`);

      open(
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <header className={styles.header}>
              <H6>
                <i18n.Translate>Confirm</i18n.Translate>
              </H6>
            </header>
            <article className={styles.content}>
              <Body1>{content}</Body1>
            </article>
            <footer className={styles.footer}>
              <div />
              <Hollow
                onClick={() => {
                  close();
                }}
              >
                <i18n.Translate>Cancel</i18n.Translate>
              </Hollow>
              <Filled
                onClick={() => {
                  close();
                  res(true);
                }}
              >
                <i18n.Translate>Yes</i18n.Translate>
              </Filled>
            </footer>
          </div>
        </div>,
      );
    });
}
