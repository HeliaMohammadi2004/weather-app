"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "@/services/weather";

export function useCurrentWeather(
  latitude: number,
  longitude: number
) {
  return useQuery({
    queryKey: ["weather", "current", latitude, longitude],
    queryFn: ({ signal }) =>
      getCurrentWeather(latitude, longitude, signal),
  });
}