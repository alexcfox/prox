/**
 * Splits a region into a 4x4 grid of overlapping sub-regions plus
 * 8 perimeter tiles evenly spaced around the edge of the radius circle.
 * Total: 24 tiles. Provides good interior coverage and catches edge results.
 */
export function getTileRegions(
    latitude: number,
    longitude: number,
    radiusMiles: number
): { latitude: number; longitude: number; radiusMiles: number }[] {
    const GRID = 4;
    const OVERLAP = 1.2; // 20% overlap

    // Approximate degrees per mile
    const latDegPerMile = 1 / 69;
    const lngDegPerMile = 1 / (69 * Math.cos((latitude * Math.PI) / 180));

    const tileRadiusMiles = (radiusMiles / (GRID / 2)) * OVERLAP;
    const stepMiles = (radiusMiles * 2) / GRID;

    const stepLat = stepMiles * latDegPerMile;
    const stepLng = stepMiles * lngDegPerMile;

    const startLat = latitude - stepLat * ((GRID - 1) / 2);
    const startLng = longitude - stepLng * ((GRID - 1) / 2);

    const tiles: { latitude: number; longitude: number; radiusMiles: number }[] = [];

    // 4x4 interior grid
    for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
            tiles.push({
                latitude: startLat + row * stepLat,
                longitude: startLng + col * stepLng,
                radiusMiles: tileRadiusMiles,
            });
        }
    }

    // 8 perimeter tiles evenly spaced around the edge of the radius circle
    const RING_TILES = 8;
    const ringTileRadiusMiles = tileRadiusMiles * 0.75;

    for (let i = 0; i < RING_TILES; i++) {
        const angle = (i / RING_TILES) * 2 * Math.PI;
        const offsetLat = radiusMiles * Math.cos(angle) * latDegPerMile;
        const offsetLng = radiusMiles * Math.sin(angle) * lngDegPerMile;

        tiles.push({
            latitude: latitude + offsetLat,
            longitude: longitude + offsetLng,
            radiusMiles: ringTileRadiusMiles,
        });
    }

    return tiles;
}

export function milesToMeters(miles: number): number {
    return miles * 1609.34;
}

export function getDistanceMiles(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 3958.8; // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}