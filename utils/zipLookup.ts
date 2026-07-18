import zipCentroids from '@/assets/data/zip_centroids.json';

type ZipCentroids = Record<string, [number, number]>; // zip -> [lat, lng]

const centroids = zipCentroids as unknown as ZipCentroids;

// Grid bucket size in degrees. ~0.25° is roughly 17 miles at mid-latitudes,
// wide enough that every cell has neighbors, small enough to keep buckets tiny.
const GRID_SIZE = 0.25;

function gridKey(lat: number, lng: number): string {
    const gLat = Math.floor(lat / GRID_SIZE);
    const gLng = Math.floor(lng / GRID_SIZE);
    return `${gLat}:${gLng}`;
}

// Built once on first use, then reused for every lookup.
let gridIndex: Map<string, string[]> | null = null;

function buildGridIndex(): Map<string, string[]> {
    const index = new Map<string, string[]>();
    for (const zip in centroids) {
        const [lat, lng] = centroids[zip];
        const key = gridKey(lat, lng);
        const bucket = index.get(key);
        if (bucket) {
            bucket.push(zip);
        } else {
            index.set(key, [zip]);
        }
    }
    return index;
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3958.8; // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const rLat1 = (lat1 * Math.PI) / 180;
    const rLat2 = (lat2 * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Finds the nearest zip code to a given coordinate using a grid-bucketed
 * nearest-neighbor search. Checks the coordinate's own grid cell plus its
 * 8 neighbors, so it only compares against nearby candidates instead of
 * all ~41k zips.
 *
 * Returns null if no zip is found within the search radius (only possible
 * far offshore or in extremely sparse areas).
 */
export function getZipForCoordinate(lat: number, lng: number): string | null {
    if (!gridIndex) {
        gridIndex = buildGridIndex();
    }

    const gLat = Math.floor(lat / GRID_SIZE);
    const gLng = Math.floor(lng / GRID_SIZE);

    let nearestZip: string | null = null;
    let nearestDist = Infinity;

    for (let dLat = -1; dLat <= 1; dLat++) {
        for (let dLng = -1; dLng <= 1; dLng++) {
            const key = `${gLat + dLat}:${gLng + dLng}`;
            const bucket = gridIndex.get(key);
            if (!bucket) continue;

            for (const zip of bucket) {
                const [zLat, zLng] = centroids[zip];
                const dist = haversineMiles(lat, lng, zLat, zLng);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestZip = zip;
                }
            }
        }
    }

    return nearestZip;
}