import { useTheme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";

interface CoinFlipButtonProps {
	is3D: boolean;
	onPress: () => void;
	disabled?: boolean;
}

export default function CoinFlipButton({ is3D, onPress, disabled }: CoinFlipButtonProps) {
	const theme = useTheme();
	const [label, setLabel] = useState(is3D ? "2D" : "3D");
	const scaleX = useSharedValue(1);

    const swapLabel = () => {
        setLabel(is3D ? "3D" : "2D");
    };

	const handlePress = () => {
		scaleX.value = withSequence(
			withTiming(0, { duration: 150 }, (finished) => {
				if (finished) runOnJS(swapLabel)();
			}),
			withTiming(1, { duration: 150 })
		);
		onPress();
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scaleX: scaleX.value }],
	}));

    useEffect(() => {
        scaleX.value = withSequence(
            withTiming(0, { duration: 150 }, (finished) => {
                if (finished) runOnJS(setLabel)(is3D ? "2D" : "3D");
            }),
            withTiming(1, { duration: 150 })
        );
    }, [is3D]);
    
    return (
        <Animated.View style={[styles.container, { backgroundColor: theme.colors.secondaryBackground }, animatedStyle]}>
            <Pressable
                onPress={handlePress}
                disabled={disabled}
                style={[StyleSheet.absoluteFill, styles.face]}
            >
                <Text style={[styles.label, { color: theme.colors.primaryText }]}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
	container: {
		width: 42,
		height: 42,
		borderRadius: 21,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
	},
	face: {
		borderRadius: 21,
		alignItems: "center",
		justifyContent: "center",
	},
	label: {
		fontSize: 13,
		fontWeight: "700",
	},
});