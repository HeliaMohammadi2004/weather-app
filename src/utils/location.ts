import type { WeatherLocation } from "@/types/location";

export function getLocationLabel(location: WeatherLocation): string {
  return [
    location.name,
    location.admin1 !== location.name ? location.admin1 : undefined,
    location.country,
  ]
    .filter((part) => part !== undefined && part.trim() !== "")
    .join(", ");
}
