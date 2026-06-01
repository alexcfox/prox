import { SavedLocation } from "@/types/SavedLocation";
import { create } from "zustand";

type SavedLocationStore = {
    savedLocations: SavedLocation[];

    addSavedLocation: (
        location: SavedLocation
    ) => void;

    updateSavedLocation: (
        location: SavedLocation
    ) => void;

    removeSavedLocation: (
        id: string
    ) => void;
};

export const useSavedLocationStore =
    create<SavedLocationStore>((set) => ({
        savedLocations: [],

        addSavedLocation: (location) =>
            set((state) => ({
                savedLocations: [
                    ...state.savedLocations,
                    location,
                ],
            })),

        updateSavedLocation: (location) =>
            set((state) => ({
                savedLocations:
                    state.savedLocations.map((sl) =>
                        sl.id === location.id
                            ? location
                            : sl
                    ),
            })),

        removeSavedLocation: (id) =>
            set((state) => ({
                savedLocations:
                    state.savedLocations.filter(
                        (sl) => sl.id !== id
                    ),
            })),
    }));