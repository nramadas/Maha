import React from 'react';

import { H4 } from '@/components/typography/H4';
import { Overline } from '@/components/typography/Overline';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';
import { Member, MemberModel, MemberRole } from './Member';

interface Props {
  allRoles: MemberRole[];
  className?: string;
  members: MemberModel[];
  onChangeRoles(id: MemberModel['id'], roles: MemberRole[]): void;
}

export function Members(props: Props) {
  return (
    <div className={styles.container}>
      <header>
        <H4>
          <i18n.Translate>Members</i18n.Translate>
        </H4>
      </header>
      <article className={styles.grid}>
        <Overline className={styles.gridHeader}>
          <i18n.Translate>email</i18n.Translate>
        </Overline>
        <Overline className={styles.gridHeader}>
          <i18n.Translate>first name</i18n.Translate>
        </Overline>
        <Overline className={styles.gridHeader}>
          <i18n.Translate>last name</i18n.Translate>
        </Overline>
        <Overline className={styles.gridHeader}>
          <i18n.Translate>phone number</i18n.Translate>
        </Overline>
        <Overline className={styles.gridHeader}>
          <i18n.Translate>roles</i18n.Translate>
        </Overline>
        {props.members.map(member => (
          <Member
            allRoles={props.allRoles}
            key={member.email}
            member={member}
            onChangeRoles={roles => props.onChangeRoles(member.id, roles)}
          />
        ))}
      </article>
    </div>
  );
}
