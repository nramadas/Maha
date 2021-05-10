import { MediaType } from '@/models/MediaType';

type Input = Pick<File, 'type'>;

export function mediaType(file: Input) {
  if (file.type.startsWith('image')) {
    return MediaType.Image;
  }

  if (file.type.startsWith('video')) {
    return MediaType.Video;
  }

  return null;
}
