import Foundation
import React
import MapKit

@objc(AppleSearchModule)
class AppleSearchModule: NSObject, MKLocalSearchCompleterDelegate {

    private var completer: MKLocalSearchCompleter!
    private var pendingResolve: RCTPromiseResolveBlock?
    private var pendingReject: RCTPromiseRejectBlock?
    private var timeoutTimer: Timer?

    override init() {
        super.init()
        completer = MKLocalSearchCompleter()
        completer.delegate = self
        completer.resultTypes = [.address, .pointOfInterest]
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func hello(
        _ resolve: RCTPromiseResolveBlock,
        rejecter reject: RCTPromiseRejectBlock
    ) {
        resolve("Hello from Swift")
    }

    @objc
    func search(
        _ query: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        cancelPending()

        pendingResolve = resolve
        pendingReject = reject

        DispatchQueue.main.async { [weak self] in
            guard let self else { return }

            self.timeoutTimer = Timer.scheduledTimer(withTimeInterval: 10.0, repeats: false) { [weak self] _ in
                self?.pendingReject?("TIMEOUT", "Search timed out", nil)
                self?.pendingResolve = nil
                self?.pendingReject = nil
            }

            self.completer.queryFragment = query
        }
    }

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

    // MARK: - MKLocalSearchCompleterDelegate

    func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        print("🟢 delegate fired, result count:", completer.results.count)

        timeoutTimer?.invalidate()
        timeoutTimer = nil

        let results = completer.results.map { result in
            [
                "title": result.title,
                "subtitle": result.subtitle
            ]
        }

        pendingResolve?(results)
        pendingResolve = nil
        pendingReject = nil
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        print("🔴 completer error:", error)

        timeoutTimer?.invalidate()
        timeoutTimer = nil

        pendingReject?("SEARCH_ERROR", error.localizedDescription, error)
        pendingResolve = nil
        pendingReject = nil
    }

    // MARK: - Helpers

    private func cancelPending() {
        timeoutTimer?.invalidate()
        timeoutTimer = nil
        pendingResolve?([])
        pendingResolve = nil
        pendingReject = nil
    }
}
