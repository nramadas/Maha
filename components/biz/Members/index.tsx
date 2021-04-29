import cx from 'classnames';
import React, { useState } from 'react';
import { useQuery, useMutation } from 'urql';

import { H4 } from '@/components/typography/H4';
import { Overline } from '@/components/typography/Overline';
import { ErrorType } from '@/lib/errors/type';
import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Role } from '@/models/Role';

import styles from './index.module.scss';
import { Member, MemberModel } from './Member';

const getOrganization = `
  query {
    me {
      organization {
        members {
          id
          email
          firstName
          lastName
          phoneNumber
          roles {
            id
            name
          }
        }
        roles {
          id
          name
        }
      }
    }
  }
`;

const setRoles = `
  mutation ($userId: ID!, $roleIds: [ID!]!) {
    setUserRoles (userId: $userId, roleIds: $roleIds) {
      id
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
}

export function Members(props: Props) {
  const [result] = useQuery({ query: getOrganization });
  const [, setUserRoles] = useMutation(setRoles);
  const [error, setError] = useState<ErrorType | null>(null);

  const organization = result.data?.me.organization;
  const members: MemberModel[] = organization.members;
  const allRoles: Pick<Role, 'id' | 'name'>[] = buildRoles(organization.roles);

  return (
    <div className={cx(styles.container, props.className)}>
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
        {members.map(member => (
          <Member
            allRoles={allRoles}
            key={member.email}
            member={member}
            onChangeRoles={roles => {
              const userId = member.id;
              const roleIds = roles.map(role => role.id);
              setUserRoles({ userId, roleIds }).then(result => {
                if (result.error) {
                  const errorType = result.error.graphQLErrors[0]
                    .message as ErrorType;
                  setError(errorType);
                }
              });
            }}
          />
        ))}
      </article>
    </div>
  );
}
