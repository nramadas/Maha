import React from 'react';

import { Workspace } from '@/components/chrome/Workspace';
import { Organization as OrganizationModel } from '@/models/Organization';

interface Props {
  query: {
    orgId: OrganizationModel['id'];
  };
}

export default function SalesLeads(props: Props) {
  const orgId = props.query.orgId;

  return (
    <Workspace breadcrumbs={['sales', 'leads']} orgId={orgId}>
      <div />
    </Workspace>
  );
}
