import { gql } from '@urql/core';
import cx from 'classnames';
import React from 'react';
import { useMutation, useQuery } from 'urql';

import { PickGrow } from '@/components/controls/chips/PickGrow';
import { Trash } from '@/components/icons/Trash';
import { Body1 } from '@/components/typography/Body1';
import { Body2 } from '@/components/typography/Body2';
import { H4 } from '@/components/typography/H4';
import { Overline } from '@/components/typography/Overline';
import { useLanguagePack } from '@/hooks/useLanguagePack';
import { name as makePermissionName } from '@/lib/permissions/name';
import { description as makeRoleDescription } from '@/lib/role/description';
import { name as makeRoleName } from '@/lib/role/name';
import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Permission } from '@/models/Permission';
import { Role } from '@/models/Role';

import styles from './index.module.scss';

const getRoles = gql`
  query {
    me {
      id
      organization {
        id
        roles {
          id
          description
          name
          permissions
        }
      }
    }
  }
`;

const setPermissions = gql`
  mutation($roleId: ID!, $permissions: [Permission!]!) {
    setRolePermissions(roleId: $roleId, permissions: $permissions) {
      id
      permissions
    }
  }
`;

const removeRole = gql`
  mutation($id: ID!) {
    deleteRole(id: $id) {
      id
      description
      name
      permissions
    }
  }
`;

interface Props {
  className?: string;
}

export function Roles(props: Props) {
  const languagePack = useLanguagePack();
  const [rolesResult] = useQuery({ query: getRoles });
  const [, setRolePermissions] = useMutation(setPermissions);

  const roles: Pick<Role, 'id' | 'name' | 'description' | 'permissions'>[] =
    rolesResult.data?.me.organization.roles;

  return (
    <div className={cx(styles.container, props.className)}>
      <header>
        <H4>
          <i18n.Translate>Roles</i18n.Translate>
        </H4>
      </header>
      <article className={styles.grid}>
        <Overline className={styles.gridHeader}>
          <i18n.Translate>name</i18n.Translate>
        </Overline>
        <Overline className={cx(styles.gridHeader, styles.gridMiddle)}>
          <i18n.Translate>description</i18n.Translate>
        </Overline>
        <Overline className={cx(styles.gridHeader, styles.gridMiddle)}>
          <i18n.Translate>permissions</i18n.Translate>
        </Overline>
        <div />
        {roles.map((role, i) => {
          const selected = role.permissions.map(p => ({
            value: p,
            text: makePermissionName(p, languagePack),
          }));

          const allPermissions = Object.values(Permission).map(p => ({
            value: p,
            text: makePermissionName(p, languagePack),
          }));

          return (
            <React.Fragment key={role.id}>
              <div
                className={cx(styles.name, {
                  [styles.notLast]: i < roles.length - 1,
                })}
              >
                <Body1>{makeRoleName(role, languagePack)}</Body1>
              </div>
              <div
                className={cx(styles.description, styles.gridMiddle, {
                  [styles.notLast]: i < roles.length - 1,
                })}
              >
                <Body2>{makeRoleDescription(role, languagePack)}</Body2>
              </div>
              <div
                className={cx(styles.permissions, styles.gridMiddle, {
                  [styles.notLast]: i < roles.length - 1,
                })}
              >
                {role.name === CommonRoleType.Owner ? (
                  <Body1>
                    <i18n.Translate>Everything</i18n.Translate>
                  </Body1>
                ) : (
                  <PickGrow
                    defaultSelected={selected}
                    choices={allPermissions}
                    name="permissions"
                    onChoose={permissions => {
                      setRolePermissions({
                        roleId: role.id,
                        permissions: permissions.map(p => p.value),
                      });
                    }}
                  />
                )}
              </div>
              <div className={styles.delete}>
                {role.name !== CommonRoleType.Owner && (
                  <Trash className={styles.trash} />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </article>
    </div>
  );
}
