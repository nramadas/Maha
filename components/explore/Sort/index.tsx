import cx from 'classnames';
import React, { memo } from 'react';

import { Caption } from '@/components/typography/Caption';
import { useSortType } from '@/hooks/useExplorePage';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { enumToText } from '@/lib/enumToText/sortType';
import { i18n } from '@/lib/translate';
import { SortType } from '@/models/SortType';

import styles from './index.module.scss';

interface Props {
  className?: string;
}

export const Sort = memo(function Sort(props: Props) {
  const { sortType, setSortType } = useSortType();
  const textToString = useTextToString();
  const [Target, Tooltip] = useTooltip({
    alignment: 'right',
    position: 'below',
    preventTooltipClickPropagation: false,
    type: 'click',
  });

  return (
    <>
      <div className={cx(styles.container, props.className)}>
        <Target>
          <div className={styles.target}>
            <button className={styles.option}>
              <Caption className={styles.label}>
                <i18n.Translate>Sort:</i18n.Translate>
              </Caption>
              <Caption>{textToString(enumToText(sortType))}</Caption>
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
            .filter(s => s !== sortType)
            .map(sortType => (
              <button
                className={styles.option}
                key={sortType}
                onClick={() => setSortType(sortType)}
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
});
