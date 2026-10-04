import type { z } from "zod";
import type { weatherLocationSchema } from "@/schemas/location";

export type WeatherLocation = z.infer<
  typeof weatherLocationSchema
>;