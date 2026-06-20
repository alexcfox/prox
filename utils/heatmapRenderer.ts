import { TargetLocation } from "@/types/location";
import { ScoredCell } from "@/utils/heatmap";
import { Skia } from "@shopify/react-native-skia";

const CELL_SIZE_MILES = 0.25;
const MILES_PER_LAT_DEGREE = 69.0;

function scoreToRGBA(score: number): { r: number; g: number; b: number; a: number } {
    const t = score / 100;
    let r, g;
    if (t < 0.25) {
        r = 255;
        g = Math.round(255 * (t / 0.25));
    } else {
        r = Math.round(255 * ((1 - t) / 0.75));
        g = 255;
    }
    const a = t < 0.5 ? Math.round(255 * 0.08) : Math.round(255 * (0.12 + (t - 0.5) * 0.25));
    return { r, g, b: 0, a };
}

export function renderHeatmapToImage(
    cells: ScoredCell[],
    target: TargetLocation,
    width: number,
    height: number
): string | null {
    if (cells.length === 0) return null;

    const latDelta = CELL_SIZE_MILES / MILES_PER_LAT_DEGREE;
    const lngDelta = CELL_SIZE_MILES / (MILES_PER_LAT_DEGREE * Math.cos((target.latitude * Math.PI) / 180));

    const totalLatSpan = (target.radiusMiles * 2) / MILES_PER_LAT_DEGREE;
    const totalLngSpan = (target.radiusMiles * 2) / (MILES_PER_LAT_DEGREE * Math.cos((target.latitude * Math.PI) / 180));

    const minLat = target.latitude - totalLatSpan / 2;
    const minLng = target.longitude - totalLngSpan / 2;

const surface = Skia.Surface.Make(width, height);
if (!surface) return null;

const canvas = surface.getCanvas();
canvas.clear(Skia.Color('transparent'));

for (const cell of cells) {
    const { r, g, b, a } = scoreToRGBA(cell.score);

    const x = ((cell.coordinate.longitude - minLng) / totalLngSpan) * width;
    const y = height - ((cell.coordinate.latitude - minLat) / totalLatSpan) * height;

    const radius = ((lngDelta / totalLngSpan) * width) * 1.5;

    const paint = Skia.Paint();
    paint.setColor(Skia.Color(`rgba(${r},${g},${b},${(a / 255).toFixed(2)})`));

    const blur = Skia.MaskFilter.MakeBlur(0, radius * 0.6, true);
    paint.setMaskFilter(blur);

    canvas.drawCircle(x, y, radius, paint);
}


    const image = surface.makeImageSnapshot();
    const data = image.encodeToBase64();
    return `data:image/png;base64,${data}`;
}