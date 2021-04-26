import type { Organization as OrganizationDBModel } from '@/db/entities/Organization';
import {
  Data,
  Organization as OrganizationModel,
  DEFAULT_DATA,
} from '@/models/Organization';

export function convertFromDBModel(
  dbModel: OrganizationDBModel,
): OrganizationModel {
  const data = {
    ...DEFAULT_DATA,
    ...(dbModel.data as Data),
  };

  return {
    id: String(dbModel.id),
    created: dbModel.created,
    name: dbModel.name,
    ...data,
  };
}
