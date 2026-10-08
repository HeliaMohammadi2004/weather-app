import { hourlyForecastResponseSchema } from "@/schemas/forecast";

type HourlyForecastPoint = {
  timestamp: number;
  temperature: number | null;
  precipitationProbability: number | null;
};

export type HourlyForecast = {
  timezone: string;
  units: {
    temperature: string;
    precipitationProbability: string;
  };
  hours: HourlyForecastPoint[];
};

export async function getHourlyForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<HourlyForecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "temperature_2m,precipitation_probability",
    forecast_hours: "24",
    temperature_unit: "celsius",
    timezone: "auto",
    timeformat: "unixtime",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch hourly forecast (${response.status})`);
  }

  const rawData: unknown = await response.json();
  const data = hourlyForecastResponseSchema.parse(rawData);

  return {
    timezone: data.timezone,

    units: {
      temperature: data.hourly_units.temperature_2m,
      precipitationProbability: data.hourly_units.precipitation_probability,
    },

    hours: data.hourly.time.map((timestamp, index) => ({
      timestamp,
      temperature: data.hourly.temperature_2m[index] ?? null,
      precipitationProbability:
        data.hourly.precipitation_probability[index] ?? null,
    })),
  };
}
