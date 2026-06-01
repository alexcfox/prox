import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    setSheetMode: (mode: "list" | "add") => void;
};

export default function AddPlacesHeader({ setSheetMode }: Props) {

    const theme = useTheme();

    return (
        <View style={styles.placesHeader}>
            <View style={styles.placesInfo}>
                <Text
                    style={[
                        styles.placesTitle,
                        { color: theme.colors.primaryText },
                    ]}
                >
                    Add Places
                </Text>

                <Text
                    style={[
                        styles.placesCount,
                        { color: theme.colors.secondaryText },
                    ]}
                >
                    Search for a single place or add by categories.
                </Text>
            </View>

            <Pressable
                style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.mutedText },
                ]}
                onPress={() => setSheetMode("list")}
            >
                <SymbolView
                    name="xmark"
                    size={20}
                    tintColor={theme.colors.coloredButtonText}
                />
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    placesHeader: {
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    placesInfo: {
        flex: 1,
    },

    placesTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    placesCount: {
        marginTop: 2,
        fontSize: 14,
    },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
});