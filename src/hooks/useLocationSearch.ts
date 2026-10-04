"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MIN_CITY_SEARCH_LENGTH,
  searchLocations,
} from "@/services/location";

export function useLocationSearch(searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim();

  return useQuery({
    queryKey: ["locations", "search", normalizedSearchTerm],

    queryFn: ({ signal }) =>
      searchLocations(normalizedSearchTerm, signal),

    enabled:
      normalizedSearchTerm.length >= MIN_CITY_SEARCH_LENGTH,

    staleTime: 24 * 60 * 60 * 1000,
  });
}