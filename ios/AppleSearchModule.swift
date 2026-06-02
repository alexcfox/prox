import Foundation
import React
import MapKit

@objc(AppleSearchModule)
class AppleSearchModule: RCTEventEmitter, MKLocalSearchCompleterDelegate {

    private var completer: MKLocalSearchCompleter!

    override init() {
        super.init()
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            self.completer = MKLocalSearchCompleter()
            self.completer.delegate = self
            self.completer.resultTypes = [.address, .pointOfInterest]
        }
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return ["searchResults"]
    }

    @objc
    func startSearch(_ query: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            if query.trimmingCharacters(in: .whitespaces).isEmpty {
                self.sendEvent(withName: "searchResults", body: [])
                return
            }
            self.completer.queryFragment = query
        }
    }

    @objc
    func clearSearch() {
        DispatchQueue.main.async { [weak self] in
            self?.completer.queryFragment = ""
        }
    }

    // MARK: - MKLocalSearchCompleterDelegate

    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        let results = completer.results.map { result in
            [
                "title": result.title,
                "subtitle": result.subtitle
            ]
        }
        sendEvent(withName: "searchResults", body: results)
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        print("🔴 completer error:", error)
        sendEvent(withName: "searchResults", body: [])
    }

    // MARK: - Resolve (keeps promise pattern, one-shot is fine here)

    @objc
    func resolve(
        _ title: String,
        subtitle: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async {
            let searchRequest = MKLocalSearch.Request()
            searchRequest.naturalLanguageQuery = "\(title) \(subtitle)"

            let search = MKLocalSearch(request: searchRequest)
            search.start { response, error in
                if let error = error {
                    reject("RESOLVE_ERROR", error.localizedDescription, error)
                    return
                }

                guard let item = response?.mapItems.first else {
                    reject("RESOLVE_EMPTY", "No results found", nil)
                    return
                }

                let result: [String: Any] = [
                    "name": item.name ?? title,
                    "address": subtitle,
                    "latitude": item.placemark.coordinate.latitude,
                    "longitude": item.placemark.coordinate.longitude,
                    "phoneNumber": item.phoneNumber ?? "",
                    "url": item.url?.absoluteString ?? "",
                    "pointOfInterestCategory": item.pointOfInterestCategory?.rawValue ?? "",
                    "street": item.placemark.thoroughfare ?? "",
                    "city": item.placemark.locality ?? "",
                    "state": item.placemark.administrativeArea ?? "",
                    "zip": item.placemark.postalCode ?? "",
                    "country": item.placemark.country ?? "",
                    "countryCode": item.placemark.isoCountryCode ?? "",
                ]

                resolve(result)
            }
        }
    }
}
