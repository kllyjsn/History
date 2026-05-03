export interface Alliance {
  id: string;
  name: string;
  color: string;
  founded: number;
  dissolved: number | null;
  members: string[];
  description: string;
}

export const alliances: Alliance[] = [
  {
    id: 'nato',
    name: 'NATO',
    color: '#3b82f6',
    founded: 1949,
    dissolved: null,
    members: [
      'USA', 'GBR', 'FRA', 'DEU', 'ITA', 'CAN', 'NLD', 'BEL', 'LUX', 'NOR',
      'DNK', 'ISL', 'PRT', 'ESP', 'TUR', 'GRC', 'POL', 'CZE', 'HUN', 'BGR',
      'ROU', 'SVK', 'SVN', 'HRV', 'ALB', 'MNE', 'MKD', 'EST', 'LVA', 'LTU',
      'FIN', 'SWE',
    ],
    description: 'North Atlantic Treaty Organization — collective defense alliance founded 1949.',
  },
  {
    id: 'warsaw-pact',
    name: 'Warsaw Pact',
    color: '#ef4444',
    founded: 1955,
    dissolved: 1991,
    members: ['RUS', 'POL', 'DEU', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'ALB'],
    description: 'Treaty of Friendship, Cooperation and Mutual Assistance — Soviet-led military alliance (1955–1991).',
  },
  {
    id: 'eu',
    name: 'European Union',
    color: '#fbbf24',
    founded: 1993,
    dissolved: null,
    members: [
      'DEU', 'FRA', 'ITA', 'NLD', 'BEL', 'LUX', 'IRL', 'DNK', 'GRC', 'ESP',
      'PRT', 'AUT', 'FIN', 'SWE', 'POL', 'CZE', 'SVK', 'HUN', 'SVN', 'HRV',
      'EST', 'LVA', 'LTU', 'BGR', 'ROU', 'CYP', 'MLT',
    ],
    description: 'Political and economic union of European states.',
  },
  {
    id: 'african-union',
    name: 'African Union',
    color: '#22c55e',
    founded: 2002,
    dissolved: null,
    members: [
      'DZA', 'AGO', 'BEN', 'BWA', 'BFA', 'BDI', 'CMR', 'CPV', 'CAF', 'TCD',
      'COM', 'COD', 'COG', 'CIV', 'DJI', 'EGY', 'GNQ', 'ERI', 'SWZ', 'ETH',
      'GAB', 'GMB', 'GHA', 'GIN', 'GNB', 'KEN', 'LSO', 'LBR', 'LBY', 'MDG',
      'MWI', 'MLI', 'MRT', 'MUS', 'MOZ', 'NAM', 'NER', 'NGA', 'RWA', 'STP',
      'SEN', 'SYC', 'SLE', 'SOM', 'ZAF', 'SSD', 'SDN', 'TZA', 'TGO', 'TUN',
      'UGA', 'ZMB', 'ZWE',
    ],
    description: 'Continental union of 55 African member states.',
  },
  {
    id: 'five-eyes',
    name: 'Five Eyes',
    color: '#a855f7',
    founded: 1941,
    dissolved: null,
    members: ['USA', 'GBR', 'CAN', 'AUS', 'NZL'],
    description: 'Intelligence alliance between five English-speaking nations.',
  },
  {
    id: 'brics',
    name: 'BRICS',
    color: '#f97316',
    founded: 2009,
    dissolved: null,
    members: ['BRA', 'RUS', 'IND', 'CHN', 'ZAF', 'IRN', 'EGY', 'ETH', 'SAU', 'ARE'],
    description: 'Intergovernmental organization of major emerging economies.',
  },
  {
    id: 'asean',
    name: 'ASEAN',
    color: '#06b6d4',
    founded: 1967,
    dissolved: null,
    members: ['BRN', 'KHM', 'IDN', 'LAO', 'MYS', 'MMR', 'PHL', 'SGP', 'THA', 'VNM'],
    description: 'Association of Southeast Asian Nations — political and economic union.',
  },
];

export function getAlliancesForCountry(countryId: string, year?: number): Alliance[] {
  return alliances.filter((a) => {
    if (!a.members.includes(countryId)) return false;
    if (year !== undefined) {
      if (year < a.founded) return false;
      if (a.dissolved !== null && year > a.dissolved) return false;
    }
    return true;
  });
}
