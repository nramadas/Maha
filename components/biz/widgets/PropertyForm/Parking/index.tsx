import React, { useState } from 'react';

import { Number } from '@/components/controls/Number';
import { Switch } from '@/components/controls/Switch';
import { Car } from '@/components/icons/Car';
import { CarEmpty } from '@/components/icons/CarEmpty';
import { Body2 } from '@/components/typography/Body2';
import { Overline } from '@/components/typography/Overline';
import { useForm } from '@/hooks/useForm';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

export function Parking() {
  const form = useForm();
  const parkingEnabled = form.getValue('parkingGarage');

  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Parking</i18n.Translate>
        </Overline>
      </p>
      <div className={styles.switchContainer}>
        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Is there parking available?</i18n.Translate>
          </Body2>
        </div>
        <Switch name="parkingGarage" />
      </div>
      <div className={styles.grid}>
        <Number
          disabled={!parkingEnabled}
          icon={<Car />}
          name="parkingCoveredSpaces"
          label={i18n.translate`# covered parking spaces`}
        />
        <Number
          disabled={!parkingEnabled}
          icon={<CarEmpty />}
          name="parkingOpenSpaces"
          label={i18n.translate`# open parking spaces`}
        />
      </div>
    </>
  );
}
