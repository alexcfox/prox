import Map from "@/components/Map/Map";
import MapSheet from "@/components/Map/MapSheet";
import FloatingPillTabBar from "@/components/Shared/FloatingPillTabBar";
import { useMapStore } from "@/stores/mapStore";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function HomeScreen() {
    const { pickerVisible } = useMapStore();

    const opacity = useSharedValue(1);

    useEffect(() => {
        if (pickerVisible) {
            opacity.value = withTiming(0, { duration: 0 });
        } else {
            opacity.value = withTiming(1, { duration: 400 });
        }
    }, [pickerVisible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View style={{ flex: 1 }}>
            <Map />
            <MapSheet hidden={pickerVisible} />
            <Animated.View style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, animatedStyle]}>
                <FloatingPillTabBar />
            </Animated.View>
        </View>
    );
}