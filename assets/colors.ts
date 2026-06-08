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
        cancelRed: "#FF3B30",
        locationMarkerBackground: "#007AFF",
        locatoinMarkerIconColor: "#FFFFFF"
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
        cancelRed: "#FF3B30",
        locationMarkerBackground: "#007AFF",
        locatoinMarkerIconColor: "#FFFFFF"
    },
};

export const getColors = (scheme: ColorSchemeName) =>
  scheme === "dark" ? Colors.dark : Colors.light;

export const MARKER_COLORS = [
    "#FF3B30", // Red
    "#FF9500", // Orange
    "#FFCC00", // Yellow
    "#34C759", // Green
    "#00C7BE", // Teal
    "#007AFF", // Blue
    "#5856D6", // Purple
    "#AF52DE", // Violet
    "#FF2D55", // Pink
    "#FFFFFF", // White
];