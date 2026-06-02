import { useEffect, useState } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

export interface SearchResult {
    title: string;
    subtitle: string;
}

const { AppleSearchModule } = NativeModules;
const emitter = new NativeEventEmitter(AppleSearchModule);

let debounceTimer: ReturnType<typeof setTimeout>;

export function useAppleSearch() {
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

        debounceTimer = setTimeout(() => {
            AppleSearchModule.startSearch(text);
        }, 150); // shorter debounce since no promise overhead
    };

    return { query, results, search };
}