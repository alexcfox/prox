import PlaceRow from "@/components/PlaceRow";
import AnimatedDivider from "@/components/Shared/AnimatedDivider";
import { usePlacesSheetStore } from "@/stores/placesSheetStore";
import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import React, { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    swipingId: string | null;
    setSwipingId: (id: string | null) => void;
};

export default function ListPlacesContent({
    swipingId,
    setSwipingId,
}: Props) {

    const theme = useTheme();
    const { savedLocationGroups, removeSavedLocationGroup } = useSavedLocationStore();
    const { setPendingEditGroup, setPendingSavedLocation } = usePlacesSheetStore();

    return (
        <>
            {savedLocationGroups.length === 0 ? (
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
                    {savedLocationGroups.map((group, index) => {
                        const next = savedLocationGroups[index + 1];

                        const hideDivider =
                            swipingId === group.id ||
                            swipingId === next?.id;

                        return (
                            <Fragment key={group.id}>
                                <PlaceRow
                                    group={group}
                                    onPress={() => {
                                        setPendingEditGroup(group);
                                        setPendingSavedLocation(group.locations[0]);
                                    }}
                                    onDelete={() =>
                                        removeSavedLocationGroup(group.id)
                                    }
                                    onSwipeStart={() =>
                                        setSwipingId(group.id)
                                    }
                                    onSwipeEnd={() =>
                                        setSwipingId(null)
                                    }
                                />

                                {index < savedLocationGroups.length - 1 && (
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