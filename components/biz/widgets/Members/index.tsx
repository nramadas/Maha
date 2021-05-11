import { gql } from '@urql/core';
import cx from 'classnames';
import React from 'react';
import { useQuery } from 'urql';

import { H4 } from '@/components/typography/H4';
import { Overline } from '@/components/typography/Overline';
import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Permission } from '@/models/Permission';
import { Role } from '@/models/Role';

import styles from './index.module.scss';
import { Member, MemberModel } from './Member';

const getOrganization = (canModifyRoles?: boolean) => gql`
  query {
    me {
      id
      organization {
        id
        members {
          id
          email
          firstName
          lastName
          phoneNumber
          ${
            canModifyRoles
              ? `
          roles {
            id
            name
          }
          `
              : ''
          }
        }
        ${
          canModifyRoles
            ? `
        roles {
          id
          name
        }
        `
            : ''
        }
      }
    }
  }
`;

function buildRoles<R extends Pick<Role, 'name'>>(roles: R[]) {
  return roles.sort((a, b) => {
    if (a.name === CommonRoleType.Owner) {
      return -1;
    }

    if (b.name === CommonRoleType.Owner) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
}

interface Props {
  className?: string;
  permissions: Permission[];
}

export function Members(props: Props) {
  const canModifyRoles = props.permissions.includes(Permission.ModifyRoles);
  const canManageMembers = props.permissions.includes(Permission.ManageMembers);
  const [result] = useQuery({ query: getOrganization(canModifyRoles) });

  if (!result.data) {
    return null;
  }

  const organization = result.data?.me.organization;
  const members: MemberModel[] = organization.members;
  const allRoles: Pick<Role, 'id' | 'name'>[] = canModifyRoles
    ? buildRoles(organization.roles)
    : [];

  return (
    <div className={cx(styles.container, props.className)}>
      <header>
        <H4>
          <i18n.Translate>Members</i18n.Translate>
        </H4>
      </header>
      <article
        className={cx(styles.grid, {
          [styles.withRoles]: !!canModifyRoles,
          [styles.withModifyMembers]: !!canManageMembers,
        })}
      >
        <Overline className={styles.gridHeader}>
          <i18n.Translate>email</i18n.Translate>
        </Overline>
        <Overline className={cx(styles.gridHeader, styles.gridMiddle)}>
          <i18n.Translate>first name</i18n.Translate>
        </Overline>
        <Overline className={cx(styles.gridHeader, styles.gridMiddle)}>
          <i18n.Translate>last name</i18n.Translate>
        </Overline>
        <Overline
          className={cx(styles.gridHeader, {
            [styles.gridMiddle]: canModifyRoles || canManageMembers,
          })}
        >
          <i18n.Translate>phone number</i18n.Translate>
        </Overline>
        {canModifyRoles && (
          <Overline
            className={cx(styles.gridHeader, {
              [styles.gridMiddle]: canManageMembers,
            })}
          >
            <i18n.Translate>roles</i18n.Translate>
          </Overline>
        )}
        {canManageMembers && <div />}
        {members.map((member, i) => (
          <Member
            allRoles={allRoles}
            canManageMembers={canManageMembers}
            canModifyRoles={canModifyRoles}
            key={member.email}
            last={i === members.length - 1}
            member={member}
          />
        ))}
      </article>
    </div>
  );
}
