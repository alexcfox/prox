import { useHeatmapStore } from "@/stores/heatMapStore";
import { useMapStore } from "@/stores/mapStore";
import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTargetLocationStore } from "@/stores/targetLocationStore";
import { useTheme } from "@/theme/theme";
import { milesToMeters } from "@/utils/geo";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import MapView, { Circle, MapType, Marker, Overlay } from "react-native-maps";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CoinFlipButton from "../Shared/CoinFlipButton";
import MapLocationControl from "./MapLocationControl";
import MapTypeModal from "./modal/MapTypeModal";

type BaseType = "explore" | "satellite";

const BASE_MAP: Record<BaseType, { type: MapType }> = {
    explore: { type: "standard" },
    satellite: { type: "hybridFlyover" },
};

const ALTITUDE: number = 10000; 
const MARKER_SIZE: number = 18; 
const MARKER_ICON_SIZE: number = 14; 

const CELL_SIZE_DEGREES = 0.5 / 69.0;

function scoreToColor(score: number): string {
    const t = score / 100;
    let r, g;
    if (t < 0.25) {
        r = 255;
        g = Math.round(255 * (t / 0.25));
    } else {
        r = Math.round(255 * ((1 - t) / 0.75));
        g = 255;
    }
    const alpha = t < 0.5 ? 0.15 : 0.25 + ((t - 0.5) * 0.5);
    return `rgba(${r},${g},0,${alpha.toFixed(2)})`;
}

function cellToPolygon(lat: number, lng: number): { latitude: number; longitude: number }[] {
    const halfLat = CELL_SIZE_DEGREES / 2;
    const halfLng = (0.5 / (69.0 * Math.cos((lat * Math.PI) / 180))) / 2;
    return [
        { latitude: lat - halfLat, longitude: lng - halfLng },
        { latitude: lat - halfLat, longitude: lng + halfLng },
        { latitude: lat + halfLat, longitude: lng + halfLng },
        { latitude: lat + halfLat, longitude: lng - halfLng },
    ];
}

export default function Map() {
    
	const mapRef = useRef<MapView | null>(null);

	const hasInitialRecentered = useRef(false);
    const { targetLocation } = useTargetLocationStore();

    const theme = useTheme();
    const { baseType, pickerVisible, openPicker, setUserLocation, userLocation } = useMapStore();

    const { imageUri } = useHeatmapStore();
    const mapType = BASE_MAP[baseType];

    const buttonOpacity = useSharedValue(pickerVisible ? 0 : 1);

    const { getSavedLocations} = useSavedLocationStore();

    useEffect(() => {
        if (pickerVisible) {
            buttonOpacity.value = withTiming(0, { duration: 400 });
        } else {
            buttonOpacity.value = withTiming(1, { duration: 400 });
        }
    }, [pickerVisible]);

    const buttonStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    const is3DRef = useRef(false);
    const [is3D, setIs3D] = useState(false);

    const handle3DToggle = async () => {
        const camera = await mapRef.current?.getCamera();
        if (!camera) return;

        const next3D = !is3DRef.current;

        is3DRef.current = next3D;
        setIs3D(next3D);

        mapRef.current?.animateCamera(
            {
                pitch: next3D ? 35 : 0,
                altitude: camera.altitude,
            },
            { duration: 700 }
        );
    };

    const handleRegionChangeComplete = async () => {
        const camera = await mapRef.current?.getCamera();
        if (camera?.pitch !== undefined) {
            const manuallyIn3D = camera.pitch > 10;
            is3DRef.current = manuallyIn3D;
            setIs3D(manuallyIn3D);
            // setCameraStats({ altitude: camera.altitude, pitch: camera.pitch });
        }
    };

	const handleRecenter = async () => {
		if (!targetLocation || !mapRef.current) return;

		mapRef.current?.animateCamera(
			{
				center: {
					latitude: targetLocation.latitude,
					longitude: targetLocation.longitude,
				},
				heading: 0,
				altitude: milesToMeters(targetLocation.radiusMiles) * 8.5,
			},
            { duration: 700 }
		);
	};

    useEffect(() => {
        if (!targetLocation || !mapRef.current) {
            return;
        }

        mapRef.current.animateCamera(
            {
                center: {
                    latitude: targetLocation.latitude,
                    longitude: targetLocation.longitude,
                },
                altitude:  milesToMeters(targetLocation.radiusMiles) * 8.5,
            },
            { duration: 750 }
        );
    }, [targetLocation]);

    return (
        <View style={styles.container}>
            <MapView
                mapPadding={{ bottom: 110, top: 0, left: 0, right: 0 }}
                style={styles.map}
                mapType={mapType.type}
                ref={mapRef}
                onPress={() => Keyboard.dismiss()}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                rotateEnabled
                pitchEnabled
                showsCompass
                initialCamera={{
                    center: { latitude: 33.6846, longitude: -117.8265 },
                    altitude: ALTITUDE,
                    pitch: 0,
                    heading: 0,
                }}
				onUserLocationChange={(e) => {
					const coord = e.nativeEvent.coordinate;
					if (!coord) return;
					setUserLocation({ latitude: coord.latitude, longitude: coord.longitude });

					if (!hasInitialRecentered.current) {
						hasInitialRecentered.current = true;
						mapRef.current?.animateCamera(
							{
								center: { latitude: coord.latitude, longitude: coord.longitude },
								altitude: ALTITUDE,
								pitch: 0,
								heading: 0,
							},
							{ duration: 600 }
						);
					}
				}}
            >

                {imageUri && targetLocation && (
                    <Overlay
                        image={{ uri: imageUri }}
                        bounds={[
                            [
                                targetLocation.latitude - (targetLocation.radiusMiles / 69.0),
                                targetLocation.longitude - (targetLocation.radiusMiles / (69.0 * Math.cos((targetLocation.latitude * Math.PI) / 180))),
                            ],
                            [
                                targetLocation.latitude + (targetLocation.radiusMiles / 69.0),
                                targetLocation.longitude + (targetLocation.radiusMiles / (69.0 * Math.cos((targetLocation.latitude * Math.PI) / 180))),
                            ],
                        ]}
                    />
                )}

                {targetLocation && (
                    <>
                        <Circle
                            center={{
                                latitude: targetLocation.latitude,
                                longitude: targetLocation.longitude,
                            }}
                            radius={targetLocation.radiusMiles * 1609.34}
                            strokeWidth={2}
                            strokeColor={`${theme.colors.background}50`}
                            fillColor="rgba(0,0,0,0)"
                        />

                        <Marker
                            coordinate={{
                                latitude: targetLocation.latitude,
                                longitude: targetLocation.longitude,
                            }}
                            title="Target Location"
                        >
                            <View
                                style={[
                                    styles.targetLocationMarker,
                                    {
                                        shadowColor: theme.colors.primaryText,
                                        backgroundColor: theme.colors.locationMarkerBackground,
                                    },
                                ]}
                            >
                                <SymbolView
                                    name="scope"
                                    size={MARKER_ICON_SIZE}
                                    type="hierarchical"
                                    tintColor={theme.colors.locatoinMarkerIconColor}
                                />
                            </View>
                        </Marker>
                    </>
                )}

                {getSavedLocations().map((location) => (
                    
                    <Marker
                        key={location.id}
                        coordinate={location.coordinate}
                        title={location.label}
                        description={location.address}
                    >
                        <View style={[styles.savedLocationMarker, { backgroundColor: location.color }]}>
                            <SymbolView
                                tintColor={theme.colors.coloredButtonText}
                                type="hierarchical"
                                name={location.icon}
                                size={MARKER_ICON_SIZE}
                            />
                        </View>
                    </Marker>
                ))} 

            </MapView>

            <MapLocationControl></MapLocationControl>

            <Animated.View style={[styles.buttonStack, buttonStyle]}>

                <CoinFlipButton
                    is3D={is3D}
                    onPress={handle3DToggle}
                    disabled={pickerVisible}
                />

                {targetLocation && 
                    <Pressable
                        style={[styles.button, { backgroundColor: theme.colors.secondaryBackground }]}
                        onPress={handleRecenter}
                        disabled={pickerVisible}
                    >
                        <SymbolView name="scope" size={20} tintColor={theme.colors.primaryText} />
                    </Pressable>
                }

                <Pressable
                    style={[styles.button, { backgroundColor: theme.colors.secondaryBackground }]}
                    onPress={openPicker}
                    disabled={pickerVisible}
                >
                    <SymbolView name="map.fill" size={20} tintColor={theme.colors.primaryText} />
                </Pressable>

            </Animated.View>

            {pickerVisible && <MapTypeModal />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    buttonStack: {
        position: "absolute",
        bottom: 160,
        right: 16,
        gap: 10,
        alignItems: "center",
    },
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
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
    savedLocationMarker: {
        width: MARKER_SIZE,
        height: MARKER_SIZE,

        borderRadius: 16,

        alignItems: "center",
        justifyContent: "center",

        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 3,
    },
    targetLocationMarker: {
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    }
});