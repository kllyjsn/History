# School of History — Testing & Development

## Local Dev
```bash
npm install
npm run dev -- --port 5173
```
App runs at http://localhost:5173. Static frontend, no backend or database.

## Build & Lint
```bash
npm run build
npm run lint
npm run typecheck
```

## Stack
React 19, TypeScript, Vite, D3-geo (Natural Earth projection), TopoJSON, Tailwind CSS v4, Recharts, Framer Motion.

## UI Navigation Paths
- **Country panel**: Click any country on the map SVG, or search (header Search button or `/` key) and click a country result
- **Conflict details**: Click a conflict card in the country panel to expand it (shows perspectives, key figures, treaties, sources)
- **Trends dashboard**: Click "Trends" button in header nav
- **Compare mode**: Click "Compare" button in header nav
- **Map color modes**: Top-right panel has 4 buttons: Conflict Frequency, Active Conflicts, Peace Duration, By Region
- **Search**: Header "Search" button or press `/` — searches countries, conflicts, and tags
- **Timeline**: Bottom scrubber bar, play/pause button on left

## Data Architecture
- `src/data/conflicts.ts` — All conflicts with multiperspective accounts
- `src/data/countries.ts` — Country profiles with ISO 3-letter codes, historical names, regions
- `src/components/map/WorldMap.tsx` — ISO numeric-to-alpha3 mapping (line ~36-67). New countries MUST be added here too
- `src/hooks/useConflictData.ts` — Peace Index calculation, conflict counts, country stats
- `src/utils/formatters.ts` — getYearsAtWar, getLongestPeacePeriod (use inclusive year counting)

## Adding New Countries
When adding a new country, update THREE places:
1. `src/data/countries.ts` — Add country object with ISO 3-letter code, name, region, historicalNames
2. `src/components/map/WorldMap.tsx` — Add ISO numeric code to `ISO_NUMERIC_TO_ALPHA3` mapping
3. `src/data/conflicts.ts` — Add country's ISO code to relevant conflict `parties` arrays

## Data Validation
Check for duplicate conflict IDs:
```bash
grep "id: '" src/data/conflicts.ts | sed "s/.*id: '//;s/'.*//" | sort | uniq -d
```
Should return empty. Any output means duplicate IDs exist.

Count total conflicts:
```bash
grep -c "id: '" src/data/conflicts.ts
```

Check conflicts for a specific country (e.g., COD):
```bash
grep -B 20 "'COD'" src/data/conflicts.ts | grep "id:" | sort -u
```

## Common Pitfalls
- **Peace Index**: Uses `getEffectiveStartYear()` from country's independence or historicalNames. Do NOT hardcode 1500 as baseline for all countries.
- **Year counting**: `getYearsAtWar` counts inclusive years via Set. `yearsAtPeace` must use `currentYear - startYear + 1 - yearsAtWar` (note the +1).
- **Region mapping**: REGION_COLORS only maps Europe, Asia, Africa, Americas, Oceania. Do NOT use 'Middle East' as a region — use 'Asia' instead.
- **ISO mapping**: Every country in countries.ts must have a corresponding entry in WorldMap.tsx's ISO_NUMERIC_TO_ALPHA3 or it won't be clickable on the map.
- **Duplicate conflicts**: When adding new conflicts that overlap with existing ones (e.g., a combined "Congo Wars" alongside separate First/Second Congo War), remove the duplicate to avoid inflated statistics.
