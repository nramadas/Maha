import { useContext } from 'react';

import {
  FiltersContext,
  HighlightedLandmarkContext,
  HighlightedLandmarkDetails,
  HoveredPropertyContext,
  HoveredPropertyDetails,
  MapBoundsContext,
  SelectedPropertyContext,
  SelectedPropertyDetails,
  SortTypeContext,
} from '@/contexts/ExplorePage';

export function useFilters() {
  return useContext(FiltersContext);
}

export function useHighlightedLandmark<S>() {
  return useContext<HighlightedLandmarkDetails<S>>(HighlightedLandmarkContext);
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
