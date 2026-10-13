"use client";

import { useMemo, useState } from "react";
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

const HourlyLineChart = dynamic(() => import("./HourlyLineChart"), {
  ssr: false,
  loading: () => <Skeleton variant="rounded" height={260} />,
});

type HourlyForecastCardProps = {
  location: WeatherLocation;
};

type ForecastMetric = "temperature" | "precipitationProbability";

export default function HourlyForecastCard({
  location,
}: HourlyForecastCardProps) {
  const {
    data,
    dataUpdatedAt,
    isPending,
    isError,
    isFetching,
    fetchStatus,
    refetch,
  } = useHourlyForecast(location.latitude, location.longitude);

  const [metric, setMetric] = useState<ForecastMetric>("temperature");

  const points = useMemo(
    () =>
      data?.hours.map((hour) => ({
        timestamp: hour.timestamp,
        value: hour.temperature,
      })) ?? [],
    [data],
  );

  const chartPoints = useMemo(
    () =>
      data?.hours.map((hour) => ({
        timestamp: hour.timestamp,
        value: hour[metric],
      })) ?? [],
    [data, metric],
  );

  const hasChartData = chartPoints.some((point) => point.value !== null);

  const isTemperature = metric === "temperature";

  const chartLabel = isTemperature
    ? "Hourly temperature"
    : "Hourly precipitation chance";

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

  const updatedAtFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: data?.timezone ?? "UTC",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [data?.timezone],
  );

  const updatedAtLabel =
    dataUpdatedAt > 0
      ? updatedAtFormatter.format(new Date(dataUpdatedAt))
      : "—";

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
          Hourly forecast — {location.name}
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

        {data && (
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Time zone: {data.timezone}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  aria-live="polite"
                >
                  Last retrieved: {updatedAtLabel}
                </Typography>
              </Stack>

              <Button
                type="button"
                variant="outlined"
                size="small"
                disabled={isFetching || isPaused}
                onClick={() => void refetch()}
              >
                {isFetching ? "Refreshing…" : "Refresh forecast"}
              </Button>
            </Stack>

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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              role="group"
              aria-label="Forecast metric"
            >
              <Button
                type="button"
                variant={isTemperature ? "contained" : "outlined"}
                aria-pressed={isTemperature}
                onClick={() => setMetric("temperature")}
              >
                Temperature
              </Button>

              <Button
                type="button"
                variant={!isTemperature ? "contained" : "outlined"}
                aria-pressed={!isTemperature}
                onClick={() => setMetric("precipitationProbability")}
              >
                Precipitation chance
              </Button>
            </Stack>

            <Typography variant="subtitle2" component="h3">
              {chartLabel}
            </Typography>

            {hasChartData ? (
              <HourlyLineChart
                minValue={isTemperature ? undefined : 0}
                maxValue={isTemperature ? undefined : 100}
                points={chartPoints}
                timezone={data.timezone}
                unit={
                  isTemperature
                    ? data.units.temperature
                    : data.units.precipitationProbability
                }
                label={`${chartLabel} for ${location.name}`}
                precision={isTemperature ? 1 : 0}
              />
            ) : (
              <Alert severity="info">
                No {isTemperature ? "temperature" : "precipitation probability"}{" "}
                data is available for this location.
              </Alert>
            )}

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
        )}

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
