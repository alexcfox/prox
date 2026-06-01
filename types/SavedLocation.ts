import { SymbolViewProps } from "expo-symbols";
import { Coordinate } from "./Map";

export type SavedLocationIcon = SymbolViewProps["name"];

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

    // Core
    name: string;
    address: string;
    coordinate: Coordinate;

    // Extended from MKMapItem
    phoneNumber: string;
    url: string;
    poiCategory: POICategory;

    // Structured address
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    countryCode: string;

    icon: SavedLocationIcon;
}

const POI_CATEGORY_MAP: Record<string, POICategory> = {
    "MKPOICategoryAirport": "airport",
    "MKPOICategoryAmusementPark": "amusementPark",
    "MKPOICategoryAquarium": "aquarium",
    "MKPOICategoryATM": "atm",
    "MKPOICategoryBakery": "bakery",
    "MKPOICategoryBank": "bank",
    "MKPOICategoryBeach": "beach",
    "MKPOICategoryBrewery": "brewery",
    "MKPOICategoryCafe": "cafe",
    "MKPOICategoryCampground": "campground",
    "MKPOICategoryCarRental": "carRental",
    "MKPOICategoryEVCharger": "evCharger",
    "MKPOICategoryFireStation": "fireStation",
    "MKPOICategoryFitnessCenter": "fitnessCenter",
    "MKPOICategoryFoodMarket": "foodMarket",
    "MKPOICategoryGasStation": "gasStation",
    "MKPOICategoryHospital": "hospital",
    "MKPOICategoryHotel": "hotel",
    "MKPOICategoryLaundry": "laundry",
    "MKPOICategoryLibrary": "library",
    "MKPOICategoryMarina": "marina",
    "MKPOICategoryMovieTheater": "movieTheater",
    "MKPOICategoryMuseum": "museum",
    "MKPOICategoryNationalPark": "nationalPark",
    "MKPOICategoryNightlife": "nightlife",
    "MKPOICategoryPark": "park",
    "MKPOICategoryParking": "parking",
    "MKPOICategoryPharmacy": "pharmacy",
    "MKPOICategoryPolice": "police",
    "MKPOICategoryPostOffice": "postOffice",
    "MKPOICategoryPublicTransport": "publicTransport",
    "MKPOICategoryRestaurant": "restaurant",
    "MKPOICategoryRestroom": "restroom",
    "MKPOICategorySchool": "school",
    "MKPOICategoryStadium": "stadium",
    "MKPOICategoryStore": "store",
    "MKPOICategoryTheater": "theater",
    "MKPOICategoryUniversity": "university",
    "MKPOICategoryWinery": "winery",
    "MKPOICategoryZoo": "zoo",
};

const POI_ICON_MAP: Record<POICategory, SavedLocationIcon> = {
    airport:        "airplane",
    amusementPark:  "star.fill",
    aquarium:       "fish.fill",
    atm:            "banknote.fill",
    bakery:         "birthday.cake.fill",
    bank:           "building.columns.fill",
    beach:          "beach.umbrella.fill",
    brewery:        "mug.fill",
    cafe:           "cup.and.saucer.fill",
    campground:     "tent.fill",
    carRental:      "car.fill",
    evCharger:      "bolt.car.fill",
    fireStation:    "flame.fill",
    fitnessCenter:  "dumbbell.fill",
    foodMarket:     "cart.fill",
    gasStation:     "fuelpump.fill",
    hospital:       "cross.fill",
    hotel:          "bed.double.fill",
    laundry:        "washer.fill",
    library:        "books.vertical.fill",
    marina:         "sailboat.fill",
    movieTheater:   "film.fill",
    museum:         "building.columns.fill",
    nationalPark:   "tree.fill",
    nightlife:      "music.note",
    park:           "leaf.fill",
    parking:        "parkingsign",
    pharmacy:       "pills.fill",
    police:         "shield.fill",
    postOffice:     "envelope.fill",
    publicTransport:"tram.fill",
    restaurant:     "fork.knife",
    restroom:       "toilet.fill",
    school:         "graduationcap.fill",
    stadium:        "sportscourt.fill",
    store:          "bag.fill",
    theater:        "theatermasks.fill",
    university:     "building.fill",
    winery:         "wineglass.fill",
    zoo:            "pawprint.fill",
    unknown:        "mappin",
};

export function parsePOICategory(raw: string): POICategory {
    return POI_CATEGORY_MAP[raw] ?? "unknown";
}

export function iconForPOICategory(category: POICategory): SavedLocationIcon {
    return POI_ICON_MAP[category];
}