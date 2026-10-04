import { locationSearchResponseSchema } from "@/schemas/location";
import type { WeatherLocation } from "@/types/location";

export const MIN_CITY_SEARCH_LENGTH = 2;

export async function searchLocations(
  searchTerm: string,
  signal?: AbortSignal
): Promise<WeatherLocation[]> {
  const name = searchTerm.trim();

  if (name.length < MIN_CITY_SEARCH_LENGTH) {
    return [];
  }

  const params = new URLSearchParams({
    name,
    count: "8",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to search locations (${response.status})`
    );
  }

  const data: unknown = await response.json();
  const parsed = locationSearchResponseSchema.parse(data);

  return parsed.results;
}