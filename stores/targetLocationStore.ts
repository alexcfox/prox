import { TargetLocation } from "@/types/location";
import { create } from "zustand";

interface TargetLocationStore {
	targetLocation: TargetLocation | null;
	setTargetLocation: (location: TargetLocation) => void;
	clearTargetLocation: () => void;
}

export const useTargetLocationStore = create<TargetLocationStore>((set) => ({
	targetLocation: null,
	setTargetLocation: (location) => set({ targetLocation: location }),
	clearTargetLocation: () => set({ targetLocation: null }),
}));
