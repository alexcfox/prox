// SearchCategoriesLoadingContent.tsx

import { useTheme } from "@/theme/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
    categoryTitle?: string;
};

export default function SearchCategoriesLoadingContent({
    categoryTitle,
}: Props) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <ActivityIndicator
                size="large"
                color={theme.colors.accent}
            />

            <Text
                style={[
                    styles.title,
                    { color: theme.colors.primaryText },
                ]}
            >
                Searching {categoryTitle ?? "Places"}...
            </Text>

            <Text
                style={[
                    styles.subtitle,
                    { color: theme.colors.secondaryText },
                ]}
            >
                Finding locations in the current map area
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingTop: 100,
    },
    title: {
        marginTop: 16,
        fontSize: 17,
        fontWeight: "600",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        textAlign: "center",
    },
});