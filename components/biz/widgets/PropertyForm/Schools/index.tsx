import React from 'react';

import { SchoolAutocomplete } from '@/components/controls/SchoolAutocomplete';
import { Overline } from '@/components/typography/Overline';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export function Schools() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Schools</i18n.Translate>
        </Overline>
      </p>
      <SchoolAutocomplete name="schools" />
    </>
  );
}
