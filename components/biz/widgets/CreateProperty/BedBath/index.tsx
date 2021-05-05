import React from 'react';

import { Number } from '@/components/controls/Number';
import { Bed } from '@/components/icons/Bed';
import { Drop } from '@/components/icons/Drop';
import { DropEmpty } from '@/components/icons/DropEmpty';
import { Overline } from '@/components/typography/Overline';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export function BedBath() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Bedrooms & Bathrooms</i18n.Translate>
        </Overline>
      </p>
      <div className={styles.threeCol}>
        <Number
          icon={<Bed />}
          name="numBedrooms"
          label={i18n.translate`# bedrooms`}
        />
        <Number
          icon={<Drop />}
          name="numBathrooms"
          label={i18n.translate`# bathrooms`}
        />
        <Number
          icon={<DropEmpty />}
          name="numBathroomsHalf"
          label={i18n.translate`# half bathrooms`}
        />
      </div>
    </>
  );
}
