import { NominalID } from '@/lib/typeHelpers/nominal';
import { OrganizationId } from '@/models/Organization';

export interface Role {
  id: NominalID<'role id'>;
  name: string;
  organizationId: OrganizationId;
}
