import { create } from "zustand";

export type SheetTabKey = "places" | "lifestyle" | "budget" | "favorites";

interface SheetTabState {
    activeTab: SheetTabKey;
    setActiveTab: (tab: SheetTabKey) => void;
}

export const useSheetTabStore = create<SheetTabState>((set) => ({
    activeTab: "places",
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
