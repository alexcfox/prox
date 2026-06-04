import { create } from "zustand";

type BaseType = "explore" | "satellite";

type MapStore = {
    baseType: BaseType;
    is3D: boolean;
    pickerVisible: boolean;

    userLocation: { latitude: number; longitude: number } | null;
    hasLocationPermission: boolean;

    setBaseType: (t: BaseType) => void;
    setIs3D: (v: boolean) => void;
    openPicker: () => void;
    closePicker: () => void;

    setUserLocation: (coords: { latitude: number; longitude: number }) => void;
    setHasLocationPermission: (v: boolean) => void;
};

export const useMapStore = create<MapStore>((set) => ({
    baseType: "satellite",
    is3D: false,
    pickerVisible: false,

    userLocation: null,
    hasLocationPermission: false,

    setBaseType: (baseType) => set({ baseType }),
setIs3D: (is3D) => { console.log('store setIs3D:', is3D); set({ is3D }) },
    openPicker: () => set({ pickerVisible: true }),
    closePicker: () => set({ pickerVisible: false }),

    setUserLocation: (coords) => set({ userLocation: coords }),
    setHasLocationPermission: (v) => set({ hasLocationPermission: v }),
}));