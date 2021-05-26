import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../../model';
import { Body2 } from '@/components/typography/Body2';
import { useDateFormatter } from '@/hooks/useDateFormatter';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText as propertyConditionToText } from '@/lib/enumToText/propertyCondition';
import { enumToText as propertyTypeToText } from '@/lib/enumToText/propertyType';
import { toString } from '@/lib/number';
import { i18n } from '@/lib/translate';
import { PropertyCondition } from '@/models/PropertyCondition';

import styles from './index.module.scss';

interface Props {
  className?: string;
  property: PropertyDetailsModel;
}

export const Details = memo(function Details(props: Props) {
  const { className, property } = props;
  const textToString = useTextToString();
  const [formatDate] = useDateFormatter({});

  return (
    <div className={cx(styles.container, className)}>
      <Body2>
        <i18n.Translate>Property type</i18n.Translate>
      </Body2>
      <Body2>{textToString(propertyTypeToText(property.type))}</Body2>
      {property.built && (
        <>
          <Body2>
            <i18n.Translate>Built</i18n.Translate>
          </Body2>
          <Body2>{formatDate(new Date(property.built))}</Body2>
        </>
      )}
      {property.fees && (
        <>
          <Body2>
            <i18n.Translate>Monthly fees</i18n.Translate>
          </Body2>
          <Body2>₹{toString(property.fees)}</Body2>
        </>
      )}
      {property.taxes && (
        <>
          <Body2>
            <i18n.Translate>Approx. tax / year</i18n.Translate>
          </Body2>
          <Body2>₹{toString(property.taxes)}</Body2>
        </>
      )}
      {property.quantity && (
        <>
          <Body2>
            <i18n.Translate># units left</i18n.Translate>
          </Body2>
          <Body2>{toString(property.quantity)}</Body2>
        </>
      )}
      {property.propertyCondition !== PropertyCondition.New && (
        <>
          <Body2>
            <i18n.Translate>Property condition</i18n.Translate>
          </Body2>
          <Body2>
            {textToString(propertyConditionToText(property.propertyCondition))}
          </Body2>
        </>
      )}
    </div>
  );
});
