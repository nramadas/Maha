import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../../model';
import { Body2 } from '@/components/typography/Body2';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText as utilityConfigurationToText } from '@/lib/enumToText/utilityConfiguration';
import { enumToText as utilityGasTypeToText } from '@/lib/enumToText/utilityGasType';
import { enumToText as utilityWaterFilterToText } from '@/lib/enumToText/utilityWaterFilter';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  property: PropertyDetailsModel;
}

export const Utilities = memo(function Utilities(props: Props) {
  const { className, property } = props;
  const textToString = useTextToString();

  return (
    <div className={cx(styles.container, className)}>
      <Body2>
        <i18n.Translate>Air conditioning</i18n.Translate>
      </Body2>
      <Body2>
        {textToString(
          utilityConfigurationToText(property.utilitiesAirConditioning),
        )}
      </Body2>
      <Body2>
        <i18n.Translate>Heating</i18n.Translate>
      </Body2>
      <Body2>
        {textToString(utilityConfigurationToText(property.utilitiesHeating))}
      </Body2>
      <Body2>
        <i18n.Translate>Gas</i18n.Translate>
      </Body2>
      <Body2>
        {textToString(utilityGasTypeToText(property.utilitiesGasType))}
      </Body2>
      <Body2>
        <i18n.Translate>Water filtering</i18n.Translate>
      </Body2>
      <Body2>
        {textToString(utilityWaterFilterToText(property.utilitiesWaterFilter))}
      </Body2>
    </div>
  );
});
