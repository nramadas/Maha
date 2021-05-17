import React from 'react';

import { Caption } from '@/components/typography/Caption';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { enumToText } from '@/lib/enumToText/sortType';
import { i18n } from '@/lib/translate';
import { SortType } from '@/models/SortType';

import styles from './index.module.scss';

interface Props {
  className?: string;
  sort: SortType;
  onChange?(newSort: SortType): void;
}

export function Sort(props: Props) {
  const textToString = useTextToString();
  const [Target, Tooltip] = useTooltip({
    alignment: 'right',
    position: 'below',
    preventTooltipClickPropagation: false,
    type: 'click',
  });

  return (
    <>
      <div className={styles.container}>
        <Target>
          <div className={styles.target}>
            <button className={styles.option}>
              <Caption className={styles.label}>
                <i18n.Translate>Sort:</i18n.Translate>
              </Caption>
              <Caption>{textToString(enumToText(props.sort))}</Caption>
            </button>
          </div>
        </Target>
      </div>
      <Tooltip>
        <div className={styles.tooltip}>
          {[
            SortType.Relevance,
            SortType.PriceLow,
            SortType.PriceHigh,
            SortType.SqftHigh,
            SortType.SqftLow,
            SortType.PricePerSqft,
            SortType.Bedrooms,
          ]
            .filter(s => s !== props.sort)
            .map(sortType => (
              <button
                className={styles.option}
                key={sortType}
                onClick={() => props.onChange?.(sortType)}
              >
                <Caption className={styles.hidden}>
                  <i18n.Translate>Sort:</i18n.Translate>
                </Caption>
                <Caption className={styles.label}>
                  {textToString(enumToText(sortType))}
                </Caption>
              </button>
            ))}
        </div>
      </Tooltip>
    </>
  );
}
