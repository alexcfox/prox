import { useTheme } from "@/theme/theme";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import Places from "./Places/Places";

type Props = {
    hidden?: boolean;
};

export default function MapSheet({ hidden }: Props) {
    const theme = useTheme();
    
    const sheetRef = useRef<BottomSheet>(null);

    const animatedIndex = useSharedValue(1);

    const snapPoints = useMemo(
        () => [150, "92%"],
        []
    );

    const currentIndexRef = useRef(1);
    const [sheetIndex, setSheetIndex] = useState(0);
    const settledIndexRef = useRef(0);
    
    useEffect(() => {
        if (hidden) {
            sheetRef.current?.close();
        } else {
            sheetRef.current?.snapToIndex(
                currentIndexRef.current
            );
        }
    }, [hidden]);

    const animatedBackdropStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                animatedIndex.value,
                [1, 2],
                [0, 1]
            ),
        };
    });

    const handlePress = () => {
        sheetRef.current?.snapToIndex(1);
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
                enablePanDownToClose={hidden}
                keyboardBlurBehavior="restore"
                keyboardBehavior="interactive"
                animateOnMount
                onAnimate={(fromIndex, toIndex) => {
                    if (toIndex === 0) {
                        Keyboard.dismiss();
                    }
                }}
                onChange={(index) => {
                    if (index >= 0) {
                        currentIndexRef.current = index;
                        setSheetIndex(index);
                    }
                    if (index === 0) {
                        Keyboard.dismiss();
                    }
                }}
                handleIndicatorStyle={styles.handle}
                backgroundStyle={[
                    styles.background,
                    {
                        backgroundColor:
                            theme.colors.secondaryBackground,
                    },
                ]}
                handleComponent={() => (
                    <Pressable
                        onPress={handlePress}
                        style={styles.handleContainer}
                    >
                        <View style={styles.handle} />
                    </Pressable>
                )}
            >
                <Places    sheetIndex={sheetIndex} >
                </Places>
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
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handleContainer: {
        alignItems: "center",
        paddingTop: 12,
    },
    handle: {
        width: 36,
        height: 5,
        borderRadius: 999,
        backgroundColor: "#8E8E93",
    },
});