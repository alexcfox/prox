import { create } from "zustand";

export interface TargetLocation {
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
	radiusMiles: number;
}

interface TargetLocationStore {
	targetLocation: TargetLocation | null;
	setTargetLocation: (location: TargetLocation) => void;
	clearTargetLocation: () => void;
}

const MILES_TO_METERS = 1609.34;

export const milesToMeters = (miles: number): number => miles * MILES_TO_METERS;

const DEFAULT_TARGET_LOCATION: TargetLocation = {
	city: "Las Vegas",
	state: "NV",
	zip: "89141",
	latitude: 35.9957,
	longitude: -115.2068,
	radiusMiles: 25,
};

export const useTargetLocationStore = create<TargetLocationStore>((set) => ({
	targetLocation: DEFAULT_TARGET_LOCATION,
	setTargetLocation: (location) => set({ targetLocation: location }),
	clearTargetLocation: () => set({ targetLocation: null }),
}));
