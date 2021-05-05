import type { School as SchoolDBModel } from '@/db/entities/School';
import { School as SchoolModel, DEFAULT_DATA } from '@/models/School';

export function convertFromDBModel(dbModel: SchoolDBModel): SchoolModel {
  const data = {
    ...DEFAULT_DATA,
    ...dbModel.data,
  };

  return {
    id: dbModel.id,
    googleId: dbModel.googleId,
    name: dbModel.name,
    type: dbModel.type,
    ...data,
  };
}
