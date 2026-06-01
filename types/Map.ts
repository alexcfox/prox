export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface MapLayer {
    id: string;
    visible: boolean;
}

export interface MapMarker {
    id: string;

    coordinate: Coordinate;

    title?: string;
    subtitle?: string;

    layerId: string;

    icon?: string;
}

export type MapTab =
    | "places"
    | "preferences"
    | "financials"
    | "favorites";