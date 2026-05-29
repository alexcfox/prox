import { RefObject, createRef } from "react";
import MapView from "react-native-maps";
import { create } from "zustand";

type BaseType = "explore" | "satellite";

type MapStore = {
  baseType: BaseType;
  is3D: boolean;
  pickerVisible: boolean;
  mapRef: RefObject<MapView | null>;

  userLocation: { latitude: number; longitude: number } | null;
  hasLocationPermission: boolean;

  setBaseType: (t: BaseType) => void;
  setIs3D: (v: boolean) => void;
  openPicker: () => void;
  closePicker: () => void;

  setUserLocation: (coords: { latitude: number; longitude: number }) => void;
  setHasLocationPermission: (v: boolean) => void;

  recenter: () => void;
};


export const useMapStore = create<MapStore>((set) => ({
  baseType: "explore",
  is3D: false,
  pickerVisible: false,
  mapRef: createRef<MapView>(),

  userLocation: null,
  hasLocationPermission: false,

  setBaseType: (baseType) => set({ baseType }),
  setIs3D: (is3D) => set({ is3D }),
  openPicker: () => set({ pickerVisible: true }),
  closePicker: () => set({ pickerVisible: false }),

  setUserLocation: (coords) => set({ userLocation: coords }),
  setHasLocationPermission: (v) => set({ hasLocationPermission: v }),

recenter: () => {
	const { userLocation, mapRef, is3D } = useMapStore.getState();
	if (!userLocation || !mapRef.current) return;

	mapRef.current.animateCamera(
		{
		center: {
			latitude: userLocation.latitude,
			longitude: userLocation.longitude,
		},
		pitch: is3D ? 35 : 0,
		zoom: 14,
		},
		{ duration: 600 }
	);
}
}));
