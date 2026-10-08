"use client";

import { useQuery } from "@tanstack/react-query";
import { getHourlyForecast } from "@/services/forecast";

export function useHourlyForecast(latitude: number, longitude: number) {
  return useQuery({
    queryKey: ["weather", "hourly", latitude, longitude],
    queryFn: ({ signal }) => getHourlyForecast(latitude, longitude, signal),
    staleTime: 10 * 60 * 1000,
  });
}
