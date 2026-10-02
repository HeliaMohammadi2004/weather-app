"use client";

import {
  Alert,
  Button,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import type { WeatherLocation } from "@/types/location";

type CurrentWeatherCardProps = {
  location: WeatherLocation;
};

export default function CurrentWeatherCard({
  location,
}: CurrentWeatherCardProps) {
  const { name: cityName, latitude, longitude, country, admin1 } = location;

  const { data, isPending, isError, isFetching, fetchStatus, refetch } =
    useCurrentWeather(latitude, longitude);

  const locationDetails = [admin1 !== cityName ? admin1 : undefined, country]
    .filter(Boolean)
    .join(", ");

  return (
    <Paper
      component="section"
      aria-label={`Current weather in ${cityName}`}
      aria-busy={isFetching}
      elevation={3}
      sx={{ p: { xs: 2, sm: 4 } }}
    >
      <Stack spacing={2}>
        <div>
          <Typography component="h2" variant="h5">
            {cityName}
          </Typography>

          {locationDetails && (
            <Typography variant="body2" color="text.secondary">
              {locationDetails}
            </Typography>
          )}
        </div>

        {fetchStatus === "paused" && (
          <Alert severity="info">Waiting for a network connection.</Alert>
        )}

        {isPending && (
          <Stack spacing={1} role="status" aria-label="Loading weather">
            <Skeleton variant="text" width="55%" height={64} />
            <Skeleton variant="text" width="75%" />
            <Skeleton variant="text" width="65%" />
          </Stack>
        )}

        {isError && (
          <Alert severity={data ? "warning" : "error"}>
            {data
              ? "Could not refresh the weather. Showing previously loaded data."
              : "Could not load the weather. Please try again."}
          </Alert>
        )}

        {data && (
          <Stack spacing={1}>
            <Typography variant="h3" component="p">
              {data.current.temperature_2m === null
                ? "—"
                : `${data.current.temperature_2m} ${data.current_units.temperature_2m}`}
            </Typography>

            <Typography>
              Humidity:{" "}
              {data.current.relative_humidity_2m === null
                ? "—"
                : `${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`}
            </Typography>

            <Typography>
              Wind:{" "}
              {data.current.wind_speed_10m === null
                ? "—"
                : `${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`}
            </Typography>
          </Stack>
        )}

        <Button
          variant="outlined"
          onClick={() => void refetch()}
          disabled={isFetching || fetchStatus === "paused"}
          sx={{ alignSelf: "flex-start" }}
        >
          {isFetching ? "Loading…" : isError ? "Try again" : "Refresh"}
        </Button>

        <Typography variant="caption" color="text.secondary">
          Weather data by <Link href="https://open-meteo.com/">Open-Meteo</Link>
        </Typography>
      </Stack>
    </Paper>
  );
}
