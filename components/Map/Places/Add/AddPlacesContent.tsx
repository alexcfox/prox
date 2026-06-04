import { useAppleSearch } from "@/hooks/useAppleSearch";
import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { milesToMeters, useTargetLocationStore } from "@/stores/targetLocationStore";
import { useTheme } from "@/theme/theme";
import { ALL_ICONS, iconForPOICategory } from "@/types/icons";
import { ResolvedLocation, SavedLocation } from "@/types/location";
import { parsePOICategory } from "@/types/location-mapping";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
	ActivityIndicator,
	Keyboard,
	NativeModules,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";

const { AppleSearchModule } = NativeModules;

export default function AddPlacesContent() {
	const theme = useTheme();
	const { targetLocation } = useTargetLocationStore();

	const region = targetLocation
		? {
			latitude: targetLocation.latitude,
			longitude: targetLocation.longitude,
			radiusMiles: targetLocation.radiusMiles,
		}
		: null;

	const { query, results, search } = useAppleSearch(region);
	const {
		pendingSavedLocation,
		label,
		selectedIcon,
		showIncludeAll,
		includeAllLocations,
		setPendingSavedLocation,
		setLabel,
		setSelectedIcon,
		setShowIncludeAll,
		setIncludeAllLocations,
		setDuplicateLocations,
	} = usePlacesSheetStore();

	const [resolving, setResolving] = React.useState(false);

	const handleChange = (text: string) => {
		search(text);
	};

	const handleSelect = async (item: { title: string; subtitle: string }) => {
		setResolving(true);
		setShowIncludeAll(false);
		setIncludeAllLocations(false);
		setDuplicateLocations([]);

		try {
			const raw: ResolvedLocation = await AppleSearchModule.resolve(item.title, item.subtitle);

			const poiCategory = parsePOICategory(raw.pointOfInterestCategory);
			const icon = iconForPOICategory(poiCategory);

			const location: SavedLocation = {
				id: Date.now().toString(),
				label: raw.name,
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
				icon,
			};

			setPendingSavedLocation(location);
			search("");

			if (targetLocation) {
				checkForDuplicates(raw.name, targetLocation.latitude, targetLocation.longitude, targetLocation.radiusMiles);
			}
		} catch (e) {
			console.error("Resolve error:", e);
		} finally {
			setResolving(false);
		}
	};

	const checkForDuplicates = async (
		name: string,
		latitude: number,
		longitude: number,
		radiusMiles: number
	) => {
		try {
			const results: ResolvedLocation[] =
				await AppleSearchModule.searchByName(
					name,
					latitude,
					longitude,
					milesToMeters(radiusMiles)
				);

			const matches = results.filter((r) => {
				if (r.name?.toLowerCase() !== name.toLowerCase()) {
					return false;
				}

				return (
					getDistanceMiles(
						latitude,
						longitude,
						r.latitude,
						r.longitude
					) <= radiusMiles
				);
			});

			setDuplicateLocations(matches);
			setShowIncludeAll(matches.length > 1);
		} catch (e) {
			console.error("Duplicate check error:", e);
			setShowIncludeAll(false);
		}
	};

	function getDistanceMiles(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number
	) {
		const R = 3958.8;

		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) ** 2;

		var distanceInMiles = R *
			(2 *
				Math.atan2(
					Math.sqrt(a),
					Math.sqrt(1 - a)
				));

		console.log(distanceInMiles);
		return (
			distanceInMiles
		);
	}

	// ─── Confirm View ─────────────────────────────────────────────────────────
	if (pendingSavedLocation) {
		return (
			<View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }]}>
				<View style={styles.confirmContainer}>
					<View style={[styles.previewCard, { backgroundColor: theme.colors.background }]}>
						<View style={[styles.previewIcon, { backgroundColor: theme.colors.mutedBackground }]}>
							<SymbolView
								name={selectedIcon}
								size={28}
								type="hierarchical"
								tintColor={theme.colors.accent}
							/>
						</View>
						<View style={styles.previewText}>
							<Text style={[styles.previewName, { color: theme.colors.primaryText }]} numberOfLines={1}>
								{label || pendingSavedLocation.name}
							</Text>
							<Text style={[styles.previewAddress, { color: theme.colors.secondaryText }]} numberOfLines={1}>
								{pendingSavedLocation.address}
							</Text>
						</View>
					</View>

					{showIncludeAll && (
						<Pressable
							onPress={() => setIncludeAllLocations(!includeAllLocations)}
							style={[
								styles.includeAllContainer,
								{ backgroundColor: theme.colors.secondaryBackground },
							]}
						>
							<View
								style={[
									styles.checkbox,
									{
										borderColor: includeAllLocations
											? theme.colors.accent
											: theme.colors.secondaryText,
										backgroundColor: includeAllLocations
											? theme.colors.accent
											: "transparent",
									},
								]}
							>
								{includeAllLocations && (
									<Text style={styles.checkmark}>✓</Text>
								)}
							</View>
							<Text style={[styles.includeAllText, { color: theme.colors.primaryText }]}>
								Include all {pendingSavedLocation.name} locations within {targetLocation?.radiusMiles} miles 
							</Text>
						</Pressable>
					)}

					<Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>LABEL</Text>
					<View style={[styles.inputCard, { backgroundColor: theme.colors.background }]}>
						<TextInput
							style={[styles.labelInput, { color: theme.colors.primaryText }]}
							value={label}
							onChangeText={setLabel}
							placeholder="Label this place..."
							placeholderTextColor={theme.colors.secondaryText}
							clearButtonMode="while-editing"
						/>
					</View>

					<Text style={[styles.sectionHeader, { color: theme.colors.secondaryText }]}>ICON</Text>
					<View style={[styles.iconGrid, { backgroundColor: theme.colors.background }]}>
						{ALL_ICONS.map(({ label: iconLabel, icon }, index) => {
							const selected = selectedIcon === icon;
							return (
								<TouchableOpacity
									key={index}
									style={[
										styles.iconCell,
										selected && { backgroundColor: theme.colors.mutedBackground }
									]}
									onPress={() => {
										setSelectedIcon(icon);
										Keyboard.dismiss();
									}}
								>
									<SymbolView
										name={icon}
										size={22}
										type="hierarchical"
										tintColor={selected ? theme.colors.accent : theme.colors.primaryText}
									/>
									<Text style={[
										styles.iconLabel,
										{ color: selected ? theme.colors.accent : theme.colors.secondaryText }
									]}>
										{iconLabel}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			</View>
		);
	}

	// ─── Search View ──────────────────────────────────────────────────────────
	return (
		<View style={styles.searchContainer}>
			<View style={[styles.searchBar, { backgroundColor: theme.colors.background }]}>
				<TextInput
					style={[styles.input, { color: theme.colors.primaryText }]}
					placeholder="Search places..."
					placeholderTextColor={theme.colors.secondaryText}
					value={query}
					onChangeText={handleChange}
					autoCorrect={false}
					clearButtonMode="while-editing"
				/>
				{resolving && (
					<ActivityIndicator size="small" color={theme.colors.secondaryText} style={styles.spinner} />
				)}
			</View>

			{results.length > 0 && (
				<View style={[styles.resultsContainer, { backgroundColor: theme.colors.background }]}>
					{results.map((item, i) => (
						<View key={i}>
							<TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
								<Text style={[styles.title, { color: theme.colors.primaryText }]} numberOfLines={1}>
									{item.title}
								</Text>
								<Text style={[styles.subtitle, { color: theme.colors.secondaryText }]} numberOfLines={1}>
									{item.subtitle}
								</Text>
							</TouchableOpacity>
							{i < results.length - 1 && (
								<View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
							)}
						</View>
					))}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		paddingHorizontal: 12,
		paddingTop: 8,
		paddingBottom: 4,
	},
	confirmContainer: {
		paddingHorizontal: 12,
		paddingTop: 8,
		paddingBottom: 4,
	},
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
	resultsContainer: {
		marginTop: 4,
		borderRadius: 10,
		overflow: "hidden",
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
	previewCard: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 12,
		padding: 14,
		marginBottom: 10,
		gap: 12,
	},
	previewIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	previewText: {
		flex: 1,
	},
	previewName: {
		fontSize: 16,
		fontWeight: "600",
	},
	previewAddress: {
		fontSize: 13,
		marginTop: 2,
	},
	sectionHeader: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: 0.5,
		marginBottom: 8,
		marginLeft: 4,
	},
	inputCard: {
		borderRadius: 12,
		paddingHorizontal: 14,
		height: 44,
		justifyContent: "center",
		marginBottom: 24,
	},
	labelInput: {
		fontSize: 16,
	},
	iconGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		borderRadius: 12,
		padding: 8,
	},
	iconCell: {
		width: "20%",
		alignItems: "center",
		paddingVertical: 10,
		borderRadius: 10,
		gap: 4,
	},
	iconLabel: {
		fontSize: 10,
		textAlign: "center",
	},
	includeAllContainer: {
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 10,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1.5,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	checkmark: {
		color: "white",
		fontSize: 12,
		fontWeight: "600",
	},
	includeAllText: {
		fontSize: 13,
		fontWeight: "500",
		flex: 1,
	},
});