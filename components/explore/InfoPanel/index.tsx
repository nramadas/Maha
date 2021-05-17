import React from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { H4 } from '@/components/typography/H4';
import { Overline } from '@/components/typography/Overline';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText } from '@/lib/enumToText/metropolitan';
import { i18n } from '@/lib/translate';
import { MetropolitanKey } from '@/models/MetropolitanKey';

import styles from './index.module.scss';

interface Props {
  className?: string;
  hoveredId?: MapPropertyModel['id'] | null;
  metropolitanKey: MetropolitanKey;
  properties: MapPropertyModel[];
  onHoverChange?(hoveredId: string | null): void;
}

export function InfoPanel(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
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
      </header>
      <article className={styles.content} />
    </div>
  );
}
