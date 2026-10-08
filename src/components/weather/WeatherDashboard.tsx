"use client";

import { Alert, Link, Stack, Typography } from "@mui/material";
import CitySearch from "./CitySearch";
import CurrentWeatherCard from "./CurrentWeatherCard";
import type { WeatherLocation } from "@/types/location";
import FavoriteButton from "./FavoriteButton";
import FavoriteLocations from "./FavoriteLocations";
import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import HourlyForecastCard from "./HourlyForecastCard";

type WeatherDashboardProps = {
  initialLocation?: WeatherLocation;
};

export default function WeatherDashboard({
  initialLocation,
}: WeatherDashboardProps) {
  const [selectedLocation, setSelectedLocation] =
    useState<WeatherLocation | null>(initialLocation ?? null);

  useEffect(() => {
    void useFavoritesStore.persist.rehydrate();
  }, []);

  return (
    <Stack spacing={3}>
      <CitySearch value={selectedLocation} onChange={setSelectedLocation} />
      <FavoriteLocations
        selectedLocationId={selectedLocation?.id}
        onSelect={setSelectedLocation}
      />

      {selectedLocation ? (
        <Stack spacing={2}>
          <div>
            <FavoriteButton location={selectedLocation} />
          </div>

          <CurrentWeatherCard location={selectedLocation} />
          <HourlyForecastCard location={selectedLocation} />
        </Stack>
      ) : (
        <Alert severity="info">Search for a city to see its weather.</Alert>
      )}

      <Typography variant="caption" color="text.secondary">
        Location data by <Link href="https://www.geonames.org/">GeoNames</Link>
        {" via "}
        <Link href="https://open-meteo.com/">Open-Meteo</Link>.
      </Typography>
    </Stack>
  );
}
