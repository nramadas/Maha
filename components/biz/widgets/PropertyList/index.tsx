import { gql } from '@urql/core';
import Link from 'next/link';
import React from 'react';
import { useQuery } from 'urql';

import { Hollow } from '@/components/controls/links/Hollow';
import { ArrowRight } from '@/components/icons/ArrowRight';
import { H6 } from '@/components/typography/H6';
import { BizRoute, fullBizRoute } from '@/lib/route';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';
import { Property, PropertyModel } from './Property';

const viewProperties = gql`
  query {
    me {
      id
      organization {
        id
        properties {
          id
          location {
            address
          }
          media {
            id
            type
          }
          numBedrooms
          numBathrooms
          numBathroomsHalf
          price
          name
          quantity
          sqft
        }
      }
    }
  }
`;

interface Props {
  className?: string;
}

export function PropertyList(props: Props) {
  const [result] = useQuery({ query: viewProperties });

  const properties: PropertyModel[] =
    result.data?.me?.organization?.properties || [];

  return (
    <div>
      <Link href={fullBizRoute(BizRoute.AddProperty)}>
        <Hollow className={styles.newProperty}>
          <i18n.Translate>
            Add a new property{' '}
            <i18n.Param name="arrowIcon">
              <ArrowRight className={styles.arrowIcon} />
            </i18n.Param>
          </i18n.Translate>
        </Hollow>
      </Link>
      <header className={styles.header}>
        <H6>
          <i18n.Translate>All Properties</i18n.Translate>
        </H6>
      </header>
      <div className={styles.list}>
        {properties.map(property => (
          <Property key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
