import { useMapSheetStore } from "@/stores/mapSheetStore";
import { useTheme } from "@/theme/theme";
import BottomSheet, {
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import {
    Pressable,
    StyleSheet,
    View
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import MapTabBar from "./MapTabBar";

export default function MapSheet() {

    const theme = useTheme();

    const sheetRef = useRef<BottomSheet>(null);

    const animatedIndex = useSharedValue(0);

    const {
        selectedTab,
        setSelectedTab,
    } = useMapSheetStore();

    const snapPoints = useMemo(
        () => [90, "38%", "92%"],
        []
    );

    const currentIndexRef = useRef(0);

    const animatedBackdropStyle =
        useAnimatedStyle(() => ({
            opacity: interpolate(
                animatedIndex.value,
                [0, 1],
                [0, 1]
            ),
        }));

    const handlePress = () => {
        sheetRef.current?.snapToIndex(
            currentIndexRef.current === 0
                ? 1
                : 0
        );
    };

    return (
        <>
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.backdrop,
                    animatedBackdropStyle,
                ]}
            />

            <BottomSheet
                ref={sheetRef}
                animatedIndex={animatedIndex}
                index={0}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose={false}
                animateOnMount
                onChange={(index) => {
                    currentIndexRef.current = index;
                }}
                handleComponent={() => (
                    <Pressable
                        onPress={handlePress}
                        style={styles.handleContainer}
                    >
                        <View style={styles.handle} />
                    </Pressable>
                )}
                backgroundStyle={[
                    styles.background,
                    {
                        backgroundColor:
                            theme.colors.secondaryBackground,
                    },
                ]}
            >
                <BottomSheetScrollView
                    contentContainerStyle={
                        styles.content
                    }
                >
                    <MapTabBar
                        selectedTab={selectedTab}
                        onSelect={setSelectedTab}
                    />
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.25)",
    },

    background: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },

    header: {
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 8,
    },

    pill: {
        minHeight: 44,

        paddingHorizontal: 20,

        borderRadius: 22,

        alignItems: "center",
        justifyContent: "center",

        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 4,
    },

    content: {
        paddingBottom: 150,
    },
    handleContainer: {
        alignItems: "center",
        paddingVertical: 12,
    },
    handle: {
        width: 36,
        height: 5,
        borderRadius: 999,
        backgroundColor: "#8E8E93",
    },
});