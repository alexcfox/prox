export type TabItem = {
    label: string;
    symbol: string;
};

export type ReactNativeIosTabBarViewProps = {
    tabs: TabItem[];
    activeIndex: number;
    tintColor?: string;
    onTabChange?: (event: { nativeEvent: { index: number } }) => void;
    style?: object;
};