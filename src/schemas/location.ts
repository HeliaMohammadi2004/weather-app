import { z } from "zod";

export const weatherLocationSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  country: z.string().optional(),
  admin1: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const locationSearchResponseSchema = z.object({
  results: z.array(weatherLocationSchema).default([]),
});