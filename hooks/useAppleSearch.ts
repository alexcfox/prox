import { milesToMeters } from "@/utils/geo";
import { useEffect, useState } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

export interface SearchResult {
    title: string;
    subtitle: string;
}

export interface SearchRegion {
    latitude: number;
    longitude: number;
    radiusMiles: number;
}

export type SearchResultType = "address" | "pointOfInterest";

const { AppleSearchModule } = NativeModules;
const emitter = new NativeEventEmitter(AppleSearchModule);

let debounceTimer: ReturnType<typeof setTimeout>;

export function useAppleSearch(region: SearchRegion | null, context: string) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const sub = emitter.addListener("searchResults", (data: { context: string; results: SearchResult[] }) => {
            if (data.context !== context) return;
            setResults(data.results);
        });
        return () => {
            sub.remove();
            AppleSearchModule.clearSearch();
        };
    }, [context]);

    const search = (
        text: string,
        resultTypes: SearchResultType[] = ["address", "pointOfInterest"]
    ) => {
        setQuery(text);
        clearTimeout(debounceTimer);

        if (!text.trim()) {
            setResults([]);
            AppleSearchModule.clearSearch();
            return;
        }

        debounceTimer = setTimeout(() => {
            if (region) {
                AppleSearchModule.startSearch(
                    text,
                    region.latitude,
                    region.longitude,
                    milesToMeters(region.radiusMiles),
                    resultTypes,
                    context
                );
            } else {
                AppleSearchModule.startSearchUnbiased(text, resultTypes, context);
            }
        }, 150);
    };

    return { query, results, search };
}