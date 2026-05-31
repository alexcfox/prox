import { registerWebModule, NativeModule } from 'expo';

class ReactNativeIosTabBarModule extends NativeModule<{}> {}

export default registerWebModule(ReactNativeIosTabBarModule, 'ReactNativeIosTabBarModule');
