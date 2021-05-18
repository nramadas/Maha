import React, { createContext, useState } from 'react';

import { AppliedFilters, DEFAULT_DATA } from '@/models/AppliedFilters';
import { MapBounds } from '@/models/MapBounds';
import { SortType } from '@/models/SortType';

export interface AppliedFiltersDetails {
  appliedFilters: AppliedFilters;
  setAppliedFilters(appliedFilters: AppliedFilters): void;
}

export const AppliedFiltersContext = createContext<AppliedFiltersDetails>({
  appliedFilters: DEFAULT_DATA,
  setAppliedFilters: () => {},
});

export interface HoveredPropertyDetails<P> {
  hoveredProperty: P | null;
  setHoveredProperty(property: P | null): void;
}

export const HoveredPropertyContext = createContext<
  HoveredPropertyDetails<any>
>({
  hoveredProperty: null,
  setHoveredProperty: () => {},
});

export interface MapBoundsDetails {
  mapBounds: MapBounds;
  setMapBounds(bounds: MapBounds): void;
}

export const MapBoundsContext = createContext<MapBoundsDetails>({
  mapBounds: { ne: undefined, sw: undefined },
  setMapBounds: () => {},
});

export interface SelectedPropertyDetails<P> {
  selectedProperty: P | null;
  setSelectedProperty(property: P | null): void;
}

export const SelectedPropertyContext = createContext<
  SelectedPropertyDetails<any>
>({
  selectedProperty: null,
  setSelectedProperty: () => {},
});

export interface SortTypeDetails {
  sortType: SortType;
  setSortType(sortType: SortType): void;
}

export const SortTypeContext = createContext<SortTypeDetails>({
  sortType: SortType.Relevance,
  setSortType: () => {},
});

interface Props {
  children?: React.ReactNode;
}

export function ExplorePageProvider<P>(props: Props) {
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_DATA);
  const [sortType, setSortType] = useState(SortType.Relevance);
  const [hoveredProperty, setHoveredProperty] = useState<P | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<P | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds>({
    ne: undefined,
    sw: undefined,
  });

  return (
    <AppliedFiltersContext.Provider
      value={{ appliedFilters, setAppliedFilters }}
    >
      <HoveredPropertyContext.Provider
        value={{ hoveredProperty, setHoveredProperty }}
      >
        <MapBoundsContext.Provider
          value={{
            mapBounds,
            setMapBounds,
          }}
        >
          <SelectedPropertyContext.Provider
            value={{
              selectedProperty,
              setSelectedProperty,
            }}
          >
            <SortTypeContext.Provider
              value={{
                sortType,
                setSortType,
              }}
            >
              {props.children}
            </SortTypeContext.Provider>
          </SelectedPropertyContext.Provider>
        </MapBoundsContext.Provider>
      </HoveredPropertyContext.Provider>
    </AppliedFiltersContext.Provider>
  );
}
