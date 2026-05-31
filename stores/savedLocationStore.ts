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
        savedLocations: [
            {
                id: "1",

                label: "Alex's Job",

                name: "Google",

                address: "Irvine, CA",

                coordinate: {
                    latitude: 33.6846,
                    longitude: -117.8265,
                },

                icon: "briefcase",
            },
        ],

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