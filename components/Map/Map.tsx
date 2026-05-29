import { useMapStore } from "@/stores/mapStore";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { MapType, Marker } from "react-native-maps";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CoinFlipButton from "../Shared/CoinFlipButton";
import MapTypeModal from "./modal/MapTypeModal";

type BaseType = "explore" | "satellite";

const BASE_MAP: Record<BaseType, { type: MapType }> = {
	explore: { type: "standard" },
	satellite: { type: "hybridFlyover" },
};

export default function Map() {

	const [cameraStats, setCameraStats] = useState<{altitude?: number, pitch?: number} | null>({ altitude: 6500, pitch: 0 });

	const theme = useTheme();
	const { baseType, pickerVisible, openPicker, mapRef } = useMapStore();

	const mapType = BASE_MAP[baseType];

	const buttonOpacity = useSharedValue(pickerVisible ? 0 : 1);

	useEffect(() => {
		buttonOpacity.value = withTiming(pickerVisible ? 0 : 1, { duration: 400 });
	}, [pickerVisible]);

	const buttonStyle = useAnimatedStyle(() => ({
		opacity: buttonOpacity.value,
	}));
	
    const is3DRef = useRef(false);
	const [is3D, setIs3D] = useState(false);

    const handle3DToggle = async () => {
        if (is3DRef.current) {
            is3DRef.current = false;
            setIs3D(false);
			mapRef.current?.getCamera().then((camera) => {
				mapRef.current?.animateCamera(
					{ pitch: 0, heading: 0, altitude: camera?.altitude },
					{ duration: 700 }
				);
			});
        } else {
            is3DRef.current = true;
            setIs3D(true);
			mapRef.current?.getCamera().then((camera) => {
				mapRef.current?.animateCamera(
					{ pitch: 35, heading: 0, altitude: camera?.altitude },
					{ duration: 700 }
				);
			});
        }
    };

const handleRegionChangeComplete = async () => {
    const camera = await mapRef.current?.getCamera();
    if (camera?.pitch !== undefined) {
        const manuallyIn3D = camera.pitch > 10;
        is3DRef.current = manuallyIn3D;
        setIs3D(manuallyIn3D);
        setCameraStats({ altitude: camera.altitude, pitch: camera.pitch });
    }
};

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				mapType={mapType.type}
				ref={mapRef}
                onRegionChangeComplete={handleRegionChangeComplete}
				rotateEnabled
				pitchEnabled
				showsCompass
				initialCamera={{
					center: { latitude: 33.6846, longitude: -117.8265 },
					altitude: 6500,
					pitch: 0,
					heading: 0,
				}}
				initialRegion={{
					latitude: 33.6846,
					longitude: -117.8265,
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				}}
			>
				<Marker
					coordinate={{ latitude: 33.6846, longitude: -117.8265 }}
					title="Irvine (92620)"
				/>
			</MapView>

			<Animated.View style={[styles.buttonStack, buttonStyle]}>

				<CoinFlipButton
					is3D={is3D}
					onPress={handle3DToggle}
					disabled={pickerVisible}
				/>

				<Pressable
					style={[styles.button, { backgroundColor: theme.colors.background }]}
					onPress={openPicker}
					disabled={pickerVisible}
				>
					<SymbolView name="map.fill" size={20} tintColor={theme.colors.primaryText} />
				</Pressable>

			</Animated.View>

			{pickerVisible && <MapTypeModal />}

			{cameraStats && (
				<View style={styles.debugOverlay}>
					<Text style={styles.debugText}>alt: {cameraStats.altitude?.toFixed(0)}</Text>
					<Text style={styles.debugText}>pitch: {cameraStats.pitch?.toFixed(1)}</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	map: { ...StyleSheet.absoluteFillObject },
	buttonStack: {
		position: "absolute",
		bottom: 44,
		right: 16,
		gap: 10,
		alignItems: "center",
	},
	button: {
		width: 42,
		height: 42,
		borderRadius: 21,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
	},
	buttonLabel: {
		fontSize: 13,
		fontWeight: "700",
	},
	debugOverlay: {
		position: "absolute",
		top: 60,
		left: 16,
		backgroundColor: "rgba(0,0,0,0.6)",
		padding: 8,
		borderRadius: 8,
		gap: 2,
	},
	debugText: {
		color: "white",
		fontSize: 12,
		fontFamily: "Courier",
	},
});