import { SavedLocation, SavedLocationGroup } from "@/types/SavedLocation";
import { create } from "zustand";

type SavedLocationStore = {
    savedLocationGroups: SavedLocationGroup[];

    addSavedLocationGroup: (
        group: SavedLocationGroup
    ) => void;

    updateSavedLocationGroup: (
        group: SavedLocationGroup
    ) => void;

    removeSavedLocationGroup: (
        id: string
    ) => void;

    getSavedLocations: () => SavedLocation[];

    getLocationCount: () => number;
};

export const useSavedLocationStore =
    create<SavedLocationStore>((set, get) => ({
        savedLocationGroups: [],

        addSavedLocationGroup: (group) =>
            set((state) => ({
                savedLocationGroups: [
                    ...state.savedLocationGroups,
                    group,
                ],
            })),

        updateSavedLocationGroup: (group) =>
            set((state) => ({
                savedLocationGroups:
                    state.savedLocationGroups.map((g) =>
                        g.id === group.id
                            ? group
                            : g
                    ),
            })),

        removeSavedLocationGroup: (id) =>
            set((state) => ({
                savedLocationGroups:
                    state.savedLocationGroups.filter(
                        (g) => g.id !== id
                    ),
            })),

        getSavedLocations: () =>
            get()
                .savedLocationGroups
                .flatMap((group) => group.locations),

        getLocationCount: () =>
            get()
                .savedLocationGroups
                .reduce(
                    (count, group) =>
                        count + group.locations.length,
                    0
                ),
    }));