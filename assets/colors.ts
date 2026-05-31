import { ColorSchemeName } from "react-native";

export const Colors = {
    light: {
        background: "#FFFFFF",              
        secondaryBackground: "#F2F2F7",                    
        primaryText: "#1C1C1E",             
        secondaryText: "#8E8E93",           
        accent: "#494a67",              
        mutedBackground: "rgba(120,120,128,0.08)",
        mutedText: "#8E8E93",    
        border: "rgba(0,0,0,0.1)",
    },
    dark: {
        background: "#000000",         
        secondaryBackground: "#1C1C1E",                    
        primaryText: "#FFFFFF",             
        secondaryText: "#D1D1D6",           
        accent: "#494a67",        
        mutedBackground: "rgba(120,120,128,0.08)",
        mutedText: "#8E8E93",         
        border: "rgba(255,255,255,0.15)",
    },
};

export const getColors = (scheme: ColorSchemeName) =>
  scheme === "dark" ? Colors.dark : Colors.light;
