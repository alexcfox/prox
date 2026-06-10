import { SymbolViewProps } from "expo-symbols";

export const ICON_CATEGORIES = [
    "Default",
    "Home and Work",
    "Food & Drink",
    "Shopping",
    "Education",
    "Family",
    "Health",
    "Finance",
    "Services",
    "Transit",
    "Entertainment",
] as const;

export type SavedLocationIcon = SymbolViewProps["name"];
export type IconCategory = typeof ICON_CATEGORIES[number];

export interface CategorizedIcon {
    icon: SavedLocationIcon;
    category: IconCategory;
}

export const ALL_ICONS: CategorizedIcon[] = [

    // Default
    { icon: "mappin", category: "Default" },

    // Home
    { icon: "house.fill", category: "Home and Work" },
    { icon: "building.2.fill", category: "Home and Work" },

    // Food & Drink
    { icon: "fork.knife", category: "Food & Drink" },
    { icon: "takeoutbag.and.cup.and.straw.fill", category: "Food & Drink" },
    { icon: "cup.and.saucer.fill", category: "Food & Drink" },
    { icon: "wineglass.fill", category: "Food & Drink" },

    // Health
    { icon: "dumbbell.fill", category: "Health" },
    { icon: "figure.run", category: "Health" },
    { icon: "cross.fill", category: "Health" },

    // Shopping
    { icon: "cart.fill", category: "Shopping" },
    { icon: "bag.fill", category: "Shopping" },
    { icon: "tshirt.fill", category: "Shopping" },
    { icon: "hammer.fill", category: "Shopping" },

    // Education
    { icon: "book.fill", category: "Education" },
    { icon: "building.columns.fill", category: "Education" },
    { icon: "graduationcap.fill", category: "Education" },

    // Family
    { icon: "tree.fill", category: "Family" },
    { icon: "figure.and.child.holdinghands", category: "Family" },
    { icon: "pawprint.fill", category: "Family" },

    // Finance
    { icon: "banknote.fill", category: "Finance" },
    { icon: "creditcard.fill", category: "Finance" },

    // Services
    { icon: "shippingbox.fill", category: "Services" },
    { icon: "scissors", category: "Services" },
    { icon: "car.fill", category: "Services" },
    { icon: "washer.fill", category: "Services" },

    // Transit
    { icon: "bus.fill", category: "Transit" },
    { icon: "tram.fill", category: "Transit" },
    { icon: "airplane", category: "Transit" },
    { icon: "fuelpump.fill", category: "Transit" },

    // Entertainment
    { icon: "film.fill", category: "Entertainment" },
    { icon: "music.note", category: "Entertainment" },
    { icon: "sportscourt.fill", category: "Entertainment" },
    { icon: "theatermasks.fill", category: "Entertainment" },
];