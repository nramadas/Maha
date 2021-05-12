import { gql } from '@urql/core';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useQuery } from 'urql';

import { Gear } from '@/components/icons/Gear';
import { Open } from '@/components/icons/Open';
import { Person } from '@/components/icons/Person';
import { Body1 } from '@/components/typography/Body1';
import { useTooltip } from '@/hooks/useTooltip';
import { Route } from '@/lib/route';
import { storage } from '@/lib/storage';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

const meQuery = gql`
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
  theme?: 'light' | 'dark';
}

export function Account(props: Props) {
  const { className, theme } = props;

  const router = useRouter();

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    positionOffset: 4,
    preventTooltipClickPropagation: true,
    type: 'click',
  });

  const [result] = useQuery({ query: meQuery });

  const colors = theme || 'light';

  if (!result.data || result.error || !result.data.me) {
    const currentPath =
      typeof window === 'undefined' ? undefined : window.location.pathname;

    return (
      <a
        className={cx(styles.container, className, {
          [styles.light]: colors === 'light',
          [styles.dark]: colors === 'dark',
        })}
        href={Route.Login}
        onClick={e => {
          e.preventDefault();
          storage.set('redirectUrl', currentPath).then(() => {
            router.push(Route.Login);
          });
        }}
      >
        <Person className={styles.personIcon} />
        <Body1>
          <i18n.Translate>Log in</i18n.Translate>
        </Body1>
      </a>
    );
  }

  const name = result.data.me.firstName || result.data.me.email;

  return (
    <>
      <Target>
        <button
          className={cx(styles.container, className, {
            [styles.light]: colors === 'light',
            [styles.dark]: colors === 'dark',
          })}
        >
          <Person className={styles.personIcon} />
          <Body1>{name}</Body1>
        </button>
      </Target>
      <Tooltip>
        <div className={styles.menu}>
          <Link href={Route.AccountSettings}>
            <a className={styles.menuItem}>
              <Gear className={styles.icon} />
              <Body1>
                <i18n.Translate>Settings</i18n.Translate>
              </Body1>
            </a>
          </Link>
          <Link href={Route.Logout}>
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
