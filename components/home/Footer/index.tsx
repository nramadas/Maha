import cx from 'classnames';
import React from 'react';

import { Body1 } from '@/components/typography/Body1';
import { today, toParts } from '@/lib/date';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function Footer(props: Props) {
  const { year } = toParts(today());

  return (
    <div className={cx(styles.container, props.className)}>
      <div className={styles.content}>
        <Body1>
          <i18n.Translate>
            © <i18n.Param name="year">{year}</i18n.Param> Maha
          </i18n.Translate>
        </Body1>
      </div>
    </div>
  );
}
