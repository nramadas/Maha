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
import { useConfirmation } from '@/hooks/useConfirmation';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { useTextToString } from '@/hooks/useTextToString';
import { name as makePermissionName } from '@/lib/permissions/name';
import { description as makeRoleDescription } from '@/lib/role/description';
import { name as makeRoleName } from '@/lib/role/name';
import { i18n } from '@/lib/translate';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Permission } from '@/models/Permission';
import { Role } from '@/models/Role';

import { Add } from './Add';
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

const addRole = gql`
  mutation($name: String!, $description: String, $permissions: [Permission!]) {
    createRole(
      name: $name
      description: $description
      permissions: $permissions
    ) {
      id
      roles {
        id
        description
        name
        permissions
      }
    }
  }
`;

const removeRole = gql`
  mutation($id: ID!) {
    deleteRole(id: $id) {
      id
      roles {
        id
        description
        name
        permissions
      }
    }
  }
`;

interface Props {
  className?: string;
}

export function Roles(props: Props) {
  const confirm = useConfirmation();
  const displayError = useDisplayError();
  const [rolesResult] = useQuery({ query: getRoles });
  const [, setRolePermissions] = useMutation(setPermissions);
  const [, deleteRole] = useMutation(removeRole);
  const [, createRole] = useMutation(addRole);
  const textToString = useTextToString();

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
            text: makePermissionName(p),
          }));

          const allPermissions = Object.values(Permission).map(p => ({
            value: p,
            text: makePermissionName(p),
          }));

          return (
            <React.Fragment key={role.id}>
              <div
                className={cx(styles.name, {
                  [styles.notLast]: i < roles.length - 1,
                })}
              >
                <Body1>{textToString(makeRoleName(role))}</Body1>
              </div>
              <div
                className={cx(styles.description, styles.gridMiddle, {
                  [styles.notLast]: i < roles.length - 1,
                })}
              >
                <Body2>{textToString(makeRoleDescription(role))}</Body2>
              </div>
              <div
                className={cx(styles.permissions, styles.gridMiddle, {
                  [styles.notLast]: i < roles.length - 1,
                })}
              >
                {role.name === CommonRoleType.Owner ? (
                  <Body2>
                    <i18n.Translate>Everything</i18n.Translate>
                  </Body2>
                ) : (
                  <PickGrow
                    defaultSelected={selected}
                    choices={allPermissions}
                    name="permissions"
                    onChoose={permissions => {
                      setRolePermissions({
                        roleId: role.id,
                        permissions: permissions.map(p => p.value),
                      }).then(result => {
                        if (result.error) {
                          displayError(
                            i18n.translate`Could not change permissions for role`,
                          );
                        }
                      });
                    }}
                  />
                )}
              </div>
              <div className={styles.delete}>
                {role.name !== CommonRoleType.Owner && (
                  <Trash
                    className={styles.trash}
                    onClick={async () => {
                      await confirm(
                        i18n.translate`Are you sure you want to delete this role?`,
                      );
                      const result = await deleteRole({ id: role.id });
                      if (result.error) {
                        displayError(i18n.translate`Could not remove role`);
                      }
                    }}
                  />
                )}
              </div>
            </React.Fragment>
          );
        })}
      </article>
      <footer className={styles.addContainer}>
        <Add
          onSubmit={formValues =>
            createRole(formValues).then(result => {
              if (result.error) {
                displayError(i18n.translate`Could not create a new role`);
              }
            })
          }
        />
      </footer>
    </div>
  );
}
