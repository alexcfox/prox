import { SymbolViewProps } from "expo-symbols";
import { POICategory } from "./location";

export type SavedLocationIcon = SymbolViewProps["name"];

const POI_ICON_MAP: Record<POICategory, SavedLocationIcon> = {
    airport: "airplane",
    amusementPark: "star.fill",
    aquarium: "fish.fill",
    atm: "banknote.fill",
    bakery: "birthday.cake.fill",
    bank: "building.columns.fill",
    beach: "beach.umbrella.fill",
    brewery: "mug.fill",
    cafe: "cup.and.saucer.fill",
    campground: "tent.fill",
    carRental: "car.fill",
    evCharger: "bolt.car.fill",
    fireStation: "flame.fill",
    fitnessCenter: "dumbbell.fill",
    foodMarket: "cart.fill",
    gasStation: "fuelpump.fill",
    hospital: "cross.fill",
    hotel: "bed.double.fill",
    laundry: "washer.fill",
    library: "books.vertical.fill",
    marina: "sailboat.fill",
    movieTheater: "film.fill",
    museum: "building.columns.fill",
    nationalPark: "tree.fill",
    nightlife: "music.note",
    park: "leaf.fill",
    parking: "parkingsign",
    pharmacy: "pills.fill",
    police: "shield.fill",
    postOffice: "envelope.fill",
    publicTransport: "tram.fill",
    restaurant: "fork.knife",
    restroom: "toilet.fill",
    school: "graduationcap.fill",
    stadium: "sportscourt.fill",
    store: "bag.fill",
    theater: "theatermasks.fill",
    university: "building.fill",
    winery: "wineglass.fill",
    zoo: "pawprint.fill",
    unknown: "mappin",
};

export function iconForPOICategory(category: POICategory): SavedLocationIcon {
    return POI_ICON_MAP[category];
}

export const PERSONAL_ICONS: { label: string; icon: SavedLocationIcon }[] = [
    { label: "Work", icon: "briefcase.fill" },
    { label: "Home", icon: "house.fill" },
    { label: "School", icon: "graduationcap.fill" },
    { label: "Friend", icon: "person.fill" },
    { label: "Family", icon: "figure.2.and.child.holdinghands" },
    { label: "Gym", icon: "dumbbell.fill" },
    { label: "Doctor", icon: "stethoscope" },
    { label: "Favorite", icon: "heart.fill" },
    { label: "Star", icon: "star.fill" },
    { label: "Pin", icon: "mappin" },
];

export const POI_ICONS: { label: string; icon: SavedLocationIcon }[] = [
    { label: "Restaurant", icon: "fork.knife" },
    { label: "Cafe", icon: "cup.and.saucer.fill" },
    { label: "Bar", icon: "mug.fill" },
    { label: "Grocery", icon: "cart.fill" },
    { label: "Park", icon: "leaf.fill" },
    { label: "Hospital", icon: "cross.fill" },
    { label: "Pharmacy", icon: "pills.fill" },
    { label: "Gas", icon: "fuelpump.fill" },
    { label: "EV", icon: "bolt.car.fill" },
    { label: "Parking", icon: "parkingsign" },
    { label: "Transit", icon: "tram.fill" },
    { label: "Airport", icon: "airplane" },
    { label: "Hotel", icon: "bed.double.fill" },
    { label: "Museum", icon: "building.columns.fill" },
    { label: "Theater", icon: "theatermasks.fill" },
    { label: "Movie", icon: "film.fill" },
    { label: "Stadium", icon: "sportscourt.fill" },
    { label: "Beach", icon: "beach.umbrella.fill" },
    { label: "Campground", icon: "tent.fill" },
    { label: "Nature", icon: "tree.fill" },
    { label: "Library", icon: "books.vertical.fill" },
    { label: "Bank", icon: "building.columns.fill" },
    { label: "ATM", icon: "banknote.fill" },
    { label: "Store", icon: "bag.fill" },
    { label: "Laundry", icon: "washer.fill" },
    { label: "Marina", icon: "sailboat.fill" },
    { label: "Nightlife", icon: "music.note" },
    { label: "Zoo", icon: "pawprint.fill" },
    { label: "Aquarium", icon: "fish.fill" },
];

export const ALL_ICONS = [...PERSONAL_ICONS, ...POI_ICONS];