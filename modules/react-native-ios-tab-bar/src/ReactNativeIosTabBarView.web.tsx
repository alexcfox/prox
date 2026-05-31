import * as React from 'react';

import { ReactNativeIosTabBarViewProps } from './ReactNativeIosTabBar.types';

export default function ReactNativeIosTabBarView(_props: ReactNativeIosTabBarViewProps) {
  return (
    <div
      style={{
        backgroundColor: '#aabbcc',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <span>ReactNativeIosTabBar - native view</span>
    </div>
  );
}
