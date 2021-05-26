import { Media } from '@/models/Media';

export function src<M extends Pick<Media, 'src'>>(media: M) {
  return `http://${media.src}`;
}
