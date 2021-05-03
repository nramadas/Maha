import cx from 'classnames';
import React from 'react';

import { Body1 } from '@/components/typography/Body1';
import { Body2 } from '@/components/typography/Body2';
import { H6 } from '@/components/typography/H6';
import { Overline } from '@/components/typography/Overline';
import { useTextToString } from '@/hooks/useTextToString';
import { name as roleName } from '@/lib/role/name';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export interface Invite {
  email: string;
  roles: {
    name: string;
  }[];
}

interface Props {
  className?: string;
  invites: Invite[];
}

export function Invites(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={props.className}>
      <H6>
        <i18n.Translate>Sent invites</i18n.Translate>
      </H6>
      <div className={styles.grid}>
        <div className={styles.gridHeader}>
          <Overline>
            <i18n.Translate>email</i18n.Translate>
          </Overline>
        </div>
        <div className={styles.gridHeader}>
          <Overline>
            <i18n.Translate>roles</i18n.Translate>
          </Overline>
        </div>
        {props.invites.map((invite, i) => (
          <React.Fragment key={invite.email}>
            <div
              className={cx(styles.email, {
                [styles.notLast]: i < props.invites.length - 1,
              })}
            >
              <Body1>{invite.email}</Body1>
            </div>
            <div
              className={cx(styles.roles, {
                [styles.notLast]: i < props.invites.length - 1,
              })}
            >
              <Body2>
                {invite.roles
                  .map(role => textToString(roleName(role)))
                  .join(', ')}
              </Body2>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
