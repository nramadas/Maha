import { gql } from '@urql/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'urql';

import { LeftPane, RightPane, Explore } from '@/components/chrome/Explore';
import { AppliedFilters } from '@/components/explore/Filters';
import { InfoPanel } from '@/components/explore/InfoPanel';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyMarker } from '@/components/explore/PropertyMarker';
import { Map } from '@/components/maps/Map';
import { MapPoint } from '@/models/MapPoint';
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
  const [hovered, setHovered] = useState<MapPropertyModel | null>(null);
  const [result] = useQuery({
    query: metropolitanQuery,
    variables: { key: props.metropolitanKey },
  });
  const [filters, setFilters] = useState<Partial<AppliedFilters>>({});
  const [focusPoint, setFocusPoint] = useState<MapPoint | undefined>();

  const properties = result.data?.metropolitan?.properties || [];
  const filteredProperties = properties.filter(applyFilters(filters));
  const initialCenter = result.data?.metropolitan?.center;

  const selectProperty = useCallback(
    (property: MapPropertyModel) => {
      const { lat, lng } = property.location;

      if (lat && lng) {
        setFocusPoint({ lat, lng });
      }
    },
    [setFocusPoint],
  );

  return (
    <Explore>
      <LeftPane>
        <Map
          initialCenter={initialCenter}
          focusPoint={focusPoint}
          hoverPoint={
            hovered?.location.lat && hovered?.location.lng
              ? {
                  lat: hovered.location.lat,
                  lng: hovered.location.lng,
                }
              : undefined
          }
        >
          {filteredProperties.map((property: any) => (
            <PropertyMarker
              hovered={hovered?.id === property.id}
              key={property.id}
              property={property}
              onClick={() => selectProperty(property)}
              onHoverChange={h => {
                if (h) {
                  setHovered(property);
                } else if (hovered?.id === property.id) {
                  setHovered(null);
                }
              }}
            />
          ))}
        </Map>
      </LeftPane>
      <RightPane>
        <InfoPanel
          hovered={hovered}
          metropolitanKey={props.metropolitanKey}
          properties={filteredProperties}
          onHoverChange={setHovered}
          onSelectProperty={selectProperty}
        />
      </RightPane>
    </Explore>
  );
}
