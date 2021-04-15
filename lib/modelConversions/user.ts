import type { User as UserDBModel } from '@/db/entities/User';
import { Data, User as UserModel, DEFAULT_DATA } from '@/models/User';

export function covertFromDBModel(dbModel: UserDBModel): UserModel {
  const data = {
    ...DEFAULT_DATA,
    ...(dbModel.data as Data),
  };

  return {
    id: String(dbModel.id),
    created: dbModel.created,
    email: dbModel.email,
    ...data,
  };
}
