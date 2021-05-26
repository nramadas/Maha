import React, { createContext, useState } from 'react';

import { AppliedFilters, DEFAULT_DATA } from '@/models/AppliedFilters';
import { MapBounds } from '@/models/MapBounds';
import { SortType } from '@/models/SortType';

export interface FiltersDetails {
  filters: AppliedFilters;
  setFilters(filters: AppliedFilters): void;
}

export const FiltersContext = createContext<FiltersDetails>({
  filters: DEFAULT_DATA,
  setFilters: () => {},
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
  applicableMapBounds: MapBounds;
  mapBounds: MapBounds;
  setMapBounds(bounds: MapBounds): void;
  syncApplicableMapBounds(): void;
}

export const MapBoundsContext = createContext<MapBoundsDetails>({
  applicableMapBounds: { ne: undefined, sw: undefined },
  mapBounds: { ne: undefined, sw: undefined },
  setMapBounds: () => {},
  syncApplicableMapBounds: () => {},
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
  const [filters, setFilters] = useState(DEFAULT_DATA);
  const [sortType, setSortType] = useState(SortType.Relevance);
  const [hoveredProperty, setHoveredProperty] = useState<P | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<P | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds>({
    ne: undefined,
    sw: undefined,
  });
  const [applicableMapBounds, setApplicableMapBounds] = useState<MapBounds>({
    ne: undefined,
    sw: undefined,
  });

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      <HoveredPropertyContext.Provider
        value={{ hoveredProperty, setHoveredProperty }}
      >
        <MapBoundsContext.Provider
          value={{
            applicableMapBounds,
            mapBounds,
            setMapBounds: (bounds: MapBounds) => {
              setMapBounds(bounds);

              if (!applicableMapBounds.ne || !applicableMapBounds.sw) {
                setApplicableMapBounds(() => bounds);
              }
            },
            syncApplicableMapBounds: () => setApplicableMapBounds(mapBounds),
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
    </FiltersContext.Provider>
  );
}
