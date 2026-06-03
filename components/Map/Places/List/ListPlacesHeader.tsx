import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ListPlacesHeader() {

    const theme = useTheme();
    const { getLocationCount } = useSavedLocationStore();

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
                    {getLocationCount()} {getLocationCount() === 1 ? "Place" : "Places"} Added

                    {getLocationCount() === 0 ? " • Add Your First Place" : ""}
                </Text>
            </View>
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
});