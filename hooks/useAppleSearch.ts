import { milesToMeters } from "@/stores/targetLocationStore";
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

const { AppleSearchModule } = NativeModules;
const emitter = new NativeEventEmitter(AppleSearchModule);

let debounceTimer: ReturnType<typeof setTimeout>;

export function useAppleSearch(region: SearchRegion | null) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const sub = emitter.addListener("searchResults", (data: SearchResult[]) => {
            setResults(data);
        });
        return () => {
            sub.remove();
            AppleSearchModule.clearSearch();
        };
    }, []);

    const search = (text: string) => {
        setQuery(text);
        clearTimeout(debounceTimer);

        if (!text.trim()) {
            setResults([]);
            AppleSearchModule.clearSearch();
            return;
        }

        if (!region) {
            console.warn("useAppleSearch: no region set, skipping search");
            return;
        }

        debounceTimer = setTimeout(() => {
            AppleSearchModule.startSearch(
                text,
                region.latitude,
                region.longitude,
                milesToMeters(region.radiusMiles)
            );
        }, 150);
    };

    return { query, results, search };
}
