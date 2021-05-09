import cx from 'classnames';
import React from 'react';

import { Body1 } from '@/components/typography/Body1';
import { H4 } from '@/components/typography/H4';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText } from '@/lib/enumToText/metropolitan';
import { enabled } from '@/lib/flags/metropolitan';
import { metropolitanRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';
import { Metropolitan } from '@/models/Metropolitan';

import { City } from './City';
import styles from './index.module.scss';

const CITIES = [
  {
    key: Metropolitan.Bengaluru,
    src: require('./blr.jpg'),
  },
  {
    key: Metropolitan.Ahmedabad,
    src: require('./amd.jpg'),
  },
  {
    key: Metropolitan.Chennai,
    src: require('./maa.jpg'),
  },
  {
    key: Metropolitan.Delhi,
    src: require('./del.webp'),
  },
  {
    key: Metropolitan.Hyderabad,
    src: require('./hyd.jpg'),
  },
  {
    key: Metropolitan.Kolkata,
    src: require('./ccu.jpg'),
  },
  {
    key: Metropolitan.Mumbai,
    src: require('./bom.jpg'),
  },
  {
    key: Metropolitan.Thiruvananthapuram,
    src: require('./trv.jpg'),
  },
  {
    key: Metropolitan.Visakhapatnam,
    src: require('./vtz.jpg'),
  },
].sort((a, b) => {
  const aEnabled = enabled(a.key);
  const bEnabled = enabled(b.key);

  if (!aEnabled && bEnabled) {
    return 1;
  } else if (aEnabled && !bEnabled) {
    return -1;
  } else {
    return String(a.key).localeCompare(String(b.key));
  }
});

interface Props {
  className?: string;
}

export function Cities(props: Props) {
  const textToString = useTextToString();

  return (
    <div className={cx(styles.container, props.className)}>
      <article className={styles.content}>
        <header className={styles.header}>
          <H4>
            <i18n.Translate>
              The best deals in your favourite cities
            </i18n.Translate>
          </H4>
          <div className={styles.tagline}>
            <Body1>
              <i18n.Translate>
                Select from premium-built homes, sold directly by the property
                developer.
              </i18n.Translate>
            </Body1>
          </div>
        </header>
        {CITIES.map(city => (
          <City
            disabled={!enabled(city.key)}
            key={city.key}
            src={city.src}
            url={metropolitanRoute(city.key)}
          >
            <H4 className={styles.cityName}>
              {textToString(enumToText(city.key))}
            </H4>
          </City>
        ))}
      </article>
    </div>
  );
}
