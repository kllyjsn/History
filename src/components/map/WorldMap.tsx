import { useEffect, useRef, useState, useCallback, type FC } from 'react';
import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule10,
  select,
  zoom as d3zoom,
  type GeoPermissibleObjects,
  type ZoomBehavior,
} from 'd3';
import * as topojson from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { ColorMode } from '../../types';
import { getCountryColor } from '../../utils/colorScales';
import { countries } from '../../data/countries';
import MapTooltip from './MapTooltip';
import MapControls from './MapControls';

interface WorldMapProps {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  conflictCounts: Record<string, number>;
  activeCountries: Set<string>;
  peaceYears: Record<string, number>;
  onSelectCountry: (id: string) => void;
  selectedCountry: string | null;
}

interface CountryProperties {
  name: string;
}

type WorldTopology = Topology<{ countries: GeometryCollection<CountryProperties> }>;

const ISO_NUMERIC_TO_ALPHA3: Record<string, string> = {
  '004': 'AFG', '008': 'ALB', '012': 'DZA', '024': 'AGO', '031': 'AZE',
  '032': 'ARG', '036': 'AUS', '040': 'AUT', '050': 'BGD', '051': 'ARM',
  '056': 'BEL', '068': 'BOL',
  '076': 'BRA', '100': 'BGR', '104': 'MMR', '116': 'KHM', '120': 'CMR',
  '124': 'CAN', '144': 'LKA', '152': 'CHL', '156': 'CHN', '170': 'COL',
  '180': 'COD', '188': 'CRI', '191': 'HRV', '192': 'CUB', '196': 'CYP',
  '203': 'CZE', '208': 'DNK', '214': 'DOM', '218': 'ECU', '818': 'EGY',
  '222': 'SLV', '231': 'ETH', '232': 'ERI', '233': 'EST', '246': 'FIN', '250': 'FRA',
  '266': 'GAB', '268': 'GEO', '276': 'DEU', '288': 'GHA', '300': 'GRC',
  '320': 'GTM', '332': 'HTI', '340': 'HND', '348': 'HUN', '352': 'ISL',
  '356': 'IND', '360': 'IDN', '364': 'IRN', '368': 'IRQ', '372': 'IRL',
  '376': 'ISR', '380': 'ITA', '384': 'CIV', '388': 'JAM', '392': 'JPN',
  '398': 'KAZ', '400': 'JOR', '404': 'KEN', '408': 'PRK', '410': 'KOR',
  '414': 'KWT', '418': 'LAO', '422': 'LBN', '426': 'LSO', '428': 'LVA',
  '434': 'LBY', '440': 'LTU', '442': 'LUX', '450': 'MDG', '454': 'MWI',
  '458': 'MYS', '466': 'MLI', '478': 'MRT', '484': 'MEX', '496': 'MNG',
  '504': 'MAR', '508': 'MOZ', '512': 'OMN', '516': 'NAM', '524': 'NPL',
  '528': 'NLD', '540': 'NCL', '554': 'NZL', '558': 'NIC', '562': 'NER',
  '566': 'NGA', '578': 'NOR', '586': 'PAK', '591': 'PAN', '598': 'PNG',
  '600': 'PRY', '604': 'PER', '608': 'PHL', '616': 'POL', '620': 'PRT',
  '630': 'PRI', '634': 'QAT', '642': 'ROU', '643': 'RUS', '646': 'RWA',
  '682': 'SAU', '686': 'SEN', '688': 'SRB', '694': 'SLE', '702': 'SGP',
  '703': 'SVK', '704': 'VNM', '705': 'SVN', '706': 'SOM', '710': 'ZAF',
  '716': 'ZWE', '724': 'ESP', '728': 'SSD', '729': 'SDN', '740': 'SUR',
  '752': 'SWE', '756': 'CHE', '760': 'SYR', '762': 'TJK', '764': 'THA',
  '768': 'TGO', '780': 'TTO', '784': 'ARE', '788': 'TUN', '792': 'TUR',
  '795': 'TKM', '800': 'UGA', '804': 'UKR', '807': 'MKD', '826': 'GBR',
  '834': 'TZA', '840': 'USA', '854': 'BFA', '858': 'URY', '860': 'UZB',
  '862': 'VEN', '887': 'YEM', '894': 'ZMB', '275': 'PSE', '070': 'BIH',
  '108': 'BDI', '140': 'CAF', '148': 'TCD', '174': 'COM',
};

const WorldMap: FC<WorldMapProps> = ({
  colorMode,
  onColorModeChange,
  conflictCounts,
  activeCountries,
  peaceYears,
  onSelectCountry,
  selectedCountry,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const [topoData, setTopoData] = useState<FeatureCollection | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    iso: string;
    conflicts: number;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 500 });
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>(null);

  useEffect(() => {
    const updateSize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          setDimensions({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    import('world-atlas/countries-110m.json').then((data) => {
      const topology = data.default as unknown as WorldTopology;
      const features = topojson.feature(
        topology,
        topology.objects.countries,
      ) as FeatureCollection;
      setTopoData(features);
    });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svg = select(svgRef.current);
    const g = select(gRef.current);

    const zoomBehavior = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 12])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);
    zoomRef.current = zoomBehavior;
  }, [topoData]);

  const getIso3 = useCallback(
    (feature: Feature<Geometry, CountryProperties>): string => {
      const numericId = String(feature.id).padStart(3, '0');
      return ISO_NUMERIC_TO_ALPHA3[numericId] ?? '';
    },
    [],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, feature: Feature<Geometry, CountryProperties>) => {
      const iso = getIso3(feature);
      const name = countries[iso]?.name ?? feature.properties.name;
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        name,
        iso,
        conflicts: conflictCounts[iso] ?? 0,
      });
    },
    [getIso3, conflictCounts],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback(
    (feature: Feature<Geometry, CountryProperties>) => {
      const iso = getIso3(feature);
      if (iso && countries[iso]) {
        onSelectCountry(iso);
      }
    },
    [getIso3, onSelectCountry],
  );

  const projection = geoNaturalEarth1()
    .fitSize([dimensions.width, dimensions.height], topoData ?? { type: 'FeatureCollection', features: [] });
  const pathGen = geoPath().projection(projection);

  const graticule = geoGraticule10();
  const graticulePath = pathGen(graticule as GeoPermissibleObjects) ?? '';
  const sphere = { type: 'Sphere' as const };
  const spherePath = pathGen(sphere as GeoPermissibleObjects) ?? '';

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#0a0f1a' }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-grab active:cursor-grabbing"
      >
        <defs>
          <radialGradient id="ocean-gradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1a2332" />
            <stop offset="100%" stopColor="#0a0f1a" />
          </radialGradient>
        </defs>
        <rect width={dimensions.width} height={dimensions.height} fill="url(#ocean-gradient)" />
        <g ref={gRef}>
          <path d={spherePath} fill="none" stroke="#1e293b" strokeWidth={0.5} />
          <path d={graticulePath} fill="none" stroke="#1e293b" strokeWidth={0.15} strokeOpacity={0.4} />
          {topoData?.features.map((feature) => {
            const f = feature as Feature<Geometry, CountryProperties>;
            const iso = getIso3(f);
            const region = countries[iso]?.region ?? '';
            const fill = getCountryColor(
              colorMode,
              conflictCounts[iso] ?? 0,
              peaceYears[iso] ?? 0,
              region,
              activeCountries.has(iso),
            );
            const isSelected = selectedCountry === iso;
            const d = pathGen(f as GeoPermissibleObjects) ?? '';

            return (
              <path
                key={String(f.id)}
                d={d}
                fill={fill}
                stroke={isSelected ? '#f59e0b' : '#0f172a'}
                strokeWidth={isSelected ? 1.5 : 0.4}
                className="transition-colors duration-200 hover:brightness-125"
                style={{ cursor: countries[iso] ? 'pointer' : 'default' }}
                onMouseEnter={(e) => handleMouseEnter(e, f)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(f)}
              />
            );
          })}
        </g>
      </svg>

      <MapControls colorMode={colorMode} onColorModeChange={onColorModeChange} />

      {tooltip && (
        <MapTooltip
          x={tooltip.x}
          y={tooltip.y}
          name={tooltip.name}
          iso={tooltip.iso}
          conflicts={tooltip.conflicts}
          isActive={activeCountries.has(tooltip.iso)}
        />
      )}
    </div>
  );
};

export default WorldMap;
