package expo.modules.iostabbar

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ReactNativeIosTabBarModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ReactNativeIosTabBar")

    View(ReactNativeIosTabBarView::class) {
    }
  }
}
