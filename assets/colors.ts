import { ColorSchemeName } from "react-native";

const ACCENT = "#2b9348";

export const Colors = {
    light: {
        background: "#FFFFFF",              
        secondaryBackground: "#F2F2F7",                    
        primaryText: "#1C1C1E",             
        secondaryText: "#8E8E93",           
        accent: ACCENT,              
        mutedBackground: "#78788014",
        mutedText: "#8E8E93",    
        border: "rgba(0,0,0,0.1)",
        coloredButtonText: "#FFFFFF",
        divider: "#000000",
        swipedTab: "#E8E8ED",
        cancelRed: "#FF3B30"
    },
    dark: {
        background: "#000000",         
        secondaryBackground: "#1C1C1E",                    
        primaryText: "#FFFFFF",             
        secondaryText: "#D1D1D6",           
        accent: ACCENT,        
        mutedBackground: "rgba(120,120,128,0.08)",
        mutedText: "#8E8E93",         
        border: "rgba(255,255,255,0.15)",
        coloredButtonText: "#000000",
        divider: "#FFFFFF",
        swipedTab: "#252527",
        cancelRed: "#FF3B30"
    },
};

export const getColors = (scheme: ColorSchemeName) =>
  scheme === "dark" ? Colors.dark : Colors.light;
