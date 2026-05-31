import ExpoModulesCore
import UIKit

class ReactNativeIosTabBarView: ExpoView, UITabBarControllerDelegate {
    private var tabBarController: UITabBarController?
    private var tabs: [[String: String]] = []
    private var tintColor: UIColor = .systemBlue
    var onTabChange: EventDispatcher? = nil

    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        setupTabBar()
    }

    private func setupTabBar() {
        let tbc = UITabBarController()
        tbc.delegate = self

        if #available(iOS 18.0, *) {
            tbc.mode = .tabSidebar
        }

        tabBarController = tbc
        addSubview(tbc.tabBar)
        tbc.tabBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
    }

    func setTabs(_ tabData: [[String: String]]) {
        tabs = tabData
        guard let tbc = tabBarController else { return }

        let viewControllers = tabData.map { tab -> UIViewController in
            let vc = UIViewController()
            let title = tab["label"] ?? ""
            let symbol = tab["symbol"] ?? "circle"
            vc.tabBarItem = UITabBarItem(
                title: title,
                image: UIImage(systemName: symbol),
                selectedImage: UIImage(systemName: symbol + ".fill")
            )
            return vc
        }

        tbc.viewControllers = viewControllers
        applyAppearance()
    }

    func setActiveIndex(_ index: Int) {
        tabBarController?.selectedIndex = index
    }

    func setTintColor(_ hex: String) {
        tintColor = UIColor(hex: hex) ?? .systemBlue
        applyAppearance()
    }

    private func applyAppearance() {
        guard let tbc = tabBarController else { return }
        let appearance = UITabBarAppearance()
        appearance.configureWithDefaultBackground()
        tbc.tabBar.tintColor = tintColor
        tbc.tabBar.standardAppearance = appearance
        tbc.tabBar.scrollEdgeAppearance = appearance
    }

    func tabBarController(_ tabBarController: UITabBarController, didSelect viewController: UIViewController) {
        onTabChange?(["index": tabBarController.selectedIndex])
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        tabBarController?.tabBar.frame = bounds
    }
}

extension UIColor {
    convenience init?(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.hasPrefix("#") ? String(hexSanitized.dropFirst()) : hexSanitized
        guard hexSanitized.count == 6, let rgb = UInt64(hexSanitized, radix: 16) else { return nil }
        self.init(
            red:   CGFloat((rgb >> 16) & 0xFF) / 255.0,
            green: CGFloat((rgb >> 8)  & 0xFF) / 255.0,
            blue:  CGFloat(rgb         & 0xFF) / 255.0,
            alpha: 1.0
        )
    }
}