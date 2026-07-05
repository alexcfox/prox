import { create } from "zustand";

type BudgetMode = "buy" | "rent";

interface BudgetState {
    mode: BudgetMode;
    maxHomePrice: number;
    maxRent: number;
    setMode: (mode: BudgetMode) => void;
    setMaxHomePrice: (value: number) => void;
    setMaxRent: (value: number) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
    mode: "buy",
    maxHomePrice: 800000,
    maxRent: 3000,
    setMode: (mode) => set({ mode }),
    setMaxHomePrice: (value) => set({ maxHomePrice: value }),
    setMaxRent: (value) => set({ maxRent: value }),
}));