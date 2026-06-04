import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AddPlacesHeader() {
	const theme = useTheme();
	const { clearPendingSavedLocation } = usePlacesSheetStore();

	const handleBack = () => {
		clearPendingSavedLocation();
	};

	return (
		<View style={styles.placesHeader}>
			<View style={styles.placesInfo}>
				<Text style={[styles.placesTitle, { color: theme.colors.primaryText }]}>
					Add Place
				</Text>
				
				<Text
					style={[
						styles.placesCount,
						{ color: theme.colors.secondaryText }
					]}
				>
					Customize however you need
				</Text>
			</View>

			<Pressable
                style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.mutedText },
                ]}
                onPress={() => handleBack()}
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

