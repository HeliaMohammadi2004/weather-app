"use client";

import { useState } from "react";
import { Alert, Autocomplete, Button, Stack, TextField } from "@mui/material";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { MIN_CITY_SEARCH_LENGTH } from "@/services/location";
import type { WeatherLocation } from "@/types/location";

type CitySearchProps = {
  value: WeatherLocation | null;
  onChange: (location: WeatherLocation | null) => void;
};

function getLocationLabel(location: WeatherLocation): string {
  return [
    location.name,
    location.admin1 !== location.name ? location.admin1 : undefined,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function CitySearch({ value, onChange }: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = searchTerm.trim();
  const debouncedSearchTerm = useDebouncedValue(normalizedSearchTerm);

  const canSearch = normalizedSearchTerm.length >= MIN_CITY_SEARCH_LENGTH;

  const isDebouncing = normalizedSearchTerm !== debouncedSearchTerm;

  const query = useLocationSearch(
    canSearch && !isDebouncing ? debouncedSearchTerm : "",
  );

  const options = canSearch && !isDebouncing ? (query.data ?? []) : [];

  const showError = canSearch && !isDebouncing && query.isError;
  const isPaused = query.fetchStatus === "paused";

  const loading = canSearch && (isDebouncing || query.isFetching);

  const noOptionsText = !canSearch
    ? `Type at least ${MIN_CITY_SEARCH_LENGTH} characters`
    : isPaused
      ? "Waiting for a network connection"
      : showError
        ? "Search unavailable"
        : "No cities found";

  return (
    <Stack spacing={1}>
      <Autocomplete<WeatherLocation>
        fullWidth
        value={value}
        options={options}
        loading={loading}
        loadingText="Searching cities…"
        noOptionsText={noOptionsText}
        filterOptions={(options) => options}
        getOptionLabel={getLocationLabel}
        getOptionKey={(option) => option.id}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        onChange={(_, nextLocation) => {
          onChange(nextLocation);
          setSearchTerm("");
        }}
        onInputChange={(_, nextInput, reason) => {
          if (reason === "input") {
            setSearchTerm(nextInput);
          } else {
            setSearchTerm("");
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search city"
            placeholder="For example, Berlin"
          />
        )}
      />

      {showError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              disabled={query.isFetching || isPaused}
              onClick={() => void query.refetch()}
            >
              Retry
            </Button>
          }
        >
          Could not search cities. Please try again.
        </Alert>
      )}
    </Stack>
  );
}
