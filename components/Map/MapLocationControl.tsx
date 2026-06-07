import React, { useRef } from "react";
import {
    ActivityIndicator,
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
import { useTargetLocationStore } from "@/stores/targetLocationStore";
import { useTheme } from "@/theme/theme";
import { ResolvedLocation } from "@/types/location";

const { AppleSearchModule } = NativeModules;

export default function MapLocationControl() {
    const theme = useTheme();

    const targetLocation = useTargetLocationStore((s) => s.targetLocation);
    const setTargetLocation = useTargetLocationStore((s) => s.setTargetLocation);
    const inputRef = useRef<TextInput>(null);
    
    const region = targetLocation
        ? {
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
              radiusMiles: targetLocation.radiusMiles,
          }
        : null;

    const { query, results, search } = useAppleSearch(region);

    const [resolving, setResolving] = React.useState(false);

    const radius = targetLocation?.radiusMiles ?? 25;

    const onRadiusPress = () => {
        if (!targetLocation) return;

        const next =
            radius === 25 ? 50 : radius === 50 ? 10 : 25;

        setTargetLocation({
            ...targetLocation,
            radiusMiles: next,
        });
    };

    const handleChange = (text: string) => {
        search(text);
    };

    const handleSelect = async (item: {
        title: string;
        subtitle: string;
    }) => {
        setResolving(true);
        inputRef.current?.blur();
        Keyboard.dismiss();

        try {
            const raw: ResolvedLocation =
                await AppleSearchModule.resolve(
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
        } catch (e) {
            console.log("resolve error", e);
        } finally {
            setResolving(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* SEARCH BAR (MATCHED TO YOUR OTHER FILE) */}
            <View
                style={[
                    styles.searchBar,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <TextInput
                    ref={inputRef}
                    style={[
                        styles.input,
                        { color: theme.colors.primaryText },
                    ]}
                    spellCheck={false}
                    keyboardType="web-search"
                    placeholder="Search location..."
                    placeholderTextColor={
                        theme.colors.secondaryText
                    }
                    value={query}
                    onChangeText={handleChange}
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />

                {resolving && (
                    <ActivityIndicator
                        size="small"
                        color={theme.colors.secondaryText}
                        style={styles.spinner}
                    />
                )}

                <Pressable
                    onPress={onRadiusPress}
                    style={styles.radiusBtn}
                >
                    <SymbolView
                        name="scope"
                        size={18}
                        type="hierarchical"
                        tintColor={theme.colors.primaryText}
                    />
                    <Text
                        style={[
                            styles.radiusText,
                            { color: theme.colors.primaryText },
                        ]}
                    >
                        {radius} mi
                    </Text>
                </Pressable>
            </View>

            {/* RESULTS (same structure style as AddPlacesContent) */}
            {results.length > 0 && (
                <View
                    style={[
                        styles.resultsContainer,
                        {
                            backgroundColor:
                                theme.colors.background,
                        },
                    ]}
                >
                    <FlatList
                        data={results}
                        keyExtractor={(item, i) =>
                            item.title + i
                        }
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item, index }) => (
                            <View>
                                <Pressable
                                    style={styles.row}
                                    onPress={() =>
                                        handleSelect(item)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.title,
                                            {
                                                color: theme
                                                    .colors
                                                    .primaryText,
                                            },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.title}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.subtitle,
                                            {
                                                color: theme
                                                    .colors
                                                    .secondaryText,
                                            },
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
                                            {
                                                backgroundColor:
                                                    theme
                                                        .colors
                                                        .border,
                                            },
                                        ]}
                                    />
                                )}
                            </View>
                        )}
                    />
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

    // MATCHED STYLE
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