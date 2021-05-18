import { useContext } from 'react';

import {
  AppliedFiltersContext,
  HoveredPropertyContext,
  HoveredPropertyDetails,
  MapBoundsContext,
  SelectedPropertyContext,
  SelectedPropertyDetails,
  SortTypeContext,
} from '@/contexts/ExplorePage';

export function useAppliedFilters() {
  return useContext(AppliedFiltersContext);
}

export function useHoveredProperty<P>() {
  return useContext<HoveredPropertyDetails<P>>(HoveredPropertyContext);
}

export function useMapBounds() {
  return useContext(MapBoundsContext);
}

export function useSelectedProperty<P>() {
  return useContext<SelectedPropertyDetails<P>>(SelectedPropertyContext);
}

export function useSortType() {
  const context = useContext(SortTypeContext);
  return context;
}
