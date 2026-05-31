import { useTheme } from "@/theme/theme";
import { MapTab } from "@/types/Map";
import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
type Props = {
    selectedTab: MapTab;
    onSelect: (tab: MapTab) => void;
};

const tabs: {
    key: MapTab;
    title: string;
}[] = [
    {
        key: "explore",
        title: "Explore",
    },
    {
        key: "preferences",
        title: "Prefs",
    },
    {
        key: "financials",
        title: "Finance",
    },
    {
        key: "favorites",
        title: "Favs",
    },
];

export default function MapTabBar({
    selectedTab,
    onSelect,
}: Props) {
    const theme = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.colors.secondaryBackground,
                },
            ]}
        >
            {tabs.map((tab) => {
                const selected =
                    selectedTab === tab.key;

                return (
                    <Pressable
                        key={tab.key}
                        onPress={() =>
                            onSelect(tab.key)
                        }
                        style={[
                            styles.tab,
                            selected && {
                                backgroundColor:
                                    theme.colors.accent,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: selected
                                        ? "#FFFFFF"
                                        : theme.colors.primaryText,
                                },
                            ]}
                        >
                            {tab.title}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        position: "absolute",

        left: 16,
        right: 16,

        bottom: 32,

        height: 72,

        borderRadius: 36,

        zIndex: 1000,
    },

    tab: {
        paddingHorizontal: 14,
        paddingVertical: 8,

        borderRadius: 999,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
    },
});