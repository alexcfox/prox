import { useTheme } from "@/theme/theme";
import Slider from "@react-native-community/slider";
import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

interface BudgetSliderProps {
    value: number;
    onChange: (value: number) => void;
    formatLabel: (value: number) => string;
    normalize: (value: number) => number; // real value -> 0-1
    denormalize: (normalized: number) => number; // 0-1 -> real value
    displayMin: number;
    displayMax: number;
    mode: string;
}

export default function BudgetSlider({
    value,
    onChange,
    formatLabel,
    normalize,
    denormalize,
    displayMin,
    displayMax,
    mode,
}: BudgetSliderProps) {
    const theme = useTheme();
    const [width, setWidth] = useState(0);
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        opacity.setValue(0);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [mode]);

    const normalizedValue = normalize(value);

    const handleChange = (normalized: number) => {
        onChange(denormalize(normalized));
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.valueLabel, { color: theme.colors.primaryText }]}>
                {formatLabel(value)}
            </Text>

            <Animated.View
                style={[styles.sliderWrapper, { opacity }]}
                onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
            >
                {width > 0 && (
                    <Slider
                        key={mode}
                        style={{ width }}
                        value={normalizedValue}
                        onValueChange={handleChange}
                        minimumValue={0}
                        maximumValue={1}
                        step={0.001}
                        minimumTrackTintColor={theme.colors.accent}
                        maximumTrackTintColor={theme.colors.mutedText}
                        thumbTintColor={theme.colors.accent}
                    />
                )}
            </Animated.View>

            <View style={styles.rangeLabels}>
                <Text style={[styles.rangeLabel, { color: theme.colors.secondaryText }]}>
                    {formatLabel(displayMin)}
                </Text>
                <Text style={[styles.rangeLabel, { color: theme.colors.secondaryText }]}>
                    {formatLabel(displayMax)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: "center" },
    valueLabel: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
    sliderWrapper: { width: "100%", height: 40 },
    rangeLabels: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: -4,
    },
    rangeLabel: { fontSize: 12 },
});