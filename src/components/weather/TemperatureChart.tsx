"use client";

import { useEffect, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import {
  ColorType,
  LineSeries,
  createChart,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";

export type TemperaturePoint = {
  timestamp: number;
  value: number | null;
};

type TemperatureChartProps = {
  points: TemperaturePoint[];
  timezone: string;
  unit: string;
};

export default function TemperatureChart({
  points,
  timezone,
  unit,
}: TemperatureChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const hourFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const chart = createChart(container, {
      autoSize: true,

      layout: {
        background: {
          type: ColorType.Solid,
          color: theme.palette.background.paper,
        },
        textColor: theme.palette.text.secondary,
      },

      grid: {
        vertLines: { visible: false },
        horzLines: { color: theme.palette.divider },
      },

      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: Time) =>
          typeof time === "number"
            ? hourFormatter.format(new Date(time * 1000))
            : "",
      },

      localization: {
        timeFormatter: (time: Time) =>
          typeof time === "number"
            ? dateFormatter.format(new Date(time * 1000))
            : "",
      },
    });

    const series = chart.addSeries(LineSeries, {
      color: theme.palette.primary.main,
      lineWidth: 2,
      priceLineVisible: false,

      priceFormat: {
        type: "custom",
        minMove: 0.1,
        formatter: (value: number) => `${value.toFixed(1)} ${unit}`,
      },
    });

    series.setData(
      points.map(({ timestamp, value }) => {
        const time = timestamp as UTCTimestamp;

        return value === null ? { time } : { time, value };
      }),
    );

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [points, timezone, unit, theme]);

  return (
    <Box
      ref={containerRef}
      role="img"
      aria-label={`Hourly temperature chart in ${unit}. Time zone: ${timezone}.`}
      sx={{ width: "100%", height: { xs: 260, sm: 320 } }}
    />
  );
}
