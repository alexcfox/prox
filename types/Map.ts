import { Coordinate } from "./geo";

export interface MapMarker {
    id: string;

    coordinate: Coordinate;

    title?: string;
    subtitle?: string;

    layerId: string;

    icon?: string;
}