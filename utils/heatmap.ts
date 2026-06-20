import { Coordinate } from "@/types/geo";
import { SavedLocation, SavedLocationGroup, TargetLocation } from "@/types/location";
import { getDistanceMiles } from "@/utils/geo";

const DECAY_K = 0.5;
const CELL_SIZE_MILES = 0.25;
const MILES_PER_LAT_DEGREE = 69.0;

export interface ScoredCell {
    coordinate: Coordinate;
    score: number;
}

const PRIORITY_WEIGHTS: Record<string, number> = {
    daily: 7.0,
    weekly: 2.0,
    monthly: 1.0,
    rarely: 0.25,
};

function scoreGroup(cell: Coordinate, group: SavedLocationGroup, weight: number = 1.0): { weighted: number; weight: number } {
    if (group.locations.length === 0) return { weighted: 0, weight: 0 };

    const nearest = group.locations.reduce((min: number, loc: SavedLocation) => {
        const d = getDistanceMiles(cell.latitude, cell.longitude, loc.coordinate.latitude, loc.coordinate.longitude);
        return d < min ? d : min;
    }, Infinity);

    const groupScore = 100 * Math.exp(-DECAY_K * nearest);
    return { weighted: weight * groupScore, weight };
}

function scoreCell(cell: Coordinate, groups: SavedLocationGroup[]): number {
    if (groups.length === 0) return 0;

    let totalWeighted = 0;
    let totalWeight = 0;

    for (const group of groups) {
        const weight = PRIORITY_WEIGHTS[group.priority ?? 'medium'];
        const { weighted } = scoreGroup(cell, group, weight);
        totalWeighted += weighted;
        totalWeight += 1.0; // always 1.0 per group regardless of weight
    }

    return totalWeight === 0 ? 0 : totalWeighted / totalWeight;
}

function generateGrid(target: TargetLocation): Coordinate[] {
    const cells: Coordinate[] = [];
    const latDelta = CELL_SIZE_MILES / MILES_PER_LAT_DEGREE;
    const lngDelta = CELL_SIZE_MILES / (MILES_PER_LAT_DEGREE * Math.cos((target.latitude * Math.PI) / 180));

    const latSteps = Math.ceil((target.radiusMiles * 2) / CELL_SIZE_MILES);
    const lngSteps = Math.ceil((target.radiusMiles * 2) / CELL_SIZE_MILES);

    const startLat = target.latitude - (latSteps / 2) * latDelta;
    const startLng = target.longitude - (lngSteps / 2) * lngDelta;

    for (let i = 0; i < latSteps; i++) {
        for (let j = 0; j < lngSteps; j++) {
            const lat = startLat + i * latDelta;
            const lng = startLng + j * lngDelta;
            const d = getDistanceMiles(target.latitude, target.longitude, lat, lng);
            if (d <= target.radiusMiles) {
                cells.push({ latitude: lat, longitude: lng });
            }
        }
    }

    return cells;
}

export function scoreGrid(target: TargetLocation, groups: SavedLocationGroup[]): ScoredCell[] {
    const grid = generateGrid(target);
    const cells = grid.map((cell) => ({
        coordinate: cell,
        score: scoreCell(cell, groups),
    }));

    const max = Math.max(...cells.map((c) => c.score));
    if (max === 0) return cells;

    return cells.map((c) => ({ ...c, score: (c.score / max) * 100 }));
}