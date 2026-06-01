import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type Props = {
    hidden: boolean;
    color: string;
    marginLeft?: number;
    marginRight?: number;
};

export default function AnimatedDivider({
    hidden,
    color,
    marginLeft = 68,
    marginRight = 18,
}: Props) {
    const opacity = useSharedValue(hidden ? 0 : 1);

    useEffect(() => {
        opacity.value = withTiming(
            hidden ? 0 : 1,
            {
                duration: hidden ? 0 : 400,
            }
        );
    }, [hidden]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.divider,
                {
                    backgroundColor: color,
                    marginLeft,
                    marginRight,
                },
                animatedStyle,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    divider: {
        height: StyleSheet.hairlineWidth,
    },
});