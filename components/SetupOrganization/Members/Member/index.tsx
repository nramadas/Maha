import React from 'react';

import { PickGrow } from '@/components/controls/chips/PickGrow';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { roleName } from '@/lib/roleName';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Role } from '@/models/Role';
import { User } from '@/models/User';

import styles from './index.module.scss';

export type MemberRole = Pick<Role, 'id' | 'name'>;
export type MemberModel = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName' | 'phoneNumber'
> & {
  roles: MemberRole[];
};

interface Props {
  allRoles: MemberRole[];
  member: MemberModel;
  onChangeRoles(roles: MemberRole[]): void;
}

export function Member(props: Props) {
  const { allRoles, member, onChangeRoles } = props;
  const languagePack = useLanguagePack();

  const selectedChoices = member.roles.map(role => ({
    disabled: role.name === CommonRoleType.Owner,
    id: role.id,
    text: roleName(role, languagePack),
  }));

  const roleChoices = allRoles
    .filter(role => role.name !== CommonRoleType.Owner)
    .map(role => ({
      disabled: role.name === CommonRoleType.Owner,
      id: role.id,
      text: roleName(role, languagePack),
    }));

  return (
    <>
      <div className={styles.email}>{member.email}</div>
      <div className={styles.firstName}>{member.firstName || ''}</div>
      <div className={styles.lastName}>{member.lastName || ''}</div>
      <div className={styles.phoneNumber}>{member.phoneNumber || ''}</div>
      <div className={styles.roles}>
        <PickGrow
          defaultSelected={selectedChoices}
          choices={roleChoices}
          name="roles"
          onChoose={choices =>
            onChangeRoles(choices.map(({ id, text }) => ({ id, name: text })))
          }
        />
      </div>
    </>
  );
}
