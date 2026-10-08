import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { z } from "zod";
import { weatherLocationSchema } from "@/schemas/location";
import type { WeatherLocation } from "@/types/location";

type FavoritesStore = {
  favorites: WeatherLocation[];
  addFavorite: (location: WeatherLocation) => void;
  removeFavorite: (locationId: WeatherLocation["id"]) => void;
};

const persistedFavoritesSchema = z.object({
  favorites: z.array(weatherLocationSchema),
});

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],

      addFavorite: (location) => {
        set((state) => {
          const alreadyExists = state.favorites.some(
            (favorite) => favorite.id === location.id,
          );

          if (alreadyExists) {
            return state;
          }

          return {
            favorites: [...state.favorites, location],
          };
        });
      },

      removeFavorite: (locationId) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (favorite) => favorite.id !== locationId,
          ),
        }));
      },
    }),
    {
      name: "weather-app-favorites",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        favorites: state.favorites,
      }),

      skipHydration: true,

      merge: (persistedState, currentState) => {
        const result = persistedFavoritesSchema.safeParse(persistedState);

        if (!result.success) {
          return currentState;
        }

        return {
          ...currentState,
          favorites: result.data.favorites,
        };
      },
    },
  ),
);
