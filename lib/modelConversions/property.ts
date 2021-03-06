import type { Property as PropertyDBModel } from '@/db/entities/Property';
import { Property as PropertyModel, DEFAULT_DATA } from '@/models/Property';

export function convertFromDBModel(dbModel: PropertyDBModel): PropertyModel {
  const data = {
    ...DEFAULT_DATA,
    ...dbModel.data,
    built: dbModel.data.built ? new Date(dbModel.data.built) : undefined,
  };

  return {
    id: dbModel.id,
    created: dbModel.created,
    organizationId: dbModel.organizationId,
    metropolitanKey: dbModel.metropolitanKey,
    ...data,
  };
}
