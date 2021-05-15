import { gql } from '@urql/core';
import React, { useState } from 'react';
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
        media(type: Image) {
          id
          src
        }
        name
        numBedrooms
        numBathrooms
        numBathroomsHalf
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
  const [hovered, setHovered] = useState<string | null>(null);
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
            <PropertyMarker
              hovered={hovered === property.id}
              key={property.id}
              property={property}
              onHoverChange={h => {
                if (h) {
                  setHovered(property.id);
                } else if (hovered === property.id) {
                  setHovered(null);
                }
              }}
            />
          ))}
        </Map>
      </CenterPane>
      <RightPane>
        <div />
      </RightPane>
    </Explore>
  );
}
