import React, { memo } from 'react';
import { useQuery } from 'urql';

import { BottomSheet } from '@/contexts/BottomSheet';

import styles from './index.module.scss';
import { Loading } from './Loading';
import { PropertyDetailsModel } from './model';
import { Property } from './Property';
import { propertyQuery } from './query';

interface Props {
  propertyId: string;
}

export const _PropertyDetails = memo(function _PropertyDetails(props: Props) {
  const [result] = useQuery({
    query: propertyQuery,
    variables: { id: props.propertyId },
  });

  const property: PropertyDetailsModel | undefined = result.data?.propertyById;

  return (
    <article className={styles.container}>
      {result.fetching ? (
        <Loading propertyId={props.propertyId} />
      ) : property ? (
        <Property property={property} />
      ) : null}
    </article>
  );
});

export const PropertyDetails = memo(function PropertyDetails(props: Props) {
  return (
    <BottomSheet id={props.propertyId}>
      <_PropertyDetails propertyId={props.propertyId} />
    </BottomSheet>
  );
});
