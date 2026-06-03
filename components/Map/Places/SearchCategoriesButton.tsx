// SearchCategoriesButton.tsx

import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    onPress: () => void;
};

export default function SearchCategoriesButton({ onPress }: Props) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: pressed
                            ? theme.colors.mutedBackground
                            : theme.colors.background,
                    },
                ]}
            >
                <View style={styles.leftContent}>
                    <SymbolView
                        name="square.grid.2x2"
                        size={18}
                        type="hierarchical"
                        tintColor={theme.colors.accent}
                    />

                    <Text
                        style={[
                            styles.text,
                            { color: theme.colors.primaryText },
                        ]}
                    >
                        Search by Category
                    </Text>
                </View>

                <SymbolView
                    name="chevron.right"
                    size={14}
                    type="hierarchical"
                    tintColor={theme.colors.secondaryText}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
    },
    button: {
        height: 44,
        borderRadius: 10,
        marginTop: 8,
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
    text: {
        fontSize: 16,
        fontWeight: "500",
    },
});