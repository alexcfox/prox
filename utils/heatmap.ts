import zhviLatest from "@/assets/data/zhvi_latest.json";
import { Coordinate } from "@/types/geo";
import {
    SavedLocation,
    SavedLocationGroup,
    TargetLocation,
} from "@/types/location";
import { getDistanceMiles } from "@/utils/geo";
import { getZipForCoordinate } from "@/utils/zipLookup";

const DECAY_K = 0.5;
const CELL_SIZE_MILES = 0.25;
const MILES_PER_LAT_DEGREE = 69.0;

// Areas more than 20% over budget receive no score.
const BUDGET_TOLERANCE = 0.20;

export interface ScoredCell {
    coordinate: Coordinate;
    score: number;
}

const PRIORITY_WEIGHTS: Record<string, number> = {
    daily: 7,
    weekly: 2,
    monthly: 1,
    rarely: 0.25,
};

function scoreGroup(
    cell: Coordinate,
    group: SavedLocationGroup,
    weight: number
): { weighted: number; weight: number } {
    if (group.locations.length === 0) {
        return { weighted: 0, weight: 0 };
    }

    const nearest = group.locations.reduce(
        (minDistance: number, location: SavedLocation) => {
            const distance = getDistanceMiles(
                cell.latitude,
                cell.longitude,
                location.coordinate.latitude,
                location.coordinate.longitude
            );

            return Math.min(minDistance, distance);
        },
        Infinity
    );

    const groupScore = 100 * Math.exp(-DECAY_K * nearest);

    return {
        weighted: groupScore * weight,
        weight,
    };
}

function scoreCell(
    cell: Coordinate,
    groups: SavedLocationGroup[]
): number {
    // No saved places means location preferences are neutral.
    if (groups.length === 0) {
        return 100;
    }

    let totalWeighted = 0;
    let totalWeight = 0;

    for (const group of groups) {
        const weight =
            PRIORITY_WEIGHTS[group.priority] ?? 1;

        const { weighted } = scoreGroup(
            cell,
            group,
            weight
        );

        totalWeighted += weighted;
        totalWeight += weight;
    }

    return totalWeight === 0
        ? 100
        : totalWeighted / totalWeight;
}

function scoreBudget(
    cell: Coordinate,
    maxBudget?: number
): number {
    // No budget set
    if (!maxBudget) return 1;

    const zip = getZipForCoordinate(
        cell.latitude,
        cell.longitude
    );

    // No ZIP found
    if (!zip) return 1;

    const price =
        (zhviLatest as Record<string, number>)[zip];

    // No ZHVI data
    if (price === undefined) return 1;

    // Within budget
    if (price <= maxBudget) return 1;

    const maxPrice =
        maxBudget * (1 + BUDGET_TOLERANCE);

    // Too expensive
    if (price >= maxPrice) {
        return 0;
    }

    // Linearly fade from 1 → 0 over the tolerance range.
    return (
        (maxPrice - price) /
        (maxPrice - maxBudget)
    );
}

function generateGrid(
    target: TargetLocation
): Coordinate[] {
    const cells: Coordinate[] = [];

    const latDelta =
        CELL_SIZE_MILES / MILES_PER_LAT_DEGREE;

    const lngDelta =
        CELL_SIZE_MILES /
        (MILES_PER_LAT_DEGREE *
            Math.cos((target.latitude * Math.PI) / 180));

    const latSteps = Math.ceil(
        (target.radiusMiles * 2) / CELL_SIZE_MILES
    );

    const lngSteps = Math.ceil(
        (target.radiusMiles * 2) / CELL_SIZE_MILES
    );

    const startLat =
        target.latitude - (latSteps / 2) * latDelta;

    const startLng =
        target.longitude - (lngSteps / 2) * lngDelta;

    for (let i = 0; i < latSteps; i++) {
        for (let j = 0; j < lngSteps; j++) {
            const latitude = startLat + i * latDelta;
            const longitude = startLng + j * lngDelta;

            const distance = getDistanceMiles(
                target.latitude,
                target.longitude,
                latitude,
                longitude
            );

            if (distance <= target.radiusMiles) {
                cells.push({
                    latitude,
                    longitude,
                });
            }
        }
    }

    return cells;
}

export function scoreGrid(
    target: TargetLocation,
    groups: SavedLocationGroup[],
    maxBudget?: number
): ScoredCell[] {
    const grid = generateGrid(target);

    const cells = grid.map((cell) => {
        const placeScore = scoreCell(cell, groups);
        const budgetMultiplier = scoreBudget(
            cell,
            maxBudget
        );

        return {
            coordinate: cell,
            score: placeScore * budgetMultiplier,
        };
    });

    const max = Math.max(...cells.map((c) => c.score));

    if (max <= 0) {
        return cells;
    }

    return cells.map((cell) => ({
        ...cell,
        score: (cell.score / max) * 100,
    }));
}