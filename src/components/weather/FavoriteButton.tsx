"use client";

import { Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import type { WeatherLocation } from "@/types/location";

type FavoriteButtonProps = {
  location: WeatherLocation;
};

export default function FavoriteButton({ location }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((favorite) => favorite.id === location.id),
  );

  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  function handleToggleFavorite() {
    if (isFavorite) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  }

  return (
    <Button
      type="button"
      variant={isFavorite ? "contained" : "outlined"}
      startIcon={isFavorite ? <StarIcon /> : <StarBorderIcon />}
      onClick={handleToggleFavorite}
      aria-label={`Favorite ${location.name}`}
      aria-pressed={isFavorite}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      {isFavorite ? "Saved to favorites" : "Add to favorites"}
    </Button>
  );
}
