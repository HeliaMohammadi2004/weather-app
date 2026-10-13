
"use client";

import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";
import CloudIcon from "@mui/icons-material/Cloud";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import { useDailyForecast } from "@/hooks/useDailyForecast";
import type { WeatherLocation } from "@/types/location";

type DailyForecastCardProps = {
  location: WeatherLocation;
};

// Convert WMO codes to readable weather conditions.
function getWeatherInfo(code: number | null) {
  if (code === 0) {
    return {
      label: "Clear sky",
      icon: <WbSunnyIcon color="warning" />,
    };
  }

  if (code === 1 || code === 2) {
    return {
      label: code === 1 ? "Mainly clear" : "Partly cloudy",
      icon: <WbCloudyIcon color="warning" />,
    };
  }

  if (code === 3) {
    return {
      label: "Overcast",
      icon: <CloudIcon color="action" />,
    };
  }

  if ([45, 48].includes(code ?? -1)) {
    return {
      label: "Fog",
      icon: <CloudIcon color="action" />,
    };
  }

  if (
    [
      51, 53, 55, 56, 57,
      61, 63, 65, 66, 67,
      80, 81, 82,
    ].includes(code ?? -1)
  ) {
    return {
      label: "Rain / drizzle",
      icon: <WaterDropIcon color="info" />,
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code ?? -1)) {
    return {
      label: "Snow",
      icon: <AcUnitIcon color="info" />,
    };
  }

  if ([95, 96, 97, 99].includes(code ?? -1)) {
    return {
      label: "Thunderstorm",
      icon: <ThunderstormIcon color="warning" />,
    };
  }

  return {
    label: "Unavailable",
    icon: <HelpOutlinedIcon color="disabled" />,
  };
}

// Format an API calendar date without shifting its day.
function formatForecastDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatTemperature(
  value: number | null,
  unit: string,
) {
  return value === null ? "—" : `${value.toFixed(1)} ${unit}`;
}

export default function DailyForecastCard({
  location,
}: DailyForecastCardProps) {
  const {
    data,
    dataUpdatedAt,
    isPending,
    isError,
    isFetching,
    fetchStatus,
    refetch,
  } = useDailyForecast(location.latitude, location.longitude);

  const isPaused = fetchStatus === "paused";

  const updatedAtLabel =
    dataUpdatedAt > 0
      ? new Intl.DateTimeFormat("en-GB", {
          timeZone: data?.timezone ?? "UTC",
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(dataUpdatedAt))
      : "—";

  return (
    <Paper
      component="section"
      aria-label={`Daily forecast for ${location.name}`}
      aria-busy={isFetching}
      sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}
    >
      <Stack spacing={2}>
        <Typography component="h2" variant="h6">
          7-Day Forecast — {location.name}
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
                size="small"
                color="inherit"
                disabled={isFetching || isPaused}
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            }
          >
            {data
              ? "Could not update the forecast. Showing cached data."
              : "Could not load the daily forecast."}
          </Alert>
        )}

        {isPending && (
          <Stack
            spacing={1}
            role="status"
            aria-label="Loading daily forecast"
          >
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={64}
              />
            ))}
          </Stack>
        )}

        {data && (
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Time zone: {data.timezone}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last retrieved: {updatedAtLabel}
                </Typography>
              </Stack>

              <Button
                type="button"
                size="small"
                variant="outlined"
                disabled={isFetching || isPaused}
                onClick={() => void refetch()}
              >
                {isFetching
                  ? "Refreshing..."
                  : "Refresh forecast"}
              </Button>
            </Stack>

            {data.days.length === 0 ? (
              <Alert severity="info">
                No daily forecast data is available.
              </Alert>
            ) : (
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  p: 0,
                  m: 0,
                }}
              >
                {data.days.map((day) => {
                  const weather = getWeatherInfo(
                    day.weatherCode,
                  );

                  return (
                    <Box
                      component="li"
                      key={day.date}
                      sx={{
                        py: 1.5,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        "&:last-child": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={1}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: {
                            xs: "stretch",
                            sm: "center",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{
                            alignItems: "center",
                            minWidth: 0,
                          }}
                        >
                          {weather.icon}

                          <Box>
                            <Typography
                              variant="subtitle2"
                            >
                              {formatForecastDate(day.date)}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {weather.label}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            alignItems: "center",
                            justifyContent: {
                              xs: "space-between",
                              sm: "flex-end",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Low:{" "}
                            {formatTemperature(
                              day.minTemperature,
                              data.units.temperature,
                            )}
                          </Typography>

                          <Typography variant="body2">
                            High:{" "}
                            {formatTemperature(
                              day.maxTemperature,
                              data.units.temperature,
                            )}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ alignItems: "center" }}
                          >
                            <WaterDropIcon
                              color="info"
                              fontSize="small"
                            />

                            <Typography variant="body2">
                              {day.precipitationProbability === null
                                ? "—"
                                : `${day.precipitationProbability}${data.units.precipitationProbability}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            )}
          </>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
        >
          Weather data by{" "}
          <Link href="https://open-meteo.com/">
            Open-Meteo
          </Link>.
        </Typography>
      </Stack>
    </Paper>
  );
}
