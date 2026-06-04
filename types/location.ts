import { Coordinate } from "./geo";
import { SavedLocationIcon } from "./icons";

export type POICategory =
    | "airport"
    | "amusementPark"
    | "aquarium"
    | "atm"
    | "bakery"
    | "bank"
    | "beach"
    | "brewery"
    | "cafe"
    | "campground"
    | "carRental"
    | "evCharger"
    | "fireStation"
    | "fitnessCenter"
    | "foodMarket"
    | "gasStation"
    | "hospital"
    | "hotel"
    | "laundry"
    | "library"
    | "marina"
    | "movieTheater"
    | "museum"
    | "nationalPark"
    | "nightlife"
    | "park"
    | "parking"
    | "pharmacy"
    | "police"
    | "postOffice"
    | "publicTransport"
    | "restaurant"
    | "restroom"
    | "school"
    | "stadium"
    | "store"
    | "theater"
    | "university"
    | "winery"
    | "zoo"
    | "unknown";

export interface SavedLocation {
    id: string;
    label: string;

    name: string;
    address: string;
    coordinate: Coordinate;

    phoneNumber: string;
    url: string;
    poiCategory: POICategory;

    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    countryCode: string;

    icon: SavedLocationIcon;
}

export interface SavedLocationGroup {
    id: string;
    label: string;
    icon: SavedLocationIcon;
    locations: SavedLocation[];
}

export interface ResolvedLocation {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    url: string;
    pointOfInterestCategory: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    countryCode: string;
}

export interface TargetLocation {
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;
	radiusMiles: number;
}