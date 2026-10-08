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
