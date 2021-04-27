import React from 'react';

import { Workspace } from '@/components/chrome/Workspace';
import { Organization as OrganizationModel } from '@/models/Organization';

interface Props {
  query: {
    orgId: OrganizationModel['id'];
  };
}

export default function Insights(props: Props) {
  const orgId = props.query.orgId;

  return (
    <Workspace breadcrumbs={['insights']} orgId={orgId}>
      <div />
    </Workspace>
  );
}
