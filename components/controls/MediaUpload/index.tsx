import { gql } from '@urql/core';
import cx from 'classnames';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'urql';

import { Add } from '@/components/icons/Add';
import { Image } from '@/components/icons/Image';
import { Trash } from '@/components/icons/Trash';
import { Video } from '@/components/icons/Video';
import { Shimmer } from '@/components/loading/Shimmer';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { useForm } from '@/hooks/useForm';
import { mediaType } from '@/lib/file/mediaType';
import { i18n } from '@/lib/translate';
import { Media as _Media } from '@/models/Media';
import { MediaType } from '@/models/MediaType';

import styles from './index.module.scss';

type Media = Pick<_Media, 'id' | 'src' | 'type'>;

const deleteMediaMutation = gql`
  mutation($id: ID!) {
    deleteMedia(id: $id) {
      id
    }
  }
`;

const createMediaMutation = gql`
  mutation($file: Upload!, $type: MediaType!) {
    createMedia(file: $file, type: $type) {
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
  softDelete?: boolean;
}

export function MediaUpload(props: Props) {
  const displayError = useDisplayError();
  const form = useForm();
  const [, deleteMedia] = useMutation(deleteMediaMutation);
  const [createMediaResult, createMedia] = useMutation(createMediaMutation);
  const media: Media[] = form.getValue(props.name) || [];

  const onDelete = useCallback(
    async (id: string) => {
      if (!props.softDelete) {
        const result = await deleteMedia({ id });

        if (result.error) {
          displayError(i18n.translate`Error removing media`);
          return;
        }
      }

      const newMedia = media.filter(m => m.id !== id);
      form.setValue(props.name, newMedia);
    },
    [form, media],
  );

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      const type = file ? mediaType(file) : null;

      if (!type) {
        return;
      }

      const result = await createMedia({ file, type });

      if (result.error) {
        displayError(i18n.translate`Error attaching media`);
        return;
      }

      if (result.data) {
        const newMediaObject: Media = {
          id: result.data.createMedia.id,
          src: result.data.createMedia.src,
          type: result.data.createMedia.type,
        };

        const newMedia = props.multiple
          ? media.concat(newMediaObject)
          : [newMediaObject];

        form.setValue(props.name, newMedia);
      }
    },
    [form, media],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.container}>
      {media.map(m => (
        <div className={props.className} key={m.id}>
          <div className={styles.boxOuter}>
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
        </div>
      ))}
      {props.multiple && createMediaResult.fetching && (
        <div className={props.className}>
          <div className={styles.boxOuter}>
            <div className={styles.box}>
              <Shimmer className={styles.loading} />
            </div>
          </div>
        </div>
      )}
      {(!media.length || props.multiple) && (
        <div className={props.className}>
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
                {!props.multiple && createMediaResult.fetching && (
                  <Shimmer className={styles.loading} />
                )}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
