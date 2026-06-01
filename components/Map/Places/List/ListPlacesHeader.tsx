import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    setSheetMode: (mode: "list" | "add") => void;
    sheetIndex: number;
    expandSheet: () => void;
};

export default function ListPlacesHeader({ setSheetMode, expandSheet, sheetIndex }: Props) {

    const theme = useTheme();
    const { savedLocations } = useSavedLocationStore();

    return (
        <View style={styles.placesHeader}>
            <View style={styles.placesInfo}>
                <Text
                    style={[
                        styles.placesTitle,
                        { color: theme.colors.primaryText }
                    ]}
                >
                    Places
                </Text>

                <Text
                    style={[
                        styles.placesCount,
                        { color: theme.colors.secondaryText }
                    ]}
                >
                    {savedLocations.length} {savedLocations.length === 1 ? "Place" : "Places"} Added

                    {savedLocations.length === 0 ? " • Add Your First Place" : ""}
                </Text>
            </View>

            <Pressable
                style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.accent }
                ]}
                onPress={() => {
                    setSheetMode("add");
                    if (sheetIndex < 1) {
                        expandSheet();
                    }
                }}
            >
                <SymbolView
                    name="plus"
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