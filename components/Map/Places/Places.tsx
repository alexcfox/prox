import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { SavedLocation } from "@/types/location";
import { parsePOICategory } from "@/types/location-mapping";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import AddPlacesContent from "./Add/AddPlacesContent";
import AddPlacesHeader from "./Add/AddPlacesHeader";
import ListPlacesContent from "./List/ListPlacesContent";
import ListPlacesHeader from "./List/ListPlacesHeader";

type Props = {
	sheetIndex: number;
};

export default function Places({ sheetIndex }: Props) {
	const theme = useTheme();
	const [swipingId, setSwipingId] = useState<string | null>(null);
	const {
		pendingSavedLocation,
		pendingEditGroup,
		hasCheckedDuplicates,
		label, selectedIcon, selectedColor,
		clearPendingSavedLocation,
		setPendingEditGroup,
		includeAllLocations,
		duplicateLocations,
		selectedPriority,
	} = usePlacesSheetStore();

	const { addSavedLocationGroup, updateSavedLocationGroup, savedLocationGroups } = useSavedLocationStore();

	const handleSave = () => {
		if (!pendingSavedLocation) return;

		let locations: SavedLocation[];

		if (includeAllLocations && duplicateLocations.length > 1) {
			locations = duplicateLocations.map((raw, i) => {
				const poiCategory = parsePOICategory(raw.pointOfInterestCategory);
				return {
					id: `${Date.now()}-${i}`,
					label,
					name: raw.name,
					address: raw.address,
					coordinate: { latitude: raw.latitude, longitude: raw.longitude },
					phoneNumber: raw.phoneNumber,
					url: raw.url,
					poiCategory,
					street: raw.street,
					city: raw.city,
					state: raw.state,
					zip: raw.zip,
					country: raw.country,
					countryCode: raw.countryCode,
					icon: selectedIcon,
					color: selectedColor,
				};
			});
		} else if (pendingEditGroup && !hasCheckedDuplicates) {
			locations = pendingEditGroup.locations.map(loc => ({
				...loc,
				label,
				icon: selectedIcon,
				color: selectedColor,
			}));
		} else {
			locations = [{
				...pendingSavedLocation,
				label,
				icon: selectedIcon,
				color: selectedColor,
			}];
		}

		if (pendingEditGroup) {
			updateSavedLocationGroup({
				...pendingEditGroup,
				label,
				color: selectedColor,
				icon: selectedIcon,
				locations,
				priority: selectedPriority,
			});
			setPendingEditGroup(null);
		} else {
			addSavedLocationGroup({
				id: Date.now().toString(),
				label,
				color: selectedColor,
				icon: selectedIcon,
				locations,
				priority: selectedPriority,
			});
		}

		clearPendingSavedLocation();
	};

	const [keyboardVisible, setKeyboardVisible] = React.useState(false);

	React.useEffect(() => {
		const show = Keyboard.addListener("keyboardWillShow", (e) => {
			setKeyboardVisible(true);
		});
		const hide = Keyboard.addListener("keyboardWillHide", () => {
			setKeyboardVisible(false);
		});
		return () => {
			show.remove();
			hide.remove();
		};
	}, []);

	const opacity = useSharedValue(1);

	React.useEffect(() => {
		opacity.value = withTiming(
			keyboardVisible ? 0 : 1,
			{ duration: 250 }
		);
	}, [keyboardVisible]);

	const listAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				{pendingSavedLocation ? (
					<AddPlacesHeader />
				) : (
					<ListPlacesHeader />
				)}
			</View>

			<BottomSheetScrollView 
				contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardVisible ? 400 : (pendingSavedLocation ? 0 : 100)}]}
				keyboardShouldPersistTaps="handled"
			>
				<>
					<AddPlacesContent />
					<Animated.View style={listAnimatedStyle}>
						{!pendingSavedLocation && (
							<>
								<ListPlacesContent
									swipingId={swipingId}
									setSwipingId={setSwipingId}
								/>
							</>
						)}
					</Animated.View>
				</>
			</BottomSheetScrollView>

			{(pendingSavedLocation || pendingEditGroup) && (
				<Pressable
					onPress={handleSave}
					style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
				>
					<Text style={[styles.saveButtonText, { color: theme.colors.coloredButtonText }]}>
						{pendingEditGroup ? "Save Changes" : "Save Place"}
					</Text>
				</Pressable>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		height: 50,
	},
	scrollContent: {
		paddingBottom: 700,
	},
	saveButton: {
		margin: 16,
		height: 50,
		borderRadius: 36,
    	marginBottom: 100,
		alignItems: "center",
		justifyContent: "center",
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "600",
	},
	categoryButton: {
		height: 44,
		borderRadius: 10,
		marginTop: 8,

		paddingHorizontal: 12,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	categoryButtonLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	categoryButtonText: {
		fontSize: 16,
		fontWeight: "500",
	},
});