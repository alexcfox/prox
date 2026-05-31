import { Coordinate } from "./Map";

export type SavedLocationIcon =
    | "briefcase"
    | "graduationcap"
    | "person"
    | "cross"
    | "pin";

export interface SavedLocation {
    id: string;

    label: string;

    name: string;
    address: string;

    coordinate: Coordinate;

    icon: SavedLocationIcon;
}