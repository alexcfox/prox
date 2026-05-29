import { RefObject, createRef } from "react";
import MapView from "react-native-maps";
import { create } from "zustand";

type BaseType = "explore" | "satellite";

type MapStore = {
	baseType: BaseType;
	is3D: boolean;
	pickerVisible: boolean;
	mapRef: RefObject<MapView | null>;
	setBaseType: (t: BaseType) => void;
	setIs3D: (v: boolean) => void;
	openPicker: () => void;
	closePicker: () => void;
};

export const useMapStore = create<MapStore>((set) => ({
	baseType: "explore",
	is3D: false,
	pickerVisible: false,
	mapRef: createRef<MapView>(),
	setBaseType: (baseType) => set({ baseType }),
	setIs3D: (is3D) => set({ is3D }),
	openPicker: () => set({ pickerVisible: true }),
	closePicker: () => set({ pickerVisible: false }),
}));