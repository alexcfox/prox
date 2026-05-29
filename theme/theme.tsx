import { Colors, getColors } from "@/assets/colors";
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext({
  colors: Colors.light,
  scheme: "light" as "light" | "dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme() ?? "light";
  const colors = getColors(scheme);

  return (
    <ThemeContext.Provider value={{ colors, scheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
