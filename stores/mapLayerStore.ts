import { create } from "zustand";

export enum MapLayerId {
    SavedLocations = "savedLocations",

    Grocery = "grocery",
    Coffee = "coffee",
    Parks = "parks",
    Gyms = "gyms",
}

type MapLayerStore = {
    layers: Record<MapLayerId, boolean>;

    setLayerVisibility: (
        layerId: MapLayerId,
        visible: boolean
    ) => void;

    toggleLayer: (layerId: MapLayerId) => void;
};

export const useMapLayerStore = create<MapLayerStore>((set) => ({
    layers: {
        [MapLayerId.SavedLocations]: true,

        [MapLayerId.Grocery]: false,
        [MapLayerId.Coffee]: false,
        [MapLayerId.Parks]: false,
        [MapLayerId.Gyms]: false,
    },

    setLayerVisibility: (layerId, visible) =>
        set((state) => ({
            layers: {
                ...state.layers,
                [layerId]: visible,
            },
        })),

    toggleLayer: (layerId) =>
        set((state) => ({
            layers: {
                ...state.layers,
                [layerId]: !state.layers[layerId],
            },
        })),
}));