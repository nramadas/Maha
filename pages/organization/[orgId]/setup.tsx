import React from 'react';

import { Workspace } from '@/components/chrome/Workspace';
import { SetupOrganization } from '@/components/SetupOrganization';
import { Organization as OrganizationModel } from '@/models/Organization';

interface Props {
  query: {
    orgId: OrganizationModel['id'];
  };
}

export default function Setup(props: Props) {
  const orgId = props.query.orgId;

  return (
    <Workspace breadcrumbs={['setup']} orgId={orgId}>
      <SetupOrganization organizationId={orgId} />
    </Workspace>
  );
}
