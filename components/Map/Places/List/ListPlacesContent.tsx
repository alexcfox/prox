import PlaceRow from "@/components/PlaceRow";
import AnimatedDivider from "@/components/Shared/AnimatedDivider";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import React, { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    savedLocations: any[];
    removeSavedLocation: (id: string) => void;
    swipingId: string | null;
    setSwipingId: (id: string | null) => void;
};

export default function ListPlacesContent({
    savedLocations,
    removeSavedLocation,
    swipingId,
    setSwipingId,
}: Props) {
    const theme = useTheme();

    return (
        <>
            {savedLocations.length === 0 ? (
                <View style={styles.emptyState}>
                    <View
                        style={[
                            styles.emptyIconContainer,
                            { backgroundColor: theme.colors.accent },
                        ]}
                    >
                        <SymbolView
                            name="mappin.and.ellipse"
                            size={32}
                            tintColor={theme.colors.coloredButtonText}
                        />
                    </View>

                    <Text
                        style={[
                            styles.emptyTitle,
                            { color: theme.colors.primaryText },
                        ]}
                    >
                        Add Your First Place
                    </Text>

                    <Text
                        style={[
                            styles.emptySubtitle,
                            { color: theme.colors.secondaryText },
                        ]}
                    >
                        Add the places that matter most to you. We'll use them to help find neighborhoods that fit your lifestyle.
                    </Text>
                </View>
            ) : (
                <View style={styles.placesList}>
                    {savedLocations.map((location, index) => {
                        const next = savedLocations[index + 1];

                        const hideDivider =
                            swipingId === location.id ||
                            swipingId === next?.id;

                        return (
                            <Fragment key={location.id}>
                                <PlaceRow
                                    location={location}
                                    onDelete={() =>
                                        removeSavedLocation(location.id)
                                    }
                                    onSwipeStart={() =>
                                        setSwipingId(location.id)
                                    }
                                    onSwipeEnd={() =>
                                        setSwipingId(null)
                                    }
                                />

                                {index < savedLocations.length - 1 && (
                                    <AnimatedDivider
                                        hidden={hideDivider}
                                        color={theme.colors.divider}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                </View>
            )}
        </>
    );
}


const styles = StyleSheet.create({
    placesList: {
        marginTop: 8,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginLeft: 68,
        marginRight: 100,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingTop: 24,
    },

    emptyIconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
    },

    emptySubtitle: {
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },
});