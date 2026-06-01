import { useSavedLocationStore } from "@/stores/savedLocationStore";
import { useTheme } from "@/theme/theme";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AddPlacesContent from "./Add/AddPlacesContent";
import AddPlacesHeader from "./Add/AddPlacesHeader";
import ListPlacesContent from "./List/ListPlacesContent";
import ListPlacesHeader from "./List/ListPlacesHeader";

type SheetMode = "list" | "add";

type Props = {
    sheetIndex: number;
    expandSheet: () => void;
};

export default function Places({ sheetIndex, expandSheet }: Props) {

    const theme = useTheme();

    const { savedLocations, removeSavedLocation } = useSavedLocationStore();
    const [sheetMode, setSheetMode] = useState<SheetMode>("list");
    const [swipingId, setSwipingId] = useState<string | null>(null);

    useEffect(() => {
        if (sheetIndex === 0) {
            setSheetMode("list");
        }
    }, [sheetIndex]);

    return (
        <View style={{ flex: 1 }}>
            {sheetMode === "list" ? (
                <ListPlacesHeader sheetIndex={sheetIndex} expandSheet={expandSheet} setSheetMode={setSheetMode} />
            ) : (
                <AddPlacesHeader setSheetMode={setSheetMode} />
            )}
            
            <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {sheetMode === "list" ? (
                    <ListPlacesContent
                        savedLocations={savedLocations}
                        removeSavedLocation={removeSavedLocation}
                        swipingId={swipingId}
                        setSwipingId={setSwipingId}
                    />
                ) : (
                    <AddPlacesContent />
                )}
            </BottomSheetScrollView>
        </View>
    );
}