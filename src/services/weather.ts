import { currentWeatherResponseSchema, type CurrentWeatherResponse } from "@/schemas/weather";

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<CurrentWeatherResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"].join(
      ",",
    ),
    timezone: "auto",
  });
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch current weather data (${response.status})`,
    );
  }

  const data: unknown = await response.json();

  return currentWeatherResponseSchema.parse(data);
}
