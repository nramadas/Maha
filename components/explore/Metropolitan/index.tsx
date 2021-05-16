import { gql } from '@urql/core';
import React, { useState } from 'react';
import { useQuery } from 'urql';

import {
  LeftPane,
  RightPane,
  CenterPane,
  Explore,
} from '@/components/chrome/Explore';
import { AppliedFilters, Filters } from '@/components/explore/Filters';
import {
  PropertyMarker,
  MarkerModel,
} from '@/components/explore/PropertyMarker';
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

const applyFilters = (filters: Partial<AppliedFilters>) => (
  property: MarkerModel,
) => {
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      for (const prefix of ['min', 'max']) {
        if (name.startsWith(prefix)) {
          const [, _prop] = name.split(prefix);
          const prop = (_prop[0].toLowerCase() +
            _prop.slice(1)) as keyof MarkerModel;

          if (prefix === 'min' && property[prop] < value) {
            return false;
          }

          if (prefix === 'max' && property[prop] > value) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

interface Props {
  metropolitanKey: MetropolitanKey;
}

export function Metropolitan(props: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [result] = useQuery({
    query: metropolitanQuery,
    variables: { key: props.metropolitanKey },
  });
  const [filters, setFilters] = useState<Partial<AppliedFilters>>({});

  const center = result.data?.metropolitan?.center;
  const properties = result.data?.metropolitan?.properties || [];

  return (
    <Explore>
      <LeftPane>
        <Filters
          title={enumToText(props.metropolitanKey)}
          onFilterChange={setFilters}
        />
      </LeftPane>
      <CenterPane>
        <Map center={center}>
          {properties.filter(applyFilters(filters)).map((property: any) => (
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
