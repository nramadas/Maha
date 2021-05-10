import React from 'react';

import { MediaUpload } from '@/components/controls/MediaUpload';
import { Overline } from '@/components/typography/Overline';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export function Media() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Media</i18n.Translate>
        </Overline>
      </p>
      <MediaUpload multiple className={styles.media} name="media" />
    </>
  );
}
