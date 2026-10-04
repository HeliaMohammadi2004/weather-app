"use client";

import { useState } from "react";
import { Alert, Link, Stack, Typography } from "@mui/material";
import CitySearch from "./CitySearch";
import CurrentWeatherCard from "./CurrentWeatherCard";
import type { WeatherLocation } from "@/types/location";

type WeatherDashboardProps = {
  initialLocation?: WeatherLocation;
};

export default function WeatherDashboard({
  initialLocation,
}: WeatherDashboardProps) {
  const [selectedLocation, setSelectedLocation] =
    useState<WeatherLocation | null>(initialLocation ?? null);

  return (
    <Stack spacing={3}>
      <CitySearch
        value={selectedLocation}
        onChange={setSelectedLocation}
      />

      {selectedLocation ? (
        <CurrentWeatherCard location={selectedLocation} />
      ) : (
        <Alert severity="info">
          Select a city to see its current weather.
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary">
        Location data by{" "}
        <Link href="https://www.geonames.org/">GeoNames</Link>
        {" via "}
        <Link href="https://open-meteo.com/">Open-Meteo</Link>.
      </Typography>
    </Stack>
  );
}