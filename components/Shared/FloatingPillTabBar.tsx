// components/FloatingPillTabBar.tsx
import { ReactNativeIosTabBarView, TabItem } from '@/modules/react-native-ios-tab-bar/src';
import { useTheme } from '@/theme/theme';
import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS: TabItem[] = [
    { label: 'Home',    symbol: 'house' },
    { label: 'Search',  symbol: 'magnifyingglass' },
    { label: 'Saved',   symbol: 'heart' },
    { label: 'Profile', symbol: 'person' },
];

export default function FloatingPillTabBar() {
    const theme = useTheme();
    const { bottom } = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const [activeTab, setActiveTab] = useState(0);

    return (
        <ReactNativeIosTabBarView
            tabs={TABS}
            activeIndex={activeTab}
            tintColor={theme.colors.accent}
            onTabChange={(e) => setActiveTab(e.nativeEvent.index)}
            style={{
                position: 'absolute',
                bottom: bottom,
                left: 0,
                right: 0,
                width: width,
                height: 80,
            }}
        />
    );
}