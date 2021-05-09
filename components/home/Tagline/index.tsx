import cx from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

import { Filled } from '@/components/controls/buttons/Filled';
import { Form } from '@/components/controls/Form';
import { Select } from '@/components/controls/Select';
import { Body1 } from '@/components/typography/Body1';
import { H1 } from '@/components/typography/H1';
import { enumToText } from '@/lib/enumToText/metropolitan';
import { enabled } from '@/lib/flags/metropolitan';
import { metropolitanRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';
import { Metropolitan } from '@/models/Metropolitan';

import styles from './index.module.scss';

const CITIES = Object.values(Metropolitan).map(m => ({
  disabled: !enabled(m),
  text: enumToText(m),
  url: metropolitanRoute(m),
}));

interface Props {
  className?: string;
}

export function Tagline(props: Props) {
  const router = useRouter();

  return (
    <>
      <H1 className={cx(styles.title, props.className)}>
        <i18n.Translate>Find the perfect home</i18n.Translate>
      </H1>
      <Form
        className={styles.cta}
        onSubmit={({ city }) => router.push(city.url)}
      >
        <Body1 className={styles.prompt}>
          <i18n.Translate>Show me homes in</i18n.Translate>
        </Body1>
        <Select name="city" options={CITIES}>
          {option =>
            option.disabled ? (
              <Body1>
                <span className={styles.disabled}>{option.text}</span>
                <span className={styles.na}>
                  <i18n.Translate>n/a</i18n.Translate>
                </span>
              </Body1>
            ) : (
              <Body1>{option.text}</Body1>
            )
          }
        </Select>
        <Filled className={styles.button}>
          <i18n.Translate>GO</i18n.Translate>
        </Filled>
      </Form>
    </>
  );
}
