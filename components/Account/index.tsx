import cx from 'classnames';
import Link from 'next/link';
import React from 'react';
import { useQuery } from 'urql';

import { Gear } from '@/components/icons/Gear';
import { Open } from '@/components/icons/Open';
import { Person } from '@/components/icons/Person';
import { Body1 } from '@/components/typography/Body1';
import { useTooltip } from '@/hooks/useTooltip';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

const me = `
  query {
    me {
      id
      email
      firstName
      preferredLanguage
    }
  }
`;

interface Props {
  className?: string;
}

export function Account(props: Props) {
  const { className } = props;

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    positionOffset: -1,
    preventTooltipClickPropagation: true,
    type: 'click',
  });

  const [result] = useQuery({ query: me });

  if (result.fetching || !result.data || result.error) {
    return null;
  }

  const name = result.data.me.firstName || result.data.me.email;

  return (
    <>
      <Target>
        <button className={cx(styles.container, className)}>
          <Person className={styles.personIcon} />
          <Body1>{name}</Body1>
        </button>
      </Target>
      <Tooltip>
        <div className={styles.menu}>
          <Link href="/account/settings">
            <a className={styles.menuItem}>
              <Gear className={styles.icon} />
              <Body1>
                <i18n.Translate>Settings</i18n.Translate>
              </Body1>
            </a>
          </Link>
          <Link href="/logout">
            <a className={styles.menuItem}>
              <Open className={styles.icon} />
              <Body1>
                <i18n.Translate>Logout</i18n.Translate>
              </Body1>
            </a>
          </Link>
        </div>
      </Tooltip>
    </>
  );
}
