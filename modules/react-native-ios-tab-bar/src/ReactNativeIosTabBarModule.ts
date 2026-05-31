import { NativeModule, requireNativeModule } from 'expo';

declare class ReactNativeIosTabBarModule extends NativeModule<{}> {}

export default requireNativeModule<ReactNativeIosTabBarModule>('ReactNativeIosTabBar');
