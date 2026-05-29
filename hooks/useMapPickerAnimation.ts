import { useMapStore } from "@/stores/mapStore";
import {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const SHEET_DURATION = 300;
const SHEET_OFFSET = 280;

export function useMapPickerAnimation() {
  const storeClose = useMapStore((s) => s.closePicker);

  const slideY = useSharedValue(SHEET_OFFSET);
  const backdropOpacity = useSharedValue(0);

  const openPicker = () => {
    slideY.value = withTiming(0, { duration: SHEET_DURATION, easing: Easing.out(Easing.cubic) });
    backdropOpacity.value = withTiming(1, { duration: SHEET_DURATION });
  };

  const closePicker = () => {
    slideY.value = withTiming(SHEET_OFFSET, { duration: SHEET_DURATION, easing: Easing.in(Easing.cubic) });
    backdropOpacity.value = withTiming(0, { duration: SHEET_DURATION }, (finished) => {
      if (finished) runOnJS(storeClose)();
    });
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return { openPicker, closePicker, sheetStyle, backdropStyle };
}