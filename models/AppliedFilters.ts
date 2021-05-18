export interface AppliedFilters {
  maxPrice: number | null;
  minPrice: number | null;
  maxSqft: number | null;
  minSqft: number | null;
  minNumBedrooms: number | null;
  minNumBathrooms: number | null;
}

export const DEFAULT_DATA: AppliedFilters = {
  maxPrice: null,
  minPrice: null,
  maxSqft: null,
  minSqft: null,
  minNumBedrooms: null,
  minNumBathrooms: null,
};
