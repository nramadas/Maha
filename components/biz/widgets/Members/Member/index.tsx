import { gql } from '@urql/core';
import cx from 'classnames';
import React from 'react';
import { useMutation } from 'urql';

import { PickGrow } from '@/components/controls/chips/PickGrow';
import { Trash } from '@/components/icons/Trash';
import { Body1 } from '@/components/typography/Body1';
import { Body2 } from '@/components/typography/Body2';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { name as roleName } from '@/lib/role/name';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Role } from '@/models/Role';
import { User } from '@/models/User';

import styles from './index.module.scss';

const setRoles = gql`
  mutation($userId: ID!, $roleIds: [ID!]!) {
    setUserRoles(userId: $userId, roleIds: $roleIds) {
      id
    }
  }
`;

export type MemberRole = Pick<Role, 'id' | 'name'>;
export type MemberModel = Pick<
  User,
  'id' | 'email' | 'firstName' | 'lastName' | 'phoneNumber'
> & {
  roles: MemberRole[];
};

interface Props {
  allRoles: MemberRole[];
  canManageMembers?: boolean;
  canModifyRoles?: boolean;
  last?: boolean;
  member: MemberModel;
}

export function Member(props: Props) {
  const { allRoles, canManageMembers, canModifyRoles, member } = props;
  const languagePack = useLanguagePack();
  const [, setUserRoles] = useMutation(setRoles);
  const isOwner = !!(member.roles || []).find(
    role => role.name === CommonRoleType.Owner,
  );

  const selectedChoices = (member.roles || []).map(role => ({
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
      <div
        className={cx(styles.email, {
          [styles.notLast]: !props.last,
        })}
      >
        <Body1>{member.email}</Body1>
      </div>
      <div
        className={cx(styles.firstName, styles.middle, {
          [styles.notLast]: !props.last,
        })}
      >
        <Body2>{member.firstName || ''}</Body2>
      </div>
      <div
        className={cx(styles.lastName, styles.middle, {
          [styles.notLast]: !props.last,
        })}
      >
        <Body2>{member.lastName || ''}</Body2>
      </div>
      <div
        className={cx(styles.phoneNumber, {
          [styles.middle]: canModifyRoles || canManageMembers,
          [styles.notLast]: !props.last,
        })}
      >
        <Body2>{member.phoneNumber || ''}</Body2>
      </div>
      {canModifyRoles && (
        <div
          className={cx(styles.roles, {
            [styles.middle]: canManageMembers,
            [styles.notLast]: !props.last,
          })}
        >
          <PickGrow
            defaultSelected={selectedChoices}
            choices={roleChoices}
            name="roles"
            onChoose={choices => {
              setUserRoles({
                userId: props.member.id,
                roleIds: choices.map(c => c.id),
              });
            }}
          />
        </div>
      )}
      {canManageMembers &&
        (isOwner ? (
          <div />
        ) : (
          <div className={styles.delete}>
            <Trash className={styles.trash} />
          </div>
        ))}
    </>
  );
}
