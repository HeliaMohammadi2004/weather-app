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
export type HourlyChartPoint = {
  timestamp: number;
  value: number | null;
};

type HourlyLineChartProps = {
  points: HourlyChartPoint[];
  timezone: string;
  unit: string;
  label: string;
  precision?: number;
  minValue?: number;
  maxValue?: number;
};

export default function HourlyLineChart({
  points,
  timezone,
  unit,
  label,
  precision = 1,
  minValue,
  maxValue,
}: HourlyLineChartProps) {
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

    const fixedRange =
      minValue !== undefined && maxValue !== undefined && minValue < maxValue
        ? { minValue, maxValue }
        : undefined;

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

      rightPriceScale: {
        autoScale: true,
        scaleMargins: fixedRange
          ? { top: 0.1, bottom: 0 }
          : { top: 0.2, bottom: 0.1 },
      },

      handleScale: {
        axisPressedMouseMove: {
          time: true,
          price: !fixedRange,
        },
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

      autoscaleInfoProvider: fixedRange
        ? () => ({ priceRange: fixedRange })
        : undefined,

      priceFormat: {
        type: "custom",
        minMove: 10 ** -precision,
        formatter: (value: number) => `${value.toFixed(precision)} ${unit}`,
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
  }, [points, timezone, unit, precision, theme, minValue, maxValue]);

  return (
    <Box
      ref={containerRef}
      role="img"
      aria-label={`${label}. Unit: ${unit}. Time zone: ${timezone}.`}
      sx={{ width: "100%", height: { xs: 260, sm: 320 } }}
    />
  );
}
