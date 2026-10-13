import {
  hourlyForecastResponseSchema,
  dailyForecastResponseSchema,
} from "@/schemas/forecast";

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

export type DailyForecastDay = {
  date: string;
  weatherCode: number | null;
  minTemperature: number | null;
  maxTemperature: number | null;
  precipitationProbability: number | null;
};

export type DailyForecast = {
  timezone: string;
  units: {
    temperature: string;
    precipitationProbability: string;
  };
  days: DailyForecastDay[];
};

export async function getDailyForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<DailyForecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(","),

    forecast_days: "7",
    temperature_unit: "celsius",
    timezone: "auto",
    timeformat: "iso8601",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch daily forecast (${response.status})`);
  }

  const rawData: unknown = await response.json();

  const data = dailyForecastResponseSchema.parse(rawData);

  return {
    timezone: data.timezone,

    units: {
      temperature: data.daily_units.temperature_2m_max,
      precipitationProbability: data.daily_units.precipitation_probability_max,
    },

    days: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index] ?? null,
      minTemperature: data.daily.temperature_2m_min[index] ?? null,
      maxTemperature: data.daily.temperature_2m_max[index] ?? null,
      precipitationProbability:
        data.daily.precipitation_probability_max[index] ?? null,
    })),
  };
}
