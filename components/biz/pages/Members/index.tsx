import cx from 'classnames';
import React from 'react';

import { Members as MembersWidget } from '@/components/biz/widgets/Members';
import { Roles as RolesWidget } from '@/components/biz/widgets/Roles';
import { Permission } from '@/models/Permission';

import styles from './index.module.scss';

interface Props {
  className?: string;
  permissions: Permission[];
}

export function Members(props: Props) {
  const canModifyRoles = props.permissions.includes(Permission.ModifyRoles);

  return (
    <div className={cx(props.className, styles.container)}>
      <MembersWidget permissions={props.permissions} />
      {canModifyRoles && <RolesWidget />}
    </div>
  );
}
