// SearchCategoriesContent.tsx

import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { useTheme } from "@/theme/theme";
import { CATEGORIES } from "@/types/SearchCategories";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SearchCategoriesContent() {
    const theme = useTheme();
    const {setSelectedCategory, setShowCategories} = usePlacesSheetStore();
    return (
        <View style={styles.container}>
            {CATEGORIES.map((category) => (
                <Pressable
                    key={category.poiCategory}
                    onPress={() => {
                        console.log("CATEGORY CLICKED:", category.poiCategory);

                        setSelectedCategory(category);
                        setShowCategories(false); // if you're leaving the list view
                    }}
                    style={({ pressed }) => [
                        styles.row,
                        {
                            backgroundColor: pressed
                                ? theme.colors.mutedBackground
                                : theme.colors.background,
                        },
                    ]}
                >
                    <View style={styles.leftContent}>
                        <SymbolView
                            name={category.icon}
                            size={18}
                            type="hierarchical"
                            tintColor={theme.colors.accent}
                        />

                        <Text
                            style={[
                                styles.title,
                                { color: theme.colors.primaryText },
                            ]}
                        >
                            {category.title}
                        </Text>
                    </View>

                    <SymbolView
                        name="chevron.right"
                        size={14}
                        type="hierarchical"
                        tintColor={theme.colors.secondaryText}
                    />
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 8,
        gap: 8,
    },
    row: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 14,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
    },
});