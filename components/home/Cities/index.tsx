import cx from 'classnames';
import React from 'react';
import { useQuery } from 'urql';
import { gql } from 'urql/core';

import { Body1 } from '@/components/typography/Body1';
import { H4 } from '@/components/typography/H4';
import { useTextToString } from '@/hooks/useTextToString';
import { enumToText } from '@/lib/enumToText/metropolitan';
import { metropolitanRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';
import { MetropolitanKey } from '@/models/MetropolitanKey';

import { City } from './City';
import styles from './index.module.scss';

const metropolitansQuery = gql`
  query {
    metropolitans {
      enabled
      key
    }
  }
`;

interface CityModel {
  enabled: boolean;
  key: MetropolitanKey;
}

function getImg(mkey: MetropolitanKey): string {
  switch (mkey) {
    case MetropolitanKey.Bengaluru:
      return require('./blr.jpg');
    case MetropolitanKey.Ahmedabad:
      return require('./amd.jpg');
    case MetropolitanKey.Chennai:
      return require('./maa.jpg');
    case MetropolitanKey.Delhi:
      return require('./del.webp');
    case MetropolitanKey.Hyderabad:
      return require('./hyd.jpg');
    case MetropolitanKey.Kolkata:
      return require('./ccu.jpg');
    case MetropolitanKey.Mumbai:
      return require('./bom.jpg');
    case MetropolitanKey.Thiruvananthapuram:
      return require('./trv.jpg');
    case MetropolitanKey.Visakhapatnam:
      return require('./vtz.jpg');
  }
}

function sortCities(a: CityModel, b: CityModel) {
  if (!a.enabled && b.enabled) {
    return 1;
  } else if (a.enabled && !b.enabled) {
    return -1;
  } else {
    return String(a.key).localeCompare(String(b.key));
  }
}

interface Props {
  className?: string;
}

export function Cities(props: Props) {
  const [result] = useQuery({ query: metropolitansQuery });
  const textToString = useTextToString();

  if (result.error || !result.data) {
    return null;
  }

  const cities: CityModel[] = result.data.metropolitans;
  const sortedCities = cities.sort(sortCities);

  return (
    <div className={cx(styles.container, props.className)}>
      <article className={styles.content}>
        <header className={styles.header}>
          <H4>
            <i18n.Translate>
              The best homes in your favourite cities
            </i18n.Translate>
          </H4>
          <div className={styles.tagline}>
            <Body1>
              <i18n.Translate>
                Select from premium-built flats, sold directly by the property
                developer.
              </i18n.Translate>
            </Body1>
          </div>
        </header>
        {sortedCities.map(city => (
          <City
            disabled={!city.enabled}
            key={city.key}
            src={getImg(city.key)}
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
