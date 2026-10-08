"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Alert,
  Button,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useHourlyForecast } from "@/hooks/useHourlyForecast";
import type { WeatherLocation } from "@/types/location";

const TemperatureChart = dynamic(() => import("./TemperatureChart"), {
  ssr: false,
  loading: () => <Skeleton variant="rounded" height={260} />,
});

type HourlyForecastCardProps = {
  location: WeatherLocation;
};

export default function HourlyForecastCard({
  location,
}: HourlyForecastCardProps) {
  const { data, isPending, isError, isFetching, fetchStatus, refetch } =
    useHourlyForecast(location.latitude, location.longitude);

  const points = useMemo(
    () =>
      data?.hours.map((hour) => ({
        timestamp: hour.timestamp,
        value: hour.temperature,
      })) ?? [],
    [data],
  );

  const hasTemperature = points.some((point) => point.value !== null);

  const hourlyDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: data?.timezone ?? "UTC",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [data?.timezone],
  );

  const temperatures = points
    .map((point) => point.value)
    .filter((value): value is number => value !== null);

  const minTemperature =
    temperatures.length > 0 ? Math.min(...temperatures) : null;

  const maxTemperature =
    temperatures.length > 0 ? Math.max(...temperatures) : null;

  const maxPrecipitationProbability =
    data?.hours.reduce<number | null>((max, hour) => {
      const probability = hour.precipitationProbability;

      if (probability === null) {
        return max;
      }

      return max === null ? probability : Math.max(max, probability);
    }, null) ?? null;

  const isPaused = fetchStatus === "paused";

  return (
    <Paper
      component="section"
      aria-label={`Hourly forecast for ${location.name}`}
      aria-busy={isFetching}
      sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Hourly temperature — {location.name}
        </Typography>

        {isPaused && (
          <Alert severity="info">
            Forecast updates will resume when you are online.
          </Alert>
        )}

        {isError && (
          <Alert
            severity={data ? "warning" : "error"}
            action={
              <Button
                color="inherit"
                size="small"
                disabled={isFetching || isPaused}
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            }
          >
            {data
              ? "Could not update the forecast. Showing saved data."
              : "Could not load the forecast."}
          </Alert>
        )}

        {isPending && (
          <Skeleton
            variant="rounded"
            height={260}
            aria-label="Loading hourly forecast"
          />
        )}

        {data &&
          (hasTemperature ? (
            <>
              <Typography variant="body2" color="text.secondary">
                Local time: {data.timezone}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2">
                  Lowest: {minTemperature?.toFixed(1) ?? "—"}{" "}
                  {data.units.temperature}
                </Typography>

                <Typography variant="body2">
                  Highest: {maxTemperature?.toFixed(1) ?? "—"}{" "}
                  {data.units.temperature}
                </Typography>
              </Stack>

              <Typography variant="body2">
                Highest hourly precipitation chance:{" "}
                {maxPrecipitationProbability === null
                  ? "—"
                  : `${maxPrecipitationProbability}%`}
              </Typography>

              <TemperatureChart
                points={points}
                timezone={data.timezone}
                unit={data.units.temperature}
              />

              <details>
                <summary>View hourly values</summary>

                <ul>
                  {data.hours.map((hour) => {
                    const time = hourlyDateFormatter.format(
                      new Date(hour.timestamp * 1000),
                    );

                    const temperature =
                      hour.temperature === null
                        ? "Unavailable"
                        : `${hour.temperature} ${data.units.temperature}`;

                    const precipitation =
                      hour.precipitationProbability === null
                        ? "Unavailable"
                        : `${hour.precipitationProbability}%`;

                    return (
                      <li key={hour.timestamp}>
                        {time} — Temperature: {temperature}
                        {" · "}
                        Precipitation chance: {precipitation}
                      </li>
                    );
                  })}
                </ul>
              </details>
            </>
          ) : (
            <Alert severity="info">
              No temperature data is available for this location.
            </Alert>
          ))}

        <Typography variant="caption" color="text.secondary">
          Weather data by <Link href="https://open-meteo.com/">Open-Meteo</Link>
          {". Charts by "}
          <Link href="https://www.tradingview.com/">
            TradingView Lightweight Charts™
          </Link>
          .
        </Typography>
      </Stack>
    </Paper>
  );
}
