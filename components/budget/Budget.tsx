import { useBudgetStore } from "@/stores/budgetStore";
import { useTheme } from "@/theme/theme";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BudgetHeader from "./BudgetHeader";
import BudgetSlider from "./BudgetSlider";

const BUY_MIN = 100000;
const BUY_MID = 1000000;
const BUY_MAX = 5000000;
const BUY_STEP_LOW = 25000;
const BUY_STEP_HIGH = 100000;

const RENT_MIN = 1000;
const RENT_MAX = 10000;
const RENT_STEP = 500;

function normalizeBuy(value: number) {
    if (value <= BUY_MID) {
        return ((value - BUY_MIN) / (BUY_MID - BUY_MIN)) * 0.5;
    }
    return 0.5 + ((value - BUY_MID) / (BUY_MAX - BUY_MID)) * 0.5;
}

function denormalizeBuy(normalized: number) {
    if (normalized <= 0.5) {
        const real = BUY_MIN + (normalized / 0.5) * (BUY_MID - BUY_MIN);
        return Math.round(real / BUY_STEP_LOW) * BUY_STEP_LOW;
    }
    const real = BUY_MID + ((normalized - 0.5) / 0.5) * (BUY_MAX - BUY_MID);
    return Math.round(real / BUY_STEP_HIGH) * BUY_STEP_HIGH;
}

function normalizeRent(value: number) {
    return (value - RENT_MIN) / (RENT_MAX - RENT_MIN);
}

function denormalizeRent(normalized: number) {
    const real = RENT_MIN + normalized * (RENT_MAX - RENT_MIN);
    return Math.round(real / RENT_STEP) * RENT_STEP;
}

export default function BudgetSheet() {
    const theme = useTheme();
    const { mode, setMode, maxHomePrice, setMaxHomePrice, maxRent, setMaxRent } = useBudgetStore();

    const isBuy = mode === "buy";

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <BudgetHeader />
            </View>

            <BottomSheetScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.segmentedControl}>
                    <Pressable
                        onPress={() => setMode("buy")}
                        style={[
                            styles.segmentButton,
                            isBuy && { backgroundColor: theme.colors.accent },
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentButtonText,
                                { color: isBuy ? theme.colors.coloredButtonText : theme.colors.primaryText },
                            ]}
                        >
                            Buy
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setMode("rent")}
                        style={[
                            styles.segmentButton,
                            !isBuy && { backgroundColor: theme.colors.accent },
                        ]}
                    >
                        <Text
                            style={[
                                styles.segmentButtonText,
                                { color: !isBuy ? theme.colors.coloredButtonText : theme.colors.primaryText },
                            ]}
                        >
                            Rent
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.inputSection}>
                    <Text style={[styles.inputLabel, { color: theme.colors.primaryText }]}>
                        {isBuy ? "Max Home Price" : "Max Monthly Rent"}
                    </Text>

                    <BudgetSlider
                        value={isBuy ? maxHomePrice : maxRent}
                        onChange={isBuy ? setMaxHomePrice : setMaxRent}
                        normalize={isBuy ? normalizeBuy : normalizeRent}
                        denormalize={isBuy ? denormalizeBuy : denormalizeRent}
                        displayMin={isBuy ? BUY_MIN : RENT_MIN}
                        displayMax={isBuy ? BUY_MAX : RENT_MAX}
                        formatLabel={(v) =>
                            isBuy ? `$${v.toLocaleString()}` : `$${v.toLocaleString()}/mo`
                        }
                        mode={mode}
                    />
                </View>
            </BottomSheetScrollView>

            <Pressable
                onPress={() => {/* trigger heatmap re-score */ }}
                style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
            >
                <Text style={[styles.saveButtonText, { color: theme.colors.coloredButtonText }]}>
                    Apply
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 50,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    segmentedControl: {
        flexDirection: "row",
        backgroundColor: "rgba(120,120,128,0.12)",
        borderRadius: 10,
        padding: 2,
        marginTop: 8,
    },
    segmentButton: {
        flex: 1,
        height: 36,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },
    inputSection: {
        marginTop: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 12,
    },
    saveButton: {
        margin: 16,
        height: 50,
        borderRadius: 36,
        marginBottom: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});