import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { SavedLocation } from "@/types/location";
import { parsePOICategory } from "@/types/location-mapping";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Keyboard, NativeModules, Pressable, StyleSheet, Text, View } from "react-native";
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
	const { savedLocationGroups, removeSavedLocationGroup, addSavedLocationGroup } = useSavedLocationStore();
	const { pendingSavedLocation, label, selectedIcon, clearPendingSavedLocation } = usePlacesSheetStore();
	const [swipingId, setSwipingId] = useState<string | null>(null);
	const { includeAllLocations, duplicateLocations } = usePlacesSheetStore();

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
					icon: selectedIcon,
				};
			});
		} else {
			locations = [
				{
					...pendingSavedLocation,
					label,
					icon: selectedIcon,
				},
			];
		}

		addSavedLocationGroup({
			id: Date.now().toString(),
			label,
			icon: selectedIcon,
			locations,
		});

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

	const tileSearch = async (
		category: string,
		centerLat: number,
		centerLng: number
	) => {
		const { AppleSearchModule } = NativeModules;
		const step = 0.04;
		const totalRadius = 0.12;
		const tiles: [number, number][] = [];

		for (let dlat = -totalRadius; dlat <= totalRadius; dlat += step) {
			for (let dlng = -totalRadius; dlng <= totalRadius; dlng += step) {
				const dist = Math.sqrt(dlat * dlat + dlng * dlng);
				if (dist <= totalRadius) {
					tiles.push([centerLat + dlat, centerLng + dlng]);
				}
			}
		}

		const seen = new Set<string>();
		const allResults: any[] = [];

		for (const [lat, lng] of tiles) {
			try {
				const results = await AppleSearchModule.searchCategory(
					category, lat, lng, 5000
				);
				for (const r of results) {
					const key = `${r.name}|${r.address}`;
					if (!seen.has(key)) {
						seen.add(key);
						allResults.push(r);
					}
				}
			} catch (e) {
				// skip failed tiles, don't abort the whole search
				console.warn(`tile [${lat}, ${lng}] failed, skipping`);
			}
			await new Promise(res => setTimeout(res, 200));
		}

		return allResults;
	};

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
								{/* <SearchCategoriesButton
									onPress={() => {
										console.log("Search by Category");
										setShowCategories(true);
									}}
								/> */}
								<ListPlacesContent
									savedLocationGroups={savedLocationGroups}
									removeSavedLocationGroup={removeSavedLocationGroup}
									swipingId={swipingId}
									setSwipingId={setSwipingId}
								/>
							</>
						)}
					</Animated.View>
				</>
			</BottomSheetScrollView>

			{pendingSavedLocation && (
				<Pressable
					onPress={handleSave}
					style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
				>
					<Text style={[styles.saveButtonText, { color: theme.colors.coloredButtonText }]}>
						Save Place
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