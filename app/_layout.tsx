import { ThemeProvider } from "@/theme/theme";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}



const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});