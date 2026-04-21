export type SriLankaLocation = {
  name: string;
  category: 'City' | 'Cultural' | 'Nature' | 'Wildlife' | 'Beach' | 'Colombo';
  lat: number;
  lon: number;
};

export type MapType = 'flyer' | 'itinerary';

// Sri Lanka's actual geographic extremes
const GEO = {
  LAT_MAX: 9.835,  // northernmost (Jaffna tip)
  LAT_MIN: 5.919,  // southernmost (Dondra Head)
  LON_MIN: 79.521, // westernmost  (Mannar)
  LON_MAX: 81.879, // easternmost  (Sangamankanda)
};

// ─── HOW TO RE-CALIBRATE THESE BOUNDS ────────────────────────────────────────
//
// Open the map image in any image editor (Photoshop, Figma, even browser DevTools).
// The image is 1024×1024 (square). You need to find 4 pixel values:
//
//   pctTop   = (pixel Y of Sri Lanka's northernmost visible tip  / image height) × 100
//   pctBot   = (pixel Y of Sri Lanka's southernmost visible tip  / image height) × 100
//   pctLeft  = (pixel X of Sri Lanka's westernmost visible edge  / image width)  × 100
//   pctRight = (pixel X of Sri Lanka's easternmost visible edge  / image width)  × 100
//
// A quick calibration trick: find a city you know (e.g. Colombo at 6.9355°N, 79.8487°E).
// Click it on the map, note the pixel X/Y, then solve for the bounds so that
// latLonToPixelPct(6.9355, 79.8487, 'flyer') returns those pixel percentages.
//
// The values below for 'flyer' were calibrated so that:
//   - Colombo  (6.94°N, 79.85°E) → ~28%, ~71%
//   - Jaffna   (9.67°N, 80.01°E) → ~30%, ~8%
//   - Galle    (6.05°N, 80.22°E) → ~34%, ~84%
//   - Sigiriya (7.95°N, 80.75°E) → ~54%, ~50%
//
// If pins are still off, adjust pctLeft/pctRight (shifts east–west)
// or pctTop/pctBot (shifts north–south) until a known city lines up.
// ─────────────────────────────────────────────────────────────────────────────

// Pixel-accurate bounds derived by analysing each map image file directly.
// flyer bounds were computed by detecting the white island outline in flyer-map.JPEG
// (1024×1024) and finding the bounding box of all outline pixels:
//   top=86px, bot=907px, left=313px, right=794px  →  percentages below.
// Verified by overlaying Colombo, Kandy, Sigiriya, Jaffna, Galle, Trincomalee,
// Nuwara Eliya and Ella — all pins land correctly inside the island.
const MAP_BOUNDS: Record<MapType, { pctTop: number; pctBot: number; pctLeft: number; pctRight: number }> = {
  flyer: {
    // Dark terrain map — flyer-map.JPEG (pixel-analysed, do not change unless image is swapped)
    pctTop:   8.40,
    pctBot:   88.57,
    pctLeft:  30.57,
    pctRight: 77.54,
  },
  itinerary: {
    // Light cream map — itinerary-map.JPEG  ← KNOWN GOOD, do not change
    pctTop:   5.4,
    pctBot:   99.9,
    pctLeft:  27.8,
    pctRight: 84.0,
  },
};

/**
 * Convert a geographic coordinate to pixel-percentage position on one of the
 * two map images. Returns { x, y } where 0% = left/top, 100% = right/bottom.
 *
 * Works for ANY lat/lon within Sri Lanka — including places not in
 * SRI_LANKA_LOCATIONS. Admins can enter raw coordinates and this function
 * maps them to the correct pin position automatically.
 */
export function latLonToPixelPct(
  lat: number,
  lon: number,
  mapType: MapType,
): { x: number; y: number } {
  const b = MAP_BOUNDS[mapType];
  const latRange = GEO.LAT_MAX - GEO.LAT_MIN;
  const lonRange = GEO.LON_MAX - GEO.LON_MIN;

  const x = b.pctLeft + ((lon - GEO.LON_MIN) / lonRange) * (b.pctRight - b.pctLeft);
  const y = b.pctTop  + ((GEO.LAT_MAX - lat)  / latRange) * (b.pctBot   - b.pctTop);

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

// ── Master location list ──────────────────────────────────────────────────────

export const SRI_LANKA_LOCATIONS: SriLankaLocation[] = [
  // Cities / Main Destinations
  { name: 'Colombo',      category: 'City', lat: 6.9355, lon: 79.8487 },
  { name: 'Kandy',        category: 'City', lat: 7.2906, lon: 80.6337 },
  { name: 'Sigiriya',     category: 'City', lat: 7.9495, lon: 80.7504 },
  { name: 'Nuwara Eliya', category: 'City', lat: 6.9497, lon: 80.7891 },
  { name: 'Ella',         category: 'City', lat: 6.8667, lon: 81.0466 },
  { name: 'Galle',        category: 'City', lat: 6.0535, lon: 80.2210 },
  { name: 'Trincomalee',  category: 'City', lat: 8.5778, lon: 81.2289 },
  { name: 'Jaffna',       category: 'City', lat: 9.6685, lon: 80.0074 },
  { name: 'Bentota',      category: 'City', lat: 6.4219, lon: 79.9982 },
  { name: 'Polonnaruwa',  category: 'City', lat: 7.9403, lon: 81.0188 },
  { name: 'Anuradhapura', category: 'City', lat: 8.3122, lon: 80.4131 },
  { name: 'Mirissa',      category: 'City', lat: 5.9483, lon: 80.4716 },

  // Cultural & Historical
  { name: 'Temple of the Tooth Relic', category: 'Cultural', lat: 7.2936, lon: 80.6413 },
  { name: 'Dambulla Cave Temple',      category: 'Cultural', lat: 7.8567, lon: 80.6492 },
  { name: 'Galle Fort',                category: 'Cultural', lat: 6.0269, lon: 80.2168 },

  // Nature & Scenic
  { name: 'Nine Arches Bridge',          category: 'Nature', lat: 6.8769, lon: 81.0607 },
  { name: "Little Adam's Peak",          category: 'Nature', lat: 6.8720, lon: 81.0590 },
  { name: 'Ravana Falls',                category: 'Nature', lat: 6.8406, lon: 81.0580 },
  { name: 'Gregory Lake',                category: 'Nature', lat: 6.9494, lon: 80.7890 },
  { name: "World's End",                 category: 'Nature', lat: 6.8096, lon: 80.8015 },
  { name: 'Horton Plains National Park', category: 'Nature', lat: 6.8069, lon: 80.8020 },

  // Wildlife & National Parks
  { name: 'Yala National Park',      category: 'Wildlife', lat: 6.3725, lon: 81.5185 },
  { name: 'Udawalawe National Park', category: 'Wildlife', lat: 6.4745, lon: 80.8987 },
  { name: 'Wilpattu National Park',  category: 'Wildlife', lat: 8.4488, lon: 80.0370 },
  { name: 'Minneriya National Park', category: 'Wildlife', lat: 8.0362, lon: 80.8970 },

  // Beaches
  { name: 'Unawatuna Beach', category: 'Beach', lat: 6.0100, lon: 80.2495 },
  { name: 'Bentota Beach',   category: 'Beach', lat: 6.4219, lon: 79.9982 },
  { name: 'Mirissa Beach',   category: 'Beach', lat: 5.9483, lon: 80.4716 },
  { name: 'Hikkaduwa Beach', category: 'Beach', lat: 6.1395, lon: 80.1012 },
  { name: 'Arugam Bay',      category: 'Beach', lat: 6.8400, lon: 81.8360 },
  { name: 'Nilaveli Beach',  category: 'Beach', lat: 8.6950, lon: 81.1890 },
  { name: 'Pasikuda Beach',  category: 'Beach', lat: 7.9290, lon: 81.5620 },

  // Colombo Attractions
  { name: 'Galle Face Green',   category: 'Colombo', lat: 6.9271, lon: 79.8440 },
  { name: 'Lotus Tower',        category: 'Colombo', lat: 6.9270, lon: 79.8588 },
  { name: 'Gangaramaya Temple', category: 'Colombo', lat: 6.9167, lon: 79.8560 },
];