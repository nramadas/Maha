import React from 'react';

import { Workspace } from '@/components/chrome/Workspace';
import { Organization as OrganizationModel } from '@/models/Organization';

interface Props {
  query: {
    orgId: OrganizationModel['id'];
  };
}

export default function Sales(props: Props) {
  const orgId = props.query.orgId;

  return (
    <Workspace breadcrumbs={['sales']} orgId={orgId}>
      <div />
    </Workspace>
  );
}
