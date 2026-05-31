import { requireNativeView } from 'expo';
import * as React from 'react';

import { ReactNativeIosTabBarViewProps } from './ReactNativeIosTabBar.types';

const NativeView: React.ComponentType<ReactNativeIosTabBarViewProps> =
    requireNativeView('ReactNativeIosTabBar');

export default function ReactNativeIosTabBarView(props: ReactNativeIosTabBarViewProps) {
    return <NativeView {...props} />;
}