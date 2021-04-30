import React from 'react';

import { Roles as RolesWidget } from '@/components/biz/widgets/Roles';
import { Permission } from '@/models/Permission';

interface Props {
  className?: string;
  permissions: Permission[];
}

export function Roles(props: Props) {
  return (
    <div className={props.className}>
      <RolesWidget />
    </div>
  );
}
