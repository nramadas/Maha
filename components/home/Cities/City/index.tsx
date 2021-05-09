import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Overline } from '@/components/typography/Overline';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

interface Props {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  src: string;
  url: string;
}

export function City(props: Props) {
  return (
    <Link href={props.url}>
      <a
        className={cx(styles.container, {
          [styles.disabled]: !!props.disabled,
        })}
        onClick={e => {
          if (props.disabled) {
            e.preventDefault();
          }
        }}
      >
        <Image
          className={styles.image}
          src={props.src}
          layout="fill"
          objectFit="cover"
          objectPosition="center center"
        />
        <div className={styles.children}>{props.children}</div>
        {props.disabled && (
          <div className={styles.disabledBadge}>
            <Overline>
              <i18n.Translate>Coming soon!</i18n.Translate>
            </Overline>
          </div>
        )}
      </a>
    </Link>
  );
}
