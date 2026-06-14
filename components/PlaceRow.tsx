import { SymbolView } from "expo-symbols";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    type SharedValue
} from "react-native-reanimated";

import { useTheme } from "@/theme/theme";
import { SavedLocationGroup } from "@/types/location";

type Props = {
    group: SavedLocationGroup;
    onPress?: () => void;
    onDelete?: () => void;
    onSwipeStart?: () => void;
    onSwipeEnd?: () => void;
};

type RightActionsProps = {
    dragX: SharedValue<number>;
    onDelete?: () => void;
};

function DeleteAction({ dragX, onDelete }: RightActionsProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const dragAmount = Math.abs(dragX.value);

        const scale = interpolate(
            dragAmount,
            [0, 88, 120],
            [0.5, 1, 1.3],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            dragAmount,
            [0, 44],
            [0, 1],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <Pressable style={styles.deleteAction} onPress={onDelete}>
            <Animated.View style={[styles.deleteIconContainer, animatedStyle]}>
                <SymbolView
                    name="trash.fill"
                    size={20}
                    tintColor="white"
                />
            </Animated.View>
        </Pressable>
    );
}

export default function PlaceRow({
    group,
    onPress,
    onDelete,
    onSwipeEnd,
    onSwipeStart,
}: Props) {
    const theme = useTheme();
    const [isSwiping, setIsSwiping] = useState(false);

    const renderRightActions = useCallback(
        (_progress: SharedValue<number>, dragX: SharedValue<number>) => (
            <DeleteAction dragX={dragX} onDelete={onDelete} />
        ),
        [onDelete]
    );

    const backgroundProgress = useSharedValue(0);

    useEffect(() => {
        backgroundProgress.value = withTiming(
            isSwiping ? 1 : 0,
            { duration: 200 }
        );
    }, [isSwiping]);

    const animatedRowStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            backgroundProgress.value,
            [0, 1],
            [
                theme.colors.secondaryBackground,
                theme.colors.swipedTab,
            ]
        ),
    }));

    const locationCount = group.locations.length;

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={true}
            rightThreshold={40}
            onSwipeableOpenStartDrag={() => {
                setIsSwiping(true);
                onSwipeStart?.();
            }}
            onSwipeableClose={() => {
                setIsSwiping(false);
                onSwipeEnd?.();
            }}
        >
            <Animated.View style={[animatedRowStyle, styles.rowContainer]}>
                <Pressable
                    style={styles.container}
                    onPress={onPress}
                >
                    <View
                        style={[
                            styles.iconContainer,
                            {
                                backgroundColor:
                                    group.color
                            },
                        ]}
                    >
                        <SymbolView
                            name={group.icon}
                            size={24}
                            tintColor={theme.colors.coloredButtonText}
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text
                            style={[
                                styles.title,
                                { color: theme.colors.primaryText },
                            ]}
                        >
                            {group.label}
                        </Text>

                        {locationCount > 1 && (
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.subtitle,
                                    {
                                        color:
                                            theme.colors.secondaryText,
                                    },
                                ]}
                            >
                                {locationCount} locations
                            </Text>
                        )}
                    </View>
                </Pressable>
            </Animated.View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        minHeight: 68,
    },
    rowContainer: {
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
    },
    subtitle: {
        marginTop: 2,
        fontSize: 14,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 68,
        marginRight: 18,
    },
    deleteAction: {
        width: 88,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        alignItems: "center",
    },
});