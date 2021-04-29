import type { User as UserDBModel } from '@/db/entities/User';
import { Data, User as UserModel, DEFAULT_DATA } from '@/models/User';

export function convertFromDBModel(dbModel: UserDBModel): UserModel {
  const data = {
    ...DEFAULT_DATA,
    ...(dbModel.data as Data),
  };

  return {
    id: dbModel.id,
    created: dbModel.created,
    email: dbModel.email,
    organizationId: dbModel.organizationId ? dbModel.organizationId : undefined,
    ...data,
  };
}
