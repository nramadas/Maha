import type { Role as RoleDBModel } from '@/db/entities/Role';
import { Role as RoleModel, DEFAULT_DATA } from '@/models/Role';

export function convertFromDBModel(dbModel: RoleDBModel): RoleModel {
  const data = {
    ...DEFAULT_DATA,
    ...dbModel.data,
  };

  return {
    id: dbModel.id,
    created: dbModel.created,
    name: dbModel.name,
    organizationId: dbModel.organizationId,
    ...data,
  };
}
