import ExpoModulesCore

public class ReactNativeIosTabBarModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ReactNativeIosTabBar")

        View(ReactNativeIosTabBarView.self) {
            Prop("tabs") { (view: ReactNativeIosTabBarView, tabs: [[String: String]]) in
                view.setTabs(tabs)
            }

            Prop("activeIndex") { (view: ReactNativeIosTabBarView, index: Int) in
                view.setActiveIndex(index)
            }

            Prop("tintColor") { (view: ReactNativeIosTabBarView, color: String) in
                view.setTintColor(color)
            }

            Events("onTabChange")
        }
    }
}