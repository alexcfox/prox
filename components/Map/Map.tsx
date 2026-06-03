import { useMapSheetStore } from "@/stores/mapSheetStore";
import { useMapStore } from "@/stores/mapStore";
import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { MapType, Marker } from "react-native-maps";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CoinFlipButton from "../Shared/CoinFlipButton";
import MapTypeModal from "./modal/MapTypeModal";

type BaseType = "explore" | "satellite";

const BASE_MAP: Record<BaseType, { type: MapType }> = {
    explore: { type: "standard" },
    satellite: { type: "hybridFlyover" },
};

const ALTITUDE: number = 10000; 

export default function Map() {

    // const [cameraStats, setCameraStats] = useState<{ altitude?: number; pitch?: number } | null>({ altitude: 6500, pitch: 0 });
    
    const {
        selectedTab,
        setSelectedTab,
    } = useMapSheetStore();
	
    const { getSavedLocations } = useSavedLocationStore();

	const hasInitialRecentered = useRef(false);

    const theme = useTheme();
    const { baseType, pickerVisible, openPicker, mapRef, setUserLocation, userLocation } = useMapStore();

    const mapType = BASE_MAP[baseType];

    const buttonOpacity = useSharedValue(pickerVisible ? 0 : 1);

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
		if (!userLocation || !mapRef.current) return;

		mapRef.current?.animateCamera(
			{
				center: {
					latitude: userLocation.latitude,
					longitude: userLocation.longitude,
				},
				heading: 0,
				altitude: ALTITUDE,
			},
            { duration: 700 }
		);
	};

    // useEffect(() => {
    //     const test = async () => {
    //         try {
    //             const { AppleSearchModule } = NativeModules;

    //             const result = await AppleSearchModule.search("Trader Joe's");

    //             console.log("RESULT", result);
    //         } catch (error) {
    //             console.log("ERROR", error);
    //         }
    //     };

    //     test();
    // }, []);

    return (
        <View style={styles.container}>
            <MapView
                mapPadding={{ bottom: 110, top: 0, left: 0, right: 0 }}
                style={styles.map}
                mapType={mapType.type}
                ref={mapRef}
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
                {getSavedLocations().map((location) => (
                    <Marker
                        key={location.id}
                        coordinate={location.coordinate}
                        title={location.label}
                        description={location.address}
                    >
                        <View style={[styles.savedLocationMarker, { shadowColor: theme.colors.primaryText, backgroundColor: theme.colors.secondaryBackground}]}>
                            <SymbolView
                                tintColor={theme.colors.primaryText}
                                type="hierarchical"
                                name={location.icon}
                                size={20}
                            />
                        </View>
                    </Marker>
                ))}  
            </MapView>

            <Animated.View style={[styles.buttonStack, buttonStyle]}>

                <CoinFlipButton
                    is3D={is3D}
                    onPress={handle3DToggle}
                    disabled={pickerVisible}
                />

                <Pressable
                    style={[styles.button, { backgroundColor: theme.colors.secondaryBackground }]}
                    onPress={handleRecenter}
                    disabled={pickerVisible}
                >
                    <SymbolView name="location.fill" size={20} tintColor={theme.colors.primaryText} />
                </Pressable>

                <Pressable
                    style={[styles.button, { backgroundColor: theme.colors.secondaryBackground }]}
                    onPress={openPicker}
                    disabled={pickerVisible}
                >
                    <SymbolView name="map.fill" size={20} tintColor={theme.colors.primaryText} />
                </Pressable>

            </Animated.View>

            {pickerVisible && <MapTypeModal />}

            {/* {cameraStats && (
                <View style={styles.debugOverlay}>
                    <Text style={styles.debugText}>alt: {cameraStats.altitude?.toFixed(0)}</Text>
                    <Text style={styles.debugText}>pitch: {cameraStats.pitch?.toFixed(1)}</Text>
                </View>
            )} */}
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
        width: 32,
        height: 32,

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
});