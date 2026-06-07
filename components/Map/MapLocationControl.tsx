import React, { useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { SymbolView } from "expo-symbols";
import { NativeModules } from "react-native";

import { useAppleSearch } from "@/hooks/useAppleSearch";
import { useMapStore } from "@/stores/mapStore";
import { useTargetLocationStore } from "@/stores/targetLocationStore";
import { useTheme } from "@/theme/theme";
import { ResolvedLocation } from "@/types/location";

const { AppleSearchModule } = NativeModules;

export default function MapLocationControl() {
    const theme = useTheme();

    const userLocation = useMapStore((s) => s.userLocation);
    const targetLocation = useTargetLocationStore((s) => s.targetLocation);
    const setTargetLocation = useTargetLocationStore((s) => s.setTargetLocation);
    const inputRef = useRef<TextInput>(null);

    const [isEditing, setIsEditing] = React.useState(false);
    const [resolving, setResolving] = React.useState(false);
    const [inputFocused, setInputFocused] = React.useState(false);

    const isLocked = !!targetLocation && !isEditing;

    const region = targetLocation
        ? {
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
              radiusMiles: targetLocation.radiusMiles,
          }
        : null;

    const { query, results, search } = useAppleSearch(region);

    const radius = targetLocation?.radiusMiles ?? 10;
    const radiusOptions = [5, 10, 15, 25, 50];

    const onRadiusPress = () => {
        if (!targetLocation) return;
        const currentIndex = radiusOptions.indexOf(radius);
        const next = radiusOptions[(currentIndex + 1) % radiusOptions.length];
        setTargetLocation({ ...targetLocation, radiusMiles: next });
    };

    const handleChange = (text: string) => {
        search(text, ["address"]);
    };

    const handleUnlock = () => {
        Alert.alert(
            "Change Location?",
            "Are you sure you want to change your search location?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Change",
                    onPress: () => {
                        setIsEditing(true);
                        setTimeout(() => inputRef.current?.focus(), 50);
                    },
                },
            ]
        );
    };

    const handleBlur = () => {
        setInputFocused(false);
        if (targetLocation && !resolving) {
            search("");
            setIsEditing(false);
        }
    };

    const handleSelect = async (item: { title: string; subtitle: string }) => {
        setResolving(true);
        inputRef.current?.blur();
        Keyboard.dismiss();

        try {
            const raw: ResolvedLocation = await AppleSearchModule.resolve(
                item.title,
                item.subtitle
            );

            search("");

            setTargetLocation({
                city: raw.city,
                state: raw.state,
                zip: raw.zip,
                latitude: raw.latitude,
                longitude: raw.longitude,
                radiusMiles: targetLocation?.radiusMiles ?? 25,
            });

            setIsEditing(false);
        } catch (e) {
            console.log("resolve error", e);
        } finally {
            setResolving(false);
        }
    };

    const handleUseCurrentLocation = async () => {
        if (!userLocation) return;
        setResolving(true);
        inputRef.current?.blur();
        Keyboard.dismiss();

        try {
            const raw: ResolvedLocation = await AppleSearchModule.resolve(
                `${userLocation.latitude},${userLocation.longitude}`,
                ""
            );

            search("");

            setTargetLocation({
                city: raw.city,
                state: raw.state,
                zip: raw.zip,
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                radiusMiles: targetLocation?.radiusMiles ?? 25,
            });

            setIsEditing(false);
        } catch (e) {
            console.log("current location error", e);
        } finally {
            setResolving(false);
        }
    };

    const lockedLabel = targetLocation
        ? [targetLocation.city, targetLocation.state].filter(Boolean).join(", ")
        : "";

    const showResults = inputFocused || results.length > 0;

    return (
        <View style={styles.container}>
            {/* SEARCH BAR */}
            <View
                style={[
                    styles.searchBar,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                {isLocked ? (
                    <Pressable style={styles.lockedLabel} onPress={handleUnlock}>
                        <Text
                            style={[styles.lockedText, { color: theme.colors.primaryText }]}
                            numberOfLines={1}
                        >
                            Currently Searching {lockedLabel}
                        </Text>
                    </Pressable>
                ) : (
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { color: theme.colors.primaryText }]}
                        spellCheck={false}
                        keyboardType="web-search"
                        placeholder="Set search location..."
                        placeholderTextColor={theme.colors.secondaryText}
                        value={query}
                        onChangeText={handleChange}
                        onFocus={() => setInputFocused(true)}
                        onBlur={handleBlur}
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                    />
                )}

                {resolving && (
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.secondaryText}
                        style={styles.spinner}
                    />
                )}

                <Pressable onPress={onRadiusPress} style={styles.radiusBtn}>
                    <SymbolView
                        name="scope"
                        size={18}
                        type="hierarchical"
                        tintColor={theme.colors.primaryText}
                    />
                    <Text
                        style={[styles.radiusText, { color: theme.colors.primaryText }]}
                    >
                        {radius} mi
                    </Text>
                </Pressable>
            </View>

            {/* RESULTS */}
            {showResults && (
                <View
                    style={[
                        styles.resultsContainer,
                        { backgroundColor: theme.colors.background },
                    ]}
                >
                    {userLocation && (
                        <>
                            <Pressable
                                style={styles.currentLocationRow}
                                onPress={handleUseCurrentLocation}
                            >
                                <SymbolView
                                    name="location.fill"
                                    size={14}
                                    type="hierarchical"
                                    tintColor="#007AFF"
                                    style={styles.currentLocationIcon}
                                />
                                <Text style={styles.currentLocationText}>
                                    Use Current Location
                                </Text>
                            </Pressable>
                            {results.length > 0 && (
                                <View
                                    style={[
                                        styles.separator,
                                        { backgroundColor: theme.colors.border },
                                    ]}
                                />
                            )}
                        </>
                    )}

                    {results.length > 0 && (
                        <FlatList
                            data={results}
                            keyExtractor={(item, i) => item.title + i}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item, index }) => (
                                <View>
                                    <Pressable
                                        style={styles.row}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text
                                            style={[
                                                styles.title,
                                                { color: theme.colors.primaryText },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.subtitle,
                                                { color: theme.colors.secondaryText },
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {item.subtitle}
                                        </Text>
                                    </Pressable>

                                    {index < results.length - 1 && (
                                        <View
                                            style={[
                                                styles.separator,
                                                { backgroundColor: theme.colors.border },
                                            ]}
                                        />
                                    )}
                                </View>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 60,
        left: 12,
        right: 12,
    },

    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderRadius: 10,
        height: 44,
    },

    lockedLabel: {
        flex: 1,
        justifyContent: "center",
    },

    lockedText: {
        fontSize: 16,
    },

    input: {
        flex: 1,
        fontSize: 16,
    },

    spinner: {
        marginLeft: 8,
    },

    radiusBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingLeft: 10,
    },

    radiusText: {
        fontSize: 13,
        fontWeight: "600",
    },

    resultsContainer: {
        marginTop: 4,
        borderRadius: 10,
        overflow: "hidden",
        maxHeight: 250,
    },

    currentLocationRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    currentLocationIcon: {
        marginRight: 8,
    },

    currentLocationText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#007AFF",
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
});