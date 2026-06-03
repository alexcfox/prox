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
	city: "Bonney Lake",
	state: "WA",
	zip: "98391",
	latitude: 47.1771,
	longitude: -122.1865,
	radiusMiles: 10,
};

export const useTargetLocationStore = create<TargetLocationStore>((set) => ({
	targetLocation: DEFAULT_TARGET_LOCATION,
	setTargetLocation: (location) => set({ targetLocation: location }),
	clearTargetLocation: () => set({ targetLocation: null }),
}));
