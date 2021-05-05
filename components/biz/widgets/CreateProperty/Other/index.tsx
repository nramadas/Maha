import React from 'react';

import { Input } from '@/components/controls/Input';
import { Select } from '@/components/controls/Select';
import { Cctv } from '@/components/icons/Cctv';
import { Wrench } from '@/components/icons/Wrench';
import { Body2 } from '@/components/typography/Body2';
import { Overline } from '@/components/typography/Overline';
import { enumToText as propertyConditionToText } from '@/lib/enumToText/propertyCondition';
import { i18n } from '@/lib/translate';
import { PropertyCondition } from '@/models/PropertyCondition';

import styles from './index.module.scss';

export function Other() {
  return (
    <>
      <p>
        <Overline>
          <i18n.Translate>Other</i18n.Translate>
        </Overline>
      </p>
      <div className={styles.selectContainer}>
        <div className={styles.label}>
          <Body2>
            <i18n.Translate>Condition of the property:</i18n.Translate>
          </Body2>
        </div>
        <Select
          name="propertyCondition"
          options={Object.values(PropertyCondition).map(condition => ({
            text: propertyConditionToText(condition),
            value: condition,
          }))}
          placeholder={i18n.translate`select`}
        >
          {option => <Body2>{option.text}</Body2>}
        </Select>
      </div>
      <Input
        className={styles.construction}
        icon={<Wrench />}
        name="constructionMaterials"
        label={i18n.translate`Construction materials`}
      />
      <Input
        icon={<Cctv />}
        name="securityFeatures"
        label={i18n.translate`Security features available on premises`}
      />
    </>
  );
}
