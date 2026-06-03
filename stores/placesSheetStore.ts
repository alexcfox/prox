import { ResolvedLocation, SavedLocation, SavedLocationIcon } from "@/types/SavedLocation";
import { SearchCategory } from "@/types/SearchCategories";
import { create } from "zustand";

interface PlacesSheetState {
	pendingSavedLocation: SavedLocation | null;
	label: string;
	selectedIcon: SavedLocationIcon;

	showCategories: boolean;

	selectedCategory: SearchCategory | null;
	isCategoryLoading: boolean;

	duplicateLocations: ResolvedLocation[];
	includeAllLocations: boolean;
	showIncludeAll: boolean;

	setShowCategories: (show: boolean) => void;

	setSelectedCategory: (category: SearchCategory | null) => void;
	setIsCategoryLoading: (loading: boolean) => void;

	setPendingSavedLocation: (location: SavedLocation) => void;
	setLabel: (label: string) => void;
	setSelectedIcon: (icon: SavedLocationIcon) => void;
	clearPendingSavedLocation: () => void;

	setDuplicateLocations: (locations: ResolvedLocation[]) => void;
	setIncludeAllLocations: (include: boolean) => void;
	setShowIncludeAll: (show: boolean) => void;
}

export const usePlacesSheetStore = create<PlacesSheetState>((set) => ({
	pendingSavedLocation: null,
	label: "",
	selectedIcon: "mappin",

	showCategories: false,

	selectedCategory: null,
	isCategoryLoading: false,

	duplicateLocations: [],
	includeAllLocations: false,
	showIncludeAll: false,

	setShowCategories: (show) =>
		set({ showCategories: show }),

	setSelectedCategory: (category) =>
		set({ selectedCategory: category }),

	setIsCategoryLoading: (loading) =>
		set({ isCategoryLoading: loading }),

	setPendingSavedLocation: (location) =>
		set({
			pendingSavedLocation: location,
			label: location.label,
			selectedIcon: location.icon,
		}),

	setLabel: (label) => set({ label }),

	setSelectedIcon: (icon) => set({ selectedIcon: icon }),

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

			showCategories: false,
			selectedCategory: null,
			isCategoryLoading: false,

			duplicateLocations: [],
			includeAllLocations: false,
			showIncludeAll: false,
		}),
}));