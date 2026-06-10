import { MARKER_COLORS } from "@/assets/colors";
import { useAppleSearch } from "@/hooks/useAppleSearch";
import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { useTargetLocationStore } from "@/stores/targetLocationStore";
import { useTheme } from "@/theme/theme";
import { ALL_ICONS, ICON_CATEGORIES } from "@/types/icons";
import { ResolvedLocation, SavedLocation } from "@/types/location";
import { parsePOICategory } from "@/types/location-mapping";
import { getTileRegions, milesToMeters } from "@/utils/geo";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
	ActivityIndicator,
	Keyboard,
	NativeModules,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";

const { AppleSearchModule } = NativeModules;

export default function AddPlacesContent() {
    const theme = useTheme();
    const { targetLocation } = useTargetLocationStore();
    const [isCheckingDuplicates, setIsCheckingDuplicates] = React.useState(false);

    const region = targetLocation
        ? {
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
              radiusMiles: targetLocation.radiusMiles,
          }
        : null;

    const { query, results, search } = useAppleSearch(region, "addPlacesContent");
    const {
        pendingSavedLocation,
		pendingEditGroup,
        label,
        selectedIcon,
        selectedColor,
        showIncludeAll,
        includeAllLocations,
		hasCheckedDuplicates,
		setHasCheckedDuplicates,
        setPendingSavedLocation,
        setLabel,
        setSelectedIcon,
        setShowIncludeAll,
        setIncludeAllLocations,
        setDuplicateLocations,
        setSelectedColor,
    } = usePlacesSheetStore();

    const [resolving, setResolving] = React.useState(false);

    const handleChange = (text: string) => {
        search(text);
    };

    const handleSelect = async (item: { title: string; subtitle: string }, retryCount = 0) => {
        setResolving(true);
        setShowIncludeAll(false);
        setIncludeAllLocations(false);
        setDuplicateLocations([]);
        setHasCheckedDuplicates(false);

        try {
            const raw: ResolvedLocation = await AppleSearchModule.resolve(item.title, item.subtitle);

            const poiCategory = parsePOICategory(raw.pointOfInterestCategory);
            const icon = "mappin";

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
                color: selectedColor,
            };

            setPendingSavedLocation(location);
            search("");
        } catch (e) {
            console.error("Resolve error:", e);
            if (retryCount < 2) {
                const delay = 1000 * Math.pow(2, retryCount);
                await new Promise((res) => setTimeout(res, delay));
                handleSelect(item, retryCount + 1);
            }
        } finally {
            setResolving(false);
        }
    };

    const checkForDuplicates = async (
        name: string,
        latitude: number,
        longitude: number,
        radiusMiles: number
    ) => {
        setIsCheckingDuplicates(true);
        setHasCheckedDuplicates(false);
        try {
            const tiles = getTileRegions(latitude, longitude, radiusMiles);
            const allResults: ResolvedLocation[] = [];
            const CHUNK_SIZE = 4;
            const DELAY_MS = 200;

            for (let i = 0; i < tiles.length; i += CHUNK_SIZE) {
                const chunk = tiles.slice(i, i + CHUNK_SIZE);
                const chunkResults = await Promise.all(
                    chunk.map((tile) =>
                        AppleSearchModule.searchByName(
                            name,
                            tile.latitude,
                            tile.longitude,
                            milesToMeters(tile.radiusMiles)
                        ).catch(() => [])
                    )
                );
                allResults.push(...(chunkResults as ResolvedLocation[][]).flat());

                if (i + CHUNK_SIZE < tiles.length) {
                    await new Promise((res) => setTimeout(res, DELAY_MS));
                }
            }

            const deduped = allResults.filter(
                (r, i, arr) =>
                    arr.findIndex(
                        (x) => x.latitude === r.latitude && x.longitude === r.longitude
                    ) === i
            );

            const matches = deduped.filter((r) => {
                if (r.name?.toLowerCase() !== name.toLowerCase()) return false;
                return getDistanceMiles(latitude, longitude, r.latitude, r.longitude) <= radiusMiles;
            });

            setDuplicateLocations(matches);
            setShowIncludeAll(matches.length > 1);
            setHasCheckedDuplicates(true);
        } catch (e) {
            console.error("Duplicate check error:", e);
            setShowIncludeAll(false);
            setHasCheckedDuplicates(true);
        } finally {
            setIsCheckingDuplicates(false);
        }
    };

    function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 3958.8;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }

	React.useEffect(() => {
		if (!pendingSavedLocation) {
			setHasCheckedDuplicates(false);
			setIsCheckingDuplicates(false);
		}
	}, [pendingSavedLocation]);

	const isEdit = pendingEditGroup !== null;

    // ─── Confirm View ─────────────────────────────────────────────────────────
    if (pendingSavedLocation) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>
                <View style={styles.confirmContainer}>
                    <View style={[styles.previewCard, { backgroundColor: theme.colors.background }]}>
                        <View style={[styles.previewIcon, { backgroundColor: selectedColor }]}>
                            <SymbolView
                                name={selectedIcon}
                                size={28}
                                type="hierarchical"
                                tintColor={theme.colors.secondaryBackground}
                            />
                        </View>
                        <View style={styles.previewText}>
                            <Text style={[styles.previewName, { color: theme.colors.primaryText }]} numberOfLines={1}>
                                {label || pendingSavedLocation.name}
                            </Text>
                            <Text style={[styles.previewAddress, { color: theme.colors.secondaryText }]} numberOfLines={1}>
                                {pendingSavedLocation.address}
                            </Text>
                        </View>
                    </View>

                    {/* Duplicate check trigger / result */}
                    {!hasCheckedDuplicates && !isCheckingDuplicates && (
                        <Pressable
                            onPress={() =>
                                targetLocation &&
                                checkForDuplicates(
                                    pendingSavedLocation.name,
                                    targetLocation.latitude,
                                    targetLocation.longitude,
                                    targetLocation.radiusMiles
                                )
                            }
                            style={[
                                styles.includeAllContainer,
                                { backgroundColor: theme.colors.secondaryBackground },
                            ]}
                        >
                            <SymbolView
                                name="location.magnifyingglass"
                                size={16}
                                type="hierarchical"
                                tintColor={theme.colors.accent}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.includeAllText, { color: theme.colors.accent }]}>
                                {isEdit
									? `Update nearby ${pendingSavedLocation.name} locations`
									: `Find all nearby ${pendingSavedLocation.name} locations`}
                            </Text>
                        </Pressable>
                    )}

                    {isCheckingDuplicates && (
                        <View
                            style={[
                                styles.includeAllContainer,
                                { backgroundColor: theme.colors.secondaryBackground },
                            ]}
                        >
                            <ActivityIndicator
                                size="small"
                                color={theme.colors.secondaryText}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.includeAllText, { color: theme.colors.secondaryText }]}>
                                Searching for nearby {pendingSavedLocation.name} locations...
                            </Text>
                        </View>
                    )}

                    {hasCheckedDuplicates && showIncludeAll && (
                        <Pressable
                            onPress={() => setIncludeAllLocations(!includeAllLocations)}
                            style={[
                                styles.includeAllContainer,
                                { backgroundColor: theme.colors.secondaryBackground },
                            ]}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    {
                                        borderColor: includeAllLocations
                                            ? theme.colors.accent
                                            : theme.colors.secondaryText,
                                        backgroundColor: includeAllLocations
                                            ? theme.colors.accent
                                            : "transparent",
                                    },
                                ]}
                            >
                                {includeAllLocations && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </View>
                            <Text style={[styles.includeAllText, { color: theme.colors.primaryText }]}>
                                Include all {pendingSavedLocation.name} locations within {targetLocation?.radiusMiles} miles
                            </Text>
                        </Pressable>
                    )}

                    {hasCheckedDuplicates && !showIncludeAll && (
                        <View
                            style={[
                                styles.includeAllContainer,
                                { backgroundColor: theme.colors.secondaryBackground },
                            ]}
                        >
                            <SymbolView
                                name="checkmark.circle"
                                size={16}
                                type="hierarchical"
                                tintColor={theme.colors.secondaryText}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.includeAllText, { color: theme.colors.secondaryText }]}>
                                No other {pendingSavedLocation.name} locations found nearby
                            </Text>
                        </View>
                    )}

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

                    <Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>COLOR</Text>
                    <View style={[styles.colorGrid, { backgroundColor: theme.colors.background }]}>
                        {MARKER_COLORS.map((color) => {
                            const selected = selectedColor === color;
                            return (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => setSelectedColor(color)}
                                    style={styles.colorCell}
                                >
                                    <View
                                        style={[
                                            styles.colorSwatch,
                                            { backgroundColor: color },
                                            color === "#FFFFFF" && {
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                            },
                                            selected && {
                                                borderWidth: 2.5,
                                                borderColor: theme.colors.primaryText,
                                            },
                                        ]}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>ICON</Text>
					<View style={{ backgroundColor: theme.colors.background, borderRadius: 12 }}>
						{ICON_CATEGORIES.map((category) => {
							const icons = ALL_ICONS.filter((i) => i.category === category);
							if (icons.length === 0) return null;
							return (
								<View key={category}>
									<Text style={[styles.iconCategoryHeader, { color: theme.colors.secondaryText }]}>
										{category.toUpperCase()}
									</Text>
									<View style={styles.iconGrid}>
										{icons.map(({ icon }, index) => {
											const selected = selectedIcon === icon;
											return (
												<TouchableOpacity
													key={index}
													style={[
														styles.iconCell,
														selected && { backgroundColor: theme.colors.mutedBackground },
													]}
													onPress={() => {
														setSelectedIcon(icon);
														Keyboard.dismiss();
													}}
												>
													<SymbolView
														name={icon}
														size={22}
														type="hierarchical"
														tintColor={selected ? theme.colors.accent : theme.colors.primaryText}
													/>
												</TouchableOpacity>
											);
										})}
									</View>
								</View>
							);
						})}
					</View>
                </View>
            </View>
        );
    }

    // ─── Search View ──────────────────────────────────────────────────────────
    return (
        <View style={styles.searchContainer}>
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
                {resolving && (
                    <ActivityIndicator size="small" color={theme.colors.secondaryText} style={styles.spinner} />
                )}
            </View>

            {results.length > 0 && (
                <View style={[styles.resultsContainer, { backgroundColor: theme.colors.background }]}>
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
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 4,
    },
    confirmContainer: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 4,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
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
    resultsContainer: {
        marginTop: 4,
        borderRadius: 10,
        overflow: "hidden",
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
    previewCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        gap: 12,
    },
    previewIcon: {
        width: 48,
        height: 48,
        borderRadius: 36,
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
    includeAllContainer: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    checkmark: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
    includeAllText: {
        fontSize: 13,
        fontWeight: "500",
        flex: 1,
    },
    colorGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        borderRadius: 12,
        padding: 8,
    },
    colorCell: {
        width: "10%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    colorSwatch: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
	iconCategoryHeader: {
		fontSize: 11,
		fontWeight: "600",
		letterSpacing: 0.5,
		paddingHorizontal: 12,
		paddingTop: 12,
		paddingBottom: 4,
	},
});