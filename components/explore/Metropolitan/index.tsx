import { gql } from '@urql/core';
import React from 'react';
import { useQuery } from 'urql';

import { LeftPane, RightPane, Explore } from '@/components/chrome/Explore';
import { InfoPanel } from '@/components/explore/InfoPanel';
import { LandmarkMarkers } from '@/components/explore/LandmarkMarkers';
import { MapControls } from '@/components/explore/MapControls';
import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyMarkers } from '@/components/explore/PropertyMarkers';
import { Map } from '@/components/maps/Map';
import { BottomSheetProvider } from '@/contexts/BottomSheet';
import { ExplorePageProvider } from '@/contexts/ExplorePage';
import { MetropolitanKey } from '@/models/MetropolitanKey';

type School = MapPropertyModel['schools'][number];

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

interface Props {
  metropolitanKey: MetropolitanKey;
}

export function Metropolitan(props: Props) {
  const [result] = useQuery({
    query: metropolitanQuery,
    variables: { key: props.metropolitanKey },
  });

  const properties = result.data?.metropolitan?.properties || [];
  const initialCenter = result.data?.metropolitan?.center;

  return (
    <ExplorePageProvider<MapPropertyModel, School>>
      <BottomSheetProvider>
        <Explore>
          <LeftPane>
            <>
              <Map initialCenter={initialCenter}>
                <PropertyMarkers properties={properties} />
                <LandmarkMarkers />
              </Map>
              <MapControls />
            </>
          </LeftPane>
          <RightPane>
            <InfoPanel
              metropolitanKey={props.metropolitanKey}
              properties={properties}
              propertiesPending={result.fetching}
            />
          </RightPane>
        </Explore>
      </BottomSheetProvider>
    </ExplorePageProvider>
  );
}
