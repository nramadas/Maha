import { gql } from '@urql/core';
import cx from 'classnames';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'urql';

import { Add } from '@/components/icons/Add';
import { Image } from '@/components/icons/Image';
import { Trash } from '@/components/icons/Trash';
import { Video } from '@/components/icons/Video';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { useForm } from '@/hooks/useForm';
import { mediaType } from '@/lib/file/mediaType';
import { i18n } from '@/lib/translate';
import { Media as _Media } from '@/models/Media';
import { MediaType } from '@/models/MediaType';

import styles from './index.module.scss';

type Media = Pick<_Media, 'id' | 'src' | 'type'>;

const remove = gql`
  mutation($id: ID!) {
    deleteMedia(id: $id) {
      id
    }
  }
`;

const upload = gql`
  mutation($file: Upload!, $type: MediaType!) {
    uploadMedia(file: $file, type: $type) {
      id
      src
      type
    }
  }
`;

interface Props {
  className?: string;
  multiple?: boolean;
  name: string;
}

export function MediaUpload(props: Props) {
  const displayError = useDisplayError();
  const form = useForm();
  const [media, setMedia] = useState<Media[]>([]);
  const [, deleteMedia] = useMutation(remove);
  const [, uploadMedia] = useMutation(upload);

  const onDelete = useCallback(
    async (id: string) => {
      const result = await deleteMedia({ id });

      if (result.error) {
        displayError(i18n.translate`Error removing media`);
        return;
      }

      const newMedia = media.filter(m => m.id !== id);
      setMedia(newMedia);
      form.setValue(props.name, newMedia);
    },
    [form, media, setMedia],
  );

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      const type = file ? mediaType(file) : null;

      if (!type) {
        return;
      }

      const result = await uploadMedia({ file, type });

      if (result.error) {
        displayError(i18n.translate`Error attaching media`);
        return;
      }

      if (result.data) {
        const newMediaObject: Media = {
          id: result.data.uploadMedia.id,
          src: result.data.uploadMedia.src,
          type: result.data.uploadMedia.type,
        };

        const newMedia = props.multiple
          ? media.concat(newMediaObject)
          : [newMediaObject];

        setMedia(newMedia);
        form.setValue(props.name, newMedia);
      }
    },
    [form, media, setMedia],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={cx(styles.container, props.className)}>
      {media.map(m => (
        <div key={m.id} className={styles.boxOuter}>
          <div className={styles.box}>
            <img src={m.src} className={styles.previewImage} />
            <Trash className={styles.trash} onClick={() => onDelete(m.id)} />
            {m.type === MediaType.Image ? (
              <Image className={styles.mimeTypeIcon} />
            ) : m.type === MediaType.Video ? (
              <Video className={styles.mimeTypeIcon} />
            ) : null}
          </div>
        </div>
      ))}
      {(!media.length || props.multiple) && (
        <div className={styles.boxOuter}>
          <div className={styles.box}>
            <label className={styles.uploadArea}>
              <div
                className={cx(styles.uploadContainer, {
                  [styles.dragActive]: isDragActive,
                })}
                {...getRootProps()}
              >
                <Add className={styles.icon} />
                <input {...getInputProps()} />
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
