import cx from 'classnames';
import React from 'react';

import { H1 } from '@/components/typography/H1';
import { H3 } from '@/components/typography/H3';
import { H5 } from '@/components/typography/H5';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export function NoAgents(props: Props) {
  return (
    <div className={cx(styles.container, props.className)}>
      <div className={styles.content}>
        <H1 className={styles.header}>
          <i18n.Translate>Buy directly from the source</i18n.Translate>
        </H1>
        <H3 className={styles.tagline}>
          <i18n.Translate>No realtors, no middlemen, no fuss</i18n.Translate>
        </H3>
        <article className={styles.explanation}>
          <H5>
            <i18n.Translate>
              Buying direct means you get the most accurate prices, the most
              up-to-date information, and your questions are answered directly
              by the property developer
            </i18n.Translate>
          </H5>
        </article>
      </div>
    </div>
  );
}
