"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import type { WeatherLocation } from "@/types/location";

type FavoriteLocationsProps = {
  selectedLocationId?: WeatherLocation["id"];
  onSelect: (location: WeatherLocation) => void;
};

export default function FavoriteLocations({
  selectedLocationId,
  onSelect,
}: FavoriteLocationsProps) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  return (
    <Stack component="section" aria-label="Favorite cities" spacing={1.5}>
      <Typography variant="h6" component="h2">
        Favorite cities
      </Typography>

      {favorites.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No favorites yet. Search for a city and save it.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {favorites.map((location) => {
            const isSelected = location.id === selectedLocationId;

            const label = [
              location.name,
              location.admin1 !== location.name ? location.admin1 : undefined,
              location.country,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <Chip
                key={location.id}
                label={label}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                aria-pressed={isSelected}
                onClick={() => onSelect(location)}
                onDelete={() => removeFavorite(location.id)}
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  minHeight: 36,
                  "& .MuiChip-label": {
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    py: 1,
                  },
                }}
              />
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
