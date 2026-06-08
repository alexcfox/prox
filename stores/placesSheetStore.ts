import { SavedLocationIcon } from "@/types/icons";
import { ResolvedLocation, SavedLocation } from "@/types/location";
import { create } from "zustand";

interface PlacesSheetState {
    pendingSavedLocation: SavedLocation | null;
    label: string;
    selectedIcon: SavedLocationIcon;
    selectedColor: string;

    duplicateLocations: ResolvedLocation[];
    includeAllLocations: boolean;
    showIncludeAll: boolean;

    setPendingSavedLocation: (location: SavedLocation) => void;
    setLabel: (label: string) => void;
    setSelectedIcon: (icon: SavedLocationIcon) => void;
    setSelectedColor: (color: string) => void;
    clearPendingSavedLocation: () => void;

    setDuplicateLocations: (locations: ResolvedLocation[]) => void;
    setIncludeAllLocations: (include: boolean) => void;
    setShowIncludeAll: (show: boolean) => void;
}

export const usePlacesSheetStore = create<PlacesSheetState>((set) => ({
    pendingSavedLocation: null,
    label: "",
    selectedIcon: "mappin",
    selectedColor: "#FFFFFF",

    showCategories: false,

    selectedCategory: null,
    isCategoryLoading: false,

    duplicateLocations: [],
    includeAllLocations: false,
    showIncludeAll: false,

    setPendingSavedLocation: (location) =>
        set({
            pendingSavedLocation: location,
            label: location.label,
            selectedIcon: location.icon,
            selectedColor: location.color ?? "#FFFFFF",
        }),

    setLabel: (label) => set({ label }),

    setSelectedIcon: (icon) => set({ selectedIcon: icon }),

    setSelectedColor: (color) => set({ selectedColor: color }),

    setDuplicateLocations: (locations) =>
        set({ duplicateLocations: locations }),

    setIncludeAllLocations: (include) =>
        set({ includeAllLocations: include }),

    setShowIncludeAll: (show) =>
        set({ showIncludeAll: show }),

    clearPendingSavedLocation: () =>
        set({
            pendingSavedLocation: null,
            label: "",
            selectedIcon: "mappin",
            selectedColor: "#FFFFFF",

            duplicateLocations: [],
            includeAllLocations: false,
            showIncludeAll: false,
        }),
}));