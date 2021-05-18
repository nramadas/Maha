import React, { memo } from 'react';

import { FilterButton } from '@/components/explore/FilterButton';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyList } from '@/components/explore/PropertyList';
import { Sort } from '@/components/explore/Sort';
import { H4 } from '@/components/typography/H4';
import { Overline } from '@/components/typography/Overline';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText } from '@/lib/enumToText/metropolitan';
import { i18n } from '@/lib/translate';
import { MetropolitanKey } from '@/models/MetropolitanKey';

import styles from './index.module.scss';

interface Props {
  className?: string;
  metropolitanKey: MetropolitanKey;
  properties: MapPropertyModel[];
}

export const InfoPanel = memo(function InfoPanel(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <FilterButton />
        <div className={styles.headerCenter}>
          <H4 className={styles.title}>
            <i18n.Translate>
              {textToString(enumToText(props.metropolitanKey))}
            </i18n.Translate>
          </H4>
          <Overline>
            <i18n.Translate>
              <i18n.Param count={props.properties.length} name="numProperties">
                {props.properties.length}
              </i18n.Param>{' '}
              properties
            </i18n.Translate>
          </Overline>
        </div>
        <Sort />
      </header>
      <article className={styles.content}>
        <PropertyList properties={props.properties} />
      </article>
    </div>
  );
});
