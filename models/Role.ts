import { NominalID } from '@/lib/typeHelpers/nominal';
import { CommonRoleType } from '@/models/CommonRoleType';
import { Organization } from '@/models/Organization';
import { Permission } from '@/models/Permission';

export interface Data {
  description?: string;
  permissions: Permission[];
}

export const DEFAULT_DATA: Data = {
  permissions: [],
};

export interface Role extends Data {
  created: Date;
  id: NominalID<'role id'>;
  name: CommonRoleType | string;
  organizationId: Organization['id'];
}
