import cx from 'classnames';
import Image from 'next/image';
import React, { useCallback, useRef, useState } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { ChevronLeft } from '@/components/icons/ChevronLeft';
import { ChevronRight } from '@/components/icons/ChevronRight';
import { Media } from '@/models/Media';

import styles from './index.module.scss';

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 40,
};

function getVisible<M extends Pick<Media, 'id' | 'src' | 'type'>>(
  cur: M[],
  all: M[],
  direction: 'left' | 'right',
) {
  if (direction === 'right') {
    const first = cur[0];
    const firstIndex = all.findIndex(m => m.id === first.id);
    const beforeFirstIndex = firstIndex === 0 ? all.length - 1 : firstIndex - 1;
    const beforeFirst = all[beforeFirstIndex];
    return [beforeFirst].concat(cur.slice(0, cur.length - 1));
  } else {
    const last = cur[cur.length - 1];
    const lastIndex = all.findIndex(m => m.id === last.id);
    const afterLastIndex = lastIndex === all.length - 1 ? 0 : lastIndex + 1;
    const afterLast = all[afterLastIndex];
    return cur.slice(1).concat(afterLast);
  }
}

interface Props<M> {
  className?: string;
  media: M[];
  numVisible: number;
}

export function DetailedMediaCarousel<
  M extends Pick<Media, 'id' | 'src' | 'type'>
>(props: Props<M>) {
  const { className, media, numVisible } = props;
  const [visible, setVisible] = useState(media.slice(0, numVisible));
  const direction = useRef<'left' | 'right'>('left');

  const slide = useCallback(
    (d: 'left' | 'right') => {
      const newVisible = getVisible(visible, media, d);
      direction.current = d;
      setVisible(newVisible);
    },
    [visible, media, setVisible],
  );

  return (
    <TransitionMotion
      styles={visible.map((m, i) => ({
        key: m.id,
        data: m,
        style: { translateX: spring(i * 100, SPRING_CONFIG) },
      }))}
      willEnter={() => ({
        translateX: direction.current === 'left' ? numVisible * 100 : -100,
      })}
      willLeave={() => ({
        translateX:
          direction.current === 'left'
            ? spring(-100, SPRING_CONFIG)
            : spring(numVisible * 100, SPRING_CONFIG),
      })}
    >
      {interpolatedStyles => (
        <div className={styles.container}>
          {interpolatedStyles.map(item => (
            <div
              className={cx(styles.imageContainer, className)}
              key={item.key}
              style={{ transform: `translateX(${item.style.translateX}%)` }}
            >
              <Image
                className={styles.image}
                src={item.data.src}
                loader={({ src }) => src}
                layout="fill"
                objectFit="cover"
                objectPosition="center center"
              />
            </div>
          ))}
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

DetailedMediaCarousel.defaultProps = {
  numVisible: 3,
};
