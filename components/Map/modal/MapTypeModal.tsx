import { useMapPickerAnimation } from "@/hooks/useMapPickerAnimation";
import { useMapStore } from "@/stores/mapStore";
import { useTheme } from "@/theme/theme";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Animated from "react-native-reanimated";

type BaseType = "explore" | "satellite";

export default function MapTypeModal() {

    const theme = useTheme();
    const { baseType, setBaseType } = useMapStore();

  const { openPicker, closePicker, sheetStyle, backdropStyle } = useMapPickerAnimation();

  useEffect(() => {
    openPicker();
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={closePicker}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.secondaryBackground }]} />

        <View style={styles.sheetInner}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.colors.primaryText}]}>Map Type</Text>
            <Pressable onPress={closePicker} hitSlop={12} style={styles.closeButton}>
              <SymbolView name="xmark.circle.fill" size={26} tintColor={theme.colors.mutedText} />
            </Pressable>
          </View>

          <View style={styles.optionsRow}>
            {(["satellite", "explore"] as BaseType[]).map((type) => {
              const active = baseType === type;
              const label = type === "explore" ? "Explore" : "Satellite";
              const symbol = type === "explore" ? "map.fill" : "globe.americas.fill";

              return (
                <Pressable
                  key={type}
                  style={[styles.optionCard, { backgroundColor: theme.colors.mutedBackground }, active && { backgroundColor: theme.colors.background, borderColor: theme.colors.accent }]}
                  onPress={() => setBaseType(type)}
                >
                  <SymbolView
                    name={symbol}
                    size={28}
                    tintColor={active ? theme.colors.accent : theme.colors.mutedText}
                  />
                  <Text style={[styles.optionLabel, { color: theme.colors.mutedText }, active && { color: theme.colors.accent }]}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  sheetInner: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  closeButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  optionCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  toggleLabel: {
    fontSize: 17,
    fontWeight: "500",
  },
});