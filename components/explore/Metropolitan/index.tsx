import { gql } from '@urql/core';
import React, { useState } from 'react';
import { useQuery } from 'urql';

import { LeftPane, RightPane, Explore } from '@/components/chrome/Explore';
import { AppliedFilters } from '@/components/explore/Filters';
import { InfoPanel } from '@/components/explore/InfoPanel';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyMarker } from '@/components/explore/PropertyMarker';
import { Map } from '@/components/maps/Map';
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
        amenitiesGrill
        amenitiesGym
        amenitiesPool
        amenitiesSecurity
        appliancesDishwasher
        appliancesDryer
        appliancesWasher
        built
        constructionMaterials {
          en
        }
        fees
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
        organizationName
        parkingCoveredSpaces
        parkingGarage
        parkingOpenSpaces
        price
        propertyCondition
        schools {
          id
          location {
            address
            lat
            lng
          }
          name
          type
        }
        sqft
        taxes
        type
        utilitiesAirConditioning
        utilitiesGasType
        utilitiesHeating
        utilitiesWaterFilter
      }
    }
  }
`;

const applyFilters = (filters: Partial<AppliedFilters>) => (
  property: MapPropertyModel,
) => {
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      for (const prefix of ['min', 'max']) {
        if (name.startsWith(prefix)) {
          const [, _prop] = name.split(prefix);
          const prop = (_prop[0].toLowerCase() +
            _prop.slice(1)) as keyof MapPropertyModel;

          const propValue = property[prop];

          if (!propValue) {
            continue;
          }

          if (prefix === 'min' && propValue < value) {
            return false;
          }

          if (prefix === 'max' && propValue > value) {
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [result] = useQuery({
    query: metropolitanQuery,
    variables: { key: props.metropolitanKey },
  });
  const [filters, setFilters] = useState<Partial<AppliedFilters>>({});

  const center = result.data?.metropolitan?.center;
  const properties = result.data?.metropolitan?.properties || [];
  const filteredProperties = properties.filter(applyFilters(filters));

  return (
    <Explore>
      <LeftPane>
        <Map center={center}>
          {filteredProperties.map((property: any) => (
            <PropertyMarker
              hovered={hoveredId === property.id}
              key={property.id}
              property={property}
              onHoverChange={h => {
                if (h) {
                  setHoveredId(property.id);
                } else if (hoveredId === property.id) {
                  setHoveredId(null);
                }
              }}
            />
          ))}
        </Map>
      </LeftPane>
      <RightPane>
        <InfoPanel
          hoveredId={hoveredId}
          metropolitanKey={props.metropolitanKey}
          properties={filteredProperties}
          onHoverChange={setHoveredId}
        />
      </RightPane>
    </Explore>
  );
}
