import { z } from "zod";

export const hourlyForecastResponseSchema = z.object({
  timezone: z.string(),

  hourly_units: z.object({
    temperature_2m: z.string(),
    precipitation_probability: z.string(),
  }),

  hourly: z
    .object({
      time: z.array(z.number().int()),
      temperature_2m: z.array(z.number().nullable()),
      precipitation_probability: z.array(z.number().min(0).max(100).nullable()),
    })
    .refine(
      (hourly) =>
        hourly.time.length === hourly.temperature_2m.length &&
        hourly.time.length === hourly.precipitation_probability.length,
      {
        message: "Hourly forecast arrays must have equal lengths",
      },
    ),
});

export const dailyForecastResponseSchema = z.object({
  timezone: z.string(),

  daily_units: z.object({
    temperature_2m_max: z.string(),
    temperature_2m_min: z.string(),
    precipitation_probability_max: z.string(),
  }),

  daily: z
    .object({
      time: z.array(z.iso.date()).length(7),

      temperature_2m_max: z.array(z.number().nullable()),

      temperature_2m_min: z.array(z.number().nullable()),

      precipitation_probability_max: z.array(
        z.number().min(0).max(100).nullable(),
      ),

      weather_code: z.array(z.number().int().nullable()),
    })
    .refine(
      (daily) =>
        daily.time.length === daily.temperature_2m_max.length &&
        daily.time.length === daily.temperature_2m_min.length &&
        daily.time.length === daily.precipitation_probability_max.length &&
        daily.time.length === daily.weather_code.length,
      {
        message: "Daily forecast arrays must have equal lengths",
      },
    ),
});

export type DailyForecastResponse = z.infer<typeof dailyForecastResponseSchema>;
