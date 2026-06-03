import { SavedLocationIcon } from "./SavedLocation";

export type SearchCategoryType =
    | "foodMarket"
    | "cafe"
    | "restaurant"
    | "gasStation"
    | "pharmacy";

export type SearchCategory = {
    title: string;
    icon: SavedLocationIcon;
    poiCategory: SearchCategoryType;
};

export const CATEGORIES: SearchCategory[] = [
    {
        title: "Grocery",
        icon: "cart.fill",
        poiCategory: "foodMarket",
    },
    {
        title: "Coffee",
        icon: "cup.and.saucer.fill",
        poiCategory: "cafe",
    },
    {
        title: "Restaurant",
        icon: "fork.knife",
        poiCategory: "restaurant",
    },
    {
        title: "Gas Station",
        icon: "fuelpump.fill",
        poiCategory: "gasStation",
    },
    {
        title: "Pharmacy",
        icon: "cross.case.fill",
        poiCategory: "pharmacy",
    },
];