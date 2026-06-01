import { useTheme } from '@/theme/theme';
import { SymbolViewProps } from 'expo-symbols';
import React, { useState } from 'react';
import { View } from 'react-native';
import TabView from 'react-native-bottom-tabs';

type SFSymbol = SymbolViewProps['name'];

const renderScene = () => null;

const ROUTES = [
    { key: 'places',    title: 'Places',    focusedIcon: { sfSymbol: 'mappin.and.ellipse' as SFSymbol } },
    { key: 'preferences',  title: 'Preferences',  focusedIcon: { sfSymbol: 'slider.horizontal.3' as SFSymbol } },
    { key: 'financial',   title: 'Financials',   focusedIcon: { sfSymbol: 'dollarsign.circle.fill' as SFSymbol } },
    { key: 'favorites', title: 'Favorites', focusedIcon: { sfSymbol: 'heart.fill' as SFSymbol } },
];

export default function FloatingPillTabBar() {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    return (
        <View style={{ height: 83, backgroundColor: theme.colors.secondaryBackground }}>
            <TabView
                navigationState={{ index: activeTab, routes: ROUTES }}
                renderScene={() => null}
                onIndexChange={setActiveTab}
                sidebarAdaptable
                tabBarActiveTintColor={theme.colors.accent}
                tabBarStyle={{ backgroundColor: theme.colors.secondaryBackground }}
            />
        </View>
    );
}