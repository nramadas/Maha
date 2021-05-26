import cx from 'classnames';
import React, { memo } from 'react';

import { PropertyDetailsModel } from '../../model';
import { Body2 } from '@/components/typography/Body2';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  property: PropertyDetailsModel;
}

export const Other = memo(function Other(props: Props) {
  const { className, property } = props;

  return (
    <div className={cx(styles.container, className)}>
      {property.constructionMaterials?.en && (
        <>
          <Body2>
            <i18n.Translate>Construction materials</i18n.Translate>
          </Body2>
          <Body2>{property.constructionMaterials.en}</Body2>
        </>
      )}
      {property.securityFeatures?.en && (
        <>
          <Body2>
            <i18n.Translate>Security features</i18n.Translate>
          </Body2>
          <Body2>{property.securityFeatures.en}</Body2>
        </>
      )}
    </div>
  );
});
