import { MapTab } from "@/types/Map";
import { create } from "zustand";

type MapSheetStore = {
    selectedTab: MapTab;

    setSelectedTab: (
        tab: MapTab
    ) => void;
};

export const useMapSheetStore =
    create<MapSheetStore>((set) => ({
        selectedTab: "places",

        setSelectedTab: (selectedTab) =>
            set({ selectedTab }),
    }));