"use client";

import { useQuery } from "@tanstack/react-query";
import { getDailyForecast } from "@/services/forecast";

export function useDailyForecast(latitude: number, longitude: number) {
  return useQuery({
    queryKey: ["weather", "daily", latitude, longitude],

    queryFn: ({ signal }) => getDailyForecast(latitude, longitude, signal),

    staleTime: 10 * 60 * 1000,
  });
}
