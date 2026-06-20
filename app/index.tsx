import Map from "@/components/Map/Map";
import MapSheet from "@/components/Map/MapSheet";
import FloatingPillTabBar from "@/components/Shared/FloatingPillTabBar";
import { useHeatmapStore } from "@/stores/heatMapStore";
import { useMapStore } from "@/stores/mapStore";
import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTargetLocationStore } from "@/stores/targetLocationStore";
import { scoreGrid } from "@/utils/heatmap";
import { renderHeatmapToImage } from "@/utils/heatmapRenderer";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function HomeScreen() {
    const { pickerVisible } = useMapStore();

    const [isGenerating, setIsGenerating] = useState(false);

    const opacity = useSharedValue(1);
    const { savedLocationGroups } = useSavedLocationStore();
    const {  targetLocation } = useTargetLocationStore();
    const { setHeatmap } = useHeatmapStore();

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

    const handleGenerateHeatmap = async () => {
        if (!targetLocation) return;
        setIsGenerating(true);
        const cells = scoreGrid(targetLocation, savedLocationGroups);
        const imageUri = renderHeatmapToImage(cells, targetLocation, 1024, 1024);
        setHeatmap(cells, imageUri);
        setIsGenerating(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <Map />
            <Pressable style={styles.heatmapButton} onPress={handleGenerateHeatmap} disabled={isGenerating}>
                {isGenerating 
                    ? <ActivityIndicator size="small" color="white" />
                    : <Text style={styles.heatmapButtonText}>Find Neighborhoods</Text>
                }
            </Pressable>
            <MapSheet hidden={pickerVisible} />
            <Animated.View style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, animatedStyle]}>
                <FloatingPillTabBar />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    heatmapButton: {
        position: 'absolute',
        bottom: 160,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    heatmapButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
});