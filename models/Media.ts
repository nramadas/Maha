import { NominalID } from '@/lib/typeHelpers/nominal';
import { MediaParentType } from '@/models/MediaParentType';
import { MediaType } from '@/models/MediaType';

export interface Data {}

export const DEFAULT_DATA: Data = {};

export interface Media {
  id: NominalID<'media id'>;
  created: Date;
  parentId?: string;
  parentType?: MediaParentType;
  src: string;
  type: MediaType;
}
