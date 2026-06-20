import { ACCENT } from "@/assets/colors";
import { SavedLocationIcon } from "@/types/icons";
import { LocationPriority, ResolvedLocation, SavedLocation, SavedLocationGroup } from "@/types/location";
import { create } from "zustand";

interface PlacesSheetState {
    pendingSavedLocation: SavedLocation | null;
    label: string;
    selectedIcon: SavedLocationIcon;
    selectedColor: string;

    hasCheckedDuplicates: boolean;
    duplicateLocations: ResolvedLocation[];
    includeAllLocations: boolean;
    showIncludeAll: boolean;

    pendingEditGroup: SavedLocationGroup | null;
    selectedPriority: LocationPriority;

    setPendingSavedLocation: (location: SavedLocation) => void;
    setLabel: (label: string) => void;
    setSelectedIcon: (icon: SavedLocationIcon) => void;
    setSelectedColor: (color: string) => void;
    clearPendingSavedLocation: () => void;

    setHasCheckedDuplicates: (checked: boolean) => void;
    setDuplicateLocations: (locations: ResolvedLocation[]) => void;
    setIncludeAllLocations: (include: boolean) => void;
    setShowIncludeAll: (show: boolean) => void;

    setPendingEditGroup: (group: SavedLocationGroup | null) => void;

    setSelectedPriority: (priority: LocationPriority) => void;
}

export const usePlacesSheetStore = create<PlacesSheetState>((set) => ({
    pendingSavedLocation: null,
    label: "",
    selectedIcon: "mappin",
    selectedColor: ACCENT,

    showCategories: false,

    selectedCategory: null,
    isCategoryLoading: false,

    hasCheckedDuplicates: false,
    duplicateLocations: [],
    includeAllLocations: false,
    showIncludeAll: false,

    pendingEditGroup: null as SavedLocationGroup | null,
    selectedPriority: 'weekly',

    setPendingSavedLocation: (location) =>
        set({
            pendingSavedLocation: location,
            label: location.label,
            selectedIcon: location.icon,
            selectedColor: location.color ?? ACCENT,
        }),

    setLabel: (label) => set({ label }),

    setSelectedIcon: (icon) => set({ selectedIcon: icon }),

    setSelectedColor: (color) => set({ selectedColor: color }),

    setHasCheckedDuplicates: (checked) =>
        set({ hasCheckedDuplicates: checked }),

    setDuplicateLocations: (locations) =>
        set({ duplicateLocations: locations }),

    setIncludeAllLocations: (include) =>
        set({ includeAllLocations: include }),

    setShowIncludeAll: (show) =>
        set({ showIncludeAll: show }),

    clearPendingSavedLocation: () =>
        set({
            pendingEditGroup: null,
            pendingSavedLocation: null,
            label: "",
            selectedIcon: "mappin",
            selectedColor: ACCENT,

            duplicateLocations: [],
            includeAllLocations: false,
            showIncludeAll: false,
        }),

    setPendingEditGroup: (group: SavedLocationGroup | null) => set({
        pendingEditGroup: group,
        label: group?.label ?? "",
        selectedColor: group?.color ?? "#FF3B30",
        selectedIcon: group?.icon ?? "mappin",
        selectedPriority: group?.priority ?? "weekly",
    }),

    setSelectedPriority: (priority) => set({ selectedPriority: priority }),
}));