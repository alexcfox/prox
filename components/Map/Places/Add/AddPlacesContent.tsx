import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { iconForPOICategory, parsePOICategory, SavedLocation, SavedLocationIcon } from "@/types/SavedLocation";
import { SymbolView } from "expo-symbols";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    NativeModules,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface SearchResult {
    title: string;
    subtitle: string;
}

interface ResolvedLocation {
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

const PERSONAL_ICONS: { label: string; icon: SavedLocationIcon }[] = [
    { label: "Work",      icon: "briefcase.fill" },
    { label: "Home",      icon: "house.fill" },
    { label: "School",    icon: "graduationcap.fill" },
    { label: "Friend",    icon: "person.fill" },
    { label: "Family",    icon: "figure.2.and.child.holdinghands" },
    { label: "Gym",       icon: "dumbbell.fill" },
    { label: "Doctor",    icon: "stethoscope" },
    { label: "Favorite",  icon: "heart.fill" },
    { label: "Star",      icon: "star.fill" },
    { label: "Pin",       icon: "mappin" },
];

const POI_ICONS: { label: string; icon: SavedLocationIcon }[] = [
    { label: "Restaurant",  icon: "fork.knife" },
    { label: "Cafe",        icon: "cup.and.saucer.fill" },
    { label: "Bar",         icon: "mug.fill" },
    { label: "Grocery",     icon: "cart.fill" },
    { label: "Park",        icon: "leaf.fill" },
    { label: "Hospital",    icon: "cross.fill" },
    { label: "Pharmacy",    icon: "pills.fill" },
    { label: "Gas",         icon: "fuelpump.fill" },
    { label: "EV",          icon: "bolt.car.fill" },
    { label: "Parking",     icon: "parkingsign" },
    { label: "Transit",     icon: "tram.fill" },
    { label: "Airport",     icon: "airplane" },
    { label: "Hotel",       icon: "bed.double.fill" },
    { label: "Museum",      icon: "building.columns.fill" },
    { label: "Theater",     icon: "theatermasks.fill" },
    { label: "Movie",       icon: "film.fill" },
    { label: "Stadium",     icon: "sportscourt.fill" },
    { label: "Beach",       icon: "beach.umbrella.fill" },
    { label: "Campground",  icon: "tent.fill" },
    { label: "National Park", icon: "tree.fill" },
    { label: "Library",     icon: "books.vertical.fill" },
    { label: "School",      icon: "building.fill" },
    { label: "Bank",        icon: "building.columns.fill" },
    { label: "ATM",         icon: "banknote.fill" },
    { label: "Store",       icon: "bag.fill" },
    { label: "Laundry",     icon: "washer.fill" },
    { label: "Marina",      icon: "sailboat.fill" },
    { label: "Nightlife",   icon: "music.note" },
    { label: "Zoo",         icon: "pawprint.fill" },
    { label: "Aquarium",    icon: "fish.fill" },
];

const ALL_ICONS = [...PERSONAL_ICONS, ...POI_ICONS];

let debounceTimer: ReturnType<typeof setTimeout>;

export default function AddPlacesContent() {
    const theme = useTheme();
    const { addSavedLocation } = useSavedLocationStore();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);

    // Confirm view state
    const [pending, setPending] = useState<SavedLocation | null>(null);
    const [label, setLabel] = useState("");
    const [selectedIcon, setSelectedIcon] = useState<SavedLocationIcon>("mappin");

    const search = useCallback((text: string) => {
        clearTimeout(debounceTimer);

        if (!text.trim()) {
            setResults([]);
            return;
        }

        debounceTimer = setTimeout(async () => {
            setLoading(true);
            try {
                const { AppleSearchModule } = NativeModules;
                const data = await AppleSearchModule.search(text);
                setResults(data);
            } catch (e) {
                console.error("Search error:", e);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    }, []);

    const handleChange = (text: string) => {
        setQuery(text);
        search(text);
    };

    const handleSelect = async (item: SearchResult) => {
        setResolving(true);
        try {
            const { AppleSearchModule } = NativeModules;
            const raw: ResolvedLocation = await AppleSearchModule.resolve(item.title, item.subtitle);

            const poiCategory = parsePOICategory(raw.pointOfInterestCategory);
            const icon = iconForPOICategory(poiCategory);

            const location: SavedLocation = {
                id: Date.now().toString(),
                label: raw.name,
                name: raw.name,
                address: raw.address,
                coordinate: {
                    latitude: raw.latitude,
                    longitude: raw.longitude,
                },
                phoneNumber: raw.phoneNumber,
                url: raw.url,
                poiCategory,
                street: raw.street,
                city: raw.city,
                state: raw.state,
                zip: raw.zip,
                country: raw.country,
                countryCode: raw.countryCode,
                icon,
            };

            setPending(location);
            setLabel(location.label);
            setSelectedIcon(icon);
        } catch (e) {
            console.error("Resolve error:", e);
        } finally {
            setResolving(false);
        }
    };

    const handleConfirm = () => {
        if (!pending) return;
        addSavedLocation({ ...pending, label, icon: selectedIcon });
        setPending(null);
        setQuery("");
        setResults([]);
    };

    const handleBack = () => {
        setPending(null);
    };

    // ─── Confirm View ────────────────────────────────────────────────────────────
    if (pending) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>

                {/* Header */}
                <View style={styles.confirmHeader}>
                    <TouchableOpacity onPress={handleBack}>
                        <Text style={[styles.backButton, { color: theme.colors.accent }]}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={[styles.confirmTitle, { color: theme.colors.primaryText }]}>Add Place</Text>
                    <TouchableOpacity onPress={handleConfirm}>
                        <Text style={[styles.saveButton, { color: theme.colors.accent }]}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.confirmScroll} showsVerticalScrollIndicator={false}>

                    {/* Preview */}
                    <View style={[styles.previewCard, { backgroundColor: theme.colors.background }]}>
                        <View style={[styles.previewIcon, { backgroundColor: theme.colors.mutedBackground }]}>
                            <SymbolView
                                name={selectedIcon}
                                size={28}
                                type="hierarchical"
                                tintColor={theme.colors.accent}
                            />
                        </View>
                        <View style={styles.previewText}>
                            <Text style={[styles.previewName, { color: theme.colors.primaryText }]} numberOfLines={1}>
                                {label || pending.name}
                            </Text>
                            <Text style={[styles.previewAddress, { color: theme.colors.secondaryText }]} numberOfLines={1}>
                                {pending.address}
                            </Text>
                        </View>
                    </View>

                    {/* Label */}
                    <Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>LABEL</Text>
                    <View style={[styles.inputCard, { backgroundColor: theme.colors.background }]}>
                        <TextInput
                            style={[styles.labelInput, { color: theme.colors.primaryText }]}
                            value={label}
                            onChangeText={setLabel}
                            placeholder="Label this place..."
                            placeholderTextColor={theme.colors.secondaryText}
                            clearButtonMode="while-editing"
                        />
                    </View>

                    {/* Icon picker */}
                    <Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>ICON</Text>
                    <View style={[styles.iconGrid, { backgroundColor: theme.colors.background }]}>
                        {ALL_ICONS.map(({ label: iconLabel, icon }, index) => {
                            const selected = selectedIcon === icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.iconCell,
                                        selected && { backgroundColor: theme.colors.mutedBackground }
                                    ]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <SymbolView
                                        name={icon}
                                        size={22}
                                        type="hierarchical"
                                        tintColor={selected ? theme.colors.accent : theme.colors.primaryText}
                                    />
                                    <Text style={[
                                        styles.iconLabel,
                                        { color: selected ? theme.colors.accent : theme.colors.secondaryText }
                                    ]}>
                                        {iconLabel}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                </ScrollView>
            </View>
        );
    }

    // ─── Search View ─────────────────────────────────────────────────────────────
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>
            <View style={[styles.searchBar, { backgroundColor: theme.colors.background }]}>
                <TextInput
                    style={[styles.input, { color: theme.colors.primaryText }]}
                    placeholder="Search places..."
                    placeholderTextColor={theme.colors.secondaryText}
                    value={query}
                    onChangeText={handleChange}
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />
                {(loading || resolving) && (
                    <ActivityIndicator size="small" color={theme.colors.secondaryText} style={styles.spinner} />
                )}
            </View>

            {results.map((item, i) => (
                <View key={i}>
                    <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
                        <Text style={[styles.title, { color: theme.colors.primaryText }]} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]} numberOfLines={1}>
                            {item.subtitle}
                        </Text>
                    </TouchableOpacity>
                    {i < results.length - 1 && (
                        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // Search
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        margin: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 44,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    spinner: {
        marginLeft: 8,
    },
    row: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: "500",
    },
    subtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 16,
    },

    // Confirm
    confirmHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        fontSize: 16,
    },
    confirmTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        fontSize: 16,
        fontWeight: "600",
    },
    confirmScroll: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    previewCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
        gap: 12,
    },
    previewIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    previewText: {
        flex: 1,
    },
    previewName: {
        fontSize: 16,
        fontWeight: "600",
    },
    previewAddress: {
        fontSize: 13,
        marginTop: 2,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputCard: {
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 44,
        justifyContent: "center",
        marginBottom: 24,
    },
    labelInput: {
        fontSize: 16,
    },
    iconGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        borderRadius: 12,
        padding: 8,
    },
    iconCell: {
        width: "20%",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 10,
        gap: 4,
    },
    iconLabel: {
        fontSize: 10,
        textAlign: "center",
    },
});