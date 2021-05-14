import { gql } from '@urql/core';
import React from 'react';
import { useQuery } from 'urql';

import {
  LeftPane,
  RightPane,
  CenterPane,
  Explore,
} from '@/components/chrome/Explore';
import { Filters } from '@/components/explore/Filters';
import { PropertyMarker } from '@/components/explore/PropertyMarker';
import { Map } from '@/components/maps/Map';
import { Marker } from '@/components/maps/Marker';
import { enumToText } from '@/lib/enumToText/metropolitan';
import { MetropolitanKey } from '@/models/MetropolitanKey';

const metropolitanQuery = gql`
  query($key: MetropolitanKey!) {
    metropolitan(key: $key) {
      center {
        lat
        lng
      }
      key
      properties {
        id
        location {
          address
          lat
          lng
        }
        media {
          id
          src
          type
        }
        name
        price
        sqft
      }
    }
  }
`;

interface Props {
  metropolitanKey: MetropolitanKey;
}

export function Metropolitan(props: Props) {
  const [result] = useQuery({
    query: metropolitanQuery,
    variables: { key: props.metropolitanKey },
  });

  const center = result.data?.metropolitan?.center;
  const properties = result.data?.metropolitan?.properties || [];

  return (
    <Explore>
      <LeftPane>
        <Filters title={enumToText(props.metropolitanKey)} />
      </LeftPane>
      <CenterPane>
        <Map center={center}>
          {properties.map((property: any) => (
            <PropertyMarker key={property.id} property={property} />
          ))}
        </Map>
      </CenterPane>
      <RightPane>
        <div />
      </RightPane>
    </Explore>
  );
}
