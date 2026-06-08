import Foundation
import React
import MapKit
import CoreLocation

@objc(AppleSearchModule)
class AppleSearchModule: RCTEventEmitter, MKLocalSearchCompleterDelegate {

    private var completer: MKLocalSearchCompleter!
    private var currentContext: String = ""
    private let geocoder = CLGeocoder()

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

    // MARK: - Helpers

    private func resolveResultTypes(_ types: [String]) -> MKLocalSearchCompleter.ResultType {
        var result: MKLocalSearchCompleter.ResultType = []
        if types.contains("address") { result.insert(.address) }
        if types.contains("pointOfInterest") { result.insert(.pointOfInterest) }
        return result.isEmpty ? [.address, .pointOfInterest] : result
    }

    private func radiusToSpan(radiusMeters: Double) -> MKCoordinateSpan {
        let delta = (radiusMeters / 111_000) * 2
        return MKCoordinateSpan(latitudeDelta: delta, longitudeDelta: delta)
    }

    // MARK: - Completer Search (region-biased)

    @objc
    func startSearch(
        _ query: String,
        latitude: Double,
        longitude: Double,
        radiusMeters: Double,
        resultTypes: [String],
        context: String
    ) {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }

            if query.trimmingCharacters(in: .whitespaces).isEmpty {
                self.sendEvent(withName: "searchResults", body: ["context": context, "results": []])
                return
            }

            self.currentContext = context
            self.completer.resultTypes = self.resolveResultTypes(resultTypes)

            let center = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
            let span = self.radiusToSpan(radiusMeters: radiusMeters)
            self.completer.region = MKCoordinateRegion(center: center, span: span)
            self.completer.queryFragment = query
        }
    }

    // MARK: - Completer Search (unbiased)

    @objc
    func startSearchUnbiased(_ query: String, resultTypes: [String], context: String) {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }

            if query.trimmingCharacters(in: .whitespaces).isEmpty {
                self.sendEvent(withName: "searchResults", body: ["context": context, "results": []])
                return
            }

            self.currentContext = context
            self.completer.resultTypes = self.resolveResultTypes(resultTypes)
            self.completer.region = MKCoordinateRegion(.world)
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
        sendEvent(withName: "searchResults", body: ["context": currentContext, "results": results])
    }

    func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        print("🔴 completer error:", error)
        sendEvent(withName: "searchResults", body: ["context": currentContext, "results": []])
    }

    // MARK: - Resolve (CLGeocoder only, separate rate limit from MKLocalSearch)

    @objc
    func resolve(
        _ title: String,
        subtitle: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        let query = subtitle.isEmpty ? title : "\(title) \(subtitle)"

        geocoder.geocodeAddressString(query) { placemarks, error in
            if let error = error {
                reject("RESOLVE_ERROR", error.localizedDescription, error)
                return
            }

            guard let placemark = placemarks?.first,
                  let location = placemark.location else {
                reject("RESOLVE_EMPTY", "No results found", nil)
                return
            }

            let result: [String: Any] = [
                "name": title,
                "address": subtitle,
                "latitude": location.coordinate.latitude,
                "longitude": location.coordinate.longitude,
                "phoneNumber": "",
                "url": "",
                "pointOfInterestCategory": "",
                "street": placemark.thoroughfare ?? "",
                "city": placemark.locality ?? "",
                "state": placemark.administrativeArea ?? "",
                "zip": placemark.postalCode ?? "",
                "country": placemark.country ?? "",
                "countryCode": placemark.isoCountryCode ?? "",
            ]

            resolve(result)
        }
    }

    // MARK: - Search By Name (promise-based, for duplicate location check)

    @objc
    func searchByName(
        _ query: String,
        latitude: Double,
        longitude: Double,
        radiusMeters: Double,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async {
            let center = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
            let span = self.radiusToSpan(radiusMeters: radiusMeters)
            let region = MKCoordinateRegion(center: center, span: span)

            let searchRequest = MKLocalSearch.Request()
            searchRequest.naturalLanguageQuery = query
            searchRequest.region = region

            let search = MKLocalSearch(request: searchRequest)
            search.start { response, error in
                if let error = error {
                    reject("SEARCH_BY_NAME_ERROR", error.localizedDescription, error)
                    return
                }

                guard let mapItems = response?.mapItems else {
                    resolve([])
                    return
                }

                let results: [[String: Any]] = mapItems.map { item in
                    [
                        "name": item.name ?? "",
                        "address": item.placemark.title ?? "",
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
                }

                resolve(results)
            }
        }
    }

    // MARK: - Category Search

    @objc
    func searchCategory(
        _ category: String,
        latitude: Double,
        longitude: Double,
        radius: Double,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        DispatchQueue.main.async {
            let center = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)

            let request = MKLocalPointsOfInterestRequest(center: center, radius: radius)

            switch category {
            case "foodMarket":
                request.pointOfInterestFilter = MKPointOfInterestFilter(including: [.foodMarket])
            case "cafe":
                request.pointOfInterestFilter = MKPointOfInterestFilter(including: [.cafe])
            case "restaurant":
                request.pointOfInterestFilter = MKPointOfInterestFilter(including: [.restaurant])
            case "gasStation":
                request.pointOfInterestFilter = MKPointOfInterestFilter(including: [.gasStation])
            case "pharmacy":
                request.pointOfInterestFilter = MKPointOfInterestFilter(including: [.pharmacy])
            default:
                resolve([])
                return
            }

            let search = MKLocalSearch(request: request)
            search.start { response, error in
                if let error = error {
                    reject("CATEGORY_SEARCH_ERROR", error.localizedDescription, error)
                    return
                }

                guard let mapItems = response?.mapItems else {
                    resolve([])
                    return
                }

                let results: [[String: Any]] = mapItems.map { item in
                    [
                        "name": item.name ?? "",
                        "address": item.placemark.title ?? "",
                        "latitude": item.placemark.coordinate.latitude,
                        "longitude": item.placemark.coordinate.longitude,
                    ]
                }

                resolve(results)
            }
        }
    }
}
