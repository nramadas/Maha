import { NominalID } from '@/lib/typeHelpers/nominal';
import { MediaType } from '@/models/MediaType';

export interface Media {
  id: NominalID<'media id'>;
  src: string;
  type: MediaType;
}
