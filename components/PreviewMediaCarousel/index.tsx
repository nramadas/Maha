import cx from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { Overline } from '@/components/typography/Overline';
import { load as preloadImage } from '@/lib/imagePreloader';
import { Media as _Media } from '@/models/Media';

import styles from './index.module.scss';

type Media = Pick<_Media, 'id' | 'src'>;

function getNextIdx(cur: number, delta: 1 | -1, total: number) {
  if (cur === 0 && delta === -1) {
    return total - 1;
  }

  if (cur === total - 1 && delta === 1) {
    return 0;
  }

  return cur + delta;
}

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 40,
};

interface Props {
  className?: string;
  media: Media[];
}

export function PreviewMediaCarousel(props: Props) {
  const [visible, setVisible] = useState<Media>(props.media[0]);
  const direction = useRef<'left' | 'right'>('left');
  const curIdx = props.media.findIndex(m => m.id === visible.id);

  const slide = useCallback(
    (d: 'left' | 'right') => {
      const nextIdx = getNextIdx(
        curIdx,
        d === 'left' ? 1 : -1,
        props.media.length,
      );

      const next = props.media[nextIdx];
      direction.current = d;

      preloadImage(next.src).then(() => {
        setVisible(next);
      });
    },
    [curIdx, direction, props.media, visible, setVisible],
  );

  if (!props.media.length) {
    return null;
  }

  return (
    <TransitionMotion
      styles={[visible].map(m => ({
        key: m.id,
        data: m,
        style: { left: spring(0, SPRING_CONFIG) },
      }))}
      willEnter={() => ({
        left: direction.current === 'left' ? 100 : -100,
      })}
      willLeave={() => ({
        left:
          direction.current === 'left'
            ? spring(-100, SPRING_CONFIG)
            : spring(100, SPRING_CONFIG),
      })}
    >
      {interpolatedStyles => (
        <div className={cx(styles.container, props.className)}>
          {interpolatedStyles.map(item => (
            <div
              className={styles.item}
              key={item.key}
              style={{ left: `${item.style.left}%` }}
            >
              <img className={styles.image} src={item.data.src} />
            </div>
          ))}
          <div className={styles.countContainer}>
            <Overline>
              {curIdx + 1} / {props.media.length}
            </Overline>
          </div>
          <div
            className={styles.leftContainer}
            onClick={e => {
              e.stopPropagation();
              slide('right');
            }}
          >
            <ChevronLeft className={styles.icon} />
          </div>
          <div
            className={styles.rightContainer}
            onClick={e => {
              e.stopPropagation();
              slide('left');
            }}
          >
            <ChevronRight className={styles.icon} />
          </div>
        </div>
      )}
    </TransitionMotion>
  );
}
