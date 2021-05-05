import type { Media as MediaDBModel } from '@/db/entities/Media';
import { Media as MediaModel, DEFAULT_DATA } from '@/models/Media';

export function convertFromDBModel(dbModel: MediaDBModel): MediaModel {
  const data = {
    ...DEFAULT_DATA,
    ...dbModel.data,
  };

  return {
    id: dbModel.id,
    created: dbModel.created,
    parentId: dbModel.parentId,
    parentType: dbModel.parentType,
    src: dbModel.src,
    type: dbModel.type,
    ...data,
  };
}
