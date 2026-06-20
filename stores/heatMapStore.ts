import { ScoredCell } from "@/utils/heatmap";
import { create } from "zustand";

interface HeatmapStore {
    scoredCells: ScoredCell[];
    imageUri: string | null;
    setHeatmap: (cells: ScoredCell[], imageUri: string | null) => void;
    clearHeatmap: () => void;
}

export const useHeatmapStore = create<HeatmapStore>((set) => ({
    scoredCells: [],
    imageUri: null,
    setHeatmap: (cells, imageUri) => set({ scoredCells: cells, imageUri }),
    clearHeatmap: () => set({ scoredCells: [], imageUri: null }),
}));