import { z } from "zod";

export const currentWeatherResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),

  current: z.object({
    time: z.string(),
    temperature_2m: z.number().nullable(),
    relative_humidity_2m: z.number().nullable(),
    wind_speed_10m: z.number().nullable(),
  }),

  current_units: z.object({
    temperature_2m: z.string(),
    relative_humidity_2m: z.string(),
    wind_speed_10m: z.string(),
  }),
});

export type CurrentWeatherResponse = z.infer<
  typeof currentWeatherResponseSchema
>;
