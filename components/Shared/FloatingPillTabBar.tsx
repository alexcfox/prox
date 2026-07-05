import { SheetTabKey, useSheetTabStore } from '@/stores/sheetTabStore';
import { useTheme } from '@/theme/theme';
import { SymbolViewProps } from 'expo-symbols';
import React from 'react';
import { View } from 'react-native';
import TabView from 'react-native-bottom-tabs';

type SFSymbol = SymbolViewProps['name'];

const renderScene = () => null;

const ROUTES = [
    { key: 'places',    title: 'Places',    focusedIcon: { sfSymbol: 'mappin.and.ellipse' as SFSymbol } },
    { key: 'lifestyle',  title: 'Lifestyle',  focusedIcon: { sfSymbol: 'leaf.fill' as SFSymbol } },
    { key: 'budget',   title: 'Budget',   focusedIcon: { sfSymbol: 'dollarsign.circle.fill' as SFSymbol } },
    { key: 'favorites', title: 'Favorites', focusedIcon: { sfSymbol: 'heart.fill' as SFSymbol } },
];

export default function FloatingPillTabBar() {
    const theme = useTheme();
    const {activeTab, setActiveTab} = useSheetTabStore();
    const activeIndex = ROUTES.findIndex((route) => route.key === activeTab);
    
    return (
        <View style={{ height: 83, backgroundColor: theme.colors.secondaryBackground }}>
            <TabView
                navigationState={{ index: activeIndex, routes: ROUTES }}
                renderScene={() => null}
                onIndexChange={(index) => setActiveTab(ROUTES[index].key as SheetTabKey)}
                sidebarAdaptable
                tabBarActiveTintColor={theme.colors.accent}
                tabBarStyle={{ backgroundColor: theme.colors.secondaryBackground }}
            />
        </View>
    );
}